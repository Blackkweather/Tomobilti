import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Star, 
  Shield, 
  CreditCard, 
  Gift, 
  Users, 
  Car, 
  CheckCircle, 
  Crown,
  Sparkles,
  Heart,
  Award,
  TrendingUp,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  X,
  Lock,
  Calendar,
  User,
  PoundSterling,
  Target,
  Zap,
  Clock,
  MapPin,
  ThumbsUp,
  Star as StarIcon
} from 'lucide-react';

import { formatCurrency } from '../utils/currency';
import { useAuth } from '../contexts/AuthContext';

export default function BecomeMember() {
  const [selectedPlan, setSelectedPlan] = useState<'purple' | 'gold' | 'black'>('gold');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'confirm' | 'processing' | 'success' | 'failed'>('confirm');
  const [activeTab, setActiveTab] = useState<'owners' | 'renters'>('owners');
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Handle plan selection
  const handlePlanSelect = (planId: 'purple' | 'gold' | 'black') => {
    setSelectedPlan(planId);
  };

  // Handle membership signup
  const handleSignup = (planId: 'purple' | 'gold' | 'black') => {
    if (!user) {
      // Redirect to login if not authenticated
      setLocation('/login');
      return;
    }
    
    setSelectedPlan(planId);
    setShowPaymentModal(true);
    setPaymentStep('confirm');
  };

  // Handle payment processing
  const handleProcessPayment = async () => {
    setPaymentStep('processing');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      if (isSuccess) {
        setPaymentStep('success');
        // Redirect to home after 3 seconds
        setTimeout(() => {
          setLocation('/');
        }, 3000);
      } else {
        setPaymentStep('failed');
      }
    } catch (error) {
      setPaymentStep('failed');
    }
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setLocation('/');
  };

  // Handle payment failure retry
  const handlePaymentRetry = () => {
    setPaymentStep('confirm');
  };


  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setPaymentStep('confirm');
  };

  // Handle contact support
  const handleContactSupport = () => {
    // Show contact options
    const contactMethod = prompt(
      'How would you like to contact support?\n\n1. Email: admin@sharewheelz.uk\n2. Phone: +44 20 7946 0958\n3. Live Chat (coming soon)\n\nEnter 1, 2, or 3:'
    );
    
    if (contactMethod === '1') {
      window.open('mailto:admin@sharewheelz.uk?subject=Membership Inquiry', '_blank');
    } else if (contactMethod === '2') {
      window.open('tel:+442079460958', '_blank');
    } else if (contactMethod === '3') {
      alert('Live chat feature coming soon! Please use email or phone for now.');
    }
  };

  // Handle learn more
  const handleLearnMore = () => {
    // Scroll to benefits section
    const benefitsSection = document.getElementById('benefits-section');
    if (benefitsSection) {
      benefitsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const membershipBenefits = [
    {
      icon: CreditCard,
      title: 'ShareWheelz Digital Card',
      description: 'Digital membership card with exclusive benefits and discounts',
      color: 'text-mauve-600'
    },
    {
      icon: Gift,
      title: 'Loyalty Points',
      description: 'Earn points with every rental that can be redeemed for discounts',
      color: 'text-rose-600'
    },
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Priority verification and enhanced insurance coverage',
      color: 'text-bleu-600'
    },
    {
      icon: Crown,
      title: 'Premium Support',
      description: '24/7 dedicated customer support and priority assistance',
      color: 'text-mauve-600'
    },
    {
      icon: TrendingUp,
      title: 'Higher Earnings',
      description: 'Increased commission rates for car owners',
      color: 'text-rose-600'
    },
    {
      icon: Award,
      title: 'Exclusive Access',
      description: 'Early access to new features and premium vehicles',
      color: 'text-bleu-600'
    }
  ];

  // Enhanced benefits for owners and renters
  const ownerBenefits = [
    {
      icon: PoundSterling,
      title: 'Earn Passive Income',
      description: 'Turn your idle car into a money-making asset',
      highlight: 'Up to £500/month'
    },
    {
      icon: Shield,
      title: 'Discount on Insurance Package',
      description: 'Get discounts on comprehensive protection for your vehicle',
      highlight: 'Up to 20% off'
    },
    {
      icon: Users,
      title: 'Verified Renters Only',
      description: 'Trusted community of verified drivers',
      highlight: 'Background checked'
    },
    {
      icon: TrendingUp,
      title: 'Higher Commission Rates',
      description: 'Keep more of your earnings with premium membership',
      highlight: '85% vs 75%'
    },
    {
      icon: Clock,
      title: 'Flexible Availability',
      description: 'Set your own schedule and availability',
      highlight: '24/7 control'
    },
    {
      icon: Award,
      title: 'Priority Listing',
      description: 'Your cars appear first in search results',
      highlight: 'Top visibility'
    }
  ];

  const renterBenefits = [
    {
      icon: MapPin,
      title: 'Affordable Prices',
      description: 'Access to cars at competitive rates',
      highlight: 'Up to 15% off'
    },
    {
      icon: Car,
      title: 'Nearby Cars',
      description: 'Find vehicles close to your location',
      highlight: 'Within 5 miles'
    },
    {
      icon: MessageCircle,
      title: '24/7 Support',
      description: 'Round-the-clock customer assistance',
      highlight: 'Instant help'
    },
    {
      icon: Shield,
      title: 'Discount on Insurance Package',
      description: 'Get discounts on comprehensive coverage with every rental',
      highlight: 'Up to 15% off'
    },
    {
      icon: Gift,
      title: 'Loyalty Rewards',
      description: 'Earn points and redeem for discounts',
      highlight: '2x points'
    },
    {
      icon: Crown,
      title: 'Exclusive Access',
      description: 'Member-only vehicles and early bookings',
      highlight: 'Premium fleet'
    }
  ];


  // Our Quality Services cards
  const qualityServices = [
    {
      icon: Shield,
      title: "Insurance Discount",
      description: "Get discounts on comprehensive coverage with every rental",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: Phone,
      title: "Roadside Assistance & 24/7 Help",
      description: "Round-the-clock roadside assistance and emergency support",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Lock,
      title: "Secure Community",
      description: "Verified members and secure transactions",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: Award,
      title: "Premium Service",
      description: "Priority support and exclusive member benefits",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-mauve-50 via-white to-bleu-50">
      {/* User Status Banner */}
      {user && (
        <div className="bg-green-50 border-b border-green-200 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Welcome back, {user.firstName}!</span>
              <span className="text-sm">You're already logged in and ready to become a member.</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-blue-100">
        <div className="absolute inset-0 bg-gradient-to-r from-mauve-600/10 via-rose-600/10 to-bleu-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mauve-100 text-mauve-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Crown className="w-4 h-4" />
              Join ShareWheelz Membership
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Become a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                ShareWheelz Member
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Unlock exclusive benefits, earn loyalty points, and enjoy premium discounts with our ShareWheelz membership program across the UK.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-mauve-600 hover:bg-mauve-700 text-white px-8 py-3 text-lg"
                onClick={() => {
                  const plansSection = document.getElementById('plans-section');
                  if (plansSection) {
                    plansSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Crown className="w-5 h-5 mr-2" />
                Choose Your Plan
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-mauve-300 text-mauve-700 hover:bg-mauve-50 px-8 py-3 text-lg"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section with Tabs */}
      <section id="benefits-section" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose ShareWheelz Membership?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our growing community of satisfied members who are earning more and saving more with our exclusive benefits
            </p>
          </div>

          {/* Tabs for Owners vs Renters */}
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'owners' | 'renters')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-12 bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
                <TabsTrigger value="owners" className="text-lg py-4 px-8 flex items-center justify-center whitespace-nowrap">
                  <PoundSterling className="w-5 h-5 mr-3" />
                  For Car Owners
                </TabsTrigger>
                <TabsTrigger value="renters" className="text-lg py-4 px-8 flex items-center justify-center whitespace-nowrap">
                  <Car className="w-5 h-5 mr-3" />
                  For Renters
                </TabsTrigger>
              </TabsList>

              <TabsContent value="owners" className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Turn Your Car Into a Money-Making Machine</h3>
                  <p className="text-lg text-gray-600">Earn passive income while your car sits idle</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownerBenefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:scale-105">
                        <CardContent className="p-6 text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                          <p className="text-gray-600 mb-3 text-sm">{benefit.description}</p>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {benefit.highlight}
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="renters" className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Save Money & Enjoy Premium Service</h3>
                  <p className="text-lg text-gray-600">Get the best deals and exclusive access to premium vehicles</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renterBenefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:scale-105">
                        <CardContent className="p-6 text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                          <p className="text-gray-600 mb-3 text-sm">{benefit.description}</p>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {benefit.highlight}
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Enhanced Membership Plans */}
      <section id="plans-section" className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Perfect Plan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start your journey with ShareWheelz today. Cancel anytime, no hidden fees.
            </p>
          </div>
          

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {membershipPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative hover:shadow-2xl transition-all duration-500 cursor-pointer group flex flex-col ${
                    plan.popular ? 'ring-2 ring-yellow-500 scale-105 bg-gradient-to-br from-yellow-50 to-orange-50' : plan.bgColor
                  } ${selectedPlan === plan.id ? 'ring-4 ring-blue-500 shadow-2xl' : ''}`}
                  onClick={() => handlePlanSelect(plan.id as 'purple' | 'gold' | 'black')}
                >
                  {/* Plan Badges */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 text-sm font-semibold shadow-lg">
                        <Star className="w-4 h-4 mr-2" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  

                  
                  <CardHeader className="text-center pb-6 pt-8">
                    <div className="flex justify-center mb-4">
                      <div className="transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <div className={`bg-gradient-to-br ${plan.color} rounded-xl p-6 text-white w-80 h-48 flex flex-col justify-between shadow-2xl border border-white/20 relative overflow-hidden`}>
                          {/* Card Background Pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full"></div>
                            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full"></div>
                          </div>
                          
                          {/* Top Section */}
                          <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center gap-3">
                              <img 
                                src="/assets/MAIN LOGO.png" 
                                alt="ShareWheelz Logo" 
                                className="h-8 w-auto object-contain"
                              />
                              <div>
                                <h3 className="text-sm font-bold tracking-wide">SHAREWHEELZ</h3>
                                <p className="text-xs opacity-80 font-medium">DIGITAL MEMBERSHIP</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs opacity-80 font-medium tracking-wider">MEMBER</div>
                              <div className="text-xs opacity-80 font-medium tracking-wider">SINCE</div>
                              <div className="text-sm font-bold">2024</div>
                            </div>
                          </div>
                          
                          {/* Card Number Section */}
                          <div className="relative z-10">
                            <div className="text-xs opacity-80 mb-2 font-medium tracking-wider">MEMBER ID</div>
                            <div className="text-lg font-mono font-bold tracking-widest">SWZ-****-****-****</div>
                          </div>
                          
                          {/* Bottom Section */}
                          <div className="flex justify-between items-end relative z-10">
                            <div>
                              <div className="text-xs opacity-80 font-medium tracking-wider">VALID UNTIL</div>
                              <div className="text-sm font-bold">12/25</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs opacity-80 font-medium tracking-wider">STATUS</div>
                              <div className="text-sm font-bold">
                                {plan.id === 'gold' ? 'GOLD' : plan.id === 'black' ? 'BLACK ELITE' : 'PURPLE'}
                              </div>
                            </div>
                          </div>
                          
                          {/* Visa/Mastercard Style Elements */}
                          <div className="absolute bottom-4 right-4 opacity-20">
                            <div className="flex gap-2">
                              <div className="w-8 h-5 bg-white rounded-sm"></div>
                              <div className="w-8 h-5 bg-white rounded-sm"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardTitle className="text-lg font-semibold text-gray-700">{plan.subtitle}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-2">{plan.description}</CardDescription>
                    
                    {/* Pricing */}
                    <div className="mt-6">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold text-blue-600">
                          £{plan.monthlyPrice || plan.price}
                        </span>
                        <span className="text-gray-600 text-lg">/{plan.monthlyPeriod || plan.period}</span>
                      </div>
                      
                      {/* Yearly Pricing with Savings */}
                      {plan.yearlyPrice && (
                        <div className="mt-3 text-center">
                          <div className="text-sm text-gray-800">
                            Yearly Plan now £{plan.yearlyPrice} — save £{plan.yearlySavings} instantly from the regular £{plan.originalYearlyPrice} price
                          </div>
                        </div>
                      )}

                      {/* Monthly Price for Black Plan */}
                      {plan.monthlyPrice && (
                        <div className="mt-3 text-center">
                          <div className="text-sm text-gray-800 mb-2">
                            <span className="text-lg font-bold text-blue-600">£{plan.monthlyPrice}</span>
                            <span className="text-gray-600">/{plan.monthlyPeriod}</span> - Pay monthly with flexibility, or
                          </div>
                          <div className="text-sm text-gray-800">
                            <span className="text-lg font-bold text-green-600">£{plan.price}</span>
                            <span className="text-gray-600">/year</span> - Save £{plan.yearlySavings} annually 
                            <span className="block text-xs font-semibold text-yellow-600 mt-1">(best value!)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 px-6 pb-8 flex-grow">
                    {/* Host Features */}
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <PoundSterling className="h-4 w-4" />
                        For Hosts
                      </h4>
                      <ul className="space-y-3">
                        {plan.hostFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Renter Features */}
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        For Renters
                      </h4>
                      <ul className="space-y-3">
                        {plan.renterFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className={`w-full mt-auto py-4 text-lg font-semibold transition-all duration-300 bg-gradient-to-r ${plan.color} hover:shadow-xl text-white`}
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSignup(plan.id as 'purple' | 'gold' | 'black');
                      }}
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Choose {plan.name}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Our Quality Services */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Quality Services</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discount on insurance, assistance, and support included for a hassle-free experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {qualityServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card key={index} className={`group hover:shadow-lg transition-all duration-300 border-2 ${service.borderColor} ${service.bgColor} hover:scale-102`}>
                    <CardContent className="p-4 text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 ${service.bgColor} rounded-full mb-3 group-hover:scale-105 transition-transform duration-300`}>
                        <Icon className={`h-6 w-6 ${service.color}`} />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{service.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{service.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ShareWheelz Digital Card Preview */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-6">Your ShareWheelz Digital Card</h2>
                <p className="text-xl mb-8 opacity-90">
                  A premium digital membership card that unlocks exclusive benefits and demonstrates your trusted status in our community.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6" />
                    <span>Enhanced security verification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gift className="w-6 h-6" />
                    <span>Automatic discount application</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6" />
                    <span>Priority customer support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6" />
                    <span>Exclusive member rewards</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className={`bg-gradient-to-r ${selectedPlan === 'gold' ? 'from-yellow-500 to-orange-500' : selectedPlan === 'black' ? 'from-gray-800 to-black' : 'from-purple-500 to-purple-700'} rounded-xl p-5 text-white w-80 h-48 flex flex-col justify-between shadow-2xl relative overflow-hidden`}>
                    {/* Card Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full"></div>
                      <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Top Section */}
                    <div className="flex justify-between items-start relative z-10 mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src="/assets/MAIN LOGO.png" 
                          alt="ShareWheelz Logo" 
                          className="h-8 w-auto object-contain"
                        />
                        <div>
                          <h3 className="text-sm font-bold tracking-wide">SHAREWHEELZ</h3>
                          <p className="text-xs opacity-80 font-medium tracking-wider">DIGITAL MEMBERSHIP CARD</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-80 font-medium tracking-wider">MEMBER</div>
                        <div className="text-xs opacity-80 font-medium tracking-wider">SINCE</div>
                        <div className="text-sm font-bold">2024</div>
                      </div>
                    </div>
                    
                    {/* Card Number Section */}
                    <div className="relative z-10 mb-4">
                      <div className="text-xs opacity-80 mb-1 font-medium tracking-wider">MEMBER ID</div>
                      <div className="text-lg font-mono font-bold tracking-widest">SWZ-****-****-****</div>
                    </div>
                    
                    {/* Bottom Section */}
                    <div className="flex justify-between items-end relative z-10">
                      <div>
                        <div className="text-xs opacity-80 font-medium tracking-wider">VALID UNTIL</div>
                        <div className="text-sm font-bold">12/25</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-80 font-medium tracking-wider">STATUS</div>
                        <div className="text-sm font-bold">
                          {selectedPlan === 'gold' ? 'GOLD' : selectedPlan === 'black' ? 'BLACK ELITE' : 'PURPLE'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Visa/Mastercard Style Elements */}
                    <div className="absolute bottom-4 right-4 opacity-20">
                      <div className="flex gap-2">
                        <div className="w-8 h-5 bg-white rounded-sm"></div>
                        <div className="w-8 h-5 bg-white rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Car Sharing Experience?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Join our growing community of satisfied members who are earning more and saving more. Start your membership today and unlock exclusive benefits.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">Growing</div>
              <div className="text-white/80">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">Variable</div>
              <div className="text-white/80">Average Monthly Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">Significant</div>
              <div className="text-white/80">Average Savings</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => handleSignup(selectedPlan)}
            >
              <Crown className="w-5 h-5 mr-2" />
              Start Your Membership
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
              onClick={handleContactSupport}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
          </div>
          
          {/* Additional Benefits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Instant activation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer is rendered globally in App */}

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-xl sm:rounded-2xl max-w-xs sm:max-w-sm md:max-w-md w-full max-h-[90vh] sm:max-h-[85vh] md:max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {paymentStep === 'confirm' && (
              <>
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                  <h3 className="text-lg sm:text-xl font-semibold">Confirm Your Membership</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseModal}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Plan Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">
                        {selectedPlan === 'gold' ? 'Gold Member' : selectedPlan === 'black' ? 'Black Elite Member' : 'Purple Member'}
                      </h4>
                      <Crown className="h-5 w-5 text-mauve-600" />
                    </div>
                    <div className="text-2xl font-bold text-mauve-600">
                      {formatCurrency(selectedPlan === 'gold' ? 19.99 : selectedPlan === 'black' ? 169 : 9.99)}
                      <span className="text-sm text-gray-600 font-normal">/month</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedPlan === 'gold' 
                        ? 'Best value for frequent users' 
                        : selectedPlan === 'black'
                        ? 'Ultimate experience for power users'
                        : 'Perfect for trying out ShareWheelz'
                      }
                    </p>
                  </div>

                  {/* User Info */}
                  {user && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Member:</span>
                        <span className="font-medium">{user.firstName} {user.lastName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="font-medium">{user.email}</span>
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <h5 className="font-medium">Payment Method</h5>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Demo Payment</div>
                          <div className="text-sm text-gray-600">**** **** **** 1234</div>
                        </div>
                        <Lock className="h-4 w-4 text-green-500 ml-auto" />
                      </div>
                    </div>
                  </div>

                  {/* Billing Info */}
                  <div className="space-y-3">
                    <h5 className="font-medium">Billing Information</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Membership Fee:</span>
                        <span>{formatCurrency(selectedPlan === 'gold' ? 19.99 : selectedPlan === 'black' ? 169 : 9.99)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(selectedPlan === 'gold' ? 4.00 : selectedPlan === 'black' ? 33.80 : 2.00)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedPlan === 'gold' ? 23.99 : selectedPlan === 'black' ? 202.80 : 11.99)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="text-xs text-gray-500 space-y-2">
                    <p>
                      By confirming your membership, you agree to our Terms of Service and Privacy Policy. 
                      Your membership will automatically renew monthly unless cancelled.
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleCloseModal}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProcessPayment}
                      className="flex-1 bg-mauve-600 hover:bg-mauve-700"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Confirm Payment
                    </Button>
                  </div>
                </div>
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
                <p className="text-gray-600">Please wait while we process your membership...</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-600">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">
                  Your {selectedPlan === 'gold' ? 'Gold' : selectedPlan === 'black' ? 'Black Elite' : 'Purple'} membership is now active.
                </p>
                <p className="text-sm text-gray-500 mb-6">Redirecting to home page...</p>
                <Button
                  onClick={handlePaymentSuccess}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Go to Home
                </Button>
              </div>
            )}

            {paymentStep === 'failed' && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-red-600">Payment Failed</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't process your payment. Please try again or contact support.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handlePaymentRetry}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={handleCloseModal}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
