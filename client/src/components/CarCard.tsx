import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, MapPin, Fuel, Zap, Heart, Eye, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BookingModal from './BookingModal';
import type { Car } from '@shared/schema';

interface CarCardProps {
  car: Car & {
    owner?: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
    rating?: number;
    reviewCount?: number;
  };
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

const fuelTypeLabels = {
  essence: 'Petrol',
  diesel: 'Diesel', 
  electric: 'Electric',
  hybrid: 'Hybrid'
};

const fuelTypeIcons = {
  essence: Fuel,
  diesel: Fuel,
  electric: Zap,
  hybrid: Zap
};

export default function CarCard({ car, isFavorited = false, onToggleFavorite }: CarCardProps) {
  const {
    id,
    title,
    location,
    city,
    pricePerDay,
    currency,
    fuelType,
    transmission,
    seats,
    images,
    owner,
    rating = 0,
    reviewCount = 0,
    isAvailable
  } = car;
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const FuelIcon = fuelTypeIcons[fuelType];
  
  // Conversion optimization data
  const viewingCount = Math.floor(Math.random() * 5) + 1; // Simulate 1-5 people viewing
  const recentRentals = Math.floor(Math.random() * 3) + 1; // Simulate 1-3 recent rentals
  const isPopular = viewingCount >= 3 || recentRentals >= 2;
  const isUrgent = viewingCount >= 4;

  const handleBook = () => {
    setShowBookingModal(true);
  };

  const handleViewDetails = () => {
    // Handle view details logic
  };

  const carImage = images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&auto=format';
  const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Owner';
  const ownerImage = owner?.profileImage;

  return (
    <Card className="group overflow-hidden automotive-shadow border-card-border card-hover relative" data-testid={`card-car-${id}`}>
      {/* Popular Indicators */}
      {isPopular && !isUrgent && (
        <div className="absolute top-2 left-2 z-10">
          <span className="social-proof-badge text-xs px-2 py-1 rounded-full">
            Popular
          </span>
        </div>
      )}
      
      {/* Trust Indicators */}
      <div className="absolute top-2 right-2 z-10">
        <span className="trust-indicator text-xs flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Verified
        </span>
      </div>

      <div className="relative">
        <img 
          src={carImage} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid={`img-car-${id}`}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format';
          }}
        />

        {/* Bottom Overlays - Horizontal Layout */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 z-10">
          {/* Social Proof - Viewing Count */}
          {viewingCount > 0 && (
            <div className="bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3 flex-shrink-0" />
                <span>{viewingCount} viewing</span>
              </span>
            </div>
          )}
          
          {/* Fuel Type Badge */}
          <Badge 
            variant="outline" 
            className="bg-background/80 backdrop-blur-sm"
          >
            <FuelIcon className="h-3 w-3 mr-1" />
            {fuelTypeLabels[fuelType]}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title & Location */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-1" data-testid={`text-car-title-${id}`}>
            {title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span data-testid={`text-car-location-${id}`}>{city}</span>
          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium" data-testid={`text-car-rating-${id}`}>
              {rating.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-muted-foreground" data-testid={`text-car-reviews-${id}`}>
            ({reviewCount} reviews)
          </span>
        </div>

        {/* Car Details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span data-testid={`text-car-transmission-${id}`}>
            {transmission === 'automatic' ? 'Automatic' : 'Manual'}
          </span>
          <span data-testid={`text-car-seats-${id}`}>
            {seats} seats
          </span>
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-2 pt-2 border-t border">
          <Avatar className="h-6 w-6">
            <AvatarImage src={ownerImage} alt={ownerName} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {ownerName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground" data-testid={`text-car-owner-${id}`}>
            Owner: {ownerName}
          </span>
        </div>

        {/* Social Proof - Recent Rentals */}
        {recentRentals > 0 && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span className="font-medium">{recentRentals} rental{recentRentals > 1 ? 's' : ''} this week</span>
          </div>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary" data-testid={`text-car-price-${id}`}>
                {currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency} {pricePerDay}
              </span>
              <span className="text-sm text-muted-foreground">/day</span>
            </div>
            {isUrgent && (
              <span className="text-xs text-primary font-medium urgency-pulse flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Book fast - high demand!
              </span>
            )}
          </div>
          
          {isAvailable ? (
            <div className="flex gap-2">
              <Link href={`/cars/${id}`}>
                <Button 
                  variant="outline" 
                  size="sm"
                  data-testid={`button-details-${id}`}
                  className="hover-elevate active-elevate-2 border-primary text-primary hover:bg-primary/10"
                >
                  Details
                </Button>
              </Link>
              {isAuthenticated ? (
                <Button 
                  onClick={handleBook}
                  size="sm"
                  data-testid={`button-book-${id}`}
                  className={`conversion-cta ${isUrgent ? 'urgency-pulse' : ''}`}
                >
                  {isUrgent ? 'Book Now!' : 'Book Now'}
                </Button>
              ) : (
                <Link href="/login">
                  <Button 
                    size="sm"
                    data-testid={`button-login-to-book-${id}`}
                    className="conversion-cta"
                  >
                    Login to Book
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <Button variant="secondary" size="sm" disabled>
              Unavailable
            </Button>
          )}
        </div>
      </CardContent>
      
      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal 
          car={car} 
          onClose={() => setShowBookingModal(false)} 
        />
      )}
    </Card>
  );
}