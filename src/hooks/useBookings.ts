import { useState, useEffect } from 'react';
import { Room, BookingRequest } from '../types/booking';

const STORAGE_KEY = 'room-bookings';

// Sample room data
const SAMPLE_ROOMS: Room[] = [
  {
    id: 'auditorium',
    name: 'Auditorium',
    description: 'Large presentation space with state-of-the-art audio-visual equipment',
    capacity: 200,
    amenities: ['Projector', 'WiFi']
  },
  {
    id: 'library',
    name: 'Library',
    description: 'Quiet study space perfect for focused work and small meetings',
    capacity: 50,
    amenities: ['WiFi', 'projector']
  },
  {
    id: 'grounds',
    name: 'Grounds',
    description: 'Outdoor space ideal for team building and casual gatherings',
    capacity: 100,
    amenities: ['Parking', 'outside']
  }
];

// Sample bookings to demonstrate functionality
const SAMPLE_BOOKINGS: BookingRequest[] = [
  {
    id: 'sample-1',
    roomId: 'auditorium',
    date: new Date(),
    timeSlot: { id: '2', startTime: '10:00', endTime: '11:00', available: false },
    requesterName: 'John Smith',
    requesterEmail: 'john.smith@company.com',
    purpose: 'Quarterly team presentation and review meeting',
    attendees: 45,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000),
    notes: 'Need microphone and projector setup'
  },
  {
    id: 'sample-2',
    roomId: 'library',
    date: new Date(Date.now() + 86400000), // Tomorrow
    timeSlot: { id: '4', startTime: '13:00', endTime: '14:00', available: false },
    requesterName: 'Sarah Johnson',
    requesterEmail: 'sarah.johnson@company.com',
    purpose: 'Book club meeting and discussion',
    attendees: 12,
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000),
    notes: 'Prefer quiet corner area'
  }
];

export function useBookings() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [rooms] = useState<Room[]>(SAMPLE_ROOMS);

  // Load bookings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const bookingsWithDates = parsed.map((booking: any) => ({
          ...booking,
          date: new Date(booking.date),
          createdAt: new Date(booking.createdAt),
          updatedAt: new Date(booking.updatedAt)
        }));
        setBookings(bookingsWithDates);
      } catch (error) {
        console.error('Failed to parse stored bookings:', error);
        // If parsing fails, use sample bookings
        setBookings(SAMPLE_BOOKINGS);
      }
    } else {
      // If no stored bookings, use sample bookings
      setBookings(SAMPLE_BOOKINGS);
    }
  }, []);

  // Save bookings to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const createBookingRequest = (bookingData: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newBooking: BookingRequest = {
      ...bookingData,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingRequest['status']) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id 
        ? { ...booking, status, updatedAt: new Date() }
        : booking
    ));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
  };

  const getRoomById = (roomId: string) => {
    return rooms.find(room => room.id === roomId);
  };

  return {
    bookings,
    rooms,
    createBookingRequest,
    updateBookingStatus,
    deleteBooking,
    getRoomById
  };
}