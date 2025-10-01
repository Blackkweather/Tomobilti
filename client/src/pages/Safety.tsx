import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Phone, 
  Mail, 
  Clock,
  Car,
  User,
  Camera,
  FileText,
  Star,
  Award,
  Lock,
  Eye,
  Heart
} from 'lucide-react';

export default function Safety() {
  const [activeTab, setActiveTab] = useState('overview');

  const safetyFeatures = [
    {
      icon: Shield,
      title: 'Comprehensive Insurance',
      description: 'All bookings include comprehensive insurance coverage with 24/7 claims support'
    },
    {
      icon: User,
      title: 'Verified Users',
      description: 'All users go through identity verification and background checks'
    },
    {
      icon: Camera,
      title: 'Photo Verification',
      description: 'Vehicle condition is documented with photos before and after each rental'
    },
    {
      icon: Phone,
      title: '24/7 Emergency Support',
      description: 'Round-the-clock support for any safety concerns or emergencies'
    },
    {
      icon: FileText,
      title: 'Safety Guidelines',
      description: 'Clear safety protocols and guidelines for all users'
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: 'All payments are processed through secure, encrypted channels'
    }
  ];

  const safetyStats = [
    { value: '99.9%', label: 'Safety Record' },
    { value: '24/7', label: 'Emergency Support' },
    { value: '£1M+', label: 'Insurance Coverage' },
    { value: '100%', label: 'Verified Users' }
  ];

  const safetyTips = [
    {
      category: 'Before Renting',
      tips: [
        'Check vehicle photos and condition report',
        'Verify owner credentials and reviews',
        'Read rental terms and insurance coverage',
        'Plan your route and check weather conditions'
      ]
    },
    {
      category: 'During Rental',
      tips: [
        'Inspect vehicle before driving away',
        'Follow all traffic laws and speed limits',
        'Keep emergency contact numbers handy',
        'Report any issues immediately'
      ]
    },
    {
      category: 'After Rental',
      tips: [
        'Return vehicle in same condition',
        'Take photos of any new damage',
        'Complete post-rental checklist',
        'Leave honest feedback for others'
      ]
    }
  ];

  const emergencyContacts = [
    {
      type: 'Emergency Support',
      number: '+44 20 1234 5678',
      description: '24/7 emergency assistance',
      icon: Phone
    },
    {
      type: 'Insurance Claims',
      number: '+44 20 1234 5679',
      description: 'Insurance and claims support',
      icon: FileText
    },
    {
      type: 'Safety Hotline',
      number: '+44 20 1234 5680',
      description: 'Report safety concerns',
      icon: AlertTriangle
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Safety Center
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Your safety is our top priority. Learn about our comprehensive safety measures 
              and how we protect every user on our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Report Safety Issue
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Emergency: +44 20 1234 5678
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Stats */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {safetyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Features */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Safety Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Multiple layers of protection to ensure your safety and peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Safety Guidelines
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow these guidelines to ensure a safe and secure rental experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {safetyTips.map((section, index) => (
              <Card key={index} className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {section.category}
                  </h3>
                  <ul className="space-y-4">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Emergency Contacts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Save these numbers for immediate assistance when you need it most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <contact.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {contact.type}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mb-3">
                    {contact.number}
                  </p>
                  <p className="text-gray-600">
                    {contact.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Trust & Verification */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Our comprehensive safety measures have earned the trust of users across the UK.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Platform</h3>
                <p className="text-blue-100">Fully licensed and regulated car rental platform</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">4.9★ Rating</h3>
                <p className="text-blue-100">Highly rated by our community of users</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community First</h3>
                <p className="text-blue-100">Built by the community, for the community</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
