import { useState } from 'react';
import { Link } from 'wouter';
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
  TrendingUp
} from 'lucide-react';
import Footer from '../components/Footer';
import { formatCurrency } from '../utils/currency';

export default function BecomeMember() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('premium');

  const membershipBenefits = [
    {
      icon: CreditCard,
      title: 'Secure Avis Card',
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
              Unlock exclusive benefits, earn loyalty points, and enjoy premium discounts with our Secure Avis membership program.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-mauve-600 hover:bg-mauve-700 text-white px-8 py-3 text-lg">
                <Crown className="w-5 h-5 mr-2" />
                Choose Your Plan
              </Button>
              <Button size="lg" variant="outline" className="border-mauve-300 text-mauve-700 hover:bg-mauve-50 px-8 py-3 text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
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
      <section className="py-20 bg-white">
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
                  className={`relative hover:shadow-xl transition-all duration-300 ${
                    plan.popular ? 'ring-2 ring-mauve-500 scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-mauve-600 text-white px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
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

      {/* Secure Avis Card Preview */}
      <section className="py-20 bg-gradient-to-r from-mauve-600 to-bleu-600">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-6">Your Digital Secure Avis Card</h2>
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
                        <p className="text-sm opacity-80">Secure Avis Card</p>
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
                content: "The Secure Avis card has been a game-changer. I save money on every rental and the priority support is amazing!",
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
            <Button size="lg" className="bg-white text-mauve-600 hover:bg-gray-100 px-8 py-3 text-lg">
              <Crown className="w-5 h-5 mr-2" />
              Start Your Membership
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-mauve-600 px-8 py-3 text-lg">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
