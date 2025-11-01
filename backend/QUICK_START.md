# Quick Start Guide

## The Problem
If you see `ECONNRESET` or `500 Internal Server Error`, the backend server is **not running**.

## Solution: Start the Backend Server

### Option 1: Using npm (Recommended)
```bash
cd backend
npm run dev
```

### Option 2: Using node directly
```bash
cd backend
node server.js
```

### What You Should See:
```
✅ MongoDB Connected to mongodb://127.0.0.1:27017/stichUP
🚀 Server running on http://localhost:5000
📡 MongoDB: mongodb://127.0.0.1:27017/stichUP
✅ Backend is ready! Waiting for requests...
```

### If You See MongoDB Errors:
1. Make sure MongoDB is installed and running
2. Windows: Check Services for "MongoDB" 
3. Test MongoDB: Open new terminal → `mongosh`
4. If MongoDB is not installed, install it or use MongoDB Atlas

### Test the Server:
After starting, test in another terminal:
```powershell
Invoke-WebRequest -Uri http://localhost:5000/ -UseBasicParsing
```

Should return: `{"status":"ok","env":"development"}`

## Keep It Running!
**IMPORTANT:** Keep the backend terminal open! If you close it, the server stops and you'll get errors again.

## Two Terminals Needed:
- **Terminal 1**: Backend server (`cd backend && npm run dev`)
- **Terminal 2**: Frontend server (`cd Frontend && npm run dev`)

## Demo Login Credentials:
- **Customer**: Phone `7340015201`, Password `123456`
- **Tailor**: Phone `9829615201`, Password `123456`

