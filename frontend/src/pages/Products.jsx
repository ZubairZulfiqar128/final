import { useMemo, useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'

const CATEGORIES = ['All', 'Dress', 'Diver', 'Pilot', 'Chronograph', 'Sport']
const PRICE_FILTERS = [
  { id: 'all', label: 'All prices', test: () => true },
  { id: 'under5k', label: 'Under $5,000', test: (p) => p.price < 5000 },
  {
    id: '5to10',
    label: '$5,000 – $10,000',
    test: (p) => p.price >= 5000 && p.price <= 10000,
  },
  { id: 'over10k', label: 'Over $10,000', test: (p) => p.price > 10000 },
]

/**
 * Full catalog from MongoDB API with search, category, and price filters.
 */
export default function Products({ onQuickView }) {
  const { products, loading, error, reload } = useProducts()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [priceId, setPriceId] = useState('all')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const priceTest = PRICE_FILTERS.find((f) => f.id === priceId)?.test ?? (() => true)

    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      const matchesCat = category === 'All' || p.category === category
      return matchesSearch && matchesCat && priceTest(p)
    })
  }, [products, search, category, priceId])

  if (loading) return <LoadingSpinner label="Loading collection…" />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <div className="page-products">
      <header className="page-header">
        <h1 className="page-title">Collection</h1>
        <p className="page-intro">
          {products.length} references in stock. Use search and filters to narrow
          your selection.
        </p>
      </header>

      <div className="filters">
        <div className="filter-group filter-search">
          <label htmlFor="product-search" className="filter-label">
            Search
          </label>
          <input
            id="product-search"
            type="search"
            className="input"
            placeholder="Name, brand, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="filter-group">
          <span className="filter-label" id="cat-label">
            Category
          </span>
          <div className="chip-row" role="group" aria-labelledby="cat-label">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`chip ${category === cat ? 'chip--active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label htmlFor="price-filter" className="filter-label">
            Price
          </label>
          <select
            id="price-filter"
            className="select"
            value={priceId}
            onChange={(e) => setPriceId(e.target.value)}
          >
            {PRICE_FILTERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No watches match your filters. Try adjusting search.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </div>
  )
}
