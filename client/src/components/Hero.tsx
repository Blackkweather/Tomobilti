import { useState } from 'react';
import { Link } from 'wouter';
import HeroSearch from './HeroSearch';

export default function Hero() {
  const [searchLocation, setSearchLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Single high-quality hero image for better visual impact
  const heroImage = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&h=800&fit=crop&auto=format&q=80';

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Single Hero Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Premium car rental in the UK - Luxury vehicles for your next journey"
          className="w-full h-full object-cover"
          loading="eager"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=800&fit=crop&auto=format&q=80';
          }}
        />
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>
      
      <div className="relative z-10 container px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-2xl">
              <span className="block text-white">Car Rental</span>
              <span className="block text-white bg-blue-600/90 backdrop-blur-md rounded-2xl px-6 py-3 mt-4 inline-block border border-blue-500/30 shadow-2xl">
                Peer-to-Peer in the UK
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
              Discover the UK with premium vehicles from local owners. 
              From luxury sedans to eco-friendly electric cars, find your perfect ride.
              <span className="block text-blue-200 font-bold mt-3 text-2xl md:text-3xl">
                Find the perfect car for your journey!
              </span>
            </p>
          </div>

          <HeroSearch />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-200 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="font-semibold text-green-300">✓ Easy Booking</div>
              <div>In just a few clicks</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-300">✓ Competitive Prices</div>
              <div>Up to 50% cheaper</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-300">✓ Insurance Included</div>
              <div>Travel safely</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}