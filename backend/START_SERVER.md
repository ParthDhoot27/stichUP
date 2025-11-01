# Starting the Backend Server

## Quick Start

1. **Make sure MongoDB is running**
   - Windows: Check if MongoDB service is running in Services
   - Or run: `mongod` in a terminal

2. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

3. **You should see:**
   ```
   ✅ MongoDB Connected to mongodb://127.0.0.1:27017/stichUP
   🚀 Server running on http://localhost:5000
   📡 MongoDB: mongodb://127.0.0.1:27017/stichUP
   ✅ Backend is ready! Waiting for requests...
   ```

4. **If you see MongoDB connection errors:**
   - Make sure MongoDB is installed and running
   - Check if port 27017 is not blocked
   - Try: `mongosh` to test MongoDB connection

## Seeding Demo Users

Before testing login, make sure to seed the database:

```bash
cd backend
npm run seed:user
```

This creates:
- **Customer**: Phone `7340015201`, Password `123456`
- **Tailor**: Phone `9829615201`, Password `123456`

## Testing the Server

Open another terminal and test:
```bash
curl http://localhost:5000/
```

Should return: `{"status":"ok","env":"development"}`

