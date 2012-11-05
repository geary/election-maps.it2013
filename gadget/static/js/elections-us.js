// elections.js
// By Michael Geary - http://mg.to/
// See UNLICENSE or http://unlicense.org/ for public domain notice.

var color = {
	dem: '#0000EE',
	gop: '#EE0000',
	ind: '#592B02',
	demgop: '#9900FF'
};

var elections = {
	2008: {
		dem: {
			tableids: 'TODO',
			candidates: [
				{ color: '#20FF1F', id: 'biden', firstName: 'Joe', lastName: 'Biden', fullName: 'Joe Biden' },
				{ color: '#FFFA00', id: 'clinton', firstName: 'Hillary', lastName: 'Clinton', fullName: 'Hillary Clinton' },
				{ color: '#E4Af95', id: 'dodd', firstName: 'Chris', lastName: 'Dodd', fullName: 'Chris Dodd' },
				{ color: '#FF1300', id: 'edwards', firstName: 'John', lastName: 'Edwards', fullName: 'John Edwards' },
				{ color: '#8A5C2E', id: 'gravel', firstName: 'Mike', lastName: 'Gravel', fullName: 'Mike Gravel' },
				{ color: '#EE00B5', id: 'kucinich', firstName: 'Dennis', lastName: 'Kucinich', fullName: 'Dennis Kucinich' },
				{ color: '#1700E8', id: 'obama', firstName: 'Barack', lastName: 'Obama', fullName: 'Barack Obama' },
				{ color: '#336633', id: 'richardson', firstName: 'Bill', lastName: 'Richardson', fullName: 'Bill Richardson' }
			]
		},
		gop: {
			tableids: {
				IA: '2549421'
			},
			candidates: [
				{ color: '#336633', id: 'giuliani', firstName: 'Rudy', lastName: 'Giuliani', fullName: 'Rudy Giuliani' },
				{ color: '#D50F25', id: 'huckabee', firstName: 'Mike', lastName: 'Huckabee', fullName: 'Mike Huckabee' },
				{ color: '#8A5C2E', id: 'hunter', firstName: 'Duncan', lastName: 'Hunter', fullName: 'Duncan Hunter' },
				{ color: '#3369E8', id: 'mcCain', firstName: 'John', lastName: 'McCain', fullName: 'John McCain' },
				{ color: '#009925', id: 'paul', firstName: 'Ron', lastName: 'Paul', fullName: 'Ron Paul' },
				{ color: '#EEB211', id: 'romney', firstName: 'Mitt', lastName: 'Romney', fullName: 'Mitt Romney' },
				{ color: '#EE00B5', id: 'tancredo', firstName: 'Tom', lastName: 'Tancredo', fullName: 'Tom Tancredo' },
				{ color: '#20FF1F', id: 'thompson', firstName: 'Fred', lastName: 'Thompson', fullName: 'Fred Thompson' }
			]
		}
	},
	2012: {
		gop: {
			tableids: {
				IA: '2458834',
				NH: '2568627'
			},
			tzHour: -4,
			photos: true,
			candidates: [
				{ color: '#DE6310', id: 'bachmann', firstName: 'Michele', lastName: 'Bachmann', fullName: 'Michele Bachmann' },
				{ color: '#666666', id: 'cain', firstName: 'Herman', lastName: 'Cain', fullName: 'Herman Cain' },
				{ color: '#D50F25', id: 'gingrich', firstName: 'Newt', lastName: 'Gingrich', fullName: 'Newt Gingrich' },
				{ color: '#54F1F1', id: 'huntsman', firstName: 'Jon', lastName: 'Huntsman', fullName: 'Jon Huntsman' },
				{ color: '#009925', id: 'paul', firstName: 'Ron', lastName: 'Paul', fullName: 'Ron Paul' },
				{ color: '#3369E8', id: 'perry', firstName: 'Rick', lastName: 'Perry', fullName: 'Rick Perry' },
				{ color: '#A58DF4', id: 'roemer', firstName: 'Buddy', lastName: 'Roemer', fullName: 'Buddy Roemer', skip: true },
				{ color: '#0000FF', id: 'romney', firstName: 'Mitt', lastName: 'Romney', fullName: 'Mitt Romney' },
				{ color: '#AA0C76', id: 'santorum', firstName: 'Rick', lastName: 'Santorum', fullName: 'Rick Santorum' }
			]
		},
		general: {
			tzHour: -4,
			photos: false,
			seats: {
				governor: {
					total: 50,
					beforeElection: { Dem: 20, GOP: 29, Ind: 1 },
					electing: 11,
					notElecting: {
						parties: { Dem: 12, GOP: 26, Ind: 1 },
						states: {
							AK: 'GOP',
							AL: 'Dem',
							AR: 'Dem',
							AZ: 'GOP',
							CA: 'Dem',
							CO: 'Dem',
							CT: 'Dem',
							FL: 'GOP',
							GA: 'GOP',
							HI: 'Dem',
							IA: 'GOP',
							ID: 'GOP',
							IL: 'Dem',
							KS: 'GOP',
							KY: 'Dem',
							LA: 'GOP',
							MA: 'Dem',
							MD: 'Dem',
							ME: 'GOP',
							MI: 'GOP',
							MN: 'Dem',
							MS: 'Dem',
							MT: 'Dem',
							NJ: 'GOP',
							NM: 'GOP',
							NV: 'GOP',
							NY: 'Dem',
							OH: 'GOP',
							OK: 'GOP',
							OR: 'Dem',
							PA: 'GOP',
							RI: 'Ind',
							SC: 'GOP',
							SD: 'GOP',
							TN: 'GOP',
							TX: 'GOP',
							VA: 'GOP',
							WI: 'GOP',
							WY: 'GOP'
						}
					}
				},
				house: {
					total: 435,
					beforeElection: { Dem: 190, GOP: 240 },
					electing: 435
				},
				senate: {
					total: 100,
					beforeElection: { Dem: 51, GOP: 47, Ind: 2 },
					electing: 33,
					notElecting: {
						parties: { Dem: 30, GOP: 37 },
						states: {
							AK: 'DemGOP',
							AL: 'GOP',
							AR: 'DemGOP',
							CO: 'Dem',
							GA: 'GOP',
							IA: 'DemGOP',
							ID: 'GOP',
							IL: 'DemGOP',
							KS: 'GOP',
							KY: 'GOP',
							LA: 'DemGOP',
							NC: 'DemGOP',
							NH: 'DemGOP',
							OK: 'GOP',
							OR: 'Dem',
							SC: 'GOP',
							SD: 'DemGOP'
						}
					}
				},
				// Parties for balance of power chart (Ind includes others)
				validPartiesForBalance: [ 'Dem', 'GOP', 'Ind' ],
				maxElectoralVotes: 538,
				electoralVotesToWin: 270,
				thirdPartyId: "Ind"
			},
			parties: {
				'AIP': { color: color.ind },
				'AmC': { color: color.ind },
				'AmE': { color: color.ind },
				'AmP': { color: color.ind },
				'ATP': { color: color.ind },
				'Cnl': { color: color.ind },
				'Con': { color: color.ind },
				'CST': { color: color.ind },
				'DCG': { color: color.ind },
				'Dem': { color: color.dem },
				'GOP': { color: color.gop },
				'Grn': { color: color.ind },
				'GRP': { color: color.ind },
				'IAP': { color: color.ind },
				'IGr': { color: color.ind },
				'Ind': { color: color.ind },
				'Inp': { color: color.ind },
				'IP': { color: color.ind },
				'IPD': { color: color.ind },
				'JP': { color: color.ind },
				'Lib': { color: color.ind },
				'LUn': { color: color.ind },
				'Mnt': { color: color.ind },
				'NLP': { color: color.ind },
				'NMI': { color: color.ind },
				'NPA': { color: color.ind },
				'NPD': { color: color.ind },
				'Obj': { color: color.ind },
				'Oth': { color: color.ind },
				'PAG': { color: color.ind },
				'PEC': { color: color.ind },
				'PFP': { color: color.ind },
				'Prg': { color: color.ind },
				'Pro': { color: color.ind },
				'PSL': { color: color.ind },
				'RP': { color: color.ind },
				'SCL': { color: color.ind },
				'SEP': { color: color.ind },
				'Soc': { color: color.ind },
				'SPU': { color: color.ind },
				'SWP': { color: color.ind },
				'Una': { color: color.ind },
				'UST': { color: color.ind },
				'WTP': { color: color.ind },
				'WYC': { color: color.ind },
				'': {}
			}
		}
	}
};

