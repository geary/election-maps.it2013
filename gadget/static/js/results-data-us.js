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
		var places = results.places;
		var counted = 0, total = 0;
		for( var i = 0, n = places.length;  i < n;  ++i ) {
			var place = places[i];
			counted += place.counted;
			total += place.precincts;
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
		if( result == -1 ) {
			var votes = 0, candidates = [];
			_(results.candidates).each( function( candidate ) {
				votes += candidate.votes;
				candidates.push( candidate );
			});
			result = { candidates: candidates, votes: votes };
		}
		var top = result.candidates.slice();
		for( var i = 0, n = top.length;  i < top.length;  ++i ) {
			var candidate = top[i], votes = candidate.votes;
			candidate.vsAll = votes / result.votes;
			//candidate.delegates = getCandidateDelegates( result.state || stateUS, candidate );
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
	
	//function getCandidateDelegates( state, candidate ) {
	//	var delegates = stateUS.delegates;
	//	if( ! delegates ) return 0;
	//	var iCol = delegates.colsById[ 'TabCount-' + candidate.id ];
	//	var row =
	//		state == stateUS ? delegates.totals :
	//		delegates.places[state.abbr];
	//	return row ? row[iCol] : 0;
	//}
	
	function mayHaveResults( result ) {
		return result && (
			result.votes > 0  ||
			result.counted < result.precincts
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
			electionids.byStateContest( state.abbr, params.contest );
			//params.contest == 'house' ? null :  // TODO
			//state.electionidPrimary;
		if( ! electionid ) {
			loadTestResults( state.fips, false );
			return;
		}
		//if( state == stateUS  &&  view == 'county' )
		//	electionid = state.electionidPrimaryCounties;
		
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
			//state == stateUS ?
			//	[ id, stateUS.electionidPrimaryDelegates ] :
				[ id ]
		);
	}
	
	var electionLoading, electionsPending = [];
	function getElections( electionids ) {
		electionLoading = electionids[0];
		electionsPending = [].concat( electionids );
		_.each( electionids, function( electionid ) {
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
		delete params.randomize;
		
		var col = [];
		_.each( election.candidates, function( candidate ) {
			if( candidate.skip ) return;
			col.push( 'TabCount-' + candidate.id );
		});
		col = col.concat(
			'ID',
			'TabTotal',
			'NumBallotBoxes',
			'NumCountedBallotBoxes'
		);
		indexArray( col );
		
		var kind =
			params.contest == 'house' ? 'house' :
			state.votesby || 'county';
		var isDelegates = ( electionid == state.electionidPrimaryDelegates );  // TEMP
		if( state == stateUS  &&  view == 'county'  &&  ! isDelegates ) kind = 'county';  // TEMP
		if( kind == 'town'  ||  kind == 'district' ) kind = 'county';  // TEMP
		var rows = _.map( state.geo[kind].features, function( feature ) {
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
	
	// Hack for featureResult, not localized
	var lsadSuffixes = {
		city: ' City',
		county: ' County'
	};
	
	function featureResult( results, feature ) {
		if( !( results && feature ) ) return null;
		var id = feature.id, fips = feature.fips, state = feature.state;
		//var state = fips.length == 2  &&  states.by.fips[fips];  // TEMP
		//var abbr = state && state.abbr;  // TEMP
		//feature.state = state || states.by.fips[ fips.slice(0,2) ];
		return (
			results.places[ id ] ||
			results.places[ fips ] ||
			results.places[ state.abbr ] ||  // TEMP
			results.places[ feature.name ]  ||
			results.places[ feature.name + (
				lsadSuffixes[ ( feature.lsad || '' ).toLowerCase() ]
				|| ''
			) ]
		);
	}
	
	function fixShortFIPS( col, rows ) {
		_.each( rows, function( row ) {
			var id = row[col];
			if( /^\d\d\d\d$/.test(id) ) row[col] = '0' + id;
		});
	}
	
	function isCountyTEMP( json ) {
		try {
			var table = json.table, cols = table.cols, rows = table.rows;
			var col = indexArray( cols )['ID'];
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
		//var counties = isCountyTEMP( json );
		if( loading )
			cacheResults.add( json.electionid, json, opt.resultCacheTime );
		
		var eid = electionids[json.electionid];
		if( ! eid ) {
			window.console && console.log( 'No election ID ' + json.electionid );
			return;
		}
		var state = State( eid.state );
		var results = json.table;
/*
		var isDelegates = ( json.electionid == state.electionidPrimaryDelegates );
		if( isDelegates )
			state.delegates = results;
		else if( state == stateUS  &&  view == 'county' )
			state.resultsCounty = results;
		else
*/
		if( params.contest == 'house' )
			state.resultsHouse = results;  // TODO
		else
			state.results = results;
		results.mode = json.mode;
		var zero = ( json.mode == 'test'  &&  ! debug );
		
		var cols = results.cols;
		indexArray( cols );
		var colsID = cols.ID, nCandidates = colsID / 4;
		
		//var candidates = results.candidates = [];
		//for( var i = 0, colID = col.ID;  i < colID;  ++i ) {
		//	var id = cols[i].split('-')[1].toLowerCase(), candidate = election.candidates.by.id[id];
		//	candidates.push( $.extend( {}, candidate ) );
		//}
		//indexArray( candidates, 'id' );
		
		var fix = state.fix || {};
		
		var kind =
			params.contest == 'house' ? 'house' :
			state.votesby || 'county';
		//if( state == stateUS  &&  view == 'county'  &&  ! isDelegates ) kind = 'county';  // TEMP
		if( kind == 'town'  ||  kind == 'district' ) kind = 'county';  // TEMP
		var features = state.geo[kind].features;
		
		var parties = election.parties;
		var missing = [];
		var rows = results.rows;
		var places = results.places = {};
		var allCandidates = results.candidates = {};
		for( var iRow = 0, nRows = rows.length;  iRow < nRows;  ++iRow ) {
			var row = rows[iRow];
			var id = row[colsID];
			id = fix[id] || id;
			var votes = row[cols.TabTotal];
			var precincts = row[cols.NumBallotBoxes];
			var counted = row[cols.NumCountedBallotBoxes];
			var winner = row[cols.Winner];
			if( state.geo ) {
				var feature = features.by[id];
				if( ! feature ) {
					var ok = missingOK[state.abbr];
					if( !( ok  &&  id in ok ) )
						if( ! features.didMissingCheck )
							missing.push( id );
				}
			}
			
			//if( /^\d\d000$/.test(id) ) rowsByID[id.slice(0,2)] = row;
			//var nCandidates = candidates.length;
			var totalVotes = 0, maxVotes = 0,  iMaxVotes = -1;
			//if( zero ) {
			//	for( iCol = -1;  ++iCol < nCandidates; ) {
			//		row[iCol] = 0;
			//	}
			//	row[col.TabTotal] = 0;
			//	totals[col.NumBallotBoxes] += row[col.NumBallotBoxes];
			//	row[col.NumCountedBallotBoxes] = 0;
			//}
			//else {
				var candidates = [];
				for( iCol = 0;  iCol < colsID;  iCol += 4 ) {
					var party = row[iCol+3];
					if( ! party ) break;
					if( ! parties[party] ) {
						params.debug && window.console && console.log( party );
						parties[party] = { color: '#808080' };
					}
					var firstName = row[iCol+1], lastName = row[iCol+2];
					var id = firstName + ' ' + lastName, votes = row[iCol];
					var candidate = {
						id: id,
						votes: votes,
						firstName: firstName,
						lastName: lastName,
						party: party
					};
					if( ! allCandidates[id] ) {
						allCandidates[id] = {
							id: id,
							votes: 0,
							firstName: firstName,
							lastName: lastName,
							party: party
						};
					}
					allCandidates[id].votes += votes;
					//totals[iCol] += count;
					totalVotes += votes;
					if( maxVotes < votes ) {
						maxVotes = votes;
						iMaxVotes = candidates.length;
					}
					candidates.push( candidate );
				}
				var result = {
					id: row[colsID],
					precincts: row[cols.NumBallotBoxes],
					counted: row[cols.NumCountedBallotBoxes],
					votes: totalVotes,
					//winner: /* needs to be calculated */,
					candidates: candidates,
					iMaxVotes: iMaxVotes
				};
				places[result.id] = result;
				
				//totals[col.TabTotal] += row[col.TabTotal];
				//totals[col.NumBallotBoxes] += row[col.NumBallotBoxes];
				//totals[col.NumCountedBallotBoxes] += row[col.NumCountedBallotBoxes];
			//}
			//row.candidateMax = candidateMax;
		}
		results.oldtemp = { cols: results.cols, rows: results.rows };  // TEMP debugging
		delete results.cols;
		delete results.rows;
		features.didMissingCheck = true;
		
		if( electionsPending.length == 0 )
			geoReady();
		
		if( missing.length  &&  debug  &&  debug != 'quiet' ) {
			alert( S( 'Missing locations:\n', missing.sort().join( '\n' ) ) );
		}
	}
	
