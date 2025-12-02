import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

import { 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Shield,
  Car,
  CreditCard,
  Phone,
  Mail
} from 'lucide-react';

export default function Terms() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: FileText },
    { id: 'definitions', title: 'Definitions', icon: Users },
    { id: 'user-accounts', title: 'User Accounts', icon: Users },
    { id: 'hosting', title: 'Hosting Services', icon: Car },
    { id: 'renting', title: 'Renting Services', icon: CreditCard },
    { id: 'payments', title: 'Payments & Fees', icon: CreditCard },
    { id: 'cancellations', title: 'Cancellations', icon: AlertTriangle },
    { id: 'liability', title: 'Liability & Insurance', icon: Shield },
    { id: 'prohibited', title: 'Prohibited Uses', icon: AlertTriangle },
    { id: 'termination', title: 'Termination', icon: AlertTriangle },
    { id: 'disputes', title: 'Disputes', icon: FileText },
    { id: 'changes', title: 'Changes to Terms', icon: Calendar }
  ];

  const lastUpdated = 'December 15, 2024';

  const overviewContent = {
    title: 'Terms of Service',
    lastUpdated,
    summary: 'These Terms of Service ("Terms") govern your use of Share Wheelz, our website, and mobile applications (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.',
    keyPoints: [
      'You must be at least 18 years old to use our Service',
      'You must provide accurate and complete information',
      'You are responsible for your account and all activities under it',
      'We may modify these Terms at any time',
      'Your continued use constitutes acceptance of any changes'
    ]
  };

  const definitions = [
    { term: 'Service', definition: 'The Share Wheelz platform, including our website, mobile applications, and all related services.' },
    { term: 'User', definition: 'Any person who accesses or uses our Service, including both hosts and renters.' },
    { term: 'Host', definition: 'A user who lists their vehicle for rent on our platform.' },
    { term: 'Renter', definition: 'A user who books and rents a vehicle through our platform.' },
    { term: 'Vehicle', definition: 'Any car, motorcycle, or other motorized vehicle listed on our platform.' },
    { term: 'Booking', definition: 'A confirmed reservation for a vehicle rental through our platform.' },
    { term: 'Content', definition: 'All information, data, text, software, music, sound, photographs, graphics, video, messages, or other materials.' }
  ];

  const userAccountRequirements = [
    'You must be at least 18 years old',
    'You must provide accurate and complete information',
    'You must maintain the security of your account',
    'You are responsible for all activities under your account',
    'You must notify us immediately of any unauthorized use',
    'You may not create multiple accounts',
    'You must comply with all applicable laws and regulations'
  ];

  const hostingRequirements = [
    'Vehicle must be legally owned or authorized for rental',
    'Vehicle must be in safe, roadworthy condition',
    'Valid insurance coverage is required',
    'Accurate vehicle descriptions and photos must be provided',
    'Host must be available for pickup/dropoff coordination',
    'Host must respond to inquiries within 24 hours',
    'Host must honor confirmed bookings'
  ];

  const rentingRequirements = [
    'Valid driving license required',
    'Minimum age requirements must be met',
    'Renter must treat vehicle with care and respect',
    'Renter must follow all traffic laws and regulations',
    'Renter must return vehicle in same condition',
    'Renter must report any issues immediately',
    'Renter must comply with host\'s reasonable requests'
  ];

  const paymentTerms = [
    'All payments are processed securely through our platform',
    'Payment is required at the time of booking confirmation',
    'Additional fees may apply for damages, cleaning, or violations',
    'Refunds are subject to our cancellation policy',
    'We may hold security deposits for certain bookings',
    'Currency conversion rates may apply for international users',
    'All prices are subject to applicable taxes and fees'
  ];

  const prohibitedUses = [
    'Using the Service for any illegal or unauthorized purpose',
    'Violating any laws or regulations in your jurisdiction',
    'Infringing on the rights of others',
    'Transmitting harmful or malicious code',
    'Attempting to gain unauthorized access to our systems',
    'Interfering with the proper functioning of the Service',
    'Using automated systems to access the Service without permission',
    'Harassing, threatening, or abusing other users',
    'Providing false or misleading information',
    'Circumventing our fees or payment systems'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Please read these terms carefully before using our platform. 
              By using Share Wheelz, you agree to be bound by these terms.
            </p>
            <div className="flex items-center justify-center gap-4 text-blue-200">
              <Calendar className="w-5 h-5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="py-8 bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'outline'}
                size="sm"
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

      {/* Content */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {activeSection === 'overview' && (
              <div className="space-y-8">
                <Card className="p-8">
                  <CardContent className="p-0">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      {overviewContent.title}
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                      {overviewContent.summary}
                    </p>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        Key Points
                      </h3>
                      <ul className="space-y-2">
                        {overviewContent.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-blue-800">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'definitions' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Definitions
                </h2>
                <div className="space-y-6">
                  {definitions.map((item, index) => (
                    <Card key={index} className="p-6">
                      <CardContent className="p-0">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {item.term}
                        </h3>
                        <p className="text-gray-600">
                          {item.definition}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'user-accounts' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  User Accounts
                </h2>
                <Card className="p-8">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Account Requirements
                    </h3>
                    <ul className="space-y-4">
                      {userAccountRequirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'hosting' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Hosting Services
                </h2>
                <Card className="p-8">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Host Requirements
                    </h3>
                    <ul className="space-y-4">
                      {hostingRequirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'renting' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Renting Services
                </h2>
                <Card className="p-8">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Renter Requirements
                    </h3>
                    <ul className="space-y-4">
                      {rentingRequirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'payments' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Payments & Fees
                </h2>
                <Card className="p-8">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Payment Terms
                    </h3>
                    <ul className="space-y-4">
                      {paymentTerms.map((term, index) => (
                        <li key={index} className="flex items-start">
                          <CreditCard className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{term}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'prohibited' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Prohibited Uses
                </h2>
                <Card className="p-8 bg-red-50 border-red-200">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold text-red-800 mb-6">
                      You may not use our Service for:
                    </h3>
                    <ul className="space-y-4">
                      {prohibitedUses.map((use, index) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-red-700">{use}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Add more sections as needed */}
            {['cancellations', 'liability', 'termination', 'disputes', 'changes'].includes(activeSection) && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {sections.find(s => s.id === activeSection)?.title}
                </h2>
                <Card className="p-8">
                  <CardContent className="p-0">
                    <p className="text-gray-600 leading-relaxed">
                      This section is currently being updated. Please check back soon for complete terms and conditions.
                      For immediate assistance, please contact our support team.
                    </p>
                    <div className="mt-6 flex gap-4">
                      <Button>
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Support
                      </Button>
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Us
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Questions About These Terms?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            If you have any questions about these Terms of Service, please contact our legal team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Phone className="w-5 h-5 mr-2" />
              Call +44 20 1234 5678
            </Button>
            <Button size="lg" variant="outline">
              <Mail className="w-5 h-5 mr-2" />
              Email Legal Team
            </Button>
          </div>
        </div>
      </div>

      {/* Footer is rendered globally in App */}
    </div>
  );
}
