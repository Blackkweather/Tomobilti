import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Fuel, Zap, Heart } from 'lucide-react';

interface CarCardProps {
  id: string;
  title: string;
  location: string;
  pricePerDay: number;
  currency: string;
  rating: number;
  reviewCount: number;
  fuelType: 'essence' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  seats: number;
  image: string;
  ownerName: string;
  ownerImage?: string;
  isAvailable: boolean;
}

const fuelTypeLabels = {
  essence: 'Essence',
  diesel: 'Diesel', 
  electric: 'Électrique',
  hybrid: 'Hybride'
};

const fuelTypeIcons = {
  essence: Fuel,
  diesel: Fuel,
  electric: Zap,
  hybrid: Zap
};

export default function CarCard({
  id,
  title,
  location,
  pricePerDay,
  currency,
  rating,
  reviewCount,
  fuelType,
  transmission,
  seats,
  image,
  ownerName,
  ownerImage,
  isAvailable
}: CarCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  
  const FuelIcon = fuelTypeIcons[fuelType];

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleBook = () => {
    // Handle booking logic
  };

  const handleViewDetails = () => {
    // Handle view details logic
  };

  return (
    <Card className="group overflow-hidden hover-elevate border-card-border" data-testid={`card-car-${id}`}>
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid={`img-car-${id}`}
        />
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon" 
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 hover-elevate active-elevate-2"
          onClick={handleFavorite}
          data-testid={`button-favorite-${id}`}
        >
          <Heart 
            className={`h-4 w-4 ${isFavorited ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`}
          />
        </Button>

        {/* Availability Status */}
        <Badge 
          variant={isAvailable ? "default" : "secondary"}
          className="absolute top-2 left-2"
        >
          {isAvailable ? 'Disponible' : 'Indisponible'}
        </Badge>

        {/* Fuel Type Badge */}
        <Badge 
          variant="outline" 
          className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm"
        >
          <FuelIcon className="h-3 w-3 mr-1" />
          {fuelTypeLabels[fuelType]}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title & Location */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-1" data-testid={`text-car-title-${id}`}>
            {title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span data-testid={`text-car-location-${id}`}>{location}</span>
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
            ({reviewCount} avis)
          </span>
        </div>

        {/* Car Details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span data-testid={`text-car-transmission-${id}`}>
            {transmission === 'automatic' ? 'Automatique' : 'Manuelle'}
          </span>
          <span data-testid={`text-car-seats-${id}`}>
            {seats} places
          </span>
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Avatar className="h-6 w-6">
            <AvatarImage src={ownerImage} alt={ownerName} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {ownerName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground" data-testid={`text-car-owner-${id}`}>
            Propriétaire: {ownerName}
          </span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-bold text-primary" data-testid={`text-car-price-${id}`}>
              {pricePerDay} {currency}
            </span>
            <span className="text-sm text-muted-foreground">/jour</span>
          </div>
          
          {isAvailable ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewDetails}
                data-testid={`button-details-${id}`}
                className="hover-elevate active-elevate-2"
              >
                Détails
              </Button>
              <Button 
                onClick={handleBook}
                size="sm"
                data-testid={`button-book-${id}`}
                className="hover-elevate active-elevate-2"
              >
                Réserver
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" disabled>
              Indisponible
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}