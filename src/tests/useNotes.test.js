import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNotes } from '../hooks/useNotes'

// REQ-NOTES-002, REQ-NOTES-003, REQ-NOTES-004, REQ-NOTES-005
describe('useNotes', () => {
  beforeEach(() => localStorage.clear())

  it('starts with notes loaded from localStorage', () => {
    const stored = [{ id: 'a', title: 'T', body: 'B', createdAt: 1 }]
    localStorage.setItem('neonotes_v1', JSON.stringify(stored))
    const { result } = renderHook(() => useNotes())
    expect(result.current.notes).toEqual(stored)
  })

  it('addNote appends a note with id and createdAt', () => {
    const { result } = renderHook(() => useNotes())
    act(() => result.current.addNote({ title: 'Foo', body: 'Bar' }))
    expect(result.current.notes).toHaveLength(1)
    expect(result.current.notes[0]).toMatchObject({ title: 'Foo', body: 'Bar' })
    expect(result.current.notes[0].id).toBeTruthy()
  })

  it('addNote persists to localStorage synchronously', () => {
    const { result } = renderHook(() => useNotes())
    act(() => result.current.addNote({ title: 'X', body: 'Y' }))
    const saved = JSON.parse(localStorage.getItem('neonotes_v1'))
    expect(saved).toHaveLength(1)
  })

  it('updateNote replaces title and body, keeps position', () => {
    const { result } = renderHook(() => useNotes())
    act(() => result.current.addNote({ title: 'A', body: 'AA' }))
    act(() => result.current.addNote({ title: 'B', body: 'BB' }))
    const id = result.current.notes[0].id
    act(() => result.current.updateNote({ id, title: 'A2', body: 'AA2' }))
    expect(result.current.notes[0]).toMatchObject({ id, title: 'A2', body: 'AA2' })
    expect(result.current.notes[1].title).toBe('B')
  })

  it('updateNote persists change to localStorage', () => {
    const { result } = renderHook(() => useNotes())
    act(() => result.current.addNote({ title: 'A', body: 'B' }))
    const id = result.current.notes[0].id
    act(() => result.current.updateNote({ id, title: 'A2', body: 'B2' }))
    const saved = JSON.parse(localStorage.getItem('neonotes_v1'))
    expect(saved[0].title).toBe('A2')
  })

  it('deleteNote removes the note from state', () => {
    const { result } = renderHook(() => useNotes())
    act(() => result.current.addNote({ title: 'Del', body: 'Me' }))
    const id = result.current.notes[0].id
    act(() => result.current.deleteNote(id))
    expect(result.current.notes).toHaveLength(0)
  })

  it('deleteNote removes the note from localStorage', () => {
    const { result } = renderHook(() => useNotes())
    act(() => result.current.addNote({ title: 'Del', body: 'Me' }))
    const id = result.current.notes[0].id
    act(() => result.current.deleteNote(id))
    const saved = JSON.parse(localStorage.getItem('neonotes_v1'))
    expect(saved).toHaveLength(0)
  })
})
