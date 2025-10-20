import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Wifi, Monitor, Coffee, Car } from 'lucide-react';
import { Room } from '../types/booking';

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  onSelect: (room: Room) => void;
}

const amenityIcons = {
  'WiFi': Wifi,
  'Projector': Monitor,
  'Coffee': Coffee,
  'Parking': Car,
};

export function RoomCard({ room, isSelected, onSelect }: RoomCardProps) {
  return (
    <div 
      className={`cursor-pointer transition-all duration-200 p-4 rounded-lg border ${
        isSelected ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
      }`}
      onClick={() => onSelect(room)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{room.name}</h3>
        {isSelected && (
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
        {room.description}
      </p>
      <div className="flex items-center text-xs text-muted-foreground">
        <Users className="w-3 h-3 mr-1" />
        <span>Capacity: {room.capacity}</span>
      </div>
    </div>
  );
}