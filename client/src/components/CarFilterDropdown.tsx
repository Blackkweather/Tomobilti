import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Car, 
  Zap, 
  Fuel, 
  Crown, 
  DollarSign, 
  Users, 
  Settings, 
  Search
} from 'lucide-react';

interface CarFilterDropdownProps {
  onClose?: () => void;
}

export default function CarFilterDropdown({ onClose }: CarFilterDropdownProps) {
  const [, setLocation] = useLocation();
  const [selectedFilters, setSelectedFilters] = useState<{
    fuelType: string[];
    category: string[];
    transmission: string[];
    seats: string[];
  }>({
    fuelType: [],
    category: [],
    transmission: [],
    seats: []
  });

  const filterOptions = {
    fuelType: [
      { id: 'electric', label: 'Electric', icon: Zap, color: 'bg-green-100 text-green-700 border-green-200' },
      { id: 'essence', label: 'Petrol', icon: Fuel, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { id: 'gasoline', label: 'Gasoline', icon: Fuel, color: 'bg-red-100 text-red-700 border-red-200' },
      { id: 'diesel', label: 'Diesel', icon: Fuel, color: 'bg-gray-100 text-gray-700 border-gray-200' }
    ],
    category: [
      { id: 'luxury', label: 'Luxury', icon: Crown, color: 'bg-purple-100 text-purple-700 border-purple-200' },
      { id: 'premium', label: 'Premium', icon: Crown, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
      { id: 'economy', label: 'Economy', icon: DollarSign, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      { id: 'compact', label: 'Compact', icon: Car, color: 'bg-orange-100 text-orange-700 border-orange-200' }
    ],
    transmission: [
      { id: 'automatic', label: 'Automatic', icon: Settings, color: 'bg-teal-100 text-teal-700 border-teal-200' },
      { id: 'manual', label: 'Manual', icon: Settings, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' }
    ],
    seats: [
      { id: '2', label: '2 Seater', icon: Users, color: 'bg-pink-100 text-pink-700 border-pink-200' },
      { id: '4', label: '4 Seater', icon: Users, color: 'bg-rose-100 text-rose-700 border-rose-200' },
      { id: '5', label: '5 Seater', icon: Users, color: 'bg-violet-100 text-violet-700 border-violet-200' },
      { id: '7', label: '7+ Seater', icon: Users, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    ]
  };

  const toggleFilter = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      fuelType: [],
      category: [],
      transmission: [],
      seats: []
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Add selected filters to URL params
    if (selectedFilters.fuelType.length > 0) {
      // For now, take the first fuel type selected (single selection in backend)
      params.set('fuelType', selectedFilters.fuelType[0]);
    }
    if (selectedFilters.category.length > 0) {
      // Category filtering happens client-side
      params.set('category', selectedFilters.category[0]);
    }
    if (selectedFilters.transmission.length > 0) {
      params.set('transmission', selectedFilters.transmission[0]);
    }
    if (selectedFilters.seats.length > 0) {
      params.set('seats', selectedFilters.seats[0]);
    }

    // Navigate to cars page with filters
    const queryString = params.toString();
    setLocation(`/cars${queryString ? `?${queryString}` : ''}`);
    
    // Trigger custom event to notify Cars page of URL change
    window.dispatchEvent(new CustomEvent('urlchange'));
    
    // Close dropdown
    if (onClose) onClose();
  };

  const getTotalSelectedCount = () => {
    return Object.values(selectedFilters).reduce((total, arr) => total + arr.length, 0);
  };

  // Handle click to prevent dropdown from closing when interacting with filters
  const handleFilterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="w-80 p-4 bg-white rounded-lg shadow-lg border border-gray-200"
      onClick={handleFilterClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Car className="h-4 w-4 text-blue-600" />
          Browse Cars
        </h3>
        {getTotalSelectedCount() > 0 && (
          <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
            {getTotalSelectedCount()}
          </Badge>
        )}
      </div>

      {/* Quick Filters - Compact Grid */}
      <div className="space-y-3">
        {/* Fuel Type */}
        <div>
          <h4 className="text-xs font-medium text-gray-600 mb-2">Fuel</h4>
          <div className="flex gap-1 flex-wrap">
            {filterOptions.fuelType.map((option) => {
              const isSelected = selectedFilters.fuelType.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleFilter('fuelType', option.id)}
                  className={`px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                    isSelected 
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category */}
        <div>
          <h4 className="text-xs font-medium text-gray-600 mb-2">Type</h4>
          <div className="flex gap-1 flex-wrap">
            {filterOptions.category.map((option) => {
              const isSelected = selectedFilters.category.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleFilter('category', option.id)}
                  className={`px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                    isSelected 
                      ? 'bg-purple-100 text-purple-700 border-purple-300' 
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Transmission & Seats - Combined Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Gear</h4>
            <div className="flex gap-1">
              {filterOptions.transmission.map((option) => {
                const isSelected = selectedFilters.transmission.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleFilter('transmission', option.id)}
                    className={`px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                      isSelected 
                        ? 'bg-green-100 text-green-700 border-green-300' 
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {option.label === 'Automatic' ? 'Auto' : 'Manual'}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Seats</h4>
            <div className="flex gap-1">
              {filterOptions.seats.map((option) => {
                const isSelected = selectedFilters.seats.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleFilter('seats', option.id)}
                    className={`px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                      isSelected 
                        ? 'bg-orange-100 text-orange-700 border-orange-300' 
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {option.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 mt-3 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="flex-1 text-xs h-8 text-gray-600 hover:text-gray-700"
          disabled={getTotalSelectedCount() === 0}
        >
          Clear
        </Button>
        <Button
          onClick={applyFilters}
          className="flex-2 text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white px-4"
        >
          <Search className="h-3 w-3 mr-1" />
          Search
        </Button>
      </div>
    </div>
  );
}
