import { useState } from 'react'
import { adminSeed } from '../services/api'

/**
 * One-click admin seed UI — requires ADMIN_SECRET from server env.
 */
export default function Admin() {
  const [secret, setSecret] = useState('')
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSeed = async (e) => {
    e.preventDefault()
    setError(null)
    setStatus(null)
    setLoading(true)

    try {
      const res = await adminSeed(secret.trim())
      setStatus(res.message)
      setSecret('')
    } catch (err) {
      setError(err.message || 'Seed failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-narrow page-admin">
      <header className="page-header">
        <h1 className="page-title">Admin — seed catalog</h1>
        <p className="page-intro">
          Reload the watch catalog from seed data. Requires the{' '}
          <code className="inline-code">ADMIN_SECRET</code> configured on the server
          (Vercel environment variables).
        </p>
      </header>

      <form className="contact-form" onSubmit={handleSeed}>
        <div className="form-field">
          <label htmlFor="admin-secret">Admin secret</label>
          <input
            id="admin-secret"
            type="password"
            className="input"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter ADMIN_SECRET"
            required
            autoComplete="off"
          />
        </div>

        {error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : null}

        {status ? (
          <p className="form-success" role="status">
            {status}
          </p>
        ) : null}

        <button type="submit" className="btn btn--primary btn--lg" disabled={loading}>
          {loading ? 'Seeding…' : 'Seed database'}
        </button>
      </form>
    </div>
  )
}
