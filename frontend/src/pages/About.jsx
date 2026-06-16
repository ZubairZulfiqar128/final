import { Link } from 'react-router-dom'

/**
 * Brand story and values (static content).
 */
export default function About() {
  return (
    <div className="page-narrow page-about">
      <header className="page-header">
        <h1 className="page-title">Our maison</h1>
        <p className="page-intro">
          Maison Chronos began as a family atelier in Geneva, pairing métiers d’art with
          modern reliability.
        </p>
      </header>

      <section className="prose-block">
        <h2>Heritage & craft</h2>
        <p>
          For three generations we have sourced movements from partner manufactures,
          finished cases in-house, and tested every watch to chronometer tolerances
          before it reaches your wrist.
        </p>
      </section>

      <section className="prose-block">
        <h2>Sustainability</h2>
        <p>
          We favor recyclable packaging, paperless warranties, and long service
          intervals—luxury that honours both the owner and the environment.
        </p>
      </section>

      <section className="prose-block">
        <h2>Visit us</h2>
        <p>
          Boutique appointments are available in Geneva and New York. Remote
          consultations ship worldwide with full insurance.
        </p>
        <Link to="/contact" className="btn btn--primary">
          Contact concierge
        </Link>
      </section>
    </div>
  )
}
