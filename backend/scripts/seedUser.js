// Run: node scripts/seedUser.js
// Inserts one demo user document into the `users` collection.

import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from backend folder
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017'
const DEFAULT_DB = 'stichUP'

// If MONGO_URI doesn't include a database path, append default DB
let connectUri = MONGO_URI
if (!/\/[^\/]+$/.test(MONGO_URI)) {
  connectUri = MONGO_URI.replace(/\/$/, '') + '/' + DEFAULT_DB
}

async function seedUser() {
  try {
    console.log('Connecting to', connectUri)
    await mongoose.connect(connectUri, { useNewUrlParser: true, useUnifiedTopology: true })

    const password = 'demo1234'
    const hashed = await bcrypt.hash(password, 10)

    const user = {
      name: 'Demo User',
      email: 'demo.user@example.com',
      phone: '9000000010',
      password: hashed,
      role: 'user',
      address: '',
      credits: 0,
      createdAt: new Date()
    }

    const collection = mongoose.connection.collection('users')

    // Remove any existing demo user with same email
    await collection.deleteMany({ email: user.email })

    const res = await collection.insertOne(user)
    console.log(`Inserted demo user with id: ${res.insertedId}`)
  } catch (err) {
    console.error('Seeding user failed:', err)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected')
  }
}

seedUser()
