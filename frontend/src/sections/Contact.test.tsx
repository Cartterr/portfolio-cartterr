import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { portfolioContent } from '../data/portfolio'
import { Contact } from './Contact'

const successMessage = 'Thanks for reaching out. Your message has been received.'
const errorMessage =
  'I couldn’t send your message. Please try again or use one of the direct links below.'

function renderContact() {
  render(<Contact content={portfolioContent.contact} portfolioMode="software" />)

  return {
    name: screen.getByRole('textbox', { name: 'Name' }),
    email: screen.getByRole('textbox', { name: 'Email' }),
    message: screen.getByRole('textbox', { name: 'Message' }),
    submit: screen.getByRole('button', { name: 'Send message' }),
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Contact', () => {
  it('exposes accessible visible fields and an assistive-technology-hidden honeypot', () => {
    renderContact()

    const honeypot = document.querySelector<HTMLInputElement>('input[name="website"]')
    expect(honeypot).toHaveAttribute('aria-hidden', 'true')
    expect(honeypot).toHaveAttribute('tabindex', '-1')
  })

  it('posts the form, announces success, clears visible fields, and focuses confirmation', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: successMessage }),
    })
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    const fields = renderContact()

    await user.type(fields.name, 'Ada Lovelace')
    await user.type(fields.email, 'ada@example.com')
    await user.type(fields.message, 'Build reliable systems.')
    await user.click(fields.submit)

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    expect(fetchMock).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        message: 'Build reliable systems.',
        website: '',
        portfolioMode: 'software',
      }),
    })
    const confirmation = await screen.findByText(successMessage)
    expect(fields.name).toHaveValue('')
    expect(fields.email).toHaveValue('')
    expect(fields.message).toHaveValue('')
    expect(confirmation).toHaveFocus()
  })

  it('posts Visual portfolio context from the Visual contact form', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<Contact content={portfolioContent.contact} portfolioMode="visual" />)

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada')
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'ada@example.com')
    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Build a spatial tool.')
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    const request = fetchMock.mock.calls[0]?.[1] as RequestInit
    expect(JSON.parse(String(request.body))).toMatchObject({ portfolioMode: 'visual' })
  })

  it('announces failure and preserves entered values', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const user = userEvent.setup()
    const fields = renderContact()

    await user.type(fields.name, 'Ada Lovelace')
    await user.type(fields.email, 'ada@example.com')
    await user.type(fields.message, 'Please keep this message.')
    await user.click(fields.submit)

    expect(await screen.findByText(errorMessage)).toBeInTheDocument()
    expect(fields.name).toHaveValue('Ada Lovelace')
    expect(fields.email).toHaveValue('ada@example.com')
    expect(fields.message).toHaveValue('Please keep this message.')
  })

  it('disables only the submit button and uses pending copy while sending', async () => {
    let resolveFetch: ((value: { ok: boolean }) => void) | undefined
    const pendingFetch = new Promise<{ ok: boolean }>((resolve) => {
      resolveFetch = resolve
    })
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(pendingFetch))
    const user = userEvent.setup()
    const fields = renderContact()

    await user.type(fields.name, 'Ada')
    await user.type(fields.email, 'ada@example.com')
    await user.type(fields.message, 'Hello')
    await user.click(fields.submit)

    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled()
    expect(fields.name).toBeEnabled()
    expect(fields.email).toBeEnabled()
    expect(fields.message).toBeEnabled()
    expect(screen.getByText('Sending…', { selector: '[aria-live]' })).toBeInTheDocument()

    await act(async () => {
      resolveFetch?.({ ok: true })
      await pendingFetch
    })
  })
})
