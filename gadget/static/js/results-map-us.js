// results-map-us.js
// By Michael Geary - http://mg.to/
// See UNLICENSE or http://unlicense.org/ for public domain notice.

var times = {
	gadgetLoaded: now(),
	offset: 0
};

// Default params
params.year = params.year || '2012';
params.contest = params.contest || 'president';
params.source = ( params.source == 'gop' ? 'gop' : 'ap' );
var hostPrefix = location.host.split('.')[0];
var match = hostPrefix.match( /^([a-z][a-z])2012(-\w+)$/ );
if( match ) {
	if( hostPrefix == 'nv2012' ) params.source = 'gop';
	params.state = match[1];
}
var $body = $('body');
$body.addClass( 'source-' + params.source );

// Hide Google Elections logo in IE <= 7
if( $.browser.msie ) {
	if( +$.browser.version.split('.')[0] <= 7 )
		$body.addClass( 'ie7' );
}

opt.randomized = params.randomize || params.zero;

var year = params.year in elections ? +params.year : 2012;
var parties = elections[year];
var party = params.party in parties ? params.party : 'general';
var election = parties[party];
var currentCandidate;

function longDateFromYMD( yyyymmdd ) {
	var ymd = yyyymmdd.split('-'), year = ymd[0];
	if( ymd.length == 1 ) return year;
	return T( 'dateFormat', {
		year: year,
		monthName: T( 'monthName' + ymd[1] ),
		dayOfMonth: +ymd[2]
	});
}

if( params.date ) {
	var d = dateFromYMD( params.date, election.tzHour, election.tzMinute );
	times.offset = d - times.gadgetLoaded;
}

indexArray( states, 'abbr', 'electionidPrimary', 'fips', 'name' );
states.by.nameEN = states.by.name;

for( var state, i = -1;  state = states[++i]; ) {
	state.dateUTC = dateFromYMD( state.date, election.tzHour, election.tzMinute );
	state.name = T( 'state-' + state.abbr );
	var stateAbbr = state.abbr;
	if( state.abbr == 'US' ) {
		stateAbbr = T( 'stateAbbr-US' );
	}
	state.electionTitle = T( 'generalElection', { abbr: stateAbbr } );
	state.electionSubTitle = T( 'dateFormat', { year:2012,
						    monthName: T( 'monthName11' ),
						    dayOfMonth: 6 } );
	state.results = {};
}

params.state = params.state || params.embed_state;
//params.state = params.state || 'zz';
if( ( params.state || '' ).toLowerCase() == 'us' ) delete params.state;

function State( abbr ) {
	if( abbr && abbr.bbox && abbr.id ) abbr = abbr.fips;  // really a feature object
	abbr = ( abbr || params.state || 'US' ).toUpperCase();
	var state =
		states.by.fips[abbr] ||
		states.by.abbr[abbr] ||
		states.by.electionidPrimary[abbr] ||
		stateUS;
	state.getResults = function() {
		return this.results[params.contest];
		//this == stateUS  &&  view == 'county' ? this.resultsCounty :
	};
	return state;
}

var stateUS = State('US'), state = State();

//if( PolyGonzo.isVML() ) {
//	delete params.view;  // too slow for all-county view
//}

var view = ( params.view == 'county' || state != stateUS ? 'county' : 'state' );

// Analytics
var _gaq = _gaq || [];
_gaq.push([ '_setAccount', 'UA-27854559-1' ]);
//_gaq.push([ '_setDomainName', '.election-maps.appspot.com' ]);
_gaq.push([ '_trackPageview' ]);

//function resultsFields() {
//	return S(
//		_.map( election.candidates, function( candidate ) {
//			return S( "'TabCount-", candidate.id, "'" );
//		}).join( ',' ),
//		',ID,TabTotal',
//		',NumBallotBoxes,NumCountedBallotBoxes'
//	);
//}

document.write(
	'<style type="text/css">',
		'html, body { margin:0; padding:0; border:0 none; }',
	'</style>'
);

var gm, gme;

var $window = $(window), ww = $window.width(), wh = $window.height();

var mapPixBounds;

var debug = params.debug;
//opt.state = params.state;
//opt.counties = !! opt.state;
opt.candidate = '1';
//opt.zoom = opt.zoom || 3;
opt.fontsize = '15px';
var sidebarWidth = params.play ? 340 : 280;

opt.resultCacheTime = 30 * 1000;
opt.reloadTime = 60 * 1000;

// Non-auto-refresh settings to use after results are final
//opt.resultCacheTime = Infinity;  // cache forever
//opt.reloadTime = false;  // no auto-reload

var zoom;

//indexArray( election.candidates, 'id' );

var pattern = {};
preloadPartyPatterns();

function preloadPartyPatterns( callback ) {
	//var loading = 0;
	for( party in color ) {
		//++loading;
		var p = pattern[party] = new Image();
		p.src = imgUrl( 'pattern-' + party + '.png' );
		//p.onload = function() {
		//	if( --loading == 0 ) callback && callback();
		//};
	}
}

function cacheUrl( url ) {
	return opt.nocache ? S( url, '?q=', times.gadgetLoaded ) : url;
}

function imgUrl( name ) {
	return cacheUrl( 'images/' + name );
}

document.body.scroll = 'no';

