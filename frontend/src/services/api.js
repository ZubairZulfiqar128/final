/** API base — empty string uses same origin (/api) on Vercel */
const API_BASE = import.meta.env.VITE_API_URL ?? ''

async function request(path, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`)
  }

  return data
}

/** Fetch all products from MongoDB via Express API */
export function fetchProducts() {
  return request('/api/products')
}

/** Fetch one product by catalog id (e.g. aur-001) */
export function fetchProduct(id) {
  return request(`/api/products/${encodeURIComponent(id)}`)
}

/** Submit contact form — persisted in MongoDB */
export function submitContact(payload) {
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ——— Auth ———

export function registerUser(payload, token = null) {
  return request(
    '/api/auth/register',
    { method: 'POST', body: JSON.stringify(payload) },
    token
  )
}

export function loginUser(payload) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchMe(token) {
  return request('/api/auth/me', {}, token)
}

// ——— Server cart (JWT required) ———

export function fetchCart(token) {
  return request('/api/cart', {}, token)
}

export function addCartItemApi(token, productId, quantity = 1) {
  return request(
    '/api/cart/items',
    { method: 'POST', body: JSON.stringify({ productId, quantity }) },
    token
  )
}

export function updateCartItemApi(token, productId, quantity) {
  return request(
    `/api/cart/items/${encodeURIComponent(productId)}`,
    { method: 'PATCH', body: JSON.stringify({ quantity }) },
    token
  )
}

export function removeCartItemApi(token, productId) {
  return request(
    `/api/cart/items/${encodeURIComponent(productId)}`,
    { method: 'DELETE' },
    token
  )
}

export function mergeCartApi(token, items) {
  return request(
    '/api/cart/merge',
    { method: 'POST', body: JSON.stringify({ items }) },
    token
  )
}

// ——— Admin ———

export function adminSeed(adminSecret) {
  return request('/api/admin/seed', {
    method: 'POST',
    headers: { 'x-admin-secret': adminSecret },
  })
}
