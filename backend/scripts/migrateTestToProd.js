#!/usr/bin/env node
// Copies all collections from a source MongoDB database into a target database (upserts by _id).
// Usage: set MONGO_URI, SOURCE_DB, TARGET_DB in backend/.env or environment, then run:
// node scripts/migrateTestToProd.js

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017'
const SOURCE_DB = process.env.SOURCE_DB || 'test'
const TARGET_DB = process.env.TARGET_DB || 'stichUP'

async function migrate() {
  const client = new MongoClient(MONGO_URI)
  try {
    console.log('Connecting to', MONGO_URI)
    await client.connect()
    const src = client.db(SOURCE_DB)
    const dst = client.db(TARGET_DB)

    const cols = await src.listCollections().toArray()
    if (!cols.length) {
      console.log(`No collections found in source DB '${SOURCE_DB}'. Nothing to do.`)
      return
    }

    for (const colInfo of cols) {
      const name = colInfo.name
      console.log(`Migrating collection: ${name}`)
      const srcCol = src.collection(name)
      const dstCol = dst.collection(name)

      const docs = await srcCol.find({}).toArray()
      console.log(`  found ${docs.length} documents`)
      if (!docs.length) continue

      // Prepare bulk upsert operations to preserve _id and avoid duplicates
      const ops = docs.map(d => ({ replaceOne: { filter: { _id: d._id }, replacement: d, upsert: true } }))

      // execute in batches of 500
      const BATCH = 500
      for (let i = 0; i < ops.length; i += BATCH) {
        const batch = ops.slice(i, i + BATCH)
        const res = await dstCol.bulkWrite(batch)
        console.log(`    upserted ${res.upsertedCount}, modified ${res.modifiedCount}`)
      }
    }

    console.log(`Migration complete. Source: ${SOURCE_DB} -> Target: ${TARGET_DB}`)
  } catch (err) {
    console.error('Migration failed:', err)
  } finally {
    await client.close()
  }
}

migrate()
