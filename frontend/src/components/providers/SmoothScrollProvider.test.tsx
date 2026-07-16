import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, type PropsWithChildren } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SmoothScrollProvider } from './SmoothScrollProvider'

vi.mock('lenis/react', () => ({
  ReactLenis: ({ children }: PropsWithChildren) => (
    <div data-testid="lenis-controller">{children}</div>
  ),
  useLenis: () => null,
}))

type MediaController = {
  media: MediaQueryList
  setMatches: (matches: boolean) => void
}

const installMatchMedia = () => {
  const controllers = new Map<string, MediaController>()
  vi.stubGlobal('matchMedia', (query: string) => {
    const existing = controllers.get(query)
    if (existing) return existing.media

    const listeners = new Set<(event: MediaQueryListEvent) => void>()
    const media = {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener)
      },
      removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener)
      },
    } as MediaQueryList
    const controller = {
      media,
      setMatches: (matches: boolean) => {
        Object.defineProperty(media, 'matches', { configurable: true, value: matches })
        const event = { matches, media: query } as MediaQueryListEvent
        for (const listener of listeners) listener(event)
      },
    }
    controllers.set(query, controller)
    return media
  })
  return controllers
}

function StatefulInput() {
  const [value, setValue] = useState('')
  return (
    <input
      aria-label="Persistent draft"
      onChange={(event) => setValue(event.currentTarget.value)}
      value={value}
    />
  )
}

describe('SmoothScrollProvider', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('preserves child state and focus when Lenis eligibility changes', async () => {
    const media = installMatchMedia()
    const user = userEvent.setup()
    render(
      <SmoothScrollProvider>
        <StatefulInput />
      </SmoothScrollProvider>,
    )
    const input = screen.getByRole('textbox', { name: 'Persistent draft' })
    await user.type(input, 'Keep me')
    input.focus()

    act(() => {
      media.get('(min-width: 769px) and (pointer: fine)')?.setMatches(true)
    })
    await waitFor(() => expect(screen.getByTestId('lenis-controller')).toBeInTheDocument())

    const inputAfterEligibilityChange = screen.getByRole('textbox', { name: 'Persistent draft' })
    expect(inputAfterEligibilityChange).toBe(input)
    expect(inputAfterEligibilityChange).toHaveValue('Keep me')
    expect(inputAfterEligibilityChange).toHaveFocus()
  })
})
