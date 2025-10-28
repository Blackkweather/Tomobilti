// Featured cars will be fetched from the API
const featuredCars: Car[] = [];
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Hero from '../components/Hero';
import { carApi } from '../lib/api';
import CarCard from '../components/CarCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  MapPin, 
  Shield, 
  Users, 
  Target,
  Lock,
  PoundSterling,
  Crown,
  CarIcon,
  CheckCircle,
  ArrowRight,
  Zap,
  Star,
  Award,
  Heart,
  Mountain
} from 'lucide-react';
import { getFeaturedCarImages } from '../utils/carImages';
import { useAuth } from '../contexts/AuthContext';
import type { Car } from '@shared/schema';
import EmailBanner from '../components/EmailBanner';

export default function Home() {
  // Initialize scroll animations
  useScrollAnimation();
  const { isAuthenticated } = useAuth();

  // State for selected dates
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });



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
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      link: '/cars',
      buttonText: 'Browse Cars',
      buttonBg: 'bg-blue-600',
      buttonColor: '#3b82f6',
      buttonColorLight: '#60a5fa',
      features: [
        'Wide selection of vehicles',
        'Easy booking process',
        'Secure payment system',
        '24/7 customer support'
      ]
    },
    {
      id: 'make-car-work',
      title: 'List Your Car',
      description: 'List your vehicle and earn money with ease.',
      icon: PoundSterling,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      link: '/become-host',
      buttonText: 'List Your Car',
      buttonBg: 'bg-green-600',
      buttonColor: '#16a34a',
      buttonColorLight: '#34d399',
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
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      link: '/become-member',
      buttonText: 'Join Now',
      buttonBg: 'bg-purple-600',
      buttonColor: '#7c3aed',
      buttonColorLight: '#a78bfa',
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
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      link: '/help',
      buttonText: 'Learn More',
      buttonBg: 'bg-blue-600',
      buttonColor: '#2563eb',
      buttonColorLight: '#60a5fa',
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
      {/* Email Banner */}
      <EmailBanner />
      
      {/* Hero Section with Promotional Bubbles */}
      <Hero />


      {/* Main Homepage Sections - Polished, centered, responsive */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
              Everything You Need for Car Sharing
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              From renting to earning, we provide comprehensive solutions for all your car sharing needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {homepageSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  className="group flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm border border-gray-100 min-h-[18rem] md:min-h-[16rem] lg:min-h-[18rem] scroll-animate"
                  aria-labelledby={`section-${section.id}`}
                >
                  <div className="flex-shrink-0 mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-white border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]`}>
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center ${section.bgColor}`}>
                        <Icon className={`h-6 w-6 ${section.textColor}`} aria-hidden />
                      </div>
                    </div>
                  </div>

                  <h3 id={`section-${section.id}`} className="text-2xl md:text-2xl font-semibold text-gray-900 mb-2">
                    {section.title}
                  </h3>

                  <p className="text-gray-600 text-sm md:text-base mb-6 max-w-xs mx-auto">
                    {section.description}
                  </p>

                  <div className="mb-6 flex-1 flex items-center justify-center">
                    <ul className="space-y-3 w-full max-w-[240px]">
                      {section.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-4">
                          <div className="w-6 flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-green-100 shadow-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            </div>
                          </div>
                          <div className="flex-1 text-left">
                            <span className="text-gray-600 text-sm leading-snug">{feature}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={section.link} className="w-full mt-auto">
                    <button
                      className={`btn-animated-border w-full py-2.5 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 transition-all duration-300 ${
                        section.id === 'rent-car' ? 'btn-blue' :
                        section.id === 'make-car-work' ? 'btn-green' :
                        section.id === 'become-member' ? 'btn-purple' :
                        'btn-blue'
                      }`}
                      aria-label={section.buttonText}
                      onMouseEnter={async (e) => {
                        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                        const target = e.currentTarget;
                        const mod: any = await import('animejs');
                        const a = mod.default || mod.anime || mod;
                        a.remove(target);
                        a({ targets: target, scale: [1, 1.02], duration: 220, easing: 'easeOutQuad' });
                      }}
                      onMouseLeave={async (e) => {
                        const target = e.currentTarget;
                        const mod: any = await import('animejs');
                        const a = mod.default || mod.anime || mod;
                        a.remove(target);
                        a({ targets: target, scale: 1, duration: 180, easing: 'easeOutQuad' });
                      }}
                    >
                      {section.buttonText}
                    </button>
                  </Link>
                </div>
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
      <section className="py-20 bg-white overflow-visible pb-28">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-fr items-stretch">
              {(carsData && carsData.cars && carsData.cars.length > 0 ? carsData.cars.slice(0, 6) : featuredCars).map((car: any) => (
                <div key={car.id} className="h-full">
                  <CarCard car={car} />
                </div>
              ))}
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
                  <Button className="btn-blue px-6 py-3">
                    View All Cars
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/become-host">
                  <Button variant="outline" className="btn-gray px-6 py-3">
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
              <Link href="/become-member">
                <Button 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg rounded-lg transition-all duration-300"
                >
                  <Crown className="mr-2 h-5 w-5" />
                  Become a Member
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Main content ends here - Footer is handled by App.tsx */}
    </div>
  );
}
