/**
 * Protect admin routes with x-admin-secret header matching ADMIN_SECRET env.
 */
export default function adminSecret(req, res, next) {
  const secret = process.env.ADMIN_SECRET
  if (!secret) {
    return res.status(503).json({ message: 'Admin seed is not configured on this server.' })
  }

  const provided = req.headers['x-admin-secret']
  if (!provided || provided !== secret) {
    return res.status(403).json({ message: 'Invalid admin secret.' })
  }

  next()
}
