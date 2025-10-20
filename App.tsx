import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RoomCard } from './components/RoomCard';
import { BookingCalendar } from './components/BookingCalendar';
import { SmartBookingForm } from './components/SmartBookingForm';
import { BookingHistory } from './components/BookingHistory';
import { LoginForm } from './components/LoginForm';
import { ChatBox } from './components/ChatBox';
import { QuestionBot } from './components/QuestionBot';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';
import { useBookings } from './hooks/useBookings';
import { Room, BookingRequest } from './types/booking';

export default function App() {
  const { bookings, rooms, createBookingRequest } = useBookings();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'history'>('home');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'navigate' | 'createBooking' | 'viewDetails';
    data?: any;
  } | null>(null);

  const handleLogin = (username: string, password: string) => {
    // In a real app, this would validate credentials
    setIsLoggedIn(true);
    
    // Execute pending action after login
    if (pendingAction) {
      if (pendingAction.type === 'navigate') {
        setCurrentView(pendingAction.data);
        if (pendingAction.data !== 'home') {
          setSelectedRoom(null);
        }
      } else if (pendingAction.type === 'createBooking') {
        setIsBookingFormOpen(true);
      }
      setPendingAction(null);
    }
  };

  const handleNavigate = (view: 'home' | 'history') => {
    // Allow navigation to home without login check
    if (view === 'home') {
      setCurrentView(view);
      return;
    }
    
    // For other pages, check if user is logged in
    if (!isLoggedIn) {
      setPendingAction({ type: 'navigate', data: view });
      return;
    }
    
    setCurrentView(view);
    // Reset room selection when navigating away from home
    setSelectedRoom(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('home');
    setSelectedRoom(null);
    setPendingAction(null);
    setIsBookingFormOpen(false);
    setIsChatOpen(false);
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateBooking = () => {
    // Check if user is logged in before opening booking form
    if (!isLoggedIn) {
      setPendingAction({ type: 'createBooking' });
      return;
    }
    
    setIsBookingFormOpen(true);
  };

  const handleRequireLogin = () => {
    setPendingAction({ type: 'viewDetails' });
  };

  const handleBookingSubmit = (bookingData: BookingRequest) => {
    createBookingRequest(bookingData);
    setIsBookingFormOpen(false);
  };

  const handleRoomChange = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleBookingCancel = () => {
    setIsBookingFormOpen(false);
  };

  if (!isLoggedIn) {
    return (
      <LoginForm 
        onLogin={handleLogin} 
        message={
          pendingAction 
            ? "Please log in to access this feature" 
            : undefined
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-6">
        {currentView === 'home' ? (
          <>
            <div className="mb-6">
              <h1 className="mb-2 text-2xl font-bold">Room Booking System</h1>
              <p className="text-muted-foreground">
                Select a room and choose your preferred date and time
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Side - Room Selection */}
              <div className="lg:col-span-1 space-y-4">
                <div className="space-y-3">
                  <h2 className="mb-3 font-semibold">Rooms</h2>
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      isSelected={selectedRoom?.id === room.id}
                      onSelect={handleRoomSelect}
                    />
                  ))}
                </div>
                
                {/* Question Bot */}
                <QuestionBot />
              </div>

              {/* Right Side - Calendar and Booking Details */}
              <div className="lg:col-span-3">
                {selectedRoom ? (
                  <BookingCalendar
                    room={selectedRoom}
                    bookings={bookings}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onCreateBooking={handleCreateBooking}
                    isLoggedIn={isLoggedIn}
                    onRequireLogin={handleRequireLogin}
                  />
                ) : (
                  <div className="flex items-center justify-center h-96 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-white">
                    <div className="text-center">
                      <h3 className="mb-2 text-muted-foreground">Select a room to view availability</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose from one of the rooms on the left to see the calendar and booking options
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <BookingHistory bookings={bookings} rooms={rooms} />
        )}

        <Dialog open={isBookingFormOpen} onOpenChange={setIsBookingFormOpen}>
          <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span>Schedule Appointment</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {selectedRoom ? `• Currently viewing ${selectedRoom.name}` : '• AI will suggest the best room'}
                </span>
              </DialogTitle>
              <DialogDescription>
                Schedule a new meeting appointment with AI-powered room recommendations based on your meeting type and attendee count.
              </DialogDescription>
            </DialogHeader>
            <SmartBookingForm
              rooms={rooms}
              selectedRoom={selectedRoom || undefined}
              selectedDate={selectedDate}
              onSubmit={handleBookingSubmit}
              onCancel={handleBookingCancel}
              onRoomChange={handleRoomChange}
            />
          </DialogContent>
        </Dialog>

        {/* Chat Box */}
        <ChatBox 
          isOpen={isChatOpen}
          onToggle={handleChatToggle}
        />
      </div>
    </div>
  );
}