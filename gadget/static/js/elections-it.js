// elections-it.js
// By Michael Geary - http://mg.to/
// See UNLICENSE or http://unlicense.org/ for public domain notice.

function chooseName( s, indexes ) {
	return s[ indexes[params.hl] || indexes[defaultLanguage] ];
}

var coalitionsIT2013 = _.map([
	// id|color|leader|name_en|name_it
	"C|#3366FF|Silvio Berlusconi|Center-Right|Centrodestra",
	"I|#DE2910|Pierluigi Bersani|Italy. Common Good|Italia. Bene Comune",
	"M|#009900|Mario Monti|With Monti for Italy|Con Monti per l'Italia",
	"R|#FF6600|Antonio Ingroia|Civil Revolution|Rivoluzione Civile",
	"F|#FFFF00|Beppe Grillo|Five Star Movement|Movimento 5 Stelle",
	"D|#E75480|Oscar Giannino|Stop the Decline|FARE",
	"X|#AAAAAA||Others|Altri"
], function( s ) {
	s = s.split('|');
	return {
		id: s[0],
		color: s[1],
		leader: s[2],
		fullName: chooseName( s, { en:3, it:4 } ),
		parties: []
	};
});

indexArray( coalitionsIT2013, 'id' );


var partiesIT2013 = _.map([
	// id|coalition|name_en|name_it
	"1|C|Basta Tasse",
	"2|C|Cantiere Popolare",
	"3||Casapound Italia",
	"4|I|Democratic Centre|Centro Democratico",
	"5||Civilta' Rurale Sviluppo",
	"6||Comunita' Lucana",
	"7|M|With Monti for Italy|Con Monti per l'Italia",
	"8||Costruire Democrazia",
	"9||Democrazia Atea",
	"10||Die Freiheitlichen",
	"11||Dimezziamo lo Stipendio ai Politici",
	"12||Donne per l'Italia",
	"13|D|Stop the Decline|Fare per Fermare il Declino",
	"14||Fiamma Tricolore",
	"15||Forza Nuova",
	"16|C|Brothers of Italy|Fratelli d'Italia",
	"17|M|Future and Freedom|Futuro e Libert&agrave;",
	"18|C|Great South|Grande Sud",
	"19||Grande Sud - MPA",
	"20||I Parati",
	"21|I|The Megaphone|Il Megafono - Lista Crocetta",
	"22|C|The People of Freedom|Il Popolo della Libert&agrave;",
	"23||Indipendenza per la Sardegna",
	"24||Indipendenza Veneta",
	"25||Insieme per gli Italiani",
	"26|C|Popular Agreement|Intesa Popolare",
	"27||Io Amo l'Italia",
	"28||Italiani per la Liberta'",
	"29||La Base",
	"30|C|The Right|La Destra",
	"31|C|Northern League|Lega Nord",
	"32||Liberali per l'Italia - PLI",
	"33||Liberi per una Italia Equa",
	"34||Liga Veneta Repubblica",
	"35||Lista Amnistia Giustizia Liberta'",
	"36||Meris",
	"37|C|Italian Moderates in Revolution|MIR - Moderati in Rivoluzione",
	"38|I|Moderates|Moderati",
	"39||Mov.Associativo Italiani all'Estero",
	"40|F|Five Star Movement|Movimento 5 Stelle",
	"41||Movimento Eudonna",
	"42||Movimento Naturalista Italiano",
	"43||Movimento P.P.A.",
	"44||Movimento Progetto Italia - MID",
	"45|C|MPA - Partito dei Siciliani",
	"46||No Alla Chiusura Degli Ospedali",
	"47||P.C.I. Marxista-Leninista",
	"48||Partito Comunista",
	"49||Partito Comunista dei Lavoratori",
	"50||Partito del Sud",
	"51|I|Democratic Party|Partito Democratico",
	"52||Partito di Alternativa Comunista",
	"53|C|Pensioners' Party|Partito Pensionati",
	"54||Partito Sardo d'Azione",
	"55|I|Italian Socialist Party|Partito Socialista Italiano",
	"56||PAS - FLB&amp;LT",
	"57||Popolari Uniti",
	"58||PRI",
	"59||Progetto Nazionale",
	"60||Rialzati Abruzzo",
	"61||Rifondazione Missina Italiana",
	"62||Riformisti Italiani",
	"63|R|Civil Revolution|Rivoluzione Civile",
	"64|M|Civic Choice|Scelta Civica con Monti per l'Italia",
	"65|I|Left Ecology Freedom|Sinistra Ecologia Libert&agrave;",
	"66||Staminali d'Italia",
	"67|I|SVP|SVP",
	"68||Tutti Insieme per l'Italia",
	"69|M|Union of the Centre|Unione di Centro",
	"70||Unione Italiani Sudamerica",
	"71||Unione Padana",
	"72||Unione Popolare",
	"73||USEI",
	"74||Veneto Stato",
	"75||Viva l'Italia",
	"76||Voto di Protesta"
], function( s ) {
	s = s.split('|');
	var coalition = coalitionsIT2013.by.id[ s[1] || 'X' ];
	if( ! s[3] ) s[3] = s[2];
	var party = {
		id: s[0],
		coalition: coalition,
		fullName: chooseName( s, { en:2, it:3 } ) || s[0].replace( /_/g, ' ' )
	};
	coalition.parties.push( party );
	return party;
});

indexArray( partiesIT2013, 'id' );


var elections = {
	'2013-senate-1': {
		date: '2013-02-25',
		tzHour: +1,
		photos: false,
		candidates: coalitionsIT2013,
		parties: partiesIT2013,
		coalitions: coalitionsIT2013,
		electionids: {
			'IT': 3004
		}
	},
	'2013-chamber-1': {
		date: '2013-02-25',
		tzHour: +1,
		photos: false,
		candidates: coalitionsIT2013,
		parties: partiesIT2013,
		coalitions: coalitionsIT2013,
		electionids: {
			'IT': 3003
		}
	}
};

