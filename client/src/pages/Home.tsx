import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Hero from '../components/Hero';
import { carApi } from '../lib/api';
import CarCard from '../components/CarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Car } from '@shared/schema';

export default function Home() {
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
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-green-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Tomobilto?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The first peer-to-peer car rental platform in the UK. 
              Simple, secure and adapted to UK needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Does It Work?</h2>
            <p className="text-gray-600">Book your car in 3 simple steps</p>
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
                <div className="absolute -top-4 -left-4 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
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
                <div className="absolute -top-4 -left-4 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
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
                <div className="absolute -top-4 -left-4 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
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
              <button className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors font-semibold">
                View All Vehicles
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Have a car? Earn money!
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Share your vehicle with our community and generate additional income 
            safely. Free registration and simplified process.
          </p>
          <Link href="/become-host">
            <button className="bg-white text-green-600 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-semibold">
              Become a Host Owner
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}