// barcharts.js
// By Michael Geary - http://mg.to/
// See UNLICENSE or http://unlicense.org/ for public domain notice.

_.extend( templates, {
	barStyles: '\
		div.hbar, div.hseg {\
			height: 15px;\
		}\
		div.hbar {\
			border-left: 1px solid white;\
			position:relative;\
		}\
		div.hnotchwrap {\
			position: absolute;\
			text-align: center;\
			top: 0;\
			left: 0;\
			width: 100%;\
			height: 5px;\
		}\
		div.hnotch {\
			margin: auto;\
			width: 11px;\
			height: 5px;\
			background-image: url(images/notch.png);\
		}\
		div.hbox {\
			width:13px;\
			height:13px;\
			border: 1px solid white;\
		}\
		div.hseg {\
			border-right: 1px solid white;\
			float: left;\
		}\
		/*div.hseg-last {*/\
		/*	border-right: none;*/\
		/*}*/\
		div.hseg-dem {\
			background-color: {{dem}};\
		}\
		div.hseg-ind {\
			background-color: {{ind}};\
		}\
		div.hseg-gop {\
			background-color: {{gop}};\
		}\
		div.hseg-demgop {\
			background-color: {{demgop}};\
		}\
		div.hseg-undecided {\
			background-color: #E0E0E0;\
		}\
		div.hseg-pattern {\
			background-image: url(images/trendsmask.png);\
		}\
		div.hclear {\
			clear: left;\
		}\
		div.control-pane-title, div.control-pane-subtitle {\
			color: #777;\
		}\
		div.control-pane-title {\
			text-align: center;\
			font-size: 20px;\
		}\
		div.control-pane-subtitle {\
			text-align: center;\
			font-size: 12px;\
		}\
		td.control-pane-side {\
			width: 40px;\
			text-align: center;\
		}\
		div.control-pane-total {\
			font-weight: bold;\
			font-size: 16px;\
			line-height: 16px;\
		}\
		div.control-pane-dem {\
			color: {{dem}};\
		}\
		div.control-pane-gop {\
			color: {{gop}};\
		}\
		td.control-pane-barchart {\
			margin-top: 3px;\
		}\
		',
	barNotch: '\
		<div class="hnotchwrap">\
			<div class="hnotch">\
			</div>\
		</div>',
	barSegment: '\
		<div class="hseg {{classes}}" style="width:{{width}}px;">\
		</div>',
	notchBar: '\
		<div class="hbar" style="width:{{width}}px;">\
			{{{segments}}}\
			<div class="hclear">\
			</div>\
			{{{notch}}}\
		</div>',
	controlPane: '\
		<div class="control-pane">\
			<div class="control-pane-title">\
				{{title}}\
			</div>\
			<div class="control-pane-subtitle">\
				{{subtitle}}\
			</div>\
			<table class="control-pane-main">\
				<tr valign="top">\
					<td class="control-pane-side">\
						<div class="control-pane-total control-pane-dem">\
							{{dem.seats}}\
						</div>\
					</td>\
					<td class="control-pane-barchart">\
						{{{barchart}}}\
					</td>\
					<td class="control-pane-side">\
						<div class="control-pane-total control-pane-gop">\
							{{gop.seats}}\
						</div>\
					</td>\
				</tr>\
			</table>\
			<div style="margin:16px 0 4px 8px;">\
				{{{legends}}}\
			</div>\
			<div class="small-text faint-text" style="margin:8px 0 4px 8px;">\
				{{lighterColors}}\
			</div>\
		</div>',
	barLegend: '\
		<div style="position:relative; margin-bottom:3px;">\
			<div class="hbox hseg-{{party}} {{pattern}}" style="float:left; margin-right:4px;">\
			</div>\
			<div class="small-text faint-text" style="float:left;">\
				{{label}}\
			</div>\
			<div style="clear:left;">\
			</div>\
		</div>\
	',
	calledRaceBarLegend: '\
		<div style="position:relative; margin-bottom:3px;">\
			<div style="float:left; margin-right:4px;"> &#10004;</div>\
			<div class="small-text faint-text" style="float:left;">\
				{{label}}\
			</div>\
			<div style="clear:left;">\
			</div>\
		</div>\
	',
        electoralVoteBar: '\
          <div class="legend-candidate-bar">\
            <div class="legend-candidate-bar-outline">\
              <div class="legend-candidate-bar-fill"\
                   style="background-color: {{color}}; width: {{percent}}%;">\
              </div>\
            </div>\
          </div>\
        ',
	_: ''
});

