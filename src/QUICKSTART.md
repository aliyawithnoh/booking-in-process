# Quick Start Guide

## Getting Started in 2 Steps

### Step 1: Open the Application
1. Open `index.html` in your web browser
2. The application loads directly - no login required!

### Step 2: Start Booking!
1. Click on a room (Auditorium, Library, or Grounds)
2. Select a date on the calendar
3. Click "+ Book Room" to open the booking form
4. Fill out the booking details and submit

**Tip:** You can also click on booked time slots to view booking details!

## Testing Without AI (No API Key Required)

The system works perfectly without an OpenAI API key:

✅ **What Works:**
- Room booking and management
- Calendar view with availability
- Time slot selection (preset and custom)
- Booking history
- Rule-based room suggestions
- Basic chat responses

⚠️ **What's Limited:**
- AI chat responses (uses pre-defined answers instead)
- Room suggestion explanations (uses logic-based matching)
- Question bot (uses keyword matching)

## Testing With AI (API Key Required)

### Get a Free API Key

1. Go to https://platform.openai.com/
2. Sign up for an account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

### Configure the System

1. Click the **⚙️** button (bottom right corner)
2. Paste your API key
3. Click "Save API Key"
4. Close the settings modal

### Test AI Features

**1. AI Room Suggestions:**
- Open booking modal
- Fill in "Meeting Type" and "Attendees"
- Watch AI analyze and suggest rooms with detailed explanations

**2. AI Chat Assistant:**
- Click **💬** button (bottom right)
- Ask: "What are the best practices for booking a large meeting?"
- Get intelligent, context-aware responses

**3. Question Bot:**
- Scroll to "Quick Help" section in sidebar
- Type a question like "How do I cancel a booking?"
- Receive AI-powered answers

## Example Booking Flow

### Scenario: Team Meeting for 15 People

1. **Login** with any credentials
2. **Browse Rooms:**
   - Auditorium: Too large (200 capacity)
   - Library: Perfect! (50 capacity)
   - Grounds: Too large (300 capacity)

3. **Select Library Room**
4. **Choose Tomorrow's Date**
5. **Click "+ Book Room"**
6. **Fill Form:**
   ```
   Meeting Title: Weekly Team Standup
   Meeting Type: Team Meeting
   Organizer: John Doe
   Email: john@example.com
   Date: [Tomorrow]
   Time: Choose "10:00-11:00" OR set custom time
   Attendees: 15
   Purpose: Weekly team sync and project updates
   ```

7. **Review AI Suggestion:** Library (highlighted as recommended)
8. **Submit Booking**
9. **View in History Tab**

## Testing Features Checklist

- [ ] Open the application
- [ ] Select each room and view calendar
- [ ] View booking density on calendar (color codes)
- [ ] Create a booking with preset time slot
- [ ] Create a booking with custom time
- [ ] View booking in History tab
- [ ] Test chat assistant (with/without AI)
- [ ] Try quick question buttons
- [ ] Check API status (⚙️ button)

## Sample Test Data

### Small Meeting (5-10 people)
- **Best Room:** Library
- **Meeting Types:** Team Meeting, Interview, Brainstorming
- **Expected AI Suggestion:** Library (optimal capacity utilization)

### Medium Meeting (20-50 people)
- **Best Room:** Auditorium or Library
- **Meeting Types:** Presentation, Workshop, Training
- **Expected AI Suggestion:** Depends on amenities needed

### Large Meeting (100+ people)
- **Best Room:** Auditorium or Grounds
- **Meeting Types:** Conference, Board Meeting, Large Presentation
- **Expected AI Suggestion:** Auditorium (indoor) or Grounds (outdoor)

## Common Questions

**Q: Do I need internet access?**
A: Only for AI features. The basic system works offline.

**Q: Is my API key safe?**
A: It's stored in your browser's localStorage. For production, use backend authentication.

**Q: Can I customize the rooms?**
A: Yes! Edit `config.js` to add/modify rooms, time slots, and amenities.

**Q: How do I reset everything?**
A: Clear your browser's localStorage or use browser dev tools.

**Q: Can multiple users share bookings?**
A: No, this is a client-side only demo. Implement a backend for multi-user support.

## Next Steps

1. **Explore the Code:**
   - `app.js` - Main application logic
   - `ai-service.js` - AI integration
   - `config.js` - Configuration options

2. **Customize:**
   - Add your own rooms
   - Change time slots
   - Modify AI prompts
   - Update styling in `styles.css`

3. **Enhance:**
   - Add backend API
   - Implement real authentication
   - Add email notifications
   - Create admin dashboard

## Troubleshooting

**Calendar not loading?**
- Make sure you clicked on a room first

**AI not responding?**
- Check if API key is entered correctly
- Verify you have OpenAI credits
- Check browser console for errors

**Bookings disappearing?**
- localStorage might be disabled
- Try in a different browser
- Don't use incognito/private mode

---

**Ready to book?** Open `index.html` and start exploring! 🚀
