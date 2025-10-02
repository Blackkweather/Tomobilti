import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  Bot, 
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Link } from 'wouter';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type?: 'text' | 'system';
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to ShareWheelz support. How can I help you today?',
      sender: 'agent',
      timestamp: new Date(),
      type: 'system'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentInfo, setAgentInfo] = useState({
    name: 'Sarah Johnson',
    status: 'online',
    rating: 4.9,
    responseTime: '< 1 min'
  });

  const quickReplies = [
    'How do I book a car?',
    'What are your cancellation policies?',
    'How do I become a host?',
    'I need help with my booking',
    'What insurance is included?',
    'How do I contact support?'
  ];

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAgentResponse(newMessage),
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAgentResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('book') || message.includes('rental')) {
      return 'To book a car, simply search for available vehicles on our platform, select your dates, choose your preferred car, and complete the booking process. You\'ll receive a confirmation email with all the details.';
    } else if (message.includes('cancel')) {
      return 'You can cancel your booking up to 24 hours before pickup for a full refund. Cancellations within 24 hours may incur a fee. You can cancel through your account dashboard or by contacting us.';
    } else if (message.includes('host')) {
      return 'To become a host, create an account, verify your identity, add your vehicle details, and complete our host verification process. It\'s completely free to list your vehicle!';
    } else if (message.includes('insurance')) {
      return 'All rentals include basic liability insurance. You can purchase additional coverage for comprehensive protection, collision damage waiver, and personal accident insurance.';
    } else if (message.includes('help') || message.includes('support')) {
      return 'I\'m here to help! You can also contact us via email at support@sharewheelz.uk or call us at 0800-SHAREWHEELZ. Our support team is available 24/7.';
    } else {
      return 'Thank you for your message. I understand you need assistance with that. Let me connect you with a specialist who can help you better. Is there anything specific I can help you with right now?';
    }
  };

  const handleQuickReply = (reply: string) => {
    setNewMessage(reply);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Live Chat Support</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant help from our support team. We're here 24/7 to assist you 
            with any questions or issues.
          </p>
        </div>

        {/* Chat Widget */}
        <div className="relative">
          {/* Chat Button */}
          {!isOpen && (
            <div className="fixed bottom-6 right-6 z-50">
              <Button
                onClick={() => setIsOpen(true)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <MessageCircle className="h-6 w-6 mr-2" />
                Start Chat
              </Button>
            </div>
          )}

          {/* Chat Window */}
          {isOpen && (
            <Card className="fixed bottom-6 right-6 w-96 h-[600px] z-50 shadow-2xl">
              <CardHeader className="bg-blue-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{agentInfo.name}</CardTitle>
                      <div className="flex items-center text-sm opacity-90">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        {agentInfo.status} • {agentInfo.responseTime}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-blue-700"
                  >
                    <Minimize2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0 h-[480px] flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Replies */}
                {messages.length === 1 && (
                  <div className="p-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Quick replies:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.slice(0, 3).map((reply, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs"
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Get instant help from our support team. Available 24/7 for immediate assistance.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Average response time: &lt; 1 minute</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Available 24/7</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Multilingual support</span>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => setIsOpen(true)}>
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-6 w-6 mr-2 text-green-600" />
                Phone Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Speak directly with our support team for complex issues or urgent matters.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <span>Mon-Fri: 8AM-8PM</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <span>Weekends: 9AM-6PM</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-green-600 mr-2" />
                  <span>0800-SHAREWHEELZ</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Call Now
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-6 w-6 mr-2 text-purple-600" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Send us a detailed message and we'll get back to you within 2 hours.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <span>Response time: &lt; 2 hours</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Detailed responses</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-purple-600 mr-2" />
                  <span>support@sharewheelz.uk</span>
                </div>
              </div>
              <Link href="/contact">
                <Button variant="outline" className="w-full mt-4">
                  Send Email
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Integration */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-6 w-6 mr-2 text-blue-600" />
              Common Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-left">
                  How do I book a car?
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left">
                  What are your cancellation policies?
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left">
                  How do I become a host?
                </Button>
              </div>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-left">
                  What insurance is included?
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left">
                  How do I modify my booking?
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left">
                  What if I have an issue?
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link href="/faq">
                <Button variant="outline">
                  View All FAQs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
            <p className="text-xl mb-8 opacity-90">
              Our support team is here to help you 24/7. Don't hesitate to reach out!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => setIsOpen(true)}>
                <MessageCircle className="h-5 w-5 mr-2" />
                Start Live Chat
              </Button>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}












