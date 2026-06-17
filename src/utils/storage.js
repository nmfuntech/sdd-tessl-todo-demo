const KEY = 'neonotes_v1'

export function loadNotes() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveNotes(notes) {
  localStorage.setItem(KEY, JSON.stringify(notes))
}
