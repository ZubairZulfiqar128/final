import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

/**
 * Registration page — creates account and merges guest cart.
 */
export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { getGuestItems, clearGuestCart } = useCart()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const guestItems = getGuestItems()
      await register({ name, email, password, guestItems })
      clearGuestCart()
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-narrow page-auth">
      <header className="page-header">
        <h1 className="page-title">Create account</h1>
        <p className="page-intro">
          Join Maison Chronos for a persistent cart synced across devices.
        </p>
      </header>

      <form className="contact-form auth-form" onSubmit={handleSubmit} noValidate>
        {error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="form-field">
          <label htmlFor="register-name">Full name</label>
          <input
            id="register-name"
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            minLength={2}
          />
        </div>

        <div className="form-field">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
          />
          <p className="field-hint">At least 6 characters.</p>
        </div>

        <button type="submit" className="btn btn--primary btn--lg" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
