import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Lightbulb, Users, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Room } from '../types/booking';

interface RoomSuggestionProps {
  rooms: Room[];
  eventType: string;
  attendeeCount: number;
  onRoomSelect?: (room: Room) => void;
  selectedRoom?: Room;
}

interface SuggestionResult {
  room: Room;
  score: number;
  reasons: string[];
  fit: 'perfect' | 'good' | 'acceptable' | 'poor';
}

export function RoomSuggestion({ rooms, eventType, attendeeCount, onRoomSelect, selectedRoom }: RoomSuggestionProps) {
  const [suggestions, setSuggestions] = useState<SuggestionResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI logic to analyze and score rooms
  const analyzeRooms = (event: string, attendees: number): SuggestionResult[] => {
    if (!event.trim() || attendees < 1) return [];

    const eventLower = event.toLowerCase();
    
    // Event type keywords and their preferred amenities
    const eventTypes = {
      presentation: { keywords: ['presentation', 'demo', 'showcase', 'pitch', 'meeting'], amenities: ['Projector', 'WiFi'] },
      conference: { keywords: ['conference', 'seminar', 'workshop', 'training'], amenities: ['Projector', 'WiFi', 'Coffee'] },
      study: { keywords: ['study', 'research', 'reading', 'quiet', 'focus'], amenities: ['WiFi'] },
      social: { keywords: ['party', 'celebration', 'gathering', 'social', 'event'], amenities: ['WiFi', 'Parking'] },
      outdoor: { keywords: ['outdoor', 'team building', 'sports', 'activities'], amenities: ['Parking'] },
      meeting: { keywords: ['meeting', 'discussion', 'brainstorm', 'planning'], amenities: ['WiFi', 'Projector'] },
      interview: { keywords: ['interview', 'hiring', 'recruitment'], amenities: ['WiFi'] },
      training: { keywords: ['training', 'course', 'lesson', 'education'], amenities: ['Projector', 'WiFi', 'Coffee'] }
    };

    // Determine event category
    let detectedType = 'general';
    let preferredAmenities: string[] = [];
    
    for (const [type, config] of Object.entries(eventTypes)) {
      if (config.keywords.some(keyword => eventLower.includes(keyword))) {
        detectedType = type;
        preferredAmenities = config.amenities;
        break;
      }
    }

    return rooms.map(room => {
      let score = 0;
      const reasons: string[] = [];

      // Capacity scoring (most important factor)
      const capacityRatio = attendees / room.capacity;
      if (capacityRatio <= 0.5) {
        score += 40;
        reasons.push(`Plenty of space (${attendees}/${room.capacity} capacity)`);
      } else if (capacityRatio <= 0.8) {
        score += 30;
        reasons.push(`Good fit (${attendees}/${room.capacity} capacity)`);
      } else if (capacityRatio <= 1.0) {
        score += 20;
        reasons.push(`At capacity limit (${attendees}/${room.capacity})`);
      } else {
        score += 0;
        reasons.push(`Exceeds capacity (${attendees}/${room.capacity})`);
      }

      // Amenity matching
      const matchingAmenities = room.amenities.filter(amenity => 
        preferredAmenities.includes(amenity)
      );
      score += matchingAmenities.length * 10;
      if (matchingAmenities.length > 0) {
        reasons.push(`Has ${matchingAmenities.join(', ')}`);
      }

      // Room-specific event type matching
      if (detectedType === 'presentation' || detectedType === 'conference') {
        if (room.id === 'auditorium') {
          score += 25;
          reasons.push('Large presentation space');
        }
      } else if (detectedType === 'study') {
        if (room.id === 'library') {
          score += 25;
          reasons.push('Quiet study environment');
        }
      } else if (detectedType === 'outdoor' || detectedType === 'social') {
        if (room.id === 'grounds') {
          score += 25;
          reasons.push('Outdoor space for activities');
        }
      } else if (detectedType === 'meeting' && attendees <= 20) {
        if (room.id === 'library') {
          score += 15;
          reasons.push('Intimate meeting space');
        }
      }

      // Determine fit level
      let fit: SuggestionResult['fit'];
      if (score >= 70) fit = 'perfect';
      else if (score >= 50) fit = 'good';
      else if (score >= 30) fit = 'acceptable';
      else fit = 'poor';

      return { room, score, reasons, fit };
    }).sort((a, b) => b.score - a.score);
  };

  useEffect(() => {
    if (eventType.trim() && attendeeCount > 0) {
      setIsAnalyzing(true);
      // Simulate AI processing delay
      const timer = setTimeout(() => {
        const results = analyzeRooms(eventType, attendeeCount);
        setSuggestions(results);
        setIsAnalyzing(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [eventType, attendeeCount, rooms]);

  if (!eventType.trim() || attendeeCount < 1) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Enter event details to get AI room suggestions</p>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">
            <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p>AI analyzing your event requirements...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getFitColor = (fit: SuggestionResult['fit']) => {
    switch (fit) {
      case 'perfect': return 'bg-green-100 text-green-800 border-green-300';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'acceptable': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'poor': return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getFitIcon = (fit: SuggestionResult['fit']) => {
    switch (fit) {
      case 'perfect': return '🎯';
      case 'good': return '👍';
      case 'acceptable': return '⚠️';
      case 'poor': return '❌';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          AI Room Suggestions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on your event: "{eventType}" for {attendeeCount} attendees
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion.room.id}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedRoom?.id === suggestion.room.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getFitIcon(suggestion.fit)}</span>
                <div>
                  <h4 className="font-medium">{suggestion.room.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Up to {suggestion.room.capacity} people</span>
                    <MapPin className="w-3 h-3 ml-2" />
                    <span>{suggestion.room.amenities.length} amenities</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`${getFitColor(suggestion.fit)} text-xs`}>
                  {suggestion.fit} match
                </Badge>
                <span className="text-xs font-medium text-muted-foreground">
                  {suggestion.score}%
                </span>
              </div>
            </div>

            <div className="space-y-1 mb-3">
              {suggestion.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            {onRoomSelect && (
              <Button
                size="sm"
                variant={selectedRoom?.id === suggestion.room.id ? "default" : "outline"}
                onClick={() => onRoomSelect(suggestion.room)}
                className="w-full"
                disabled={suggestion.fit === 'poor'}
              >
                {selectedRoom?.id === suggestion.room.id ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Selected
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Select {suggestion.room.name}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            )}

            {index === 0 && suggestion.fit === 'perfect' && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                🌟 AI Recommendation: This room is perfect for your event!
              </div>
            )}
          </div>
        ))}

        {suggestions.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            <p>No suitable rooms found for your requirements</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}