// Configurazione per il fake streaming
export const FAKE_STREAMING_CONFIG = {
	// Delay iniziale prima di iniziare lo streaming (simula il "thinking time")
	initialDelay: {
		min: 300,
		max: 800,
	},

	// Velocità di base dello streaming (millisecondi) - più veloce e meno variabile
	// baseSpeed: {
	// 	min: 15,
	// 	max: 35,
	// },
	baseSpeed: {
		min: 12,
		max: 12,
	},

	// Dimensione dei chunk (caratteri per volta) - chunk più grandi per fluidità
	chunkSize: {
		min: 3,
		max: 8,
	},

	// Pause extra per la punteggiatura - ridotte per meno scatti
	punctuationPauses: {
		comma: { min: 20, max: 50 }, // ,
		semicolon: { min: 1, max: 2 }, // ;
		colon: { min: 25, max: 60 }, // :
		period: { min: 50, max: 120 }, // .
		exclamation: { min: 50, max: 120 }, // !
		question: { min: 50, max: 120 }, // ?
		newLine: { min: 20, max: 70 }, // \n
		paragraph: { min: 80, max: 180 }, // \n\n
	},
	// punctuationPauses: {
	// 	comma: { min: 50, max: 120 }, // ,
	// 	semicolon: { min: 60, max: 140 }, // ;
	// 	colon: { min: 60, max: 140 }, // :
	// 	period: { min: 120, max: 250 }, // .
	// 	exclamation: { min: 120, max: 250 }, // !
	// 	question: { min: 120, max: 250 }, // ?
	// 	newLine: { min: 50, max: 150 }, // \n
	// 	paragraph: { min: 200, max: 400 }, // \n\n
	// },

	// Abilita/disabilita il fake streaming (utile per testing)
	enabled: true,

	// File da cui leggere la risposta
	responseFile: "response.md",

	// Abilita logs di debug
	debug: true,

	// Modalità fluida: riduce la variabilità dei delay per uno streaming più costante
	smoothMode: true,

	// Auto-redirect dopo il completamento dello streaming (raccomandato: false per demo)
	autoRedirect: false,
};

// Utility per ottenere un delay casuale nell'intervallo specificato
export const getRandomDelay = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
