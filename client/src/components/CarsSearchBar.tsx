import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Search, 
  MapPin, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Fuel, 
  Settings, 
  RotateCcw,
  Filter,
  Zap,
  Car
} from 'lucide-react';
import Calendar from './Calendar';

interface CarsSearchBarProps {
  filters: {
    location: string;
    minPrice: string;
    maxPrice: string;
    fuelType: string;
    transmission: string;
    startDate: string;
    endDate: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export default function CarsSearchBar({ filters, onFilterChange }: CarsSearchBarProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: filters.startDate ? new Date(filters.startDate) : null,
    end: filters.endDate ? new Date(filters.endDate) : null
  });

  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setSelectedDates({ start, end });
    if (start) onFilterChange('startDate', start.toISOString());
    if (end) onFilterChange('endDate', end.toISOString());
    // Auto-close calendar only when both dates are selected
    if (start && end) {
      setTimeout(() => setShowCalendar(false), 300);
    }
  };

  const handleSearch = () => {
    // Trigger search by updating filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    window.location.href = `/cars?${params.toString()}`;
  };

  const clearFilters = () => {
    Object.keys(filters).forEach(key => {
      onFilterChange(key, '');
    });
    setSelectedDates({ start: null, end: null });
  };

  const getDateRangeText = () => {
    if (!selectedDates.start) return 'Select dates';
    if (!selectedDates.end) return `Start: ${selectedDates.start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - Select end date`;
    
    const start = selectedDates.start.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    });
    const end = selectedDates.end.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    });
    
    return `${start} - ${end}`;
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="w-full">
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          {/* Main Search Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="London, Manchester..."
                value={filters.location}
                onChange={(e) => onFilterChange('location', e.target.value)}
                className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                Date Range
              </Label>
              <Button
                variant="outline"
                onClick={() => setShowCalendar(true)}
                className="w-full justify-start text-left font-normal border-gray-200 hover:border-blue-500 hover:bg-blue-50"
              >
                {getDateRangeText()}
              </Button>
            </div>

            {/* Min Price */}
            <div className="space-y-2">
              <Label htmlFor="minPrice" className="text-sm font-medium text-gray-700">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Min Price (£)
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="20"
                value={filters.minPrice}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Max Price */}
            <div className="space-y-2">
              <Label htmlFor="maxPrice" className="text-sm font-medium text-gray-700">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Max Price (£)
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="600"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button 
              onClick={handleSearch}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Cars
            </Button>
            {hasActiveFilters && (
              <Button 
                variant="outline"
                onClick={clearFilters}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          <div className="border-t pt-6">
            <div className="flex items-center mb-4">
              <Filter className="w-4 h-4 mr-2 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">Advanced Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fuel Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  <Fuel className="w-4 h-4 inline mr-1" />
                  Fuel Type
                </Label>
                <Select value={filters.fuelType} onValueChange={(value) => onFilterChange('fuelType', value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="All Fuel Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Fuel Types</SelectItem>
                    <SelectItem value="essence">
                      <div className="flex items-center">
                        <Fuel className="w-4 h-4 mr-2" />
                        Petrol
                      </div>
                    </SelectItem>
                    <SelectItem value="diesel">
                      <div className="flex items-center">
                        <Fuel className="w-4 h-4 mr-2" />
                        Diesel
                      </div>
                    </SelectItem>
                    <SelectItem value="electric">
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-green-600" />
                        Electric
                      </div>
                    </SelectItem>
                    <SelectItem value="hybrid">
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-blue-600" />
                        Hybrid
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transmission */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  <Settings className="w-4 h-4 inline mr-1" />
                  Transmission
                </Label>
                <Select value={filters.transmission} onValueChange={(value) => onFilterChange('transmission', value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="All Transmissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Transmissions</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-6 mt-6">
            <div className="flex items-center mb-4">
              <Car className="w-4 h-4 mr-2 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">Quick Actions</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFilterChange('fuelType', 'electric')}
                className={`${filters.fuelType === 'electric' ? 'bg-green-50 border-green-500 text-green-700' : ''}`}
              >
                <Zap className="w-4 h-4 mr-1" />
                Electric Only
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onFilterChange('minPrice', '50');
                  onFilterChange('maxPrice', '150');
                }}
                className={`${filters.minPrice === '50' && filters.maxPrice === '150' ? 'bg-blue-50 border-blue-500 text-blue-700' : ''}`}
              >
                Mid Range
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFilterChange('transmission', 'automatic')}
                className={`${filters.transmission === 'automatic' ? 'bg-purple-50 border-purple-500 text-purple-700' : ''}`}
              >
                Automatic Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Popup */}
      {showCalendar && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-[9998]"
            onClick={(e) => {
              e.stopPropagation();
              // Only close if both dates are selected
              if (selectedDates.start && selectedDates.end) {
                setShowCalendar(false);
              }
            }}
          />
          {/* Calendar */}
          <div 
            className="fixed z-[9999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar
              selectedDates={selectedDates}
              onDateSelect={handleDateSelect}
              onClose={() => setShowCalendar(false)}
              className="shadow-2xl"
            />
          </div>
        </>
      )}
    </div>
  );
}