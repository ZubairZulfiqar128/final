import Contact from '../models/Contact.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitContact(req, res, next) {
  try {
    const { name, email, message } = req.body ?? {}
    const trimmedName = String(name ?? '').trim()
    const trimmedEmail = String(email ?? '').trim()
    const trimmedMessage = String(message ?? '').trim()

    if (trimmedName.length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters.' })
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      return res.status(400).json({ message: 'Valid email is required.' })
    }
    if (trimmedMessage.length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters.' })
    }

    await Contact.create({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    })

    res.status(201).json({
      message: 'Thank you—our concierge will reply within one business day.',
    })
  } catch (err) {
    next(err)
  }
}
