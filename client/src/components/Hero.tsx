import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import HeroSearch from './HeroSearch';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Car, 
  Shield, 
  Clock, 
  Star, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import HeroPromotionalBubbles from './HeroPromotionalBubbles';
import HeroPromotionalStats from './HeroPromotionalStats';

interface HeroProps {
  onDatesChange?: (dates: { start: Date | null; end: Date | null }) => void;
  selectedDates?: { start: Date | null; end: Date | null };
}

export default function Hero({ onDatesChange, selectedDates }: HeroProps) {
  const [searchLocation, setSearchLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Real car rental platform images with different categories
  const heroImages = [
    // Luxury cars
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&h=1080&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=1920&h=1080&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&h=1080&fit=crop&auto=format&q=80',
    // Electric cars
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1920&h=1080&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=1920&h=1080&fit=crop&auto=format&q=80',
    // Classic cars
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&h=1080&fit=crop&auto=format&q=80',
    // SUVs
    'https://images.unsplash.com/photo-1549317336-206569e8475c?w=1920&h=1080&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&auto=format&q=80',
    // Sports cars
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&h=1080&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&h=1080&fit=crop&auto=format&q=80'
  ];

  // Rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const quickStats = [
    { icon: Car, label: 'Multiple Cars', value: 'Available' },
    { icon: Shield, label: '100% Secure', value: 'Payments' },
    { icon: Clock, label: '24/7', value: 'Support' },
    { icon: Star, label: 'Excellent', value: 'Service' }
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
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Promotional Bubbles - Option A: In the red areas */}
      <HeroPromotionalBubbles />
      
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
                Car Rental
              </span>
              <span className="block bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl mt-2">
                Made Simple
              </span>
            </h1>
            
            {/* Enhanced subtitle */}
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
              Discover the perfect vehicle for your journey. From city cars to luxury vehicles, 
              find and book your ideal ride in minutes with Share Wheelz.
            </p>
          </div>

          {/* Enhanced Search Component */}
          <div className="max-w-4xl mx-auto">
            <HeroSearch 
              onDatesChange={onDatesChange}
              initialDates={selectedDates}
            />
          </div>

          {/* Promotional Stats - Option B: Replace black feature sections */}
          <HeroPromotionalStats />

          {/* CTA Buttons */}
          <div className="flex justify-center items-center">
            <Link href="/cars">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Car className="mr-2 h-5 w-5" />
                Browse Vehicles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
  );
}
