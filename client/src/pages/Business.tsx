import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Footer from '../components/Footer';
import { 
  Building2, 
  Users, 
  BarChart3, 
  Shield, 
  Clock, 
  Star, 
  CheckCircle,
  ArrowRight,
  TrendingUp,
  PoundSterling,
  Car,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Award,
  Zap
} from 'lucide-react';

export default function Business() {
  const [selectedSolution, setSelectedSolution] = useState('corporate');

  const solutions = [
    {
      id: 'corporate',
      title: 'Corporate Travel',
      description: 'Streamlined car rental for business travel',
      icon: Building2,
      features: [
        'Centralized booking system',
        'Expense management integration',
        'Priority customer support',
        'Detailed reporting & analytics'
      ]
    },
    {
      id: 'events',
      title: 'Event Transportation',
      description: 'Reliable transportation for corporate events',
      icon: Calendar,
      features: [
        'Bulk vehicle reservations',
        'Event coordination support',
        'Flexible scheduling',
        'Professional drivers'
      ]
    },
    {
      id: 'logistics',
      title: 'Logistics Solutions',
      description: 'Fleet management for delivery and logistics',
      icon: Car,
      features: [
        'Fleet optimization',
        'Route planning',
        'Real-time tracking',
        'Maintenance scheduling'
      ]
    }
  ];

  const benefits = [
    {
      icon: PoundSterling,
      title: 'Cost Savings',
      description: 'Reduce travel costs by up to 40% with our corporate rates'
    },
    {
      icon: Clock,
      title: 'Time Efficiency',
      description: 'Streamlined booking process saves your team valuable time'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Comprehensive insurance and safety protocols'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Detailed insights into your travel patterns and costs'
    }
  ];

  const stats = [
    { value: 'Multiple', label: 'Corporate Clients' },
    { value: 'Significant', label: 'Cost Savings' },
    { value: '99.5%', label: 'Uptime' },
    { value: 'High★', label: 'Client Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Business
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                Solutions
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Tailored car rental solutions for businesses of all sizes. 
              Streamline your corporate travel and transportation needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Business Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the solution that best fits your business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <Card 
                key={solution.id} 
                className={`p-8 cursor-pointer transition-all duration-300 ${
                  selectedSolution === solution.id 
                    ? 'ring-2 ring-blue-500 shadow-xl' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedSolution(solution.id)}
              >
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <solution.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {solution.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {solution.description}
                  </p>
                  <ul className="space-y-3 text-left">
                    {solution.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Business Solutions?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive solutions designed specifically for business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Enterprise-Grade Features
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our platform is built to handle the complex needs of modern businesses.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Advanced Analytics
                    </h3>
                    <p className="text-gray-600">
                      Comprehensive reporting and analytics to track usage, costs, and trends.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      API Integration
                    </h3>
                    <p className="text-gray-600">
                      Seamlessly integrate with your existing business systems and workflows.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Dedicated Support
                    </h3>
                    <p className="text-gray-600">
                      Priority support with dedicated account managers for enterprise clients.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 mb-6">
                  Contact our business team to discuss your specific needs and get a custom quote.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Contact Business Team
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Transform Your Business Travel
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses already using our platform to streamline their transportation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Phone className="mr-2 h-5 w-5" />
              Call +44 20 1234 5678
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
