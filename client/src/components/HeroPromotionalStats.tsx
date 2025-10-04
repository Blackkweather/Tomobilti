import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CurrencyPound,
  Calendar,
  Shield,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Heart,
  Car
} from 'lucide-react';

interface PromotionalStat {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  description: string;
  link: string;
  colors: {
    primary: string;
    accent: string;
  };
  badge?: string;
}

const promotionalStats: PromotionalStat[] = [
  {
    icon: CurrencyPound,
    label: 'Earn up to',
    value: '£280/month',
    description: 'Passive income from idle car',
    link: '/become-member',
    colors: {
      primary: 'from-green-400 to-green-600',
      accent: 'text-green-300'
    },
    badge: 'Most Popular'
  },
  {
    icon: Calendar,
    label: 'Weekend rental',
    value: 'pays insurance',
    description: 'Quick cash from spare car',
    link: '/add-car',
    colors: {
      primary: 'from-blue-400 to-blue-600',
      accent: 'text-blue-300'
    },
    badge: 'Quick Setup'
  },
  {
    icon: Shield,
    label: '100% Secure',
    value: 'Platform',
    description: 'Fully insured vehicles',
    link: '/safety',
    colors: {
      primary: 'from-purple-400 to-purple-600',
      accent: 'text-purple-300'
    },
    badge: 'Insured'
  },
  {
    icon: TrendingUp,
    label: 'Easy Passive',
    value: 'Income',
    description: 'Simple money making',
    link: '/become-member',
    colors: {
      primary: 'from-orange-400 to-orange-600',
      accent: 'text-orange-300'
    },
    badge: 'Automated'
  }
];

export default function HeroPromotionalStats() {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
      {promotionalStats.map((stat, index) => {
        const Icon = stat.icon;
        const isHovered = hoveredStat === index.toString();
        
        return (
          <Link key={index} href={stat.link}>
            <div className="text-center group cursor-pointer"
              onMouseEnter={() => setHoveredStat(index.toString())}
              onMouseLeave={() => setHoveredStat(null)}
            >
              {/* Icon Circle with Enhanced Effects */}
              <div className={`
                relative inline-flex items-center justify-center w-20 h-20 
                bg-white/20 rounded-full mb-4 group-hover:bg-white/30 
                transition-all duration-300 backdrop-blur-sm
                border border-white/30
                ${isHovered ? 'scale-110 shadow-2xl' : ''}
              `}>
                {/* Inner gradient circle */}
                <div className={`
                  absolute inset-2 rounded-full bg-gradient-to-br ${stat.colors.primary}
                  opacity-90 group-hover:opacity-100 transition-opacity duration-300
                `}>
                  <Icon className={`absolute inset-0 m-auto h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300 ${isHovered ? 'animate-pulse' : ''}`} />
                </div>
                
                {/* Sparkle effect on hover */}
                <div className={`
                  absolute -top-1 -right-1 opacity-0 transition-all duration-300
                  ${isHovered ? 'opacity-100 animate-pulse' : ''}
                `}>
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </div>
              </div>

              {/* Badge */}
              {stat.badge && (
                <Badge className={`
                  mb-2 bg-white/20 text-white border-white/30 backdrop-blur-sm
                  ${isHovered ? 'bg-white/30 scale-105' : ''}
                  transition-all duration-300 text-xs px-2 py-1
                `}>
                  {stat.badge === 'Most Popular' && <Target className="w-3 h-3 mr-1" />}
                  {stat.badge === 'Quick Setup' && <Zap className="w-3 h-3 mr-1" />}
                  {stat.badge === 'Insured' && <Shield className="w-3 h-3 mr-1" />}
                  {stat.badge === 'Automated' && <Car className="w-3 h-3 mr-1" />}
                  {stat.badge}
                </Badge>
              )}

              {/* Main Text */}
              <div className={`
                text-2xl font-bold text-white mb-1 transition-all duration-300
                ${isHovered ? 'scale-105' : ''}
              `}>
                {stat.label}
              </div>
              
              {/* Value/Subtitle */}
              <div className={`
                text-white/80 text-sm mb-2 transition-all duration-300
                ${isHovered ? 'scale-105 text-white' : ''}
              `}>
                {stat.value}
              </div>
              
              {/* Description */}
              <div className={`
                text-white/70 text-xs leading-tight transition-all duration-300
                ${isHovered ? 'scale-105 text-white/90' : ''}
              `}>
                {stat.description}
              </div>

              {/* CTA Arrow */}
              <div className={`
                inline-flex mt-2 transition-all duration-300
                ${isHovered ? 'translate-x-1' : ''}
              `}>
                <ArrowRight className={`w-4 h-4 ${stat.colors.accent}`} />
              </div>

              {/* Pulse effect background */}
              <div className={`
                absolute inset-0 rounded-full opacity-0 transition-opacity duration-500
                bg-gradient-to-r ${stat.colors.primary}
                ${isHovered ? 'opacity-20 animate-pulse' : ''}
              `}></div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
