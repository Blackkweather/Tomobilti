import { useState } from 'react';
import { Link } from 'wouter';

export default function Hero() {
  const [searchLocation, setSearchLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Horizontal hero images for better visual appeal
  const heroImages = [
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&h=600&fit=crop&auto=format', // Mercedes-Benz
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&h=600&fit=crop&auto=format', // Mercedes-Benz alternative
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=600&fit=crop&auto=format'  // Generic car
  ];

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Horizontal Background Images Carousel */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/85 to-green-800/85" />
        <div className="flex h-full">
          {heroImages.map((image, index) => (
            <div key={index} className="flex-1 relative">
              <img 
                src={image} 
                alt={index === 0 ? 'Luxury car rental UK' : index === 1 ? 'Premium car rental UK' : `UK car rental ${index + 1}`}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=600&fit=crop&auto=format';
                }}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>
      
      <div className="relative z-10 container px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Car Rental
              <span className="block text-white bg-green-500/30 backdrop-blur-sm rounded-lg px-4 py-2 mt-2 inline-block">
                Peer-to-Peer in the UK
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-xl mx-auto font-medium">
              Discover the UK with our peer-to-peer car rental platform.
              <span className="block text-yellow-300 font-bold mt-2">
                Find the perfect car for your journey!
              </span>
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl max-w-4xl mx-auto p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  📍 Location
                </label>
                <input
                  placeholder="London, Manchester, Birmingham..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  📅 Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  📅 End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 opacity-0">
                  Action
                </label>
                <Link href={`/cars?location=${encodeURIComponent(searchLocation)}&startDate=${startDate}&endDate=${endDate}`}>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    🔍 View Cars
                  </button>
                </Link>
              </div>
            </div>
          </div>

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