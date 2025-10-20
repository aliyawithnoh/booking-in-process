# Quick Reference Card

## System Overview

**What:** Room Booking System with AI  
**Tech:** HTML, CSS, JavaScript (vanilla)  
**Backend:** Your API (black box)  
**AI:** Optional (via backend)

## Essential Files

| File | Purpose |
|------|---------|
| `index.html` | Frontend UI |
| `app.js` | Main logic |
| `ai-service.js` | API calls |
| `config.js` | **→ UPDATE THIS** |
| `backend-example.js` | Backend reference |

## Configuration (IMPORTANT!)

### config.js

```javascript
const CONFIG = {
    // 👇 CHANGE THIS TO YOUR BACKEND URL
    BACKEND_API_URL: 'https://your-api.com/api',
    
    // Leave these as-is unless your API uses different paths
    API_ENDPOINTS: {
        ROOM_SUGGESTIONS: '/ai/room-suggestions',
        CHAT: '/ai/chat',
        QUESTION: '/ai/question',
        FORECAST: '/ai/forecast',
        BOOKINGS: '/bookings',
        AUTH: '/auth'
    }
};
```

## Quick Start (3 Steps)

### 1. Backend Setup

**Option A - Use Example:**
```bash
node backend-example.js
# Runs on http://localhost:3000
```

**Option B - Your Backend:**
- Implement endpoints from `BACKEND-API-SPEC.md`
- Use any language/framework

### 2. Configure Frontend

Update `config.js`:
```javascript
BACKEND_API_URL: 'http://localhost:3000/api'
// or your production URL
```

### 3. Run Frontend

```bash
# Open in browser
open index.html

# Or use HTTP server
python -m http.server 8080
```

## API Endpoints (Your Backend Must Have)

```
GET  /api/health                   → Health check
POST /api/auth                     → Login
POST /api/ai/room-suggestions      → Get AI suggestions
POST /api/ai/chat                  → Chat with AI
POST /api/ai/question              → Ask questions
POST /api/ai/forecast              → Get forecast
POST /api/bookings                 → Create/fetch bookings
```

## Request Examples

### Login
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"login","username":"test","password":"test"}'
```

### Room Suggestions
```bash
curl -X POST http://localhost:3000/api/ai/room-suggestions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"meetingType":"Team Meeting","attendees":25}'
```

### Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"create","booking":{...}}'
```

## Expected Response Formats

### Room Suggestions
```json
{
  "suggestions": [
    {
      "roomId": "library",
      "reason": "Perfect for 25 people...",
      "score": 95
    }
  ]
}
```

### Chat
```json
{
  "reply": "To book a room..."
}
```

### Create Booking
```json
{
  "success": true,
  "bookingId": "booking-123",
  "message": "Booking created"
}
```

## Testing Checklist

- [ ] Backend `/health` responds 200 OK
- [ ] Login returns JWT token
- [ ] Room suggestions return data
- [ ] Chat responds
- [ ] Bookings can be created
- [ ] Frontend shows "Connected ✓"

## Troubleshooting

### "Backend API is not responding"

1. Check backend is running
2. Verify `BACKEND_API_URL` in config.js
3. Test with: `curl http://localhost:3000/api/health`

### "CORS Error"

Add to backend:
```javascript
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
```

### "401 Unauthorized"

- Token expired → Re-login
- Token missing → Check Authorization header
- Wrong JWT_SECRET → Match frontend/backend

### Features Use Fallback

- Backend not responding → Check connection
- No AI implementation → Expected, use rules
- Check backend logs

## Environment Variables (Backend)

```env
PORT=3000
JWT_SECRET=change-this-secret-key
OPENAI_API_KEY=sk-... (optional)
DATABASE_URL=postgresql://...
FRONTEND_URL=http://localhost:8080
```

## Deployment URLs

### Development
```javascript
BACKEND_API_URL: 'http://localhost:3000/api'
```

### Production
```javascript
BACKEND_API_URL: 'https://api.yourdomain.com/api'
```

## Key Features

✅ Room booking with calendar  
✅ Custom time selection  
✅ AI room suggestions  
✅ Chat assistant  
✅ Question bot  
✅ Booking history  
✅ JWT authentication  
✅ Responsive design  

## Fallback Mode

**Without Backend:**
- ✅ UI works
- ✅ Calendar works
- ✅ Rule-based suggestions
- ✅ Pre-defined chat responses
- ⚠️ No database storage
- ⚠️ No AI features

**With Backend (No AI):**
- ✅ All fallback features
- ✅ Database storage
- ✅ Multi-user support
- ✅ Authentication
- ⚠️ Basic rule-based logic

**With Backend + AI:**
- ✅ Everything
- ✅ Smart AI suggestions
- ✅ Intelligent chat
- ✅ Natural language understanding

## Important Notes

⚠️ **Security:**
- Use HTTPS in production
- Set strong JWT_SECRET
- Validate all inputs
- Enable rate limiting

⚠️ **Performance:**
- Add database indexes
- Use connection pooling
- Cache frequently accessed data
- Monitor API usage

⚠️ **Data:**
- Backup database regularly
- Validate booking conflicts
- Handle timezone properly
- Archive old bookings

## Getting Help

📖 **Documentation:**
- `/README.md` - Main docs
- `/BACKEND-SETUP.md` - Backend setup
- `/BACKEND-API-SPEC.md` - API specs
- `/MIGRATION-GUIDE.md` - Migration info

💬 **Support:**
- Email: dev-support@bchs.edu
- GitHub: [your-repo/issues]

## Version Info

| Component | Version |
|-----------|---------|
| Frontend | 2.0.0 |
| Backend API | 1.0.0 |
| Node.js | 18+ |
| Database | Any |

## One-Line Commands

```bash
# Test health
curl http://localhost:3000/api/health

# Start backend
node backend-example.js

# Start frontend
python -m http.server 8080

# Check logs
tail -f backend.log
```

---

**Last Updated:** December 2024  
**Keep this card handy!** 📌
