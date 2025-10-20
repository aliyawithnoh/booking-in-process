// Data Storage
const appData = {
    currentView: 'home',
    selectedRoom: null,
    selectedDate: new Date(),
    bookings: [],
    chatHistory: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load bookings from localStorage
    loadBookings();
    
    // Setup event listeners
    setupNavigation();
    setupRoomSelection();
    setupBookingModal();
    setupChatBox();
    setupQuickQuestions();
    setupAPIConfig();
    
    // Render initial state
    renderRooms();
    
    // Check API health
    checkAPIHealth();
}

// Navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn[data-view]');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            switchView(view);
        });
    });
}

function switchView(view) {
    appData.currentView = view;
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn[data-view]').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-view') === view) {
            btn.classList.add('active');
        }
    });
    
    // Update views
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
    });
    document.getElementById(`${view}View`).classList.add('active');
    
    // Render view content
    if (view === 'history') {
        renderBookingHistory();
    }
}

// Room Selection
function setupRoomSelection() {
    // Event delegation for room cards
    document.getElementById('roomsList').addEventListener('click', function(e) {
        const roomCard = e.target.closest('.room-card');
        if (roomCard) {
            const roomId = roomCard.getAttribute('data-room-id');
            selectRoom(roomId);
        }
    });
}

function renderRooms() {
    const roomsList = document.getElementById('roomsList');
    roomsList.innerHTML = CONFIG.ROOMS.map(room => `
        <div class="room-card ${appData.selectedRoom?.id === room.id ? 'selected' : ''}" 
             data-room-id="${room.id}">
            <h3>${room.name}</h3>
            <p>Capacity: ${room.capacity} people</p>
            <p>$${room.hourlyRate}/hour</p>
            <div class="room-amenities">
                ${room.amenities.slice(0, 3).map(a => `<span class="amenity-badge">${a}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function selectRoom(roomId) {
    appData.selectedRoom = CONFIG.ROOMS.find(r => r.id === roomId);
    renderRooms();
    renderCalendar();
}

// Calendar
async function renderCalendar() {
    const container = document.getElementById('calendarContainer');
    
    if (!appData.selectedRoom) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Select a room to view availability</h3>
                <p>Choose from one of the rooms on the left to see the calendar and booking options</p>
            </div>
        `;
        return;
    }
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    container.innerHTML = `
        <div class="calendar-grid">
            <div class="calendar-header">
                <h2 class="calendar-title">Calendar - ${appData.selectedRoom.name}</h2>
                <button class="btn btn-primary" onclick="openBookingModal()">
                    <span>+ Book Room</span>
                </button>
            </div>
            
            <div class="calendar-month">
                <div class="calendar-day-header">Sun</div>
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
                ${generateCalendarDays(currentYear, currentMonth)}
            </div>
            
            <div class="time-slots-section">
                <div class="time-slots-header">
                    <h3>Available Time Slots - ${formatDate(appData.selectedDate)}</h3>
                </div>
                <div class="time-slots-list" id="timeSlotsList">
                    ${renderTimeSlots()}
                </div>
            </div>
            
            <div id="aiForecastSection">${await renderAIForecast()}</div>
        </div>
    `;
}

function generateCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    let html = '';
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day" style="visibility: hidden;"></div>';
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        const isSelected = date.toDateString() === appData.selectedDate.toDateString();
        const density = getBookingDensity(date);
        
        const classes = ['calendar-day'];
        if (isToday) classes.push('today');
        if (isSelected) classes.push('selected');
        if (density) classes.push(`${density}-density`);
        
        html += `
            <div class="${classes.join(' ')}" onclick="selectDate('${date.toISOString()}')">
                ${day}
            </div>
        `;
    }
    
    return html;
}

function selectDate(dateString) {
    appData.selectedDate = new Date(dateString);
    renderCalendar();
}

function getBookingDensity(date) {
    if (!appData.selectedRoom) return null;
    
    const dayBookings = appData.bookings.filter(b => 
        b.roomId === appData.selectedRoom.id &&
        new Date(b.date).toDateString() === date.toDateString() &&
        b.status === 'approved'
    );
    
    const density = dayBookings.length / CONFIG.TIME_SLOTS.length;
    
    if (density >= 0.8) return 'high';
    if (density >= 0.4) return 'medium';
    if (density > 0) return 'low';
    return null;
}

function renderTimeSlots() {
    const selectedDateStr = appData.selectedDate.toDateString();
    const roomBookings = appData.bookings.filter(b => 
        b.roomId === appData.selectedRoom.id &&
        new Date(b.date).toDateString() === selectedDateStr &&
        b.status === 'approved'
    );
    
    return CONFIG.TIME_SLOTS.map(slot => {
        const booking = roomBookings.find(b => b.timeSlot === slot.time);
        const isAvailable = !booking;
        
        return `
            <div class="time-slot ${isAvailable ? 'available' : 'booked'}" 
                 ${!isAvailable ? `onclick="showBookingDetailsModal('${booking.id}')"` : ''}>
                <div class="time-slot-info">
                    <div class="time-slot-indicator"></div>
                    <span>${slot.start} - ${slot.end}</span>
                </div>
                <span class="time-slot-status">${isAvailable ? 'Available' : 'Booked'}</span>
            </div>
        `;
    }).join('');
}

// Show booking details when clicking on a booked slot
function showBookingDetailsModal(bookingId) {
    const booking = appData.bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Show modal with booking details
    openBookingModal();
    
    // Pre-fill the form with booking details
    document.getElementById('meetingTitle').value = booking.title || '';
    document.getElementById('meetingType').value = booking.type || '';
    document.getElementById('organizerName').value = booking.organizerName || '';
    document.getElementById('organizerEmail').value = booking.organizerEmail || '';
    document.getElementById('bookingDate').value = booking.date || '';
    document.getElementById('attendees').value = booking.attendees || '';
    document.getElementById('purpose').value = booking.purpose || '';
    document.getElementById('requirements').value = booking.requirements || '';
    
    // Set time slot
    if (booking.timeMode === 'preset') {
        document.getElementById('presetModeBtn').click();
        document.getElementById('timeSlot').value = booking.timeSlot || '';
    } else {
        document.getElementById('customModeBtn').click();
        const [start, end] = (booking.timeSlot || '').split('-');
        document.getElementById('startTime').value = start || '';
        document.getElementById('endTime').value = end || '';
    }
    
    // Make form read-only to show it's already booked
    const formElements = document.querySelectorAll('#bookingForm input, #bookingForm select, #bookingForm textarea');
    formElements.forEach(el => el.setAttribute('readonly', true));
    document.getElementById('submitBookingBtn').textContent = 'Time Slot Already Booked';
    document.getElementById('submitBookingBtn').disabled = true;
    
    // Show notification
    showNotification('This time slot is already booked. Showing booking details.', 'info');
}

async function renderAIForecast() {
    if (!appData.selectedRoom) return '';
    
    const forecast = await AIService.generateForecast(appData.selectedRoom.id, appData.bookings);
    
    return `
        <div class="ai-forecast">
            <div class="forecast-header">
                <span>🤖</span>
                <h3>AI Forecast</h3>
            </div>
            <div class="forecast-content">
                <div class="forecast-item">
                    <span>Next 7 Days Bookings</span>
                    <strong>${forecast.upcomingBookings}</strong>
                </div>
                <div class="forecast-item">
                    <span>Average Occupancy</span>
                    <strong>${forecast.occupancyRate}%</strong>
                </div>
                <div class="forecast-item">
                    <span>Peak Time</span>
                    <strong>${forecast.peakTime}</strong>
                </div>
                <div class="forecast-item">
                    <span>Trend</span>
                    <strong>${forecast.trend}</strong>
                </div>
            </div>
        </div>
    `;
}

// Booking Modal
function setupBookingModal() {
    const modal = document.getElementById('bookingModal');
    const form = document.getElementById('bookingForm');
    
    document.getElementById('closeModalBtn').addEventListener('click', closeBookingModal);
    document.getElementById('cancelBookingBtn').addEventListener('click', closeBookingModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeBookingModal();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitBooking();
    });
    
    // Update room suggestions on input change
    document.getElementById('meetingType').addEventListener('change', updateRoomSuggestions);
    document.getElementById('attendees').addEventListener('input', updateRoomSuggestions);
    document.getElementById('purpose').addEventListener('input', debounce(updateRoomSuggestions, 500));
    
    // Setup time mode toggle
    setupTimeModeSwitcher();
}

function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('active');
    
    // Set default date
    const dateInput = document.getElementById('bookingDate');
    dateInput.value = formatDateForInput(appData.selectedDate);
    dateInput.min = formatDateForInput(new Date());
    
    // Show room suggestions
    updateRoomSuggestions();
    
    if (appData.selectedRoom) {
        showSelectedRoom(appData.selectedRoom);
    }
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('active');
    document.getElementById('bookingForm').reset();
    document.getElementById('selectedRoomDisplay').classList.add('hidden');
    document.getElementById('roomSuggestions').innerHTML = '<p class="suggestion-prompt">Fill in the meeting type and attendee count to get AI-powered room recommendations.</p>';
    
    // Reset form elements to editable state
    const formElements = document.querySelectorAll('#bookingForm input, #bookingForm select, #bookingForm textarea');
    formElements.forEach(el => el.removeAttribute('readonly'));
    const submitBtn = document.getElementById('submitBookingBtn');
    if (submitBtn) {
        submitBtn.textContent = 'Submit Booking Request';
        submitBtn.disabled = false;
    }
}

async function updateRoomSuggestions() {
    const meetingType = document.getElementById('meetingType').value;
    const attendees = parseInt(document.getElementById('attendees').value) || 0;
    const purpose = document.getElementById('purpose').value;
    
    if (!meetingType || attendees === 0) {
        document.getElementById('roomSuggestions').innerHTML = 
            '<p class="suggestion-prompt">Fill in the meeting type and attendee count to get AI-powered room recommendations.</p>';
        return;
    }
    
    // Show loading
    document.getElementById('aiSuggestionsLoading').classList.remove('hidden');
    document.getElementById('roomSuggestions').innerHTML = '';
    
    try {
        const suggestions = await AIService.getRoomSuggestions(meetingType, attendees, purpose);
        
        // Hide loading
        document.getElementById('aiSuggestionsLoading').classList.add('hidden');
        
        const suggestionsContainer = document.getElementById('roomSuggestions');
        
        if (suggestions.length === 0) {
            suggestionsContainer.innerHTML = '<p style="color: #6b7280;">No suitable rooms found for your requirements.</p>';
            return;
        }
        
        suggestionsContainer.innerHTML = suggestions.map((s, index) => {
            const room = CONFIG.ROOMS.find(r => r.id === s.roomId);
            if (!room) return '';
            
            return `
                <div class="suggestion-card ${appData.selectedRoom?.id === room.id ? 'selected' : ''}" 
                     onclick="selectRoomForBooking('${room.id}')">
                    ${index === 0 ? '<div class="suggestion-badge recommended">✨ Recommended</div>' : ''}
                    <h4>${room.name}</h4>
                    <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">
                        Capacity: ${room.capacity} • $${room.hourlyRate}/hour
                    </p>
                    <p class="suggestion-reason">${s.reason}</p>
                    <div class="room-amenities" style="margin-top: 0.5rem;">
                        ${room.amenities.slice(0, 3).map(a => `<span class="amenity-badge">${a}</span>`).join('')}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        document.getElementById('aiSuggestionsLoading').classList.add('hidden');
        document.getElementById('roomSuggestions').innerHTML = 
            `<p class="error-message">⚠️ ${error.message}</p>`;
    }
}

function selectRoomForBooking(roomId) {
    appData.selectedRoom = CONFIG.ROOMS.find(r => r.id === roomId);
    showSelectedRoom(appData.selectedRoom);
    updateRoomSuggestions();
}

function showSelectedRoom(room) {
    const display = document.getElementById('selectedRoomDisplay');
    display.classList.remove('hidden');
    document.getElementById('selectedRoomName').textContent = room.name;
    document.getElementById('selectedRoomDetails').textContent = 
        `Capacity: ${room.capacity} people • ${room.amenities.join(', ')}`;
}

async function submitBooking() {
    // Get time slot based on current mode
    let timeSlot;
    const timeMode = document.querySelector('.time-mode-btn.active').getAttribute('data-mode');
    
    if (timeMode === 'preset') {
        timeSlot = document.getElementById('timeSlot').value;
        if (!timeSlot) {
            showNotification('Please select a time slot', 'error');
            return;
        }
    } else {
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        
        if (!startTime || !endTime) {
            showNotification('Please enter both start and end times', 'error');
            return;
        }
        
        // Validate time range
        if (startTime >= endTime) {
            showNotification('End time must be after start time', 'error');
            return;
        }
        
        timeSlot = `${startTime}-${endTime}`;
    }
    
    if (!appData.selectedRoom) {
        showNotification('Please select a room', 'error');
        return;
    }
    
    const formData = {
        id: 'booking-' + Date.now(),
        roomId: appData.selectedRoom.id,
        roomName: appData.selectedRoom.name,
        title: document.getElementById('meetingTitle').value,
        type: document.getElementById('meetingType').value,
        organizerName: document.getElementById('organizerName').value,
        organizerEmail: document.getElementById('organizerEmail').value,
        date: document.getElementById('bookingDate').value,
        timeSlot: timeSlot,
        timeMode: timeMode,
        attendees: parseInt(document.getElementById('attendees').value),
        purpose: document.getElementById('purpose').value,
        requirements: document.getElementById('requirements').value,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Disable submit button
    const submitBtn = document.getElementById('submitBookingBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    appData.bookings.push(formData);
    saveBookings();
    
    closeBookingModal();
    showNotification('Booking request submitted successfully!', 'success');
    
    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Booking Request';
    
    if (appData.currentView === 'home') {
        renderCalendar();
    }
}

// Booking Details
function showBookingDetails(bookingId) {
    const booking = appData.bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    showNotification(`Booking Details\n\nOrganizer: ${booking.organizerName}\nEmail: ${booking.organizerEmail}\nAttendees: ${booking.attendees}\nPurpose: ${booking.purpose}`, 'info');
}

// Booking History
function renderBookingHistory() {
    const container = document.getElementById('bookingsList');
    
    if (appData.bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No bookings yet</h3>
                <p>Your booking requests will appear here</p>
            </div>
        `;
        return;
    }
    
    // Sort by date, newest first
    const sortedBookings = [...appData.bookings].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    container.innerHTML = sortedBookings.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <div>
                    <h3 class="booking-title">${booking.title}</h3>
                    <p style="color: #6b7280; font-size: 0.875rem;">${booking.roomName}</p>
                </div>
                <span class="booking-status ${booking.status}">${booking.status.toUpperCase()}</span>
            </div>
            <div class="booking-details">
                <div class="booking-detail">
                    <span>📅</span>
                    <span>${formatDate(new Date(booking.date))}</span>
                </div>
                <div class="booking-detail">
                    <span>🕐</span>
                    <span>${booking.timeSlot}</span>
                </div>
                <div class="booking-detail">
                    <span>👤</span>
                    <span>${booking.organizerName}</span>
                </div>
                <div class="booking-detail">
                    <span>👥</span>
                    <span>${booking.attendees} attendees</span>
                </div>
                <div class="booking-detail">
                    <span>📝</span>
                    <span>${booking.type}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Chat Box
function setupChatBox() {
    const chatToggle = document.getElementById('chatToggleBtn');
    const chatBox = document.getElementById('chatBox');
    const closeChat = document.getElementById('closeChatBtn');
    const sendBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');
    
    chatToggle.addEventListener('click', () => {
        chatBox.classList.toggle('active');
    });
    
    closeChat.addEventListener('click', () => {
        chatBox.classList.remove('active');
    });
    
    sendBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    document.getElementById('chatTyping').classList.remove('hidden');
    
    // Get AI response
    try {
        const response = await AIService.chat(message, appData.chatHistory);
        
        // Add to history
        appData.chatHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: response }
        );
        
        // Hide typing indicator
        document.getElementById('chatTyping').classList.add('hidden');
        
        // Add bot response
        addChatMessage(response, 'bot');
    } catch (error) {
        document.getElementById('chatTyping').classList.add('hidden');
        addChatMessage('Sorry, I encountered an error. Please try again or contact support.', 'bot');
    }
}

function addChatMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${type}-message`;
    messageEl.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Quick Questions
function setupQuickQuestions() {
    document.querySelectorAll('.quick-q-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const question = this.getAttribute('data-question');
            await handleQuickQuestion(question);
        });
    });
    
    const botAskBtn = document.getElementById('botAskBtn');
    const botInput = document.getElementById('botQuestionInput');
    
    botAskBtn.addEventListener('click', async () => {
        const question = botInput.value.trim();
        if (question) {
            await handleQuickQuestion(question);
            botInput.value = '';
        }
    });
    
    botInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const question = botInput.value.trim();
            if (question) {
                await handleQuickQuestion(question);
                botInput.value = '';
            }
        }
    });
}

