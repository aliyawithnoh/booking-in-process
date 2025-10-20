import React, { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { LogEntry } from '../types/logbook';
import { format, isSameDay } from 'date-fns';

interface CalendarViewProps {
  entries: LogEntry[];
  onDateSelect: (date: Date) => void;
  onCreateEntry: () => void;
  selectedDate: Date;
}

export function CalendarView({ entries, onDateSelect, onCreateEntry, selectedDate }: CalendarViewProps) {
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  const getEntriesForDate = (date: Date) => {
    return entries.filter(entry => isSameDay(entry.date, date));
  };

  const selectedDateEntries = getEntriesForDate(selectedDate);

  const modifiers = {
    hasEntries: (date: Date) => getEntriesForDate(date).length > 0
  };

  const modifiersStyles = {
    hasEntries: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      borderRadius: '6px'
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            month={calendarDate}
            onMonthChange={setCalendarDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {format(selectedDate, 'MMMM dd, yyyy')}
            </CardTitle>
            <Button onClick={onCreateEntry} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedDateEntries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No entries for this date
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDateEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{entry.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {entry.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {entry.content}
                  </p>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entry.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{entry.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}