import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Hero from '../components/Hero';
import { carApi } from '../lib/api';
import CarCard from '../components/CarCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Car } from '@shared/schema';

export default function Home() {
  // Initialize scroll animations
  useScrollAnimation();

  // Fetch featured cars
  const { data: carsData, isLoading: carsLoading } = useQuery({
    queryKey: ['featuredCars'],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', '6');
      
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
      icon: '📍'
    },
    {
      title: 'All Fuel Types',
      description: 'Petrol, diesel, electric and hybrid available',
      icon: '⛽'
    },
    {
      title: 'Secure',
      description: 'Secure payments and insurance included',
      icon: '🛡️'
    },
    {
      title: 'Community',
      description: 'Rent between individuals or with professionals',
      icon: '👥'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'London',
      rating: 5,
      text: 'Amazing experience! Found the perfect car for my weekend trip. The owner was so helpful and the car was in excellent condition.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&auto=format'
    },
    {
      name: 'Michael Chen',
      location: 'Manchester',
      rating: 5,
      text: 'Great platform! Easy to use and the booking process was seamless. Will definitely use again for future trips.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format'
    },
    {
      name: 'Emma Williams',
      location: 'Birmingham',
      rating: 5,
      text: 'Love the variety of cars available. From luxury sedans to eco-friendly options, there\'s something for everyone.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format'
    }
  ];

  // Dynamic stats based on real data
  const stats = [
    { value: carsData?.total ? `${carsData.total}+` : '2,500+', label: 'Available Vehicles' },
    { value: '15,000+', label: 'Satisfied Customers' },
    { value: '8', label: 'Cities Served' },
    { value: '4.8★', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-700 font-medium mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 scroll-animate">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Why Choose Tomobilto?</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              The first peer-to-peer car rental platform in the UK. 
              Simple, secure and adapted to UK needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow border border-gray-200 scroll-animate-scale">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Car Showcase Section with Scroll Transitions */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Featured Vehicles</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our premium collection of vehicles available for rent across the UK
            </p>
          </div>
          
          {/* Car Images Grid with Scroll Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format',
                title: 'Luxury Sedans',
                description: 'Premium comfort for business travel'
              },
              {
                image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&auto=format',
                title: 'Sports Cars',
                description: 'High-performance vehicles for thrill seekers'
              },
              {
                image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format',
                title: 'Electric Vehicles',
                description: 'Eco-friendly options for conscious travelers'
              },
              {
                image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&auto=format',
                title: 'SUVs & Crossovers',
                description: 'Perfect for family adventures'
              },
              {
                image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format',
                title: 'Convertibles',
                description: 'Open-top driving experience'
              },
              {
                image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format',
                title: 'Classic Cars',
                description: 'Timeless elegance and style'
              }
            ].map((car, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 scroll-animate-scale"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img 
                    src={car.image} 
                    alt={car.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold mb-2">{car.title}</h3>
                    <p className="text-sm opacity-90">{car.description}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-blue-600">
                  Available
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">How Does It Work?</h2>
            <p className="text-gray-700">Book your car in 3 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&auto=format"
                  alt="Search for a car"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                  loading="lazy"
                />
                <div className="absolute -top-4 -left-4 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold">Search</h3>
              <p className="text-gray-600">Find the perfect car for your UK journey</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&auto=format"
                  alt="Book online"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                  loading="lazy"
                />
                <div className="absolute -top-4 -left-4 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold">Book</h3>
              <p className="text-gray-600">Choose your dates and book in a few clicks</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&auto=format"
                  alt="Enjoy the journey"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                  loading="lazy"
                />
                <div className="absolute -top-4 -left-4 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold">Enjoy</h3>
              <p className="text-gray-600">Pick up your car and explore the UK</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Cars Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Vehicles</h2>
            <p className="text-gray-600">Discover some of our most requested vehicles</p>
          </div>

          {carsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading vehicles..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carsData?.cars?.slice(0, 6).map((car: any) => (
                <div key={car.id} className="transform hover:scale-105 transition-transform">
                  <CarCard
                    car={{
                      ...car,
                      pricePerDay: car.pricePerDay.toString(),
                      images: car.images || ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format']
                    }}
                  />
                </div>
              )) || (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No vehicles available at the moment.</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/cars">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold">
                View All Vehicles
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have found their perfect ride with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Have a car? Earn money!
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Share your vehicle with our community and generate additional income 
            safely. Free registration and simplified process.
          </p>
          <Link href="/become-host">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-semibold">
              Become a Host Owner
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}