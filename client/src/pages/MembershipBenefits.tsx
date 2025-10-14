import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

import { useAuth } from '../contexts/AuthContext';
import { 
  Crown, 
  Star, 
  Shield, 
  Zap, 
  Gift, 
  Users, 
  Car, 
  PoundSterling,
  CheckCircle,
  ArrowRight,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ThumbsUp,
  Heart,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface MembershipBenefitsProps {
  config?: {
    membershipTiers?: Array<{
      name: string;
      price: string;
      description: string;
      features: string[];
      color: string;
      popular: boolean;
    }>;
    currency?: string;
    platformName?: string;
  };
}

export default function MembershipBenefits(props: any) {
  const { config = {} } = props as MembershipBenefitsProps;
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Handle membership plan selection with auth check
  const handleMembershipClick = (planName: string) => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    setLocation('/become-member');
  };

  // Handle loyalty program click with auth check
  const handleLoyaltyClick = () => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    setLocation('/loyalty-program');
  };
  
  // Same membership plans as BecomeMember page
  const membershipPlans = [
    {
      id: 'purple',
      name: 'Purple Plan',
      subtitle: 'Starter Boost',
      description: 'Perfect for trying out ShareWheelz with real savings',
      price: 9.99,
      period: 'month',
      yearlyPrice: 100,
      yearlyPeriod: 'year',
      originalYearlyPrice: 120,
      yearlySavings: 20,
      hostFeatures: [
        '+10% boost in search visibility',
        '"Starter Member" badge (increases renter trust)'
      ],
      renterFeatures: [
        '5% discount on all rentals',
        '5% discount on insurance fees per booking',
        'Earn 1 loyalty point per £1 spent',
        'Access to weekend-only deals'
      ],
      popular: false,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'gold',
      name: 'Gold Plan',
      subtitle: 'Smart Driver',
      description: 'Best value for frequent users – more bookings for hosts, real savings for renters',
      price: 19.99,
      period: 'month',
      yearlyPrice: 180,
      yearlyPeriod: 'year',
      originalYearlyPrice: 240,
      yearlySavings: 60,
      hostFeatures: [
        '5% lower commission on each booking (higher net earnings)',
        '"Gold Verified Host" badge + premium placement in listings'
      ],
      renterFeatures: [
        '15% discount on all rentals',
        '10% discount on insurance fees',
        '1 free rental day after 5 booked days',
        'Priority customer support',
        'Double loyalty points (2 per £1 spent)',
        'Free cancellation up to 24h before trip'
      ],
      popular: true,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'black',
      name: 'Black Plan',
      subtitle: 'Elite Mobility',
      description: 'For serious car owners and frequent renters who want maximum benefits and premium experience',
      price: 199,
      period: 'year',
      monthlyPrice: 40,
      monthlyPeriod: 'month',
      yearlySavings: 281,
      hostFeatures: [
        '10% lower commission = more money in your pocket',
        '"Black Elite Host" badge = instant trust & credibility',
        'Premium placement = more bookings for your car',
        'Priority support = problems solved faster'
      ],
      renterFeatures: [
        '20% discount on ALL rentals = save on every trip',
        '15% discount on insurance = cheaper protection',
        'Priority access to luxury cars = drive the best',
        'Free upgrades when available = get more for less',
        '5% cashback on all spending = money back in your account',
        'Exclusive member events = network with other members',
        '£25 welcome credit = start saving immediately'
      ],
      popular: false,
      color: 'from-gray-800 to-gray-900',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Enhanced Protection",
      description: "Comprehensive insurance and safety features",
      details: [
        "Extended insurance coverage",
        "24/7 roadside assistance",
        "Damage protection",
        "Emergency support"
      ]
    },
    {
      icon: PoundSterling,
      title: "Exclusive Savings",
      description: "Save money on every rental",
      details: [
        "Member-only discounts",
        "Seasonal promotions",
        "Loyalty point rewards",
        "Referral bonuses"
      ]
    },
    {
      icon: Zap,
      title: "Priority Service",
      description: "Get faster service and better support",
      details: [
        "Priority booking confirmation",
        "Faster customer support",
        "Exclusive vehicle access",
        "Personal account manager"
      ]
    },
    {
      icon: Gift,
      title: "Exclusive Perks",
      description: "Special benefits just for members",
      details: [
        "Free upgrades when available",
        "Welcome gifts",
        "Birthday rewards",
        "Member-only events"
      ]
    }
  ];

  const loyaltyProgram = [
    {
      level: "Bronze",
      points: "0-999",
      benefits: ["Basic member benefits", "Email support", "Standard booking"],
      color: "bg-orange-100 text-orange-800"
    },
    {
      level: "Silver",
      points: "1000-4999",
      benefits: ["Priority support", "5% discount", "Free cancellation"],
      color: "bg-gray-100 text-gray-800"
    },
    {
      level: "Gold",
      points: "5000-9999",
      benefits: ["VIP support", "10% discount", "Free upgrades"],
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      level: "Platinum",
      points: "High",
      benefits: ["Concierge service", "15% discount", "Exclusive access"],
      color: "bg-purple-100 text-purple-800"
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Membership Benefits</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock exclusive benefits and enjoy a premium car rental experience. 
            Choose the membership level that's right for you.
          </p>
        </div>

        {/* Membership Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {membershipPlans.map((plan, index) => (
            <Card key={index} className={`shadow-lg ${plan.popular ? 'ring-2 ring-yellow-500 scale-105 bg-gradient-to-br from-yellow-50 to-orange-50' : plan.bgColor} relative`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="text-sm text-gray-600 mb-2">{plan.subtitle}</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  £{plan.price}/{plan.period}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              <CardContent>
                {/* Host Features */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Car className="h-4 w-4 mr-2 text-blue-600" />
                    For Car Owners
                  </h4>
                  <ul className="space-y-2">
                    {plan.hostFeatures.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Renter Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-green-600" />
                    For Renters
                  </h4>
                  <ul className="space-y-2">
                    {plan.renterFeatures.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  onClick={() => handleMembershipClick(plan.name)}
                  className={`w-full ${plan.popular ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                >
                  {isAuthenticated ? `Choose ${plan.name}` : 'Login to Choose'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Overview */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-600" />
              Membership Benefits Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center">
                    <benefit.icon className="h-8 w-8 text-purple-600 mr-4" />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-12">
                    {benefit.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Program */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-6 w-6 mr-2 text-orange-600" />
              Loyalty Program
            </CardTitle>
            <p className="text-gray-600">
              Earn points with every rental and unlock exclusive benefits
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {loyaltyProgram.map((level, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold mb-4 ${level.color}`}>
                    {level.level}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{level.points} points</div>
                  <ul className="space-y-2 text-sm">
                    {level.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Earn 1 point for every £1 spent on rentals
              </p>
              <Button 
                variant="outline"
                onClick={handleLoyaltyClick}
              >
                {isAuthenticated ? 'Apply to Loyalty Program' : 'Login to Apply'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>


        {/* Support Options */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-600" />
              Member Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-4">Get instant help from our support team</p>
                <Link href="/live-chat">
                  <Button variant="outline">Start Chat</Button>
                </Link>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-sm text-gray-600 mb-4">Speak directly with our team</p>
                <Button variant="outline">Call Now</Button>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-4">Send us a detailed message</p>
                <Link href="/contact">
                  <Button variant="outline">Send Email</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="shadow-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Upgrade?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join our growing community of satisfied members and enjoy exclusive benefits
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/become-member">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Crown className="h-5 w-5 mr-2" />
                  Become a Member
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Learn More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer is rendered globally in App */}
    </div>
  );
}
