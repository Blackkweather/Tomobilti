import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Fuel, Settings, Users, RotateCcw } from 'lucide-react';
import CarCard from '../components/CarCard';
import CarsSearchBar from '../components/CarsSearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { carApi } from '../lib/api';

export default function Cars() {
  const [location] = useLocation();
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    fuelType: '',
    transmission: '',
    startDate: '',
    endDate: ''
  });

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const locationParam = urlParams.get('location') || '';
    const startDateParam = urlParams.get('startDate') || '';
    const endDateParam = urlParams.get('endDate') || '';
    
    if (locationParam || startDateParam || endDateParam) {
      setFilters(prev => ({
        ...prev,
        location: locationParam,
        startDate: startDateParam,
        endDate: endDateParam
      }));
    }
  }, [location]);

  // Fetch cars from API
  const { data: carsData, isLoading, error } = useQuery({
    queryKey: ['cars', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.location) params.set('location', filters.location);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.fuelType) params.set('fuelType', filters.fuelType);
      if (filters.transmission) params.set('transmission', filters.transmission);
      
      params.set('page', '1');
      params.set('limit', '20');
      
      const response = await fetch(`/api/cars?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      return response.json();
    },
  });

  const cars = carsData?.cars || [];

  const handleFilterChange = (key: string, value: string) => {
    // Convert "all" to empty string for API calls
    const apiValue = value === 'all' ? '' : value;
    setFilters(prev => ({ ...prev, [key]: apiValue }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      fuelType: '',
      transmission: '',
      startDate: '',
      endDate: ''
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Loading Error</h2>
          <p className="text-gray-600">Unable to load cars. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Ideal Car
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Discover our selection of cars available across the UK
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Professional Search Bar */}
        <CarsSearchBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          onSearch={() => {}} // Search happens automatically when filters change
        />

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {cars.length} car{cars.length > 1 ? 's' : ''} available
            </h2>
            {carsData && (
              <p className="text-gray-600">
                Page {carsData.page} of {carsData.totalPages} • {carsData.total} result{carsData.total > 1 ? 's' : ''} total
              </p>
            )}
          </div>
        </div>

        {/* Cars Grid */}
        {cars.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-600 mb-4">
              Try modifying your search criteria
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {carsData && carsData.page < carsData.totalPages && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Charger plus de voitures
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}