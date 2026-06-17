const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1.5rem',
  },
  empty: {
    textAlign: 'center',
    marginTop: '5rem',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    letterSpacing: '0.1em',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    display: 'block',
    opacity: 0.4,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-glow)',
    borderRadius: '4px',
    padding: '1.25rem',
    cursor: 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
    position: 'relative',
    overflow: 'hidden',
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    color: 'var(--neon-cyan)',
    marginBottom: '0.6rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardBody: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '3px',
    height: '100%',
    background: 'linear-gradient(180deg, var(--neon-cyan), var(--neon-violet))',
  },
}

export default function NoteList({ notes, onSelectNote }) {
  if (notes.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>◈</span>
          <p>NESSUNA NOTA TROVATA</p>
          <p style={{ marginTop: '0.5rem', opacity: 0.6 }}>Premi [+ NUOVA NOTA] per iniziare</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {notes.map(note => (
          <div
            key={note.id}
            style={styles.card}
            onClick={() => onSelectNote(note)}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--neon-cyan)'
              e.currentTarget.style.boxShadow = '0 0 16px rgba(0,245,255,0.2)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-glow)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={styles.cardAccent} />
            <div style={styles.cardTitle}>{note.title}</div>
            <div style={styles.cardBody}>{note.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
