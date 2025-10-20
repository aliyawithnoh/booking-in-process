# AI API Integration Guide

## Overview

This booking system integrates with **OpenAI's GPT-3.5-Turbo** API to provide intelligent features like room suggestions, chat assistance, and question answering.

## Architecture

```
┌─────────────────┐
│   User Input    │
│ (Meeting Type,  │
│   Attendees)    │
└────────┬────────┘
         │
         v
┌─────────────────┐
│   ai-service.js │
│  (AI Service)   │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  OpenAI API     │
│  GPT-3.5-Turbo  │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  AI Response    │
│  (Suggestions,  │
│   Answers)      │
└─────────────────┘
```

## API Endpoints Used

### 1. Chat Completions
**Endpoint:** `https://api.openai.com/v1/chat/completions`

**Method:** POST

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_API_KEY"
}
```

**Request Body:**
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "System prompt..."
    },
    {
      "role": "user",
      "content": "User message..."
    }
  ],
  "max_tokens": 500,
  "temperature": 0.7
}
```

## AI Features Implementation

### 1. Room Suggestions

**Function:** `AIService.getRoomSuggestions(meetingType, attendees, purpose)`

**How it works:**
1. Constructs a detailed prompt with room information
2. Asks AI to rank rooms and explain reasoning
3. Parses JSON response with room IDs, scores, and reasons
4. Falls back to rule-based logic if AI fails

**Example Prompt:**
```
Based on the following meeting details, suggest the best room:

Meeting Type: Team Meeting
Number of Attendees: 25
Purpose: Quarterly planning session

Available Rooms:
Auditorium: Capacity 200, $150/hour, Amenities: Projector, Sound System, Stage...
Library: Capacity 50, $75/hour, Amenities: WiFi, Whiteboard, AC...
Grounds: Capacity 300, $200/hour, Amenities: Outdoor, Parking...

Provide ranked list with explanations.
```

**Expected Response Format:**
```json
{
  "suggestions": [
    {
      "roomId": "library",
      "reason": "Perfect for 25 attendees with whiteboard for planning...",
      "score": 95
    },
    {
      "roomId": "auditorium",
      "reason": "Has capacity but may feel too large...",
      "score": 70
    }
  ]
}
```

### 2. Chat Assistant

**Function:** `AIService.chat(message, conversationHistory)`

**How it works:**
1. Maintains conversation history for context
2. Includes system prompt defining assistant behavior
3. Streams responses back to user
4. Stores history for follow-up questions

**System Prompt:**
```
You are a helpful booking assistant for BCHS Room Booking System.
Help users with:
- Booking procedures
- Room information (Auditorium: 200 capacity, $150/hr; ...)
- Policies and cancellations
- General questions
Be friendly, concise, and helpful.
```

**Example Conversation:**
```
User: "How do I book a room for 50 people?"
AI: "For 50 people, I recommend the Library (capacity 50) or Auditorium (capacity 200). 
     Here's how to book:
     1. Select the room from the sidebar
     2. Choose your date
     3. Click '+ Book Room'
     4. Fill in your meeting details
     The AI will suggest the best room based on your needs!"
```

### 3. Question Bot

**Function:** `AIService.answerQuestion(question)`

**How it works:**
1. Single-shot question answering (no history)
2. Focused on booking system information
3. Fast responses with concise answers
4. Falls back to keyword matching

**Example:**
```
Question: "What's the cancellation policy?"
Answer: "Cancellations must be made 24 hours in advance for a full refund. 
         Late cancellations may incur a fee. Contact support@bchs.edu for assistance."
```

## Configuration

### API Settings (config.js)

```javascript
const CONFIG = {
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    OPENAI_MODEL: 'gpt-3.5-turbo',
    
    AI_CONFIG: {
        MAX_TOKENS: 500,        // Maximum response length
        TEMPERATURE: 0.7,       // Creativity (0-1)
        SYSTEM_PROMPTS: {
            ROOM_SUGGESTION: "...",
            CHAT_ASSISTANT: "...",
            QUESTION_BOT: "..."
        }
    }
}
```

### Adjusting AI Behavior

**Temperature:**
- `0.0` - Deterministic, focused answers
- `0.5` - Balanced creativity and consistency
- `1.0` - Creative, varied responses

**Max Tokens:**
- `100` - Very concise
- `500` - Moderate detail (recommended)
- `1000` - Detailed explanations

**System Prompts:**
- Define AI personality and knowledge
- Set response format and style
- Provide context about rooms and policies

## Error Handling

### API Errors

```javascript
try {
    const response = await AIService.chat(message);
} catch (error) {
    if (error.message.includes('API key')) {
        // Show API key setup instructions
    } else if (error.message.includes('rate limit')) {
        // Show rate limit message
    } else {
        // Show generic error with fallback
    }
}
```

### Common Errors

1. **Invalid API Key**
   - Error: "Incorrect API key provided"
   - Solution: Verify key in Settings

2. **Rate Limit**
   - Error: "Rate limit exceeded"
   - Solution: Wait or upgrade OpenAI plan

3. **Insufficient Credits**
   - Error: "You exceeded your current quota"
   - Solution: Add billing to OpenAI account

4. **Network Error**
   - Error: "Failed to fetch"
   - Solution: Check internet connection

