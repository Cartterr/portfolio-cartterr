import { describe, expect, it } from 'vitest'
import { buildContactMail, escapeHtml } from './contact.js'

describe('contact mail construction', () => {
  it('escapes HTML-derived values and uses structured reply-to data', () => {
    const mail = buildContactMail(
      {
        name: '<Ada & Co>',
        email: 'ada@example.com',
        message: '<script>alert("unsafe")</script>\nSecond line',
      },
      'portfolio@example.com',
    )

    expect(mail.replyTo).toEqual({ name: '<Ada & Co>', address: 'ada@example.com' })
    expect(mail.html).toContain('&lt;Ada &amp; Co&gt;')
    expect(mail.html).toContain('&lt;script&gt;alert(&quot;unsafe&quot;)&lt;/script&gt;<br/>Second line')
    expect(mail.html).not.toContain('<script>')
  })

  it('escapes every HTML metacharacter used by contact content', () => {
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;')
  })

  it('removes CR and LF from subject and structured reply-to header values', () => {
    const mail = buildContactMail(
      {
        name: 'Ada\r\nBcc: injected@example.com',
        email: 'ada@example.com',
        message: 'Hello',
      },
      'portfolio@example.com',
    )

    expect(mail.subject).toBe('New portfolio message from Ada Bcc: injected@example.com')
    expect(mail.replyTo).toEqual({
      name: 'Ada Bcc: injected@example.com',
      address: 'ada@example.com',
    })
    expect(mail.subject).not.toMatch(/[\r\n]/u)
  })

  it.each([
    ['software', 'Software portfolio'],
    ['visual', 'Visual portfolio'],
  ] as const)('uses a fixed label for %s portfolio context only in the subject', (portfolioMode, label) => {
    const mail = buildContactMail(
      {
        name: 'Ada',
        email: 'ada@example.com',
        message: 'Hello',
        portfolioMode,
      },
      'portfolio@example.com',
    )

    expect(mail.subject).toBe(`[${label}] New portfolio message from Ada`)
    expect(mail.text).not.toContain(portfolioMode)
    expect(mail.html).not.toContain(portfolioMode)
  })
})
