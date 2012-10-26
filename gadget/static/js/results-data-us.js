// results-data-us.js
// By Michael Geary - http://mg.to/
// See UNLICENSE or http://unlicense.org/ for public domain notice.

	function getSeats( race, seat ) {
		if( ! race ) return null;
		if( seat == 'One' ) seat = '1';
		if( race[seat] ) return [ race[seat] ];
		if( race['NV'] ) return [ race['NV'] ];
		if( race['2006'] && race['2008'] ) return [ race['2006'], race['2008'] ];
		return null;
	}
	
	function totalReporting( results ) {
		var col = results.colsById;
		var rows = results.rows;
		var counted = 0, total = 0;
		for( var row, i = -1;  row = rows[++i]; ) {
			counted += row[col.NumCountedBallotBoxes];
			total += row[col.NumBallotBoxes];
		}
		return {
			counted: counted,
			total: total,
			percent: formatPercent( counted / total ),
			kind: ''  // TODO
		};
	}
	
	function getTopCandidates( results, result, sortBy, max ) {
		max = max || Infinity;
		if( ! result ) return [];
		if( result == -1 ) result = results.totals;
		var col = results.colsById;
		var top = results.candidates.slice();
		for( var i = -1;  ++i < top.length; ) {
			var candidate = top[i], votes = result[i];
			candidate.votes = votes;
			candidate.vsAll = votes / result[col.TabTotal];
			candidate.delegates = getCandidateDelegates( result.state || stateUS, candidate );
			//candidate.total = total;
		}
		top = sortArrayBy( top, sortBy, { numeric:true } )
			.reverse()
			.slice( 0, max );
		while( top.length  &&  ! top[top.length-1].votes )
			top.pop();
		if( top.length ) {
			var most = top[0].votes;
			for( var i = -1;  ++i < top.length; ) {
				var candidate = top[i];
				candidate.vsTop = candidate.votes / most;
			}
		}
		return top;
	}
	
	function getCandidateDelegates( state, candidate ) {
		var delegates = stateUS.delegates;
		if( ! delegates ) return 0;
		var iCol = delegates.colsById[ 'TabCount-' + candidate.id ];
		var row =
			state == stateUS ? delegates.totals :
			delegates.rowsByID[state.abbr];
		return row ? row[iCol] : 0;
	}
	
	function mayHaveResults( row, col ) {
		return(
			row[col.TabTotal] > 0  ||
			row[col.NumCountedBallotBoxes] < row[col.NumBallotBoxes]
		);
	}
	
	function getLeaders( locals ) {
		var leaders = {};
		for( var localname in locals ) {
			var votes = locals[localname].votes[0];
			if( votes ) leaders[votes.name] = true;
		}
		return leaders;
	}
	
	// Separate for speed
	function getLeadersN( locals, n ) {
		var leaders = {};
		for( var localname in locals ) {
			for( var i = 0;  i < n;  ++i ) {
				var votes = locals[localname].votes[i];
				if( votes ) leaders[votes.name] = true;
			}
		}
		return leaders;
	}
	
	var cacheResults = new Cache;
	
	function getResults() {
		var electionid =
			params.contest == 'house' ? null :  // TODO
			state.electionidPrimary;
		if( ! electionid ) {
			loadTestResults( state.fips, false );
			return;
		}
		if( state == stateUS  &&  view == 'county' )
			electionid = state.electionidPrimaryCounties;
		
		//if( electionid == 'random' ) {
		//	opt.randomized = params.randomize = true;
		//	electionid += state.fips;
		//}
		
		var results =
			( state != stateUS  ||  cacheResults.get( stateUS.electionidPrimaryDelegates ) )  &&
			cacheResults.get( electionid );
		if( results ) {
			loadResultTable( results, false );
			return;
		}
		
		if( params.zero ) delete params.randomize;
		if( params.randomize || params.zero ) {
			loadTestResults( electionid, params.randomize );
			return;
		}
		
		var e = electionid.split( '|' );
		var id = params.source == 'gop' ? e[1] : e[0];
		
		getElections(
			state == stateUS ?
				[ id, stateUS.electionidPrimaryDelegates ] :
				[ id ]
		);
	}
	
	var electionLoading, electionsPending = [];
	function getElections( electionids ) {
		electionLoading = electionids[0];
		electionsPending = [].concat( electionids );
		electionids.forEach( function( electionid ) {
			var url = S(
				'https://pollinglocation.googleapis.com/results?',
				'electionid=', electionid,
				'&_=', Math.floor( now() / opt.resultCacheTime )
			);
			getScript( url );
		});
	}
	
	function loadTestResults( electionid, randomize ) {
		var random = randomize ? randomInt : function() { return 0; };
		opt.resultCacheTime = Infinity;
		opt.reloadTime = false;
		clearInterval( reloadTimer );
		reloadTimer = null;
		delete params.randomize;
		
		var col = [];
		election.candidates.forEach( function( candidate ) {
			if( candidate.skip ) return;
			col.push( 'TabCount-' + candidate.id );
		});
		col = col.concat(
			'ID',
			'TabTotal',
			'NumBallotBoxes',
			'NumCountedBallotBoxes'
		);
		col.index();
		
		var kind =
			params.contest == 'house' ? 'house' :
			state.votesby || 'county';
		var isDelegates = ( electionid == state.electionidPrimaryDelegates );  // TEMP
		if( state == stateUS  &&  view == 'county'  &&  ! isDelegates ) kind = 'county';  // TEMP
		if( kind == 'town'  ||  kind == 'district' ) kind = 'county';  // TEMP
		var rows = state.geo[kind].features.map( function( feature ) {
			var row = [];
			row[col.ID] = feature.id;
			var nVoters = 0;
			var nPrecincts = row[col.NumBallotBoxes] = random( 50 ) + 5;
			var nCounted = row[col.NumCountedBallotBoxes] =
				Math.max( 0,
					Math.min( nPrecincts,
						random( nPrecincts * 2 ) -
						Math.floor( nPrecincts / 2 )
					)
				);
			var total = 0;
			for( iCol = -1;  ++iCol < col.ID; )
				total += row[iCol] = nCounted ? random(100000) : 0;
			row[col.TabTotal] = total + random(total*2);
			return row;
		});
		
		var json = {
			electionid: electionid,
			mode: 'test',
			table: {
				cols: col,
				rows: rows
			}
		};
		
		loadResultTable( json, true );
	}
	
	loadResults = function( json, electionid, mode ) {
		deleteFromArray( electionsPending, electionid );
		json.electionid = '' + electionid;
		json.mode = mode;
		loadResultTable( json, true );
	};
	
	// Hack for featureResults, not localized
	var lsadSuffixes = {
		city: ' City',
		county: ' County'
	};
	
	function featureResults( results, feature ) {
		if( !( results && feature ) ) return null;
		var id = feature.id, fips = feature.fips, state = feature.state;
		//var state = fips.length == 2  &&  states.by.fips[fips];  // TEMP
		//var abbr = state && state.abbr;  // TEMP
		//feature.state = state || states.by.fips[ fips.slice(0,2) ];
		return (
			results.rowsByID[ id ] ||
			results.rowsByID[ fips ] ||
			results.rowsByID[ state.abbr ] ||  // TEMP
			results.rowsByID[ feature.name ]  ||
			results.rowsByID[ feature.name + (
				lsadSuffixes[ ( feature.lsad || '' ).toLowerCase() ]
				|| ''
			) ]
		);
	}
	
	function fixShortFIPS( col, rows ) {
		rows.forEach( function( row ) {
			var id = row[col];
			if( /^\d\d\d\d$/.test(id) ) row[col] = '0' + id;
		});
	}
	
	function isCountyTEMP( json ) {
		try {
			var table = json.table, cols = table.cols, rows = table.rows;
			var col = cols.index()['ID'];
			var id = rows[0][col];
			/*if( /^\d\d\d\d$/.test(id) )*/ fixShortFIPS( col, rows );
			return ! /^[A-Z][A-Z]$/.test(id);
		}
		catch( e ) {
			return false;
		}
	}
	
	var missingOK = {
		US: { AS:1, GU:1, MP:1, PR:1, VI:1 }
	};
	
	function loadResultTable( json, loading ) {
		var counties = isCountyTEMP( json );
		if( loading )
			cacheResults.add( json.electionid, json, opt.resultCacheTime );
		
		var state = State( json.electionid );
		var results = json.table;
		var isDelegates = ( json.electionid == state.electionidPrimaryDelegates );
		if( isDelegates )
			state.delegates = results;
		else if( state == stateUS  &&  view == 'county' )
			state.resultsCounty = results;
		else if( params.contest == 'house' )
			state.resultsHouse = results;  // TODO
		else
			state.results = results;
		results.mode = json.mode;
		var zero = ( json.mode == 'test'  &&  ! debug );
		
		var col = results.colsById = {};
		col.candidates = 0;
		var cols = results.cols;
		var totals = results.totals = [];
		for( var id, iCol = -1;  id = cols[++iCol]; ) {
			col[id] = iCol;
			totals.push( 0 );
		}
		
		var candidates = results.candidates = [];
		for( var i = 0, colID = col.ID;  i < colID;  ++i ) {
			var id = cols[i].split('-')[1].toLowerCase(), candidate = election.candidates.by.id[id];
			candidates.push( $.extend( {}, candidate ) );
		}
		candidates.index('id');
		
		var fix = state.fix || {};
		
		var kind =
			params.contest == 'house' ? 'house' :
			state.votesby || 'county';
		if( state == stateUS  &&  view == 'county'  &&  ! isDelegates ) kind = 'county';  // TEMP
		if( kind == 'town'  ||  kind == 'district' ) kind = 'county';  // TEMP
		var features = state.geo[kind].features;
		
		var missing = [];
		var rowsByID = results.rowsByID = {};
		var rows = results.rows;
		for( var row, iRow = -1;  row = rows[++iRow]; ) {
			var id = row[col.ID];
			var fixed = fix[id];
			if( fixed ) {
				id = row[col.ID] = fixed;
			}
			if( state.geo ) {
				var feature = features.by[id];
				if( ! feature ) {
					var ok = missingOK[state.abbr];
					if( !( ok  &&  id in ok ) )
						if( ! features.didMissingCheck )
							missing.push( id );
				}
			}
			rowsByID[id] = row;
			if( /^\d\d000$/.test(id) ) rowsByID[id.slice(0,2)] = row;
			var nCandidates = candidates.length;
			var max = 0,  candidateMax = -1;
			if( zero ) {
				for( iCol = -1;  ++iCol < nCandidates; ) {
					row[iCol] = 0;
				}
				row[col.TabTotal] = 0;
				totals[col.NumBallotBoxes] += row[col.NumBallotBoxes];
				row[col.NumCountedBallotBoxes] = 0;
			}
			else {
				for( iCol = -1;  ++iCol < nCandidates; ) {
					var count = row[iCol];
					totals[iCol] += count;
					if( count > max ) {
						max = count;
						candidateMax = iCol;
					}
				}
				totals[col.TabTotal] += row[col.TabTotal];
				totals[col.NumBallotBoxes] += row[col.NumBallotBoxes];
				totals[col.NumCountedBallotBoxes] += row[col.NumCountedBallotBoxes];
			}
			row.candidateMax = candidateMax;
		}
		features.didMissingCheck = true;
		
		if( electionsPending.length == 0 )
			geoReady();
		
		if( missing.length  &&  debug  &&  debug != 'quiet' ) {
			alert( S( 'Missing locations:\n', missing.sort().join( '\n' ) ) );
		}
	}
	
