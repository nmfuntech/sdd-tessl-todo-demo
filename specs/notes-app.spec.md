---
name: Notes App
description: App React per la gestione di note personali con tema futuristico
targets:
  - ../src/App.jsx
  - ../src/components/NoteList.jsx
  - ../src/components/NoteModal.jsx
  - ../src/hooks/useNotes.js
  - ../src/utils/storage.js
---

# Notes App

App React standalone che permette di creare, leggere, modificare ed eliminare note personali. Le note vengono persistite in `localStorage` e presentate con un tema grafico futuristico (dark, neon, sci-fi).

## Struttura dati

Ogni nota è un oggetto con la seguente forma:

```js
{
  id: string,       // ID univoco generato alla creazione (formato: timestamp-randomstring)
  title: string,    // titolo della nota
  body: string,     // corpo testuale della nota
  createdAt: number // timestamp Unix (Date.now())
}
```

### REQ-NOTES-001 — Lista note

- All'avvio, l'app carica le note salvate in `localStorage` e le mostra in ordine di inserimento (dalla più vecchia alla più recente).
  `[@test] ../src/tests/NoteList.test.jsx`
- Se non ci sono note, viene mostrato un messaggio vuoto che invita l'utente a crearne una.
  `[@test] ../src/tests/NoteList.test.jsx`

### REQ-NOTES-002 — Creazione nota

- L'utente può aprire una modale per creare una nuova nota.
  `[@test] ../src/tests/NoteModal.test.jsx`
- La modale contiene un campo titolo e un campo corpo, entrambi obbligatori per salvare.
  `[@test] ../src/tests/NoteModal.test.jsx`
- Al salvataggio, la nota viene aggiunta in coda alla lista e persistita in `localStorage`.
  `[@test] ../src/tests/useNotes.test.js`

### REQ-NOTES-003 — Modifica nota

- Cliccando su una nota nella lista, si apre la modale in modalità modifica con titolo e corpo precompilati.
  `[@test] ../src/tests/NoteModal.test.jsx`
- Al salvataggio, la nota esistente viene aggiornata in `localStorage` mantenendo la sua posizione nella lista.
  `[@test] ../src/tests/useNotes.test.js`

### REQ-NOTES-004 — Eliminazione nota

- Dalla modale di modifica, l'utente può eliminare la nota corrente.
  `[@test] ../src/tests/NoteModal.test.jsx`
- La nota eliminata scompare dalla lista e viene rimossa da `localStorage`.
  `[@test] ../src/tests/useNotes.test.js`

### REQ-NOTES-005 — Persistenza

- Le note sopravvivono al refresh della pagina grazie a `localStorage`.
  `[@test] ../src/tests/storage.test.js`
- Il salvataggio avviene in modo sincrono dopo ogni operazione (crea, modifica, elimina).
  `[@test] ../src/tests/storage.test.js`

### REQ-NOTES-006 — Tema futuristico

- L'app usa un tema dark con colori neon (es. ciano, viola, verde fosforescente).
  `[@test] ../src/tests/App.test.jsx`
- Font e stile richiamano un'estetica sci-fi/cyberpunk.
  `[@test] ../src/tests/App.test.jsx`
- La modale ha un effetto visivo distinto dal resto della pagina (es. glow, blur, bordi luminosi).
  `[@test] ../src/tests/NoteModal.test.jsx`

## Escluso da questo spec

- Ricerca e filtro delle note
- Ordinamento personalizzato
- Backend o database remoto
- Autenticazione utente
