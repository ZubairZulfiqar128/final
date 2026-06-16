import { useMemo } from 'react'

/**
 * Single cart line with quantity controls and remove.
 */
export default function CartItem({ line, product, onUpdateQty, onRemove }) {
  const subtotal = useMemo(
    () => (product ? product.price * line.quantity : 0),
    [product, line.quantity]
  )

  const formattedLine = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(subtotal)

  if (!product) return null

  return (
    <div className="cart-item">
      <img
        src={product.image}
        alt=""
        className="cart-item-thumb"
        width={96}
        height={96}
      />
      <div className="cart-item-info">
        <h3 className="cart-item-name">{product.name}</h3>
        <p className="cart-item-brand">{product.brand}</p>
        <p className="cart-item-price-each">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(product.price)}{' '}
          each
        </p>
      </div>
      <div className="cart-item-qty">
        <label htmlFor={`qty-${line.productId}`} className="sr-only">
          Quantity for {product.name}
        </label>
        <div className="qty-control">
          <button
            type="button"
            className="qty-btn"
            aria-label="Decrease quantity"
            onClick={() => onUpdateQty(line.productId, line.quantity - 1)}
          >
            −
          </button>
          <input
            id={`qty-${line.productId}`}
            className="qty-input"
            type="number"
            min={1}
            value={line.quantity}
            onChange={(e) =>
              onUpdateQty(line.productId, parseInt(e.target.value, 10) || 0)
            }
          />
          <button
            type="button"
            className="qty-btn"
            aria-label="Increase quantity"
            onClick={() => onUpdateQty(line.productId, line.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      <div className="cart-item-subtotal">
        <span className="cart-item-subtotal-label">Subtotal</span>
        <span className="cart-item-subtotal-value">{formattedLine}</span>
      </div>
      <button
        type="button"
        className="cart-item-remove"
        onClick={() => onRemove(line.productId)}
        aria-label={`Remove ${product.name} from cart`}
      >
        Remove
      </button>
    </div>
  )
}
