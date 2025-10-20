export interface LogEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  tags: string[];
  category: 'work' | 'personal' | 'travel' | 'health' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

export interface LogFilter {
  category?: LogEntry['category'];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  searchQuery?: string;
}