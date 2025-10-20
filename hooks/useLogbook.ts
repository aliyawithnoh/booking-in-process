import { useState, useEffect } from 'react';
import { LogEntry } from '../types/logbook';

const STORAGE_KEY = 'logbook-entries';

export function useLogbook() {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  // Load entries from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const entriesWithDates = parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt)
        }));
        setEntries(entriesWithDates);
      } catch (error) {
        console.error('Failed to parse stored entries:', error);
      }
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const createEntry = (entryData: Omit<LogEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: LogEntry = {
      ...entryData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setEntries(prev => [...prev, newEntry]);
    return newEntry;
  };

  const updateEntry = (id: string, entryData: Omit<LogEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, ...entryData, updatedAt: new Date() }
        : entry
    ));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  return {
    entries,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntry
  };
}