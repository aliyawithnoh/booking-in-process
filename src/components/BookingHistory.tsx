import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, Clock, Users, MapPin } from 'lucide-react';
import { BookingRequest, Room } from '../types/booking';
import { format } from 'date-fns';

interface BookingHistoryProps {
  bookings: BookingRequest[];
  rooms: Room[];
}

export function BookingHistory({ bookings, rooms }: BookingHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room?.name || 'Unknown Room';
  };

  const filteredBookings = bookings.filter(booking => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = booking.requesterName.toLowerCase().includes(query);
      const matchesPurpose = booking.purpose.toLowerCase().includes(query);
      const matchesRoom = getRoomName(booking.roomId).toLowerCase().includes(query);
      if (!matchesName && !matchesPurpose && !matchesRoom) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false;

    // Room filter
    if (roomFilter !== 'all' && booking.roomId !== roomFilter) return false;

    return true;
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const getStatusColor = (status: BookingRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: BookingRequest['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Booking History</h2>
          <p className="text-muted-foreground">
            View and manage all your booking requests
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={roomFilter} onValueChange={setRoomFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All rooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All rooms</SelectItem>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setRoomFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {bookings.length === 0 ? 'No booking requests yet' : 'No bookings match your filters'}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2 text-base">
                      <MapPin className="w-4 h-4" />
                      {getRoomName(booking.roomId)}
                      <span className="text-sm text-muted-foreground font-normal">
                        - {format(booking.date, 'MMM dd, yyyy')}
                      </span>
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {booking.attendees} attendees
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusIcon(booking.status)} {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Purpose</h4>
                    <p className="text-sm text-muted-foreground">{booking.purpose}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Requested by:</span>
                      <p className="text-muted-foreground">{booking.requesterName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>
                      <p className="text-muted-foreground">{booking.requesterEmail}</p>
                    </div>
                  </div>
                  {booking.notes && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Notes</h4>
                      <p className="text-sm text-muted-foreground">{booking.notes}</p>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Requested on {format(booking.createdAt, 'MMM dd, yyyy \'at\' HH:mm')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}