import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const navLinkClass = ({ isActive }) =>
  `nav-link ${isActive ? 'nav-link--active' : ''}`.trim()

/**
 * Top navigation with responsive mobile menu, cart badge, and auth links.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { items } = useCart()
  const { user, logout, loading: authLoading } = useAuth()

  const count = items.reduce((sum, line) => sum + line.quantity, 0)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden />
          <span className="brand-text">Maison Chronos</span>
        </NavLink>

        <button
          type="button"
          className={`nav-toggle ${menuOpen ? 'nav-toggle--open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>

        <nav id="primary-nav" className={`nav ${menuOpen ? 'nav--open' : ''}`}>
          <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass} onClick={closeMenu}>
            Products
          </NavLink>
          <NavLink to="/cart" className={navLinkClass} onClick={closeMenu}>
            Cart
            {count > 0 ? <span className="nav-badge">{count}</span> : null}
          </NavLink>
          <NavLink to="/about" className={navLinkClass} onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass} onClick={closeMenu}>
            Contact
          </NavLink>

          {!authLoading ? (
            <div className="nav-auth">
              {user ? (
                <>
                  <span className="nav-user" title={user.email}>
                    Hi, {user.name.split(' ')[0]}
                  </span>
                  <button
                    type="button"
                    className="nav-link nav-link--button"
                    onClick={() => {
                      logout()
                      closeMenu()
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={navLinkClass} onClick={closeMenu}>
                    Login
                  </NavLink>
                  <Link to="/register" className="btn btn--sm btn--primary nav-register" onClick={closeMenu}>
                    Register
                  </Link>
                </>
              )}
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
