import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
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
  Sparkles
} from 'lucide-react';
import { Link } from 'wouter';

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
  // Default configuration
  const defaultConfig = {
    currency: '£',
    platformName: 'ShareWheelz',
    membershipTiers: [
      {
        name: "Basic",
        price: "Free",
        description: "Essential features for getting started",
        features: [
          "Access to all vehicles",
          "Basic customer support",
          "Standard booking process",
          "Email notifications"
        ],
        color: "bg-gray-100 text-gray-800",
        popular: false
      },
      {
        name: "Premium",
        price: "£9.99/month",
        description: "Enhanced experience with exclusive benefits",
        features: [
          "Priority customer support",
          "Exclusive vehicle access",
          "Free cancellation up to 2 hours",
          "Earn loyalty points",
          "Special member discounts",
          "24/7 roadside assistance"
        ],
        color: "bg-blue-100 text-blue-800",
        popular: true
      },
      {
        name: "Elite",
        price: "£19.99/month",
        description: "Ultimate experience with maximum benefits",
        features: [
          "VIP customer support",
          "Access to luxury vehicles",
          "Free cancellation anytime",
          "Double loyalty points",
          "Maximum member discounts",
          "Personal concierge service",
          "Free delivery and pickup",
          "Exclusive member events"
        ],
        color: "bg-purple-100 text-purple-800",
        popular: false
      }
    ]
  };

  const finalConfig = { ...defaultConfig, ...config };
  const membershipTiers = finalConfig.membershipTiers;

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
      points: "10000+",
      benefits: ["Concierge service", "15% discount", "Exclusive access"],
      color: "bg-purple-100 text-purple-800"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "London",
      membership: "Elite",
      text: "The Elite membership has been amazing! The personal concierge service and exclusive vehicle access make every trip special.",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      location: "Manchester",
      membership: "Premium",
      text: "Premium membership is worth every penny. The priority support and discounts have saved me hundreds of pounds.",
      avatar: "MC"
    },
    {
      name: "Emma Williams",
      location: "Birmingham",
      membership: "Elite",
      text: "The exclusive member events and luxury vehicle access make me feel like a VIP. Highly recommended!",
      avatar: "EW"
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

        {/* Membership Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {membershipTiers.map((tier, index) => (
            <Card key={index} className={`shadow-lg ${tier.popular ? 'ring-2 ring-blue-500' : ''} relative`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mb-2">{tier.price}</div>
                <p className="text-gray-600">{tier.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                >
                  {tier.name === "Basic" ? "Current Plan" : "Upgrade Now"}
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
              <Link href="/loyalty-program">
                <Button variant="outline">
                  Learn More About Loyalty Program
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Member Testimonials */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-6 w-6 mr-2 text-red-600" />
              What Our Members Say
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                      <Badge className="mt-1 bg-purple-100 text-purple-800">
                        {testimonial.membership}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm italic">"{testimonial.text}"</p>
                </div>
              ))}
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
              Join thousands of satisfied members and enjoy exclusive benefits
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
    </div>
  );
}
