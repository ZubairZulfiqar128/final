import Cart from '../models/Cart.js'

function normalizeItems(items) {
  return items
    .map((line) => ({
      productId: String(line.productId ?? ''),
      quantity: Math.max(1, Math.floor(Number(line.quantity) || 1)),
    }))
    .filter((line) => line.productId)
}

export async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId })
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] })
  }
  return cart
}

export function cartToResponse(cart) {
  return {
    items: cart.items.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
    })),
  }
}

/** Merge guest cart lines into the user's server cart. */
export async function mergeGuestCart(userId, guestItems) {
  const cart = await getOrCreateCart(userId)
  const incoming = normalizeItems(guestItems)

  for (const line of incoming) {
    const existing = cart.items.find((i) => i.productId === line.productId)
    if (existing) {
      existing.quantity += line.quantity
    } else {
      cart.items.push(line)
    }
  }

  await cart.save()
  return cart
}

export async function addCartItem(userId, productId, quantity = 1) {
  const cart = await getOrCreateCart(userId)
  const qty = Math.max(1, Math.floor(Number(quantity) || 1))
  const existing = cart.items.find((i) => i.productId === productId)

  if (existing) {
    existing.quantity += qty
  } else {
    cart.items.push({ productId, quantity: qty })
  }

  await cart.save()
  return cart
}

export async function updateCartItemQty(userId, productId, quantity) {
  const cart = await getOrCreateCart(userId)
  const qty = Math.floor(Number(quantity) || 0)

  if (qty <= 0) {
    cart.items = cart.items.filter((i) => i.productId !== productId)
  } else {
    const existing = cart.items.find((i) => i.productId === productId)
    if (!existing) {
      cart.items.push({ productId, quantity: qty })
    } else {
      existing.quantity = qty
    }
  }

  await cart.save()
  return cart
}

export async function removeCartItem(userId, productId) {
  const cart = await getOrCreateCart(userId)
  cart.items = cart.items.filter((i) => i.productId !== productId)
  await cart.save()
  return cart
}

export async function clearCart(userId) {
  const cart = await getOrCreateCart(userId)
  cart.items = []
  await cart.save()
  return cart
}
