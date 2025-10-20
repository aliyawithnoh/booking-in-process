import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MessageCircle, Send, Bot, User, Clock, CreditCard, Shield, Calendar, HelpCircle } from 'lucide-react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface FAQ {
  question: string;
  answer: string;
  category: 'booking' | 'payment' | 'policy' | 'general';
  keywords: string[];
}

export function QuestionBot() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m your booking assistant. I can help you with questions about room reservations, pricing, policies, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const faqs: FAQ[] = [
    {
      question: 'How do I book a room?',
      answer: 'To book a room: 1) Select a room from the list above, 2) Choose your preferred date and time on the calendar, 3) Click on an available time slot, 4) Fill out the booking form, and 5) Complete the payment process.',
      category: 'booking',
      keywords: ['book', 'reserve', 'how to', 'process']
    },
    {
      question: 'What are the room rates?',
      answer: 'Room rates vary by location: Auditorium is $150/hour, Library is $75/hour, and Grounds is $200/hour. All bookings require a 2-hour minimum.',
      category: 'payment',
      keywords: ['price', 'cost', 'rate', 'fee', 'money']
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel bookings up to 24 hours before your scheduled time for a full refund. Cancellations within 24 hours are subject to a 50% cancellation fee.',
      category: 'policy',
      keywords: ['cancel', 'refund', 'policy']
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and PayPal. Payment is required at the time of booking.',
      category: 'payment',
      keywords: ['payment', 'credit card', 'paypal', 'pay']
    },
    {
      question: 'How far in advance can I book?',
      answer: 'You can book rooms up to 90 days in advance. We recommend booking early, especially for popular time slots and weekends.',
      category: 'booking',
      keywords: ['advance', 'early', 'when', 'schedule']
    },
    {
      question: 'What happens if I\'m late?',
      answer: 'Please arrive on time for your booking. If you\'re more than 15 minutes late, your reservation may be cancelled without refund, and the room may be made available to other users.',
      category: 'policy',
      keywords: ['late', 'time', 'arrive', 'punctual']
    },
    {
      question: 'Do you offer discounts?',
      answer: 'We offer discounts for: educational institutions (20% off), non-profit organizations (15% off), and bulk bookings of 10+ hours (10% off). Contact us for discount codes.',
      category: 'payment',
      keywords: ['discount', 'promo', 'deal', 'cheaper']
    },
    {
      question: 'What amenities are included?',
      answer: 'All rooms include Wi-Fi, climate control, and basic lighting. Auditorium has A/V equipment, Library has whiteboards and quiet atmosphere, Grounds offers outdoor space with weather protection.',
      category: 'general',
      keywords: ['amenities', 'included', 'features', 'equipment']
    }
  ];

  const quickQuestions = [
    'How do I book a room?',
    'What are the rates?',
    'Can I cancel?',
    'Payment methods?'
  ];

  const findBestAnswer = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Find FAQ with best keyword match
    let bestMatch = faqs[0];
    let bestScore = 0;
    
    faqs.forEach(faq => {
      let score = 0;
      faq.keywords.forEach(keyword => {
        if (input.includes(keyword.toLowerCase())) {
          score += keyword.length;
        }
      });
      
      // Check if question contains the input
      if (faq.question.toLowerCase().includes(input)) {
        score += 10;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    });
    
    if (bestScore === 0) {
      return "I'm not sure about that specific question. Here are some common topics I can help with: room booking process, pricing, cancellation policies, payment methods, and room amenities. You can also contact our support team through the chat icon for personalized assistance.";
    }
    
    return bestMatch.answer;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: findBestAnswer(inputValue),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputValue('');
  };

  const handleQuickQuestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };
    
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: findBestAnswer(question),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage, botResponse]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'booking': return <Calendar className="h-3 w-3" />;
      case 'payment': return <CreditCard className="h-3 w-3" />;
      case 'policy': return <Shield className="h-3 w-3" />;
      default: return <HelpCircle className="h-3 w-3" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <span>Need Help?</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              AI Assistant
            </Badge>
            <MessageCircle 
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </div>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Quick Questions */}
          <div>
            <h4 className="text-sm font-medium mb-2">Quick Questions</h4>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Chat Messages */}
          <div>
            <h4 className="text-sm font-medium mb-2">Chat</h4>
            <ScrollArea className="h-64 border rounded-md p-3 bg-muted/20">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex gap-2 max-w-[80%] ${
                        message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Bot className="h-3 w-3" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg px-3 py-2 text-sm ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about bookings..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* FAQ Categories */}
          <div>
            <h4 className="text-sm font-medium mb-2">Browse by Category</h4>
            <div className="grid grid-cols-2 gap-2">
              {['booking', 'payment', 'policy', 'general'].map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => {
                    const categoryFAQ = faqs.find(faq => faq.category === category);
                    if (categoryFAQ) {
                      handleQuickQuestion(categoryFAQ.question);
                    }
                  }}
                >
                  {getCategoryIcon(category)}
                  <span className="ml-1 capitalize">{category}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}