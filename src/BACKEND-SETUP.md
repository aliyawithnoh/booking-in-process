# Backend Setup Guide

## Overview

The BCHS Room Booking System now connects to **your backend API** instead of directly calling OpenAI. This guide explains how to set up and configure the backend.

## Architecture

```
┌─────────────────┐
│   Frontend      │
│ (HTML/CSS/JS)   │
└────────┬────────┘
         │
         │ HTTP/HTTPS
         │
         v
┌─────────────────┐
│  Your Backend   │
│     (API)       │
└────────┬────────┘
         │
         ├─► Database (PostgreSQL, MongoDB, etc.)
         │
         └─► OpenAI API (optional, for AI features)
```

## Quick Start

### Option 1: Use Example Backend (Node.js)

1. **Install Dependencies:**
```bash
npm install express cors jsonwebtoken bcrypt
```

2. **Run Example Backend:**
```bash
node backend-example.js
```

3. **Update Frontend Config:**
In `/config.js`:
```javascript
BACKEND_API_URL: 'http://localhost:3000/api'
```

4. **Open Frontend:**
Open `index.html` in your browser.

### Option 2: Use Your Existing Backend

1. **Review API Specification:**
   - Read `/BACKEND-API-SPEC.md`
   - Implement required endpoints

2. **Update Frontend Config:**
In `/config.js`:
```javascript
BACKEND_API_URL: 'https://your-api.com/api'
```

3. **Test Endpoints:**
   - Use Postman or cURL
   - Verify all endpoints work

## Configuration

### Frontend Configuration

Edit `/config.js`:

```javascript
const CONFIG = {
    // Your backend API URL
    BACKEND_API_URL: 'https://your-backend.com/api',
    
    // API Endpoints (customize if needed)
    API_ENDPOINTS: {
        ROOM_SUGGESTIONS: '/ai/room-suggestions',
        CHAT: '/ai/chat',
        QUESTION: '/ai/question',
        FORECAST: '/ai/forecast',
        BOOKINGS: '/bookings',
        AUTH: '/auth'
    },
    
    // ... rest of config
};
```

### Backend Environment Variables

Create a `.env` file:

```env
# Server
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this

# Frontend
FRONTEND_URL=https://your-frontend.com

# OpenAI (optional, for AI features)
OPENAI_API_KEY=sk-proj-...

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bookings
```

## Required API Endpoints

Your backend must implement these endpoints:

### 1. Health Check
- **GET** `/api/health`
- Returns API status

### 2. Authentication
- **POST** `/api/auth`
- Login and get JWT token

### 3. AI Features (optional)
- **POST** `/api/ai/room-suggestions`
- **POST** `/api/ai/chat`
- **POST** `/api/ai/question`
- **POST** `/api/ai/forecast`

### 4. Bookings
- **POST** `/api/bookings` (create & fetch)

See `/BACKEND-API-SPEC.md` for detailed specifications.

## Testing

### 1. Health Check

```bash
curl http://localhost:3000/api/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2024-12-20T10:00:00Z"
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "login",
    "username": "test",
    "password": "test123"
  }'
```

Expected:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {...}
}
```

### 3. Room Suggestions

```bash
curl -X POST http://localhost:3000/api/ai/room-suggestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "meetingType": "Team Meeting",
    "attendees": 25,
    "purpose": "Planning",
    "rooms": [...]
  }'
```

### 4. Create Booking

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "action": "create",
    "booking": {...}
  }'
```

## Deployment

### Development

1. **Local Backend:**
```bash
node backend-example.js
# Runs on http://localhost:3000
```

2. **Local Frontend:**
```bash
# Just open index.html in browser
# Or use a simple HTTP server:
python -m http.server 8080
```

### Production

#### Backend Deployment Options:

1. **Heroku:**
```bash
heroku create your-app-name
git push heroku main
heroku config:set JWT_SECRET=your-secret
```

2. **AWS EC2:**
```bash
# SSH into EC2 instance
pm2 start backend-example.js
pm2 startup
pm2 save
```

3. **DigitalOcean:**
- Create a Droplet
- Install Node.js
- Deploy your code
- Use nginx as reverse proxy

4. **Vercel/Netlify:**
- Deploy as serverless functions
- Configure environment variables

#### Frontend Deployment:

1. **Static Hosting:**
   - GitHub Pages
   - Netlify
   - Vercel
   - AWS S3 + CloudFront

2. **Update Config:**
```javascript
// In config.js
BACKEND_API_URL: 'https://your-backend.herokuapp.com/api'
```

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong JWT_SECRET
- [ ] Enable CORS properly
- [ ] Validate all inputs
- [ ] Rate limit API endpoints
- [ ] Hash passwords with bcrypt
- [ ] Use environment variables
- [ ] Enable helmet.js security headers
- [ ] Set up logging and monitoring
- [ ] Regular security audits

