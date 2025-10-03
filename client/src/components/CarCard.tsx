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
  
  const vehicleCategory = getVehicleCategory(make, model);
  const CategoryIcon = vehicleCategoryIcons[vehicleCategory as keyof typeof vehicleCategoryIcons] || Award;
  const carImage = getSpecificCarImage(car);
  const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Owner';
  const ownerImage = owner?.profileImage || `https://ui-avatars.com/api/?name=${ownerName}&background=random`;
  
  // Prepare images array - use car images if available, otherwise fallback to demo image
  const carImages = images && images.length > 0 ? images : [carImage];

  const handleMoreDetails = () => {
    // Navigate to car details page
    window.location.href = `/cars/${id}`;
  };

  const handleBooking = () => {
    // Navigate to car details page and scroll to booking section
    window.location.href = `/cars/${id}#booking`;
  };

  return (
    <Card className="card-modern group hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden hover-lift w-full h-full flex flex-col">
      <div className="relative flex flex-col h-full">
        {/* Car Image Gallery */}
        <div className="relative">
          <ImageGallery 
            images={carImages} 
            alt={`${make} ${model}`}
            className="rounded-t-lg"
          />
          

          {/* Right side overlays - properly spaced */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            {/* Favorite button */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 transition-colors duration-200"
                onClick={onToggleFavorite}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Action Buttons - Below Image */}
        <div className="p-3 sm:p-4 border-b border-gray-100">
          <div className="flex gap-2 sm:gap-3">
            <Button 
              onClick={handleMoreDetails}
              variant="outline"
              size="sm"
              className="flex-1 text-mauve-600 border-mauve-600 hover:bg-mauve-50 px-2 sm:px-3 py-2 text-xs sm:text-sm min-w-0"
            >
              <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">More Details</span>
              <span className="sm:hidden">Details</span>
            </Button>
            <Button 
              onClick={handleBooking}
              size="sm"
              className="flex-1 bg-mauve-600 hover:bg-mauve-700 text-white px-2 sm:px-3 py-2 text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200 min-w-0"
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Book Now</span>
              <span className="sm:hidden">Book</span>
            </Button>
          </div>
        </div>

        <CardContent className="p-4 sm:p-6 flex-grow flex flex-col justify-between">
          {/* Car Title and Location */}
          <div className="mb-3 sm:mb-4">
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1 line-clamp-1">
              {title || `${make} ${model}`}
            </h3>
            <div className="flex items-center text-gray-700 text-xs sm:text-sm font-medium">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{city || location}</span>
            </div>
          </div>

          {/* Car Details */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
            <div className="flex items-center text-xs sm:text-sm text-gray-700 font-medium">
              <Fuel className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-600 flex-shrink-0" />
              <span className="capitalize truncate">{fuelTypeLabels[fuelType as keyof typeof fuelTypeLabels] || fuelType}</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-700 font-medium">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-600 flex-shrink-0" />
              <span className="capitalize truncate">{transmission}</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-700 font-medium">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-600 flex-shrink-0" />
              <span className="truncate">{seats} seats</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-700 font-medium">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-600 flex-shrink-0" />
              <span className="truncate">{year}</span>
            </div>
          </div>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center mb-4">
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
              <span className="text-sm text-gray-700 ml-2 font-medium">
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Owner Info */}
          <div className="flex items-center justify-between mb-4 pt-3 sm:pt-4 border-t border-gray-100">
            <div className="flex items-center min-w-0 flex-1">
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 flex-shrink-0">
                <AvatarImage src={ownerImage} alt={ownerName} />
                <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                  {ownerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{ownerName}</p>
                <div className="flex items-center text-xs text-gray-600 font-medium">
                  <Shield className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">Verified Owner</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mt-auto">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900">
                {formatCurrency(pricePerDay)}
              </div>
              <div className="text-xs sm:text-sm text-gray-700 font-medium">per day</div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
