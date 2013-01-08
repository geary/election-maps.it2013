// elections-cz.js
// By Michael Geary - http://mg.to/
// See UNLICENSE or http://unlicense.org/ for public domain notice.

var candidatesCZ2013 = _.map([
	// "color|id|firstName|lastName|fullName"
	"#81C57A|1|Zuzana|Roithov\u00E1|Zuzana Roithov\u00E1",
	"#814A19|2|Jan|Fischer|Jan Fischer",
	"#2A4BD7|3|Jana|Bobo\u0161\u00EDkov\u00E1|Jana Bobo\u0161\u00EDkov\u00E1",
	"#8126C0|4|T\u00E1\u0148a|Fischerov\u00E1|T\u00E1\u0148a Fischerov\u00E1",
	"#29D0D0|5|P\u0159emysl|Sobotka|P\u0159emysl Sobotka",
	"#FF9233|6|Milo\u0161|Zeman|Milo\u0161 Zeman",
	"#9DAFFF|7|Vladim\u00EDr|Franz|Vladim\u00EDr Franz",
	"#1D6914|8|Ji\u0159\u00ED|Dienstbier|Ji\u0159\u00ED Dienstbier Jr.",
	"#AD2323|9|Karel|Schwarzenberg|Karel Schwarzenberg"
], function( s ) {
	s = s.split('|');
	return {
		color: s[0],
		id: s[1],
		firstName: s[2],
		lastName: s[3],
		fullName: s[4]
	};
});


var elections = {
	'2013': {
		date: '2013-01-12',
		tzHour: +1,
		photos: false,
		candidates: candidatesCZ2013,
		parties: candidatesCZ2013,
		electionids: {
			'CZ': 3001
		}
	}
};

