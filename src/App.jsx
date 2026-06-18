// GENERATED FROM SPEC: specs/notes-app.spec.md
// REQ-NOTES-001, REQ-NOTES-002, REQ-NOTES-003, REQ-NOTES-004, REQ-NOTES-006

import { useState } from 'react'
import { useNotes } from './hooks/useNotes'
import NoteList from './components/NoteList'
import NoteModal from './components/NoteModal'
import './index.css'

const styles = {
  app: {
    minHeight: '100vh',
  },
  header: {
    borderBottom: '1px solid var(--border-glow)',
    padding: '1.25rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--bg-panel)',
    boxShadow: '0 1px 20px rgba(0,245,255,0.05)',
  },
  brand: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    letterSpacing: '0.2em',
    color: 'var(--neon-cyan)',
    textShadow: '0 0 12px rgba(0,245,255,0.5)',
  },
  brandAccent: {
    color: 'var(--neon-violet)',
  },
  btnNew: {
    background: 'transparent',
    border: '1px solid var(--neon-cyan)',
    color: 'var(--neon-cyan)',
    fontFamily: 'var(--font-display)',
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    padding: '0.55rem 1.1rem',
    borderRadius: '3px',
    transition: 'background 0.2s, box-shadow 0.2s',
    textTransform: 'uppercase',
  },
  main: {
    paddingTop: '2.5rem',
  },
}

export default function App() {
  const { notes, addNote, updateNote, deleteNote } = useNotes()
  const [modal, setModal] = useState(null) // null | 'new' | noteObject

  function handleSave({ id, title, body }) {
    if (id) {
      updateNote({ id, title, body })
    } else {
      addNote({ title, body })
    }
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.brand}>
          NEO<span style={styles.brandAccent}>NOTES</span>
        </div>
        <button
          style={styles.btnNew}
          onClick={() => setModal('new')}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,245,255,0.08)'
            e.currentTarget.style.boxShadow = '0 0 12px rgba(0,245,255,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          + Nuova nota
        </button>
      </header>

      <main style={styles.main}>
        <NoteList notes={notes} onSelectNote={note => setModal(note)} />
      </main>

      {modal && (
        <NoteModal
          note={modal === 'new' ? null : modal}
          onSave={handleSave}
          onDelete={deleteNote}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
