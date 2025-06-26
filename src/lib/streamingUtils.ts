import { FAKE_STREAMING_CONFIG, getRandomDelay } from "./fakeStreamingConfig";

// Funzione di utilità per simulare ritardi realistici di un LLM
export const simulateRealisticDelay = (): number => {
	if (FAKE_STREAMING_CONFIG.smoothMode) {
		// In modalità fluida, usa delay più costanti
		const avgDelay =
			(FAKE_STREAMING_CONFIG.baseSpeed.min +
				FAKE_STREAMING_CONFIG.baseSpeed.max) /
			2;
		const variation = 5; // Variazione minima di ±5ms
		return avgDelay + (Math.random() * variation * 2 - variation);
	}

	return getRandomDelay(
		FAKE_STREAMING_CONFIG.baseSpeed.min,
		FAKE_STREAMING_CONFIG.baseSpeed.max
	);
};

// Funzione per ottenere chunk size variabile in base al contesto
export const getSmartChunkSize = (
	text: string,
	currentIndex: number
): number => {
	const remainingText = text.slice(currentIndex);

	// Se siamo vicini alla fine di una parola (entro 8 caratteri), completala per fluidità
	const nextSpaceIndex = remainingText.indexOf(" ");
	const nextPunctuationIndex = remainingText.search(/[.,!?;:]/);

	if (nextSpaceIndex !== -1 && nextSpaceIndex <= 8) {
		return nextSpaceIndex + 1; // Include lo spazio
	}

	if (nextPunctuationIndex !== -1 && nextPunctuationIndex <= 5) {
		return nextPunctuationIndex + 1; // Include la punteggiatura
	}

	// Per chunk normali, usa dimensioni leggermente più grandi per fluidità
	return getRandomDelay(
		FAKE_STREAMING_CONFIG.chunkSize.min,
		FAKE_STREAMING_CONFIG.chunkSize.max
	);
};

// Funzione per determinare se dovremmo rallentare (per punteggiatura, fine paragrafo, etc.)
export const shouldAddPause = (text: string, currentIndex: number): number => {
	if (currentIndex >= text.length) return 0;

	const char = text[currentIndex - 1];
	const nextChars = text.slice(currentIndex, currentIndex + 3);

	// In modalità fluida, riduci drasticamente le pause
	if (FAKE_STREAMING_CONFIG.smoothMode) {
		// Solo pause molto brevi per i paragrafi
		if (char === "\n" && nextChars.startsWith("\n")) {
			return getRandomDelay(150, 250); // Pause più brevi per paragrafi
		}

		// Pause minime per punti importanti
		if ([".", "!", "?"].includes(char)) {
			return getRandomDelay(80, 150); // Pause molto ridotte
		}

		return 0; // Nessuna altra pausa
	}

	// Modalità normale (solo pause importanti)

	// Pausa dopo doppio a capo (nuovo paragrafo) - mantieni questa
	if (char === "\n" && nextChars.startsWith("\n")) {
		return getRandomDelay(
			FAKE_STREAMING_CONFIG.punctuationPauses.paragraph.min,
			FAKE_STREAMING_CONFIG.punctuationPauses.paragraph.max
		);
	}

	// Pausa dopo punto, punto esclamativo, punto interrogativo - ridotta
	if ([".", "!", "?"].includes(char)) {
		const config =
			char === "."
				? FAKE_STREAMING_CONFIG.punctuationPauses.period
				: char === "!"
				? FAKE_STREAMING_CONFIG.punctuationPauses.exclamation
				: FAKE_STREAMING_CONFIG.punctuationPauses.question;
		return getRandomDelay(config.min, config.max);
	}

	// Solo pause molto brevi per i line break
	if (char === "\n") {
		return getRandomDelay(
			FAKE_STREAMING_CONFIG.punctuationPauses.newLine.min,
			FAKE_STREAMING_CONFIG.punctuationPauses.newLine.max
		);
	}

	return 0; // Nessuna pausa extra per maggiore fluidità
};

// Debug helper
export const debugLog = (message: string, data?: any) => {
	if (FAKE_STREAMING_CONFIG.debug) {
		console.log(`[Fake Streaming] ${message}`, data || "");
	}
};
