import Product from '../models/Product.js'

export async function getProducts(_req, res, next) {
  try {
    const products = await Product.find().sort({ name: 1 }).lean()
    const formatted = products.map((p) => ({
      id: p.productId,
      name: p.name,
      brand: p.brand,
      price: p.price,
      category: p.category,
      featured: p.featured,
      shortDescription: p.shortDescription,
      description: p.description,
      image: p.image,
      specs: p.specs,
    }))
    res.json(formatted)
  } catch (err) {
    next(err)
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await Product.findOne({ productId: req.params.id })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product.toJSON())
  } catch (err) {
    next(err)
  }
}