var states = [
	{
		fips: '00',
		abbr: 'US',
		name: 'United States',
		bounds: {
			bbox: [ -13885233, 2819924, -7452828, 6340332 ],
			centerLL: [ -95.841534, 38.004972 ]
		},
		type: 'primaries',
		date: '2012',
		electionidPrimary: '2511',
		electionidPrimaryCounties: '2508',
		electionidPrimaryDelegates: '2510',
		votesby: 'state'
	},
	{
		fips: '01',
		abbr: 'AL',
		name: 'Alabama',
		date: '2012-03-13',
		electionidPrimary: '2540'
	},
	{
		fips: '02',
		abbr: 'AK',
		name: 'Alaska',
		type: 'caucus',
		date: '2012-03-06',
		electionidPrimary: '2524'
	},
	{
		fips: '04',
		abbr: 'AZ',
		name: 'Arizona',
		date: '2012-02-28',
		electionidPrimary: '2522'
	},
	{
		fips: '05',
		abbr: 'AR',
		name: 'Arkansas',
		date: '2012-05-22',
		electionidPrimary: '2776'
	},
	{
		fips: '06',
		abbr: 'CA',
		name: 'California',
		date: '2012-06-05',
		electionidPrimary: '2779'
	},
	{
		fips: '08',
		abbr: 'CO',
		name: 'Colorado',
		type: 'caucus',
		date: '2012-02-07',
		electionidPrimary: '2518'
	},
	{
		fips: '09',
		abbr: 'CT',
		name: 'Connecticut',
		votesby: 'town',
		date: '2012-04-24',
		electionidPrimary: '2661'
	},
	{
		fips: '10',
		abbr: 'DE',
		name: 'Delaware',
		date: '2012-04-24',
		electionidPrimary: '2660'
	},
	{
		fips: '11',
		abbr: 'DC',
		name: 'District of Columbia',
		date: '2012-04-03',
		electionidPrimary: '2545'
	},
	{
		fips: '12',
		abbr: 'FL',
		name: 'Florida',
		date: '2012-01-31',
		electionidPrimary: '2516'
	},
	{
		fips: '13',
		abbr: 'GA',
		name: 'Georgia',
		date: '2012-03-06',
		electionidPrimary: '2525'
	},
	{
		fips: '15',
		abbr: 'HI',
		name: 'Hawaii',
		bounds: {
			bbox: [ -17838905, 2145221, -17233301, 2539543 ],
			centerLL: [ -157.529494, 20.575318 ]
		},
		type: 'caucus',
		date: '2012-03-13',
		electionidPrimary: '2541'
	},
	{
		fips: '16',
		abbr: 'ID',
		name: 'Idaho',
		type: 'caucus',
		date: '2012-03-06',
		electionidPrimary: '2526'
	},
	{
		fips: '17',
		abbr: 'IL',
		name: 'Illinois',
		date: '2012-03-20',
		electionidPrimary: '2543'
	},
	{
		fips: '18',
		abbr: 'IN',
		name: 'Indiana',
		date: '2012-05-08',
		electionidPrimary: '2773'
	},
	{
		fips: '19',
		abbr: 'IA',
		name: 'Iowa',
		type: 'caucus',
		date: '2012-01-03',
		electionidPrimary: '2512'
	},
	{
		fips: '20',
		abbr: 'KS',
		name: 'Kansas',
		type: 'caucus',
		date: '2012-03-10',
		electionidPrimary: '2539'
	},
	{
		fips: '21',
		abbr: 'KY',
		name: 'Kentucky',
		date: '2012-05-22',
		electionidPrimary: '2777'
	},
	{
		fips: '22',
		abbr: 'LA',
		name: 'Louisiana',
		date: '2012-03-24',
		electionidPrimary: '2544'
	},
	{
		fips: '23',
		abbr: 'ME',
		name: 'Maine',
		type: 'caucus',
		date: '2012-02-11',
		electionidPrimary: '2521',
		votesby: 'state'
	},
	{
		fips: '24',
		abbr: 'MD',
		name: 'Maryland',
		date: '2012-04-03',
		electionidPrimary: '2546'
	},
	{
		fips: '25',
		abbr: 'MA',
		name: 'Massachusetts',
		date: '2012-03-06',
		electionidPrimary: '2528',
		votesby: 'town',
		fix: {
			"Agawam": "Agawam Town",
			"Amesbury": "Amesbury Town",
			"Barnstable": "Barnstable Town",
			"Braintree": "Braintree Town",
			"Easthampton": "Easthampton Town",
			"Franklin": "Franklin Town",
			"Greenfield": "Greenfield Town",
			"Manchester": "Manchester-by-the-Sea",
			"Methuen": "Methuen Town",
			"Palmer": "Palmer Town",
			"Southbridge": "Southbridge Town",
			"Watertown": "Watertown Town",
			"West Springfield": "West Springfield Town",
			"Weymouth": "Weymouth Town",
			"Winthrop": "Winthrop Town"
		}
	},
	{
		fips: '26',
		abbr: 'MI',
		name: 'Michigan',
		date: '2012-02-28',
		electionidPrimary: '2523'
	},
	{
		fips: '27',
		abbr: 'MN',
		name: 'Minnesota',
		type: 'caucus',
		date: '2012-02-07',
		electionidPrimary: '2519'
	},
	{
		fips: '28',
		abbr: 'MS',
		name: 'Mississippi',
		date: '2012-03-13',
		electionidPrimary: '2542'
	},
	{
		fips: '29',
		abbr: 'MO',
		name: 'Missouri',
		date: '2012-02-07',
		electionidPrimary: '2520'
	},
	{
		fips: '30',
		abbr: 'MT',
		name: 'Montana',
		date: '2012-06-05',
		electionidPrimary: '2780'
	},
	{
		fips: '31',
		abbr: 'NE',
		name: 'Nebraska',
		date: '2012-05-15',
		electionidPrimary: '2775'
	},
	{
		fips: '32',
		abbr: 'NV',
		name: 'Nevada',
		type: 'caucus',
		date: '2012-02-04',
		electionidPrimary: '2517'
	},
	{
		fips: '33',
		abbr: 'NH',
		name: 'New Hampshire',
		fix: {
			"Harts Location": "Hart's Location",
			"Waterville": "Waterville Valley",
			"Wentworth's Location": "3300780740"
		},
		votesby: 'town',
		date: '2012-01-10',
		electionidPrimary: '2513',
		suffixes: {}
	},
	{
		fips: '34',
		abbr: 'NJ',
		name: 'New Jersey',
		date: '2012-06-05',
		electionidPrimary: '2781'
	},
	{
		fips: '35',
		abbr: 'NM',
		name: 'New Mexico',
		date: '2012-06-05',
		electionidPrimary: '2782'
	},
	{
		fips: '36',
		abbr: 'NY',
		name: 'New York',
		date: '2012-04-24',
		electionidPrimary: '2659'
	},
	{
		fips: '37',
		abbr: 'NC',
		name: 'North Carolina',
		date: '2012-05-08',
		electionidPrimary: '2771'
	},
	{
		fips: '38',
		abbr: 'ND',
		name: 'North Dakota',
		type: 'caucus',
		date: '2012-03-06',
		electionidPrimary: '2538',
		votesby: 'district'
	},
	{
		fips: '39',
		abbr: 'OH',
		name: 'Ohio',
		date: '2012-03-06',
		electionidPrimary: '2530'
	},
	{
		fips: '40',
		abbr: 'OK',
		name: 'Oklahoma',
		date: '2012-03-06',
		electionidPrimary: '2531'
	},
	{
		fips: '41',
		abbr: 'OR',
		name: 'Oregon',
		date: '2012-05-15',
		electionidPrimary: '2774'
	},
	{
		fips: '42',
		abbr: 'PA',
		name: 'Pennsylvania',
		date: '2012-04-24',
		electionidPrimary: '2658'
	},
	{
		fips: '44',
		abbr: 'RI',
		name: 'Rhode Island',
		date: '2012-04-24',
		electionidPrimary: '2656'
	},
	{
		fips: '45',
		abbr: 'SC',
		name: 'South Carolina',
		date: '2012-01-21',
		electionidPrimary: '2515'
	},
	{
		fips: '46',
		abbr: 'SD',
		name: 'South Dakota',
		date: '2012-06-05',
		electionidPrimary: '2783'
	},
	{
		fips: '47',
		abbr: 'TN',
		name: 'Tennessee',
		date: '2012-03-06',
		electionidPrimary: '2532'
	},
	{
		fips: '48',
		abbr: 'TX',
		name: 'Texas',
		date: '2012-05-29',
		electionidPrimary: '2778'
	},
	{
		fips: '49',
		abbr: 'UT',
		name: 'Utah',
		date: '2012-06-26',
		electionidPrimary: '2790'
	},
	{
		fips: '50',
		abbr: 'VT',
		name: 'Vermont',
		fix: {
			"Barre Town": "5002303250",
			"Enosburgh": "Enosburg",
			"Ferrisburg": "Ferrisburgh",
			"Newport Town": "5001948925",
			"Rutland Town": "5002161300",
			"St. Albans Town": "5001161750"
		},
		date: '2012-03-06',
		electionidPrimary: '2534'
	},
	{
		fips: '51',
		abbr: 'VA',
		name: 'Virginia',
		date: '2012-03-06',
		electionidPrimary: '2535'
	},
	{
		fips: '53',
		abbr: 'WA',
		name: 'Washington',
		type: 'caucus',
		date: '2012-03-03',
		electionidPrimary: '2536'
	},
	{
		fips: '54',
		abbr: 'WV',
		name: 'West Virginia',
		date: '2012-05-08',
		electionidPrimary: '2772'
	},
	{
		fips: '55',
		abbr: 'WI',
		name: 'Wisconsin',
		date: '2012-04-03',
		electionidPrimary: '2547'
	},
	{
		fips: '56',
		abbr: 'WY',
		name: 'Wyoming',
		type: 'caucus',
		date: '2012-03-10',
		electionidPrimary: '2537',
		votesby: 'state'
	}/*,
	{
		fips: '72',
		abbr: 'PR',
		name: 'Puerto Rico',
		date: '2012-03-18',
		electionidPrimary: ''
	}*/
];

