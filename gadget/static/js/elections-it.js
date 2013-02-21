// elections-it.js
// By Michael Geary - http://mg.to/
// See UNLICENSE or http://unlicense.org/ for public domain notice.

function chooseName( s, indexes ) {
	return s[ indexes[params.hl] || indexes[defaultLanguage] ];
}

var coalitionsIT2013 = _.map([
	// id|color|name_en|name_it
	"C|#3366FF|Center-right coalition|Coalizione di centro-destra",
	"I|#DE2910|Italy. Common Good|Italia. Bene Comune",
	"S|#1560BD|With Monti for Italy|Scelta Civica, con Monti per l'Italia",
	"R|#FF6600|Civil Revolution|Rivoluzione Civile",
	"M|#FFFF00|Five Star Movement|Movimento 5 Stelle",
	"D|#E75480|Stop the Decline|Fare per Fermare il Declino"	
], function( s ) {
	s = s.split('|');
	return {
		id: s[0],
		color: s[1],
		fullName: chooseName( s, { en:2, it:3 } )
	};
});

var partiesIT2013 = _.map([
	// id|contests|coalition|color|name_en|name_it
	"BASTA_TASSE|s|",
	"CANTIERE_POPOLARE|s|",
	"CASAPOUND_ITALIA|cs|",
	"CENTRO_DEMOCRATICO|cs|I|#FF9900|Democratic Centre|Centro Democratico",
	"CIVILTA__RURALE_SVILUPPO|s|",
	"COMUNITA__LUCANA|s|",
	"CON_MONTI_PER_L_ITALIA|s|",
	"COSTRUIRE_DEMOCRAZIA|s|",
	"DEMOCRAZIA_ATEA|c|",
	"DIE_FREIHEITLICHEN|c|",
	"DIMEZZIAMO_LO_STIPENDIO_AI_POLITICI|s|",
	"DONNE_PER_L_ITALIA|s|",
	"FARE_PER_FERMARE_IL_DECLINO|cs|D|#E75480|Stop the Decline|Fare per Fermare il Declino",
	"FIAMMA_TRICOLORE|cs|",
	"FORZA_NUOVA|cs|",
	"FRATELLI_D_ITALIA|cs|C|#000099|Brothers of Italy|Fratelli d'Italia - Centrodestra Nazionale",
	"FUTURO_E_LIBERTA_|c|S|#1C39BB|Future and Freedom|Futuro e Libert&agrave;",
	"GRANDE_SUD_-_MPA|c|C|#33CCCC|Great South-MpA|Grande Sud-MpA",
	"GRANDE_SUD|s|",
	"IL_MEGAFONO_-_LISTA_CROCETTA|s|I|#483D8B|The Megaphone|Il Megafono",
	"IL_POPOLO_DELLA_LIBERTA_|cs|C|#0087DC|The People of Freedom|Il Popolo della Libert&agrave;",
	"INDIPENDENZA_PER_LA_SARDEGNA|cs|",
	"INDIPENDENZA_VENETA|cs|",
	"INTESA_POPOLARE|cs|C|#B2FFFF|Popular Agreement|Intesa Popolare",
	"IO_AMO_L_ITALIA|cs|",
	"I_PIRATI|cs|",
	"LA_BASE|s|",
	"LA_DESTRA|cs|C|#030E40|The Right|La Destra",
	"LEGA_NORD|cs|C|#008000|Northern League|Lega Nord",
	"LIBERALI_PER_L_ITALIA_-_PLI|c|",
	"LIBERI_PER_UNA_ITALIA_EQUA|cs|",
	"LIGA_VENETA_REPUBBLICA|cs|",
	"LISTA_AMNISTIA_GIUSTIZIA_LIBERTA_|cs|",
	"MERIS|cs|",
	"MIR_-_MODERATI_IN_RIVOLUZIONE|cs|C|#0087DC|Italian Moderates in Revolution|Moderati Italiani in Rivoluzione",
	"MODERATI|s|I|#0087DC|Moderates for Piedmont|Moderati per il Piemonte",
	"MOVIMENTO_5_STELLE_BEPPEGRILLO.IT|cs|M|#FFFF00|Five Star Movement|Movimento 5 Stelle",
	"MOVIMENTO_EUDONNA|s|",
	"MOVIMENTO_NATURALISTA_ITALIANO|s|",
	"MOVIMENTO_P.P.A.|c|",
	"MOVIMENTO_PROGETTO_ITALIA_-_MID|cs|",
	"MPA_-_PARTITO_DEI_SICILIANI|s|",
	"NO_ALLA_CHIUSURA_DEGLI_OSPEDALI|s|",
	"P.C.I._MARXISTA-LENINISTA|s|",
	"PARTITO_COMUNISTA_DEI_LAVORATORI|cs|",
	"PARTITO_DEL_SUD|s|",
	"PARTITO_DEMOCRATICO|cs|I|#FFA500|Democratic Party|Partito Democratico",
	"PARTITO_DI_ALTERNATIVA_COMUNISTA|cs|",
	"PARTITO_PENSIONATI|cs|C|#4169E1|Pensioners' Party|Partito Pensionati",
	"PARTITO_SARDO_D_AZIONE|cs|",
	"PARTITO_SOCIALISTA_ITALIANO|s|I|#ED1B34|Italian Socialist Party|Partito Socialista Italiano",
	"PAS_-_FLB_LT|s|",
	"POPOLARI_UNITI|cs|",
	"PRI|cs|",
	"PROGETTO_NAZIONALE|cs|",
	"RIALZATI_ABRUZZO|s|",
	"RIFONDAZIONE_MISSINA_ITALIANA|cs|",
	"RIFORMISTI_ITALIANI|cs|",
	"RIVOLUZIONE_CIVILE|cs|R|#FF6600|Civil Revolution|Rivoluzione Civile",
	"SCELTA_CIVICA_CON_MONTI_PER_L_ITALIA|c|S|#1560BD|Civic Choice|Scelta Civica",
	"SINISTRA_ECOLOGIA_LIBERTA_|cs|I|#FF0028|Left Ecology Freedom|Sinistra Ecologia Libert&agrave;",
	"STAMINALI_D_ITALIA|c|",
	"SVP|c|I|#000000|South Tyrolean People's Party|S&uuml;dtiroler Volkspartei",
	"TUTTI_INSIEME_PER_L_ITALIA|cs|",
	"UNIONE_DI_CENTRO|c|S|#273BE2|Union of the Centre|Unione di Centro",
	"UNIONE_PADANA|s|",
	"UNIONE_POPOLARE|c|",
	"VENETO_STATO|cs|",
	"VIVA_L_ITALIA|s|",
	"VOTO_DI_PROTESTA|c"
], function( s ) {
	s = s.split('|');
	return {
		id: s[0],
		contests: s[1] || '',
		coalition: s[2] || '',
		color: s[3] || '#FFFFFF',
		fullName: chooseName( s, { en:4, it:5 } ) || s[0].replace( /_/g, ' ' )
	};
});


var elections = {
	'2013-senate-1': {
		date: '2013-02-25',
		tzHour: +1,
		photos: false,
		candidates: partiesIT2013,
		parties: partiesIT2013,
		electionids: {
			'IT': 3004
		}
	},
	'2013-chamber-1': {
		date: '2013-02-25',
		tzHour: +1,
		photos: false,
		candidates: partiesIT2013,
		parties: partiesIT2013,
		electionids: {
			'IT': 3003
		}
	}
};

