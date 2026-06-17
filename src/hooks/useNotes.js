import { useState } from 'react'
import { loadNotes, saveNotes } from '../utils/storage'

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useNotes() {
  const [notes, setNotes] = useState(() => loadNotes())

  function addNote({ title, body }) {
    const note = { id: makeId(), title, body, createdAt: Date.now() }
    const updated = [...notes, note]
    setNotes(updated)
    saveNotes(updated)
  }

  function updateNote({ id, title, body }) {
    const updated = notes.map(n => n.id === id ? { ...n, title, body } : n)
    setNotes(updated)
    saveNotes(updated)
  }

  function deleteNote(id) {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    saveNotes(updated)
  }

  return { notes, addNote, updateNote, deleteNote }
}
