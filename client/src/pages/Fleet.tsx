import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Car, 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  Clock, 
  Star, 
  CheckCircle,
  ArrowRight,
  TrendingUp,
  PoundSterling,
  MapPin,
  Calendar,
  Wrench,
  Phone,
  Mail
} from 'lucide-react';

export default function Fleet() {
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const features = [
    {
      icon: Car,
      title: 'Fleet Management',
      description: 'Manage your entire fleet from one dashboard'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Detailed insights into your fleet performance'
    },
    {
      icon: Users,
      title: 'Driver Management',
      description: 'Track and manage all your drivers'
    },
    {
      icon: Settings,
      title: 'Maintenance Tracking',
      description: 'Schedule and track vehicle maintenance'
    },
    {
      icon: Shield,
      title: 'Insurance Management',
      description: 'Comprehensive insurance coverage'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock fleet support'
    }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Basic Fleet',
      price: '£99',
      period: '/month',
      description: 'Perfect for small fleets',
      features: [
        'Up to 10 vehicles',
        'Basic analytics',
        'Email support',
        'Standard insurance'
      ]
    },
    {
      id: 'professional',
      name: 'Professional Fleet',
      price: '£299',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        'Up to 50 vehicles',
        'Advanced analytics',
        'Priority support',
        'Enhanced insurance',
        'Maintenance tracking'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Fleet',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: [
        'Unlimited vehicles',
        'Custom analytics',
        'Dedicated support',
        'Full insurance coverage',
        'API access',
        'Custom integrations'
      ]
    }
  ];

  const stats = [
    { icon: Car, value: 'Multiple', label: 'Fleet Vehicles' },
    { icon: Users, value: 'Growing', label: 'Fleet Partners' },
    { icon: TrendingUp, value: 'Significant', label: 'Cost Reduction' },
    { icon: Star, value: 'High★', label: 'Customer Rating' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Fleet Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                Solutions
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Streamline your fleet operations with our comprehensive management platform. 
              Track, maintain, and optimize your vehicles for maximum efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Start Free Trial
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
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Fleet
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to efficiently manage your vehicle fleet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
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

      {/* Pricing Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Fleet Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Flexible pricing options to fit fleets of all sizes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`p-8 relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-0 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Optimize Your Fleet?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using our fleet management platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Phone className="mr-2 h-5 w-5" />
              Call +44 20 1234 5678
            </Button>
          </div>
        </div>
      </div>

      {/* Footer is rendered globally in App */}
    </div>
  );
}
