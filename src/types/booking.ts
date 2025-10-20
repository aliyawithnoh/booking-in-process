export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  amenities: string[];
  image?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  available: boolean;
}

export interface BookingRequest {
  id: string;
  roomId: string;
  date: Date;
  timeSlot: TimeSlot;
  requesterName: string;
  requesterEmail: string;
  purpose: string;
  attendees: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface BookingFilter {
  roomId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: BookingRequest['status'];
}