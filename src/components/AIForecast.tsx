import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { Room, BookingRequest } from '../types/booking';
import { format, addDays, isSameDay } from 'date-fns';

interface AIForecastProps {
  room: Room;
  bookings: BookingRequest[];
  selectedDate: Date;
}

export function AIForecast({ room, bookings, selectedDate }: AIForecastProps) {
  // Calculate booking density for the next 7 days
  const forecastDays = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i));
  
  const getBookingDensity = (date: Date) => {
    const dayBookings = bookings.filter(booking => 
      booking.roomId === room.id && 
      isSameDay(booking.date, date) &&
      booking.status === 'approved'
    );
    
    const totalSlots = 7; // Based on TIME_SLOTS from BookingCalendar
    const bookedSlots = dayBookings.length;
    const density = bookedSlots / totalSlots;
    
    return {
      density,
      bookedSlots,
      totalSlots,
      level: density >= 0.8 ? 'high' : density >= 0.4 ? 'medium' : density > 0 ? 'low' : 'none'
    };
  };

  const getDensityColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-orange-400 text-white';
      case 'low': return 'bg-blue-200 text-blue-900';
      case 'none': return 'bg-white text-gray-600 border border-gray-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDensityLabel = (level: string) => {
    switch (level) {
      case 'high': return 'Fully Booked';
      case 'medium': return 'Busy';
      case 'low': return 'Light';
      case 'none': return 'Available';
      default: return 'Unknown';
    }
  };

  const weeklyStats = forecastDays.map(date => getBookingDensity(date));
  const averageDensity = weeklyStats.reduce((sum, day) => sum + day.density, 0) / weeklyStats.length;
  const busyDays = weeklyStats.filter(day => day.level === 'high' || day.level === 'medium').length;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Booking Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weekly Overview */}
        <div className="grid grid-cols-7 gap-1">
          {forecastDays.map((date, index) => {
            const dayStats = getBookingDensity(date);
            return (
              <div key={index} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  {format(date, 'EEE')}
                </div>
                <div className="text-xs mb-1">
                  {format(date, 'dd')}
                </div>
                <div 
                  className={`w-full h-8 rounded flex items-center justify-center text-xs font-medium ${getDensityColor(dayStats.level)}`}
                  title={`${dayStats.bookedSlots}/${dayStats.totalSlots} slots booked`}
                >
                  {dayStats.bookedSlots}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-muted rounded">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-xs text-muted-foreground">Avg. Utilization</div>
              <div className="font-medium">{Math.round(averageDensity * 100)}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted rounded">
            <Calendar className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-xs text-muted-foreground">Busy Days</div>
              <div className="font-medium">{busyDays}/7</div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            AI Insights
          </h4>
          <div className="space-y-1">
            {averageDensity > 0.7 && (
              <div className="text-xs p-2 bg-red-50 text-red-800 rounded">
                High demand period - consider booking early
              </div>
            )}
            {averageDensity < 0.3 && (
              <div className="text-xs p-2 bg-green-50 text-green-800 rounded">
                Low demand period - flexible booking options available
              </div>
            )}
            {busyDays >= 4 && (
              <div className="text-xs p-2 bg-amber-50 text-amber-800 rounded">
                Peak week - alternative dates recommended
              </div>
            )}
            {busyDays <= 1 && (
              <div className="text-xs p-2 bg-blue-50 text-blue-800 rounded">
                Quiet week - great time for planning meetings
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Badge className="bg-red-600 text-white text-xs">Fully Booked</Badge>
          <Badge className="bg-orange-400 text-white text-xs">Busy</Badge>
          <Badge className="bg-blue-200 text-blue-900 text-xs">Light</Badge>
          <Badge variant="outline" className="text-xs">Available</Badge>
        </div>
      </CardContent>
    </Card>
  );
}