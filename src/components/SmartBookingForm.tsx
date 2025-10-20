import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { RoomSuggestion } from './RoomSuggestion';
import { CalendarIcon, Clock, Users, Sparkles } from 'lucide-react';
import { Room, BookingRequest, TimeSlot } from '../types/booking';
import { format } from 'date-fns';

interface SmartBookingFormProps {
  rooms: Room[];
  selectedRoom?: Room;
  selectedDate?: Date;
  onSubmit: (booking: BookingRequest) => void;
  onCancel: () => void;
  onRoomChange?: (room: Room) => void;
}

// Same time slots as in BookingCalendar
const TIME_SLOTS: TimeSlot[] = [
  { id: '1', startTime: '09:00', endTime: '10:00', available: true },
  { id: '2', startTime: '10:00', endTime: '11:00', available: true },
  { id: '3', startTime: '11:00', endTime: '12:00', available: true },
  { id: '4', startTime: '13:00', endTime: '14:00', available: true },
  { id: '5', startTime: '14:00', endTime: '15:00', available: true },
  { id: '6', startTime: '15:00', endTime: '16:00', available: true },
  { id: '7', startTime: '16:00', endTime: '17:00', available: true },
];

export function SmartBookingForm({ 
  rooms, 
  selectedRoom, 
  selectedDate, 
  onSubmit, 
  onCancel, 
  onRoomChange 
}: SmartBookingFormProps) {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(selectedRoom || null);
  const [date, setDate] = useState<Date>(selectedDate || new Date());
  const [timeSlotId, setTimeSlotId] = useState<string>('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingType, setMeetingType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [attendees, setAttendees] = useState<number>(1);
  const [notes, setNotes] = useState('');

  const selectedTimeSlot = TIME_SLOTS.find(slot => slot.id === timeSlotId);

  const handleRoomSelect = (room: Room) => {
    setCurrentRoom(room);
    onRoomChange?.(room);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterName.trim() || !requesterEmail.trim() || !meetingTitle.trim() || !meetingType || !selectedTimeSlot || !currentRoom) return;

    const bookingRequest: BookingRequest = {
      id: `booking-${Date.now()}`,
      roomId: currentRoom.id,
      date,
      startTime: date,
      endTime: date,
      timeSlot: selectedTimeSlot,
      requesterName: requesterName.trim(),
      requesterEmail: requesterEmail.trim(),
      title: meetingTitle.trim(),
      purpose: `${meetingType}: ${purpose.trim()}`,
      attendees,
      notes: notes.trim(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSubmit(bookingRequest);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Booking Form (2 columns wide) */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <h3 className="font-medium">Appointment Details</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Meeting Title */}
          <div>
            <label htmlFor="meetingTitle" className="block mb-2">Meeting Title</label>
            <Input
              id="meetingTitle"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="e.g., Q4 Strategy Planning, Client Presentation"
              required
            />
          </div>

          {/* Meeting Type */}
          <div>
            <label htmlFor="meetingType" className="block mb-2">Meeting Type</label>
            <Select value={meetingType} onValueChange={setMeetingType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select meeting type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Team Meeting">Team Meeting</SelectItem>
                <SelectItem value="Client Meeting">Client Meeting</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Presentation">Presentation</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Training Session">Training Session</SelectItem>
                <SelectItem value="Board Meeting">Board Meeting</SelectItem>
                <SelectItem value="Conference Call">Conference Call</SelectItem>
                <SelectItem value="Brainstorming">Brainstorming Session</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Organizer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block mb-2">Organizer Name</label>
              <Input
                id="name"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">Organizer Email</label>
              <Input
                id="email"
                type="email"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block mb-2">Meeting Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label htmlFor="timeSlot" className="block mb-2">Time Slot</label>
              <Select value={timeSlotId} onValueChange={setTimeSlotId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id}>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Number of Attendees */}
          <div>
            <label htmlFor="attendees" className="block mb-2">Expected Attendees</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="attendees"
                type="number"
                min="1"
                max="200"
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                className="pl-10"
                placeholder="Number of people attending"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              💡 This helps us suggest the right room size
            </p>
          </div>

          {/* Meeting Purpose */}
          <div>
            <label htmlFor="purpose" className="block mb-2">Meeting Purpose</label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Brief description of the meeting purpose..."
              rows={3}
              required
            />
          </div>

          {/* Additional Requirements */}
          <div>
            <label htmlFor="notes" className="block mb-2">Special Requirements (Optional)</label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Equipment needs, catering, accessibility requirements, etc."
              rows={3}
            />
          </div>

          {/* Selected Room Display */}
          {currentRoom && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-blue-900">Selected Room: {currentRoom.name}</h4>
              </div>
              <p className="text-sm text-blue-700">
                Capacity: {currentRoom.capacity} people • {currentRoom.amenities.join(', ')}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={!currentRoom}>
              Submit Booking Request
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* Right Column - AI Suggestions */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="font-medium">AI Room Suggestions</h3>
        </div>

        <RoomSuggestion
          rooms={rooms}
          eventType={meetingType || purpose}
          attendeeCount={attendees}
          onRoomSelect={handleRoomSelect}
          selectedRoom={currentRoom || undefined}
        />
      </div>
    </div>
  );
}