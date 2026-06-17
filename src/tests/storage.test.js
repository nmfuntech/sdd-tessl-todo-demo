import { describe, it, expect, beforeEach } from 'vitest'
import { loadNotes, saveNotes } from '../utils/storage'

// REQ-NOTES-005
describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('returns empty array when localStorage is empty', () => {
    expect(loadNotes()).toEqual([])
  })

  it('persists and reloads notes from localStorage', () => {
    const notes = [{ id: '1', title: 'Test', body: 'Body', createdAt: 1000 }]
    saveNotes(notes)
    expect(loadNotes()).toEqual(notes)
  })

  it('overwrites previous data on save', () => {
    saveNotes([{ id: '1', title: 'Old', body: 'Old body', createdAt: 1000 }])
    const updated = [{ id: '1', title: 'New', body: 'New body', createdAt: 1000 }]
    saveNotes(updated)
    expect(loadNotes()).toEqual(updated)
  })

  it('returns empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('neonotes_v1', 'not-json')
    expect(loadNotes()).toEqual([])
  })
})
