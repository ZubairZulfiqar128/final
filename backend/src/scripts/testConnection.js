import '../config/loadEnv.js'
import connectDB, { getDbStatus } from '../config/db.js'

async function test() {
  console.log('Testing MongoDB connection…\n')
  await connectDB()
  const status = getDbStatus()
  console.log('Status:', status)
  console.log('\nConnection successful.')
  process.exit(0)
}

test().catch((err) => {
  console.error('\nConnection failed:', err.message)
  process.exit(1)
})
