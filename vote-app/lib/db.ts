import mongoose from 'mongoose'

declare global {
  
  var mongoose: { conn: any, promise: any } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || ''

if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local')

let cached = global.mongoose ?? (global.mongoose = { conn: null, promise: null })

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
