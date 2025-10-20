# Migration Guide: OpenAI Direct → Backend API

## What Changed?

The system has been updated to connect to **your backend API** instead of directly calling OpenAI from the browser.

### Before (Direct OpenAI)
```
Browser → OpenAI API
(API key stored in browser)
```

### After (Backend API)
```
Browser → Your Backend → OpenAI API (optional)
(API key secure on server)
```

## Key Changes

### 1. Configuration (`config.js`)

**Old:**
```javascript
OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
OPENAI_MODEL: 'gpt-3.5-turbo',
STORAGE_KEYS: {
    API_KEY: 'bchs-openai-api-key',
    // ...
}
```

**New:**
```javascript
BACKEND_API_URL: 'https://your-backend-api.com/api',
API_ENDPOINTS: {
    ROOM_SUGGESTIONS: '/ai/room-suggestions',
    CHAT: '/ai/chat',
    QUESTION: '/ai/question',
    // ...
},
STORAGE_KEYS: {
    AUTH_TOKEN: 'bchs-auth-token',  // Changed from API_KEY
    // ...
}
```

### 2. AI Service (`ai-service.js`)

**Old:**
```javascript
async callOpenAI(messages, systemPrompt) {
    const apiKey = ConfigUtils.getApiKey();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
            'Authorization': `Bearer ${apiKey}`
        },
        // ...
    });
}
```

**New:**
```javascript
async callAPI(endpoint, data) {
    const url = ConfigUtils.getApiUrl(endpoint);
    const response = await fetch(url, {
        headers: ConfigUtils.getHeaders(), // Includes JWT token
        body: JSON.stringify(data)
    });
}
```

### 3. Authentication

**Old:**
- No real authentication
- Any username/password accepted
- No backend verification

**New:**
- JWT-based authentication
- Backend validates credentials
- Token stored securely
- Token sent with each request

### 4. UI Changes

**Removed:**
- API key configuration modal
- "Configure OpenAI API" prompts

**Added:**
- API status indicator (⚙️ button)
- Health check on startup
- Connection status messages

## Migration Steps

### Step 1: Update Frontend Config

Edit `/config.js`:

```javascript
const CONFIG = {
    BACKEND_API_URL: 'https://your-api.com/api',  // Update this!
    // ... rest stays the same
};
```

### Step 2: Set Up Backend

Choose one:

**Option A: Use Example Backend**
```bash
npm install express cors jsonwebtoken bcrypt
node backend-example.js
```

**Option B: Implement Your Own**
- Read `/BACKEND-API-SPEC.md`
- Implement required endpoints
- Use any language/framework

### Step 3: Test Connection

1. Open frontend in browser
2. Check browser console for connection status
3. Click ⚙️ button to verify API is connected
4. Try logging in and booking a room

### Step 4: Deploy

1. Deploy backend to production
2. Update `BACKEND_API_URL` to production URL
3. Deploy frontend to static hosting
4. Test end-to-end

## Feature Comparison

### What Works the Same

✅ Room selection and calendar  
✅ Booking creation  
✅ Time slot selection (preset & custom)  
✅ Booking history  
✅ Chat assistant  
✅ Question bot  
✅ Room suggestions  
✅ AI forecast  
✅ Responsive design  

### What Changed

🔄 **Authentication:**
- Now uses JWT tokens
- Backend validates credentials
- More secure

🔄 **Data Storage:**
- Bookings can be stored in database
- Sync across devices
- Multi-user support

🔄 **AI Features:**
- Backend calls OpenAI (secure)
- API key not exposed to users
- Better rate limiting
- Fallback still works

### What's New

✨ **Backend Integration:**
- Real database storage
- User management
- Booking validation
- Conflict detection

✨ **Security:**
- Secure authentication
- API key protection
- Request validation
- Rate limiting

## API Endpoints Required

Your backend must implement:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/auth` | POST | Login/authentication |
| `/ai/room-suggestions` | POST | Get room recommendations |
| `/ai/chat` | POST | Chat with AI |
| `/ai/question` | POST | Answer questions |
| `/ai/forecast` | POST | Generate forecast |
| `/bookings` | POST | Create/fetch bookings |

See `/BACKEND-API-SPEC.md` for detailed specs.

## Breaking Changes

### 1. Local Storage Keys

**Before:**
- `bchs-openai-api-key`

**After:**
- `bchs-auth-token`

**Action:** Users will need to log in again.

### 2. Booking Data Structure

**New Fields:**
- `userId` - ID of user who created booking
- `createdAt` - ISO timestamp
- `updatedAt` - ISO timestamp

**Action:** Existing bookings in localStorage may need migration.

### 3. Error Handling

**New Error Format:**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "Authentication required"
  }
}
```

**Action:** Frontend handles new error format automatically.

## Rollback Plan

If you need to revert to direct OpenAI:

1. **Restore old files from git:**
```bash
git checkout old-branch config.js ai-service.js app.js
```

2. **Or manually update:**
- Change `BACKEND_API_URL` back to `OPENAI_API_URL`
- Restore OpenAI API call logic
- Re-enable API key modal

## Testing Checklist

Before going live:

- [ ] Backend health check responds
- [ ] Login works and returns token
- [ ] Token is saved to localStorage
- [ ] Room suggestions work
- [ ] Chat assistant responds
- [ ] Bookings can be created
- [ ] Bookings appear in history
- [ ] Logout clears token
- [ ] Fallback works when backend is down
- [ ] CORS is configured correctly
- [ ] HTTPS enabled in production

## Common Issues

### 1. CORS Error

**Error:** "Access-Control-Allow-Origin"

**Fix:**
```javascript
// In backend
app.use(cors({
    origin: 'https://your-frontend.com',
    credentials: true
}));
```

### 2. 401 Unauthorized

**Error:** "Authentication required"

**Fix:**
- Verify token is being sent
- Check JWT_SECRET matches
- Re-login to get new token

### 3. Connection Failed

**Error:** "Backend API is not responding"

**Fix:**
- Verify BACKEND_API_URL is correct
- Check backend is running
- Test with curl/Postman

### 4. Features Use Fallback

**Issue:** Always using rule-based logic

**Fix:**
- Check backend endpoints are working
- Verify backend has OpenAI integration
- Check backend logs for errors

## Benefits of This Change

### Security
- ✅ API keys not exposed to users
- ✅ Secure authentication
- ✅ Backend validation
- ✅ Rate limiting

### Functionality
- ✅ Real database storage
- ✅ Multi-user support
- ✅ Sync across devices
- ✅ Better booking management

### Scalability
- ✅ Centralized data
- ✅ Better monitoring
- ✅ Easier updates
- ✅ Professional architecture

## Support

**Questions?**
- Read `/BACKEND-SETUP.md` for setup instructions
- Read `/BACKEND-API-SPEC.md` for API details
- Check `/backend-example.js` for reference implementation

**Need help?**
- Email: dev-support@bchs.edu
- GitHub Issues: [your-repo]
- Documentation: `/README.md`

## Next Steps

1. ✅ Review this migration guide
2. ✅ Set up backend API
3. ✅ Update frontend configuration
4. ✅ Test thoroughly
5. ✅ Deploy to production
6. ✅ Monitor and optimize

---

**Migration Date:** December 2024  
**Version:** 1.0.0 → 2.0.0  
**Status:** ✅ Complete
