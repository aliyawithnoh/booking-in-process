# Backend API Specification

## Overview

This document specifies the API endpoints that your backend needs to implement for the BCHS Room Booking System.

## Base URL

```
Production: https://your-backend-api.com/api
Development: http://localhost:3000/api
```

Configure in `/config.js`:
```javascript
BACKEND_API_URL: 'https://your-backend-api.com/api'
```

## Authentication

All endpoints (except `/auth` and `/health`) require JWT authentication.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

## Endpoints

### 1. Health Check

**GET** `/health`

Check if API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-20T10:00:00Z"
}
```

---

### 2. Authentication

**POST** `/auth`

User login.

**Request:**
```json
{
  "action": "login",
  "username": "john.doe",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "username": "john.doe",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Response (Failure):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. AI Room Suggestions

**POST** `/ai/room-suggestions`

Get AI-powered room recommendations.

**Request:**
```json
{
  "meetingType": "Team Meeting",
  "attendees": 25,
  "purpose": "Quarterly planning session",
  "rooms": [
    {
      "id": "auditorium",
      "name": "Auditorium",
      "capacity": 200,
      "hourlyRate": 150,
      "amenities": ["Projector", "Sound System", "Stage"]
    },
    {
      "id": "library",
      "name": "Library",
      "capacity": 50,
      "hourlyRate": 75,
      "amenities": ["WiFi", "Whiteboard", "AC"]
    }
  ]
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "roomId": "library",
      "reason": "Perfect for 25 attendees with whiteboard for planning sessions. Optimal capacity utilization at 50%.",
      "score": 95
    },
    {
      "roomId": "auditorium",
      "reason": "Has capacity but may feel too large for 25 people. Good for presentations with projector available.",
      "score": 70
    }
  ]
}
```

**Implementation Notes:**
- Use AI (GPT-3.5/GPT-4) to analyze meeting requirements
- Consider capacity, amenities, meeting type
- Return all rooms ranked by suitability
- Score should be 0-100

---

### 4. AI Chat

**POST** `/ai/chat`

Chat with AI assistant.

**Request:**
```json
{
  "message": "How do I book a room for 50 people?",
  "history": [
    {
      "role": "user",
      "content": "What rooms are available?"
    },
    {
      "role": "assistant",
      "content": "We have Auditorium, Library, and Grounds..."
    }
  ],
  "context": {
    "rooms": [...],
    "timeSlots": [...]
  }
}
```

**Response:**
```json
{
  "reply": "For 50 people, I recommend the Library (capacity 50) or Auditorium (capacity 200). Here's how to book:\n1. Select the room from the sidebar\n2. Choose your date\n3. Click 'Book Room'\n4. Fill in your meeting details"
}
```

**Implementation Notes:**
- Maintain conversation context using `history`
- Use AI to provide helpful, contextual responses
- Include room information from `context`
- Keep responses concise and actionable

---

### 5. AI Question Bot

**POST** `/ai/question`

Answer specific questions.

**Request:**
```json
{
  "question": "What is the cancellation policy?",
  "context": {
    "rooms": [...],
    "timeSlots": [...]
  }
}
```

**Response:**
```json
{
  "answer": "Cancellations must be made 24 hours in advance for a full refund. Late cancellations may incur a fee. Contact support@bchs.edu for assistance."
}
```

**Implementation Notes:**
- No conversation history (single question)
- Fast, focused answers
- Use AI for natural language understanding
- Fallback to predefined answers if needed

---

### 6. AI Forecast

**POST** `/ai/forecast`

Generate booking forecast and analytics.

**Request:**
```json
{
  "roomId": "library",
  "bookings": [
    {
      "date": "2024-12-20",
      "timeSlot": "10:00-11:00",
      "status": "approved"
    },
    {
      "date": "2024-12-21",
      "timeSlot": "14:00-15:00",
      "status": "approved"
    }
  ]
}
```

**Response:**
```json
{
  "upcomingBookings": 5,
  "occupancyRate": 45,
  "peakTime": "2:00 PM - 3:00 PM",
  "trend": "Steady",
  "insights": "Moderate demand expected. Consider promotional offers for morning slots."
}
```

**Implementation Notes:**
- Analyze next 7 days of bookings
- Calculate occupancy percentage
- Identify peak booking times
- Provide trend analysis (High Demand, Steady, Low Demand)
- Optional: AI-generated insights

---

### 7. Create Booking

**POST** `/bookings`

Create a new booking.

**Request:**
```json
{
  "action": "create",
  "booking": {
    "roomId": "library",
    "roomName": "Library",
    "title": "Team Meeting",
    "type": "Team Meeting",
    "organizerName": "John Doe",
    "organizerEmail": "john@example.com",
    "date": "2024-12-25",
    "timeSlot": "10:00-11:00",
    "timeMode": "preset",
    "attendees": 15,
    "purpose": "Weekly team sync",
    "requirements": "Need whiteboard and markers",
    "status": "pending"
  }
}
```

**Response:**
```json
{
  "success": true,
  "bookingId": "booking-1234567890",
  "message": "Booking created successfully",
  "booking": {
    "id": "booking-1234567890",
    "roomId": "library",
    "title": "Team Meeting",
    "status": "pending",
    "createdAt": "2024-12-20T10:00:00Z"
  }
}
```

**Implementation Notes:**
- Validate room availability
- Check for time conflicts
- Store in database
- Send confirmation email (optional)
- Return booking ID for tracking

---

### 8. Fetch Bookings

**POST** `/bookings`

Retrieve bookings.

**Request:**
```json
{
  "action": "fetch",
  "filters": {
    "userId": "user-123",
    "roomId": "library",
    "status": "approved",
    "startDate": "2024-12-01",
    "endDate": "2024-12-31"
  }
}
```

**Response:**
```json
{
  "bookings": [
    {
      "id": "booking-123",
      "roomId": "library",
      "roomName": "Library",
      "title": "Team Meeting",
      "type": "Team Meeting",
      "organizerName": "John Doe",
      "organizerEmail": "john@example.com",
      "date": "2024-12-25",
      "timeSlot": "10:00-11:00",
      "attendees": 15,
      "purpose": "Weekly sync",
      "status": "approved",
      "createdAt": "2024-12-20T10:00:00Z"
    }
  ]
}
```

**Implementation Notes:**
- Filter by user, room, status, date range
- Return sorted by creation date (newest first)
- Include all booking details
- Paginate for large datasets (optional)

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid attendee count",
    "details": {
      "field": "attendees",
      "value": -5
    }
  }
}
```

### Error Codes

- `AUTH_REQUIRED` - Authentication token missing
- `AUTH_INVALID` - Invalid or expired token
- `VALIDATION_ERROR` - Invalid request data
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Booking conflict (time slot taken)
- `RATE_LIMIT` - Too many requests
- `SERVER_ERROR` - Internal server error

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Rate Limiting

Recommended rate limits:
- AI endpoints: 20 requests/minute per user
- Booking endpoints: 50 requests/minute per user
- Auth endpoint: 5 requests/minute per IP

**Rate Limit Headers:**
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1703073600
```

