// results-gadget.js
// By Michael Geary - http://mg.to/
// See UNLICENSE or http://unlicense.org/ for public domain notice.

// Parse the query string in a URL and return an object of
// the key=value pairs.
// Example:
//     var url = 'http://example.com/test?a=b&c=d'
//     var p = parseQuery(url);
// Now p contains { a:'b', c:'d' }
function parseQuery( query ) {
	if( query == null ) return {};
	if( typeof query != 'string' ) return query;

	var params = {};
	if( query ) {
		var array = query.replace( /^[#?]/, '' ).split( '&' );
		for( var i = 0, n = array.length;  i < n;  ++i ) {
			var p = array[i].split( '=' ),
				key = decodeURIComponent( p[0] ),
				value = decodeURIComponent( p[1] );
			if( key ) params[key] = value;
		}
	}
	return params;
}

var params = parseQuery( location.search );

var opt = opt || {};

opt.writeScript = function( url, nocache ) {
	document.write(
		'<script src="',
			url,
			nocache ? '?' + (+new Date) : '',
			'">',
		'<\/script>' );
};

function loadStrings( strings ) {
	// There are more strings than templates, so copy templates to strings
	// but let strings override templates
	_.defaults( strings, templates );
	templates = strings;
	_.templateSettings.variable = 'v';
}

function setLanguage() {
	var defaultLanguage = 'cz';
	var supportedLanguages = {
		en: true,
		cz: true/*,
		fr: true,
		nl: true*/
	};
	var hl = ( params.hl || '' ).toLowerCase();
	if( ! hl  &&  acceptLanguageHeader != '{{acceptLanguageHeader}}' ) {
		var langs = acceptLanguageHeader.split(';')[0].split(',');
		for( var lang, i = -1;  lang = langs[++i]; ) {
			hl = lang.split('-')[0].toLowerCase();
			if( hl in supportedLanguages )
				break;
		}
	}
	if( !( hl in supportedLanguages ) )
		hl = defaultLanguage;
	params.hl = hl;
}
setLanguage();

// Compile a template, trimming whitespace, removing tab characters,
// and converting Mustache-style syntax to Underscore:
// {{escapedValue}}
// {{{unescapedValue}}}
// {{@JavaScriptCode}}
function compileTemplate( template ) {
	var text = $.trim( template.replace( /\t/g, '' ) )
		.replace( /\{\{\{/g, '<%=v.' )
		.replace( /\{\{@/g, '<%' )
		.replace( /\{\{/g, '<%-v.' )
		.replace( /\}\}\}/g, '%>' )
		.replace( /\}\}/g, '%>' )
	return _.template( text );
}

function T( name, args ) {
	if( ! T.templates[name] ) {
		T.templates[name] = compileTemplate( templates[name] );
	}
	return T.templates[name]( args, { variable: 'v' } );
}
T.templates = {};

opt.writeScript( '//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery' + ( opt.debug ? '.js' : '.min.js' ) );

opt.writeScript(
	'//maps.google.com/maps/api/js?v=3&sensor=false&language=' + params.hl + (
	/(^|\.)election-maps.appspot.com/.test(location.hostname) ?
		'&key=AIzaSyBbwxmNf1Sz3ORtmt4SFy5ltFqIFGd2QQg' :
		''
	)
);

//if( params.randomize ) opt.writeScript( 'js/names-1000.js', opt.nocache );

var cc = 'cz';

opt.writeScript( 'js/underscore.js', opt.nocache );
opt.writeScript( 'js/polygonzo.js', opt.nocache );
opt.writeScript( 'js/scriptino.js', opt.nocache );
opt.writeScript( 'js/elections-'+cc+'.js', opt.nocache );
opt.writeScript( 'js/results-templates-us.js', opt.nocache );
opt.writeScript( 'js/barcharts.js', opt.nocache );
opt.writeScript( 'locale/lang-' + params.hl + '.js', opt.nocache );
opt.writeScript( 'js/results-map-'+cc+'.js', opt.nocache );
//opt.writeScript( 'js/results-data-'+cc+'.js', opt.nocache );
