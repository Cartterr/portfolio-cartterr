import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowLink } from '../components/ui/ArrowLink'
import type { PortfolioContent, PortfolioMode } from '../data/portfolio'

type ContactProps = {
  content: PortfolioContent['contact']
  id?: string
  portfolioMode: PortfolioMode
}

type FormValues = {
  name: string
  email: string
  message: string
  website: string
}

type SubmissionStatus =
  | { state: 'idle'; message: '' }
  | { state: 'pending' | 'success' | 'error'; message: string }

const emptyForm: FormValues = {
  name: '',
  email: '',
  message: '',
  website: '',
}

const successMessage = 'Thanks for reaching out. Your message has been received.'
const errorMessage =
  'I couldn’t send your message. Please try again or use one of the direct links below.'

export function Contact({ content, id = 'contact', portfolioMode }: ContactProps) {
  const [values, setValues] = useState<FormValues>(emptyForm)
  const [status, setStatus] = useState<SubmissionStatus>({ state: 'idle', message: '' })
  const statusRef = useRef<HTMLParagraphElement>(null)
  const isPending = status.state === 'pending'

  useEffect(() => {
    if (status.state === 'success') {
      statusRef.current?.focus()
    }
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
        body: JSON.stringify({ ...values, portfolioMode }),
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
      aria-labelledby={`${id}-title`}
      className={`contact${id.startsWith('software-') ? ' software-contact' : ''}`}
      data-testid={id.startsWith('software-') ? 'software-section' : undefined}
      id={id}
    >
      <div className="contact__inner">
        <div className="contact__intro">
          <p className="eyebrow">Contact</p>
          <h2 id={`${id}-title`}>{content.heading}</h2>
          <p>{content.body}</p>
          <ul aria-label="Direct contact links" className="contact__links">
            {content.links.map((link) => (
              <li key={link.href}>
                <ArrowLink {...link} />
              </li>
            ))}
          </ul>
        </div>

        <form
          aria-busy={isPending}
          aria-label={id.startsWith('software-') ? 'Software project inquiry' : 'Contact form'}
          className="contact-form"
          onSubmit={handleSubmit}
        >
          <div className="contact-form__field">
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
          <div className="contact-form__field">
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
          <div className="contact-form__field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              maxLength={4000}
              name="message"
              onChange={handleChange}
              required
              rows={6}
              value={values.message}
            />
          </div>
          <div aria-hidden="true" className="contact-form__honeypot">
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
          <button className="contact-form__submit" disabled={isPending} type="submit">
            {isPending ? 'Sending…' : 'Send message'}
          </button>
          <p
            aria-atomic="true"
            aria-live={status.state === 'error' ? 'assertive' : 'polite'}
            className="contact-form__status"
            ref={statusRef}
            role={status.state === 'error' ? 'alert' : 'status'}
            tabIndex={status.state === 'success' ? -1 : undefined}
          >
            {status.message}
          </p>
        </form>
      </div>
    </section>
  )
}
