import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { LogEntry } from '../types/logbook';
import { format } from 'date-fns';

interface LogEntryCardProps {
  entry: LogEntry;
  onEdit: (entry: LogEntry) => void;
  onDelete: (id: string) => void;
}

const categoryColors = {
  work: 'bg-blue-100 text-blue-800',
  personal: 'bg-green-100 text-green-800',
  travel: 'bg-purple-100 text-purple-800',
  health: 'bg-red-100 text-red-800',
  other: 'bg-gray-100 text-gray-800'
};

export function LogEntryCard({ entry, onEdit, onDelete }: LogEntryCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="mb-2">{entry.title}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={categoryColors[entry.category]}>
                {entry.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {format(entry.date, 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(entry)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(entry.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 whitespace-pre-wrap">{entry.content}</p>
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}