document.write(
	'<style type="text/css">',
		'html, body { width:', ww, 'px; height:', wh, 'px; margin:0; padding:0; overflow:hidden; color:#222; background-color:white; }',
		'#sidebar, #maptip, #testlabel, a.button { font-family: Arial,sans-serif; font-size: ', opt.fontsize, '; }',
		'a { font-size:13px; text-decoration:none; color:#1155CC; }',
		'a:hover { text-decoration:underline; }',
		//'a:visited { color:#6611CC; }',
		'a.button { display:inline-block; cursor:default; background-color:whiteSmoke; background-image:linear-gradient(top,#F5F5F5,#F1F1F1); border:1px solid #DCDCDC; border:1px solid rgba(0,0,0,0.1); border-radius:2px; box-shadow:none; color:#444; font-weight:bold; font-size:11px; height:27px; line-height:27px; padding:0 7px; }',
		'a.button.hover { background-color: #F6F6F6; background-image:linear-gradient(top,#F8F8F8,#F1F1F1); border:1px solid #C6C6C6; box-shadow:0px 1px 1px rgba(0,0,0,0.1); color:#222; }',
		'a.button.selected { background-color: #DDD; background-image:linear-gradient(top,#DDD,#D0D0D0); border:1px solid #BBB; box-shadow:inset 0px 1px 2px rgba(0,0,0,0.1); color:#111; }',
		'#outer {}',
		'.barvote { font-weight:bold; color:white; }',
		'div.topbar-header, div.sidebar-header { padding:3px; }',
		'div.title-text { font-size:16px; }',
		'div.subtitle-text { font-size:11px; color:#777; }',
		'div.body-text, div.body-text label { font-size:13px; }',
		'div.faint-text { font-size:12px; color:#777; }',
		'div.small-text, a.small-text { font-size:11px; }',
		'div.topbar-delegates { font-size:21px; line-height:21px; font-weight:bold; }',
		'body.narrow #topbar div.candidate-name { display:none; }',
		'#auto-update, #percent-reporting { margin: 0px 0px 8px 2px; }',
		'.content table { xwidth:100%; }',
		'.content .contentboxtd { width:7%; }',
		'.content .contentnametd { xfont-size:24px; xwidth:18%; }',
		'.content .contentbox { height:24px; width:24px; xfloat:left; margin-right:4px; }',
		'.content .contentname { white-space:pre; }',
		'.content .contentvotestd { text-align:right; width:5em; }',
		'.content .contentpercenttd { text-align:right; width:2em; }',
		'.content .contentvotes, .content .contentpercent { xfont-size:', opt.fontsize, '; margin-right:4px; }',
		'.content .contentclear { clear:left; }',
		'.content .contentreporting { margin-bottom:8px; }',
		'.content .contentreporting * { xfont-size:20px; }',
		'.content {}',
		'div.scroller { overflow:scroll; overflow-x:hidden; }',
		'div.scroller::-webkit-scrollbar-track:vertical { background-color:#f5f5f5; margin-top:2px; }',
		'div.scroller::-webkit-scrollbar { height:16px; width:16px; }',
		'div.scroller::-webkit-scrollbar-button { height:0; width:0; }',
		'div.scroller::-webkit-scrollbar-button:start:decrement, div.scroller::-webkit-scrollbar-button:end:increment { display:block; }',
		'div.scroller::-webkit-scrollbar-button:vertical:start:increment, div.scroller::-webkit-scrollbar-button:vertical:end:decrement { display:none; }',
		'div.scroller::-webkit-scrollbar-track:vertical, div.scroller::-webkit-scrollbar-track:horizontal, div.scroller::-webkit-scrollbar-thumb:vertical, div.scroller::-webkit-scrollbar-thumb:horizontal { border-style:solid; border-color:transparent; }',
		'div.scroller::-webkit-scrollbar-track:vertical { background-clip:padding-box; background-color:#fff; border-left-width:5px; border-right-width:0; }',
		'div.scroller::-webkit-scrollbar-track:horizontal { background-clip:padding-box; background-color:#fff; border-bottom-width:0; border-top-width:5px; }',
		'div.scroller::-webkit-scrollbar-thumb { -webkit-box-shadow:inset 1px 1px 0 rgba(0,0,0,.1),inset 0 -1px 0 rgba(0,0,0,.07); background-clip:padding-box; background-color:rgba(0,0,0,.2); min-height:28px; padding-top:100px; }',
		'div.scroller::-webkit-scrollbar-thumb:hover { -webkit-box-shadow:inset 1px 1px 1px rgba(0,0,0,.25); background-color:rgba(0,0,0,.4); }',
		'div.scroller::-webkit-scrollbar-thumb:active { -webkit-box-shadow:inset 1px 1px 3px rgba(0,0,0,.35); background-color:rgba(0,0,0,.5); }',
		'div.scroller::-webkit-scrollbar-thumb:vertical { border-width:0; border-left-width:5px; }',
		'div.scroller::-webkit-scrollbar-thumb:horizontal { border-width:0; border-top-width:5px; }',
		'div.scroller::-webkit-scrollbar-track:vertical { border-left-width:6px; border-right-width:1px; }',
		'div.scroller::-webkit-scrollbar-track:horizontal { border-bottom:1px; border-top:6px; }',
		'div.scroller::-webkit-scrollbar-thumb:vertical { border-width:0; border-left-width:6px; border-right-width:1px; }',
		'div.scroller::-webkit-scrollbar-thumb:horizontal { border-width:0; border-bottom:1px; border-top:6px; }',
		'div.scroller::-webkit-scrollbar-track:hover { -webkit-box-shadow:inset 1px 0 0 rgba(0,0,0,.1); background-color:rgba(0,0,0,.05); }',
		'div.scroller::-webkit-scrollbar-track:active { -webkit-box-shadow:inset 1px 0 0 rgba(0,0,0,.14),inset -1px -1px 0 rgba(0,0,0,.07); background-color:rgba(0,0,0,.05); }',
		'#maptip { position:absolute; z-index:10; border:1px solid #333; background:white; color:#222; white-space: nowrap; display:none; width:300px; }',
		'div.candidate-name { line-height:1em; }',
		'div.first-name { font-size:85%; }',
		'#election-title { padding-left:3px; }',
		'body.tv #election-title { font-size:24px; font-weight:bold; }',
		'body.tv #election-date { font-size:16px; color:#222; }',
		'body.tv #percent-reporting { font-size:20px; }',
		'body.tv div.candidate-name { margin-right:20px; }',
		'body.tv div.candidate-name div { line-height:1.1em; }',
		'body.tv div.first-name { font-size:20px; }',
		'body.tv div.last-name { font-size:24px; font-weight:bold; }',
		'body.tv #maptip { border:none; }',
		'body.tv #map { border-left:1px solid #333; }',
		'body.tv span.tiptitletext { font-size:28px; }',
		'body.tv div.tipreporting { font-size:20px; }',
		'body.tv table.candidates td { padding:4px 0; }',
		'.tiptitlebar { padding:4px 8px; border-bottom:1px solid #AAA; }',
		'.tiptitletext { font-weight:bold; font-size:120%; }',
		'.tipcontent { padding:4px 8px 8px 8px; border-bottom:1px solid #AAA; }',
		'.tipreporting { font-size:80%; padding:2px 0; }',
		//'#selectors { background-color:#D0E3F8; }',
		'#selectors, #selectors * { font-size:14px; }',
		'#selectors label { font-weight:bold; }',
		'#selectors, #legend { width:100%; }',
		'#selectors option.disabled { color:#BBB; }',
		'body.sidebar { background-color:white; }',
		'body.tv #legend { margin-top:8px; }',
		'body.sidebar #selectors, body.sidebar #legend { width:', sidebarWidth, 'px; }',
		'#sidebar table.candidates { width:100%; }',
		'table.candidates td { border-top:1px solid #E7E7E7; }',
		'table.candidates tr.zero { display:none; }',
		'#maptip table.candidates { width:100%; }',
		'#maptip table.candidates tr.first td { border-top:none; }',
		'#maptip div.candidate-delegates { font-size:120%; }',
		'#maptip div.candidate-percent { font-weight:bold; }',
		'#maptip div.candidate-votes { font-size:80%; }',
		'#maptip div.click-for-local { padding:4px; }',
		'body.tv #maptip div.candidate-percent { font-size:20px; font-weight:bold; }',
		'#sidebar-scroll { padding:0 4px; }',
		'tr.legend-candidate td, tr.legend-filler td { border:1px solid white; }',
		'div.legend-candidate, div.legend-filler { font-size:13px; padding:6px 4px; }',
		//'body.tv div.legend-candidate, body.tv div.legend-filler { font-size:22px; }',
		'body.web div.legend-candidate { color:#333; }',
		'body.tv div.legend-candidate, body.tv div.legend-filler { font-size:21px; font-weight:bold; }',
		'td.legend-filler { border-color:transparent; }',
		//'tr.legend-candidate td { width:20%; }',
		'tr.legend-candidate td { cursor:pointer; }',
		'tr.legend-candidate.hover td { background-color:#F5F5F5; border:1px solid #F5F5F5; border-top:1px solid #D9D9D9; border-bottom:1px solid #D9D9D9; }',
		'tr.legend-candidate.hover td.left { border-left:1px solid #D9D9D9; }',
		'tr.legend-candidate.hover td.right { border-right:1px solid #D9D9D9; }',
		'tr.legend-candidate.selected td { background-color:#E7E7E7; border:1px solid #E7E7E7; border-top:1px solid #CCCCCC; border-bottom:1px solid #CCCCCC; }',
		'tr.legend-candidate.selected td.left { border-left:1px solid #CCCCCC; }',
		'tr.legend-candidate.selected td.right { border-right:1px solid #CCCCCC; }',
		'span.legend-candidate-color { font-size:15px; }',
		'#sidebar span.legend-candidate-color { font-size:16px; }',
		'body.tv span.legend-candidate-color { font-size:18px; }',
		'#centerlabel, #centerlabel * { font-size:12px; xfont-weight:bold; }',
		'#spinner { z-index:999999; position:absolute; left:', Math.floor( ww/2 - 64 ), 'px; top:', Math.floor( wh/2 - 20 ), 'px; }',
		'#error { z-index:999999; position:absolute; left:4px; bottom:4px; border:1px solid #888; background-color:#FFCCCC; font-weight:bold; padding:6px; }',
		'a.logo { position:absolute; bottom:24px; width:48px; height:48px;}',
		'#gop-logo { right:64px; width:48px; background: url(', imgUrl('gop-nv-48.png'), ') no-repeat; }',
		'body.source-ap #gop-logo { display:none; }',
		'#ap-logo { right:64px; width:41px; background: url(', imgUrl('ap-logo-48x41.png'), ') no-repeat; }',
		'body.source-gop #ap-logo { display:none; }',
		'#google-logo { right:4px; background: url(', imgUrl('google-politics-48.png'), ') no-repeat; }',
		'#gop-logo { right:64px; width:48px; background: url(', imgUrl('gop-nv-48.png'), ') no-repeat; }',
		'body.hidelogo #gop-logo, body.hidelogo #ap-logo { right:4px; }',
		'body.hidelogo #google-logo { display:none; }',
		'body.ie7 #gop-logo, body.ie7 #ap-logo { right:4px; }',
		'body.ie7 #google-logo, body.ie7 #linkToMap { display:none; }',
		'#testlabel { position:absolute; left: ', sidebarWidth + 32, 'px; top: 2px; font-size: 24px; font-weight:bold; color:red; text-shadow: 0 0 4px white, 0 0 8px white, 0 0 12px white, 0 0 12px white; }',
		renderBarStyles(),
	'</style>'
);


var index = 0;
function option( value, name, selected, disabled ) {
	var html = optionHTML( value, name, selected, disabled );
	++index;
	return html;
}

function optionHTML( value, name, selected, disabled ) {
	var idclass = S(
		value ? 'id="option-' + value + '" ' : '',
		disabled ? 'class="disabled" ' : ''
	);
	selected = selected ? 'selected="selected" ' : '';
	disabled = disabled ? 'disabled="disabled" ' : '';
	return S(
		'<option ', idclass, 'value="', value, '" ', selected, disabled, '>',
			name,
		'</option>'
	);
}

function stateOption( s, index, selected ) {
	State(s).selectorIndex = index;
	return option( s.id.split('US')[1], s.name, selected );
}

function contestOption( value, name ) {
	return option( value, name, value == params.contest );
}

function enableOption( element, enable ) {
	$(element).toggleClass( 'disabled', ! enable ).prop( 'disabled', ! enable );
}

document.write(
	'<div id="outer">',
	'</div>',
	'<div id="maptip">',
	'</div>',
	'<a id="ap-logo" class="logo" target="_blank" href="http://www.youtube.com/associatedpress" title="', T('dataAttribTitle'), '">',
	'</a>',
	'<a id="gop-logo" class="logo" target="_blank" href="http://www.nvgopcaucus.com/" title="', T('dataAttribTitleGOP'), '">',
	'</a>',
	'<a id="google-logo" class="logo" target="_blank" href="http://www.google.com/elections/ed/us/home" title="', T('googlePoliticsTitle'), '">',
	'</a>',
	'<div id="error" style="display:none;">',
	'</div>',
	'<div id="testlabel" style="display:none;">',
		T('testData'),
	'</div>',
	'<div id="spinner">',
		'<img border="0" style="width:128px; height:128px;" src="', imgUrl('spinner-124.gif'), '" />',
	'</div>'
);

