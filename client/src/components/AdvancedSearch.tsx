import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Filter, 
  X, 
  Car, 
  Fuel, 
  Settings,
  Star,
  Shield,
  Zap
} from 'lucide-react';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

interface SearchFilters {
  location: string;
  startDate: string;
  endDate: string;
  priceRange: [number, number];
  fuelType: string[];
  transmission: string;
  seats: number;
  features: string[];
  rating: number;
  verifiedOnly: boolean;
}

export default function AdvancedSearch({ onSearch, onClear }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    startDate: '',
    endDate: '',
    priceRange: [20, 200],
    fuelType: [],
    transmission: '',
    seats: 0,
    features: [],
    rating: 0,
    verifiedOnly: false
  });

  const fuelTypes = [
    { value: 'essence', label: 'Petrol', icon: Fuel },
    { value: 'diesel', label: 'Diesel', icon: Fuel },
    { value: 'electric', label: 'Electric', icon: Zap },
    { value: 'hybrid', label: 'Hybrid', icon: Zap }
  ];

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

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFuelTypeToggle = (fuelType: string) => {
    setFilters(prev => ({
      ...prev,
      fuelType: prev.fuelType.includes(fuelType)
        ? prev.fuelType.filter(f => f !== fuelType)
        : [...prev.fuelType, fuelType]
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const activeFiltersCount = [
    filters.location,
    filters.startDate,
    filters.endDate,
    filters.fuelType.length > 0,
    filters.transmission,
    filters.seats > 0,
    filters.features.length > 0,
    filters.rating > 0,
    filters.verifiedOnly
  ].filter(Boolean).length;

  return (
    <div className="w-full">
      {/* Quick Search Bar */}
      <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-xl backdrop-blur-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Where are you going?"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="pl-10 glass-card border border-white/20"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="pl-10 glass-card border border-white/20"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="pl-10 glass-card border border-white/20"
              />
            </div>
          </div>
          
          <Button 
            onClick={() => onSearch(filters)}
            className="gradient-primary text-white border-0 shadow-lg hover:shadow-xl interactive-button"
          >
            <Search className="h-5 w-5 mr-2" />
            Search Cars
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="glass-card border border-white/20 hover:scale-105 transition-transform"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 gradient-accent text-white border-0">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <Card className="modern-card border-0 shadow-xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Filters
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="hover:scale-110 transition-transform"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Price Range: £{filters.priceRange[0]} - £{filters.priceRange[1]} per day
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => handleFilterChange('priceRange', value)}
                max={500}
                min={10}
                step={10}
                className="w-full"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="text-sm font-medium mb-3 block">Fuel Type</label>
              <div className="flex flex-wrap gap-2">
                {fuelTypes.map((fuel) => {
                  const Icon = fuel.icon;
                  const isSelected = filters.fuelType.includes(fuel.value);
                  return (
                    <Button
                      key={fuel.value}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFuelTypeToggle(fuel.value)}
                      className={`${
                        isSelected 
                          ? 'gradient-success text-white border-0' 
                          : 'glass-card border border-white/20 hover:scale-105 transition-transform'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {fuel.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Transmission & Seats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Transmission</label>
                <Select value={filters.transmission} onValueChange={(value) => handleFilterChange('transmission', value)}>
                  <SelectTrigger className="glass-card border border-white/20">
                    <SelectValue placeholder="Any transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any transmission</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Seats</label>
                <Select value={filters.seats.toString()} onValueChange={(value) => handleFilterChange('seats', parseInt(value))}>
                  <SelectTrigger className="glass-card border border-white/20">
                    <SelectValue placeholder="Any number of seats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any number of seats</SelectItem>
                    <SelectItem value="2">2+ seats</SelectItem>
                    <SelectItem value="4">4+ seats</SelectItem>
                    <SelectItem value="5">5+ seats</SelectItem>
                    <SelectItem value="7">7+ seats</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="text-sm font-medium mb-3 block">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={filters.features.includes(feature)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleFeatureToggle(feature);
                        } else {
                          handleFeatureToggle(feature);
                        }
                      }}
                    />
                    <label htmlFor={feature} className="text-sm cursor-pointer">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating & Verification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Minimum Rating: {filters.rating > 0 ? `${filters.rating}+ stars` : 'Any rating'}
                </label>
                <Slider
                  value={[filters.rating]}
                  onValueChange={(value) => handleFilterChange('rating', value[0])}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={filters.verifiedOnly}
                  onCheckedChange={(checked) => handleFilterChange('verifiedOnly', checked)}
                />
                <label htmlFor="verified" className="text-sm cursor-pointer flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  Verified owners only
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-white/20">
              <Button 
                onClick={() => onSearch(filters)}
                className="flex-1 gradient-primary text-white border-0 shadow-lg hover:shadow-xl interactive-button"
              >
                <Search className="h-5 w-5 mr-2" />
                Apply Filters
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setFilters({
                    location: '',
                    startDate: '',
                    endDate: '',
                    priceRange: [20, 200],
                    fuelType: [],
                    transmission: '',
                    seats: 0,
                    features: [],
                    rating: 0,
                    verifiedOnly: false
                  });
                  onClear();
                }}
                className="glass-card border border-white/20 hover:scale-105 transition-transform"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}










