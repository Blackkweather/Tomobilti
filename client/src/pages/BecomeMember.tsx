import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
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
  User
} from 'lucide-react';
import Footer from '../components/Footer';
import { formatCurrency } from '../utils/currency';
import { useAuth } from '../contexts/AuthContext';

export default function BecomeMember() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('premium');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Handle plan selection
  const handlePlanSelect = (planId: 'basic' | 'premium') => {
    setSelectedPlan(planId);
  };

  // Handle membership signup
  const handleSignup = (planId: 'basic' | 'premium') => {
    if (!user) {
      // Redirect to login if not authenticated
      setLocation('/login');
      return;
    }
    
    setSelectedPlan(planId);
    setShowPaymentModal(true);
    setPaymentStep('confirm');
  };

  // Handle payment confirmation
  const handlePaymentConfirm = () => {
    setPaymentStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep('success');
    }, 2000);
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setPaymentStep('confirm');
    // Redirect to dashboard after successful payment
    setLocation('/dashboard');
  };

  // Close payment modal
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

  const membershipPlans = [
    {
      id: 'basic',
      name: 'Basic Member',
      price: 9.99,
      period: 'month',
      description: 'Perfect for occasional renters',
      features: [
        '5% discount on all rentals',
        'Basic loyalty points (1 point per £1)',
        'Standard customer support',
        'Basic verification',
        'Access to member-only vehicles'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Member',
      price: 19.99,
      period: 'month',
      description: 'Best value for frequent users',
      features: [
        '15% discount on all rentals',
        'Enhanced loyalty points (2 points per £1)',
        'Priority customer support',
        'Enhanced verification & insurance',
        'Access to luxury vehicles',
        'Free cancellation up to 24h',
        'Exclusive member events'
      ],
      popular: true
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
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-mauve-600/10 via-rose-600/10 to-bleu-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-mauve-100 text-mauve-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Crown className="w-4 h-4" />
              Join ShareWheelz Membership
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Become a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-mauve-600 to-bleu-600">
                Valued Member
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Unlock exclusive benefits, earn loyalty points, and enjoy premium discounts with our ShareWheelz membership program.
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

      {/* Benefits Section */}
      <section id="benefits-section" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Membership Benefits</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enjoy exclusive perks designed to enhance your car sharing experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {membershipBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-${benefit.color.split('-')[1]}-100 to-${benefit.color.split('-')[1]}-200 flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${benefit.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section id="plans-section" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Membership</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the plan that best fits your car sharing needs
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {membershipPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    plan.popular ? 'ring-2 ring-mauve-500 scale-105' : ''
                  } ${selectedPlan === plan.id ? 'ring-2 ring-mauve-500' : ''}`}
                  onClick={() => handlePlanSelect(plan.id as 'basic' | 'premium')}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-mauve-600 text-white px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  {selectedPlan === plan.id && (
                    <div className="absolute -top-4 right-4">
                      <Badge className="bg-green-600 text-white px-3 py-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Selected
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-mauve-600">
                        {formatCurrency(plan.price)}
                      </span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full mt-6 ${
                        plan.popular 
                          ? 'bg-mauve-600 hover:bg-mauve-700 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSignup(plan.id as 'basic' | 'premium');
                      }}
                    >
                      {plan.popular ? (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Get Premium Access
                        </>
                      ) : (
                        'Choose Basic Plan'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ShareWheelz Digital Card Preview */}
      <section className="py-20 bg-gradient-to-r from-mauve-600 to-bleu-600">
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
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-gradient-to-r from-mauve-600 to-bleu-600 rounded-xl p-6 text-white">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-lg font-semibold">ShareWheelz</h3>
                        <p className="text-sm opacity-80">Digital Membership Card</p>
                      </div>
                      <Crown className="w-8 h-8" />
                    </div>
                    
                    <div className="mb-6">
                      <div className="bg-white/20 rounded-lg p-4">
                        <div className="text-xs opacity-80 mb-2">Member ID</div>
                        <div className="text-lg font-mono">SWZ-****-****-****</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs opacity-80">Valid Until</div>
                        <div className="text-sm">12/25</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-80">Status</div>
                        <div className="text-sm font-semibold">Premium</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Members Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied members</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "Premium Member",
                content: "The ShareWheelz card has been a game-changer. I save money on every rental and the priority support is amazing!",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Car Owner",
                content: "As a car owner, the premium membership has increased my earnings by 30%. The enhanced verification gives renters confidence.",
                rating: 5
              },
              {
                name: "Emma Williams",
                role: "Basic Member",
                content: "Even the basic membership offers great value. The loyalty points add up quickly and I love the member-only vehicles.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-mauve-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Become a Member?
          </h2>
          <p className="text-xl text-mauve-100 mb-8 max-w-2xl mx-auto">
            Join ShareWheelz today and start enjoying exclusive benefits, discounts, and premium support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-mauve-600 hover:bg-gray-100 px-8 py-3 text-lg"
              onClick={() => handleSignup(selectedPlan)}
            >
              <Crown className="w-5 h-5 mr-2" />
              Start Your Membership
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-mauve-600 px-8 py-3 text-lg"
              onClick={handleContactSupport}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {paymentStep === 'confirm' && (
              <>
                <div className="flex items-center justify-between p-6 border-b">
                  <h3 className="text-xl font-semibold">Confirm Your Membership</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseModal}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Plan Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">
                        {selectedPlan === 'premium' ? 'Premium Member' : 'Basic Member'}
                      </h4>
                      <Crown className="h-5 w-5 text-mauve-600" />
                    </div>
                    <div className="text-2xl font-bold text-mauve-600">
                      {formatCurrency(selectedPlan === 'premium' ? 19.99 : 9.99)}
                      <span className="text-sm text-gray-600 font-normal">/month</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedPlan === 'premium' 
                        ? 'Best value for frequent users' 
                        : 'Perfect for occasional renters'
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
                        <span>{formatCurrency(selectedPlan === 'premium' ? 19.99 : 9.99)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(selectedPlan === 'premium' ? 4.00 : 2.00)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedPlan === 'premium' ? 23.99 : 11.99)}</span>
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
                      onClick={handlePaymentConfirm}
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mauve-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
                <p className="text-gray-600">Please wait while we process your membership...</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Welcome to ShareWheelz!</h3>
                <p className="text-gray-600 mb-6">
                  Your {selectedPlan === 'premium' ? 'Premium' : 'Basic'} membership is now active. 
                  You can start enjoying all the exclusive benefits right away!
                </p>
                <Button
                  onClick={handlePaymentSuccess}
                  className="bg-mauve-600 hover:bg-mauve-700"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