function contentTable() {
	function button( contest ) {
		return S(
			'<a class="button',
				params.contest == contest ? ' selected' : '',
				'" id="btn-', contest,
				'" title="', T( 'clickFor-' + contest ),
			'">',
				T( contest + 'Button' ),
			'</a>'
		);
	}
	return S(
		'<div>',
			'<div id="selectors">',
				'<div style="margin:0; padding:4px;">',
					_.map( [ 'president', 'senate', 'house', 'governor' ], button )
						.join( '&nbsp;&nbsp;' ),
				'</div>',
				//'<div style="margin:0; padding:6px;">',
				//	//'<label for="stateSelector">',
				//	//	T('stateLabel'),
				//	//'</label>',
				//	//'<select id="stateSelector">',
				//	//	option( 'US00', T('state-US') ),
				//	//	mapjoin(
				//	//		sortArrayBy( stateUS.geo.state.features, 'name' ),
				//	//		function( s, i ) {
				//	//			return stateOption(
				//	//				s, i + 1, s.abbr == state.abbr
				//	//			);
				//	//		}),
				//	//'</select>',
				//	//'&nbsp;&nbsp;',
				//	////'&nbsp;&nbsp;&nbsp;',
				//	//'<select id="contestSelector">',
				//	//	contestOption( 'president', T('president') ),
				//	//	contestOption( 'senate', T('senate') ),
				//	//	contestOption( 'house', T('house') ),
				//	//	contestOption( 'governor', T('governor') ),
				//	//'</select>',
				//	//'<input type="checkbox" id="chkCounties">',
				//	//'<label for="chkCounties">', T('countiesCheckbox'), '</label>',
				//'</div>',
			'</div>',
			'<div id="legend">',
				formatLegendTable( [] ),
			'</div>',
			'<div style="width:100%;">',
				'<div id="map" style="width:100%; height:100%;">',
				'</div>',
			'</div>',
		'</div>'
	);
}

function formatLegendTable( cells ) {
	function filler() {
		return S(
			'<td class="legend-filler">',
				'<div class="legend-filler">',
					'&nbsp;',
				'</div>',
			'</td>'
		);
	}
	function row( cells ) {
		return S(
			'<tr>',
				cells.length ? cells.join('') : filler(),
			'</tr>'
		);
	}
	return S(
		'<table cellpadding="0" cellspacing="0" style="width:100%; vertical-align:middle;">',
			row( cells.slice( 0, 5 ) ),
			row( cells.slice( 5 ) ),
		'</table>'
	);
}

function usEnabled() {
	return params.usa != 'false'  &&
		( ! params.embed_state  ||  params.embed_state.toLowerCase() == 'us' );
}

