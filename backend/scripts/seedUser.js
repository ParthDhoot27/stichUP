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
    await mongoose.connect(connectUri)

    // Create multiple demo users
    const users = [
      {
        name: 'Demo User',
        email: 'demo.user@example.com',
        phone: '9000000010',
        password: await bcrypt.hash('demo@1234', 10),
        role: 'user',
        address: '',
        credits: 0
      },
      {
        name: 'Demo Customer',
        email: 'customer@example.com',
        phone: '7340015201',
        password: await bcrypt.hash('123456', 10),
        role: 'user',
        address: '',
        credits: 0
      },
      {
        name: 'Demo Tailor',
        email: 'tailor@example.com',
        phone: '9829615201',
        password: await bcrypt.hash('123456', 10),
        role: 'tailor',
        address: '',
        credits: 0
      }
    ]

    const collection = mongoose.connection.collection('users')

    // Remove any existing demo users with same emails/phones
    const emails = users.map(u => u.email)
    const phones = users.map(u => u.phone)
    await collection.deleteMany({ 
      $or: [
        { email: { $in: emails } },
        { phone: { $in: phones } }
      ]
    })

    const res = await collection.insertMany(users)
    console.log(`✅ Inserted ${res.insertedCount} demo users:`)
    users.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.name} - Phone: ${u.phone}, Password: ${u.phone === '9000000010' ? 'demo@1234' : '123456'}`)
    })
  } catch (err) {
    console.error('Seeding user failed:', err)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected')
  }
}

seedUser()
