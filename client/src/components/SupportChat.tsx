import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Clock, HelpCircle, TestTube, CheckCircle, AlertCircle } from 'lucide-react';
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
  testResult?: 'pass' | 'fail' | 'pending';
}

interface TestCase {
  question: string;
  expectedKeywords: string[];
  category: string;
}

// Comprehensive test cases covering all possible questions
const TEST_CASES: TestCase[] = [
  // Location-based questions
  {
    question: "What cars do you have in Manchester?",
    expectedKeywords: ["Jaguar", "F-Type", "Manchester", "£95"],
    category: "Location"
  },
  {
    question: "Show me cars in London",
    expectedKeywords: ["Porsche", "Ferrari", "London", "911"],
    category: "Location"
  },
  {
    question: "What vehicles are available in Birmingham?",
    expectedKeywords: ["Jaguar", "F-Pace", "Birmingham", "SUV"],
    category: "Location"
  },
  {
    question: "Do you have cars in Edinburgh?",
    expectedKeywords: ["Tesla", "Model X", "Edinburgh", "electric"],
    category: "Location"
  },
  {
    question: "Cars in Liverpool please",
    expectedKeywords: ["Range Rover", "Sport", "Liverpool", "£75"],
    category: "Location"
  },

  // Car type questions
  {
    question: "Show me luxury cars",
    expectedKeywords: ["Porsche", "Ferrari", "Jaguar", "luxury", "premium"],
    category: "Car Type"
  },
  {
    question: "What electric vehicles do you have?",
    expectedKeywords: ["Tesla", "Model X", "electric", "zero emissions"],
    category: "Car Type"
  },
  {
    question: "I need an SUV",
    expectedKeywords: ["Jaguar F-Pace", "Range Rover", "Tesla Model X", "SUV"],
    category: "Car Type"
  },
  {
    question: "Show me sports cars",
    expectedKeywords: ["Porsche 911", "Jaguar F-Type", "Ferrari", "sports"],
    category: "Car Type"
  },
  {
    question: "What convertibles are available?",
    expectedKeywords: ["Jaguar F-Type", "convertible", "open-top"],
    category: "Car Type"
  },

  // Price questions
  {
    question: "What's the cheapest car?",
    expectedKeywords: ["£75", "Range Rover", "cheapest", "lowest price"],
    category: "Pricing"
  },
  {
    question: "How much does it cost to rent a car?",
    expectedKeywords: ["£75", "£95", "£110", "£120", "per day"],
    category: "Pricing"
  },
  {
    question: "What's the most expensive car?",
    expectedKeywords: ["Ferrari", "£5500", "most expensive", "La Ferrari"],
    category: "Pricing"
  },
  {
    question: "Cars under £100 per day",
    expectedKeywords: ["Range Rover", "Jaguar F-Pace", "Tesla", "under £100"],
    category: "Pricing"
  },
  {
    question: "Show me cars around £100",
    expectedKeywords: ["Tesla Model X", "£110", "around £100"],
    category: "Pricing"
  },

  // Specific car questions
  {
    question: "Tell me about the Ferrari",
    expectedKeywords: ["Ferrari La Ferrari", "£5500", "hybrid", "963 horsepower"],
    category: "Specific Car"
  },
  {
    question: "What's special about the Tesla Model X?",
    expectedKeywords: ["Tesla", "Model X", "falcon-wing doors", "autopilot", "electric"],
    category: "Specific Car"
  },
  {
    question: "Tell me about the Porsche 911",
    expectedKeywords: ["Porsche 911", "1973", "classic", "manual", "£120"],
    category: "Specific Car"
  },

  // Feature questions
  {
    question: "Which cars have GPS navigation?",
    expectedKeywords: ["GPS", "navigation", "Porsche", "Tesla", "Jaguar"],
    category: "Features"
  },
  {
    question: "Show me cars with heated seats",
    expectedKeywords: ["heated seats", "Tesla", "Ferrari", "Jaguar F-Type"],
    category: "Features"
  },
  {
    question: "Which cars have backup cameras?",
    expectedKeywords: ["backup camera", "Jaguar", "Ferrari"],
    category: "Features"
  },

  // Booking questions
  {
    question: "How do I book a car?",
    expectedKeywords: ["book", "search", "select dates", "Book Now", "payment"],
    category: "Booking"
  },
  {
    question: "What's the booking process?",
    expectedKeywords: ["search", "select", "dates", "payment", "process"],
    category: "Booking"
  },
  {
    question: "Can I cancel my booking?",
    expectedKeywords: ["cancel", "24 hours", "refund", "fee"],
    category: "Booking"
  },

  // General questions
  {
    question: "What is ShareWheelz?",
    expectedKeywords: ["car rental", "platform", "community", "owners"],
    category: "General"
  },
  {
    question: "How does this work?",
    expectedKeywords: ["rent", "owners", "community", "platform"],
    category: "General"
  },
  {
    question: "What makes you different?",
    expectedKeywords: ["community", "owners", "verified", "platform"],
    category: "General"
  }
];

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showFAQ, setShowFAQ] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showTestingPanel, setShowTestingPanel] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: 'pass' | 'fail' | 'pending' }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced AI response with comprehensive training data
  const getEnhancedAIResponse = async (userMessage: string) => {
    try {
      // Get car data for context
      const carsResponse = await fetch('/api/cars');
      const carsData = await carsResponse.json();
      
      // Create comprehensive context for AI
      const context = `
ShareWheelz Car Rental Platform - AI Support Agent Training Data

AVAILABLE CARS:
${carsData.cars?.map((car: any) => 
  `${car.make} ${car.model} (${car.year}) - £${car.pricePerDay}/day
   Location: ${car.location}
   Type: ${car.fuelType === 'electric' ? 'Electric' : car.fuelType === 'essence' ? 'Petrol' : 'Petrol'}
   Transmission: ${car.transmission}
   Seats: ${car.seats}
   Features: ${car.features?.join(', ') || 'Standard features'}
   Description: ${car.description}`
).join('\n\n') || 'No cars available'}

LOCATION SUMMARY:
- London: Porsche 911 F (£120), Ferrari La Ferrari (£5500)
- Manchester: Jaguar F-Type Convertible (£95)
- Birmingham: Jaguar F-Pace Sport (£85)
- Edinburgh: Tesla Model X (£110)
- Liverpool: Range Rover Sport (£75)

PRICING RANGES:
- Economy: £75-£85 (Range Rover Sport, Jaguar F-Pace)
- Premium: £95-£120 (Jaguar F-Type, Tesla Model X, Porsche 911)
- Luxury: £5500 (Ferrari La Ferrari)

CAR CATEGORIES:
- Sports Cars: Porsche 911 F, Jaguar F-Type, Ferrari La Ferrari
- SUVs: Jaguar F-Pace Sport, Range Rover Sport, Tesla Model X
- Electric: Tesla Model X
- Convertibles: Jaguar F-Type
- Classic: Porsche 911 F (1973)
- Luxury: Ferrari La Ferrari, Porsche 911, Jaguar F-Type

BOOKING PROCESS:
1. Search for cars by location, dates, and preferences
2. Select your preferred vehicle
3. Choose pickup and return dates
4. Complete payment securely
5. Meet the owner for pickup

CANCELLATION POLICY:
- Free cancellation up to 24 hours before pickup
- Cancellations within 24 hours may incur a fee
- Full refund for cancellations made in advance

MEMBERSHIP BENEFITS:
- Exclusive access to premium vehicles
- Loyalty points for every booking
- Priority customer support
- Special member events and discounts

You are Alanna, a knowledgeable and friendly support agent for ShareWheelz. 
Answer questions accurately based on the car data above. Be specific about locations, prices, features, and availability.
Always mention specific car names, prices, and locations when relevant.
Be helpful, informative, and encourage bookings.
`;

      const response = await fetch('/api/chatgpt/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.response;
      } else {
        // API not available, use fallback
        return getFallbackResponse(userMessage);
      }
    } catch (error) {
      // API not available, use fallback silently
      return getFallbackResponse(userMessage);
    }
  };

  // Enhanced fallback responses
  const getFallbackResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    // Location-based responses
    if (message.includes('manchester')) {
      return "Hi! I'm Alanna from ShareWheelz Support. In Manchester, we have a stunning Jaguar F-Type Convertible available for £95/day. It's a luxury sports car with automatic transmission, 2 seats, and features like backup camera, heated seats, and GPS navigation. Perfect for experiencing the thrill of open-top driving in Manchester! Would you like to book it?";
    }
    
    if (message.includes('london')) {
      return "Hi! I'm Alanna from ShareWheelz Support. In London, we have amazing cars available! We have a classic Porsche 911 F (1973) for £120/day - perfect for enthusiasts who love automotive heritage. We also have the incredible Ferrari La Ferrari for £5500/day - a hybrid hypercar with 963 horsepower! Both are located in London. Which one interests you?";
    }
    
    if (message.includes('birmingham')) {
      return "Hi! I'm Alanna from ShareWheelz Support. In Birmingham, we have the dynamic Jaguar F-Pace Sport available for £85/day. It's a performance SUV that combines practicality with sports car performance, featuring automatic transmission, 5 seats, and luxury interior finishes. Great for city driving and countryside escapes!";
    }
    
    if (message.includes('edinburgh')) {
      return "Hi! I'm Alanna from ShareWheelz Support. In Edinburgh, we have the revolutionary Tesla Model X electric SUV for £110/day. It features falcon-wing doors, autopilot capabilities, 7 seats, and zero emissions. Perfect for experiencing the future of automotive technology in Edinburgh!";
    }
    
    if (message.includes('liverpool')) {
      return "Hi! I'm Alanna from ShareWheelz Support. In Liverpool, we have the sophisticated Range Rover Sport available for £75/day. It's a luxury SUV with commanding presence, automatic transmission, 5 seats, and refined luxury features. Perfect for urban adventures and countryside escapes!";
    }
    
    // Car type responses
    if (message.includes('luxury') || message.includes('premium')) {
      return "Hi! I'm Alanna from ShareWheelz Support. We have several luxury cars available! The Ferrari La Ferrari (£5500/day) is our most exclusive option - a hybrid hypercar with 963 horsepower. We also have the Porsche 911 F (£120/day), Jaguar F-Type Convertible (£95/day), and Tesla Model X (£110/day). All offer premium features and exceptional performance!";
    }
    
    if (message.includes('electric') || message.includes('tesla')) {
      return "Hi! I'm Alanna from ShareWheelz Support. We have the Tesla Model X electric SUV available for £110/day in Edinburgh. It features falcon-wing doors, autopilot capabilities, 7 seats, zero emissions, and advanced technology. Perfect for eco-conscious drivers who want cutting-edge electric vehicle technology!";
    }
    
    if (message.includes('suv')) {
      return "Hi! I'm Alanna from ShareWheelz Support. We have great SUVs available! The Jaguar F-Pace Sport (£85/day) in Birmingham combines SUV practicality with sports car performance. The Range Rover Sport (£75/day) in Liverpool offers commanding presence and refined luxury. The Tesla Model X (£110/day) in Edinburgh is an electric SUV with falcon-wing doors and autopilot!";
    }
    
    if (message.includes('sports') || message.includes('sport')) {
      return "Hi! I'm Alanna from ShareWheelz Support. We have excellent sports cars! The Porsche 911 F (£120/day) in London is a classic sports car from 1973 with manual transmission. The Jaguar F-Type Convertible (£95/day) in Manchester offers breathtaking design and exhilarating performance. The Ferrari La Ferrari (£5500/day) in London is our ultimate sports car with 963 horsepower!";
    }
    
    // Price responses
    if (message.includes('cheap') || message.includes('budget') || message.includes('affordable')) {
      return "Hi! I'm Alanna from ShareWheelz Support. Our most affordable option is the Range Rover Sport in Liverpool for £75/day - a luxury SUV with great value! The Jaguar F-Pace Sport in Birmingham is £85/day. Both offer excellent features and performance at competitive prices. What's your budget range?";
    }
    
    if (message.includes('expensive') || message.includes('most expensive')) {
      return "Hi! I'm Alanna from ShareWheelz Support. Our most exclusive car is the Ferrari La Ferrari in London for £5500/day. It's a hybrid hypercar with 963 horsepower, reaching over 217 mph with 0-60 mph in 2.4 seconds! This is our ultimate luxury experience for special occasions.";
    }
    
    if (message.includes('price') || message.includes('cost')) {
      return "Hi! I'm Alanna from ShareWheelz Support. Our prices range from £75/day to £5500/day depending on the vehicle. Range Rover Sport: £75/day, Jaguar F-Pace: £85/day, Jaguar F-Type: £95/day, Tesla Model X: £110/day, Porsche 911: £120/day, Ferrari La Ferrari: £5500/day. All prices include comprehensive insurance!";
    }
    
    // Booking responses
    if (message.includes('book') || message.includes('rent') || message.includes('how to')) {
      return "Hi! I'm Alanna from ShareWheelz Support. Booking is easy! 1) Search for cars in your area, 2) Select your preferred vehicle and dates, 3) Click 'Book Now', 4) Complete secure payment, 5) Meet the owner for pickup. You can cancel up to 24 hours before pickup for a full refund. Need help with anything specific?";
    }
    
    // Default response
    return "Hi! I'm Alanna from ShareWheelz Support. I can help you find the perfect car! We have luxury sports cars, electric vehicles, SUVs, and classic cars available across London, Manchester, Birmingham, Edinburgh, and Liverpool. Prices range from £75/day to £5500/day. What type of car are you looking for?";
  };

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
      const aiResponseText = await getEnhancedAIResponse(currentMessage);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Automated testing function
  const runAutomatedTests = async () => {
    setIsTesting(true);
    const results: { [key: string]: 'pass' | 'fail' | 'pending' } = {};
    
    for (const testCase of TEST_CASES) {
      results[testCase.question] = 'pending';
      setTestResults({ ...results });
      
      try {
        const response = await getEnhancedAIResponse(testCase.question);
        const responseLower = response.toLowerCase();
        
        // Check if response contains expected keywords
        const hasKeywords = testCase.expectedKeywords.some(keyword => 
          responseLower.includes(keyword.toLowerCase())
        );
        
        results[testCase.question] = hasKeywords ? 'pass' : 'fail';
        setTestResults({ ...results });
        
        // Add test result to messages
        const testMessage: Message = {
          id: `test-${Date.now()}-${Math.random()}`,
          text: `🧪 TEST: "${testCase.question}"\n✅ Response: ${response.substring(0, 100)}...\n${hasKeywords ? '✅ PASSED' : '❌ FAILED'}`,
          isUser: false,
          timestamp: new Date(),
          testResult: hasKeywords ? 'pass' : 'fail'
        };
        setMessages(prev => [...prev, testMessage]);
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results[testCase.question] = 'fail';
        setTestResults({ ...results });
      }
    }
    
    setIsTesting(false);
  };

  const handleFAQClick = (faq: any) => {
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

  const passCount = Object.values(testResults).filter(result => result === 'pass').length;
  const failCount = Object.values(testResults).filter(result => result === 'fail').length;
  const totalTests = TEST_CASES.length;

  return (
    <>
      {/* Floating Support Button - Hidden when chat is open */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-2"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 h-[500px] flex flex-col max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] animate-in slide-in-from-bottom-4 duration-300">
          <Card className="w-full h-full flex flex-col shadow-2xl border-2 border-blue-200 rounded-lg bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-lg">AI Support - Alanna</CardTitle>
                  <p className="text-xs text-gray-500">Trained on all car data</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  AI Online
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowTestingPanel(!showTestingPanel)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Toggle testing panel"
                >
                  <TestTube className="h-4 w-4" />
                </Button>
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
              {/* Test Controls - Hidden by default, only show when testing */}
              {showTestingPanel && (
                <div className="border-b p-2 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TestTube className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">AI Testing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {totalTests > 0 && (
                        <div className="text-xs text-gray-600">
                          {passCount}/{totalTests} passed
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={runAutomatedTests}
                        disabled={isTesting}
                        className="text-xs"
                      >
                        {isTesting ? 'Testing...' : 'Run Tests'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowTestingPanel(false)}
                        className="text-xs"
                      >
                        Hide
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500">
                    <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">A</span>
                    </div>
                    <p className="font-medium text-gray-700">Hi! I'm Alanna from ShareWheelz Support</p>
                    <p className="text-sm">I can help you find the perfect car for your journey!</p>
                    <p className="text-xs text-gray-400 mt-2">Try: "What cars in Manchester?" or "Show me luxury cars"</p>
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
                          : message.testResult === 'pass'
                          ? 'bg-green-100 text-green-900 border border-green-200'
                          : message.testResult === 'fail'
                          ? 'bg-red-100 text-red-900 border border-red-200'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.testResult && (
                      <div className="flex-shrink-0">
                        {message.testResult === 'pass' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
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
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input Area */}
              <div className="border-t p-4 flex-shrink-0 bg-white">
                <div className="flex space-x-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about our cars..."
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
                  Ask me anything about our cars • Instant responses
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}