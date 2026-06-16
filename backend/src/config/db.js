import mongoose from 'mongoose'
import { resolveMongoUri } from './mongoUri.js'

/** Cached connection for serverless (Vercel) cold starts */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, uri: null }
}

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected:', mongoose.connection.name)
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

/**
 * Connect to MongoDB Atlas (or in-memory DB in local dev).
 * Reuses connection across serverless invocations.
 */
export default async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn
  }

  if (!cached.uri) {
    cached.uri = await resolveMongoUri()
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(cached.uri, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

/** Connection status for health checks */
export function getDbStatus() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting']
  return {
    state: states[mongoose.connection.readyState] ?? 'unknown',
    ready: mongoose.connection.readyState === 1,
    database: mongoose.connection.name || null,
    host: mongoose.connection.host || null,
  }
}
