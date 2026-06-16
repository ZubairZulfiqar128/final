import seedProducts from '../utils/seedProducts.js'

export async function seedDatabase(_req, res, next) {
  try {
    const count = await seedProducts()
    res.json({
      message: `Database seeded successfully with ${count} products.`,
      count,
    })
  } catch (err) {
    next(err)
  }
}
