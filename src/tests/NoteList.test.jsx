import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteList from '../components/NoteList'

const sampleNotes = [
  { id: '1', title: 'Prima nota', body: 'Contenuto uno', createdAt: 1000 },
  { id: '2', title: 'Seconda nota', body: 'Contenuto due', createdAt: 2000 },
]

// REQ-NOTES-001
describe('NoteList', () => {
  it('shows empty state message when notes array is empty', () => {
    render(<NoteList notes={[]} onSelectNote={() => {}} />)
    expect(screen.getByText(/nessuna nota trovata/i)).toBeInTheDocument()
  })

  it('renders one card per note in insertion order', () => {
    render(<NoteList notes={sampleNotes} onSelectNote={() => {}} />)
    const titles = screen.getAllByText(/nota/i).filter(el =>
      el.textContent === 'Prima nota' || el.textContent === 'Seconda nota'
    )
    expect(titles[0].textContent).toBe('Prima nota')
    expect(titles[1].textContent).toBe('Seconda nota')
  })

  it('calls onSelectNote with the clicked note', async () => {
    const handler = vi.fn()
    render(<NoteList notes={sampleNotes} onSelectNote={handler} />)
    await userEvent.click(screen.getByText('Prima nota'))
    expect(handler).toHaveBeenCalledWith(sampleNotes[0])
  })
})
