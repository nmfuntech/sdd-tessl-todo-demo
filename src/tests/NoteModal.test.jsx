// @spec specs/notes-app.spec.md
// @req REQ-NOTES-002, REQ-NOTES-003, REQ-NOTES-004, REQ-NOTES-006

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteModal from '../components/NoteModal'

const noop = () => {}

const existingNote = { id: '42', title: 'Vecchio titolo', body: 'Vecchio corpo', createdAt: 1000 }

// REQ-NOTES-002
describe('NoteModal — create mode', () => {
  it('renders title and body fields', () => {
    render(<NoteModal note={null} onSave={noop} onDelete={noop} onClose={noop} />)
    expect(screen.getByPlaceholderText(/titolo/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/contenuto/i)).toBeInTheDocument()
  })

  it('save button is disabled when fields are empty', () => {
    render(<NoteModal note={null} onSave={noop} onDelete={noop} onClose={noop} />)
    expect(screen.getByRole('button', { name: /salva/i })).toBeDisabled()
  })

  it('calls onSave with title and body when both fields are filled', async () => {
    const onSave = vi.fn()
    render(<NoteModal note={null} onSave={onSave} onDelete={noop} onClose={noop} />)
    await userEvent.type(screen.getByPlaceholderText(/titolo/i), 'Nuovo titolo')
    await userEvent.type(screen.getByPlaceholderText(/contenuto/i), 'Nuovo corpo')
    await userEvent.click(screen.getByRole('button', { name: /salva/i }))
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Nuovo titolo', body: 'Nuovo corpo' })
    )
  })
})

// REQ-NOTES-003
describe('NoteModal — edit mode', () => {
  it('pre-fills title and body from the existing note', () => {
    render(<NoteModal note={existingNote} onSave={noop} onDelete={noop} onClose={noop} />)
    expect(screen.getByDisplayValue('Vecchio titolo')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Vecchio corpo')).toBeInTheDocument()
  })

  it('calls onSave with updated values and existing id', async () => {
    const onSave = vi.fn()
    render(<NoteModal note={existingNote} onSave={onSave} onDelete={noop} onClose={noop} />)
    const titleInput = screen.getByDisplayValue('Vecchio titolo')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Titolo aggiornato')
    await userEvent.click(screen.getByRole('button', { name: /salva/i }))
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ id: '42', title: 'Titolo aggiornato' })
    )
  })
})

// REQ-NOTES-004
describe('NoteModal — delete', () => {
  it('shows delete button only in edit mode', () => {
    const { rerender } = render(<NoteModal note={existingNote} onSave={noop} onDelete={noop} onClose={noop} />)
    expect(screen.getByRole('button', { name: /elimina/i })).toBeInTheDocument()
    rerender(<NoteModal note={null} onSave={noop} onDelete={noop} onClose={noop} />)
    expect(screen.queryByRole('button', { name: /elimina/i })).not.toBeInTheDocument()
  })

  it('calls onDelete with the note id when delete is clicked', async () => {
    const onDelete = vi.fn()
    render(<NoteModal note={existingNote} onSave={noop} onDelete={onDelete} onClose={noop} />)
    await userEvent.click(screen.getByRole('button', { name: /elimina/i }))
    expect(onDelete).toHaveBeenCalledWith('42')
  })
})

// REQ-NOTES-006
describe('NoteModal — visual', () => {
  it('renders as a dialog with aria-modal', () => {
    render(<NoteModal note={null} onSave={noop} onDelete={noop} onClose={noop} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn()
    render(<NoteModal note={null} onSave={noop} onDelete={noop} onClose={onClose} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
