import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Clock, Users } from 'lucide-react';
import { Room, BookingRequest, TimeSlot } from '../types/booking';
import { format } from 'date-fns';

interface BookingRequestFormProps {
  room: Room;
  selectedDate?: Date;
  onSubmit: (booking: BookingRequest) => void;
  onCancel: () => void;
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

export function BookingRequestForm({ room, selectedDate, onSubmit, onCancel }: BookingRequestFormProps) {
  const [date, setDate] = useState<Date>(selectedDate || new Date());
  const [timeSlotId, setTimeSlotId] = useState<string>('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [attendees, setAttendees] = useState<number>(1);
  const [notes, setNotes] = useState('');

  const selectedTimeSlot = TIME_SLOTS.find(slot => slot.id === timeSlotId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterName.trim() || !requesterEmail.trim() || !purpose.trim() || !selectedTimeSlot) return;

    const bookingRequest: BookingRequest = {
      id: `booking-${Date.now()}`,
      roomId: room.id,
      date,
      startTime: date,
      endTime: date,
      timeSlot: selectedTimeSlot,
      requesterName: requesterName.trim(),
      requesterEmail: requesterEmail.trim(),
      title: purpose.trim(),
      purpose: purpose.trim(),
      attendees,
      notes: notes.trim(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSubmit(bookingRequest);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block mb-2">Your Name</label>
          <Input
            id="name"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2">Email Address</label>
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

      <div>
        <label htmlFor="date" className="block mb-2">Date</label>
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

      <div>
        <label htmlFor="purpose" className="block mb-2">Purpose of Booking</label>
        <Textarea
          id="purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Describe the purpose of your booking..."
          rows={3}
          required
        />
      </div>

      <div>
        <label htmlFor="attendees" className="block mb-2">Number of Attendees</label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="attendees"
            type="number"
            min="1"
            max={room.capacity}
            value={attendees}
            onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
            className="pl-10"
            required
          />
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Maximum capacity: {room.capacity} people
        </p>
      </div>

      <div>
        <label htmlFor="notes" className="block mb-2">Additional Notes (Optional)</label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requirements or additional information..."
          rows={2}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">
          Submit Booking Request
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}