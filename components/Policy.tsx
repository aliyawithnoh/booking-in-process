import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { FileText, Clock, CreditCard, Shield, Phone, Mail, MapPin, AlertTriangle } from 'lucide-react';

export function Policy() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2">Booking Policies & Guidelines</h1>
        <p className="text-muted-foreground">
          Please review our policies before making a booking
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Booking Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Advance Booking</h4>
              <p className="text-sm text-muted-foreground">
                Bookings must be made at least 24 hours in advance. Same-day bookings are subject to availability.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Booking Duration</h4>
              <p className="text-sm text-muted-foreground">
                Maximum booking duration is 4 hours per session. Extended bookings require approval.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Capacity Limits</h4>
              <p className="text-sm text-muted-foreground">
                Bookings cannot exceed room capacity. Additional attendees will not be permitted.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Cancellation Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Free Cancellation</h4>
              <p className="text-sm text-muted-foreground">
                Cancel up to 12 hours before your booking for a full refund.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Late Cancellation</h4>
              <p className="text-sm text-muted-foreground">
                Cancellations within 12 hours incur a 50% cancellation fee.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">No-Show Policy</h4>
              <p className="text-sm text-muted-foreground">
                No-shows will be charged the full booking amount and may affect future booking privileges.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-500" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Room Rates</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Auditorium</span>
                  <Badge variant="outline">$150/hour</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Library</span>
                  <Badge variant="outline">$75/hour</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Grounds</span>
                  <Badge variant="outline">$100/hour</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Payment Methods</h4>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards and bank transfers. Payment is required at booking.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              Usage Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Prohibited Activities</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Smoking or vaping in any room</li>
                <li>• Loud music after 10 PM</li>
                <li>• Food and drinks in Library</li>
                <li>• Unauthorized equipment setup</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Equipment Responsibility</h4>
              <p className="text-sm text-muted-foreground">
                Users are responsible for any damage to facilities or equipment during their booking.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-500" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 mt-1 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Phone Support</h4>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                <p className="text-xs text-muted-foreground">Mon-Fri, 9 AM - 6 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 mt-1 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Email Support</h4>
                <p className="text-sm text-muted-foreground">booking@bchs.edu</p>
                <p className="text-xs text-muted-foreground">Response within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Emergency Contact</h4>
                <p className="text-sm text-muted-foreground">+1 (555) 999-8888</p>
                <p className="text-xs text-muted-foreground">24/7 Facility Security</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900 mb-1">Important Notice</h4>
              <p className="text-sm text-orange-800">
                By submitting a booking request, you agree to abide by all policies listed above. 
                Violation of these policies may result in booking cancellation and restricted access to future bookings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}