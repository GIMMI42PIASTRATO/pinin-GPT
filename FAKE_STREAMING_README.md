# 🎬 Fake Streaming System

Questo sistema simula l'esperienza di streaming di un LLM reale per demo e video, utilizzando una risposta predefinita dal file `response.md`.

## 🚀 Caratteristiche

-   **Streaming ultra-fluido**: Ottimizzato per velocità e fluidità, meno scatti
-   **Modalità liscia**: `smoothMode` per delay più costanti e naturali
-   **Punteggiatura intelligente**: Pause strategiche solo dove necessario
-   **Chunk size ottimizzato**: 3-8 caratteri per volta per maggiore fluidità
-   **Configurabile**: Tutti i parametri sono personalizzabili
-   **Debug mode**: Log dettagliati per il debugging

## ⚙️ Configurazione

Il file `src/lib/fakeStreamingConfig.ts` contiene tutte le impostazioni:

```typescript
export const FAKE_STREAMING_CONFIG = {
	// Abilita/disabilita il fake streaming
	enabled: true,

	// Modalità fluida per streaming più costante
	smoothMode: true,

	// File da cui leggere la risposta
	responseFile: "response.md",

	// Delay iniziale ridotto (simula "thinking time")
	initialDelay: { min: 300, max: 800 },

	// Velocità ottimizzata (più veloce e costante)
	baseSpeed: { min: 15, max: 35 },

	// Chunk size maggiore per fluidità
	chunkSize: { min: 3, max: 8 },

	// Pause ridotte per meno scatti
	punctuationPauses: {
		comma: { min: 50, max: 120 },
		period: { min: 120, max: 250 },
		// ... pause ottimizzate
	},

	// Debug logs
	debug: false,

	// Auto-redirect disabilitato di default
	autoRedirect: false,
};
```

## 📝 Come utilizzare

1. **Prepara la risposta**: Modifica il file `public/response.md` con la risposta che vuoi streammare
2. **Abilita il fake streaming**: Assicurati che `enabled: true` nella config
3. **Opzionale - Debug**: Imposta `debug: true` per vedere i log dettagliati
4. **Invia una domanda**: Qualsiasi domanda restituirà la risposta dal file

## 🎯 Per i video

-   La risposta in `response.md` supporta **Markdown completo**
-   Include **syntax highlighting** per i blocchi di codice
-   **Pause realistiche** per sembrare un vero LLM
-   **Indicatori visivi** durante il "thinking time"

## 🎯 Ottimizzazioni per video

### 🚄 Modalità liscia (`smoothMode: true`)

-   **Delay costanti**: Variazione minima (±5ms) per fluidità massima
-   **Pause ridotte**: Solo dove strettamente necessario (paragrafi e fine frase)
-   **Streaming veloce**: 15-35ms tra i chunk (vs 20-80ms normale)
-   **Meno scatti**: Eliminata la maggior parte della randomizzazione

### ⚡ Velocità ottimizzata

-   **Chunk più grandi**: 3-8 caratteri per volta (vs 2-7)
-   **Delay iniziale ridotto**: 300-800ms invece di 500-1500ms
-   **Pause strategiche**: Virgole e altri caratteri minori non fanno più pause

### 🎬 Per video perfetti

Per uno streaming ancora più veloce per demo:

```typescript
// Configurazione ultra-veloce per demo
baseSpeed: { min: 10, max: 25 },
chunkSize: { min: 4, max: 10 },
initialDelay: { min: 200, max: 500 },
smoothMode: true,
```

## 🛠️ Personalizzazione

### Velocità di streaming

Modifica `baseSpeed` per velocità generale:

```typescript
baseSpeed: { min: 10, max: 40 }, // Più veloce
baseSpeed: { min: 50, max: 120 }, // Più lento
```

### Pause per punteggiatura

Personalizza le pause:

```typescript
punctuationPauses: {
  period: { min: 500, max: 1000 }, // Pause più lunghe dopo i punti
}
```

### File di risposta personalizzato

Cambia il file sorgente:

```typescript
responseFile: "custom-response.md",
```

## 🐛 Debugging

Abilita i log di debug per vedere il processo in dettaglio:

```typescript
debug: true,
```

I log mostrano:

-   Inizio/fine dello streaming
-   Ogni chunk inviato
-   Delays calcolati
-   Pause per punteggiatura

## 📁 File coinvolti

-   `src/actions/fakeStreaming.ts` - Action server principale
-   `src/lib/fakeStreamingConfig.ts` - Configurazione
-   `src/lib/streamingUtils.ts` - Utility per il timing
-   `src/components/InputPrompt.tsx` - Logica di streaming nel client
-   `src/components/MessageComponent.tsx` - Componenti per visualizzare i messaggi
-   `public/response.md` - Risposta da streammare

## 🔄 Tornare al streaming reale

Per disabilitare il fake streaming:

```typescript
export const FAKE_STREAMING_CONFIG = {
	enabled: false, // Questo disabiliterà il fake streaming
	// ... resto della config
};
```

Oppure modifica il codice in `InputPrompt.tsx` per utilizzare nuovamente `sendQuestion` invece di `sendQuestionFakeStreaming`.

## 🔧 Fix per il Redirect durante lo Streaming

**Problema risolto**: Il messaggio della AI scompariva durante il primo streaming a causa del redirect da `/chat` a `/chat/[chatId]`.

**Soluzione implementata**:

1. **Auto-redirect disabilitato** di default (`autoRedirect: false`)
2. **Redirect posticipato** al completamento dello streaming (quando abilitato)
3. **Stato preservato** durante il processo di streaming
4. **UX migliorata** per demo e video

### Configurazioni disponibili:

```typescript
// Per demo (raccomandato): nessun redirect
autoRedirect: false,

// Per produzione: redirect dopo streaming
autoRedirect: true,
```
