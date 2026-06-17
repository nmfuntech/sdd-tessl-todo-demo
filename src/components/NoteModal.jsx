import { useState, useEffect } from 'react'

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem',
  },
  modal: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--neon-cyan)',
    borderRadius: '6px',
    padding: '2rem',
    width: '100%',
    maxWidth: '560px',
    boxShadow: '0 0 40px rgba(0,245,255,0.2), 0 0 80px rgba(191,0,255,0.1)',
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute', top: -1, left: -1,
    width: 16, height: 16,
    borderTop: '2px solid var(--neon-cyan)',
    borderLeft: '2px solid var(--neon-cyan)',
  },
  cornerBR: {
    position: 'absolute', bottom: -1, right: -1,
    width: 16, height: 16,
    borderBottom: '2px solid var(--neon-violet)',
    borderRight: '2px solid var(--neon-violet)',
  },
  heading: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    letterSpacing: '0.15em',
    color: 'var(--neon-cyan)',
    marginBottom: '1.5rem',
    textTransform: 'uppercase',
  },
  label: {
    display: 'block',
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    color: 'var(--text-muted)',
    marginBottom: '0.4rem',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    background: 'rgba(0,245,255,0.04)',
    border: '1px solid rgba(0,245,255,0.25)',
    borderRadius: '3px',
    padding: '0.65rem 0.85rem',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    outline: 'none',
    marginBottom: '1.25rem',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  textarea: {
    width: '100%',
    background: 'rgba(0,245,255,0.04)',
    border: '1px solid rgba(0,245,255,0.25)',
    borderRadius: '3px',
    padding: '0.65rem 0.85rem',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    outline: 'none',
    marginBottom: '1.5rem',
    minHeight: '140px',
    resize: 'vertical',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
  },
  btnPrimary: {
    background: 'transparent',
    border: '1px solid var(--neon-cyan)',
    color: 'var(--neon-cyan)',
    fontFamily: 'var(--font-display)',
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    padding: '0.6rem 1.2rem',
    borderRadius: '3px',
    transition: 'background 0.2s, box-shadow 0.2s',
    textTransform: 'uppercase',
  },
  btnDanger: {
    background: 'transparent',
    border: '1px solid var(--neon-pink)',
    color: 'var(--neon-pink)',
    fontFamily: 'var(--font-display)',
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    padding: '0.6rem 1.2rem',
    borderRadius: '3px',
    marginRight: 'auto',
    transition: 'background 0.2s, box-shadow 0.2s',
    textTransform: 'uppercase',
  },
  btnCancel: {
    background: 'transparent',
    border: '1px solid var(--text-muted)',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-display)',
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    padding: '0.6rem 1.2rem',
    borderRadius: '3px',
    transition: 'opacity 0.2s',
    textTransform: 'uppercase',
  },
}

export default function NoteModal({ note, onSave, onDelete, onClose }) {
  const isEdit = Boolean(note)
  const [title, setTitle] = useState(note?.title ?? '')
  const [body, setBody] = useState(note?.body ?? '')

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSave() {
    if (!title.trim() || !body.trim()) return
    onSave({ id: note?.id, title: title.trim(), body: body.trim() })
    onClose()
  }

  function handleDelete() {
    onDelete(note.id)
    onClose()
  }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal} role="dialog" aria-modal="true" aria-label={isEdit ? 'Modifica nota' : 'Nuova nota'}>
        <div style={styles.cornerTL} />
        <div style={styles.cornerBR} />

        <div style={styles.heading}>
          {isEdit ? '// MODIFICA NOTA' : '// NUOVA NOTA'}
        </div>

        <label style={styles.label}>Titolo</label>
        <input
          style={styles.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titolo della nota..."
          autoFocus
          onFocus={e => {
            e.target.style.borderColor = 'var(--neon-cyan)'
            e.target.style.boxShadow = '0 0 8px rgba(0,245,255,0.15)'
          }}
          onBlur={e => {
            e.target.style.borderColor = 'rgba(0,245,255,0.25)'
            e.target.style.boxShadow = 'none'
          }}
        />

        <label style={styles.label}>Corpo</label>
        <textarea
          style={styles.textarea}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Contenuto della nota..."
          onFocus={e => {
            e.target.style.borderColor = 'var(--neon-cyan)'
            e.target.style.boxShadow = '0 0 8px rgba(0,245,255,0.15)'
          }}
          onBlur={e => {
            e.target.style.borderColor = 'rgba(0,245,255,0.25)'
            e.target.style.boxShadow = 'none'
          }}
        />

        <div style={styles.actions}>
          {isEdit && (
            <button
              style={styles.btnDanger}
              onClick={handleDelete}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,0,170,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Elimina
            </button>
          )}
          <button
            style={styles.btnCancel}
            onClick={onClose}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Annulla
          </button>
          <button
            style={{
              ...styles.btnPrimary,
              opacity: !title.trim() || !body.trim() ? 0.4 : 1,
              cursor: !title.trim() || !body.trim() ? 'not-allowed' : 'pointer',
            }}
            onClick={handleSave}
            disabled={!title.trim() || !body.trim()}
            onMouseEnter={e => {
              if (title.trim() && body.trim()) {
                e.currentTarget.style.background = 'rgba(0,245,255,0.1)'
                e.currentTarget.style.boxShadow = '0 0 12px rgba(0,245,255,0.25)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Salva
          </button>
        </div>
      </div>
    </div>
  )
}
