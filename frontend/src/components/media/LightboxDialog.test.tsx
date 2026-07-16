import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { PortfolioMedia } from '../../data/types'
import { LightboxDialog } from './LightboxDialog'

const media = Array.from({ length: 3 }, (_, index) => ({
  id: `expanded-${index + 1}`,
  kind: 'image' as const,
  src: `/expanded-${index + 1}.jpg`,
  thumbnail: `/expanded-${index + 1}-thumb.jpg`,
  width: 1200,
  height: 800,
  alt: `Expanded portfolio photograph ${index + 1}`,
  caption: `Expanded photograph caption ${index + 1}.`,
  fit: 'contain' as const,
  objectPosition: '50% 50%',
  rights: {
    owner: 'Test owner',
    source: 'Test fixture',
    clearance: 'cleared-project-capture' as const,
  },
  publication: 'approved' as const,
  storyId: 'expanded-story',
})) satisfies PortfolioMedia[]

function LightboxHarness({ onClose = vi.fn() }: { onClose?: () => void }) {
  const [open, setOpen] = useState(true)
  const [index, setIndex] = useState(0)
  const returnFocusRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button ref={returnFocusRef} type="button">
        Open expanded view
      </button>
      <main>Background content</main>
      <LightboxDialog
        index={index}
        media={media}
        onClose={() => {
          onClose()
          setOpen(false)
        }}
        onIndexChange={setIndex}
        open={open}
        returnFocusRef={returnFocusRef}
      />
    </>
  )
}

describe('LightboxDialog', () => {
  it('renders a modal portal, locks scrolling, and makes the background inert', () => {
    const { container } = render(<LightboxHarness />)

    const dialog = screen.getByRole('dialog', { name: 'Expanded media viewer' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog.closest('[data-lightbox-root]')?.parentElement).toBe(document.body)
    expect(document.body).toHaveStyle({ overflow: 'hidden' })
    expect(container).toHaveAttribute('inert')
    expect(screen.getByRole('button', { name: 'Close expanded view' })).toHaveFocus()
  })

  it('closes explicitly, restores page state, and returns focus', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(<LightboxHarness onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Close expanded view' }))

    expect(onClose).toHaveBeenCalledOnce()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
    expect(container).not.toHaveAttribute('inert')
    expect(screen.getByRole('button', { name: 'Open expanded view' })).toHaveFocus()
  })

  it('closes on Escape and restores focus to the invoking control', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<LightboxHarness onClose={onClose} />)

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Open expanded view' })).toHaveFocus()
  })

  it('traps forward and backward focus within the dialog', async () => {
    const user = userEvent.setup()
    render(<LightboxHarness />)

    const close = screen.getByRole('button', { name: 'Close expanded view' })
    const next = screen.getByRole('button', { name: 'Next image' })
    expect(close).toHaveFocus()

    await user.tab({ shift: true })
    expect(next).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
  })

  it('wraps image navigation with ArrowLeft and ArrowRight', async () => {
    const user = userEvent.setup()
    render(<LightboxHarness />)

    expect(screen.getByText('1 of 3')).toBeInTheDocument()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByText('3 of 3')).toBeInTheDocument()
    expect(screen.getByAltText('Expanded portfolio photograph 3')).toHaveAttribute(
      'src',
      '/expanded-3.jpg',
    )
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })
})