async function handleQuickQuestion(question) {
    const responseEl = document.getElementById('botResponse');
    responseEl.classList.remove('hidden');
    responseEl.innerHTML = '<div class="spinner"></div><p>Thinking...</p>';
    
    try {
        const answer = await AIService.answerQuestion(question);
        responseEl.innerHTML = `
            <div class="bot-answer">
                <strong>Q: ${question}</strong>
                <p>${answer.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    } catch (error) {
        responseEl.innerHTML = `<p class="error-message">Error: ${error.message}</p>`;
    }
}

// API Configuration
function setupAPIConfig() {
    // Settings button to show API status
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', showAPIStatus);
    }
}

async function checkAPIHealth() {
    const isHealthy = await AIService.checkHealth();
    if (!isHealthy) {
        console.warn('Backend API is not responding. Using fallback mode.');
    }
}

function showAPIStatus() {
    checkAPIHealth().then(isHealthy => {
        const status = isHealthy ? 'Connected ✓' : 'Disconnected ✗';
        const message = isHealthy 
            ? `Backend API is connected and running.\n\nAPI URL: ${CONFIG.BACKEND_API_URL}\nStatus: Online`
            : `Backend API is not responding.\n\nAPI URL: ${CONFIG.BACKEND_API_URL}\nStatus: Offline\n\nThe system will use fallback features.`;
        
        showNotification(message, isHealthy ? 'success' : 'error');
    });
}

// Time Mode Switcher Functions
function setupTimeModeSwitcher() {
    const presetBtn = document.getElementById('presetModeBtn');
    const customBtn = document.getElementById('customModeBtn');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    
    // Toggle between preset and custom modes
    presetBtn.addEventListener('click', function() {
        switchTimeMode('preset');
    });
    
    customBtn.addEventListener('click', function() {
        switchTimeMode('custom');
    });
    
    // Calculate and display duration for custom time
    startTimeInput.addEventListener('input', updateDuration);
    endTimeInput.addEventListener('input', updateDuration);
}

function switchTimeMode(mode) {
    const presetBtn = document.getElementById('presetModeBtn');
    const customBtn = document.getElementById('customModeBtn');
    const presetSection = document.getElementById('presetTimeSection');
    const customSection = document.getElementById('customTimeSection');
    const timeSlotSelect = document.getElementById('timeSlot');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    
    if (mode === 'preset') {
        presetBtn.classList.add('active');
        customBtn.classList.remove('active');
        presetSection.classList.remove('hidden');
        customSection.classList.add('hidden');
        timeSlotSelect.setAttribute('required', 'required');
        startTimeInput.removeAttribute('required');
        endTimeInput.removeAttribute('required');
    } else {
        presetBtn.classList.remove('active');
        customBtn.classList.add('active');
        presetSection.classList.add('hidden');
        customSection.classList.remove('hidden');
        timeSlotSelect.removeAttribute('required');
        startTimeInput.setAttribute('required', 'required');
        endTimeInput.setAttribute('required', 'required');
    }
}

function updateDuration() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const durationDisplay = document.getElementById('durationDisplay');
    const durationText = document.getElementById('durationText');
    
    if (!startTime || !endTime) {
        durationDisplay.classList.add('hidden');
        return;
    }
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end - start;
    
    if (diffMs <= 0) {
        durationDisplay.classList.remove('hidden', 'warning');
        durationDisplay.classList.add('error');
        durationText.textContent = 'End time must be after start time';
        return;
    }
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    let durationStr = 'Duration: ';
    if (hours > 0) {
        durationStr += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
        if (hours > 0) durationStr += ' ';
        durationStr += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    durationDisplay.classList.remove('hidden', 'error', 'warning');
    
    if (hours >= 4) {
        durationDisplay.classList.add('warning');
        durationStr += ' (Long booking - may require approval)';
    }
    
    durationText.textContent = durationStr;
}

// Utility Functions
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatDateForInput(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

function saveBookings() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.BOOKINGS, JSON.stringify(appData.bookings));
    } catch (e) {
        console.error('Failed to save bookings:', e);
    }
}

function loadBookings() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.BOOKINGS);
        if (saved) {
            appData.bookings = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load bookings:', e);
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    // Simple alert for now - could be enhanced with custom notifications
    alert(message);
}