---

## CORS Configuration

Allow requests from your frontend domain:

```javascript
{
  "origin": "https://your-frontend.com",
  "methods": ["GET", "POST", "OPTIONS"],
  "allowedHeaders": ["Content-Type", "Authorization"],
  "credentials": true
}
```

---

## Security Best Practices

### 1. JWT Tokens
- Use strong secret key
- Set expiration (e.g., 24 hours)
- Include user ID and permissions
- Refresh token mechanism (optional)

### 2. Input Validation
- Sanitize all user inputs
- Validate data types and ranges
- Check required fields
- Prevent SQL injection

### 3. API Keys (for AI services)
- Store securely in environment variables
- Never expose in client code
- Rotate regularly
- Use separate keys for dev/prod

### 4. HTTPS Only
- Enforce SSL/TLS
- Use valid certificates
- Redirect HTTP to HTTPS

---

## Testing

### Example cURL Commands

**Login:**
```bash
curl -X POST https://your-api.com/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "login",
    "username": "test@example.com",
    "password": "password123"
  }'
```

**Room Suggestions:**
```bash
curl -X POST https://your-api.com/api/ai/room-suggestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "meetingType": "Team Meeting",
    "attendees": 25,
    "purpose": "Planning session",
    "rooms": [...]
  }'
```

**Create Booking:**
```bash
curl -X POST https://your-api.com/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "action": "create",
    "booking": {...}
  }'
```

---

## Sample Implementation (Node.js/Express)

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(authMiddleware);

// Room Suggestions Endpoint
app.post('/api/ai/room-suggestions', async (req, res) => {
  const { meetingType, attendees, purpose, rooms } = req.body;
  
  try {
    // Call OpenAI or your AI service
    const suggestions = await getAISuggestions(
      meetingType, 
      attendees, 
      purpose, 
      rooms
    );
    
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
});

// Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message, history, context } = req.body;
  
  try {
    const reply = await getAIChatResponse(message, history, context);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});

// Bookings Endpoint
app.post('/api/bookings', async (req, res) => {
  const { action, booking, filters } = req.body;
  
  try {
    if (action === 'create') {
      const result = await createBooking(booking, req.user);
      res.json(result);
    } else if (action === 'fetch') {
      const bookings = await fetchBookings(filters, req.user);
      res.json({ bookings });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});

app.listen(3000);
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(id),
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_room_date (room_id, date),
  INDEX idx_user (user_id),
  INDEX idx_status (status)
);
```

---

## Frontend Configuration

Update `/config.js` with your API URL:

```javascript
const CONFIG = {
    BACKEND_API_URL: 'https://your-backend-api.com/api',
    // ... rest of config
};
```

For local development:
```javascript
BACKEND_API_URL: 'http://localhost:3000/api'
```

---

## Deployment Checklist

- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Enable HTTPS/SSL
- [ ] Set up CORS properly
- [ ] Implement rate limiting
- [ ] Add logging and monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure backup system
- [ ] Test all endpoints
- [ ] Load testing
- [ ] Security audit

---

## Support

For backend API questions:
- Email: dev-support@bchs.edu
- Slack: #bchs-booking-dev

---

**Last Updated:** December 2024  
**API Version:** 1.0.0
