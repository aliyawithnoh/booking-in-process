import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Check, X, Clock, CreditCard, Calendar, MapPin, User } from 'lucide-react';
import { BookingRequest, Room } from '../types/booking';
import { format } from 'date-fns';

interface PaymentStatusProps {
  bookings: BookingRequest[];
  rooms: Room[];
}

export function PaymentStatus({ bookings, rooms }: PaymentStatusProps) {
  const getRoomName = (roomId: string) => {
    return rooms.find(room => room.id === roomId)?.name || 'Unknown Room';
  };

  const getPaymentStatus = (booking: BookingRequest) => {
    // In a real app, this would come from the booking data
    // For demo purposes, we'll simulate different payment statuses
    if (booking.status === 'approved') {
      return Math.random() > 0.3 ? 'paid' : 'pending';
    }
    return booking.status === 'pending' ? 'unpaid' : 'cancelled';
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Check className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Payment Pending
          </Badge>
        );
      case 'unpaid':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <X className="w-3 h-3 mr-1" />
            Unpaid
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <X className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Unknown
          </Badge>
        );
    }
  };

  const paidBookings = bookings.filter(booking => getPaymentStatus(booking) === 'paid');
  const pendingPayments = bookings.filter(booking => getPaymentStatus(booking) === 'pending');
  const unpaidBookings = bookings.filter(booking => getPaymentStatus(booking) === 'unpaid');

  const totalPaid = paidBookings.length * 15; // ₱15 per booking
  const totalPending = pendingPayments.length * 15;
  const totalUnpaid = unpaidBookings.length * 15;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Payment Status</h1>
        <p className="text-muted-foreground">
          View your payment history and outstanding balances
        </p>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-lg font-semibold">₱{totalPaid.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-lg font-semibold">₱{totalPending.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unpaid</p>
                <p className="text-lg font-semibold">₱{totalUnpaid.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-lg font-semibold">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No payment history</h3>
              <p className="text-muted-foreground">
                Your payment transactions will appear here once you make bookings.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((booking) => {
                  const paymentStatus = getPaymentStatus(booking);
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{booking.title}</h4>
                          {getPaymentStatusBadge(paymentStatus)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{getRoomName(booking.roomId)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{format(booking.date, 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{booking.timeSlot.startTime} - {booking.timeSlot.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{booking.requesterName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-medium">₱15.00</p>
                          <p className="text-xs text-muted-foreground">
                            {format(booking.createdAt, 'MMM dd')}
                          </p>
                        </div>
                        

                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Outstanding Payments */}
      {(unpaidBookings.length > 0 || pendingPayments.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Outstanding Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...unpaidBookings, ...pendingPayments].map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{booking.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {getRoomName(booking.roomId)} • {format(booking.date, 'MMM dd, yyyy')} • 
                      {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">₱15.00</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}