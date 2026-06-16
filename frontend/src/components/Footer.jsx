import { Link } from 'react-router-dom'

/**
 * Site footer with quick links and subtle branding.
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-mark brand-mark--footer" aria-hidden />
          <p className="footer-tagline">
            Curated Swiss & European timepieces. By appointment and online.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/products">Collection</Link>
          <Link to="/about">Our story</Link>
          <Link to="/contact">Concierge</Link>
        </div>
        <p className="footer-copy">© {year} Maison Chronos. All rights reserved.</p>
      </div>
    </footer>
  )
}