//(function( $ ) {
	
	// TODO: Refactor and use this exponential retry logic
	//function getJSON( type, path, file, cache, callback, retries ) {
	//	var stamp = now();
	//	if( ! opt.nocache ) stamp = Math.floor( stamp / cache / 1000 );
	//	if( retries ) stamp += '-' + retries;
	//	if( retries == 3 ) showError( type, file );
	//	_IG_FetchContent( path + file + '?' + stamp, function( json ) {
	//		// Q&D test for bad JSON
	//		if( json && json.charAt(0) == '{' ) {
	//			$('#error').hide();
	//			callback( eval( '(' + json + ')' ) );
	//		}
	//		else {
	//			reportError( type, file );
	//			retries = ( retries || 0 );
	//			var delay = Math.min( Math.pow( 2, retries ), 128 ) * 1000;
	//			setTimeout( function() {
	//				getJSON( type, path, file, cache, callback, retries + 1 );
	//			}, delay );
	//		}
	//	}, {
	//		refreshInterval: opt.nocache ? 1 : cache
	//	});
	//}
	
	var jsonRegion = {};
	function loadRegion( s, kind ) {
		s = s || state;
		var level = params.level || s.level || '4096';
		kind = kind || (
			params.contest == 'house' ? 'house' :
			state == stateUS ? 'state' :
			'county'
		);
		if( kind == 'county' ) level = '512';  // TEMP
		var fips = s.fips;
		var json = jsonRegion[fips+kind];
		if( json ) {
			loadGeoJSON( json );
		}
		else {
			if( fips == '00'  &&  view == 'county' ) fips = '00-county';
			if( params.contest == 'house' ) fips = '00-house';
			var file = S( 'carto2010', '-', fips, '-goog_geom', level, '.js' );
			getGeoJSON( 'shapes/json/' + file );
		}
	}
	
	function getScript( url ) {
		$.ajax({
			url: url,
			dataType: 'script',
			cache: true
		});
	}
	
	function getGeoJSON( url ) {
		reloadTimer.clear();
		$('#spinner').show();
		getScript( cacheUrl( url ) );
	}
	
	var didLoadGeoJSON;
	loadGeoJSON = function( json ) {
		function oneTime() {
			if( ! didLoadGeoJSON ) {
				didLoadGeoJSON = true;
				$('#outer').html( contentTable() );
				initSelectors();
			}
		}
		var target = json.house ? 'house' : json.county ? 'county' : 'state';
		var fips = json[target].id;
		fips = fips.split('-')[0];  // hack for 00-house
		var state = State( fips );
		state.geo = state.geo || {};
		for( var kind in json ) {
			if( state.geo[kind] ) continue;
			jsonRegion[fips+kind] = json;
			var geo = json[kind];
			indexFeatures( geo );
			state.geo[kind] = geo;
		}
		oneTime();
		//setCounties( true );
		getResults();
		//analytics( 'data', 'counties' );
	};
	
	function indexFeatures( geo ) {
		var features = geo.features;
		var usa = ( geo.id == '00'  &&  /state/.test(geo.table) );  // TODO
		var house = ( geo.id == '00-house' );
		var by = features.by = {};
		if( house ) {
			for( var feature, i = -1;  feature = features[++i]; ) {
				var m = feature.id.split('-');
				feature.abbr = m[0];
				feature.district = m[1].replace( /^0*/, '' );
				var state = feature.state = states.by.abbr[feature.abbr];
				feature.fips = state.fips;
				by[feature.id] = by[feature.abbr] = by[state.fips] = by[feature.district] = feature;
				//if( usa ) by[ states.by.fips[fips].abbr ] = feature;
			}
		}
		else {
			for( var feature, i = -1;  feature = features[++i]; ) {
				var fips = feature.fips = feature.id.split('US')[1];
				by[feature.id] = by[fips] = by[feature.name] = feature;
				if( fips.length == 2 ) by[fips+'000'] = feature;
				var state = feature.state = states.by.fips[fips];
				if( usa ) by[state.abbr] = feature;
			}
		}
	}
	
	function setPlayback() {
		var play = getPlaybackParams();
		if( ! play ) return;
		play.player.setup();
		setInterval( play.player.tick, play.time );
	}
	
	function getPlaybackParams() {
		var play = params.play;
		if( ! play ) return false;
		play = play.split( ',' );
		var time = Math.max( play[1] || 5000, 1000 );
		var type = play[0];
		var player = players[type];
		if( ! player ) return false;
		return {
			player: player,
			type: type,
			time: time
		};
	}
	
	function playType() {
		var play = getPlaybackParams();
		return play && play.type;
	}
	
	function playCandidates() {
		return playType() == 'candidates';
	}
	
	function playCounties() {
		return playType() == 'counties';
	}
	
	function autoplay() {
		return !! playType();
	}
	
	function interactive() {
		return ! autoplay();
	}
	
	function tv() {
		return autoplay();
	}
	
	function web() {
		return ! tv();
	}
	
	var players = {
		candidates: {
			setup: function() {
			},
			tick: function() {
				var topCandidates = getTopCandidates( state.getResults(), -1, 'votes' );
				if( ! currentCandidate ) {
					i = 0;
				}
				else {
					for( var i = 0;  i < topCandidates.length;  ++i ) {
						if( topCandidates[i].id == currentCandidate ) {
							++i;
							if( i >= topCandidates.length )
								i = -1;
							break;
						}
					}
				}
				currentCandidate = ( i >= 0  &&  topCandidates[i].id );
				setCandidate( currentCandidate );
			}
		},
		counties: {
			//setup: function() {
			//	var features = state.geo.county.features;
			//	//features.playOrder = sortArrayBy( features, function( feature ) {
			//	//	return(
			//	//		-feature.centroid[1] * 1000000000 + feature.centroid[0]
			//	//	);
			//	//});
			//	features.playOrder = sortArrayBy( features, 'name' );
			//},
			//tick: function() {
			//	var geo = state.geo.county;
			//	var order = geo.features.playOrder,
			//		next = order.next, length = order.length;
			//	if( ! next  ||  next >= length ) next = 0;
			//	while( next < length ) {
			//		var feature = order[next++], id = feature.id;
			//		var row = featureResult( results, feature );
			//		var use = row && row[col.NumCountedBallotBoxes];
			//		if( use ) {
			//			outlineFeature({ geo:geo, feature:feature });
			//			showTip( feature );
			//			break;
			//		}
			//	}
			//	order.next = next;
			//}
		}
	};
	
	//var setCountiesFirst = true;
	//function setCounties( counties, force ) {
	//	counties = !! counties;
	//	if( counties == opt.counties  &&  ! force  &&  ! setCountiesFirst )
	//		return;
	//	setCountiesFirst = false;
	//	opt.counties = counties;
	//	$('#chkCounties').prop( 'checked', counties );
	//	loadView();
	//}
	
	function showError( type, file ) {
		file = file.replace( '.json', '' ).replace( '-all', '' ).toUpperCase();
		$('#error').html( S( '<div>Error loading ', type, ' for ', file, '</div>' ) ).show();
		$('#spinner').hide();
	}
	
	function reportError( type, file ) {
		analytics( 'error', type, file );
	}
	
	function analytics( category, action, label, value, noninteraction ) {
		//analytics.seen = analytics.seen || {};
		//if( analytics.seen[path] ) return;
		//analytics.seen[path] = true;
		_gaq.push([ '_trackEvent',
			category, action, label, value, noninteraction
		]);
	}
	
	var useSidebar;
	function setSidebar() {
		//useSidebar = ( state != stateUS );
		useSidebar = true;
		$body.toggleClass( 'sidebar', useSidebar );
	}
	
	$body.addClass( autoplay() ? 'autoplay' : 'interactive' );
	$body.addClass( tv() ? 'tv' : 'web' );
	setSidebar();
	// TODO: refactor with duplicate code in geoReady() and resizeViewNow()
	var mapWidth = ww - ( useSidebar ? sidebarWidth : 0 );
	$body
		.toggleClass( 'hidelogo', mapWidth < 140 )
		.toggleClass( 'narrow', ww < 770 );

	var map;
	
	var overlays = [];
	overlays.clear = function() {
		while( overlays.length ) overlays.pop().setMap( null );
	};
	
	//var state = states[opt.state];
	
	var reloadTimer = {
		timer: null,
		
		clear: function() {
			clearInterval( this.timer );
			this.timer = null;
		},
		
		set: function( fn, time ) {
			this.clear();
			this.timer = setInterval( fn, time );
		},
		
		disable: function() {
			this.clear();
			opt.resultCacheTime = Infinity;
			opt.reloadTime = false;
		}
	};
	
	var geoMoveNext = true;
	var polyTimeNext = 250;
	
	var didGeoReady;
	geoReady = function() {
		// TODO: refactor with duplicate code in resizeViewNow()
		setSidebar();
		setLegend();
		showHiddenCandidatesIfToggled();
		resizeViewOnly();
		if( geoMoveNext ) {
			geoMoveNext = false;
			moveToGeo();
		}
		$('#view-usa').toggle( state.fips != '00' );
		polys();
		//mapIdled = false;
		$('#spinner').hide();
		if( opt.randomized  ||  ! opt.reloadTime  ||  params.refresh == 'false' ) {
			reloadTimer.disable();
		}
		else {
			reloadTimer.set( loadView, opt.reloadTime );
		}
		if( ! didGeoReady ) {
			setPlayback();
			didGeoReady = true;
		}
	}

	function shouldShowToggleShowAllCandidatesLink() {
		return params.contest == 'president' && state.abbr == 'US';
	}

	// Returns true if user toggled show all candidates, or if race is not
	// presidential race.
	function shouldShowAllCandidates() {
		return params.showall == 'true' ||
				params.contest != 'president' ||
				(params.contest == 'president' && state.abbr != 'US');
	}

	// Shows all tr.zero Candidate rows if params.showall is 'true'.
	function showHiddenCandidatesIfToggled() {
		if (shouldShowAllCandidates()) {
			$('tr.zero').show();
		}
	}
	
	function currentGeos() {
		if( params.contest == 'house' ) {
			return [ state.geo.house/*, state.geo.state*/ ];
		}
		if( state == stateUS ) {
			return view == 'county' ?
				[ state.geo.county, state.geo.state ] :
				[ state.geo.state ];
		}
		
		if( state.votesby == 'state' ) {
			//if( d.county.geo ) d.county.geo.hittest = false;
			return [ state.geo.state ];
		}
		
		//d.state.geo.hittest = false;
		//d.county.geo.hittest = false;
		return [
			/*state.geo.town,*/
			state.geo.county,
			state.geo.state
			/*stateUS.geo.state */
		];
	}
	
	function moveToGeo() {
		var json = state.bounds || ( state && state.geo && state.geo.county );
		$('#map').show();
		initMap();
		gme && map && gme.trigger( map, 'resize' );
		//overlays.clear();
		//$('script[title=jsonresult]').remove();
		//if( json.status == 'later' ) return;
		
		outlineFeature( null );
		json && fitBbox( json.bbox );
	}
	
	var setCenter = 'setCenter';
	function fitBbox( bbox ) {
		addBboxOverlay( bbox );
		var z;
		if( params.zoom  &&  params.zoom != 'auto' ) {
			z = +params.zoom;
		}
		else {
			if( ! bbox ) return;
			z = PolyGonzo.Mercator.fitBbox( bbox, {
				width: $('#map').width(),
				height: $('#map').height()
			});
		}
		z = Math.floor( z );
		
		// Force a poly draw if the map is not going to move (much)
		// TODO: better calculation using pixel position
		var centerLL = PolyGonzo.Mercator.coordToLngLat([
			( bbox[0] + bbox[2] ) / 2,
			( bbox[1] + bbox[3] ) / 2,
		]);
		var centerNew = new gm.LatLng( centerLL[1], centerLL[0] );
		function near( a, b ) { return Math.abs( a - b ) < .001; }
		var centerMap = map.getCenter();
		if( centerMap  &&  z == map.getZoom() ) {
			if(
				near( centerMap.lat(), centerLL[1] )  &&
				near( centerMap.lng(), centerLL[0] )
			) {
				polys();
			}
		}
		map.setZoom( z );
		map[setCenter]( centerNew );
		setCenter = 'panTo';
		zoom = map.getZoom();
	}
	
	//function shrinkBbox( bbox, amount ) {
	//	var dx = ( bbox[2] - bbox[0] ) * amount / 2;
	//	var dy = ( bbox[3] - bbox[1] ) * amount / 2;
	//	return [
	//		bbox[0] + dx,
	//		bbox[1] + dy,
	//		bbox[2] - dx,
	//		bbox[3] - dy
	//	];
	//}
	
	var bboxOverlay;
	function addBboxOverlay( bbox ) {
		if( ! params.bbox ) return;
		if( bboxOverlay )
			bboxOverlay.setMap( null );
		bboxOverlay = null;
		var feature = {
			fillColor: '#000000',
			fillOpacity: 0,
			strokeWidth: 1,
			strokeColor: '#FF0000',
			strokeOpacity: .5,
			geometry: {
				type: 'Polygon',
				coordinates: [
					[
						[ bbox[0], bbox[1] ],
						[ bbox[0], bbox[3] ],
						[ bbox[2], bbox[3] ],
						[ bbox[2], bbox[1] ],
						[ bbox[0], bbox[1] ]
					]
				]
			}
		};
		bboxOverlay = new PolyGonzo.PgOverlay({
			map: map,
			geos: [{
				crs: {
					type: 'name',
					properties: {
						name: 'urn:ogc:def:crs:EPSG::3857'
					}
				},
				//kind: where.geo.kind,
				features: [ feature ]
			}]
		});
		bboxOverlay.setMap( map );
	}
	
	var  mouseFeature;
	
	function getStateCounties( features, state ) {
		var counties = [];
		for( var iFeature = -1, feature;  feature = features[++iFeature]; ) {
			if( feature.state.toUpperCase() == curState.abbr )
				counties.push( feature );
		}
		return counties;
	}
	
	var dragged = false;
	var mapIdled;
	function addMapListeners( map ) {
		gme.addListener( map, 'dragstart', function() {
			dragged = true;
		});
		gme.addListener( map, 'idle', function() {
			//if( mapIdled )
				polys();
			mapIdled = true;
		});
/*
		usEnabled() && gme.addListener( map, 'zoom_changed', function() {
			var zoom = map.getZoom();
			if( zoom <= 4  &&  state != stateUS )
				setState( '00', 'zoom' );
		});
*/
	}
	
	function featureClickOK( feature ) {
		return feature  &&  ! noElectionParty( feature.fips );
	}
	
	var touch;
	if( params.touch ) touch = { mouse: true };
	var polysThrottle = throttle(200), showTipThrottle = throttle(200);
	function polys() {
		outlineFeature( null );
		var mousedown = false;
		colorize( currentGeos() );
		var $container = $('#map');
		var events = playType() ? {} : {
			mousedown: function( event, where ) {
				if( touch  &&  ! touch.mouse ) return;
				showTip( false );
				mousedown = true;
				dragged = false;
			},
			mouseup: function( event, where ) {
				if( touch  &&  ! touch.mouse ) return;
				mousedown = false;
			},
			mousemove: function( event, where ) {
				if( touch || mousedown ) return;
				polysThrottle( function() {
					var feature = where && where.feature;
					if( feature == mouseFeature ) return;
					mouseFeature = feature;
					map.setOptions({
						draggableCursor: featureClickOK(feature) ?
							'pointer' :
							null
					});
					outlineFeature( where );
					showTipThrottle( function() { showTip(feature); });
				});
			},
			touchstart: function( event, where ) {
				touch = {};
				if( event.touches.length == 1 )
					touch.where = where;
				else  // multitouch
					this.touchcancel( event, where );
			},
			touchmove: function( event, where ) {
				this.touchcancel( event, where );
			},
			touchend: function( event, where ) {
				var feature = touch.where && touch.where.feature;
				if( ! featureClickOK(feature) )
					feature = null;
				if( feature != mouseFeature ) {
					mouseFeature = feature;
					outlineFeature( touch.where );
					showTip( feature );
					touch.moveTip = true;
				}
				else {
					if( state == stateUS )
						setState( feature, 'tap' );
				}
			},
			touchcancel: function( event, where ) {
				delete touch.where;
				outlineFeature( null );
				showTip( false );
			},
			click: function( event, where ) {
				if( params.contest == 'house' ) return;  // TEMP
				event.stopPropagation && event.stopPropagation();
				if( touch  &&  ! touch.mouse ) return;
				mousedown = false;
				var didDrag = dragged;
				dragged = false;
				events.mousemove( event, where );
				if( didDrag ) return;
				var feature = where && where.feature;
				if( touch && touch.mouse ) {
					touch.where = where;
					this.touchend( event, where );
				}
				else {
					//if( feature.type == 'state'  || feature.type == 'cd' )
					if( featureClickOK(feature) )
						setState( feature, 'click' );
				}
			}
		};
		//overlays.clear();
		// Let map display before drawing polys
		function draw() {
			var overlay = new PolyGonzo.PgOverlay({
				map: map,
				geos: currentGeos(),
				underlay: getInsetUnderlay,
				events: events
			});
			overlay.setMap( map );
			setTimeout( function() {
				overlays.clear();
				overlays.push( overlay );
			}, 1 );
			//overlay.redraw( null, true );
		}
		var pt = polyTimeNext;
		polyTimeNext = 0;
		if( pt ) setTimeout( draw, 250 );
		else draw();
	}
	
	function colorize( geos ) {
		//if( opt.counties ) {
		//	var features = data.state.geo.features;
		//	for( var iFeature = -1, feature;  feature = features[++iFeature]; ) {
		//		feature.fillColor = '#000000';
		//		feature.fillOpacity = 0;
		//		feature.strokeColor = '#666666';
		//		feature.strokeOpacity = 1;
		//		feature.strokeWidth = 2;
		//	}
		//}
		_.each( geos, function( geo ) {
			var features = geo.features;
			var kind = geo.table.split('.')[1];
			if(
			   kind == 'coucou'  ||
			   kind == 'gop2012'  ||  /*TEMP*/ 
			   kind == 'county00'  ||  /*TEMP*/ 
			   kind == 'gop2012nat'  ||  /*TEMP*/
			   kind == 'gop2012loc'  /*TEMP*/
			) {
				kind = 'cousub';
			}
			if(
			   kind == 'state00'
			) {
				kind = 'state';
			}
			if(
				kind == 'house2012_512'  ||
				kind == 'house2012_4096'
			) {
				kind = 'house';
			}
			var colorizers = {
				state: function() {
					if( state.votesby == 'state'  && !( state == stateUS && view == 'county' ) )
						colorVotes( features, '#666666', 1, 1.5 );
					else
						colorSimple( features, '#FFFFFF', '#444444', 1, 1.5 );
				},
				county: function() {
					colorSimple( features, '#FFFFFF', '#444444', .5, .5 );
				},
				cousub: function() {
					colorVotes( features, '#666666', .5, .5 );
				},
				house: function() {
					colorVotes( features, '#666666', .5, .5 );
				}
			};
			colorizers[kind]();
		});
	}
	
	function colorSimple( features, fillColor, strokeColor, strokeOpacity, strokeWidth ) {
		for( var iFeature = -1, feature;  feature = features[++iFeature]; ) {
			feature.fillColor = fillColor;
			feature.fillOpacity = 0;
			feature.strokeColor = strokeColor;
			feature.strokeOpacity = strokeOpacity;
			feature.strokeWidth = strokeWidth;
		}
	}
	
	function colorVotes( features, strokeColor, strokeOpacity, strokeWidth ) {
		var results = state.getResults();
		var candidates = results && results.candidates;
		if( !( candidates && currentCandidate ) ) {
			// Multi-candidate view
			for( var iFeature = -1, feature;  feature = features[++iFeature]; ) {
				var result = featureResult( results, feature );
				var candidate = result && result.candidates[result.iMaxVotes];
				var party = noElectionParty( feature.fips );
				if( party ) {
					feature.fillColor = { image: pattern.gray };
					feature.fillOpacity = .3;
				}
				else {
					if( candidate ) {
						var party = election.parties[candidate.party];
						feature.fillColor = party && party.color || '#FFFFFF';  // TEMP
						feature.fillOpacity =
							candidate.winner ? .6 :
							.1 + .3 * result.counted / result.precincts;
					}
					else {
						feature.fillColor = '#FFFFFF';
						feature.fillOpacity = 0;
					}
				}
				var complete = result  &&  result.counted == result.precincts;
				feature.strokeColor = strokeColor;
				feature.strokeOpacity = strokeOpacity;
				feature.strokeWidth = strokeWidth;
			}
		}
		else {
			// Single candidate heatmap
			var max = 0;
			var candidate = candidates[currentCandidate];
			var party = candidate && election.parties[candidate.party];
			var color = party && party.color || '#FFFFFF';  // TEMP
			for( var iFeature = -1, feature;  feature = features[++iFeature]; ) {
				var result = featureResult( results, feature );
				if( result ) {
					var can = result.candidates.by.id[currentCandidate];
					if( can ) {
						max = Math.max( max,
							result.fract = result.votes ? can.votes / result.votes : 0
						);
					}
				}
			}
			for( var iFeature = -1, feature;  feature = features[++iFeature]; ) {
				var result = featureResult( results, feature );
				//var diff = feature && feature.state ? time - feature.state.dateUTC : -1;
				//var hatch = state == stateUS  &&  diff >= 0  &&  diff <= (24+9) * 60 * 60 * 1000;
				//feature.fillColor = hatch ? { image: candidate.pattern } : color;
				feature.fillColor = color;
				feature.fillOpacity = result && result.fract && max ? result.fract / max * .75 : 0;
				var complete = result  &&  result.counted == result.precincts;
				feature.strokeColor = strokeColor;
				feature.strokeOpacity = strokeOpacity;
				feature.strokeWidth = strokeWidth;
			}
		}
	}
	
	function noElectionParty( fips ) {
		if( state != stateUS )
			return null;
		if( params.contest != 'senate'  &&  params.contest != 'governor' )
			return null;
		var seats = election.seats[params.contest];
		if( ! seats )
			return null;
		if( ! seats.notElecting )
			return null;
		return seats.notElecting.states[ State(fips).abbr ];
	}
	
	function useInset() {
		return state == stateUS  &&  map.getZoom() == 4;
	}
	
	function insetFeatures( abbr, callback ) {
		var sf = stateUS.geo.state.features.by;
		var cf = ( view == 'county' ) && stateUS.geo.county.features.by;
		if( abbr == 'AK' ) {
			callback( sf.AK || sf['02'] );
			cf && callback( cf['02'] );
		}
		else {  // HI
			callback( sf.HI || sf['15'] );
			cf && eachWord( '15001 15003 15005 15007 15009', function( fips ) {
				callback( cf[fips] );
			});
		}
	}
	
	function getInsetUnderlay() {
		function clear( feature ) {
			delete feature.zoom;
			delete feature.offset;
		}
		if( ! stateUS.geo ) return null;
		var kind =
			params.contest == 'house' ? 'house' :
			view == 'county' ? 'county' : 'state';
		var features = stateUS.geo[kind].features;
		if( ! useInset() ) {
			insetFeatures( 'AK', clear );
			insetFeatures( 'HI', clear );
			return null;
		}
		insetFeatures( 'AK', function( feature ) {
			feature.zoom = 1;
			feature.offset = { x: -1122, y: -211 };
		});
		insetFeatures( 'HI', function( feature ) {
			feature.zoom = 4;
			feature.offset = { x: 538, y: -89 };
		});
		var images = [{
			src: imgUrl('ak-hi.png'),
			width: 166, height: 84,
			left: -1380, top: -370
		}];
		if( view != 'county' )
			images = images.concat([{
				abbr: 'CT',
				width: 68, height: 14,
				left: -823, top: -482
			}, {
				abbr: 'DC',
				width: 55, height: 24,
				left: -876, top: -410
			}, {
				abbr: 'DE',
				width: 51, height: 14,
				left: -820, top: -442
			}, {
				abbr: 'MA',
				width: 81, height: 14,
				left: -784, top: -516
			}, {
				abbr: 'MD',
				width: 52, height: 14,
				left: -839, top: -426
			}, {
				abbr: 'NH',
				width: 61, height: 22,
				left: -760, top: -544
			}, {
				abbr: 'NJ',
				width: 64, height: 14,
				left: -814, top: -462
			}, {
				abbr: 'RI',
				width: 71, height: 14,
				left: -799, top: -500
			}, {
				abbr: 'VT',
				width: 49, height: 14,
				left: -764, top: -558
			}]);
		return {
			images: images,
			hittest: function( image, x, y ) {
				if( image.abbr )
					return {
						geo: stateUS.geo,
						feature: features.by[image.abbr]
					}
				var feature =
					x < 81 ? features.by.AK || features.by['02'] :
					view != 'county' ? features.by.HI :
					hittestBboxes( features, bboxesInsetHI, x, y );
				if( feature )
					return { geo: stateUS.geo, feature: feature }
				return null;
			}
		};
	}
	
	function hittestBboxes( features, places, x, y ) {
		for( var place, i = -1;  place = places[++i]; ) {
			var b = place.bbox;
			if( x >= b[0]  &&  x < b[2]  &&  y >= b[1]  &&  y < b[3] )
				return features.by[place.id];
		}
		return null;
	}
	
	var bboxesInsetHI = [
		{ id: '15001', bbox: [ 138,44, 163,67 ] },  // Hawaii
		{ id: '15003', bbox: [ 112,21, 129,47 ] },  // Honolulu
		{ id: '15007', bbox: [ 90,15, 112,42 ] },  // Kauai
		{ id: '15009', bbox: [ 129,29, 151,54 ] }  // Maui
	];
	
	// TODO: refactor this into PolyGonzo
	var outlineOverlay;
	function outlineFeature( where ) {
		if( outlineOverlay )
			outlineOverlay.setMap( null );
		outlineOverlay = null;
		if( !( where && where.feature ) ) return;
		var feat = $.extend( {}, where.feature, {
			fillColor: '#000000',
			fillOpacity: 0,
			strokeWidth: playCounties() ? 5 : opt.counties ? 1.5 : 2.5,
			strokeColor: '#000000',
			strokeOpacity: 1
		});
		outlineOverlay = new PolyGonzo.PgOverlay({
			map: map,
			geos: [{
				crs: where.geo.crs,
				kind: where.geo.kind,
				features: [ feat ]
			}]
		});
		outlineOverlay.setMap( map );
	}
	
	var tipOffset = { x:10, y:20 };
	var $maptip = $('#maptip'), tipHtml;
	if( ! playType() ) {
		$body.bind( 'click mousemove', moveTip );
		$maptip.click( function( event ) {
			if( event.target.id == 'close-tip' ) {
				showTip( false );
				event.preventDefault();
			}
			else if( state == stateUS ) {
				// Only touch devices for now
				var feature = touch && touch.where && touch.where.feature;
				if( feature ) setState( feature, 'tap' );
			}
		});
	}
	
	function showTip( feature ) {
		tipHtml = formatTip( feature );
		if( tipHtml ) {
			$maptip.html( tipHtml ).show();
		}
		else {
			$maptip.hide();
			if( !( touch && touch.mouse ) )
				mouseFeature = null;
		}
	}
	
	function formatCandidateAreaPatch( candidate, max ) {
		var size = Math.round( Math.sqrt( candidate.vsTop ) * max );
		var margin1 = Math.floor( ( max - size ) / 2 );
		var margin2 = max - size - margin1;
		var party = election.parties[candidate.party];
		var color = party && party.color || '#FFFFFF';  // TEMP
		return S(
			'<div style="margin:', margin1, 'px ', margin2, 'px ', margin2, 'px ', margin1, 'px;">',
				formatDivColorPatch( color, size, size ),
			'</div>'
		);
	}
	
	function formatDivColorPatch( color, width, height, border ) {
		border = border || '1px solid #C2C2C2';
		return S(
			'<div style="background:', color, '; width:', width, 'px; height:', height, 'px; border:', border, '">',
			'</div>'
		);
	}
	
	function formatSpanColorPatch( colors, spaces, border ) {
		if( ! colors.push ) colors = [ colors ];
		border = border || '1px solid #C2C2C2';
		return S(
			'<span class="legend-candidate-color" style="border:', border, '; zoom:1;">',
				mapjoin( colors, function( color ) {
					return S(
						'<span class="legend-candidate-color" style="background:', color, '; zoom:1;">',
							repeatString( '&nbsp;', spaces || 6 ),
						'</span>'
					);
				}),
			'</span>'
		);
	}
	
	function formatCandidateIcon( candidate, size ) {
		var border = 'transparent', photo = '';
		if( candidate.id ) {
			border = '#C2C2C2';
			photo = S(
				'background:url(',
					imgUrl( S( 'candidate-photos-', year, '-', size, '.png' ) ),
				'); ',
				'background-position:-',
				election.candidates.by.id[candidate.id].index * size, 'px 0px; '
			);
		}
		return S(
			'<div style="', photo, ' width:', size, 'px; height:', size, 'px; border:1px solid ', border, ';">',
			'</div>'
		);
	}
	
	function setLegend() {
		$('#legend').html( formatLegend() );
	}
	
	function formatLegend() {
		return useSidebar ? formatSidebar() : formatTopbar();
	}
	
	function formatTopbar() {
		var candidatesHTML = '';
		var results = state.delegates;
		if( results ) {
			var topCandidates = getTopCandidates( results, -1, 'delegates', 4 );
			//var top = formatTopbarTopCandidates( topCandidates );
			var candidates =
				topCandidates.length ? _.map( topCandidates, formatTopbarCandidate ) :
				formatTopbarCandidate({});
			candidatesHTML = [ /*top*/ ].concat( candidates ).join('');
		}
		var test = testFlag( results );
		return S(
			'<div id="topbar" style="position:relative;">',
				'<div class="topbar-header" style="float:left;">',
					'<div id="election-title" class="title-text">',
						T('topbarTitle'),
					'</div>',
					'<div id="election-subtitle" class="subtitle-text" style="',
						test ? 'color:red; font-weight:bold;' : '',
					'">',
						test ? T('testData') : T('topbarSubtitle'),
					'</div>',
					'<div class="subtitle-text">',
						T('delegatesAttrib'),
					'</div>',
				'</div>',
				'<div id="topbar-candidates" style="position:relative; float:right;">',
					candidatesHTML,
					'<div style="clear:both;">',
					'</div>',
				'</div>',
				'<div style="clear:both;">',
				'</div>',
			'</div>'
		);
	}
	
	//function formatTopbarTopCandidates( topCandidates ) {
	//	var colors = _.map( topCandidates, function( candidate ) {
	//		return candidate.color;
	//	});
	//	var selected = currentCandidate ? '' : ' selected';
	//	return S(
	//		'<td class="legend-candidate', selected, '" id="legend-candidate-top">',
	//			'<div class="legend-candidate">',
	//				formatSpanColorPatch( colors, 2 ),
	//				'&nbsp;', T('allCandidatesShort'), '&nbsp;',
	//			'</div>',
	//		'</td>'
	//	);
	//}
	
	function formatTopbarCandidate( candidate ) {
		var selected = ( candidate.id === currentCandidate ) ? ' selected' : '';
		var delegates = candidate.delegates;
		if( params.triple ) delegates = 999;
		var party = election.parties[candidate.party];
		var color = party && party.color || '#FFFFFF';  // TEMP
		return S(
			'<div style="float:left; padding:6px 3px 1px 9px;">',
				'<table cellpadding="0" cellspacing="0">',
					'<tr class="legend-candidate', selected, '" id="legend-candidate-', candidate.id, '">',
						'<td class="left">',
							'<div class="topbar-delegates" style="text-align:center; margin:-1px 0 0 2px;">',
								delegates == null ? ' ' : delegates,
							'</div>',
							'<div style="margin-left:2px;">',
								formatDivColorPatch(
									color || 'white',
									delegates < 100 ? 23 : delegates < 1000 ? 34 : 45,
									12, '1px solid transparent'
								),
							'</div>',
						'</td>',
						'<td>',
							'<div style="padding:2px 1px;">',
								formatCandidateIcon( candidate, 32 ),
							'</div>',
						'</td>',
						'<td class="right">',
							'<div class="candidate-name" style="margin-right:2px;">',
								'<div class="first-name">',
									candidate.firstName || '&nbsp;',
								'</div>',
								'<div class="last-name">',
									candidate.lastName || '&nbsp;',
								'</div>',
							'</div>',
						'</td>',
					'</tr>',
				'</table>',
			'</div>'
		);
	}
	
	function nameCase( name ) {
		return name && _.map( name.split(' '), function( word ) {
			return word.slice( 0, 1 ) + word.slice( 1 ).toLowerCase();
		}).join(' ');
	}
	
	function testFlag( results ) {
		return !!( debug && results && ( results.mode == 'test'  ||  opt.randomized ) );
	}
	
	function viewUsEnabled() {
		return state != stateUS  &&  usEnabled();
	}
	
	function formatSidebar() {
		// TODO: refactor with formatTopbar()
		var headerHTML = '';
		var scrollingHTML = '';
		var results = state.getResults();
		if( results ) {
			var test = testFlag( results );
			$('#testlabel').css({ color:'red' }).toggle( test );
			var viewUSA = viewUsEnabled() ? S(
				'<div style="padding-bottom:6px;">',
					'<a href="#" id="viewUSA" title="', T('titleViewUSA'), '" style="">',
						T('viewUSA'),
					'</a>',
				'</div>'
			) : '';
			var reporting = totalReporting( state.getResults() );
			headerHTML = S(
				'<div id="percent-reporting" class="body-text">',
					reporting.counted == 0 ? T( 'waitingForVotes' ) :
					state != stateUS ? T( 'percentReporting', reporting ) :
					'',
				'</div>',
				'<div id="auto-update" class="subtitle-text">',
					T('automaticUpdate'),
				'</div>',
				viewUSA
			);
			var contest = params.contest;
			if(
			   state == stateUS  &&
			   ( contest == 'house'  ||  contest == 'senate'  ||  contest == 'governor' )
			) {
				scrollingHTML = renderControlPane(
					contest,
					election.seats[contest],
					trends[contest]
				);
			}
			else {
				var sortBy = ( params.contest == 'president' ? 'electoralVotes' : 'votes' );
				var topCandidates = getTopCandidates( results, -1, sortBy );
				var none = ! topCandidates.length;
				var candidates = _.map( topCandidates, formatSidebarCandidate );
				var top = none ? '' : formatSidebarTopCandidates( topCandidates.slice( 0, 4 ) );
				scrollingHTML = none ? '' : S(
					formatCandidateList(
						[ top ].concat( candidates ),
						function( candidate ) {
							return candidate;
						},
						false
					),
					formatElectoralVotesFlavorTextHTML(params.contest, state),
					formatToggleCandidatesLinkHTML()
				);
			}
		}
		var linkHTML = !(
			params.usa ||
			params.hide_links ||
			params.embed_state
		) ? S(
			'<a href="http://www.google.com/elections/ed/us/results/2012/',
					params.contest,
					'/',
					state.abbr.toLowerCase(),
					'" target="_parent" id="linkToMap" class="small-text" title="',
					T('linkToMapTitle'), '">',
				T('linkToMap'),
			'</a>'
		) : '';
		return S(
			'<div id="sidebar">',
				'<div class="sidebar-header">',
					'<div id="election-title" class="title-text">',
						state.electionTitle,
					'</div>',
					'<div id="auto-update" class="subtitle-text">',
						state.electionSubTitle,
					'</div>',
					'<div id="sidebar-results-header">',
						headerHTML,
					'</div>',
				'</div>',
				'<div class="scroller" id="sidebar-scroll">',
					scrollingHTML,
					'<div id="map-link" class="small-text" style="padding:8px 4px 4px 4px;">',
						linkHTML,
					'</div>',
				'</div>',
			'</div>'
		);
	}

	// Returns flavor text about electoral college votes if we're looking at
	// presidential race and national map.  Otherwise, blank.
	function formatElectoralVotesFlavorTextHTML(contest, state) {
		if (contest == 'president' && state == stateUS) {
			return S(
				'<div class="small-text faint-text" style="padding:8px 4px 4px 4px;">',
				T( 'electoralVotesToWin', { count: election.seats.electoralVotesToWin } ),
				'</div>'
			);
		}
		return '';
	}
	
	// Returns HTML for toggle show all candidates link, using text 
	// 'Show all candidates' or 'Show fewer candidates' based on current
	// state of params.  If we shouldn't show the link, hides it.
	function formatToggleCandidatesLinkHTML() {
		if (shouldShowToggleShowAllCandidatesLink()) {
			return S(
				'<div style="padding:4px;">',
					'<a href="#" id="toggleShowAllCandidates">',
						formatToggleCandidatesText(),
					'</a>',
				'</div>'
			);
		}
		return '';
	}

	function formatToggleCandidatesText() {
		return params.showall == 'true' ? T('showFewerCandidates') : T('showAllCandidates');
	}

	function formatSidebarTopCandidates( topCandidates ) {
		//var colors = _.map( topCandidates, function( candidate ) {
		//	var party = election.parties[candidate.party];
		//	var color = party && party.color || '#FFFFFF';  // TEMP
		//	return color;
		//});
		var selected = currentCandidate ? '' : ' selected';
		return S(
			'<tr class="legend-candidate', selected, '" id="legend-candidate-top" title="', T('clickForAllCandidatesMap'), '">',
				//'<td class="left">',
				//	'<div class="legend-candidate">',
				//		formatSpanColorPatch( colors, 2 ),
				//	'</div>',
				//'</td>',
				'<td class="left">',
					'<div class="legend-candidate">',
						T('candidate'),
					'</div>',
				'</td>',
				'<td>',
					'<div class="legend-candidate" style="font-size:70%; text-align:center; white-space:pre;">',
						T('popularVote'),
					'</div>',
				'</td>',
				'<td class="right">',
					'<div class="legend-candidate" style="font-size:70%; white-space:pre; text-align: right;">',
						T('electoral'),
					'</div>',
				'</td>',
			'</tr>'
		);
	}
	
	function formatSidebarCandidate( candidate ) {
		var selected = ( candidate.id == currentCandidate ) ? ' selected' : '';
		var party = election.parties[candidate.party];
		var color = party && party.color || '#FFFFFF';  // TEMP
		var zero = (
				candidate.electoralVotes  ||
				candidate.party == 'GOP'  ||
				candidate.party == 'Dem'
			) ? '' : ' zero';
		return S(
			'<tr class="legend-candidate', selected, zero, '" id="legend-candidate-', candidate.id, '" title="', T('clickForHeatMap'), '">',
				//'<td class="left">',
				//	'<div class="legend-candidate">',
				//		formatSpanColorPatch( color, 8 ),
				//	'</div>',
				//'</td>',
				'<td>',
					'<div class="legend-candidate" style="color:', color, '">',
						'<div>',
							candidate.firstName,
						'</div>',
						'<div style="font-weight:bold;">',
							candidate.lastName,
						'</div>',
					'</div>',
				'</td>',
				'<td>',
					'<div class="legend-candidate" style="text-align:right;">',
						'<div style="xfont-size:110%; font-weight:bold;">',
							formatPercent( candidate.vsAll ),
						'</div>',
						'<div>',
							formatNumber( candidate.votes ),
						'</div>',
					'</div>',
				'</td>',
				'<td class="right">',
					'<div class="legend-candidate" style="font-size:110%; text-align:right; color:', color, '">',
						boldNonzero( candidate.electoralVotes ),
					'</div>',
				'</td>',
			'</tr>'
		);
	}
	
	function formatCandidateList( topCandidates, formatter, header ) {
		if( ! topCandidates.length )
			return T('waitingForVotes');
		var thead = header ? S(
			'<tr>',
				'<th colspan="3" style="text-align:left; padding-bottom:4px;">',
					T('candidate'),
				'</th>',
				'<th style="text-align:right; padding-bottom:4px;">',
					T('votes'),
				'</th>',
				'<th style="text-align:right; padding-bottom:4px;">',
					state == stateUS  &&  params.contest == 'president' ? T('electoralVotesAbbr') : '',
				'</th>',
			'</tr>'
		) : '';
		return S(
			'<table class="candidates" cellpadding="0" cellspacing="0">',
				thead,
				mapjoin( topCandidates, formatter ),
			'</table>'
		);
	}
	
	function formatListCandidate( candidate, i ) {
		var selected = ( candidate.id == currentCandidate ) ? ' selected' : '';
		var cls = i === 0 ? ' first' : '';
		var pct = formatPercent( candidate.vsAll );
		return S(
			'<tr class="legend-candidate', cls, '" id="legend-candidate-', candidate.id, '">',
				'<td class="left">',
					election.photos ? S(
						'<div style="margin:6px 0;">',
							formatCandidateIcon( candidate, 32 ),
						'</div>'
					) : '',
				'</td>',
				'<td>',
					'<div class="candidate-name" style="',
								election.photos ? '' : 'margin-top:4px; margin-bottom:4px;',
							'">',
						'<div class="first-name">',
							candidate.firstName,
						'</div>',
						'<div class="last-name" style="font-weight:bold;">',
							candidate.lastName,
						'</div>',
					'</div>',
				'</td>',
				'<td style="text-align:center;">',
					formatCandidateAreaPatch( candidate, 24 ),
				'</td>',
				'<td style="text-align:right; padding-left:6px;">',
					'<div class="candidate-percent">',
						pct,
					'</div>',
					web() ? S(
						'<div class="candidate-votes">',
							formatNumber( candidate.votes ),
						'</div>'
					) : '',
				'</td>',
				'<td class="right" style="text-align:right; padding-left:6px;">',
					state == stateUS  &&  view != 'county' ? S(
						'<div class="candidate-delegates">',
							boldNonzero( candidate.electoralVotes ),
						'</div>'
					) : '',
				'</td>',
			'</tr>'
		);
	}
	
	var lsadFormats = {
		cd: 'district',
		city: 'city',
		county: 'county',
		shd: 'district'
	};
	
	function formatFeatureName( feature ) {
		if( ! feature ) return '';
		var s = State( feature );
		if( params.contest == 'house' ) {
			// TODO: localize
			return feature.district == 'AL' ?
				S( s.name, ' (one district)' ) :
				S( s.name, ' district ', feature.district );
		}
		var lsad = ( feature.lsad || '' ).toLowerCase();
		var format = ( s.formats || lsadFormats )[lsad] || 'name';
		var name = T( format, { name: feature.name } );
		return(
			featureIsState(feature) ? states.by.nameEN[name].name :
			state != stateUS ? name :
			S( name, ', ', s.abbr )
		);
	}
	
	function featureIsState( feature ) {
		return /^0400000US/.test( feature.id );
	}
	
	function formatTip( feature ) {
		if( ! feature ) return null;
		var fips = feature.fips;
		var st = State( feature.fips.slice(0,2) );
		var results = state.getResults();
		var result = featureResult( results, feature );
		var top = [];
		if( mayHaveResults(result) ) {
			result.fips = fips;
			result.state = st;
			var sortBy = (
				state == stateUS  &&  params.contest == 'president' ?
				'electoralVotes' :
				'votes'
			);
			top = getTopCandidates( results, result, sortBy, /*useSidebar ? 0 :*/ 4 );
			var content = S(
				'<div class="tipcontent">',
					formatCandidateList( top, formatListCandidate, true ),
				'</div>'
			);
			
			var boxes = result.precincts;
			var counted = result.counted;
		}
		
		var reporting =
			boxes ? T( 'percentReporting', {
				percent: formatPercent( counted / boxes ),
				counted: counted,
				total: boxes,
				kind: ''
			}) :
			noElectionParty( fips ) ? T('noElectionHere') :
			state == stateUS  ||  ! results ? T('waitingForVotes') :
			result ? T('noVotesHere') :
			T('neverVotesHere');
		
		var clickForLocal =
			top.length && state == stateUS ? S(
				'<div class="click-for-local faint-text">',
					T( touch ? 'tapForLocal' : 'clickForLocal' ),
				'</div>'
			) : '';
		// TODO
		var parent = null;  /* data.state.geo &&
			data.state.geo.features.by.id[feature.parent]; */
		
		var test = testFlag( results );
		
		var closebox = touch ? S(
			'<div style="position:absolute; right:6px; top:6px;">',
				'<a href="#">',
					'<img id="close-tip" border="0" style="width:24px; height:24px;" src="', imgUrl('close.png'), '" />',
				'</a>',
			'</div>'
		) : '';
		
		return S(
			'<div class="tiptitlebar">',
				'<div style="float:left;">',
					'<span class="tiptitletext">',
						formatFeatureName( feature ),
						//debug ? S(
						//	'<br>geo id: ', feature.id,
						//	'<br>ft id: ', row[col.ID]
						//) : '',
						' ',
					'</span>',
				'</div>',
				closebox,
				'<div style="clear:left;">',
				'</div>',
				parent ? ' ' + parent.name : '',
				parent && debug ? ' (#' + parent.id + ')' : '',
				'<div class="tipreporting">',
					reporting,
					test ? S(
						'<span style="color:red; font-weight:bold; font-size:100%;"> ',
							T('testData'),
						'</span>'
					) : '',
				'</div>',
			'</div>',
			content,
			clickForLocal
		);
	}
	
	function moveTip( event ) {
		if( ! tipHtml ) return;
		if( touch ) {
			if( ! touch.moveTip ) return;
			delete touch.moveTip;
		}
		var x = event.pageX, y = event.pageY;
		if(
			x < mapPixBounds.left  ||
			x >= mapPixBounds.right  ||
			y < mapPixBounds.top  ||
			y >= mapPixBounds.bottom
		) {
			showTip( false );
		}
		x += tipOffset.x;
		y += tipOffset.y;
		var pad = 2;
		var width = $maptip.width(), height = $maptip.height();
		var offsetLeft = width + tipOffset.x * 2;
		var offsetTop = height + tipOffset.y * 2;
		
		if( x + width > ww - pad ) {
			x -= width + pad + tipOffset.x * 2;
		}
		if( x < pad ) {
			x = pad;
		}
		
		if( y + height > wh - pad )
			y -= height + pad + tipOffset.y * 2;
		if( y < pad )
			y = wh - pad - height - tipOffset.y * 2;
		
		$maptip.css({ left:x, top:y });
	}
	
	// TODO: rewrite this
	function formatNumber( nStr ) {
		var dsep = T('decimalSep'), tsep = T('thousandsSep');
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? dsep + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while( rgx.test(x1) ) {
			x1 = x1.replace( rgx, '$1' + tsep + '$2' );
		}
		return x1 + x2;
	}
	
	function formatPercent( n ) {
		return percent1( n, T('decimalSep') );
	}
	
	function boldNonzero( n ) {
		return n ? S( '<b>', n, '</b>' ) : n;
	}
	
	function setState( s, why ) {
		if( ! s ) return;
		s = State( s );
		if( ! s.abbr ) return;
		if( s == state ) return;
		stopCycle();
		if( s == stateUS ) currentCandidate = 0;
		state = s;
		//var select = $('#stateSelector')[0];
		//if( select ) select.selectedIndex = state.selectorIndex;
		//opt.state = state.abbr.toLowerCase();
		geoMoveNext = true;
		//setCounties( state.fips != '00' );
		loadView();
		if( why ) analytics( why, 'state', state.abbr );
	}
	
	var mapStyles = [
		{
			stylers: [ { saturation: -25 } ]
		},{
			featureType: "road",
			elementType: "labels",
			stylers: [ { visibility: "off" } ]
		},{
			featureType: "road",
			elementType: "geometry",
			stylers: [ { lightness: 50 }, { saturation: 10 }, { visibility: "simplified" } ]
		},{
			featureType: "transit",
			stylers: [ { visibility: "off" } ]
		},{
			featureType: "landscape",
			stylers: [ { lightness: 100 }, { saturation: -100 } ]
		},{
			featureType: "administrative",
			elementType: "geometry",
			stylers: [ { visibility: "off" } ]
		},{
			featureType: "administrative.country",
			elementType: "labels",
			stylers: [ { visibility: "off" } ]
		//},{
		//	featureType: "administrative",
		//	stylers: [ { visibility: "off" } ]
		//},{
		//	featureType: "administrative.locality",
		//	stylers: [ { visibility: "on" } ]
		},{
			featureType: "poi.park",
			elementType: "geometry",
			stylers: [{ lightness: 60 }]
		}
	];
	
	function initMap() {
		if( map ) return;
		gm = google.maps, gme = gm.event;
		mapPixBounds = $('#map').bounds();
		var mapopt = $.extend({
			mapTypeControl: false,
			mapTypeId: 'simple',
			streetViewControl: false,
			panControl: false,
			rotateControl: false
		},
		params.play ? {
			zoomControl: false
		} : {
			zoomControlOptions: {
				//position: gm.ControlPosition.TOP_RIGHT,
				style: gm.ZoomControlStyle.SMALL
			}
		});
		map = new gm.Map( $('#map')[0],  mapopt );
		var mapType = new gm.StyledMapType( mapStyles );
		map.mapTypes.set( 'simple', mapType );
		addMapListeners( map );
		
		//if( ! PolyGonzo.isVML() ) {
		//	gme.addListener( map, 'zoom_changed', function() {
		//		var oldZoom = zoom;
		//		zoom = map.getZoom();
		//		if( zoom > oldZoom  &&  zoom >= 7 )
		//			setCounties( true );
		//		else if( zoom < oldZoom  &&  zoom < 7 )
		//			setCounties( false );
		//	});
		//}
	}
	
	//function enableStateContests() {
	//	var okSelection = true;
	//	$('#stateSelector option').each( function( i, option ) {
	//		if( ! option.value ) return;
	//		var enable = params.contest == 'house'  ||
	//			!! electionids.byStateContest( option.value, params.contest );
	//		enableOption( option, enable );
	//		if( ! enable  &&  option.selected ) {
	//			okSelection = false;
	//		}
	//	});
	//	if( ! okSelection ) {
	//		setState( '00', 'select' );
	//	}
	//}
	
	function initSelectors() {
		
		//setState( opt.state );
		
		//$('#stateSelector').bindSelector( 'change keyup', function() {
		//	setState( this.value, 'select' );
		//});
		
		$('#contestSelector').bindSelector( 'change keyup', function() {
			params.contest = this.value;
			//enableStateContests();
			loadView();
		});
		
		var $selectors = $('#selectors');
		$selectors.delegate( 'a.button', {
			click: function( event ) {
				params.contest = this.id.split('-')[1];
				$selectors.find('a.button').removeClass( 'selected' );
				$(this).addClass( 'selected' );
				loadView();
			}
		});
		
		//$('#chkCounties').click( function() {
		//	setCounties( this.checked );
		//});
		
		var $legend = $('#legend');
		$legend.delegate( 'tr.legend-candidate', {
			mouseover: function( event ) {
				$(this).addClass( 'hover' );
			},
			mouseout: function( event ) {
				$(this).removeClass( 'hover' );
			},
			click: function( event ) {
				var id = this.id.split('-')[2];
				if( id == 'top'  ||  id == currentCandidate ) id = null;
				$('#chkCycle').prop({ checked:false });
				stopCycle();
				setCandidate( id, 'click' );
			}
		});
		
		$legend.delegate( 'a', {
			mouseover: function( event ) {
				$(this).addClass( 'hover' );
			},
			mouseout: function( event ) {
				$(this).removeClass( 'hover' );
			}
		});
		
		$legend.delegate( '#viewUSA', {
			click: function( event ) {
				setState( '00', 'return' );
				event.preventDefault();
			}
		});
		
		$legend.delegate( '#toggleShowAllCandidates', {
			click: function( event ) {
				if (params.showall == 'true') {
					params.showall = 'false';
					$('table.candidates tr.zero').hide();
				} else {
					params.showall = 'true';
					$('table.candidates tr.zero').show();
				}
				$(this).html(formatToggleCandidatesText());
				event.preventDefault();
			}
		});
		
		$legend.delegate( '#btnCycle', {
			click: function( event ) {
				toggleCycle();
			}
		});
		
		setCandidate = function( id, why ) {
			currentCandidate = id;
			loadView();
			if( why ) analytics( why, 'candidate', id || 'all' );
		}
	}
	
	function toggleCycle() {
		if( opt.cycleTimer ) stopCycle();
		else startCycle();
	}
	
	var startCycleTime;
	function startCycle() {
		if( opt.cycleTimer ) return;
		startCycleTime = now();
		this.title = T('cycleStopTip');
		var player = players.candidates;
		opt.cycleTimer = setInterval( player.tick, 3000 );
		player.tick();
		analytics( 'cycle', 'start' );
	}
	
	function stopCycle() {
		if( ! opt.cycleTimer ) return;
		clearInterval( opt.cycleTimer );
		opt.cycleTimer = null;
		$('#btnCycle')
			.removeClass( 'selected' )
			.prop({ title: T('cycleTip') });
		var seconds = Math.round( ( now() - startCycleTime ) / 1000 );
		analytics( 'cycle', 'stop', '', seconds );
	}
	
	function hittest( latlng ) {
	}
	
	function loadView() {
		showTip( false );
		//overlays.clear();
		//opt.state = +$('#stateSelector').val();
		//var state = curState = data.state.geo.features.by.abbr[opt.abbr];
		$('#spinner').show();
		reloadTimer.clear();
		loadRegion();
	}
	
	var resizeOneshot = oneshot();
	function resizeView() {
		resizeOneshot( resizeViewNow, 250 );
	}
	
	function resizeViewOnly() {
		// TODO: refactor with duplicate code in geoReady()
		ww = $window.width();
		wh = $window.height();
		$body
			.css({ width: ww, height: wh })
			.toggleClass( 'hidelogo', mapWidth < 140 )
			.toggleClass( 'narrow', ww < 770 );
		
		$('#spinner').css({
			left: Math.floor( ww/2 - 64 ),
			top: Math.floor( wh/2 - 20 )
		});
		
		var mapLeft = 0, mapTop = 0, mapWidth = ww, mapHeight = wh;
		if( useSidebar ) {
			mapLeft = sidebarWidth;
			mapWidth -= mapLeft;
			var $sidebarScroll = $('#sidebar-scroll');
			$sidebarScroll.height( wh - $sidebarScroll.offset().top );
		}
		else {
			var topbarHeight = $('#topbar').height() + 1;
			//if( topbarHeight > 50 )  // two rows
			//	$('#topbar-candidates').css({ float:'left' });
			mapTop = topbarHeight;
			mapHeight -= mapTop;
		}
		mapPixBounds = $('#map')
			.css({
				position: 'absolute',
				left: mapLeft,
				top: mapTop,
				width: mapWidth,
				height: mapHeight
			})
			.bounds();
	}
	
	function resizeViewNow() {
		resizeViewOnly();
		moveToGeo();
	}
	
	//function getShapes( state, callback ) {
	//	if( state.shapes ) callback();
	//	else getJSON( 'shapes', opt.shapeUrl, state.abbr.toLowerCase() + '.json', 3600, function( shapes ) {
	//		state.shapes = shapes;
	//		//if( state == stateUS ) shapes.features.state.index('state');
	//		callback();
	//	});
	//}
	
	function objToSortedKeys( obj ) {
		var result = [];
		for( var key in obj ) result.push( key );
		return result.sort();
	}
	
	var blank = imgUrl( 'blank.gif' );
	
	$('body.interactive a.logo')
		.css({ opacity: .5 })
		.mouseover( function() {
			$(this).stop().fadeTo( 250, 1 );
		})
		.mouseout( function() {
			$(this).stop().fadeTo( 500, .5 );
		});
	
	$window
		.bind( 'load', loadView )
		.bind( 'resize', resizeView );
	
	getScript( S(
		location.protocol == 'https:' ? 'https://ssl' : 'http://www',
		'.google-analytics.com/',
		debug ? 'u/ga_debug.js' : 'ga.js'
	) );
	
	analytics( 'map', 'load' );
	
//})( jQuery );
