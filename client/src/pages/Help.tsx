import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight,
  BookOpen,
  Shield,
  Car,
  CreditCard,
  User,
  Settings,
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react';

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', icon: User },
    { id: 'booking', name: 'Booking & Reservations', icon: Car },
    { id: 'payments', name: 'Payments & Billing', icon: CreditCard },
    { id: 'safety', name: 'Safety & Security', icon: Shield },
    { id: 'account', name: 'Account & Settings', icon: Settings }
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I create an account?',
      answer: 'Creating an account is easy! Click the "Sign Up" button in the top right corner, fill in your details, verify your email, and you\'re ready to start renting cars.'
    },
    {
      category: 'getting-started',
      question: 'What documents do I need to rent a car?',
      answer: 'You need a valid driving license, proof of identity (passport or ID card), and a valid payment method. Some cars may require additional documentation.'
    },
    {
      category: 'booking',
      question: 'How far in advance can I book a car?',
      answer: 'You can book cars up to 12 months in advance. We recommend booking early for popular vehicles and peak travel periods.'
    },
    {
      category: 'booking',
      question: 'Can I modify or cancel my booking?',
      answer: 'Yes! You can modify or cancel your booking up to 24 hours before pickup. Check the specific cancellation policy for your booking.'
    },
    {
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, PayPal, Apple Pay, and Google Pay. Some hosts may have additional payment options.'
    },
    {
      category: 'payments',
      question: 'When will I be charged?',
      answer: 'You\'ll be charged when you confirm your booking. A security deposit may be held separately and released after your rental period.'
    },
    {
      category: 'safety',
      question: 'Is insurance included?',
      answer: 'Yes, all bookings include basic insurance coverage. You can also purchase additional coverage for extra protection.'
    },
    {
      category: 'safety',
      question: 'How do you verify car owners?',
      answer: 'All car owners go through a comprehensive verification process including identity verification, background checks, and vehicle inspections.'
    },
    {
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Go to your profile settings, click "Edit Profile", make your changes, and save. Some changes may require verification.'
    },
    {
      category: 'account',
      question: 'How do I change my password?',
      answer: 'In your account settings, go to "Security" and click "Change Password". You\'ll need to enter your current password first.'
    }
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: '24/7',
      action: 'Start Chat'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      availability: 'Mon-Fri 9AM-6PM',
      action: 'Call +44 20 1234 5678'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: '24/7',
      action: 'Send Email'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    selectedCategory === 'all' || faq.category === selectedCategory
  ).filter(faq =>
    searchQuery === '' || 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Help Center
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Find answers to common questions and get the support you need.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <Card key={index} className="p-6">
                    <CardContent className="p-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or browse by category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our support team is here to help you with any questions or issues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <method.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {method.description}
                  </p>
                  <Badge variant="secondary" className="mb-6">
                    <Clock className="w-3 h-3 mr-1" />
                    {method.availability}
                  </Badge>
                  <Button className="w-full">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Articles */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Articles
            </h2>
            <p className="text-xl text-gray-600">
              Most viewed help articles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'How to Book Your First Car',
                description: 'Step-by-step guide to making your first booking',
                views: '2.5k views',
                category: 'Getting Started'
              },
              {
                title: 'Understanding Insurance Coverage',
                description: 'Everything you need to know about car rental insurance',
                views: '1.8k views',
                category: 'Safety'
              },
              {
                title: 'Payment Methods Explained',
                description: 'Learn about accepted payment methods and billing',
                views: '1.2k views',
                category: 'Payments'
              },
              {
                title: 'Cancellation and Refund Policy',
                description: 'When and how you can cancel your booking',
                views: '980 views',
                category: 'Booking'
              },
              {
                title: 'Host Verification Process',
                description: 'How we ensure all car owners are verified',
                views: '750 views',
                category: 'Safety'
              },
              {
                title: 'Managing Your Account',
                description: 'Update profile, change password, and more',
                views: '650 views',
                category: 'Account'
              }
            ].map((article, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-sm text-gray-500">{article.views}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {article.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    Read More
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer is rendered globally in App */}
    </div>
  );
}
