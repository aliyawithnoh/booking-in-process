import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Check, X } from 'lucide-react';
import { Room, BookingRequest } from '../types/booking';

interface PaymentFormProps {
  room: Room;
  bookingData: BookingRequest;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ 
  room, 
  bookingData, 
  onPaymentComplete, 
  onCancel 
}) => {
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const bookingFee = 1500; // ₱15.00 in centavos
  const formattedFee = `₱${(bookingFee / 100).toFixed(2)}`;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('confirmation');
    
    // Simulate payment processing
    setTimeout(() => {
      onPaymentComplete();
    }, 2000);
  };

  if (paymentStep === 'details') {
    return (
      <div className="space-y-6">
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <h2 className="text-xl font-bold">Booking Confirmation</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              {bookingData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Time booked:</span>
                <p>{new Date(bookingData.startTime).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Location:</span>
                <p>{room.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date of event:</span>
                <p>{new Date(bookingData.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>

            <div className="border-t pt-3 mt-4">
              <div className="flex justify-between items-center">
                <span>Booking Fee:</span>
                <span className="font-semibold">{formattedFee}</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Event booking fee may be waived for the auditorium on September 5. For an academic activity
                related, this cost will not be an issue but must refer to office of the guidance office or executive
                office.
              </p>
              
              <p className="text-sm text-muted-foreground">
                We're planning to confirm if the auditorium is free been successfully reserved by the
                Academic Programs. The guidance counselors at the auditorium with every event in school. 
                Therefore, with every programs need assistance, contact our guidelines office which can be
                reached at 0920 455 (school) for assistance.
              </p>
            </div>

            <p className="text-sm text-center mt-4">
              This slot will have three hours reserved for you to set
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={() => setPaymentStep('payment')} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Proceed to Payment
          </Button>
        </div>
      </div>
    );
  }

  if (paymentStep === 'payment') {
    return (
      <div className="space-y-6">
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <h2 className="text-xl font-bold">Payment</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cardHolder">Card Holder Name</Label>
                <Input
                  id="cardHolder"
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span>Total Amount:</span>
                  <span className="text-xl font-bold">{formattedFee}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" onClick={() => setPaymentStep('details')} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Pay Now
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="bg-blue-600 text-white p-4 rounded-lg">
        <h2 className="text-xl font-bold">Payment Confirmation</h2>
      </div>

      <div className="py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
        <p className="text-muted-foreground">Your booking has been confirmed and payment processed.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Booking ID:</span>
              <span className="font-mono">BK{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span>{formattedFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <Check className="w-3 h-3 mr-1" />
                Fully Paid
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onPaymentComplete} className="w-full bg-blue-600 hover:bg-blue-700">
        Return to Dashboard
      </Button>
    </div>
  );
};