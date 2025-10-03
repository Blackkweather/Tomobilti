import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { 
  Car, 
  Shield, 
  Clock, 
  MapPin, 
  Star, 
  Users, 
  CreditCard, 
  Phone, 
  Mail, 
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Crown,
  Award,
  Zap,
  Heart,
  TrendingUp,
  Lock,
  Globe,
  Calendar,
  DollarSign,
  UserCheck,
  Car as CarIcon,
  Building,
  Briefcase,
  Home,
  Plane,
  Train,
  Bus
} from 'lucide-react';

export default function Services() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('renters');

  const serviceCategories = [
    {
      id: 'renters',
      title: 'For Car Renters',
      icon: Car,
      description: 'Find and book the perfect car for your needs'
    },
    {
      id: 'owners',
      title: 'For Car Owners',
      icon: Building,
      description: 'Turn your idle car into a money-making asset'
    },
    {
      id: 'business',
      title: 'Business Solutions',
      icon: Briefcase,
      description: 'Corporate car rental and fleet management'
    }
  ];

  const renterServices = [
    {
      icon: MapPin,
      title: 'Convenient Locations',
      description: 'Pick up and drop off at airports, train stations, and city centers across the UK',
      features: ['Heathrow Airport', 'Gatwick Airport', 'Manchester Airport', 'City Centers', 'Train Stations']
    },
    {
      icon: Car,
      title: 'Diverse Fleet',
      description: 'Choose from economy cars to luxury vehicles for every occasion',
      features: ['Economy Cars', 'Family Cars', 'Luxury Vehicles', 'Electric Cars', 'Convertibles']
    },
    {
      icon: Shield,
      title: 'Comprehensive Insurance',
      description: 'Full coverage included with every rental for your peace of mind',
      features: ['Collision Damage Waiver', 'Theft Protection', 'Third Party Liability', 'Personal Accident Cover']
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer service and roadside assistance',
      features: ['Live Chat Support', 'Phone Support', 'Roadside Assistance', 'Emergency Help']
    },
    {
      icon: CreditCard,
      title: 'Flexible Payment',
      description: 'Multiple payment options and transparent pricing',
      features: ['Credit/Debit Cards', 'PayPal', 'Apple Pay', 'Google Pay', 'No Hidden Fees']
    },
    {
      icon: Star,
      title: 'Quality Guarantee',
      description: 'Verified vehicles and trusted owners for a safe experience',
      features: ['Vehicle Inspections', 'Owner Verification', 'Quality Standards', 'Satisfaction Guarantee']
    }
  ];

  const ownerServices = [
    {
      icon: DollarSign,
      title: 'Earn Passive Income',
      description: 'Generate revenue from your idle car with flexible scheduling',
      features: ['Set Your Own Rates', 'Flexible Availability', 'Keep 75-85% of Earnings', 'Monthly Payouts']
    },
    {
      icon: Shield,
      title: 'Comprehensive Protection',
      description: 'Full insurance coverage and damage protection for your vehicle',
      features: ['Comprehensive Insurance', 'Damage Protection', 'Theft Coverage', 'Liability Protection']
    },
    {
      icon: UserCheck,
      title: 'Verified Renters',
      description: 'Trusted community of verified drivers with background checks',
      features: ['Identity Verification', 'License Verification', 'Background Checks', 'Rating System']
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track your earnings and performance with detailed insights',
      features: ['Earnings Reports', 'Booking Analytics', 'Performance Metrics', 'Financial Tracking']
    },
    {
      icon: Calendar,
      title: 'Flexible Management',
      description: 'Complete control over your car\'s availability and bookings',
      features: ['Calendar Management', 'Instant Bookings', 'Booking Requests', 'Availability Control']
    },
    {
      icon: Award,
      title: 'Premium Support',
      description: 'Dedicated support team to help you maximize your earnings',
      features: ['Owner Support', 'Marketing Assistance', 'Technical Help', 'Best Practices']
    }
  ];

  const businessServices = [
    {
      icon: Building,
      title: 'Corporate Rentals',
      description: 'Flexible car rental solutions for businesses of all sizes',
      features: ['Monthly Contracts', 'Fleet Management', 'Corporate Rates', 'Dedicated Account Manager']
    },
    {
      icon: Briefcase,
      title: 'Business Travel',
      description: 'Reliable transportation for your business trips and meetings',
      features: ['Airport Pickups', 'City-to-City Travel', 'Meeting Transportation', 'Executive Cars']
    },
    {
      icon: Users,
      title: 'Team Events',
      description: 'Group transportation for corporate events and team building',
      features: ['Group Bookings', 'Event Transportation', 'Team Building', 'Conference Support']
    },
    {
      icon: Globe,
      title: 'Multi-City Coverage',
      description: 'Consistent service across major UK cities and airports',
      features: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Bristol']
    }
  ];

  const membershipTiers = [
    {
      name: 'Silver Membership',
      price: '£9.99',
      period: 'month',
      color: 'from-gray-500 to-gray-600',
      features: [
        '5% discount on all rentals',
        'Basic insurance included',
        'Standard customer support',
        'Access to standard vehicles'
      ],
      popular: false
    },
    {
      name: 'Gold Membership',
      price: '£19.99',
      period: 'month',
      color: 'from-yellow-500 to-yellow-600',
      features: [
        '20% discount on all rentals',
        'Priority access to premium vehicles',
        'Comprehensive insurance included',
        'Dedicated customer support',
        'Free cancellation up to 24h',
        'Double loyalty points'
      ],
      popular: true
    },
    {
      name: 'Black Elite',
      price: '£199',
      period: 'year',
      color: 'from-gray-800 to-gray-900',
      features: [
        '20% discount on ALL rentals',
        '15% discount on insurance',
        'Priority access to luxury cars',
        'Free upgrades when available',
        '5% cashback on all spending',
        'Exclusive member events',
        '£25 welcome credit'
      ],
      popular: false
    }
  ];


  const trustIndicators = [
    { icon: Shield, text: "Fully Insured", description: "Comprehensive coverage included" },
    { icon: Users, text: "Growing Community", description: "Trusted by our members" },
    { icon: Star, text: "High Quality", description: "Excellent customer satisfaction" },
    { icon: Lock, text: "Secure Payments", description: "Bank-level security" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              ShareWheelz Services
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Comprehensive car rental solutions for individuals and businesses across the United Kingdom
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/become-member">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  <Crown className="w-5 h-5 mr-2" />
                  Become a Member
                </Button>
              </Link>
              <Link href="/cars">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
                  <Car className="w-5 h-5 mr-2" />
                  Browse Cars
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{indicator.text}</h3>
                  <p className="text-sm text-gray-600">{indicator.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're looking to rent a car or earn from your vehicle, we have the perfect solution for you
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              {serviceCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2 py-4">
                    <Icon className="h-5 w-5" />
                    {category.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="renters" className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Everything You Need for Car Rental</h3>
                <p className="text-lg text-gray-600">From booking to return, we make car rental simple and affordable</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {renterServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:scale-105">
                      <CardContent className="p-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h4>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <ul className="space-y-2">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="owners" className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Turn Your Car Into a Money-Making Asset</h3>
                <p className="text-lg text-gray-600">Maximize your car's potential with our comprehensive owner services</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ownerServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:scale-105">
                      <CardContent className="p-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-8 w-8 text-green-600" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h4>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <ul className="space-y-2">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="business" className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Corporate Solutions</h3>
                <p className="text-lg text-gray-600">Professional car rental services for businesses and organizations</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {businessServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:scale-105">
                      <CardContent className="p-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-8 w-8 text-purple-600" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h4>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <ul className="space-y-2">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Membership
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Save more with our membership plans designed for frequent users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {membershipTiers.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-yellow-500 scale-105' : ''} hover:shadow-xl transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">£{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/become-member">
                    <Button className={`w-full mt-6 bg-gradient-to-r ${plan.color} hover:shadow-lg text-white`}>
                      Choose {plan.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience ShareWheelz?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join our growing community of satisfied customers who trust ShareWheelz for their car rental needs across the UK.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/become-member">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                <Crown className="w-5 h-5 mr-2" />
                Become a Member
              </Button>
            </Link>
            <Link href="/cars">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
                <Car className="w-5 h-5 mr-2" />
                Browse Cars
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


