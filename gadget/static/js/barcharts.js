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
		div.hseg-undecided {\
			background-color: #E0E0E0;\
		}\
		div.hseg-pattern {\
			background-image: url(images/trendsmask.png);\
		}\
		div.hclear {\
			clear: left;\
		}\
		div.control-pane-title, div.control-pane-subtitle, div.control-pane-delta {\
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
		div.control-pane-delta {\
			font-size: 12px;\
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
						<div class="control-pane-delta">\
							({{dem.delta}})\
						</div>\
					</td>\
					<td class="control-pane-barchart">\
						{{{barchart}}}\
					</td>\
					<td class="control-pane-side">\
						<div class="control-pane-total control-pane-gop">\
							{{gop.seats}}\
						</div>\
						<div class="control-pane-delta">\
							({{gop.delta}})\
						</div>\
					</td>\
				</tr>\
			</tr>\
		</table>',
	_: ''
});

function renderBarStyles() {
	return T( 'barStyles', color );
}

function renderControlBar( a ) {
	var n = {
		segs: [
			{ classes: 'hseg-dem hseg-pattern', value: a.dem.keep || 0 },
			{ classes: 'hseg-dem', value: a.dem.seats || 0 },
			{ classes: 'hseg-ind hseg-pattern', value: a.ind.keep || 0 },
			{ classes: 'hseg-ind', value: a.ind.seats || 0 },
			{ classes: 'hseg-undecided', value: a.undecided || 0 },
			{ classes: 'hseg-gop', value: a.gop.seats || 0 },
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
	function partySeats( id ) { return partyGet( id, 'seats' ); }
	function partyDelta( id ) { return partyGet( id, 'delta' ); }
	function notElecting( id ) {
		return seats.notElecting && seats.notElecting.parties[id] || 0
	}
	function partyStuff( id ) {
		return {
			delta: partyDelta(id),
			seats: partySeats(id),
			keep: notElecting(id),
		};
	}
	var v = {
		title: title,
		subtitle: subtitle,
		dem: partyStuff( 'Dem' ),
		gop: partyStuff( 'GOP' ),
		ind: partyStuff( 'Ind' ),
		undecided: trend.undecided,
		width: 165,
		notch: contest != 'governor'
	};
	v.barchart = renderControlBar( v );
	//var center = seats.total / 2;
	return T( 'controlPane', v );
}

