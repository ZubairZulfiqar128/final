import User from '../models/User.js'
import { mergeGuestCart } from '../services/cartService.js'
import signToken from '../utils/signToken.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body ?? {}
    const trimmedName = String(name ?? '').trim()
    const trimmedEmail = String(email ?? '').trim().toLowerCase()
    const trimmedPassword = String(password ?? '')

    if (trimmedName.length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters.' })
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      return res.status(400).json({ message: 'Valid email is required.' })
    }
    if (trimmedPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const exists = await User.findOne({ email: trimmedEmail })
    if (exists) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
    })

    const guestItems = Array.isArray(req.body?.guestItems) ? req.body.guestItems : []
    if (guestItems.length) await mergeGuestCart(user._id, guestItems)

    const token = signToken(user._id.toString())
    res.status(201).json({ user: user.toJSON(), token })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {}
    const trimmedEmail = String(email ?? '').trim().toLowerCase()
    const trimmedPassword = String(password ?? '')

    if (!trimmedEmail || !trimmedPassword) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: trimmedEmail }).select('+password')
    if (!user || !(await user.comparePassword(trimmedPassword))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const guestItems = Array.isArray(req.body?.guestItems) ? req.body.guestItems : []
    if (guestItems.length) await mergeGuestCart(user._id, guestItems)

    const token = signToken(user._id.toString())
    res.json({ user: user.toJSON(), token })
  } catch (err) {
    next(err)
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json({ user: user.toJSON() })
  } catch (err) {
    next(err)
  }
}
