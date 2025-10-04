import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  CurrencyPound,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  Car as CarIcon,
  Clock,
  Heart,
  ArrowRight,
  Star,
  Users,
  Award,
  Sparkles
} from 'lucide-react';

interface PromotionalBubble {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  amount?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  badge?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const promotionalBubbles: PromotionalBubble[] = [
  {
    id: 'earn-money',
    icon: CurrencyPound,
    title: "Start earning up to",
    subtitle: "£280/month",
    amount: "£280",
    description: "Is your car sitting idle? Start earning up to £280/month in just a few days.",
    buttonText: "Start Earning",
    buttonLink: "/become-member",
    badge: "Most Popular",
    colors: {
      primary: "bg-gradient-to-br from-green-400 to-green-600",
      secondary: "bg-green-50",
      accent: "text-green-700"
    }
  },
  {
    id: 'weekend-rental',
    icon: Calendar,
    title: "Weekend rental",
    subtitle: "pays insurance",
    description: "One weekend rental could pay off your annual insurance.",
    buttonText: "List Your Car",
    buttonLink: "/add-car",
    badge: "Quick Setup",
    colors: {
      primary: "bg-gradient-to-br from-blue-400 to-blue-600",
      secondary: "bg-blue-50",
      accent: "text-blue-700"
    }
  },
  {
    id: 'secure-platform',
    icon: Shield,
    title: "100% Secure",
    subtitle: "Platform",
    description: "Fully insured vehicles with comprehensive protection for all users.",
    buttonText: "Learn More",
    buttonLink: "/safety",
    badge: "Insured",
    colors: {
      primary: "bg-gradient-to-br from-purple-400 to-purple-600",
      secondary: "bg-purple-50",
      accent: "text-purple-700"
    }
  },
  {
    id: 'easy-money',
    icon: TrendingUp,
    title: "Easy Passive",
    subtitle: "Income",
    description: "Set your availability and let us handle the bookings. Earn while you relax.",
    buttonText: "Get Started",
    buttonLink: "/become-member",
    badge: "Automated",
    colors: {
      primary: "bg-gradient-to-br from-orange-400 to-orange-600",
      secondary: "bg-orange-50",
      accent: "text-orange-700"
    }
  }
];

export default function PromotionalBubbles() {
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50 rounded-3xl -m-4"></div>
      
      {/* Chat bubbles background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-6 gap-8 h-full">
          {Array.from({ length: 24 }).map((_, i) => (
            <MessageBubbleIcon key={i} className="w-8 h-8 text-gray-400" />
          ))}
        </div>
      </div>

      <div className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Why Choose Tomobilti?
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Turn Your Car Into Profit
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of car owners earning passive income. Your vehicle could be worth more parked than driven!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {promotionalBubbles.map((bubble) => {
              const Icon = bubble.icon;
              const isHovered = hoveredBubble === bubble.id;
              
              return (
                <div
                  key={bubble.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredBubble(bubble.id)}
                  onMouseLeave={() => setHoveredBubble(null)}
                >
                  {/* Chat Bubble Background */}
                  <div className={`
                    absolute inset-0 rounded-3xl shadow-lg transition-all duration-500
                    ${isHovered ? 'shadow-2xl scale-110' : 'shadow-lg'}
                    ${bubble.colors.secondary}
                  `}>
                    {/* Bubble Tail */}
                    <div className={`
                      absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0
                      border-l-[24px] border-r-[24px] border-t-[24px]
                      border-l-transparent border-r-transparent
                      ${bubble.colors.secondary.replace('bg-', 'border-')}
                    `}></div>
                  </div>

                  {/* Content */}
                  <Card className={`
                    relative border-0 bg-white/90 backdrop-blur-sm
                    rounded-3xl overflow-hidden transition-all duration-500
                    ${isHovered ? 'translate-y-[-8px] shadow-2xl' : ''}
                    hover:cursor-pointer
                  `}>
                    <CardContent className="p-6 text-center relative">
                      {/* Badge */}
                      {bubble.badge && (
                        <Badge className={`
                          absolute -top-2 right-4 px-3 py-1 text-xs font-semibold
                          ${bubble.colors.accent} bg-white shadow-md
                        `}>
                          {bubble.badge}
                        </Badge>
                      )}

                      {/* Icon Circle */}
                      <div className={`
                        w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                        ${bubble.colors.primary}
                        transition-all duration-500
                        ${isHovered ? 'scale-110 rotate-6' : ''}
                      `}>
                        <Icon className={`w-8 h-8 text-white ${isHovered ? 'animate-pulse' : ''}`} />
                      </div>

                      {/* Title */}
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-800 text-sm mb-1">
                          {bubble.title}
                        </h3>
                        <div className={`
                          text-2xl font-bold mb-2
                          ${bubble.colors.accent}
                          ${isHovered ? 'animate-pulse' : ''}
                        `}>
                          {bubble.subtitle}
                        </div>
                        {bubble.amount && (
                          <div className="text-3xl font-black text-green-600 mb-2">
                            {bubble.amount}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                        {bubble.description}
                      </p>

                      {/* Button */}
                      <Link href={bubble.buttonLink}>
                        <Button 
                          size="sm" 
                          className={`
                            w-full group/button transition-all duration-300
                            ${bubble.colors.primary}
                            hover:shadow-lg hover:scale-105
                          `}
                        >
                          {bubble.buttonText}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/button:translate-x-1 transition-transform" />
                        </Button>
                      </Link>

                      {/* Floating Elements */}
                      <div className={`
                        absolute top-4 left-4 opacity-0 transition-all duration-500
                        ${isHovered ? 'opacity-60 animate-bounce' : ''}
                      `}>
                        <Sparkles className={`w-4 h-4 ${bubble.colors.accent}`} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 mb-6">
              Over <strong>5,000+ car owners</strong> are already earning with Tomobilti
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>5,000+ Members</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                <span>100% Insured</span>
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1" />
                <span>ISO Certified</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                <span>Loved Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Message Bubble Icon Component
function MessageBubbleIcon({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L7 15v1c0 1.1.9 2 2 2v1.93zm7.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    </div>
  );
}
