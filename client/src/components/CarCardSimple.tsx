import { Link } from 'wouter';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, MapPin, Fuel, Users, Settings, Calendar as CalendarIcon, Heart, Eye } from 'lucide-react';
import type { Car } from '@shared/schema';

interface CarCardSimpleProps {
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

export default function CarCardSimple({ car, isFavorited = false, onToggleFavorite }: CarCardSimpleProps) {
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

  const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Owner';

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden">
      <div className="relative">
        {/* Car Image */}
        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={`${make} ${model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <span>No image available</span>
            </div>
          )}
          

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 transition-colors duration-200"
            onClick={onToggleFavorite}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>

          {/* Quick view button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Link href={`/cars/${id}`}>
              <Button className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg">
                <Eye className="w-4 h-4 mr-2" />
                Quick View
              </Button>
            </Link>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Car Title and Location */}
          <div className="mb-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
              {title || `${make} ${model}`}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{city || location}</span>
            </div>
          </div>

          {/* Car Details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Fuel className="w-4 h-4 mr-2 text-blue-600" />
              <span>{fuelTypeLabels[fuelType as keyof typeof fuelTypeLabels] || fuelType}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Settings className="w-4 h-4 mr-2 text-blue-600" />
              <span className="capitalize">{transmission}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-blue-600" />
              <span>{seats} seats</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
              <span>{year}</span>
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
              <span className="text-sm text-gray-600 ml-2">
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Owner Info */}
          <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <div className="h-8 w-8 mr-3 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">
                  {ownerName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{ownerName}</p>
                <div className="flex items-center text-xs text-gray-500">
                  Verified Owner
                </div>
              </div>
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currency} {pricePerDay}
              </div>
              <div className="text-sm text-gray-600">per day</div>
            </div>
            <Link href={`/cars/${id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                View Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