var electionidlist = [
	'2820|president|US',
	'2821|senate|US',
	'2822|house|US',
	'2823|governor|US',
	'2824|president|AL',
	'2825|president|AK',
	'2826|president|AZ',
	'2827|president|AR',
	'2828|president|CA',
	'2829|president|CO',
	'2830|president|CT',
	'2831|president|DC',
	'2832|president|DE',
	'2833|president|FL',
	'2834|president|GA',
	'2835|president|HI',
	'2836|president|ID',
	'2837|president|IL',
	'2838|president|IN',
	'2839|president|IA',
	'2840|president|KS',
	'2841|president|KY',
	'2842|president|LA',
	'2843|president|ME',
	'2844|president|MD',
	'2845|president|MA',
	'2846|president|MI',
	'2847|president|MN',
	'2848|president|MS',
	'2849|president|MO',
	'2850|president|MT',
	'2851|president|NE',
	'2852|president|NV',
	'2853|president|NH',
	'2854|president|NJ',
	'2855|president|NM',
	'2856|president|NY',
	'2857|president|NC',
	'2858|president|ND',
	'2859|president|OH',
	'2860|president|OK',
	'2861|president|OR',
	'2862|president|PA',
	'2863|president|RI',
	'2864|president|SC',
	'2865|president|SD',
	'2866|president|TN',
	'2867|president|TX',
	'2868|president|UT',
	'2869|president|VT',
	'2870|president|VA',
	'2871|president|WA',
	'2872|president|WV',
	'2873|president|WI',
	'2874|president|WY',
	'2875|senate|AZ',
	'2876|senate|CA',
	'2877|senate|CT',
	'2878|senate|DE',
	'2879|senate|FL',
	'2880|senate|HI',
	'2881|senate|IN',
	'2882|senate|ME',
	'2883|senate|MD',
	'2884|senate|MA',
	'2885|senate|MI',
	'2886|senate|MN',
	'2887|senate|MS',
	'2888|senate|MO',
	'2889|senate|MT',
	'2890|senate|NE',
	'2891|senate|NV',
	'2892|senate|NJ',
	'2893|senate|NM',
	'2894|senate|NY',
	'2895|senate|ND',
	'2896|senate|OH',
	'2897|senate|PA',
	'2898|senate|RI',
	'2899|senate|TN',
	'2900|senate|TX',
	'2901|senate|UT',
	'2902|senate|VT',
	'2903|senate|VA',
	'2904|senate|WA',
	'2905|senate|WV',
	'2906|senate|WI',
	'2907|senate|WY',
	'2908|governor|DE',
	'2909|governor|IN',
	'2910|governor|MO',
	'2911|governor|MN',
	'2912|governor|NH',
	'2913|governor|NC',
	'2914|governor|ND',
	'2915|governor|UT',
	'2916|governor|VT',
	'2917|governor|WA',
	'2918|governor|WV',
	'2919|trends|US',
	''
];

var electionids = {};

_.each( electionidlist, function( str ) {
	var f = str.split('|');
	var eid = {
		electionid: f[0],
		contest: f[1],
		state: f[2],
		key: f[2] + '|' + f[1]
	};
	electionids[eid.electionid] = electionids[eid.key] = eid;
});

electionids.byStateContest = function( state, contest ) {
	var eid = electionids[ State( state || 'US' ).abbr + '|' + contest ];
	return eid && eid.electionid;
};
