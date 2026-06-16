import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { useCart } from '../context/CartContext'
import { fetchProduct } from '../services/api'

/**
 * Detail view for a single product from the API; supports add-to-cart.
 */
export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [addedOpen, setAddedOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchProduct(id)
        if (!cancelled) setProduct(data)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load product')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) return <LoadingSpinner label="Loading watch details…" />
  if (error) return <ErrorMessage message={error} />

  if (!product) {
    return (
      <div className="page-narrow">
        <p className="empty-state">This watch is not in our catalog.</p>
        <Link to="/products" className="btn btn--primary">
          Back to collection
        </Link>
      </div>
    )
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(product.price)

  const handleAdd = () => {
    addToCart(product.id, qty)
    setAddedOpen(true)
  }

  return (
    <div className="page-detail">
      <button type="button" className="link-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-grid">
        <div className="detail-image-col">
          <div className="detail-image-frame">
            <img src={product.image} alt={product.name} className="detail-image" />
          </div>
        </div>
        <div className="detail-info">
          <p className="eyebrow">{product.brand}</p>
          <h1 className="detail-title">{product.name}</h1>
          <p className="detail-price">{formattedPrice}</p>
          <p className="detail-category">
            <span className="badge">{product.category}</span>
          </p>
          <p className="detail-description">{product.description}</p>

          <div className="spec-table">
            <h2 className="spec-heading">Specifications</h2>
            <dl className="spec-list">
              <div className="spec-row">
                <dt>Case</dt>
                <dd>{product.specs.case}</dd>
              </div>
              <div className="spec-row">
                <dt>Movement</dt>
                <dd>{product.specs.movement}</dd>
              </div>
              <div className="spec-row">
                <dt>Crystal</dt>
                <dd>{product.specs.crystal}</dd>
              </div>
              <div className="spec-row">
                <dt>Water resistance</dt>
                <dd>{product.specs.waterResistance}</dd>
              </div>
            </dl>
          </div>

          <div className="detail-buy">
            <label htmlFor="detail-qty" className="filter-label">
              Quantity
            </label>
            <div className="detail-buy-row">
              <input
                id="detail-qty"
                type="number"
                className="input input--qty"
                min={1}
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, parseInt(e.target.value, 10) || 1))
                }
              />
              <button type="button" className="btn btn--primary btn--lg" onClick={handleAdd}>
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={addedOpen}
        onClose={() => setAddedOpen(false)}
        title="Added to cart"
      >
        <p className="modal-text">
          {qty} × {product.name} is in your bag.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn btn--outline" onClick={() => setAddedOpen(false)}>
            Continue shopping
          </button>
          <Link to="/cart" className="btn btn--primary" onClick={() => setAddedOpen(false)}>
            View cart
          </Link>
        </div>
      </Modal>
    </div>
  )
}