## Fallback System

When AI is unavailable, the system uses rule-based logic:

### Room Suggestion Fallback

```javascript
// Capacity matching
if (attendees > room.capacity) {
    score -= 50; // Room too small
} else if (utilization >= 50% && utilization <= 80%) {
    score += 20; // Optimal capacity
}

// Amenity matching
if (meetingType.includes('presentation') && 
    room.amenities.includes('Projector')) {
    score += 15; // Has required amenity
}
```

### Chat Fallback

```javascript
// Keyword matching
if (message.includes('book') || message.includes('reserve')) {
    return "To book a room, select a room from the sidebar...";
}
if (message.includes('price') || message.includes('rate')) {
    return "Room rates: Auditorium $150/hr, Library $75/hr...";
}
```

## API Costs

### Estimated Costs (GPT-3.5-Turbo)

**Pricing:** $0.50 per 1M input tokens, $1.50 per 1M output tokens

**Typical Usage:**
- Room Suggestion: ~300 input + 200 output tokens = $0.00045
- Chat Message: ~150 input + 150 output tokens = $0.00030
- Question Answer: ~100 input + 100 output tokens = $0.00020

**Monthly Estimates:**
- 100 bookings/month: ~$0.05
- 500 chat messages/month: ~$0.15
- 200 questions/month: ~$0.04
- **Total: ~$0.24/month**

*Note: Actual costs vary based on usage and response length*

## Security Best Practices

### 1. API Key Storage

**Current Implementation:**
```javascript
// Stored in browser localStorage
localStorage.setItem('bchs-openai-api-key', apiKey);
```

**Production Recommendations:**
```javascript
// Store on backend server
// Use environment variables
// Never expose in client-side code
```

### 2. Rate Limiting

Implement client-side rate limiting:
```javascript
const rateLimiter = {
    requests: [],
    maxRequests: 10,
    timeWindow: 60000, // 1 minute
    
    canMakeRequest() {
        const now = Date.now();
        this.requests = this.requests.filter(t => t > now - this.timeWindow);
        return this.requests.length < this.maxRequests;
    },
    
    recordRequest() {
        this.requests.push(Date.now());
    }
};
```

### 3. Input Validation

```javascript
// Sanitize user input
function sanitizeInput(text) {
    return text
        .trim()
        .slice(0, 500) // Limit length
        .replace(/[<>]/g, ''); // Remove HTML tags
}
```

## Advanced Features

### 1. Streaming Responses

```javascript
async function streamChat(message) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {...},
        body: JSON.stringify({
            ...body,
            stream: true
        })
    });
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
        const {value, done} = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        // Process and display chunk
    }
}
```

### 2. Context Awareness

```javascript
// Include booking history in context
const context = `
Recent bookings:
- Auditorium: Team Meeting, 50 people, ${lastWeek}
- Library: Study Session, 10 people, ${yesterday}

Current request: ${meetingType}, ${attendees} people
`;
```

### 3. Multi-language Support

```javascript
// Detect user language
const userLanguage = navigator.language;

// Add to system prompt
const systemPrompt = `
Respond in ${userLanguage}.
${basePrompt}
`;
```

## Testing

### Mock API for Development

```javascript
// Create mock responses for testing
const MockAI = {
    async getRoomSuggestions(type, attendees) {
        await sleep(500); // Simulate delay
        return [
            {
                roomId: 'library',
                reason: 'Mock suggestion: Perfect size',
                score: 95
            }
        ];
    }
};

// Use mock in development
const AIService = USE_MOCK ? MockAI : RealAIService;
```

### Unit Tests

```javascript
// Test fallback logic
test('Room suggestion fallback', () => {
    const suggestions = AIService.getFallbackRoomSuggestions(
        'Team Meeting',
        25
    );
    
    expect(suggestions[0].roomId).toBe('library');
    expect(suggestions[0].score).toBeGreaterThan(80);
});
```

## Monitoring

### Track API Usage

```javascript
const apiMetrics = {
    requests: 0,
    errors: 0,
    totalTokens: 0,
    
    log(type, tokens, error) {
        this.requests++;
        if (error) this.errors++;
        if (tokens) this.totalTokens += tokens;
        
        // Send to analytics
        console.log('API Metrics:', this);
    }
};
```

### Log Important Events

```javascript
// Log AI interactions
console.log('AI Request:', {
    type: 'room_suggestion',
    meetingType,
    attendees,
    timestamp: new Date()
});
```

## Future Enhancements

1. **Function Calling** - Let AI trigger bookings directly
2. **Fine-tuning** - Custom model trained on booking data
3. **Voice Interface** - Speech-to-text for bookings
4. **Image Recognition** - Upload floor plans for suggestions
5. **Predictive Booking** - AI suggests before you ask

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GPT-3.5-Turbo Guide](https://platform.openai.com/docs/models/gpt-3-5)
- [Best Practices](https://platform.openai.com/docs/guides/best-practices)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)

## Support

For API integration questions:
- OpenAI Discord: https://discord.gg/openai
- Developer Forum: https://community.openai.com
- Email: support@openai.com

---

**Last Updated:** December 2024  
**API Version:** OpenAI v1  
**Model:** GPT-3.5-Turbo
