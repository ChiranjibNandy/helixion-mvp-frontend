// ─────────────────────────────────────────────
//  lib/mongodb.js
//  Singleton Mongoose connection for Next.js
//  (reuses connection across hot-reloads in dev)
// ─────────────────────────────────────────────

import mongoose from 'mongoose'

const MONGODB_URI = "mongodb+srv://theritukumar_db_user:D5jmjG7R87gneBRc@cluster0.elwzc24.mongodb.net/"

if (!MONGODB_URI) {
  throw new Error(
    '❌ Please define MONGODB_URI in your .env.local file'
  )
}

// In development, use a global variable so the connection
// survives Next.js hot module replacement
let cached = global._mongoose

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  // Return existing connection if available
  if (cached.conn) return cached.conn

  // If no pending connection, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected')
        return mongoose
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null
    throw err
  }

  return cached.conn
}