function renderBarStyles() {
	return T( 'barStyles', color );
}

function renderControlBar( a ) {
	var n = {
		segs: [
			{ classes: 'hseg-dem hseg-pattern', value: a.dem.keep || 0 },
			{ classes: 'hseg-dem', value: a.dem.seatsWon || 0 },
			{ classes: 'hseg-undecided', value: a.undecided || 0 },
			{ classes: 'hseg-gop', value: a.gop.seatsWon || 0 },
			{ classes: 'hseg-gop hseg-pattern', value: a.gop.keep || 0 }
		],
		notch: a.notch,
		width: a.width
	};
	return renderNotchBar( n );
}

function renderNotchBar( a ) {
	var total = 0;
	_.each( a.segs, function( seg ) {
		total += seg.value;
	});
	
	var notch = ! a.notch ? '' : T('barNotch');
	
	var segments = mapjoin( a.segs, function( seg ) {
		return ! seg.value ? '' : T( 'barSegment', {
			classes: seg.classes,
			width: a.width * seg.value / total - 1
		});
	});

	return T( 'notchBar', {
		width: a.width + 1,
		segments: segments,
		notch: notch
	});
}

function renderControlPane( contest, seats, trend ) {
	var title = 
		contest == 'house' ? T('controlOfHouse') :
		contest == 'senate' ? T('controlOfSenate') :
		T('governor');
	var subtitle =
		contest == 'governor' ? T( 'countUndecided', { count: trend.undecided } ) :
		T( 'balanceOfPower', { count: Math.ceil( seats.total / 2 ) } );
	var party = trend.parties.by.id;
	function partyGet( id, prop ) { return party[id] && party[id][prop] || 0; }
	// Seats in trends data is the total # of seats including those not up for election.
	function partySeats( id ) { return partyGet( id, 'seats' ); }
	function partySeatsWon( id ) { return partyGet( id, 'seats' ) - notElecting(id); }
	function partyDelta( id ) { return partyGet( id, 'delta' ); }
	function notElecting( id ) {
		return seats.notElecting && seats.notElecting.parties[id] || 0
	}
	function partyStuff( id ) {
		return {
			delta: partyDelta(id),
			seats: partySeats(id),
			seatsWon: partySeatsWon(id),
			keep: notElecting(id)
		};
	}
	function partyLegend( party, pattern, label ) {
		legends.push( T( 'barLegend', {
			party: party.toLowerCase(),
			pattern: pattern ? 'hseg-pattern' : '',
			label: T( label, { party: T( 'partyPlural-' + party ) } )
		}) );
	}
	var legends = [];
	partyLegend( 'Dem', false, 'wonBy' );
	partyLegend( 'GOP', false, 'wonBy' );
	//partyLegend( 'Ind', false, 'wonBy' ),
	if( params.contest == 'senate'  ||  params.contest == 'governor' ) {
		partyLegend( 'Dem', true, 'legendNotUp' );
		partyLegend( 'GOP', true, 'legendNotUp' );
	}
	legends.push( T( 'barLegend', {
		party: 'undecided',
		pattern: '',
		label: T('undecided')
	}) );
	legends.push( T( 'calledRaceBarLegend', {
		label: T('calledRaceLegend')
	}) );
	var v = {
		title: title,
		subtitle: subtitle,
		dem: partyStuff( 'Dem' ),
		gop: partyStuff( 'GOP' ),
		undecided: trend.undecided,
		width: 165,
		notch: contest != 'governor',
		legends: legends.join(''),
		lighterColors: T('lighterColors')
	};
	v.barchart = renderControlBar( v );
	//var center = seats.total / 2;
	return T( 'controlPane', v );
}
