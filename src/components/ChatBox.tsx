import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageCircle, Send, Minimize2, Maximize2, X, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBoxProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatBox({ isOpen, onToggle }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your booking assistant. I can help you with room information, booking policies, and availability questions. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Room information responses
    if (message.includes('auditorium')) {
      return "The Auditorium is our largest space with capacity for 200 people. It features a projector, WiFi, coffee service, and parking. Perfect for presentations and large meetings. Rate: $150/hour.";
    }
    if (message.includes('library')) {
      return "The Library is a quiet study space for up to 50 people. It has WiFi and coffee service. Ideal for study sessions and small meetings. Rate: $75/hour.";
    }
    if (message.includes('grounds')) {
      return "The Grounds is our outdoor space for up to 100 people. It includes parking and WiFi access. Great for team building and social events. Rate: $100/hour.";
    }
    
    // Booking process responses
    if (message.includes('book') || message.includes('reservation')) {
      return "To make a booking: 1) Select a room from the left panel, 2) Choose your date and time, 3) Click 'Book Room', 4) Fill out the smart booking form. Our AI will suggest the best room based on your event details!";
    }
    if (message.includes('payment')) {
      return "We accept all major credit cards and bank transfers. Payment is required at the time of booking. You can view your payment status in the Payment section of the navigation.";
    }
    if (message.includes('cancel')) {
      return "You can cancel your booking up to 12 hours in advance for a full refund. Cancellations within 12 hours incur a 50% fee. No-shows are charged the full amount.";
    }
    
    // Policy responses
    if (message.includes('policy') || message.includes('rules')) {
      return "Our main policies include: 24-hour advance booking required, max 4-hour sessions, no smoking/vaping, and respect for capacity limits. Check the Policy page for complete details.";
    }
    if (message.includes('hours') || message.includes('time')) {
      return "Our rooms are available from 9:00 AM to 5:00 PM in 1-hour slots. Bookings must be made at least 24 hours in advance.";
    }
    
    // AI suggestion responses
    if (message.includes('suggest') || message.includes('recommend')) {
      return "Our AI analyzes your event type and attendee count to recommend the perfect room! Just describe your event (like 'presentation', 'study session', 'meeting') and enter attendee numbers in the booking form.";
    }
    if (message.includes('ai') || message.includes('smart')) {
      return "Our Smart Booking System uses AI to match your event requirements with the best room. It considers capacity, amenities, and event type for optimal suggestions!";
    }
    
    // Capacity questions
    if (message.includes('capacity') || message.includes('people')) {
      return "Room capacities: Auditorium (200 people), Library (50 people), Grounds (100 people). Our AI will warn you if your group size exceeds room capacity.";
    }
    
    // Amenities questions
    if (message.includes('amenities') || message.includes('features')) {
      return "Auditorium: Projector, WiFi, Coffee, Parking | Library: WiFi, Coffee | Grounds: Parking, WiFi. All rooms are well-maintained with modern facilities.";
    }
    
    // Contact information
    if (message.includes('contact') || message.includes('help') || message.includes('support')) {
      return "For additional help: Phone: +1 (555) 123-4567 (Mon-Fri, 9 AM - 6 PM) | Email: booking@bchs.edu | Emergency: +1 (555) 999-8888 (24/7)";
    }
    
    // Pricing questions
    if (message.includes('price') || message.includes('cost') || message.includes('rate')) {
      return "Hourly rates: Auditorium $150/hour, Library $75/hour, Grounds $100/hour. All prices include basic amenities. Extended bookings may qualify for discounts.";
    }
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to help with your room booking needs. You can ask me about room features, booking policies, pricing, or how to use our AI-powered booking system.";
    }
    
    // Default response
    return "I can help you with room information, booking procedures, policies, pricing, and using our AI booking system. Try asking about specific rooms, booking policies, or how our smart suggestions work!";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="default"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-80 shadow-xl z-50 transition-all ${
      isMinimized ? 'h-16' : 'h-96'
    }`}>
      <CardHeader className="p-3 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Booking Assistant
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-80">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && <Bot className="w-3 h-3 mt-0.5 text-blue-600" />}
                    {message.sender === 'user' && <User className="w-3 h-3 mt-0.5" />}
                    <span>{message.content}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-2 rounded-lg text-sm flex items-center gap-2">
                  <Bot className="w-3 h-3 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse delay-100"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about rooms, booking, or policies..."
                className="text-sm"
              />
              <Button size="sm" onClick={handleSendMessage}>
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}