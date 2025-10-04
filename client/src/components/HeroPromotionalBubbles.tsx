import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CurrencyPound,
  Calendar,
  TrendingUp,
  Zap,
  ArrowRight,
  Sparkles,
  Target,
  Heart
} from 'lucide-react';

interface PromotionalBubble {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  amount: string;
  description: string;
  colors: {
    primary: string;
    accent: string;
  };
}

const heroPromotionalBubbles: PromotionalBubble[] = [
  {
    id: 'earn-money',
    icon: CurrencyPound,
    title: "Earn up to",
    amount: "£280/month",
    description: "Your idle car = Passive income",
    colors: {
      primary: "from-green-400 to-green-600",
      accent: "text-green-300"
    }
  },
  {
    id: 'weekend-payout',
    icon: Calendar,
    title: "Weekend rental",
    amount: "pays insurance",
    description: "Quick cash from your car",
    colors: {
      primary: "from-blue-400 to-blue-600",
      accent: "text-blue-300"
    }
  }
];

export default function HeroPromotionalBubbles() {
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);

  return (
    <>
      {/* Left Side Bubble */}
      <div className="absolute left-8 top-1/4 z-20 group">
        <div className="relative">
          {/* Chat Bubble Background */}
          <div className={`
            absolute inset-0 rounded-2xl shadow-lg transition-all duration-500
            ${hoveredBubble === 'earn-money' ? 'shadow-2xl scale-110' : 'shadow-lg'}
            bg-white/20 backdrop-blur-sm border border-white/30
          `}>
            {/* Bubble Tail */}
            <div className="absolute right-[-16px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[16px] border-b-[16px] border-l-[16px] border-t-transparent border-b-transparent border-l-white/20"></div>
          </div>

          {/* Content */}
          <div className={`
            relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-xs
            transition-all duration-500 cursor-pointer
            ${hoveredBubble === 'earn-money' ? 'translate-y-[-8px] shadow-2xl' : ''}
          `}
          onMouseEnter={() => setHoveredBubble('earn-money')}
          onMouseLeave={() => setHoveredBubble(null)}
          >
            {/* Sparkle Effect */}
            <div className={`
              absolute -top-2 -right-2 opacity-0 transition-all duration-500
              ${hoveredBubble === 'earn-money' ? 'opacity-100 animate-pulse' : ''}
            `}>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>

            {/* Icon Circle */}
            <div className={`
              w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center
              bg-gradient-to-br ${heroPromotionalBubbles[0].colors.primary}
              transition-all duration-500
              ${hoveredBubble === 'earn-money' ? 'scale-110 rotate-6' : ''}
            `}>
              <CurrencyPound className={`w-6 h-6 text-white ${hoveredBubble === 'earn-money' ? 'animate-pulse' : ''}`} />
            </div>

            {/* Content */}
            <h3 className="font-bold text-gray-800 text-lg mb-1 text-center">
              {heroPromotionalBubbles[0].title}
            </h3>
            <div className="text-2xl font-black text-green-600 mb-2 text-center">
              {heroPromotionalBubbles[0].amount}
            </div>
            <p className="text-sm text-gray-600 mb-4 text-center">
              {heroPromotionalBubbles[0].description}
            </p>

            {/* Badge */}
            <Badge className="w-full justify-center mb-4 bg-green-100 text-green-800">
              <Target className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>

            {/* Button */}
            <Link href="/become-member">
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white group"
              >
                Start Earning
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side Bubble */}
      <div className="absolute right-8 top-1/4 z-20 group">
        <div className="relative">
          {/* Chat Bubble Background */}
          <div className={`
            absolute inset-0 rounded-2xl shadow-lg transition-all duration-500
            ${hoveredBubble === 'weekend-payout' ? 'shadow-2xl scale-110' : 'shadow-lg'}
            bg-white/20 backdrop-blur-sm border border-white/30
          `}>
            {/* Bubble Tail */}
            <div className="absolute left-[-16px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[16px] border-b-[16px] border-r-[16px] border-t-transparent border-b-transparent border-r-white/20"></div>
          </div>

          {/* Content */}
          <div className={`
            relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-xs
            transition-all duration-500 cursor-pointer
            ${hoveredBubble === 'weekend-payout' ? 'translate-y-[-8px] shadow-2xl' : ''}
          `}
          onMouseEnter={() => setHoveredBubble('weekend-payout')}
          onMouseLeave={() => setHoveredBubble(null)}
          >
            {/* Sparkle Effect */}
            <div className={`
              absolute -top-2 -left-2 opacity-0 transition-all duration-500
              ${hoveredBubble === 'weekend-payout' ? 'opacity-100 animate-pulse' : ''}
            `}>
              <Heart className="w-5 h-5 text-red-400" />
            </div>

            {/* Icon Circle */}
            <div className={`
              w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center
              bg-gradient-to-br ${heroPromotionalBubbles[1].colors.primary}
              transition-all duration-500
              ${hoveredBubble === 'weekend-payout' ? 'scale-110 rotate-6' : ''}
            `}>
              <Calendar className={`w-6 h-6 text-white ${hoveredBubble === 'weekend-payout' ? 'animate-pulse' : ''}`} />
            </div>

            {/* Content */}
            <h3 className="font-bold text-gray-800 text-lg mb-1 text-center">
              {heroPromotionalBubbles[1].title}
            </h3>
            <div className="text-2xl font-black text-blue-600 mb-2 text-center">
              {heroPromotionalBubbles[1].amount}
            </div>
            <p className="text-sm text-gray-600 mb-4 text-center">
              {heroPromotionalBubbles[1].description}
            </p>

            {/* Badge */}
            <Badge className="w-full justify-center mb-4 bg-blue-100 text-blue-800">
              <Zap className="w-3 h-3 mr-1" />
              Quick Setup
            </Badge>

            {/* Button */}
            <Link href="/add-car">
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white group"
              >
                List My Car
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
