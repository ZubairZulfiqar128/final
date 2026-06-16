/** @type {import('mongodb-memory-server').MongoMemoryServer | null} */
let memoryServer = null

/**
 * Returns MongoDB URI from env, or starts an in-memory server for local dev.
 */
export async function resolveMongoUri() {
  if (process.env.MONGODB_URI?.trim()) {
    return process.env.MONGODB_URI.trim()
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'MONGODB_URI is not set. Add it in Vercel environment variables or backend/.env'
    )
  }

  const { MongoMemoryServer } = await import('mongodb-memory-server')
  memoryServer = await MongoMemoryServer.create({
    instance: { dbName: 'maison-chronos' },
  })
  const uri = memoryServer.getUri()

  console.log('⚠️  MONGODB_URI not set — using in-memory MongoDB for local development')
  console.log(`    ${uri}`)

  return uri
}

export function getMemoryServer() {
  return memoryServer
}
