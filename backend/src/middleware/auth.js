import jwt from 'jsonwebtoken'

/**
 * Protect routes — requires valid JWT Bearer token.
 */
export function protect(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. Please log in.' })
  }

  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.id }
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}
