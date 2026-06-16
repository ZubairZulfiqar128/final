import './config/loadEnv.js'
import connectDB, { getDbStatus } from './config/db.js'
import seedProducts from './utils/seedProducts.js'

async function seed() {
  await connectDB()
  const db = getDbStatus()
  console.log(`Connected to MongoDB (${db.database})`)
  const count = await seedProducts()
  console.log(`Seeded ${count} products into MongoDB.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
