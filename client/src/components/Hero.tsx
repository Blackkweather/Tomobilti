import React, { useState, useEffect } from 'react';
import { Shield, Clock, CheckCircle, Car } from 'lucide-react';

// Dynamic import for node-vibrant to handle Vite compatibility
const loadVibrant = async () => {
  try {
    const Vibrant = await import('node-vibrant/browser');
    return (Vibrant as any).default || Vibrant;
  } catch (error) {
    console.log('Failed to load node-vibrant:', error);
    return null;
  }
};

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [gradientColors, setGradientColors] = useState({
    primary: '#3B82F6', // Default blue
    secondary: '#8B5CF6' // Default purple
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const colorCache = React.useRef<Map<string, { primary: string; secondary: string }>>(new Map());

  const heroImages = [
    // Premium High-Quality Car Collection - User Selected
    'https://images.pexels.com/photos/16626609/pexels-photo-16626609.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop', // Jaguar F-Type parked
    'https://images.pexels.com/photos/20695257/pexels-photo-20695257.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop', // Jaguar F-Type interior
    'https://images.pexels.com/photos/30889575/pexels-photo-30889575.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop', // Orange sports car scenic road
    'https://images.pexels.com/photos/34166835/pexels-photo-34166835.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop', // Black SUV sand dunes
    'https://images.pexels.com/photos/27918358/pexels-photo-27918358.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop', // Hyundai Santa Fe mountains sunset
    'https://images.pexels.com/photos/119435/pexels-photo-119435.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop'  // White Jeep Cherokee
  ];

  // Extract dominant colors from the current image (with memoization)
  const extractColors = async (imageUrl: string) => {
    try {
      const cached = colorCache.current.get(imageUrl);
      if (cached) {
        setGradientColors(cached);
        return;
      }
      const Vibrant = await loadVibrant();
      if (!Vibrant) {
        return;
      }
      const palette = await Vibrant.from(imageUrl).getPalette();
      const primary = palette.Vibrant?.hex || '#3B82F6';
      const secondary = palette.DarkVibrant?.hex || palette.Muted?.hex || '#8B5CF6';
      const colors = { primary, secondary };
      colorCache.current.set(imageUrl, colors);
      setGradientColors(colors);
    } catch (error) {
      // keep current colors
    }
  };

  // Extract colors when image changes
  useEffect(() => {
    extractColors(heroImages[currentImageIndex]);
  }, [currentImageIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 400);
    }, 8000); // slower rotation to be less jarring

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="relative h-[70vh] sm:h-[75vh] lg:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Dynamic Background with Multiple Images */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <img 
            src={heroImages[currentImageIndex]} 
            alt="Premium car rental in the UK - Luxury vehicles for your next journey"
            className="w-full h-full object-cover object-center transition-opacity duration-1000"
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
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-6">
            {/* Enhanced heading with dynamic gradient */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span 
                className="block text-transparent transition-all duration-1000 ease-in-out"
                style={{
                  background: `linear-gradient(135deg, ${gradientColors.primary}, ${gradientColors.secondary}, ${gradientColors.primary})`,
                  backgroundSize: '200% 200%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  animation: isTransitioning ? 'none' : 'shimmer 3s ease-in-out infinite',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent'
                }}
              >
                Share Wheelz
              </span>
              <span className="block text-2xl md:text-4xl lg:text-5xl mt-2 font-extrabold bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                For Everyone
              </span>
            </h1>

            {/* Enhanced subtitle */}
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
              Discover the perfect vehicle for your journey. From city cars to luxury vehicles, find and book your ideal ride in minutes with Share Wheelz.
            </p>

            {/* Marketing + Trust Circles - All aligned */}
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
              {/* Insurance Paid Off Bubble */}
              <div className="text-center group">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/30 rounded-full mb-2 group-hover:bg-white/40 transition-all duration-300 backdrop-blur-sm border-2 border-white/20 group-hover:border-white/40 group-hover:scale-[1.02]">
                  <span className="text-xl font-bold text-white drop-shadow-lg">£</span>
                </div>
                <div className="text-lg font-bold text-white mb-1">No Hidden</div>
                <div className="text-white/80 text-xs">Fees</div>
              </div>

              {/* Car Sitting Idle Bubble */}
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/30 rounded-full mb-2 group-hover:bg-white/40 transition-all duration-300 backdrop-blur-sm border-2 border-white/20 group-hover:border-white/40 group-hover:scale-[1.02]">
                  <Car className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
                <div className="text-lg font-bold text-white mb-1">Instant</div>
                <div className="text-white/80 text-xs">Booking</div>
              </div>

              {/* 100% Secure Payments */}
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/30 rounded-full mb-2 group-hover:bg-white/40 transition-all duration-300 backdrop-blur-sm border-2 border-white/20 group-hover:border-white/40 group-hover:scale-[1.02]">
                  <Shield className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
                <div className="text-lg font-bold text-white mb-1">100% Secure</div>
                <div className="text-white/80 text-xs">Payments</div>
              </div>
              
              {/* 24/7 Support */}
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/30 rounded-full mb-2 group-hover:bg-white/40 transition-all duration-300 backdrop-blur-sm border-2 border-white/20 group-hover:border-white/40 group-hover:scale-[1.02]">
                  <Clock className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
                <div className="text-lg font-bold text-white mb-1">24/7</div>
                <div className="text-white/80 text-xs">Support</div>
              </div>
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