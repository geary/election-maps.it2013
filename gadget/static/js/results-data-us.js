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
		for( var name in places ) {
			var place = places[name];
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
			_.each( results.candidates, function( candidate ) {
				votes += candidate.votes;
				candidates.push( candidate );
			});
			result = { candidates: candidates, votes: votes };
		}
		var top = result.candidates.slice();
		_.each( top, function( candidate, i ) {
			candidate.vsAll = candidate.votes / result.votes;
			if( sortBy == 'electoralVotes' ) {
				candidate.electoralVotes =
					getCandidateElectoralVotes( result.id, candidate );
			}
			//candidate.total = total;
		});
		var sorter = sortBy;
		if( sortBy != 'votes' ) {
			sorter = function( candidate ) {
				return candidate.votes + ( candidate[sortBy] * 1000000000 );
			};
		}
		top = sortArrayBy( top, sorter, { numeric:true } );
		top = top.reverse().slice( 0, max );
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
	
	function getCandidateElectoralVotes( stateName, candidate ) {
		if( stateName ) {
			var parties = trends.states[stateName].parties;
			if( ! parties.by ) indexArray( parties, 'id' );
			var party = parties.by.id[candidate.party];
			return party && party.ev || 0;
		}
		else {
			var party = trends.president.parties.by.id[candidate.party];
			return party ? party.electoralVote : 0;
		}
	}
	
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
	
	var resultsTimer = {};
	
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
			gotResultsTable( electionid );
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
				[ id, electionids.byStateContest( 'US', 'trends' ) ] :
				[ id ]
		);
	}
	
	var electionLoading, electionsPending = [];
	function getElections( electionids ) {
		electionLoading = electionids[0];
		electionsPending = [].concat( electionids );
		_.each( electionids, function( electionid ) {
			resultsTimer[electionid] = { start: now() };
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
		
		loadResultTable( json );
	}
	
	loadResults = function( json, electionid, mode ) {
		deleteFromArray( electionsPending, electionid );
		json.electionid = '' + electionid;
		json.mode = mode;
		loadResultTable( json );
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
	
	function loadResultTable( json ) {
		resultsTimer[json.electionid].fetch = now();
		//var counties = isCountyTEMP( json );
		cacheResults.add( json.electionid, json, opt.resultCacheTime );
		
		var eid = electionids[json.electionid];
		if( ! eid ) {
			window.console && console.log( 'No election ID ' + json.electionid );
			return;
		}
		if( eid.electionid == electionids.byStateContest( 'US', 'trends' ) ) {
			loadTrends( json );
			gotResultsTable( json.electionid );
			return;
		}
		
		var results = json.table;
		var state = results.state = State( eid.state );
/*
		var isDelegates = ( json.electionid == state.electionidPrimaryDelegates );
		if( isDelegates )
			state.delegates = results;
		else if( state == stateUS  &&  view == 'county' )
			state.resultsCounty = results;
		else
*/
		state.results[params.contest] = results;
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
			if( zero ) {
				for( iCol = 0;  iCol < colsID;  iCol += 4 ) {
					row[iCol] = 0;
				}
				row[cols.NumCountedBallotBoxes] = 0;
			}
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
				totalVotes += votes;
				if( maxVotes < votes ) {
					maxVotes = votes;
					iMaxVotes = candidates.length;
				}
				candidates.push( candidate );
			}
			indexArray( candidates, 'id' );
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
		}
		results.oldtemp = { cols: results.cols, rows: results.rows };  // TEMP debugging
		delete results.cols;
		delete results.rows;
		features.didMissingCheck = true;
		
		gotResultsTable( json.electionid );
		
		if( missing.length  &&  debug  &&  debug != 'quiet' ) {
			alert( S( 'Missing locations:\n', missing.sort().join( '\n' ) ) );
		}
	}
	
	function gotResultsTable( electionid ) {
		logResultsTimes( electionid );
		if( electionsPending.length == 0 )
			geoReady();
	}
	
	function logResultsTimes( electionid ) {
		function n( n ) { return ( n / 1000 ).toFixed( 3 ); }
		if( params.debug  &&  window.console  &&  console.log ) {
			var t = resultsTimer[electionid];
			t.process = now();
			console.log( S(
				'electionid ', electionid,
				' get:', n( t.fetch - t.start ),
				' process:', n( t.process - t.fetch )
			) );
		}
	}
	
	var presByState = 'Presidential results by State';
	
	function fixupTrends( trendsIn ) {
		function change( from, to ) {
			if( trends[from] ) {
				trends[to] = trends[from];
				delete trends[from];
			}
		}
		var trends = {};
		_.each( trendsIn.results, function( trend ) {
			if( trend.name == presByState )
				trends.states = fixupTrendStates( trend.states );
			else
				for( var key in trend ) {
					trends[key] = fixupTrend( trend[key] );
			}
		});
		change( 'governors', 'governor' );
		return trends;
	}
	
	function fixupTrend( trend ) {
		trend.parties = [];
		_.each( trend.rows, function( row ) {
			var party = {};
			_.each( trend.cols, function( key, i ) {
				party[key] = row[i];
			});
			trend.parties.push( party );
		});
		delete trend.cols;
		delete trend.rows;
		indexArray( trend.parties, 'id' );
		return trend;
	}
	
	function fixupTrendStates( statesIn ) {
		var states = {}
		_.each( statesIn, function( state ) {
			states[state.id] = state;
		});
		return states;
	}
	
	var trends;
	function loadTrends( json ) {
		trends = fixupTrends( json );
	}
