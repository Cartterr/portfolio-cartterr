import type { RequestHandler } from 'express'
import type { SendMailOptions } from 'nodemailer'

export type ValidContactMessage = {
  name: string
  email: string
  message: string
  portfolioMode?: PortfolioMode
}

export type PortfolioMode = 'software' | 'visual'

export type SendContactEmail = (message: ValidContactMessage) => Promise<void>

type ValidatedContactBody =
  | { isHoneypot: true }
  | { isHoneypot: false; message: ValidContactMessage }

type ContactValidationResult =
  | { valid: true; value: ValidatedContactBody }
  | { valid: false }

const allowedContactFields = new Set(['name', 'email', 'message', 'website', 'portfolioMode'])
const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u
const portfolioSubjectLabels: Record<PortfolioMode, string> = {
  software: 'Software portfolio',
  visual: 'Visual portfolio',
}

export const CONTACT_SUCCESS_MESSAGE = 'Thanks for reaching out. Your message has been received.'
export const CONTACT_VALIDATION_MESSAGE = 'Please provide a valid name, email, and message.'
export const CONTACT_DELIVERY_ERROR_MESSAGE =
  'Your message could not be sent. Please try again or use a direct contact link.'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function validateContactBody(body: unknown): ContactValidationResult {
  if (!isRecord(body) || Object.keys(body).some((key) => !allowedContactFields.has(key))) {
    return { valid: false }
  }

  const { portfolioMode, website = '' } = body
  if (
    portfolioMode !== undefined &&
    portfolioMode !== 'software' &&
    portfolioMode !== 'visual'
  ) {
    return { valid: false }
  }

  if (typeof website !== 'string' || website.length > 200) {
    return { valid: false }
  }

  if (website.length > 0) {
    return { valid: true, value: { isHoneypot: true } }
  }

  const { name, email, message } = body
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string'
  ) {
    return { valid: false }
  }

  const normalized: ValidContactMessage = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  }
  if (portfolioMode !== undefined) {
    normalized.portfolioMode = portfolioMode
  }

  if (
    normalized.name.length < 1 ||
    normalized.name.length > 80 ||
    normalized.email.length < 1 ||
    normalized.email.length > 254 ||
    !basicEmailPattern.test(normalized.email) ||
    normalized.message.length < 1 ||
    normalized.message.length > 4000
  ) {
    return { valid: false }
  }

  return {
    valid: true,
    value: {
      isHoneypot: false,
      message: normalized,
    },
  }
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function normalizeHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, ' ')
}

export function buildContactMail(
  message: ValidContactMessage,
  smtpUser: string,
): SendMailOptions {
  const safeName = normalizeHeaderValue(message.name)
  const htmlMessage = escapeHtml(message.message).replace(/\r\n?|\n/g, '<br/>')
  const subjectPrefix = message.portfolioMode
    ? `[${portfolioSubjectLabels[message.portfolioMode]}] `
    : ''

  return {
    from: { name: 'Portfolio Contact', address: smtpUser },
    to: smtpUser,
    subject: `${subjectPrefix}New portfolio message from ${safeName}`,
    replyTo: { name: safeName, address: message.email },
    text: `From: ${message.name} <${message.email}>\n\n${message.message}`,
    html: `<p><strong>From:</strong> ${escapeHtml(message.name)} &lt;${escapeHtml(message.email)}&gt;</p><p>${htmlMessage}</p>`,
  }
}

async function sendContactEmailWithSmtp(message: ValidContactMessage) {
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  if (!smtpUser || !smtpPass) {
    throw new Error('Contact delivery is unavailable')
  }

  const { default: nodemailer } = await import('nodemailer')
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: smtpUser, pass: smtpPass },
  })

  await transporter.sendMail(buildContactMail(message, smtpUser))
}

export function createContactHandler(
  sendContactEmail: SendContactEmail = sendContactEmailWithSmtp,
): RequestHandler {
  return async (request, response) => {
    const validation = validateContactBody(request.body)
    if (!validation.valid) {
      response.status(400).json({ success: false, message: CONTACT_VALIDATION_MESSAGE })
      return
    }

    if (validation.value.isHoneypot) {
      response.json({ success: true, message: CONTACT_SUCCESS_MESSAGE })
      return
    }

    try {
      await sendContactEmail(validation.value.message)
      response.json({ success: true, message: CONTACT_SUCCESS_MESSAGE })
    } catch {
      response.status(500).json({ success: false, message: CONTACT_DELIVERY_ERROR_MESSAGE })
    }
  }
}
