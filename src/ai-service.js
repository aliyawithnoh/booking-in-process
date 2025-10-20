// AI Service for handling Backend API calls
const AIService = {
    // Generic API call handler with retry logic
    async callAPI(endpoint, data, retries = CONFIG.REQUEST_CONFIG.RETRY_ATTEMPTS) {
        const url = ConfigUtils.getApiUrl(endpoint);
        
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: ConfigUtils.getHeaders(),
                    body: JSON.stringify(data),
                    signal: AbortSignal.timeout(CONFIG.REQUEST_CONFIG.TIMEOUT)
                });
                
                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    throw new Error(error.message || `API request failed with status ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                if (attempt === retries - 1) {
                    console.error(`API Error (${endpoint}):`, error);
                    throw error;
                }
                
                // Wait before retrying
                await new Promise(resolve => 
                    setTimeout(resolve, CONFIG.REQUEST_CONFIG.RETRY_DELAY * (attempt + 1))
                );
            }
        }
    },
    
    // Get room suggestions based on meeting details
    async getRoomSuggestions(meetingType, attendees, purpose = '') {
        try {
            const response = await this.callAPI(CONFIG.API_ENDPOINTS.ROOM_SUGGESTIONS, {
                meetingType,
                attendees,
                purpose,
                rooms: CONFIG.ROOMS // Send available rooms to backend
            });
            
            // Expected response format:
            // {
            //   suggestions: [
            //     { roomId: "library", reason: "Perfect size...", score: 95 }
            //   ]
            // }
            
            if (response.suggestions && Array.isArray(response.suggestions)) {
                return response.suggestions;
            }
            
            // Fallback if API doesn't return expected format
            return this.getFallbackRoomSuggestions(meetingType, attendees);
        } catch (error) {
            console.error('Room Suggestions API Error:', error);
            // Use fallback on error
            return this.getFallbackRoomSuggestions(meetingType, attendees);
        }
    },
    
    // Fallback room suggestions (rule-based)
    getFallbackRoomSuggestions(meetingType, attendees) {
        const suggestions = CONFIG.ROOMS.map(room => {
            let score = 100;
            let reasons = [];
            
            // Capacity matching
            if (attendees > room.capacity) {
                score -= 50;
                reasons.push(`Room capacity (${room.capacity}) is below required (${attendees})`);
            } else {
                const utilization = (attendees / room.capacity) * 100;
                if (utilization >= 50 && utilization <= 80) {
                    score += 20;
                    reasons.push('Optimal capacity utilization');
                } else if (utilization < 50) {
                    score += 5;
                    reasons.push('Room has extra space available');
                }
            }
            
            // Meeting type matching
            const meetingLower = meetingType.toLowerCase();
            if ((meetingLower.includes('presentation') || meetingLower.includes('conference')) && 
                room.amenities.includes('Projector')) {
                score += 15;
                reasons.push('Equipped with presentation tools');
            }
            
            if (meetingLower.includes('workshop') && room.amenities.includes('Whiteboard')) {
                score += 15;
                reasons.push('Has whiteboard for interactive sessions');
            }
            
            if (meetingLower.includes('outdoor') && room.id === 'grounds') {
                score += 25;
                reasons.push('Perfect for outdoor events');
            }
            
            if ((meetingLower.includes('quiet') || meetingLower.includes('study')) && 
                room.id === 'library') {
                score += 20;
                reasons.push('Quiet environment for focused work');
            }
            
            // Large gathering bonus for auditorium
            if (attendees > 100 && room.id === 'auditorium') {
                score += 15;
                reasons.push('Ideal for large gatherings');
            }
            
            const reason = reasons.length > 0 
                ? reasons.join('. ') + '.'
                : `Standard room for ${attendees} attendees.`;
            
            return {
                roomId: room.id,
                reason: reason,
                score: Math.max(0, Math.min(100, score))
            };
        });
        
        return suggestions.sort((a, b) => b.score - a.score);
    },
    
    // Chat with AI assistant
    async chat(message, conversationHistory = []) {
        try {
            const response = await this.callAPI(CONFIG.API_ENDPOINTS.CHAT, {
                message,
                history: conversationHistory,
                context: {
                    rooms: CONFIG.ROOMS,
                    timeSlots: CONFIG.TIME_SLOTS
                }
            });
            
            // Expected response format:
            // { reply: "AI response text..." }
            
            return response.reply || response.message || this.getFallbackChatResponse(message);
        } catch (error) {
            console.error('Chat API Error:', error);
            return this.getFallbackChatResponse(message);
        }
    },
    
    // Fallback chat responses (rule-based)
    getFallbackChatResponse(message) {
        const lower = message.toLowerCase();
        
        if (lower.includes('book') || lower.includes('reserve')) {
            return 'To book a room:\n1. Select a room from the sidebar\n2. Choose your preferred date\n3. Click "Book Room"\n4. Fill in the appointment details\n\nThe system will suggest the best room based on your needs!';
        }
        
        if (lower.includes('cancel')) {
            return 'To cancel a booking, please contact us at support@bchs.edu or call (555) 123-4567. Cancellations made 24 hours in advance receive a full refund.';
        }
        
        if (lower.includes('rate') || lower.includes('price') || lower.includes('cost')) {
            return 'Our room rates are:\n• Auditorium: $150/hour (200 capacity)\n• Library: $75/hour (50 capacity)\n• Grounds: $200/hour (300 capacity)\n\nContact us for special packages and discounts!';
        }
        
        if (lower.includes('policy')) {
            return 'Key policies:\n• Cancellations must be made 24 hours in advance for a full refund\n• Late cancellations may incur a fee\n• Rooms must be left in the same condition as found\n• No smoking or prohibited activities allowed';
        }
        
        if (lower.includes('hours') || lower.includes('time') || lower.includes('when')) {
            return 'Our facilities are available from 7:00 AM to 5:00 PM, Monday through Friday. Weekend bookings may be available upon request.';
        }
        
        if (lower.includes('amenities') || lower.includes('features')) {
            return 'Room amenities:\n\nAuditorium: Projector, Sound System, Stage, Microphone, AC, WiFi\n\nLibrary: WiFi, Whiteboard, AC, Quiet Zone, Study Tables\n\nGrounds: Outdoor Space, Parking, Catering Area, Open Space, Garden';
        }
        
        return 'Thank you for your message! For immediate assistance:\n• Call: (555) 123-4567\n• Email: support@bchs.edu\n• Hours: Mon-Fri, 9 AM - 5 PM\n\nI can help with booking, pricing, policies, and room information. What would you like to know?';
    },
    
    // Answer specific question using AI
    async answerQuestion(question) {
        try {
            const response = await this.callAPI(CONFIG.API_ENDPOINTS.QUESTION, {
                question,
                context: {
                    rooms: CONFIG.ROOMS,
                    timeSlots: CONFIG.TIME_SLOTS
                }
            });
            
            // Expected response format:
            // { answer: "Answer text..." }
            
            return response.answer || response.reply || this.getFallbackChatResponse(question);
        } catch (error) {
            console.error('Question API Error:', error);
            return this.getFallbackChatResponse(question);
        }
    },
    
    // Generate booking forecast
    async generateForecast(roomId, bookings) {
        try {
            const response = await this.callAPI(CONFIG.API_ENDPOINTS.FORECAST, {
                roomId,
                bookings: bookings.map(b => ({
                    date: b.date,
                    timeSlot: b.timeSlot,
                    status: b.status
                }))
            });
            
            // Expected response format:
            // {
            //   upcomingBookings: 5,
            //   occupancyRate: 45,
            //   peakTime: "2:00 PM - 3:00 PM",
            //   trend: "Steady"
            // }
            
            if (response.upcomingBookings !== undefined) {
                return response;
            }
            
            // Fallback calculation
            return this.calculateForecastFallback(roomId, bookings);
        } catch (error) {
            console.error('Forecast API Error:', error);
            return this.calculateForecastFallback(roomId, bookings);
        }
    },
    
    // Fallback forecast calculation
    calculateForecastFallback(roomId, bookings) {
        const roomBookings = bookings.filter(b => b.roomId === roomId);
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const upcomingBookings = roomBookings.filter(b => {
            const bookingDate = new Date(b.date);
            return bookingDate >= new Date() && bookingDate <= nextWeek;
        });
        
        const totalSlots = 7 * CONFIG.TIME_SLOTS.length;
        const bookedSlots = upcomingBookings.length;
        const occupancyRate = Math.round((bookedSlots / totalSlots) * 100);
        
        // Find peak time
        const timeCount = {};
        upcomingBookings.forEach(b => {
            const time = b.timeSlot.split('-')[0];
            timeCount[time] = (timeCount[time] || 0) + 1;
        });
        
        let peakTime = '2:00 PM - 3:00 PM';
        let maxCount = 0;
        Object.entries(timeCount).forEach(([time, count]) => {
            if (count > maxCount) {
                maxCount = count;
                const [start] = time.split(':');
                const hour = parseInt(start);
                const end = hour + 1;
                peakTime = `${hour}:00 - ${end}:00`;
            }
        });
        
        let trend = 'Steady';
        if (occupancyRate > 70) trend = 'High Demand';
        else if (occupancyRate < 30) trend = 'Low Demand';
        
        return {
            upcomingBookings: bookedSlots,
            occupancyRate: occupancyRate,
            peakTime: peakTime,
            trend: trend
        };
    },
    
    // Submit booking to backend
    async submitBooking(bookingData) {
        try {
            const response = await this.callAPI(CONFIG.API_ENDPOINTS.BOOKINGS, {
                action: 'create',
                booking: bookingData
            });
            
            // Expected response format:
            // {
            //   success: true,
            //   bookingId: "booking-123",
            //   message: "Booking created successfully"
            // }
            
            return response;
        } catch (error) {
            console.error('Submit Booking Error:', error);
            throw error;
        }
    },
    
    // Fetch bookings from backend
    async fetchBookings(filters = {}) {
        try {
            const response = await this.callAPI(CONFIG.API_ENDPOINTS.BOOKINGS, {
                action: 'fetch',
                filters
            });
            
            // Expected response format:
            // {
            //   bookings: [...]
            // }
            
            return response.bookings || [];
        } catch (error) {
            console.error('Fetch Bookings Error:', error);
            // Return empty array on error
            return [];
        }
    },
    
    // Authenticate user
    async login(username, password) {
        try {
            const response = await this.callAPI(CONFIG.API_ENDPOINTS.AUTH, {
                action: 'login',
                username,
                password
            }, false); // Don't include auth header for login
            
            // Expected response format:
            // {
            //   success: true,
            //   token: "jwt-token",
            //   user: { username, email, ... }
            // }
            
            if (response.success && response.token) {
                ConfigUtils.saveAuthToken(response.token);
                return {
                    success: true,
                    user: response.user
                };
            }
            
            return {
                success: false,
                message: response.message || 'Login failed'
            };
        } catch (error) {
            console.error('Login Error:', error);
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        }
    },
    
    // Check API health
    async checkHealth() {
        try {
            const response = await fetch(ConfigUtils.getApiUrl('/health'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            return response.ok;
        } catch (error) {
            console.error('Health Check Error:', error);
            return false;
        }
    }
};
