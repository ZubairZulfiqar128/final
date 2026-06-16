import { useEffect, useState } from 'react'
import { submitContact } from '../services/api'

const initial = { name: '', email: '', message: '' }

/**
 * Contact form with validation; submissions saved to MongoDB via API.
 */
export default function Contact() {
  const [values, setValues] = useState(initial)
  const [touched, setTouched] = useState({})
  const [submitStatus, setSubmitStatus] = useState(null)
  const [serverError, setServerError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const errors = {}
  if (!values.name.trim()) errors.name = 'Name is required.'
  else if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.'

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!emailOk) errors.email = 'Enter a valid email address.'

  if (!values.message.trim()) errors.message = 'Message is required.'
  else if (values.message.trim().length < 10)
    errors.message = 'Please write at least 10 characters.'

  const isValid = Object.keys(errors).length === 0

  useEffect(() => {
    if (submitStatus !== 'success') return
    const t = setTimeout(() => setSubmitStatus(null), 5000)
    return () => clearTimeout(t)
  }, [submitStatus])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setServerError(null)
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    setServerError(null)
    if (!isValid) return

    setSubmitting(true)
    try {
      const res = await submitContact({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      })
      setSubmitStatus('success')
      setValues(initial)
      setTouched({})
      if (res.message) {
        /* server message shown via success banner */
      }
    } catch (err) {
      setServerError(err.message || 'Could not send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const showErr = (field) => touched[field] && errors[field]

  return (
    <div className="page-narrow page-contact">
      <header className="page-header">
        <h1 className="page-title">Contact us</h1>
        <p className="page-intro">
          Our concierge replies within one business day. For bespoke orders, mention your
          preferred reference.
        </p>
      </header>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            className={`input ${showErr('name') ? 'input--error' : ''}`}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="name"
          />
          {showErr('name') ? <p className="field-error">{errors.name}</p> : null}
        </div>

        <div className="form-field">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            className={`input ${showErr('email') ? 'input--error' : ''}`}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
          />
          {showErr('email') ? <p className="field-error">{errors.email}</p> : null}
        </div>

        <div className="form-field">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            className={`input textarea ${showErr('message') ? 'input--error' : ''}`}
            rows={5}
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {showErr('message') ? <p className="field-error">{errors.message}</p> : null}
        </div>

        {serverError ? (
          <p className="field-error" role="alert">
            {serverError}
          </p>
        ) : null}

        {submitStatus === 'success' ? (
          <p className="form-success" role="status">
            Thank you—your message has been saved. Our concierge will reply soon.
          </p>
        ) : null}

        <button type="submit" className="btn btn--primary btn--lg" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  )
}
