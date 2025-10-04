import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchForm } from './SearchForm';
import { CarIcon, Shield, Clock, Navigation, CheckCircle, ArrowRight, DollarSign, Car } from 'lucide-react';

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState({
    start: null,
    end: null
  });

  const heroImages = [
    '/assets/Bentley.jpg',
    '/assets/ferrari 2.jpg',
    '/assets/jaguar-f-type-new.jpg',
    '/assets/Tesla.jpg',
    '/assets/Range Rover.jpg',
  ];

  // Rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const onDatesChange = (dates: { start: Date | null; end: Date | null }) => {
    setSelectedDates(dates);
  };

  // Your powerful marketing messages
  const marketingMessages = [
    {
      icon: DollarSign,
      headline: "Insurance Paid Off?",
      subtext: "One weekend rental could pay off your annual insurance.",
      buttonText: "List Your Car +",
      href: "/add-car",
      bgColor: "from-green-500/20 to-green-600/20",
      iconColor: "from-green-500 to-green-600",
      textColor: "text-green-600",
      iconBgColor: "from-green-500 to-green-600"
    },
    {
      icon: Car,
      headline: "Car Sitting Idle?",
      subtext: "Start earning up to £280/month in just a few days.",
      buttonText: "Start Earning +",
      href: "/become-member", 
      bgColor: "from-blue-500/20 to-blue-600/20",
      iconColor: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      iconBgColor: "from-blue-500 to-blue-600"
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background with Multiple Images */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <img 
            src={heroImages[currentImageIndex]} 
            alt="Premium car rental in the UK - Luxury vehicles for your next journey"
            className="w-full h-full object-cover transition-opacity duration-1000"
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = heroImages[(currentImageIndex + 1) % heroImages.length];
            }}
          />
          {/* Enhanced gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-purple-900/30" />
        </div>
        
        {/* Enhanced floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>
      
      <div className="relative z-10 container px-4 text-center text-white">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Trust Badge */}
          <div className="flex justify-center mb-8">
            <Badge className="bg-white/20 text-white border-white/30 px-6 py-2 text-sm font-medium backdrop-blur-sm">
              <Shield className="w-4 h-4 mr-2" />
              Trusted by Growing Community
            </Badge>
          </div>

          <div className="space-y-8">
            {/* Enhanced heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Share Wheelz
              </span>
              <span className="block text-3xl md:text-5xl lg:text-6xl mt-4 font-extrabold bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                For Everyone
              </span>
            </h1>

            {/* Enhanced subtitle */}
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-medium">
              Discover the perfect vehicle for your journey. From city cars to luxury vehicles, find and book your ideal ride in minutes with Share Wheelz.
            </p>

            {/* Search Form */}
            <div className="flex justify-center">
              <SearchForm
                onDatesChange={onDatesChange}
                initialDates={selectedDates}
              />
            </div>

            {/* Strategic Marketing Messages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {marketingMessages.map((message, index) => {
                const Icon = message.icon;
                return (
                  <a key={index} href={message.href}>
                    <div className={`text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-full w-full max-w-lg mx-auto p-10 bg-gradient-to-br ${message.bgColor} border border-white/20 backdrop-blur-sm relative group`}>
                      {/* Chat tail */}
                      <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-b-[16px] border-l-transparent border-r-transparent border-b-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="flex flex-col items-center space-y-5 h-full justify-center">
                        {/* Icon */}
                        <div className={`bg-gradient-to-br ${message.iconBgColor} text-white p-5 rounded-full shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
                          <Icon className="h-10 w-10" />
                        </div>

                        {/* Headline */}
                        <div className="text-white font-bold text-2xl leading-tight">
                          {message.headline}
                        </div>

                        {/* Subtext */}
                        <div className="text-white/90 text-lg leading-relaxed text-center">
                          {message.subtext}
                        </div>

                        {/* Action Button */}
                        <Button className={`bg-gradient-to-r ${message.iconColor} hover:from-green-600 hover:to-green-800 text-white border-0 rounded-full px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 text-lg font-semibold`}>
                          {message.buttonText}
                        </Button>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex justify-center items-center">
              <a href="/cars">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <Car className="mr-2 h-5 w-5" />
                  Browse Vehicles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                No Hidden Fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Instant Booking
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Full Insurance
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}