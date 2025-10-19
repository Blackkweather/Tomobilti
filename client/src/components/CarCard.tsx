import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, MapPin, Fuel, Zap, Heart, Shield, Users, Settings, Calendar, Info, BookOpen, Award, Mountain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCarImage, getSpecificCarImage } from '../utils/carImages';
import ImageGallery from './ImageGallery';
import { formatCurrency } from '../utils/currency';
import type { Car } from '@shared/schema';
import { useLocation } from 'wouter';
import { Link } from 'wouter';

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

// Function to determine vehicle category based on make/model
const getVehicleCategory = (make: string, model: string): string => {
  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();
  
  // Electric vehicles
  if (makeLower.includes('tesla') || modelLower.includes('electric') || modelLower.includes('ev')) {
    return 'electric';
  }
  
  // Sports cars
  if (makeLower.includes('porsche') || makeLower.includes('ferrari') || makeLower.includes('lamborghini') || 
      makeLower.includes('mclaren') || makeLower.includes('aston martin') || modelLower.includes('gt') ||
      modelLower.includes('sport') || modelLower.includes('turbo')) {
    return 'sports';
  }
  
  // Luxury sedans
  if (makeLower.includes('mercedes') || makeLower.includes('bmw') || makeLower.includes('audi') ||
      makeLower.includes('lexus') || makeLower.includes('jaguar') || makeLower.includes('maserati')) {
    return 'luxury';
  }
  
  // SUVs
  if (makeLower.includes('range rover') || makeLower.includes('land rover') || makeLower.includes('jeep') ||
      modelLower.includes('suv') || modelLower.includes('x5') || modelLower.includes('q7') ||
      modelLower.includes('glc') || modelLower.includes('evoque') || modelLower.includes('discovery')) {
    return 'suv';
  }
  
  // Classic cars
  if (makeLower.includes('classic') || modelLower.includes('classic') || 
      (parseInt(make) < 2000 && parseInt(make) > 1950)) {
    return 'classic';
  }
  
  // Convertibles
  if (modelLower.includes('convertible') || modelLower.includes('cabrio') || modelLower.includes('roadster')) {
    return 'convertible';
  }
  
  // Default to luxury for premium brands
  return 'luxury';
};

const vehicleCategoryIcons = {
  sports: Zap,
  luxury: Award,
  electric: Zap,
  classic: Calendar,
  convertible: Shield,
  suv: Mountain
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
    year,
    make,
    model,
    images,
    owner,
    rating = 0,
    reviewCount = 0
  } = car;

  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  const vehicleCategory = getVehicleCategory(make, model);
  const CategoryIcon = vehicleCategoryIcons[vehicleCategory as keyof typeof vehicleCategoryIcons] || Award;
  const carImage = getSpecificCarImage(car);
  const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Owner';
  const ownerImage = owner?.profileImage || `https://ui-avatars.com/api/?name=${ownerName}&background=random`;
  
  // Prepare images array - use car images if available, otherwise fallback to demo image
  const carImages = images && images.length > 0 ? images : [carImage];

  const handleMoreDetails = () => {
    if (!id) return;
    setLocation(`/cars/${id}`);
  };

  const handleBooking = () => {
    if (!id) return;
    setLocation(`/cars/${id}#booking`);
  };

  return (
  <Card className="group hover:shadow-2xl transition-all duration-200 border-0 bg-white overflow-hidden h-full flex flex-col relative z-10">
      <div className="relative flex flex-col h-full overflow-hidden">
        {/* Car Image Gallery */}
          <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden">
          <ImageGallery 
            images={carImages} 
            alt={`${make} ${model}`}
            className="w-full h-full"
          />

          {/* Right side overlays */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            {/* Favorite button */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                className="bg-white/95 hover:bg-white shadow-lg text-gray-600 hover:text-red-500 transition-all duration-200"
                onClick={onToggleFavorite}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Action Buttons - Below Image */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 relative z-20">
          <div className="flex gap-3 relative z-20">
            <Button 
              type="button"
              onClick={handleMoreDetails}
              variant="outline"
              size="sm"
              className="flex-1 btn-gray text-sm font-semibold pointer-events-auto"
            >
              <Info className="w-4 h-4 mr-2" />
              <span>More Details</span>
            </Button>
            <Button 
              type="button"
              onClick={handleBooking}
              size="sm"
              className="flex-1 btn-blue text-sm font-semibold pointer-events-auto"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span>Book Now</span>
            </Button>
          </div>
        </div>

        <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
          {/* Car Title and Location */}
          {/* Title and Location */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
              {title || `${make} ${model}`}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{city || location}</span>
            </div>
          </div>

          {/* Car Details */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <Fuel className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
              <span className="capitalize truncate">{fuelTypeLabels[fuelType as keyof typeof fuelTypeLabels] || fuelType}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Settings className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
              <span className="capitalize truncate">{transmission}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
              <span className="truncate">{seats} seats</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
              <span className="truncate">{year}</span>
            </div>
          </div>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Owner Info */}
          <div className="flex items-center mb-6 pt-4 border-t border-gray-100">
            <Avatar className="h-8 w-8 mr-3 flex-shrink-0">
              <AvatarImage src={ownerImage} alt={ownerName} />
              <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                {ownerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{ownerName}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Shield className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">Verified Owner</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(pricePerDay)}
              </div>
              <div className="text-sm text-gray-600">per day</div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
