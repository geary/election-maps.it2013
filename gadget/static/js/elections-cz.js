// elections-cz.js
// By Michael Geary - http://mg.to/
// See UNLICENSE or http://unlicense.org/ for public domain notice.

var candidatesCZ2013 = _.map([
	// "color|id|firstName|lastName|fullName|round2"
	"1|#FFEC71|Zuzana|Roithov\u00E1|Zuzana Roithov\u00E1",
	"2|#093970|Jan|Fischer|Jan Fischer",
	"3|#D0B4FF|Jana|Bobo\u0161\u00EDkov\u00E1|Jana Bobo\u0161\u00EDkov\u00E1",
	"4|#B6C431|T\u00E1\u0148a|Fischerov\u00E1|T\u00E1\u0148a Fischerov\u00E1",
	"5|#52A0FF|P\u0159emysl|Sobotka|P\u0159emysl Sobotka",
	"6|#9A0E48|Milo\u0161|Zeman|Milo\u0161 Zeman|true",
	"7|#84B3B0|Vladim\u00EDr|Franz|Vladim\u00EDr Franz",
	"8|#E08E21|Ji\u0159\u00ED|Dienstbier|Ji\u0159\u00ED Dienstbier Jr.",
	"9|#3F21D9|Karel|Schwarzenberg|Karel Schwarzenberg|true"
], function( s ) {
	s = s.split('|');
	return {
		id: s[0],
		color: s[1],
		firstName: s[2],
		lastName: s[3],
		fullName: s[4],
		round2: !! s[5]
	};
});


var elections = {
	'2013-pres-1': {
		date: '2013-01-12',
		tzHour: +1,
		photos: false,
		candidates: candidatesCZ2013,
		parties: candidatesCZ2013,
		electionids: {
			'CZ': 3001
		}
	},
	'2013-pres-2': {
		date: '2013-01-26',
		tzHour: +1,
		photos: false,
		candidates: candidatesCZ2013,
		parties: candidatesCZ2013,
		electionids: {
			'CZ': 3002
		}
	}
};

