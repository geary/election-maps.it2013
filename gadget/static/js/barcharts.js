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
			background-color: blue;\
		}\
		div.hseg-ind {\
			background-color: #444;\
		}\
		div.hseg-gop {\
			background-color: red;\
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
			width: 35px;\
			text-align: center;\
		}\
		div.control-pane-total {\
			text-align: center;\
			font-weight: bold;\
			font-size: 16px;\
			line-height: 16px;\
		}\
		div.control-pane-dem {\
			color: blue;\
		}\
		div.control-pane-gop {\
			color: red;\
		}\
		div.control-pane-delta {\
			text-align: center;\
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
							{{dem.total}}\
						</div>\
						<div class="control-pane-delta">\
							({{dem.delta}})\
						</div>\
					</td>\
					<td class="control-pane-barchart">\
						{{{barchart}}}\
					</td>\
					<td class="control-pane-bar-side">\
						<div class="control-pane-total control-pane-gop">\
							{{gop.total}}\
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
	return T( 'barStyles' );
}

function renderControlBar( a ) {
	var n = {
		segs: [
			{ classes: 'hseg-dem hseg-pattern', value: a.demKeep || 0 },
			{ classes: 'hseg-dem', value: a.dem || 0 },
			{ classes: 'hseg-ind hseg-pattern', value: a.indKeep || 0 },
			{ classes: 'hseg-ind', value: a.ind || 0 },
			{ classes: 'hseg-undecided', value: a.undecided || 0 },
			{ classes: 'hseg-gop', value: a.gop || 0 },
			{ classes: 'hseg-gop hseg-pattern', value: a.gopKeep || 0 }
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
		width: a.width,
		segments: segments,
		notch: notch
	});
}

function renderControlPane( title, seats, trends ) {
	var party = trends.parties.by.id;
	function partyGet( id, prop ) { return party[id] && party[id][prop] || 0; }
	function partySeats( id ) { return partyGet( id, 'seats' ); }
	function partyDelta( id ) { return partyGet( id, 'delta' ); }
	function notElecting( id ) { return seats.notElecting && seats.notElecting[id] || 0 }
	var bar = renderControlBar({
		demKeep: notElecting('Dem'),
		indKeep: notElecting('Ind'),
		gopKeep: notElecting('GOP'),
		dem: partySeats( 'Dem' ),
		ind: partySeats( 'Ind' ),
		gop: partySeats( 'GOP' ),
		width: 180,
		notch: true
	});
	bar.undecided = seats.total - bar.dem - bar.ind - bar.gop;
	var center = seats.total / 2;
	return T( 'controlPane', {
		title: title,
		balance: center,
		subtitle: T( 'balanceOfPower', { count: Math.ceil(center) } ),
		dem: { total: partySeats('Dem'), delta: partyDelta('Dem') },
		ind: { total: partySeats('Ind'), delta: partyDelta('Ind') },
		gop: { total: partySeats('GOP'), delta: partyDelta('GOP') },
		barchart: bar
	});
}

