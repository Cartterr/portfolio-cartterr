import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('portfolio page', () => {
  it('renders one focused hero and every primary navigation target immediately', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Software engineer building reliable AI, data, and autonomous systems.',
    )
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    for (const id of ['work', 'experience', 'about', 'contact']) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main')
  })

  it('opens and closes the mobile navigation accessibly', async () => {
    const user = userEvent.setup()
    render(<App />)
    const menu = screen.getByRole('button', { name: /open navigation/i })
    await user.click(menu)
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(menu).toHaveAttribute('aria-expanded', 'false')
  })

  it('moves keyboard focus to main content from the skip link', async () => {
    const user = userEvent.setup()
    render(<App />)
    const skipLink = screen.getByRole('link', { name: /skip to content/i })
    const main = screen.getByRole('main')

    await user.tab()
    expect(skipLink).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(main).toHaveAttribute('tabindex', '-1')
    expect(main).toHaveFocus()
  })

  it('treats event photos as captioned images without duplicate alternative text', () => {
    render(<App />)
    const figures = document.querySelectorAll('#about figure')

    expect(figures).toHaveLength(2)
    for (const figure of figures) {
      expect(figure.querySelector('img')).toHaveAttribute('alt', '')
      expect(figure.querySelector('figcaption')).not.toBeEmptyDOMElement()
    }
  })
})
