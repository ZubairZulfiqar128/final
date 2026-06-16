import { Link } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'

/**
 * Landing: hero, featured watches (from API), and primary CTAs.
 */
export default function Home({ onQuickView }) {
  const { products, loading, error, reload } = useProducts()
  const featured = products.filter((p) => p.featured).slice(0, 4)

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Independent luxury since 1892</p>
          <h1 className="hero-title">Timepieces crafted for a lifetime</h1>
          <p className="hero-lead">
            Discover dress classics, certified divers, and rare complications—each
            piece authenticated and ready to wear.
          </p>
          <div className="hero-cta">
            <Link to="/products" className="btn btn--primary btn--lg">
              Shop the collection
            </Link>
            <Link to="/contact" className="btn btn--outline btn--lg">
              Book a consultation
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden>
          <div className="hero-glow" />
          <div className="hero-ring" />
        </div>
      </section>

      <section className="section featured-section">
        <div className="section-header">
          <h2 className="section-title">Featured watches</h2>
          <p className="section-subtitle">
            A rotation of our most requested references—updated monthly.
          </p>
        </div>

        {loading ? <LoadingSpinner label="Loading featured watches…" /> : null}
        {error ? <ErrorMessage message={error} onRetry={reload} /> : null}

        {!loading && !error ? (
          <>
            <div className="product-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
              ))}
            </div>
            <div className="section-cta">
              <Link to="/products" className="btn btn--outline">
                View all products
              </Link>
            </div>
          </>
        ) : null}
      </section>

      <section className="cta-band">
        <div className="cta-band-inner">
          <h2 className="cta-band-title">White-glove delivery worldwide</h2>
          <p className="cta-band-text">
            Complimentary sizing, insured shipping, and 24-month concierge support on
            every order.
          </p>
          <Link to="/about" className="btn btn--light">
            Learn about Maison Chronos
          </Link>
        </div>
      </section>
    </>
  )
}
