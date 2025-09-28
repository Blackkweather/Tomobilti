import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  X, 
  Star, 
  MapPin, 
  Fuel, 
  Zap, 
  Users, 
  Calendar, 
  Shield,
  Heart,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { Car } from '@shared/schema';

interface CarComparisonProps {
  cars: (Car & {
    owner?: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
    rating?: number;
    reviewCount?: number;
  })[];
  onRemoveCar: (carId: string) => void;
  onBookCar: (carId: string) => void;
  onAddToFavorites: (carId: string) => void;
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

export default function CarComparison({ cars, onRemoveCar, onBookCar, onAddToFavorites }: CarComparisonProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const features = [
    'GPS Navigation',
    'Bluetooth',
    'Air Conditioning',
    'Parking Sensors',
    'Cruise Control',
    'Sunroof',
    'Leather Seats',
    'USB Charging'
  ];

  const getComparisonData = () => {
    if (cars.length === 0) return null;

    const data = {
      prices: cars.map(car => car.pricePerDay),
      ratings: cars.map(car => car.rating || 4.5),
      fuelTypes: cars.map(car => car.fuelType),
      transmissions: cars.map(car => car.transmission),
      seats: cars.map(car => car.seats || 5),
      years: cars.map(car => car.year || 2020)
    };

    return {
      cheapest: Math.min(...data.prices),
      mostExpensive: Math.max(...data.prices),
      highestRated: Math.max(...data.ratings),
      lowestRated: Math.min(...data.ratings)
    };
  };

  const comparisonData = getComparisonData();

  if (cars.length === 0) {
    return (
      <Card className="modern-card border-0 shadow-xl backdrop-blur-md">
        <CardContent className="p-8 text-center">
          <div className="text-gray-500 mb-4">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No cars to compare</h3>
            <p className="text-sm">Add cars to your comparison to see detailed comparisons</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comparison Summary */}
      {comparisonData && (
        <Card className="gradient-primary text-white border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Comparison Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">£{comparisonData.cheapest}</div>
                <div className="text-sm opacity-90">Cheapest</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">£{comparisonData.mostExpensive}</div>
                <div className="text-sm opacity-90">Most Expensive</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{comparisonData.highestRated}★</div>
                <div className="text-sm opacity-90">Highest Rated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{cars.length}</div>
                <div className="text-sm opacity-90">Cars Compared</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cars Grid */}
      <div className={`grid gap-6 ${cars.length === 1 ? 'grid-cols-1' : cars.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {cars.map((car, index) => {
          const FuelIcon = fuelTypeIcons[car.fuelType as keyof typeof fuelTypeIcons] || Fuel;
          const isCheapest = comparisonData && car.pricePerDay === comparisonData.cheapest;
          const isHighestRated = comparisonData && car.rating === comparisonData.highestRated;
          
          return (
            <Card key={car.id} className="modern-card hover:scale-105 transition-all duration-300 relative group">
              {/* Remove Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 glass-card rounded-full w-8 h-8 border border-white/20 hover:scale-110 transition-all"
                onClick={() => onRemoveCar(car.id)}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Best Value Badge */}
              {isCheapest && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="gradient-success text-white border-0 shadow-lg">
                    Best Value
                  </Badge>
                </div>
              )}

              {/* Highest Rated Badge */}
              {isHighestRated && (
                <div className="absolute top-2 left-20 z-10">
                  <Badge className="gradient-accent text-white border-0 shadow-lg">
                    Top Rated
                  </Badge>
                </div>
              )}

              <div className="relative">
                <img 
                  src={car.image || '/api/placeholder/400/300'} 
                  alt={car.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Favorite Button */}
                <div className="absolute top-4 right-12">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="glass-card rounded-full w-10 h-10 border border-white/20 hover:scale-110 transition-all"
                    onClick={() => onAddToFavorites(car.id)}
                  >
                    <Heart className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                {/* Title & Location */}
                <div>
                  <h3 className="font-bold text-lg line-clamp-1 mb-1">
                    {car.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{car.city}</span>
                  </div>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{car.rating?.toFixed(1) || '4.5'}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({car.reviewCount || 24} reviews)
                  </span>
                </div>

                {/* Car Details */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <FuelIcon className="h-4 w-4 text-gray-500" />
                    <span>{fuelTypeLabels[car.fuelType as keyof typeof fuelTypeLabels]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{car.seats || 5} seats</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{car.year || 2020}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* Owner Info */}
                {car.owner && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={car.owner.profileImage} alt={car.owner.firstName} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {car.owner.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">
                      {car.owner.firstName} {car.owner.lastName}
                    </span>
                  </div>
                )}

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">
                        £{car.pricePerDay}
                      </span>
                      <span className="text-sm text-gray-500">/day</span>
                    </div>
                    {isCheapest && (
                      <span className="text-xs text-green-600 font-medium">
                        Best price!
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => onBookCar(car.id)}
                    className="gradient-primary text-white border-0 shadow-lg hover:shadow-xl interactive-button"
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Comparison */}
      {cars.length > 1 && (
        <Card className="modern-card border-0 shadow-xl backdrop-blur-md">
          <CardHeader>
            <CardTitle>Features Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Feature</th>
                    {cars.map((car) => (
                      <th key={car.id} className="text-center py-2 min-w-[150px]">
                        <div className="font-semibold text-sm">{car.title}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature) => (
                    <tr key={feature} className="border-b border-gray-100">
                      <td className="py-3 font-medium">{feature}</td>
                      {cars.map((car) => (
                        <td key={car.id} className="text-center py-3">
                          <div className="flex justify-center">
                            {Math.random() > 0.5 ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



