import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock,
  Star,
  Car,
  PoundSterling,
  Shield,
  Users,
  Settings,
  CreditCard,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { Link } from 'wouter';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  popular?: boolean;
}

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const faqItems: FAQItem[] = [
    // Booking & Rental
    {
      id: 'how-to-book',
      question: 'How do I book a car?',
      answer: 'Booking a car is easy! Search for available vehicles, select your dates, choose your car, and complete the booking process. You\'ll receive a confirmation email with all the details.',
      category: 'booking',
      popular: true
    },
    {
      id: 'booking-requirements',
      question: 'What are the requirements to book a car?',
      answer: 'You must be at least 21 years old, have a valid driving license, and provide a valid credit card. Some vehicles may have additional age requirements.',
      category: 'booking'
    },
    {
      id: 'cancellation-policy',
      question: 'What is your cancellation policy?',
      answer: 'You can cancel your booking up to 24 hours before pickup for a full refund. Cancellations within 24 hours may incur a fee. Check your booking confirmation for specific terms.',
      category: 'booking',
      popular: true
    },
    {
      id: 'modify-booking',
      question: 'Can I modify my booking?',
      answer: 'Yes, you can modify your booking through your account dashboard or by contacting customer support. Changes may affect pricing and availability.',
      category: 'booking'
    },

    // Payment & Pricing
    {
      id: 'payment-methods',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and digital wallets like Apple Pay and Google Pay.',
      category: 'payment'
    },
    {
      id: 'pricing-breakdown',
      question: 'What is included in the rental price?',
      answer: 'The rental price includes the vehicle, basic insurance, and roadside assistance. Additional fees may apply for extras like GPS, child seats, or additional drivers.',
      category: 'payment',
      popular: true
    },
    {
      id: 'security-deposit',
      question: 'Is a security deposit required?',
      answer: 'Yes, a security deposit is required and will be held on your card. The amount varies by vehicle type and will be released after the rental if no damage is found.',
      category: 'payment'
    },
    {
      id: 'refund-process',
      question: 'How long does it take to process refunds?',
      answer: 'Refunds are typically processed within 3-5 business days, but may take up to 10 business days depending on your bank\'s processing time.',
      category: 'payment'
    },

    // Vehicle & Safety
    {
      id: 'vehicle-condition',
      question: 'What if the vehicle has issues?',
      answer: 'If you encounter any issues with your rental vehicle, contact us immediately. We\'ll arrange for a replacement vehicle or provide roadside assistance.',
      category: 'vehicle'
    },
    {
      id: 'insurance-coverage',
      question: 'What insurance coverage is included?',
      answer: 'All rentals include basic liability insurance. You can purchase additional coverage for comprehensive protection, collision damage waiver, and personal accident insurance.',
      category: 'vehicle',
      popular: true
    },
    {
      id: 'fuel-policy',
      question: 'What is your fuel policy?',
      answer: 'Most rentals require you to return the vehicle with the same fuel level as when you picked it up. Some vehicles may have a "full-to-full" policy.',
      category: 'vehicle'
    },
    {
      id: 'additional-drivers',
      question: 'Can I add additional drivers?',
      answer: 'Yes, you can add additional drivers for a small fee. All additional drivers must meet the same requirements as the primary renter.',
      category: 'vehicle'
    },

    // Host & Owner
    {
      id: 'become-host',
      question: 'How do I become a host?',
      answer: 'To become a host, create an account, verify your identity, add your vehicle details, and complete our host verification process. It\'s free to list your vehicle!',
      category: 'host',
      popular: true
    },
    {
      id: 'host-earnings',
      question: 'How much can I earn as a host?',
      answer: 'Earnings vary based on your vehicle, location, and availability. Use our earnings calculator to estimate your potential monthly income.',
      category: 'host'
    },
    {
      id: 'host-protection',
      question: 'What protection do hosts have?',
      answer: 'Hosts are protected by our comprehensive insurance coverage, damage protection, and 24/7 support. We also provide background checks for all renters.',
      category: 'host'
    },
    {
      id: 'vehicle-requirements',
      question: 'What are the vehicle requirements for hosts?',
      answer: 'Vehicles must be less than 10 years old, have valid insurance and registration, pass our safety inspection, and be in good working condition.',
      category: 'host'
    },

    // Account & Support
    {
      id: 'create-account',
      question: 'How do I create an account?',
      answer: 'Click "Sign Up" on our homepage, provide your basic information, verify your email address, and complete your profile. It takes just a few minutes!',
      category: 'account'
    },
    {
      id: 'forgot-password',
      question: 'I forgot my password. How do I reset it?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions in the email we send you.',
      category: 'account'
    },
    {
      id: 'contact-support',
      question: 'How can I contact customer support?',
      answer: 'You can contact us via live chat, email, or phone. Our support team is available 24/7 to help with any questions or issues.',
      category: 'support',
      popular: true
    },
    {
      id: 'report-issue',
      question: 'How do I report a problem?',
      answer: 'You can report issues through your account dashboard, contact customer support, or use our mobile app. We take all reports seriously and respond quickly.',
      category: 'support'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'booking', name: 'Booking & Rental', icon: Calendar },
    { id: 'payment', name: 'Payment & Pricing', icon: CreditCard },
    { id: 'vehicle', name: 'Vehicle & Safety', icon: Car },
    { id: 'host', name: 'Host & Owner', icon: Users },
    { id: 'account', name: 'Account & Support', icon: Settings }
  ];

  const filteredItems = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const popularItems = faqItems.filter(item => item.popular);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about renting cars, becoming a host, 
            and using our platform.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center"
            >
              <category.icon className="h-4 w-4 mr-2" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Popular Questions */}
        {selectedCategory === 'all' && (
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-6 w-6 mr-2 text-yellow-600" />
                Popular Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularItems.map((item) => (
                  <div key={item.id} className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                    <p className="text-sm text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="shadow-lg">
              <CardHeader>
                <CardTitle 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <span className="text-left">{item.question}</span>
                  <div className="flex items-center">
                    {item.popular && (
                      <Badge className="bg-yellow-100 text-yellow-800 mr-2">
                        Popular
                      </Badge>
                    )}
                    {expandedItems.has(item.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              {expandedItems.has(item.id) && (
                <CardContent>
                  <p className="text-gray-700">{item.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any questions matching your search. Try different keywords or browse our categories.
              </p>
              <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Contact Support */}
        <Card className="shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-12">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl mb-8 opacity-90">
              Can't find what you're looking for? Our support team is here to help!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center">
                <MessageCircle className="h-8 w-8 mr-3" />
                <div>
                  <div className="font-semibold">Live Chat</div>
                  <div className="text-sm opacity-90">Available 24/7</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Phone className="h-8 w-8 mr-3" />
                <div>
                  <div className="font-semibold">Phone Support</div>
                  <div className="text-sm opacity-90">0800-SHAREWHEELZ</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Mail className="h-8 w-8 mr-3" />
                <div>
                  <div className="font-semibold">Email Support</div>
                  <div className="text-sm opacity-90">support@sharewheelz.uk</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/live-chat">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Start Live Chat
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}













