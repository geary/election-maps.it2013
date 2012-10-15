// elections.js
// By Michael Geary - http://mg.to/
// See UNLICENSE or http://unlicense.org/ for public domain notice.

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
			photos: true,
			candidates: [
				{ color: '#0000FF', id: 'obama', firstName: 'Barack', lastName: 'Obama', fullName: 'Barack Obama' },
				{ color: '#FF0000', id: 'romney', firstName: 'Mitt', lastName: 'Romney', fullName: 'Mitt Romney' }
			]
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
