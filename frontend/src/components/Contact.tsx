import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, GraduationCap, Linkedin, Mail, Send } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const contactCards = [
  {
    label: 'Primary email',
    value: 'jose.carterx@gmail.com',
    href: 'mailto:jose.carterx@gmail.com',
    icon: Mail,
  },
  {
    label: 'University',
    value: 'jrcarter@uc.cl',
    href: 'mailto:jrcarter@uc.cl',
    icon: GraduationCap,
  },
  {
    label: 'GitHub',
    value: 'github.com/Cartterr',
    href: 'https://github.com/Cartterr',
    icon: Github,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/jose-carter-arriagada',
    href: 'https://linkedin.com/in/jose-carter-arriagada',
    icon: Linkedin,
  },
]

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (submitStatus === 'idle') return

    const timer = window.setTimeout(() => setSubmitStatus('idle'), 4000)
    return () => window.clearTimeout(timer)
  }, [submitStatus])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      setSubmitStatus(response.ok ? 'success' : 'error')
      if (response.ok) {
        setFormData({ name: '', email: '', message: '' })
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-7"
        >
          <p className="section-kicker">Contact</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#f8f5ec] sm:text-5xl">If the work is serious, I am interested.</h2>
          <p className="mt-5 text-base leading-7 text-zinc-300">
            Best fit conversations are around product engineering, AI-backed systems, infrastructure cleanups, data-heavy research tooling, or hard debugging on messy production surfaces.
          </p>

          <div className="mt-8 grid gap-3">
            {contactCards.map((card) => {
              const Icon = card.icon
              return (
                <a
                  key={card.value}
                  href={card.href}
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel={card.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#151515] px-5 py-4 transition hover:border-white/20 hover:bg-[#1a1a1a]"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-black/12 text-zinc-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.2em] text-zinc-500">{card.label}</span>
                    <span className="block text-sm text-zinc-100">{card.value}</span>
                  </span>
                </a>
              )
            })}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-7"
        >
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm uppercase tracking-[0.2em] text-zinc-500">Name</span>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="rounded-2xl border border-white/10 bg-[#151515] px-4 py-4 text-white outline-none transition focus:border-white"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm uppercase tracking-[0.2em] text-zinc-500">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="rounded-2xl border border-white/10 bg-[#151515] px-4 py-4 text-white outline-none transition focus:border-white"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm uppercase tracking-[0.2em] text-zinc-500">Message</span>
              <textarea
                name="message"
                rows={7}
                value={formData.message}
                onChange={handleChange}
                required
                className="rounded-2xl border border-white/10 bg-[#151515] px-4 py-4 text-white outline-none transition focus:border-white"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-zinc-100 text-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#1a120d] transition hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Sending' : 'Send message'}
              <Send className="h-4 w-4" />
            </button>

            {submitStatus === 'success' ? (
              <p className="text-sm text-emerald-300">Message sent. I will reply as soon as I can.</p>
            ) : null}
            {submitStatus === 'error' ? (
              <p className="text-sm text-rose-300">Message failed. Use email directly if this keeps happening.</p>
            ) : null}
          </div>
        </motion.form>
      </div>
    </section>
  )
}

export default Contact
