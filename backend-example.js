/**
 * EXAMPLE BACKEND IMPLEMENTATION
 * Node.js/Express Backend for BCHS Room Booking System
 * 
 * This is a sample implementation showing how to create the backend API.
 * Adapt this to your preferred framework and language.
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true
}));
app.use(express.json());

// In-memory storage (replace with database in production)
const users = [];
const bookings = [];

// Auth Middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'AUTH_REQUIRED',
                message: 'Authentication required'
            }
        });
    }
    
    const token = authHeader.substring(7);
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'AUTH_INVALID',
                message: 'Invalid or expired token'
            }
        });
    }
};

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Authentication
app.post('/api/auth', async (req, res) => {
    const { action, username, password } = req.body;
    
    if (action === 'login') {
        // Demo: Accept any username/password
        // In production: Verify against database
        
        const user = {
            id: 'user-' + Date.now(),
            username: username,
            email: `${username}@example.com`,
            name: username
        };
        
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            token: token,
            user: user
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Invalid action'
        });
    }
});

// AI Room Suggestions
app.post('/api/ai/room-suggestions', authMiddleware, async (req, res) => {
    const { meetingType, attendees, purpose, rooms } = req.body;
    
    try {
        // Option 1: Call OpenAI API
        // const suggestions = await callOpenAI(meetingType, attendees, purpose, rooms);
        
        // Option 2: Use rule-based logic (fallback)
        const suggestions = rooms.map(room => {
            let score = 100;
            const reasons = [];
            
            // Capacity matching
            const utilization = (attendees / room.capacity) * 100;
            if (attendees > room.capacity) {
                score -= 50;
                reasons.push(`Capacity exceeded`);
            } else if (utilization >= 50 && utilization <= 80) {
                score += 20;
                reasons.push('Optimal capacity');
            } else if (utilization < 50) {
                score += 5;
                reasons.push('Extra space available');
            }
            
            // Meeting type matching
            const type = meetingType.toLowerCase();
            if ((type.includes('presentation') || type.includes('conference')) &&
                room.amenities.includes('Projector')) {
                score += 15;
                reasons.push('Has presentation equipment');
            }
            
            if (type.includes('workshop') && room.amenities.includes('Whiteboard')) {
                score += 15;
                reasons.push('Equipped for workshops');
            }
            
            return {
                roomId: room.id,
                reason: reasons.join('. ') + '.',
                score: Math.max(0, Math.min(100, score))
            };
        }).sort((a, b) => b.score - a.score);
        
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

// AI Chat
app.post('/api/ai/chat', authMiddleware, async (req, res) => {
    const { message, history, context } = req.body;
    
    try {
        // Option 1: Call OpenAI API
        // const reply = await callOpenAIChatAPI(message, history, context);
        
        // Option 2: Rule-based responses (fallback)
        const lower = message.toLowerCase();
        let reply;
        
        if (lower.includes('book') || lower.includes('reserve')) {
            reply = 'To book a room:\n1. Select a room\n2. Choose date and time\n3. Fill in details\n4. Submit booking';
        } else if (lower.includes('price') || lower.includes('rate')) {
            reply = 'Room rates:\n• Auditorium: $150/hr\n• Library: $75/hr\n• Grounds: $200/hr';
        } else if (lower.includes('cancel')) {
            reply = 'Contact support@bchs.edu for cancellations. 24-hour notice required.';
        } else {
            reply = 'I can help with booking, pricing, and policies. What would you like to know?';
        }
        
        res.json({ reply });
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

// AI Question
app.post('/api/ai/question', authMiddleware, async (req, res) => {
    const { question, context } = req.body;
    
    try {
        // Similar to chat but single question/answer
        const lower = question.toLowerCase();
        let answer;
        
        if (lower.includes('policy')) {
            answer = 'Cancellations must be made 24 hours in advance for full refund.';
        } else if (lower.includes('hours')) {
            answer = 'Facilities available 7 AM - 5 PM, Monday-Friday.';
        } else {
            answer = 'For more information, contact support@bchs.edu';
        }
        
        res.json({ answer });
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

// AI Forecast
app.post('/api/ai/forecast', authMiddleware, async (req, res) => {
    const { roomId, bookings } = req.body;
    
    try {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const upcoming = bookings.filter(b => {
            const date = new Date(b.date);
            return date >= new Date() && date <= nextWeek;
        });
        
        const occupancyRate = Math.round((upcoming.length / 70) * 100); // 7 days * 10 slots
        
        // Find peak time
        const timeCount = {};
        upcoming.forEach(b => {
            const time = b.timeSlot.split('-')[0];
            timeCount[time] = (timeCount[time] || 0) + 1;
        });
        
        let peakTime = '2:00 PM - 3:00 PM';
        let maxCount = 0;
        for (const [time, count] of Object.entries(timeCount)) {
            if (count > maxCount) {
                maxCount = count;
                peakTime = time;
            }
        }
        
        const trend = occupancyRate > 70 ? 'High Demand' : 
                      occupancyRate < 30 ? 'Low Demand' : 'Steady';
        
        res.json({
            upcomingBookings: upcoming.length,
            occupancyRate,
            peakTime,
            trend
        });
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

// Create Booking
app.post('/api/bookings', authMiddleware, async (req, res) => {
    const { action, booking, filters } = req.body;
    
    try {
        if (action === 'create') {
            // Validate booking
            if (!booking.roomId || !booking.date || !booking.timeSlot) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Missing required fields'
                    }
                });
            }
            
            // Check for conflicts
            const conflict = bookings.find(b =>
                b.roomId === booking.roomId &&
                b.date === booking.date &&
                b.timeSlot === booking.timeSlot &&
                b.status === 'approved'
            );
            
            if (conflict) {
                return res.status(409).json({
                    success: false,
                    error: {
                        code: 'CONFLICT',
                        message: 'Time slot already booked'
                    }
                });
            }
            
            // Create booking
            const newBooking = {
                ...booking,
                id: 'booking-' + Date.now(),
                userId: req.user.id,
                createdAt: new Date().toISOString()
            };
            
            bookings.push(newBooking);
            
            res.json({
                success: true,
                bookingId: newBooking.id,
                message: 'Booking created successfully',
                booking: newBooking
            });
            
        } else if (action === 'fetch') {
            // Fetch bookings
            let filtered = bookings.filter(b => b.userId === req.user.id);
            
            if (filters) {
                if (filters.roomId) {
                    filtered = filtered.filter(b => b.roomId === filters.roomId);
                }
                if (filters.status) {
                    filtered = filtered.filter(b => b.status === filters.status);
                }
                if (filters.startDate && filters.endDate) {
                    filtered = filtered.filter(b =>
                        b.date >= filters.startDate && b.date <= filters.endDate
                    );
                }
            }
            
            res.json({ bookings: filtered });
        } else {
            res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid action'
                }
            });
        }
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

// Error Handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        error: {
            code: 'SERVER_ERROR',
            message: 'Internal server error'
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

/**
 * OPENAI INTEGRATION EXAMPLE
 * 
 * If you want to use actual AI, integrate OpenAI like this:
 */

/*
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function callOpenAI(meetingType, attendees, purpose, rooms) {
    const roomsInfo = rooms.map(r => 
        `${r.name}: ${r.capacity} capacity, $${r.hourlyRate}/hr, ${r.amenities.join(', ')}`
    ).join('\n');
    
    const prompt = `Suggest the best room for:
Meeting Type: ${meetingType}
Attendees: ${attendees}
Purpose: ${purpose}

Available Rooms:
${roomsInfo}

Return JSON with suggestions array.`;
    
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful room booking assistant.' },
            { role: 'user', content: prompt }
        ],
        temperature: 0.7
    });
    
    const content = response.choices[0].message.content;
    const json = JSON.parse(content);
    return json.suggestions;
}
*/

/**
 * DEPLOYMENT NOTES
 * 
 * 1. Install dependencies:
 *    npm install express cors jsonwebtoken bcrypt
 * 
 * 2. Set environment variables:
 *    JWT_SECRET=your-secret-key
 *    OPENAI_API_KEY=sk-...  (optional)
 *    FRONTEND_URL=https://your-frontend.com
 * 
 * 3. Run:
 *    node backend-example.js
 * 
 * 4. Update frontend config.js:
 *    BACKEND_API_URL: 'http://localhost:3000/api'
 */
