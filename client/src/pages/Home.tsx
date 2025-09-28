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
  Mountain
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

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Available Cars', value: '2,500+', icon: CarIcon },
    { label: 'Successful Rentals', value: '50,000+', icon: CheckCircle },
    { label: 'Average Rating', value: '4.8/5', icon: Star }
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

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'London',
      rating: 5,
      text: 'ShareWheelz made my weekend trip so easy! The car was perfect and the owner was very helpful.',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=4F46E5&color=fff&size=100'
    },
    {
      name: 'Michael Chen',
      location: 'Manchester',
      rating: 5,
      text: 'Great platform! I found an electric car for my business trip. Clean, efficient, and affordable.',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10B981&color=fff&size=100'
    },
    {
      name: 'Emma Williams',
      location: 'Birmingham',
      rating: 5,
      text: 'As a car owner, ShareWheelz helped me earn extra income. The process is simple and secure.',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Williams&background=EC4899&color=fff&size=100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <Hero 
        onDatesChange={setSelectedDates}
        selectedDates={selectedDates}
      />

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
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
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
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
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
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
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {carsData?.cars?.slice(0, 6).map((car: Car) => (
                <CarCard key={car.id} car={car} />
              ))}
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
      <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
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
                <div key={index} className="text-center group">
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
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold gradient-text mb-6 animate-fade-in">
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
                  className="animate-fade-in hover-lift" 
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have discovered the convenience of Share Wheelz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 font-medium">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed italic font-medium">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
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
                <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg rounded-lg transition-all duration-300">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Become a Member
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}