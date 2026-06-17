import { useState } from 'react'
import { useNotes } from './hooks/useNotes'
import NoteList from './components/NoteList'
import NoteModal from './components/NoteModal'

const styles = {
  header: {
    borderBottom: '1px solid rgba(0,245,255,0.15)',
    padding: '1.2rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '800px',
    margin: '0 auto',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    letterSpacing: '0.2em',
    color: 'var(--neon-cyan)',
    textShadow: '0 0 12px rgba(0,245,255,0.5)',
  },
  logoAccent: {
    color: 'var(--neon-violet)',
  },
  count: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
  },
  btnNew: {
    background: 'transparent',
    border: '1px solid var(--neon-green)',
    color: 'var(--neon-green)',
    fontFamily: 'var(--font-display)',
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    padding: '0.55rem 1.1rem',
    borderRadius: '3px',
    textTransform: 'uppercase',
    transition: 'background 0.2s, box-shadow 0.2s',
  },
  main: {
    paddingTop: '2.5rem',
    paddingBottom: '4rem',
  },
}

export default function App() {
  const { notes, addNote, updateNote, deleteNote } = useNotes()
  const [modal, setModal] = useState(null)

  function openNew() { setModal({ mode: 'create' }) }
  function openEdit(note) { setModal({ mode: 'edit', note }) }
  function closeModal() { setModal(null) }

  function handleSave({ id, title, body }) {
    if (id) {
      updateNote({ id, title, body })
    } else {
      addNote({ title, body })
    }
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <div style={styles.logo}>
            NEO<span style={styles.logoAccent}>NOTES</span>
          </div>
          <div style={styles.count}>{notes.length} nota{notes.length !== 1 ? 'e' : ''} nel sistema</div>
        </div>
        <button
          style={styles.btnNew}
          onClick={openNew}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,255,65,0.08)'
            e.currentTarget.style.boxShadow = '0 0 12px rgba(0,255,65,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          + Nuova Nota
        </button>
      </div>

      <main style={styles.main}>
        <NoteList notes={notes} onSelectNote={openEdit} />
      </main>

      {modal && (
        <NoteModal
          note={modal.note ?? null}
          onSave={handleSave}
          onDelete={deleteNote}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
