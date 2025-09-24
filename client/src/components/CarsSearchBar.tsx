import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Calendar as CalendarIcon, 
  MapPin, 
  Filter,
  RotateCcw
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
  onClearFilters: () => void;
  onSearch: () => void;
}

export default function CarsSearchBar({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onSearch 
}: CarsSearchBarProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: filters.startDate ? new Date(filters.startDate) : null,
    end: filters.endDate ? new Date(filters.endDate) : null
  });

  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setSelectedDates({ start, end });
    if (start) onFilterChange('startDate', start.toISOString());
    if (end) onFilterChange('endDate', end.toISOString());
    if (start && end) {
      setShowCalendar(false);
    }
  };

  const getDateRangeText = () => {
    if (!selectedDates.start) return 'Select dates';
    if (!selectedDates.end) return 'Select end date';
    
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

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <Card className="shadow-lg border-2 border-blue-100">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Search & Filter Cars</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="London, Manchester..."
                  value={filters.location}
                  onChange={(e) => onFilterChange('location', e.target.value)}
                />
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Date Range
                </Label>
                <Button
                  variant="outline"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {getDateRangeText()}
                </Button>
              </div>

              {/* Min Price */}
              <div className="space-y-2">
                <Label htmlFor="minPrice">Min Price (£)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="20"
                  value={filters.minPrice}
                  onChange={(e) => onFilterChange('minPrice', e.target.value)}
                />
              </div>

              {/* Max Price */}
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Max Price (£)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="600"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            {/* Calendar Popup */}
            {showCalendar && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black/20 z-[9998]"
                  onClick={() => setShowCalendar(false)}
                />
                {/* Calendar */}
                <div className="fixed z-[9999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Calendar
                    selectedDates={selectedDates}
                    onDateSelect={handleDateSelect}
                    className="shadow-2xl"
                  />
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onSearch}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Cars
              </Button>
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">Advanced Filters</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fuel Type */}
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={filters.fuelType || 'all'} onValueChange={(value) => onFilterChange('fuelType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="essence">Petrol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transmission */}
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={filters.transmission || 'all'} onValueChange={(value) => onFilterChange('transmission', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Label>Quick Actions</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onFilterChange('fuelType', 'electric');
                    onFilterChange('transmission', 'automatic');
                  }}
                  className="text-xs"
                >
                  Electric Only
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onFilterChange('minPrice', '50');
                    onFilterChange('maxPrice', '200');
                  }}
                  className="text-xs"
                >
                  Mid Range
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
