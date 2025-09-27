import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { MapPin, Star, Fuel, Settings, Users, RotateCcw, Heart, Filter, Search, Grid, List, Car } from 'lucide-react';
import CarCard from '../components/CarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { carApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

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

  // Fetch cars data
  const { data: carsData, isLoading, error } = useQuery({
    queryKey: ['cars', filters],
    queryFn: () => carApi.searchCars({
      sortBy: 'date' as const,
      sortOrder: 'desc' as const,
      page: 1,
      limit: 50,
      location: filters.location || undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      fuelType: filters.fuelType ? [filters.fuelType] : undefined,
      transmission: filters.transmission as 'manual' | 'automatic' | undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    if (!carsData?.cars) return [];
    
    let filtered = [...carsData.cars];
    
    // Apply filters
    if (filters.location) {
      filtered = filtered.filter(car => 
        car.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.minPrice) {
      filtered = filtered.filter(car => car.pricePerDay >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(car => car.pricePerDay <= parseFloat(filters.maxPrice));
    }
    
    if (filters.fuelType) {
      filtered = filtered.filter(car => car.fuelType === filters.fuelType);
    }
    
    if (filters.transmission) {
      filtered = filtered.filter(car => car.transmission === filters.transmission);
    }
    
    // Sort cars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricePerDay - b.pricePerDay;
        case 'name':
          return a.make.localeCompare(b.make);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [carsData?.cars, filters, sortBy]);

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const toggleFavorite = (carId: string) => {
    if (!isAuthenticated) {
      alert('Please log in to add favorites');
      return;
    }
    
    setFavorites(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with Attractive Image */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden group">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated_images/Car_rental_listing_photo_bdcce465.png"
            alt="Car rental platform"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-bounce-gentle"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white mb-12">
              <div className="animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  Find Your Perfect
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Ride
                  </span>
                </h1>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-6xl mx-auto">
              <div className="card-modern bg-white/95 backdrop-blur-sm p-8 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Location */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Where are you going?
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Enter city or location"
                        value={filters.location}
                        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                        className="input-modern pl-10"
                      />
                    </div>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Pick-up Date
                    </label>
                    <Input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                      className="input-modern"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Return Date
                    </label>
                    <Input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                      className="input-modern"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Price Range
                    </label>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Min price"
                        value={filters.minPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                        className="input-modern"
                      />
                      <Input
                        type="number"
                        placeholder="Max price"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                        className="input-modern"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <button
                      className="btn-primary w-full py-3 px-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Search className="w-5 h-5" />
                      Search Cars
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
              Available Vehicles
            </h2>
            {carsData && (
              <div className="flex items-center gap-4">
                <p className="text-lg text-gray-700 font-medium">
                  <span className="font-semibold text-blue-600">{carsData.total}</span> vehicles found
                </p>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Filter className="w-3 h-3 mr-1" />
                    Filtered
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
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

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Clear
              </Button>
            )}
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
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-700 mb-6 font-medium">We couldn't load the vehicles. Please try again.</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredCars.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-700 mb-6 font-medium">
              {hasActiveFilters 
                ? "Try adjusting your filters to see more results."
                : "No vehicles are currently available."
              }
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Cars Grid */}
        {!isLoading && !error && filteredCars.length > 0 && (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredCars.map((car) => (
              <div 
                key={car.id} 
                className={viewMode === 'list' ? "w-full" : ""}
              >
                <CarCard 
                  car={car} 
                  isFavorited={favorites.includes(car.id)}
                  onToggleFavorite={() => toggleFavorite(car.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && !error && filteredCars.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8">
              Load More Vehicles
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        {carsData?.cars && carsData.cars.length > 0 && (
          <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Why Choose Share Wheelz?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Verified Owners</h4>
                <p className="text-gray-700 text-sm font-medium">All car owners are verified and trusted members of our community</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Best Prices</h4>
                <p className="text-gray-700 text-sm font-medium">Competitive rates with no hidden fees or surprise charges</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Wide Selection</h4>
                <p className="text-gray-700 text-sm font-medium">From city cars to luxury vehicles across all major UK cities</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}