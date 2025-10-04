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
  CheckCircle,
  DollarSign
} from 'lucide-react';
// import HeroPromotionalBubbles from './HeroPromotionalBubbles';
// import HeroPromotionalStats from './HeroPromotionalStats';

interface HeroProps {
  onDatesChange?: (dates: { start: Date | null; end: Date | null }) => void;
  selectedDates?: { start: Date | null; end: Date | null };
}

export default function Hero({ onDatesChange, selectedDates }: HeroProps) {
  console.log('Hero component is rendering');
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

  const promotionalStats = [
    { 
      icon: DollarSign, 
      label: 'Earn up to £280/month', 
      value: 'From your idle car!',
      badge: 'Most Popular',
      buttonText: 'Start Earning →',
      bgColor: 'from-green-500/20 to-green-700/20',
      buttonColor: 'from-green-500 to-green-700',
      href: '/become-member'
    },
    { 
      icon: Clock, 
      label: 'Weekend rental', 
      value: 'pays insurance!',
      badge: 'Quick Setup',
      buttonText: 'List My Car →',
      bgColor: 'from-blue-500/20 to-blue-700/20',
      buttonColor: 'from-blue-500 to-blue-700',
      href: '/add-car'
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
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Promotional Bubbles */}
      {/* Left Bubble */}
      <div className="absolute left-4 md:left-8 top-1/4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full w-64 h-64 p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col items-center justify-center relative">
          <div className="absolute right-[-16px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[12px] border-b-[12px] border-l-[16px] border-t-transparent border-b-transparent border-l-white/90"></div>
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">Earn up to</h3>
            <div className="text-lg font-black text-green-600 mb-1">£280/month</div>
            <p className="text-xs text-gray-600 mb-3">From your idle car!</p>
            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2">Most Popular</div>
            <Link href="/become-member">
              <Button size="sm" className="w-full bg-green-500 hover:bg-green-600 text-white text-xs">
                Start Earning →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Bubble */}
      <div className="absolute right-4 md:right-8 top-1/4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full w-64 h-64 p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col items-center justify-center relative">
          <div className="absolute left-[-16px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[12px] border-b-[12px] border-r-[16px] border-t-transparent border-b-transparent border-r-white/90"></div>
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-blue-500 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">Weekend rental</h3>
            <div className="text-lg font-black text-blue-600 mb-1">pays insurance</div>
            <p className="text-xs text-gray-600 mb-3">Quick earnings!</p>
            <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">Quick Setup</div>
            <Link href="/add-car">
              <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs">
                List My Car →
              </Button>
            </Link>
          </div>
        </div>
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

          {/* Promotional Bubbles - Replacing Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {promotionalStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Link key={index} href={stat.href}>
                  <div className={`text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-full w-64 h-64 p-8 mx-auto bg-gradient-to-br ${stat.bgColor} border border-white/20 backdrop-blur-sm relative group`}>
                    {/* Chat tail */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-8 h-4 bg-gradient-to-br from-white/20 to-white/40 transform rotate-180 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex flex-col items-center space-y-4 h-full justify-center">
                      {/* Icon */}
                      <div className={`bg-gradient-to-br ${stat.buttonColor} text-white p-4 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <Icon className="h-8 w-8" />
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <div className="text-white font-bold text-lg leading-tight mb-2">
                          {stat.label}
                        </div>
                        <div className="text-white/80 text-sm mb-3">
                          {stat.value}
                        </div>
                      </div>

                      {/* Badge */}
                      <div className={`bg-gradient-to-r ${stat.buttonColor} text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg opacity-90`}>
                        {stat.badge}
                      </div>

                      {/* Action Button */}
                      <div className={`bg-gradient-to-r ${stat.buttonColor} hover:from-green-600 hover:to-green-800 text-white border-0 rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 text-sm font-medium`}>
                        {stat.buttonText}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

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
