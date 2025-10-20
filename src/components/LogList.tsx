import React, { useState } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, Filter, Plus } from 'lucide-react';
import { LogEntry, LogFilter } from '../types/logbook';
import { LogEntryCard } from './LogEntryCard';

interface LogListProps {
  entries: LogEntry[];
  onEdit: (entry: LogEntry) => void;
  onDelete: (id: string) => void;
  onCreateEntry: () => void;
}

export function LogList({ entries, onEdit, onDelete, onCreateEntry }: LogListProps) {
  const [filter, setFilter] = useState<LogFilter>({});
  const [showFilters, setShowFilters] = useState(false);

  const filteredEntries = entries.filter(entry => {
    if (filter.category && entry.category !== filter.category) return false;
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const matchesTitle = entry.title.toLowerCase().includes(query);
      const matchesContent = entry.content.toLowerCase().includes(query);
      const matchesTags = entry.tags.some(tag => tag.toLowerCase().includes(query));
      if (!matchesTitle && !matchesContent && !matchesTags) return false;
    }
    return true;
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2>All Entries ({filteredEntries.length})</h2>
        <Button onClick={onCreateEntry}>
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={filter.searchQuery || ''}
            onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
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
          <Select
            value={filter.category || 'all'}
            onValueChange={(value) => 
              setFilter({ 
                ...filter, 
                category: value === 'all' ? undefined : value as LogEntry['category'] 
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => setFilter({})}
          >
            Clear Filters
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {entries.length === 0 ? 'No entries yet' : 'No entries match your filters'}
            </p>
            <Button onClick={onCreateEntry}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Entry
            </Button>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <LogEntryCard
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}