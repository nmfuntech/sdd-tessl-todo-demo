// @spec specs/notes-app.spec.md
// @req REQ-NOTES-005

import { describe, it, expect, beforeEach } from 'vitest'
import { loadNotes, saveNotes } from '../utils/storage'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('loadNotes returns empty array when localStorage is empty', () => {
    expect(loadNotes()).toEqual([])
  })

  it('loadNotes returns previously saved notes', () => {
    const notes = [{ id: '1', title: 'T', body: 'B', createdAt: 1 }]
    saveNotes(notes)
    expect(loadNotes()).toEqual(notes)
  })

  it('saveNotes persists synchronously (readable immediately after call)', () => {
    const notes = [{ id: '2', title: 'X', body: 'Y', createdAt: 2 }]
    saveNotes(notes)
    expect(JSON.parse(localStorage.getItem('neonotes_v1'))).toEqual(notes)
  })

  it('loadNotes returns empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('neonotes_v1', 'not-json')
    expect(loadNotes()).toEqual([])
  })
})
