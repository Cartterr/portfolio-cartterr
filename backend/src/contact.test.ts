import { describe, expect, it } from 'vitest'
import { buildContactMail, escapeHtml } from './contact'

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
})