## Database Setup

### PostgreSQL Example

```sql
-- Create database
CREATE DATABASE bchs_bookings;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    room_id VARCHAR(50) NOT NULL,
    room_name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    organizer_name VARCHAR(255) NOT NULL,
    organizer_email VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    time_mode VARCHAR(20) NOT NULL,
    attendees INT NOT NULL,
    purpose TEXT NOT NULL,
    requirements TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_bookings_room_date ON bookings(room_id, date);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
```

### MongoDB Example

```javascript
// Users collection
{
  _id: ObjectId("..."),
  username: "john.doe",
  email: "john@example.com",
  passwordHash: "$2b$10$...",
  name: "John Doe",
  createdAt: ISODate("2024-12-20T10:00:00Z")
}

// Bookings collection
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  roomId: "library",
  roomName: "Library",
  title: "Team Meeting",
  type: "Team Meeting",
  organizerName: "John Doe",
  organizerEmail: "john@example.com",
  date: ISODate("2024-12-25"),
  timeSlot: "10:00-11:00",
  timeMode: "preset",
  attendees: 15,
  purpose: "Weekly sync",
  requirements: "Whiteboard needed",
  status: "pending",
  createdAt: ISODate("2024-12-20T10:00:00Z"),
  updatedAt: ISODate("2024-12-20T10:00:00Z")
}
```

## AI Integration

### Option 1: OpenAI API

Install OpenAI SDK:
```bash
npm install openai
```

Use in your backend:
```javascript
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function getRoomSuggestions(meetingType, attendees, rooms) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { 
                role: 'system', 
                content: 'You are a room booking assistant.' 
            },
            { 
                role: 'user', 
                content: `Suggest best room for ${meetingType} with ${attendees} people` 
            }
        ]
    });
    
    return response.choices[0].message.content;
}
```

### Option 2: Claude, Gemini, or Other AI

Similar integration with other AI providers.

### Option 3: Rule-Based (No AI)

Use the fallback logic included in `ai-service.js`.

## Monitoring

### Recommended Tools

1. **Logging:**
   - Winston (Node.js)
   - Morgan (HTTP logging)

2. **Error Tracking:**
   - Sentry
   - Rollbar

3. **Performance:**
   - New Relic
   - DataDog

4. **Uptime:**
   - Pingdom
   - UptimeRobot

### Example Logging Setup

```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Use in your endpoints
app.post('/api/bookings', (req, res) => {
    logger.info('Booking request received', {
        userId: req.user.id,
        roomId: req.body.booking.roomId
    });
    
    // ... handle booking
});
```

## Troubleshooting

### Frontend Can't Connect

**Problem:** "Backend API is not responding"

**Solutions:**
1. Check `BACKEND_API_URL` in `/config.js`
2. Verify backend is running
3. Check CORS configuration
4. Inspect browser console for errors

### CORS Errors

**Problem:** "Access-Control-Allow-Origin" error

**Solution:**
```javascript
// In your backend
app.use(cors({
    origin: 'https://your-frontend.com',
    credentials: true
}));
```

### Authentication Fails

**Problem:** "Invalid or expired token"

**Solutions:**
1. Check JWT_SECRET matches
2. Verify token is being sent correctly
3. Check token expiration
4. Clear browser storage and re-login

### Database Connection Errors

**Problem:** Can't connect to database

**Solutions:**
1. Verify DATABASE_URL
2. Check database is running
3. Verify credentials
4. Check firewall rules

## Performance Optimization

### 1. Caching

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

app.get('/api/rooms', (req, res) => {
    const cached = cache.get('rooms');
    if (cached) return res.json(cached);
    
    const rooms = getRoomsFromDB();
    cache.set('rooms', rooms);
    res.json(rooms);
});
```

### 2. Database Indexing

```sql
CREATE INDEX idx_bookings_room_date ON bookings(room_id, date);
CREATE INDEX idx_bookings_user ON bookings(user_id);
```

### 3. Connection Pooling

```javascript
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20
});
```

## Support

**Need help?**
- GitHub Issues: [your-repo/issues]
- Email: dev-support@bchs.edu
- Slack: #bchs-booking-dev

## Next Steps

1. ✅ Set up backend API
2. ✅ Configure database
3. ✅ Update frontend config
4. ✅ Test all endpoints
5. ✅ Deploy to production
6. ✅ Monitor and maintain

---

**Last Updated:** December 2024  
**Backend Version:** 1.0.0
