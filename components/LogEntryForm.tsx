import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { LogEntry } from '../types/logbook';
import { format } from 'date-fns';

interface LogEntryFormProps {
  entry?: LogEntry;
  onSubmit: (entry: Omit<LogEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function LogEntryForm({ entry, onSubmit, onCancel }: LogEntryFormProps) {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [date, setDate] = useState<Date>(entry?.date || new Date());
  const [category, setCategory] = useState<LogEntry['category']>(entry?.category || 'other');
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      date,
      category,
      tags
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2">Title</label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter log entry title"
          required
        />
      </div>

      <div>
        <label htmlFor="date" className="block mb-2">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, 'PPP')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label htmlFor="category" className="block mb-2">Category</label>
        <Select value={category} onValueChange={(value: LogEntry['category']) => setCategory(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="content" className="block mb-2">Content</label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your log entry here..."
          rows={6}
          required
        />
      </div>

      <div>
        <label className="block mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          />
          <Button type="button" onClick={handleAddTag} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRemoveTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">
          {entry ? 'Update Entry' : 'Create Entry'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}