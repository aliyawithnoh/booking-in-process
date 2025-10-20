import React, { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { AIForecast } from './AIForecast';
import { Plus, Clock, User, Mail, Users } from 'lucide-react';
import { Room, BookingRequest, TimeSlot } from '../types/booking';
import { format, isSameDay } from 'date-fns';

interface BookingCalendarProps {
  room: Room;
  bookings: BookingRequest[];
  onDateSelect: (date: Date) => void;
  onCreateBooking: () => void;
  selectedDate: Date;
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}

// Sample time slots for demonstration
const TIME_SLOTS: TimeSlot[] = [
  { id: '1', startTime: '09:00', endTime: '10:00', available: true },
  { id: '2', startTime: '10:00', endTime: '11:00', available: true },
  { id: '3', startTime: '11:00', endTime: '12:00', available: true },
  { id: '4', startTime: '13:00', endTime: '14:00', available: true },
  { id: '5', startTime: '14:00', endTime: '15:00', available: true },
  { id: '6', startTime: '15:00', endTime: '16:00', available: true },
  { id: '7', startTime: '16:00', endTime: '17:00', available: true },
];

export function BookingCalendar({ room, bookings, onDateSelect, onCreateBooking, selectedDate, isLoggedIn, onRequireLogin }: BookingCalendarProps) {
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      booking.roomId === room.id && isSameDay(booking.date, date)
    );
  };

  const selectedDateBookings = getBookingsForDate(selectedDate);

  const getAvailableSlotsForDate = (date: Date) => {
    const dateBookings = getBookingsForDate(date);
    const bookedSlotIds = dateBookings
      .filter(booking => booking.status === 'approved')
      .map(booking => booking.timeSlot.id);
    
    return TIME_SLOTS.map(slot => ({
      ...slot,
      available: !bookedSlotIds.includes(slot.id)
    }));
  };

  const availableSlots = getAvailableSlotsForDate(selectedDate);
  const availableTimeSlots = availableSlots.filter(slot => slot.available);
  const unavailableTimeSlots = availableSlots.filter(slot => !slot.available);

  const getBookingForSlot = (slotId: string) => {
    return selectedDateBookings.find(booking => 
      booking.timeSlot.id === slotId && booking.status === 'approved'
    );
  };

  const handleUnavailableSlotClick = (slotId: string) => {
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }
    
    const booking = getBookingForSlot(slotId);
    if (booking) {
      setSelectedBooking(booking);
      setIsBookingDetailsOpen(true);
    }
  };

  // AI Forecast: Calculate booking density for color coding
  const getBookingDensity = (date: Date) => {
    const dayBookings = getBookingsForDate(date).filter(booking => booking.status === 'approved');
    const totalSlots = 7; // Total available slots per day
    const bookedSlots = dayBookings.length;
    const density = bookedSlots / totalSlots;
    
    if (density >= 0.8) return 'high'; // Fully booked (dark red)
    if (density >= 0.4) return 'medium'; // Busy (orange)
    if (density > 0) return 'low'; // Light bookings (light blue)
    return 'none'; // No bookings (white)
  };

  const modifiers = {
    highDensity: (date: Date) => getBookingDensity(date) === 'high',
    mediumDensity: (date: Date) => getBookingDensity(date) === 'medium',
    lowDensity: (date: Date) => getBookingDensity(date) === 'low',
    noDensity: (date: Date) => getBookingDensity(date) === 'none'
  };

  const modifiersStyles = {
    highDensity: {
      backgroundColor: '#dc2626', // Red-600
      color: 'white',
      borderRadius: '6px',
      fontWeight: 'bold'
    },
    mediumDensity: {
      backgroundColor: '#f97316', // Orange-500
      color: 'white',
      borderRadius: '6px',
      fontWeight: '500'
    },
    lowDensity: {
      backgroundColor: '#bfdbfe', // Blue-200
      color: '#1e40af', // Blue-800
      borderRadius: '6px'
    },
    noDensity: {
      backgroundColor: 'white',
      color: '#6b7280', // Gray-500
      borderRadius: '6px',
      border: '1px solid #e5e7eb' // Gray-200
    }
  };

  const getStatusColor = (status: BookingRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Calendar - {room.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateSelect(date)}
              month={calendarDate}
              onMonthChange={setCalendarDate}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border w-full h-full flex justify-center"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                month: "space-y-4 flex-1",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 hover:opacity-50",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex-1 text-center",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1 aspect-square",
                day: "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">
                {format(selectedDate, 'MMMM dd, yyyy')}
              </CardTitle>
              <Button onClick={onCreateBooking} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Book Room
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Available Time Slots */}
            <div>
              <h4 className="mb-3">Available Time Slots</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map((slot) => (
                    <div 
                      key={slot.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-green-100 border border-green-300"
                    >
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <span className="text-xs text-green-700 font-medium">Available</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No available time slots for this date
                  </p>
                )}
              </div>
            </div>

            {/* Unavailable/Booked Time Slots */}
            {unavailableTimeSlots.length > 0 && (
              <div>
                <h4 className="mb-3">Unavailable Time Slots</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {unavailableTimeSlots.map((slot) => {
                    const booking = getBookingForSlot(slot.id);
                    return (
                      <div 
                        key={slot.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-red-100 border border-red-300 cursor-pointer hover:bg-red-150 transition-colors"
                        onClick={() => handleUnavailableSlotClick(slot.id)}
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {booking && (
                            <span className="text-xs text-muted-foreground">
                              Click for details
                            </span>
                          )}
                          <span className="text-xs text-red-700 font-medium">Booked</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Forecast - Full width at the bottom */}
        <div className="lg:col-span-5">
          <AIForecast 
            room={room}
            bookings={bookings}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={isBookingDetailsOpen} onOpenChange={setIsBookingDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {selectedBooking.timeSlot.startTime} - {selectedBooking.timeSlot.endTime}
                </span>
                <Badge className={getStatusColor(selectedBooking.status)} className="ml-auto">
                  {selectedBooking.status}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Booked by</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.requesterName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Contact</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.requesterEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Attendees</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.attendees} people</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}