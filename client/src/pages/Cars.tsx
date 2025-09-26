import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { MapPin, Star, Fuel, Settings, Users, RotateCcw, Heart, Filter, Search, Grid, List } from 'lucide-react';
import CarCard from '../components/CarCard';
import CarsSearchBar from '../components/CarsSearchBar';
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

  // Fetch cars from API
  const { data: carsData, isLoading, error } = useQuery({
    queryKey: ['cars', filters],
    queryFn: async () => {
      console.log('Fetching cars with filters:', filters);
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
      
      console.log('Search params:', searchParams);
      try {
        const result = await carApi.searchCars(searchParams);
        console.log('API result:', result);
        return result;
      } catch (err) {
        console.error('API error:', err);
        throw err;
      }
    },
    staleTime: 30000, // Cache for 30 seconds to prevent excessive API calls
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
    if (!carsData?.cars) return [];
    
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
  console.log('Cars page state:', {
    isLoading,
    error,
    carsData,
    carsCount: carsData?.cars?.length,
    sortedCarsCount: sortedCars.length,
    hasActiveFilters
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with Attractive Image */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden group">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&h=800&fit=crop&auto=format&q=80"
            alt="Premium car rental - Find your perfect vehicle"
            className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000"
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&h=800&fit=crop&auto=format&q=80";
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
          
          {/* Floating Elements */}
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
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                    Vehicle
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
                  Discover amazing cars from trusted owners across the UK. 
                  From city cars to luxury vehicles, find your ideal ride.
                </p>
                
                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>100% Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    <span>Verified Owners</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Car className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-blue-400">2,500+</div>
                  <div className="text-gray-300">Available Cars</div>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-purple-400">100+</div>
                  <div className="text-gray-300">Cities</div>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-green-400">4.8★</div>
                  <div className="text-gray-300">Rating</div>
                </div>
              </div>
            </div>
            
            {/* Search Bar - Modern */}
            <div className="max-w-6xl mx-auto">
              <div className="card-modern bg-white/95 backdrop-blur-sm p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Location */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="London, Manchester..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="input-modern"
                  />
                </div>

                {/* Min Price */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Min Price (£)
                  </label>
                  <input
                    type="number"
                    placeholder="20"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-modern"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Max Price (£)
                  </label>
                  <input
                    type="number"
                    placeholder="600"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-modern"
                  />
                </div>

                {/* Date Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Date Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      placeholder="Start Date"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      className="input-modern"
                    />
                    <input
                      type="date"
                      placeholder="End Date"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      className="input-modern"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <button
                    onClick={() => {}} // No-op for now
                    className="btn-primary w-full text-lg py-4 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Cars
                  </button>
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
                <p className="text-lg text-gray-600">
                  <span className="font-semibold text-blue-600">{carsData.total}</span> vehicles found
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="btn-outline text-sm"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
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
              <p className="text-gray-600">Please try again later</p>
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
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
              : 'space-y-6'
          }>
            {sortedCars.map((car, index) => {
              console.log('Rendering car:', car.id, car.title);
              return (
                <div 
                  key={car.id} 
                  className="animate-fade-in hover-lift" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CarCard
                    car={car}
                    isFavorited={favorites.includes(car.id)}
                    onToggleFavorite={() => toggleFavorite(car.id)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && !error && carsData?.cars && carsData.cars.length >= 20 && (
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
                <p className="text-gray-600 text-sm">All car owners are verified and trusted members of our community</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Best Prices</h4>
                <p className="text-gray-600 text-sm">Competitive rates with no hidden fees or surprise charges</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Wide Selection</h4>
                <p className="text-gray-600 text-sm">From city cars to luxury vehicles across all major UK cities</p>
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