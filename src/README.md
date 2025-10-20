# BCHS Room Booking System

A complete room booking system built with vanilla HTML, CSS, and JavaScript, featuring AI-powered room suggestions and intelligent chat assistance.

## Features

### Core Features
- **User Authentication** - Simple login system
- **Room Selection** - Choose from Auditorium, Library, or Grounds
- **Interactive Calendar** - Visual booking density with color-coding
- **Time Slot Management** - Preset or custom time selection
- **Booking History** - View all your booking requests
- **Responsive Design** - Works on desktop and mobile devices

### AI-Powered Features
- **Smart Room Suggestions** - AI recommends the best room based on meeting type and attendee count
- **Intelligent Chat Assistant** - 24/7 AI support for booking questions
- **Question Bot** - Quick answers to common questions
- **AI Forecast** - Booking trends and occupancy predictions

## Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- An OpenAI API key (optional, for AI features)

### Installation

1. **Download or Clone** the repository
2. **Open `index.html`** in your web browser
3. That's it! No build process or dependencies required.

### Configuring Backend API

The system connects to a backend API for data storage and AI features.

**Quick Setup:**

1. **Start the Example Backend:**
```bash
node backend-example.js
```

2. **Update Configuration:**
In `/config.js`, set:
```javascript
BACKEND_API_URL: 'http://localhost:3000/api'
```

3. **Check Connection:**
- Click the **⚙️** button (bottom right)
- Verify "Backend API: Connected ✓"

**Production Setup:**
- See `/BACKEND-SETUP.md` for deployment instructions
- See `/BACKEND-API-SPEC.md` for API specifications
- Use any backend framework (Node.js, Python, PHP, etc.)

**Note:** The system works without a backend using fallback features, but database storage and advanced AI features will be limited.

## Usage

### Getting Started
- Open `index.html` in your browser
- The application loads directly without login

### Booking a Room

1. **Select a Room** from the left sidebar
2. **Choose a Date** from the calendar
3. Click **"+ Book Room"**
4. Fill in the appointment details:
   - Meeting Title
   - Meeting Type
   - Organizer Information
   - Date & Time (Preset slots or Custom time)
   - Number of Attendees
   - Meeting Purpose
   - Special Requirements

5. **AI Room Suggestions** will appear automatically
6. Select the recommended room or choose another
7. Click **"Submit Booking Request"**

### Time Selection Modes

**Preset Slots:**
- Choose from predefined hourly time slots
- Fastest way to book standard meetings

**Custom Time:**
- Set your own start and end times
- Perfect for flexible scheduling
- Real-time duration calculator
- Warnings for long bookings (4+ hours)

### Using AI Features

**Chat Assistant:**
- Click the **💬** button (bottom right)
- Ask questions about:
  - Booking procedures
  - Room information
  - Pricing and rates
  - Policies and cancellations
  - General inquiries

**Quick Help Bot:**
- Located in the left sidebar
- Click quick question buttons
- Or type your own question
- Instant AI-powered answers

**Room Suggestions:**
- Automatically shown when booking
- Based on meeting type and attendee count
- AI analyzes your requirements
- Provides reasoning for each recommendation

## File Structure

```
├── index.html              # Main HTML file
├── styles.css              # All CSS styling
├── app.js                  # Main application logic
├── config.js               # Configuration and constants
├── ai-service.js           # Backend API integration
├── backend-example.js      # Example backend implementation
├── README.md               # This file
├── BACKEND-SETUP.md        # Backend setup guide
├── BACKEND-API-SPEC.md     # API specification
└── MIGRATION-GUIDE.md      # Migration guide
```

## Configuration

Edit `config.js` to customize:

- **API Settings** - OpenAI model, temperature, max tokens
- **Room Data** - Add/edit rooms, capacities, rates, amenities
- **Time Slots** - Modify available booking times
- **AI Prompts** - Customize AI behavior and responses

## Data Storage

The system uses **localStorage** for:
- OpenAI API key (encrypted)
- Booking records
- User session data

**Important:** localStorage is browser-specific. Bookings won't sync across different browsers or devices. For production use, implement a backend database.

## Backend API

### Architecture

```
Frontend (Browser) → Backend API → Database
                          ↓
                      OpenAI (optional)
```

### Features

1. **Room Suggestions**
   - AI-powered or rule-based recommendations
   - Considers meeting type, capacity, amenities
   - Ranked with detailed explanations

2. **Chat Assistant**
   - Conversational AI support
   - Maintains context
   - Answers booking questions

3. **Question Bot**
   - Quick answers
   - Single-shot responses
   - Fast and efficient

4. **Data Management**
   - Secure database storage
   - Multi-user support
   - Booking validation
   - Conflict detection

### Fallback Mode

When no API key is configured, the system uses **rule-based logic**:
- Capacity matching for room suggestions
- Meeting type to amenities mapping
- Keyword-based chat responses
- Pre-defined answers for common questions

This ensures the system remains functional without AI, though with reduced intelligence.

## Security Notes

- **API Key Storage:** Keys are stored in localStorage (browser local storage)
- **Client-Side Only:** All processing happens in the browser
- **No Server:** This is a demo application with no backend
- **Production Use:** Implement proper authentication, backend API, and secure key management

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Customization

### Adding New Rooms

Edit `config.js`:

```javascript
{
    id: 'new-room-id',
    name: 'New Room Name',
    capacity: 100,
    hourlyRate: 100,
    amenities: ['WiFi', 'Projector', 'AC']
}
```

### Changing Time Slots

Edit `config.js` TIME_SLOTS array:

```javascript
{ id: '11', time: '05:00-06:00', start: '17:00', end: '18:00' }
```

### Modifying AI Behavior

Edit `config.js` AI_CONFIG.SYSTEM_PROMPTS to change how AI responds.

## Troubleshooting

### AI Features Not Working

1. Check if API key is configured (click ⚙️ Settings)
2. Verify API key is valid on OpenAI platform
3. Check browser console for error messages
4. Ensure you have API credits available

### Calendar Not Showing

1. Make sure a room is selected
2. Refresh the page
3. Check browser console for errors

### Bookings Not Saving

1. Check if localStorage is enabled in your browser
2. Clear browser cache and try again
3. Check browser console for errors

## Future Enhancements

Potential features for production version:
- Backend API with database
- Real-time booking updates
- Email notifications
- Payment integration
- Admin dashboard for approval workflow
- Room availability sync
- Multi-language support
- Advanced reporting and analytics

## Support

For issues or questions:
- Email: support@bchs.edu
- Phone: (555) 123-4567
- Hours: Mon-Fri, 9 AM - 5 PM

## License

This is a demonstration project for educational purposes.

## Credits

- Built with vanilla HTML, CSS, and JavaScript
- AI powered by OpenAI GPT-3.5-Turbo
- Icons: Unicode emoji
- No external libraries or frameworks required

---

**Version:** 1.0.0  
**Last Updated:** December 2024
