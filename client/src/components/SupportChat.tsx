import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Clock, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How do I book a car?",
    answer: "Simply search for cars in your area, select your dates, and click 'Book Now'. You'll be guided through the payment process."
  },
  {
    question: "What if I need to cancel my booking?",
    answer: "You can cancel your booking up to 24 hours before pickup for a full refund. Cancellations within 24 hours may incur a fee."
  },
  {
    question: "How do I become a car owner?",
    answer: "Click 'Add Car' in your profile to list your vehicle. We'll guide you through the verification process."
  },
  {
    question: "What insurance coverage is included?",
    answer: "All bookings include comprehensive insurance coverage. Additional coverage options are available during booking."
  },
  {
    question: "How do I contact the car owner?",
    answer: "You can message the car owner directly through our platform after confirming your booking."
  }
];

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showFAQ, setShowFAQ] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputText;
    setInputText('');
    setShowFAQ(false);
    setIsTyping(true);

    try {
      // Call ChatGPT API
      const response = await fetch('/api/chatgpt/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          context: 'ShareWheelz car rental platform support'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('ChatGPT API error:', error);
      // Fallback to static response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Hi there! I'm Alanna from ShareWheelz Support. Thank you for your message! Our support team will respond within 5 minutes. In the meantime, here are some frequently asked questions that might help:",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setShowFAQ(true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFAQClick = (faq: FAQItem) => {
    const faqMessage: Message = {
      id: Date.now().toString(),
      text: `Q: ${faq.question}\n\nA: ${faq.answer}`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, faqMessage]);
    setShowFAQ(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Support Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 h-[500px] flex flex-col max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] animate-in slide-in-from-bottom-4 duration-300">
          <Card className="w-full h-full flex flex-col shadow-2xl border-2 border-blue-200 rounded-lg bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-lg">Customer Support</CardTitle>
                  <p className="text-xs text-gray-500">Alanna is online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Online now
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500">
                    <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">A</span>
                    </div>
                    <p className="font-medium text-gray-700">Hi! I'm Alanna from ShareWheelz Support</p>
                    <p className="text-sm">How can I help you today?</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-end space-x-2`}
                  >
                    {!message.isUser && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">A</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 break-words ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start items-end space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">A</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                {showFAQ && messages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Quick answers:</p>
                    {faqItems.slice(0, 3).map((faq, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => handleFAQClick(faq)}
                      >
                        <HelpCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">{faq.question}</span>
                      </Button>
                    ))}
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input Area */}
              <div className="border-t p-4 flex-shrink-0 bg-white">
                <div className="flex space-x-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Our team typically responds within 5 minutes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
