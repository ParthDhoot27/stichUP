// Run: node scripts/seedTailors.js
// Inserts demo tailor documents into the `tailors` collection.

import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

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

async function seed() {
  try {
    console.log('Connecting to', connectUri)
    await mongoose.connect(connectUri)

    const tailors = [
      {
        name: 'Quick Stitch',
        email: 'quickstitch@example.com',
        phone: '9000000001',
        shopPhotoUrl: 'https://images.unsplash.com/photo-1520975917765-9763f2a7b3d6?auto=format&fit=crop&w=800&q=80',
        services: {
          lightAvgMins: 30,
          heavyAvgMins: 120,
          availableServices: ['stitching', 'alterations']
        },
        isAvailable: true,
        currentOrders: 3,
        priceRange: {
          min: 100,
          max: 500
        },
        location: { type: 'Point', coordinates: [77.5946, 12.9716] }, // [lng, lat] - Bangalore
        rating: 4.5,
        totalRatings: 20,
        address: '123 MG Road, Bangalore',
        description: 'Quick and reliable stitching services'
      },
      {
        name: 'Elegant Tailors',
        email: 'elegant@example.com',
        phone: '9000000002',
        shopPhotoUrl: 'https://images.unsplash.com/photo-1542736667-069246bdbc45?auto=format&fit=crop&w=800&q=80',
        services: {
          lightAvgMins: 45,
          heavyAvgMins: 180,
          availableServices: ['custom', 'design', 'stitching']
        },
        isAvailable: false,
        currentOrders: 5,
        priceRange: {
          min: 400,
          max: 2000
        },
        location: { type: 'Point', coordinates: [72.8777, 19.0760] }, // [lng, lat] - Mumbai
        rating: 4.8,
        totalRatings: 35,
        address: '456 Fashion Street, Mumbai',
        description: 'Premium tailoring for custom suits and wedding dresses'
      },
      {
        name: 'Budget Alterations',
        email: 'budget@example.com',
        phone: '9000000003',
        shopPhotoUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
        services: {
          lightAvgMins: 20,
          heavyAvgMins: 90,
          availableServices: ['alterations', 'repair']
        },
        isAvailable: true,
        currentOrders: 1,
        priceRange: {
          min: 50,
          max: 300
        },
        location: { type: 'Point', coordinates: [77.2090, 28.6139] }, // [lng, lat] - Delhi
        rating: 4.2,
        totalRatings: 15,
        address: '789 Market Street, Delhi',
        description: 'Affordable alterations and quick repairs'
      }
    ]

    const collection = mongoose.connection.collection('tailors')

    // Optionally remove existing demo documents with same emails to avoid duplicates
    const emails = tailors.map(t => t.email)
    await collection.deleteMany({ email: { $in: emails } })

    const res = await collection.insertMany(tailors)
    console.log(`✅ Inserted ${res.insertedCount} tailor documents:`)
    tailors.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.name} - Phone: ${t.phone}, Available: ${t.isAvailable}, Rating: ${t.rating}`)
    })
  } catch (err) {
    console.error('Seeding failed:', err)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected')
  }
}

seed()
