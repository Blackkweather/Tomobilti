import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { MapPin, Fuel, Zap, Settings, RotateCcw } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

const cities = [
  'London',
  'Manchester', 
  'Birmingham',
  'Liverpool',
  'Leeds',
  'Sheffield',
  'Edinburgh',
  'Glasgow'
];

const fuelTypes = [
  { value: 'essence', label: 'Petrol', icon: Fuel },
  { value: 'diesel', label: 'Diesel', icon: Fuel },
  { value: 'electric', label: 'Electric', icon: Zap },
  { value: 'hybrid', label: 'Hybrid', icon: Zap }
];

export default function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    location: '',
    startDate: '',
    endDate: '',
    priceRange: [20, 80],
    fuelTypes: [] as string[],
    transmission: '',
    seats: '',
    instantBook: false
  });

  const updateFilters = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
    console.log('Filters updated:', newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      location: '',
      startDate: '',
      endDate: '',
      priceRange: [20, 80],
      fuelTypes: [],
      transmission: '',
      seats: '',
      instantBook: false
    };
    setFilters(resetFilters);
    onFiltersChange?.(resetFilters);
    console.log('Filters reset');
  };

  const toggleFuelType = (fuelType: string) => {
    const newFuelTypes = filters.fuelTypes.includes(fuelType)
      ? filters.fuelTypes.filter(f => f !== fuelType)
      : [...filters.fuelTypes, fuelType];
    updateFilters('fuelTypes', newFuelTypes);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Filters
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={resetFilters}
            data-testid="button-reset-filters"
            className="hover-elevate active-elevate-2"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <Select 
            value={filters.location} 
            onValueChange={(value) => updateFilters('location', value)}
          >
            <SelectTrigger data-testid="select-location">
              <SelectValue placeholder="Choose a city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Date Range */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => updateFilters('startDate', e.target.value)}
              data-testid="input-start-date"
            />
          </div>
          
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => updateFilters('endDate', e.target.value)}
              data-testid="input-end-date"
            />
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price per day (£)</Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilters('priceRange', value)}
              max={100}
              min={10}
              step={5}
              className="w-full"
              data-testid="slider-price-range"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>£{filters.priceRange[0]}</span>
            <span>£{filters.priceRange[1]}</span>
          </div>
        </div>

        <Separator />

        {/* Fuel Type */}
        <div className="space-y-3">
          <Label>Fuel Type</Label>
          <div className="flex flex-wrap gap-2">
            {fuelTypes.map(({ value, label, icon: Icon }) => {
              const isSelected = filters.fuelTypes.includes(value);
              return (
                <Badge
                  key={value}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer hover-elevate active-elevate-2 ${
                    isSelected ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => toggleFuelType(value)}
                  data-testid={`badge-fuel-${value}`}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {label}
                </Badge>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Transmission */}
        <div className="space-y-2">
          <Label>Transmission</Label>
          <Select 
            value={filters.transmission} 
            onValueChange={(value) => updateFilters('transmission', value)}
          >
            <SelectTrigger data-testid="select-transmission">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Number of Seats */}
        <div className="space-y-2">
          <Label>Number of Seats</Label>
          <Select 
            value={filters.seats} 
            onValueChange={(value) => updateFilters('seats', value)}
          >
            <SelectTrigger data-testid="select-seats">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 seats</SelectItem>
              <SelectItem value="4">4 seats</SelectItem>
              <SelectItem value="5">5 seats</SelectItem>
              <SelectItem value="7">7+ seats</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}