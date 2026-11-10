import {
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { PortfolioLink, PortfolioPage } from '../../data/types'
import { WaveField } from '../fx/WaveField'
import { useMagnetic } from '../lib/hooks'
import { SectionLabel } from './SectionLabel'

type FormValues = { name: string; email: string; message: string; website: string }
type Status =
  | { state: 'idle'; message: '' }
  | { state: 'pending' | 'success' | 'error'; message: string }

const emptyForm: FormValues = { name: '', email: '', message: '', website: '' }
const successMessage = 'Thanks for reaching out. Your message has been received.'
const errorMessage =
  'I couldn’t send your message. Please try again or use one of the direct links.'

function CopyEmail({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return undefined
    const timer = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      className="jc-copy"
      data-copied={copied ? 'true' : 'false'}
      onClick={copy}
      type="button"
    >
      <span aria-live="polite">{copied ? 'Copied' : 'Copy address'}</span>
    </button>
  )
}

type ContactProps = {
  content: PortfolioPage['contact']
  resume: PortfolioLink
}

export function Contact({ content, resume }: ContactProps) {
  const [values, setValues] = useState<FormValues>(emptyForm)
  const [status, setStatus] = useState<Status>({ state: 'idle', message: '' })
  const statusRef = useRef<HTMLParagraphElement>(null)
  const submitRef = useMagnetic<HTMLButtonElement>(0.2)
  const isPending = status.state === 'pending'
  const email = content.links.find(({ href }) => href.startsWith('mailto:'))
  const address = email?.href.replace('mailto:', '') ?? ''
  const others = content.links.filter((link) => link !== email)

  useEffect(() => {
    if (status.state === 'success') statusRef.current?.focus()
  }, [status.state])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.currentTarget.name as keyof FormValues
    const value = event.currentTarget.value
    setValues((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isPending) return
    setStatus({ state: 'pending', message: 'Sending…' })
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, portfolioMode: 'software' }),
      })
      if (!response.ok) throw new Error('Contact request failed')
      setValues({ ...emptyForm })
      setStatus({ state: 'success', message: successMessage })
    } catch {
      setStatus({ state: 'error', message: errorMessage })
    }
  }

  return (
    <section
      aria-labelledby="software-contact-title"
      className="jc-contact jc-ink"
      data-section-index="05"
      data-testid="software-section"
      id="software-contact"
    >
      <WaveField className="jc-contact__field" ink={[0.95, 0.94, 0.92]} />
      <div className="jc-wrap jc-contact__grid">
        <div className="jc-contact__intro">
          <SectionLabel index="05" label="Contact" />
          <h2 className="jc-display jc-contact__title" data-reveal id="software-contact-title">
            {content.heading}
          </h2>
          <p className="jc-contact__body" data-reveal style={{ '--rd': '120ms' } as CSSProperties}>
            {content.body}
          </p>

          {email ? (
            <div className="jc-contact__email" data-reveal>
              <a href={email.href}>
                <span className="sr-only">{email.label}: </span>
                {address}
              </a>
              <CopyEmail address={address} />
            </div>
          ) : null}

          <ul aria-label="Direct contact links" className="jc-contact__links" data-reveal>
            {[...others, resume].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  rel={link.external ? 'noreferrer' : undefined}
                  target={link.external ? '_blank' : undefined}
                >
                  {link.label}
                  <span aria-hidden="true">{link.external ? ' ↗' : ' ↓'}</span>
                  {link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form
          aria-busy={isPending}
          aria-label="Software project inquiry"
          className="jc-form"
          data-reveal
          onSubmit={handleSubmit}
        >
          <div className="jc-form__field">
            <label htmlFor="contact-name">Name</label>
            <input
              autoComplete="name"
              id="contact-name"
              maxLength={80}
              name="name"
              onChange={handleChange}
              required
              type="text"
              value={values.name}
            />
          </div>
          <div className="jc-form__field">
            <label htmlFor="contact-email">Email</label>
            <input
              autoComplete="email"
              id="contact-email"
              maxLength={254}
              name="email"
              onChange={handleChange}
              required
              type="email"
              value={values.email}
            />
          </div>
          <div className="jc-form__field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              maxLength={4000}
              name="message"
              onChange={handleChange}
              required
              rows={5}
              value={values.message}
            />
          </div>
          <div aria-hidden="true" className="jc-form__honeypot">
            <label htmlFor="contact-website">Website</label>
            <input
              aria-hidden="true"
              autoComplete="off"
              id="contact-website"
              maxLength={200}
              name="website"
              onChange={handleChange}
              tabIndex={-1}
              type="text"
              value={values.website}
            />
          </div>
          <div className="jc-form__foot">
            <button
              className="jc-btn jc-btn--paper"
              disabled={isPending}
              ref={submitRef}
              type="submit"
            >
              <span>{isPending ? 'Sending…' : 'Send message'}</span>
              <span aria-hidden="true" className="jc-btn__icon">
                →
              </span>
            </button>
            <p
              aria-atomic="true"
              aria-live={status.state === 'error' ? 'assertive' : 'polite'}
              className="jc-form__status"
              data-state={status.state}
              ref={statusRef}
              role={status.state === 'error' ? 'alert' : 'status'}
              tabIndex={status.state === 'success' ? -1 : undefined}
            >
              {status.message}
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
