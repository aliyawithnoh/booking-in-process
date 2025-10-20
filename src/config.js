// Application Configuration
const CONFIG = {
    // Backend API Configuration
    BACKEND_API_URL: 'https://your-backend-api.com/api', // Replace with your actual API URL
    // For local development, use: 'http://localhost:3000/api'
    
    // API Endpoints
    API_ENDPOINTS: {
        ROOM_SUGGESTIONS: '/ai/room-suggestions',
        CHAT: '/ai/chat',
        QUESTION: '/ai/question',
        FORECAST: '/ai/forecast',
        BOOKINGS: '/bookings',
        AUTH: '/auth'
    },
    
    // Local Storage Keys
    STORAGE_KEYS: {
        AUTH_TOKEN: 'bchs-auth-token',
        BOOKINGS: 'bchs-bookings',
        USER_SESSION: 'bchs-user-session'
    },
    
    // Request Configuration
    REQUEST_CONFIG: {
        TIMEOUT: 30000, // 30 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000 // 1 second
    },
    
    // Room Data
    ROOMS: [
        {
            id: 'auditorium',
            name: 'Auditorium',
            capacity: 200,
            hourlyRate: 150,
            amenities: ['Projector', 'Sound System', 'Stage', 'Microphone', 'AC', 'WiFi']
        },
        {
            id: 'library',
            name: 'Library',
            capacity: 50,
            hourlyRate: 75,
            amenities: ['WiFi', 'Whiteboard', 'AC', 'Quiet Zone', 'Study Tables']
        },
        {
            id: 'grounds',
            name: 'Grounds',
            capacity: 300,
            hourlyRate: 200,
            amenities: ['Outdoor', 'Parking', 'Catering Area', 'Open Space', 'Garden']
        }
    ],
    
    // Time Slots
    TIME_SLOTS: [
        { id: '1', time: '07:00-08:00', start: '07:00', end: '08:00' },
        { id: '2', time: '08:00-09:00', start: '08:00', end: '09:00' },
        { id: '3', time: '09:00-10:00', start: '09:00', end: '10:00' },
        { id: '4', time: '10:00-11:00', start: '10:00', end: '11:00' },
        { id: '5', time: '11:00-12:00', start: '11:00', end: '12:00' },
        { id: '6', time: '12:00-01:00', start: '12:00', end: '13:00' },
        { id: '7', time: '01:00-02:00', start: '13:00', end: '14:00' },
        { id: '8', time: '02:00-03:00', start: '14:00', end: '15:00' },
        { id: '9', time: '03:00-04:00', start: '15:00', end: '16:00' },
        { id: '10', time: '04:00-05:00', start: '16:00', end: '17:00' }
    ]
};

// Utility functions for configuration
const ConfigUtils = {
    // Get auth token from local storage
    getAuthToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN) || '';
    },
    
    // Save auth token to local storage
    saveAuthToken(token) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getAuthToken();
    },
    
    // Remove auth token (logout)
    clearAuth() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    },
    
    // Build full API URL
    getApiUrl(endpoint) {
        return `${CONFIG.BACKEND_API_URL}${endpoint}`;
    },
    
    // Get default headers for API requests
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (includeAuth) {
            const token = this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        return headers;
    }
};
