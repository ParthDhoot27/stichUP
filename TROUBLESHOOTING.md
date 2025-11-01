# Troubleshooting Guide

## 500 Internal Server Error on Login

If you're getting a `POST http://localhost:5173/api/auth/login 500 (Internal Server Error)`, follow these steps:

### Step 1: Check if Backend Server is Running

**The most common cause is that the backend server is not running.**

1. Open a terminal
2. Navigate to backend folder:
   ```bash
   cd backend
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
4. You should see:
   ```
   ✅ MongoDB Connected to mongodb://127.0.0.1:27017/stichUP
   🚀 Server running on http://localhost:5000
   ✅ Backend is ready! Waiting for requests...
   ```

**Keep this terminal open!** The server must be running for the frontend to work.

### Step 2: Verify MongoDB is Running

If you see MongoDB connection errors:

**Windows:**
- Check Services (Win+R → `services.msc`) for "MongoDB" service
- Or test connection: Open new terminal and run `mongosh`

**Mac/Linux:**
- Check if running: `sudo systemctl status mongod`
- Start if needed: `sudo systemctl start mongod`

### Step 3: Seed the Database

Make sure demo users exist:

```bash
cd backend
npm run seed:user
```

You should see:
```
✅ Inserted customer with id: ...
✅ Inserted tailor with id: ...
```

### Step 4: Test Backend Directly

Open another terminal and test:
```bash
curl http://localhost:5000/
```

Should return: `{"status":"ok","env":"development"}`

Test login endpoint:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"7340015201\",\"password\":\"123456\"}"
```

Should return a JSON with `token` and `user`.

### Step 5: Check Frontend Proxy

The frontend (`Frontend/vite.config.js`) should have:
```js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  }
}
```

### Common Issues

**"Cannot GET /api/auth/login"**
- Backend server is not running → Start it with `cd backend && npm run dev`

**"MongoDB connection error"**
- MongoDB is not running → Start MongoDB service
- Connection string wrong → Check `backend/.env` or use default `mongodb://127.0.0.1:27017/stichUP`

**"Invalid credentials"**
- Database not seeded → Run `cd backend && npm run seed:user`
- Wrong phone/password → Use Phone `7340015201`, Password `123456`

**"Database not available" (503 error)**
- MongoDB connection failed → Check MongoDB is running
- Check backend console for MongoDB errors

## Running Both Servers

You need **two terminals**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

Then open http://localhost:5173 in your browser.

