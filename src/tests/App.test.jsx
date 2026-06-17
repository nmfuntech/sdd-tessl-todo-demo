import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// REQ-NOTES-001, REQ-NOTES-006
describe('App', () => {
  beforeEach(() => localStorage.clear())

  it('renders the NEONOTES brand header', () => {
    render(<App />)
    expect(screen.getByText(/neo/i)).toBeInTheDocument()
  })

  it('shows new note button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /nuova nota/i })).toBeInTheDocument()
  })

  it('opens modal when new note button is clicked', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /nuova nota/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shows empty state initially', () => {
    render(<App />)
    expect(screen.getByText(/nessuna nota trovata/i)).toBeInTheDocument()
  })

  it('adds a note and displays it in the list', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /nuova nota/i }))
    await userEvent.type(screen.getByPlaceholderText(/titolo/i), 'Cyber Log')
    await userEvent.type(screen.getByPlaceholderText(/contenuto/i), 'Primo accesso al sistema')
    await userEvent.click(screen.getByRole('button', { name: /salva/i }))
    expect(screen.getByText('Cyber Log')).toBeInTheDocument()
  })
})
