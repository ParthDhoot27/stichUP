// Run: node scripts/updatePassword.js
// Updates password for a user by phone number

import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'

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

async function updatePassword() {
  try {
    console.log('Connecting to', connectUri)
    await mongoose.connect(connectUri, { useNewUrlParser: true, useUnifiedTopology: true })

    const phone = '9000000010'
    const newPassword = 'demo@1234'
    const normalizedPhone = phone.replace(/\D/g, "")
    
    console.log(`Looking for user with phone: ${normalizedPhone}`)
    
    // Find user with normalized phone
    const user = await User.findOne({
      $or: [
        { phone: normalizedPhone },
        { phone: phone }
      ]
    }).select('+password')

    if (!user) {
      console.log('User not found!')
      console.log('Checking all users in database...')
      const allUsers = await User.find({}).select('phone email name')
      console.log('Available users:', allUsers)
      return
    }

    console.log(`Found user: ${user.name || user.email || 'N/A'} (Phone: ${user.phone})`)
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Update password
    user.password = hashedPassword
    await user.save()
    
    console.log(`✅ Password updated successfully for phone: ${user.phone}`)
    console.log(`New password: ${newPassword}`)
  } catch (err) {
    console.error('Update password failed:', err)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected')
  }
}

updatePassword()

