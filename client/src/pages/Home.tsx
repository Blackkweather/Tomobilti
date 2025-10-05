import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Hero from '../components/Hero';
import { carApi } from '../lib/api';
import CarCard from '../components/CarCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  MapPin, 
  Shield, 
  Users, 
  Star, 
  Car as CarIcon, 
  Clock, 
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Heart,
  Award,
  Zap,
  Mountain,
  PoundSterling,
  Crown,
  Phone,
  Mail,
  MessageCircle,
  X,
  Sparkles,
  Target,
  Lock
} from 'lucide-react';
import { getFeaturedCarImages } from '../utils/carImages';
import { useAuth } from '../contexts/AuthContext';
import type { Car } from '@shared/schema';

export default function Home() {
  // Initialize scroll animations
  useScrollAnimation();
  const { isAuthenticated } = useAuth();

  // State for selected dates
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });

  // State for membership popup
  const [showMembershipPopup, setShowMembershipPopup] = useState(false);
  const [popupTriggered, setPopupTriggered] = useState(false);

  // Trigger membership popup after 4 seconds
  useEffect(() => {
    if (!isAuthenticated && !popupTriggered) {
      const timer = setTimeout(() => {
        setShowMembershipPopup(true);
        setPopupTriggered(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, popupTriggered]);

  // Handle membership popup close
  const handleCloseMembershipPopup = () => {
    setShowMembershipPopup(false);
  };

  // Handle membership popup open
  const handleOpenMembershipPopup = () => {
    setShowMembershipPopup(true);
  };

  // Fetch featured cars
  const { data: carsData, isLoading: carsLoading } = useQuery({
    queryKey: ['featuredCars', selectedDates],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', '6');
      
      // Add date filters if dates are selected
      if (selectedDates.start) {
        params.set('startDate', selectedDates.start.toISOString());
      }
      if (selectedDates.end) {
        params.set('endDate', selectedDates.end.toISOString());
      }
      
      const response = await fetch(`/api/cars?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      return response.json();
    },
  });

  const features = [
    {
      title: 'All Across the UK',
      description: 'Find vehicles in all major UK cities',
      icon: MapPin,
      color: 'text-blue-600'
    },
    {
      title: 'All Fuel Types',
      description: 'Petrol, diesel, electric and hybrid available',
      icon: Zap,
      color: 'text-green-600'
    },
    {
      title: 'Secure',
      description: 'Secure payments and insurance included',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      title: 'Community',
      description: 'Rent between individuals or with professionals',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  // New homepage sections
  const homepageSections = [
    {
      id: 'rent-car',
      title: 'Rent a Car',
      description: 'Find and book a car easily near you.',
      icon: CarIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/cars',
      buttonText: 'Browse Cars',
      features: [
        'Wide selection of vehicles',
        'Easy booking process',
        'Secure payment system',
        '24/7 customer support'
      ]
    },
    {
      id: 'make-car-work',
      title: 'Make Your Car Work For You',
      description: 'List your vehicle and earn money with ease.',
      icon: PoundSterling,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/add-car',
      buttonText: 'List Your Car',
      features: [
        'Earn passive income',
        'Full insurance coverage',
        'Verified renters only',
        'Flexible availability'
      ]
    },
    {
      id: 'become-member',
      title: 'Become a Member',
      description: 'Get access to exclusive benefits and a secure community.',
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/become-member',
      buttonText: 'Join Now',
      features: [
        'Exclusive discounts',
        'Priority support',
        'Loyalty points',
        'Member-only vehicles'
      ]
    },
    {
      id: 'quality-services',
      title: 'Our Quality Services',
      description: 'Insurance, assistance, and support included for a hassle-free experience.',
      icon: Shield,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      link: '/help',
      buttonText: 'Learn More',
      features: [
        'Discount on the selected insurance package',
        'Roadside assistance',
        '24/7 support',
        'Quality guarantee'
      ]
    },
  ];

  const stats = [
    { label: 'Active Users', value: 'Growing', icon: Users },
    { label: 'Available Cars', value: 'Multiple', icon: CarIcon },
    { label: 'Successful Rentals', value: 'Ongoing', icon: CheckCircle },
    { label: 'Customer Satisfaction', value: 'Excellent', icon: Star }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Search & Choose',
      description: 'Browse our wide selection of vehicles and find the perfect car for your needs.',
      icon: CarIcon
    },
    {
      step: '2',
      title: 'Book & Pay',
      description: 'Secure your booking with our safe payment system and get instant confirmation.',
      icon: CheckCircle
    },
    {
      step: '3',
      title: 'Pick Up & Drive',
      description: 'Meet the owner, inspect the vehicle, and start your journey with confidence.',
      icon: ArrowRight
    }
  ];

  // Car categories with your custom images
  const carCategories = [
    {
      name: 'Sports Cars',
      description: 'High-performance vehicles for thrill seekers',
      image: '/assets/Sport car.png',
      icon: Zap,
      count: '50+',
      color: 'from-red-500 to-orange-500',
      gradient: 'bg-gradient-to-br from-red-50 to-orange-50'
    },
    {
      name: 'Luxury Sedans',
      description: 'Premium comfort and elegance',
      image: '/assets/luxury Sedam.png',
      icon: Award,
      count: '30+',
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-50 to-pink-50'
    },
    {
      name: 'Electric Vehicles',
      description: 'Eco-friendly and efficient',
      image: '/assets/ELECTRIC.png',
      icon: Zap,
      count: '25+',
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50'
    },
    {
      name: 'Classic Cars',
      description: 'Timeless beauty and heritage',
      image: '/assets/CLASSIC.png',
      icon: Heart,
      count: '15+',
      color: 'from-amber-500 to-yellow-500',
      gradient: 'bg-gradient-to-br from-amber-50 to-yellow-50'
    },
    {
      name: 'Convertibles',
      description: 'Open-top driving experience',
      image: '/assets/CONVERTIBLES.png',
      icon: CarIcon,
      count: '20+',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    },
    {
      name: 'SUVs & 4x4',
      description: 'Adventure-ready vehicles',
      image: '/assets/SUV.png',
      icon: Mountain,
      count: '40+',
      color: 'from-gray-600 to-slate-600',
      gradient: 'bg-gradient-to-br from-gray-50 to-slate-50'
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      {/* Hero Section with Promotional Bubbles */}
      <Hero />

      {/* Main Homepage Sections */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 scroll-animate">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Car Sharing
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              From renting to earning, we provide comprehensive solutions for all your car sharing needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homepageSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={section.id} className={`group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105`}>
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${section.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h3>
                    <p className="text-gray-700 leading-relaxed font-medium mb-4 text-sm">{section.description}</p>
                    
                    {/* Features List */}
                    <div className="space-y-1 mb-4">
                      {section.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center justify-center gap-2 text-xs text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={section.link}>
                      <Button className={`w-full ${section.bgColor} ${section.textColor} hover:opacity-90 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-sm py-2`}>
                        {section.buttonText}
                        <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`text-center group`}>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-700 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Share Wheelz?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Experience the future of car sharing with our innovative platform designed for modern mobility needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className={`group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm scroll-animate`} style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-700 leading-relaxed font-medium">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {selectedDates.start && selectedDates.end ? 'Available Vehicles' : 'Featured Vehicles'}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {selectedDates.start && selectedDates.end 
                ? `Cars available from ${selectedDates.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} to ${selectedDates.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : 'Discover our most popular and highly-rated vehicles available for rent across the UK.'
              }
            </p>
          </div>

          {carsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg bg-gray-100 h-72 sm:h-80 animate-pulse" />
              ))}
            </div>
          ) : carsData?.cars?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12">
              {carsData.cars.slice(0, 6).map((car: Car) => (
                <div key={car.id}>
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 mb-12">
              <p className="text-gray-700 mb-4 text-lg">No cars found right now.</p>
              <Link href="/cars">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow">
                  Browse All Cars
                </Button>
              </Link>
            </div>
          )}

          <div className="text-center">
            <Link href="/cars">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                View All Vehicles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Getting started with Share Wheelz is simple. Follow these three easy steps to rent your perfect vehicle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className={`text-center group scroll-animate`} style={{animationDelay: `${index * 0.2}s`}}>
                  <div className="relative mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-300"></div>
                  </div>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-700 leading-relaxed font-medium">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Car Categories Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="text-5xl font-bold gradient-text mb-6">
              Explore Our Car Categories
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              From sports cars to luxury vehicles, find the perfect car for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {carCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div 
                  key={index} 
                  className="scroll-animate hover-lift" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className={`card-modern group hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden ${category.gradient}`}>
                    <div className="relative">
                      {/* Category Image */}
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-car.jpg';
                          }}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                        
                        {/* Floating Badge */}
                        <div className="absolute top-4 right-4">
                          <Badge className="badge-primary shadow-lg">
                            {category.count}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Category Info */}
                      <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white shadow-lg`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                        </div>
                        
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed font-medium">
                          {category.description}
                        </p>
                        
                        <Link href="/cars">
                          <Button className={`btn-primary w-full bg-gradient-to-r ${category.color} hover:opacity-90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group`}>
                            Explore {category.name}
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                          </Button>
                        </Link>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="card-modern max-w-2xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Can't find what you're looking for?
              </h3>
              <p className="text-gray-700 mb-6 font-medium">
                Browse our complete collection of vehicles or contact us for personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/cars">
                  <Button className="btn-primary">
                    View All Cars
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/become-host">
                  <Button variant="outline" className="btn-outline">
                    List Your Car
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join Share Wheelz today and discover a smarter way to travel. Whether you're renting or sharing your car, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <CarIcon className="mr-2 h-5 w-5" />
                Find a Car
              </Button>
            </Link>
            {!isAuthenticated && (
              <Button 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg rounded-lg transition-all duration-300"
                onClick={handleOpenMembershipPopup}
              >
                <Crown className="mr-2 h-5 w-5" />
                Become a Member
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Membership Popup */}
      {showMembershipPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[60] p-2 sm:p-4 animate-in fade-in duration-300"
          onClick={handleCloseMembershipPopup}
        >
          <div 
            className="bg-white rounded-xl sm:rounded-2xl max-w-sm sm:max-w-md w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 mt-20 sm:mt-24 scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-3 sm:p-6 text-center border-b border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseMembershipPopup}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-3 w-3" />
              </Button>
              
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-2 sm:mb-3">
                <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                Unlock Exclusive Benefits
              </h2>
              <h3 className="text-base sm:text-lg font-semibold text-blue-600 mb-2 sm:mb-3">
                Become a Member Today!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Join our secure community and enjoy premium perks designed for both car owners and renters.
              </p>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              {/* For Car Owners */}
              <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <PoundSterling className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-green-800">For Car Owners</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Earn passive income</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Full insurance coverage</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Verified renters only</span>
                  </div>
                </div>
              </div>

              {/* For Renters */}
              <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <CarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-blue-800">For Renters</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-700">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Affordable prices</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Nearby cars</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">24/7 support & discount on insurance</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-2 sm:py-3 border-t border-b border-gray-200">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span>Discount on Insurance</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                  <span>Secure Community</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/become-member">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleCloseMembershipPopup}
                >
                  <Crown className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Join Now
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Button>
              </Link>

              {/* Additional Info */}
              <div className="text-center text-sm text-gray-500">
                <p>Join our growing community of satisfied members</p>
                <p className="mt-1">Cancel anytime • No hidden fees</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
