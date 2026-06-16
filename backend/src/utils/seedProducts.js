import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import Product from '../models/Product.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Replace catalog with seed data from backend/data/products.json.
 */
export default async function seedProducts() {
  const raw = readFileSync(join(__dirname, '..', '..', 'data', 'products.json'), 'utf8')
  const products = JSON.parse(raw)

  await Product.deleteMany({})

  const docs = products.map(({ id, ...rest }) => ({
    productId: id,
    ...rest,
  }))

  await Product.insertMany(docs)
  return docs.length
}
