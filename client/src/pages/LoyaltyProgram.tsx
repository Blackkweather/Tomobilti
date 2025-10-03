import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { 
  Award, 
  Star, 
  Gift, 
  Users, 
  Car, 
  PoundSterling,
  CheckCircle,
  ArrowRight,
  Crown,
  Zap,
  Sparkles,
  Heart,
  Trophy,
  Target,
  Calendar,
  MapPin,
  Clock,
  ThumbsUp
} from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function LoyaltyProgram() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Handle join loyalty program with auth check
  const handleJoinLoyalty = () => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    // User is authenticated, show success message or redirect to membership
    alert('Welcome to the ShareWheelz Loyalty Program! You can now start earning points with every rental.');
  };
  const loyaltyLevels = [
    {
      level: "Bronze",
      points: "0-999",
      color: "bg-orange-100 text-orange-800",
      icon: Award,
      benefits: [
        "Basic member benefits",
        "Email support",
        "Standard booking process",
        "Earn 1 point per £1 spent"
      ],
      rewards: [
        "Welcome bonus: 100 points",
        "Birthday reward: 50 points",
        "Referral bonus: 200 points"
      ]
    },
    {
      level: "Silver",
      points: "1000-4999",
      color: "bg-gray-100 text-gray-800",
      icon: Star,
      benefits: [
        "Priority customer support",
        "5% discount on all rentals",
        "Free cancellation up to 2 hours",
        "Earn 1.2 points per £1 spent"
      ],
      rewards: [
        "Monthly bonus: 100 points",
        "Free upgrade when available",
        "Exclusive member discounts"
      ]
    },
    {
      level: "Gold",
      points: "5000-9999",
      color: "bg-yellow-100 text-yellow-800",
      icon: Crown,
      benefits: [
        "VIP customer support",
        "10% discount on all rentals",
        "Free cancellation anytime",
        "Earn 1.5 points per £1 spent"
      ],
      rewards: [
        "Quarterly bonus: 500 points",
        "Priority vehicle access",
        "Personal account manager"
      ]
    },
    {
      level: "Platinum",
      points: "High",
      color: "bg-purple-100 text-purple-800",
      icon: Trophy,
      benefits: [
        "Concierge service",
        "15% discount on all rentals",
        "Exclusive luxury vehicle access",
        "Earn 2 points per £1 spent"
      ],
      rewards: [
        "Annual bonus: 2000 points",
        "Free delivery and pickup",
        "Exclusive member events",
        "Complimentary upgrades"
      ]
    }
  ];

  const waysToEarn = [
    {
      icon: Car,
      title: "Rent Vehicles",
      description: "Earn points on every rental",
      points: "1-2 points per £1",
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: Users,
      title: "Refer Friends",
      description: "Invite friends to join ShareWheelz",
      points: "200 points per referral",
      color: "bg-green-100 text-green-800"
    },
    {
      icon: Star,
      title: "Leave Reviews",
      description: "Share your experience",
      points: "50 points per review",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      icon: Calendar,
      title: "Book in Advance",
      description: "Plan ahead and save",
      points: "Bonus 100 points",
      color: "bg-purple-100 text-purple-800"
    },
    {
      icon: Heart,
      title: "Complete Profile",
      description: "Keep your profile updated",
      points: "100 points",
      color: "bg-pink-100 text-pink-800"
    },
    {
      icon: Gift,
      title: "Special Promotions",
      description: "Participate in member events",
      points: "Varies",
      color: "bg-orange-100 text-orange-800"
    }
  ];

  const rewards = [
    {
      category: "Rental Discounts",
      items: [
        "5% off all rentals (Silver+)",
        "10% off all rentals (Gold+)",
        "15% off all rentals (Platinum)",
        "Exclusive member-only rates"
      ]
    },
    {
      category: "Free Benefits",
      items: [
        "Free cancellation (Silver+)",
        "Free upgrades when available",
        "Free delivery and pickup (Platinum)",
        "Complimentary extras"
      ]
    },
    {
      category: "Exclusive Access",
      items: [
        "Priority vehicle access",
        "Exclusive luxury vehicles",
        "Member-only events",
        "Early access to new features"
      ]
    },
    {
      category: "Premium Service",
      items: [
        "Priority customer support",
        "Personal account manager",
        "Concierge service (Platinum)",
        "24/7 dedicated support"
      ]
    }
  ];

  const memberStories = [
    {
      name: "Sarah Johnson",
      level: "Platinum",
      points: "12,450",
      story: "I've been a member for 2 years and the loyalty program has been amazing! The concierge service and exclusive access to luxury vehicles make every trip special.",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      level: "Gold",
      points: "7,200",
      story: "The points system is fantastic. I've saved hundreds of pounds with the Gold level discounts and the priority support is incredible.",
      avatar: "MC"
    },
    {
      name: "Emma Williams",
      level: "Silver",
      points: "3,100",
      story: "Even at Silver level, I get great benefits. The 5% discount and free cancellation have made renting so much more convenient.",
      avatar: "EW"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12 text-yellow-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Loyalty Program</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Earn points with every rental and unlock exclusive rewards. 
            The more you use ShareWheelz, the more you save!
          </p>
        </div>

        {/* Program Overview */}
        <Card className="shadow-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white mb-12">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-16 w-16 mr-4" />
              <div>
                <h2 className="text-4xl font-bold">Earn Points, Save Money</h2>
                <p className="text-xl opacity-90">Join our loyalty program today</p>
              </div>
            </div>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Start earning points immediately and unlock exclusive benefits. 
              The more you rent, the more you save!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-yellow-600 hover:bg-gray-100"
                onClick={handleJoinLoyalty}
              >
                <Crown className="h-5 w-5 mr-2" />
                {isAuthenticated ? 'Join Program' : 'Login to Join'}
              </Button>
              <Link href="/membership-benefits">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-yellow-600">
                  <Star className="h-5 w-5 mr-2" />
                  View Benefits
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Levels */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-6 w-6 mr-2 text-blue-600" />
              Loyalty Levels
            </CardTitle>
            <p className="text-gray-600">
              Progress through levels and unlock increasingly better benefits
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loyaltyLevels.map((level, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <level.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold mb-3 ${level.color}`}>
                    {level.level}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">{level.points} points</div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Benefits</h4>
                      <ul className="space-y-1 text-xs">
                        {level.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Rewards</h4>
                      <ul className="space-y-1 text-xs">
                        {level.rewards.map((reward, rewardIndex) => (
                          <li key={rewardIndex} className="flex items-start">
                            <Gift className="h-3 w-3 text-purple-600 mr-1 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{reward}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ways to Earn Points */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-6 w-6 mr-2 text-green-600" />
              Ways to Earn Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {waysToEarn.map((way, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <way.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{way.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{way.description}</p>
                  <Badge className={way.color}>
                    {way.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rewards Categories */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="h-6 w-6 mr-2 text-purple-600" />
              Rewards & Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {rewards.map((category, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Member Stories */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-6 w-6 mr-2 text-red-600" />
              Member Success Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {memberStories.map((member, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{member.name}</div>
                      <div className="flex items-center">
                        <Badge className="bg-purple-100 text-purple-800 mr-2">
                          {member.level}
                        </Badge>
                        <span className="text-sm text-gray-600">{member.points} points</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm italic">"{member.story}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How to Join */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-600" />
              How to Join
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Sign Up</h3>
                <p className="text-sm text-gray-600">Create your ShareWheelz account</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Start Earning</h3>
                <p className="text-sm text-gray-600">Make your first rental</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Level Up</h3>
                <p className="text-sm text-gray-600">Earn points and unlock benefits</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Enjoy Rewards</h3>
                <p className="text-sm text-gray-600">Save money and get exclusive access</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="shadow-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Start Earning Points Today!</h2>
            <p className="text-xl mb-8 opacity-90">
              Join our loyalty program and start saving on every rental
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-yellow-600 hover:bg-gray-100"
                onClick={handleJoinLoyalty}
              >
                <Trophy className="h-5 w-5 mr-2" />
                {isAuthenticated ? 'Join Loyalty Program' : 'Login to Join'}
              </Button>
              <Link href="/cars">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-yellow-600">
                  <Car className="h-5 w-5 mr-2" />
                  Start Renting
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}








