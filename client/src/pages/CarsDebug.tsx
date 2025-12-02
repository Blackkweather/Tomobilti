import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RotateCcw, Filter, Search, Grid, List } from 'lucide-react';
import CarCardSimple from '../components/CarCardSimple';
import CarsSearchBar from '../components/CarsSearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { carApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function CarsDebug() {
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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('price');
  const { isAuthenticated } = useAuth();

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
      console.log('🔍 Fetching cars with filters:', filters);
      const searchParams = {
        location: filters.location || undefined,
        minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
        fuelType: filters.fuelType || undefined,
        transmission: filters.transmission || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page: 1,
        limit: 20
      };
      
      console.log('📋 Search params:', searchParams);
      try {
        const result = await carApi.searchCars(searchParams);
        console.log('✅ API result:', result);
        console.log('🚗 Cars count:', result.cars?.length);
        return result;
      } catch (err) {
        console.error('❌ API error:', err);
        throw err;
      }
    },
    staleTime: 30000,
  });

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Sort cars based on selected criteria
  const sortedCars = useMemo(() => {
    if (!carsData?.cars) {
      console.log('⚠️ No cars data available for sorting');
      return [];
    }
    
    console.log('🔄 Sorting cars:', carsData.cars.length);
    const cars = [...carsData.cars];
    
    switch (sortBy) {
      case 'price-low':
        return cars.sort((a, b) => a.pricePerDay - b.pricePerDay);
      case 'price-high':
        return cars.sort((a, b) => b.pricePerDay - a.pricePerDay);
      case 'rating':
        return cars.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return cars.sort((a, b) => b.year - a.year);
      case 'oldest':
        return cars.sort((a, b) => a.year - b.year);
      default:
        return cars;
    }
  }, [carsData?.cars, sortBy]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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

  const toggleFavorite = (carId: string) => {
    const newFavorites = favorites.includes(carId)
      ? favorites.filter(id => id !== carId)
      : [...favorites, carId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Debug logging
  console.log('🎯 CarsDebug page state:', {
    isLoading,
    error,
    carsData,
    carsCount: carsData?.cars?.length,
    sortedCarsCount: sortedCars.length,
    hasActiveFilters,
    viewMode,
    sortBy
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Vehicle (DEBUG)
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Debug version with simplified components
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <CarsSearchBar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Available Vehicles (DEBUG)
            </h2>
            {carsData && (
              <p className="text-gray-600">
                {carsData.total} vehicles found
                {hasActiveFilters && (
                  <span className="ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Clear Filters
                    </Button>
                  </span>
                )}
              </p>
            )}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold">Unable to load vehicles</h3>
              <p className="text-gray-600">Error: {error.toString()}</p>
            </div>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && (!carsData?.cars || carsData.cars.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-gray-600">No vehicles found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
            {hasActiveFilters && (
              <Button onClick={clearFilters} className="mt-4">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        {/* Cars Grid */}
        {!isLoading && !error && carsData?.cars && carsData.cars.length > 0 && (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {sortedCars.map((car) => {
              console.log('🎨 Rendering car:', car.id, car.title);
              return (
                <CarCardSimple
                  key={car.id}
                  car={car}
                  isFavorited={favorites.includes(car.id)}
                  onToggleFavorite={() => toggleFavorite(car.id)}
                />
              );
            })}
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <pre className="text-xs text-gray-600">
            {JSON.stringify({
              isLoading,
              error: error?.toString(),
              carsCount: carsData?.cars?.length,
              sortedCarsCount: sortedCars.length,
              filters,
              viewMode,
              sortBy
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
