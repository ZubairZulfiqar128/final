import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  addCartItemApi,
  fetchCart,
  removeCartItemApi,
  updateCartItemApi,
} from '../services/api'
import { useAuth } from './AuthContext'

const GUEST_CART_KEY = 'maison-chronos-cart-v1'

const CartContext = createContext(null)

function readGuestCart() {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeGuestCart(items) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
  } catch {
    /* quota */
  }
}

function clearGuestCart() {
  try {
    localStorage.removeItem(GUEST_CART_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * Guest cart → localStorage. Logged-in cart → MongoDB via JWT API.
 */
export function CartProvider({ children }) {
  const { user, token } = useAuth()
  const isServerCart = !!(user && token)
  const [items, setItems] = useState(() => (isServerCart ? [] : readGuestCart()))
  const [syncing, setSyncing] = useState(isServerCart)

  // Fetch server cart when authenticated (provider remounts on login/logout via key)
  useEffect(() => {
    if (!user || !token) return

    let cancelled = false

    fetchCart(token)
      .then((data) => {
        if (!cancelled) setItems(data.items ?? [])
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
      .finally(() => {
        if (!cancelled) setSyncing(false)
      })

    return () => {
      cancelled = true
    }
  }, [user, token])

  // Persist guest cart only
  useEffect(() => {
    if (!isServerCart) writeGuestCart(items)
  }, [items, isServerCart])

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (isServerCart) {
        setSyncing(true)
        try {
          const data = await addCartItemApi(token, productId, quantity)
          setItems(data.items ?? [])
        } finally {
          setSyncing(false)
        }
        return
      }

      setItems((prev) => {
        const existing = prev.find((line) => line.productId === productId)
        if (existing) {
          return prev.map((line) =>
            line.productId === productId
              ? { ...line, quantity: line.quantity + quantity }
              : line
          )
        }
        return [...prev, { productId, quantity }]
      })
    },
    [isServerCart, token]
  )

  const removeFromCart = useCallback(
    async (productId) => {
      if (isServerCart) {
        setSyncing(true)
        try {
          const data = await removeCartItemApi(token, productId)
          setItems(data.items ?? [])
        } finally {
          setSyncing(false)
        }
        return
      }

      setItems((prev) => prev.filter((line) => line.productId !== productId))
    },
    [isServerCart, token]
  )

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      const safeQty = Math.max(0, Math.floor(Number(quantity) || 0))

      if (isServerCart) {
        setSyncing(true)
        try {
          const data = await updateCartItemApi(token, productId, safeQty)
          setItems(data.items ?? [])
        } finally {
          setSyncing(false)
        }
        return
      }

      setItems((prev) => {
        if (safeQty <= 0) return prev.filter((line) => line.productId !== productId)
        return prev.map((line) =>
          line.productId === productId ? { ...line, quantity: safeQty } : line
        )
      })
    },
    [isServerCart, token]
  )

  const clearCart = useCallback(async () => {
    if (isServerCart) {
      setItems([])
      return
    }
    setItems([])
    clearGuestCart()
  }, [isServerCart])

  const value = useMemo(
    () => ({
      items,
      syncing,
      isServerCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getGuestItems: readGuestCart,
      clearGuestCart,
    }),
    [items, syncing, isServerCart, addToCart, removeFromCart, updateQuantity, clearCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export { GUEST_CART_KEY }
