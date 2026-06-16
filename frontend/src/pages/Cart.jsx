import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'

/**
 * Shopping cart with line items resolved from the API product catalog.
 */
export default function Cart() {
  const { items, updateQuantity, removeFromCart } = useCart()
  const { loading, error, reload, getProductById } = useProducts()

  const linesWithProducts = useMemo(
    () =>
      items.map((line) => ({
        line,
        product: getProductById(line.productId),
      })),
    [items, getProductById]
  )

  const total = useMemo(
    () =>
      linesWithProducts.reduce((sum, { line, product }) => {
        if (!product) return sum
        return sum + product.price * line.quantity
      }, 0),
    [linesWithProducts]
  )

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(total)

  if (loading && items.length > 0) return <LoadingSpinner label="Loading cart…" />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <div className="page-cart">
      <header className="page-header">
        <h1 className="page-title">Your cart</h1>
      </header>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p className="empty-state">Your cart is empty.</p>
          <Link to="/products" className="btn btn--primary">
            Browse collection
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {linesWithProducts.map(({ line, product }) => (
              <CartItem
                key={line.productId}
                line={line}
                product={product}
                onUpdateQty={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>
          <aside className="cart-summary">
            <h2 className="cart-summary-title">Order summary</h2>
            <div className="cart-summary-row cart-summary-row--total">
              <span>Total</span>
              <span>{formattedTotal}</span>
            </div>
            <p className="cart-summary-note">
              Taxes and duties calculated at checkout (demo—no real checkout).
            </p>
            <button type="button" className="btn btn--primary btn--block" disabled>
              Proceed to checkout
            </button>
            <Link to="/products" className="btn btn--outline btn--block">
              Keep shopping
            </Link>
          </aside>
        </>
      )}
    </div>
  )
}
