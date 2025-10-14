import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Users, 
  Shield, 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Star,
  MessageCircle,
  Car,
  Clock,
  FileText,
  Phone,
  Mail
} from 'lucide-react';

export default function Guidelines() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Users },
    { id: 'hosting', title: 'Hosting Guidelines', icon: Car },
    { id: 'renting', title: 'Renting Guidelines', icon: Heart },
    { id: 'communication', title: 'Communication', icon: MessageCircle },
    { id: 'safety', title: 'Safety & Security', icon: Shield },
    { id: 'reporting', title: 'Reporting Issues', icon: AlertTriangle }
  ];

  const hostingGuidelines = [
    {
      title: 'Vehicle Requirements',
      items: [
        'Vehicle must be in excellent working condition',
        'All safety features must be functional',
        'Vehicle must be clean and well-maintained',
        'Valid insurance and registration required'
      ]
    },
    {
      title: 'Host Responsibilities',
      items: [
        'Respond to inquiries within 24 hours',
        'Provide accurate vehicle descriptions',
        'Maintain vehicle cleanliness and safety',
        'Be available for pickup/dropoff coordination'
      ]
    },
    {
      title: 'Pricing & Availability',
      items: [
        'Set fair and competitive pricing',
        'Update availability calendar regularly',
        'Honor confirmed bookings',
        'Provide clear cancellation policies'
      ]
    }
  ];

  const rentingGuidelines = [
    {
      title: 'Booking Requirements',
      items: [
        'Valid driving license required',
        'Minimum age requirements must be met',
        'Complete profile verification',
        'Provide accurate personal information'
      ]
    },
    {
      title: 'Rental Behavior',
      items: [
        'Treat vehicles with respect and care',
        'Follow all traffic laws and regulations',
        'Return vehicle in same condition',
        'Report any issues immediately'
      ]
    },
    {
      title: 'Communication',
      items: [
        'Communicate clearly with hosts',
        'Ask questions before booking',
        'Provide honest feedback',
        'Respect host\'s time and property'
      ]
    }
  ];

  const communicationRules = [
    {
      title: 'Respectful Communication',
      description: 'Always communicate respectfully and professionally with other users.',
      examples: [
        'Use polite language in all messages',
        'Avoid offensive or discriminatory language',
        'Be patient and understanding',
        'Resolve conflicts amicably'
      ]
    },
    {
      title: 'Accurate Information',
      description: 'Provide honest and accurate information in all communications.',
      examples: [
        'Describe vehicle condition truthfully',
        'Share accurate pickup/dropoff times',
        'Be transparent about any issues',
        'Update information when circumstances change'
      ]
    },
    {
      title: 'Privacy Protection',
      description: 'Respect the privacy of other users and protect personal information.',
      examples: [
        'Don\'t share personal contact information',
        'Use the platform for all communications',
        'Respect photo and profile privacy',
        'Report privacy violations immediately'
      ]
    }
  ];

  const safetyGuidelines = [
    {
      icon: Shield,
      title: 'Vehicle Safety',
      description: 'Ensure all vehicles meet safety standards and are properly maintained.'
    },
    {
      icon: Users,
      title: 'User Verification',
      description: 'All users must complete identity verification and background checks.'
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Procedures',
      description: 'Know how to report emergencies and access 24/7 support.'
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Keep all rental documentation and photos for your records.'
    }
  ];

  const prohibitedBehaviors = [
    'Discrimination based on race, gender, religion, or other protected characteristics',
    'Harassment, threats, or abusive language',
    'Fraudulent listings or false information',
    'Using the platform for illegal activities',
    'Sharing personal contact information outside the platform',
    'Manipulating reviews or ratings',
    'Failing to honor confirmed bookings',
    'Damaging vehicles intentionally'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Community Guidelines
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Our community guidelines help ensure a safe, respectful, and enjoyable 
              experience for all users on Share Wheelz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Report Violation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'outline'}
                onClick={() => setActiveSection(section.id)}
                className="flex items-center gap-2"
              >
                <section.icon className="w-4 h-4" />
                {section.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          {activeSection === 'overview' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                Community Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card className="p-8">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <Heart className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Our Values
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        Respect for all community members
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        Honest and transparent communication
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        Safety and security for everyone
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        Mutual trust and responsibility
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="p-8">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Community Impact
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-blue-600">Growing</div>
                        <div className="text-gray-600">Active Users</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-green-600">High★</div>
                        <div className="text-gray-600">Customer Satisfaction</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                      Important Notice
                    </h3>
                    <p className="text-yellow-700">
                      These guidelines are designed to create a positive experience for everyone. 
                      Violations may result in account restrictions or permanent removal from the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'hosting' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                Hosting Guidelines
              </h2>
              <div className="space-y-8">
                {hostingGuidelines.map((section, index) => (
                  <Card key={index} className="p-8">
                    <CardContent className="p-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        {section.title}
                      </h3>
                      <ul className="space-y-4">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'renting' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                Renting Guidelines
              </h2>
              <div className="space-y-8">
                {rentingGuidelines.map((section, index) => (
                  <Card key={index} className="p-8">
                    <CardContent className="p-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        {section.title}
                      </h3>
                      <ul className="space-y-4">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'communication' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                Communication Guidelines
              </h2>
              <div className="space-y-8">
                {communicationRules.map((rule, index) => (
                  <Card key={index} className="p-8">
                    <CardContent className="p-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {rule.title}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {rule.description}
                      </p>
                      <ul className="space-y-3">
                        {rule.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex} className="flex items-start">
                            <Star className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'safety' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                Safety & Security
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {safetyGuidelines.map((guideline, index) => (
                  <Card key={index} className="p-8 text-center">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <guideline.icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {guideline.title}
                      </h3>
                      <p className="text-gray-600">
                        {guideline.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="p-8 bg-red-50 border-red-200">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-red-800 mb-6">
                    Prohibited Behaviors
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prohibitedBehaviors.map((behavior, index) => (
                      <div key={index} className="flex items-start">
                        <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-red-700">{behavior}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'reporting' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                Reporting Issues
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                      <AlertTriangle className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      How to Report
                    </h3>
                    <ul className="space-y-4 text-gray-600">
                      <li>Use the "Report" button on any listing or message</li>
                      <li>Contact our support team directly</li>
                      <li>Provide detailed information about the issue</li>
                      <li>Include screenshots or evidence when possible</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="p-8">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      What Happens Next
                    </h3>
                    <ul className="space-y-4 text-gray-600">
                      <li>We review all reports within 24 hours</li>
                      <li>We investigate thoroughly and fairly</li>
                      <li>We take appropriate action if needed</li>
                      <li>We keep you updated on the process</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Need Immediate Help?
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Call +44 20 1234 5678
                  </Button>
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer is rendered globally in App */}
    </div>
  );
}
