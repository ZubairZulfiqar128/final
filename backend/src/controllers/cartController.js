import {
  addCartItem,
  cartToResponse,
  clearCart,
  getOrCreateCart,
  mergeGuestCart,
  removeCartItem,
  updateCartItemQty,
} from '../services/cartService.js'

export async function getCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.id)
    res.json(cartToResponse(cart))
  } catch (err) {
    next(err)
  }
}

export async function addItem(req, res, next) {
  try {
    const { productId, quantity } = req.body ?? {}
    if (!productId) return res.status(400).json({ message: 'productId is required.' })
    const cart = await addCartItem(req.user.id, String(productId), quantity ?? 1)
    res.json(cartToResponse(cart))
  } catch (err) {
    next(err)
  }
}

export async function updateItem(req, res, next) {
  try {
    const { quantity } = req.body ?? {}
    const cart = await updateCartItemQty(req.user.id, req.params.productId, quantity)
    res.json(cartToResponse(cart))
  } catch (err) {
    next(err)
  }
}

export async function removeItem(req, res, next) {
  try {
    const cart = await removeCartItem(req.user.id, req.params.productId)
    res.json(cartToResponse(cart))
  } catch (err) {
    next(err)
  }
}

export async function mergeCart(req, res, next) {
  try {
    const guestItems = Array.isArray(req.body?.items) ? req.body.items : []
    const cart = await mergeGuestCart(req.user.id, guestItems)
    res.json(cartToResponse(cart))
  } catch (err) {
    next(err)
  }
}

export async function clearUserCart(req, res, next) {
  try {
    const cart = await clearCart(req.user.id)
    res.json(cartToResponse(cart))
  } catch (err) {
    next(err)
  }
}
