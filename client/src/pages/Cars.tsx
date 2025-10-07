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
import { LocationPicker } from '../components/LocationPicker';
import { carApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/currency';

export default function Cars() {
  const [location] = useLocation();
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    fuelType: '',
    transmission: '',
    startDate: '',
    endDate: '',
    category: '',
    seats: ''
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('price');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isAuthenticated } = useAuth();

  // Real car rental platform images with different categories
  const heroImages = [
    // Luxury cars
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&h=1080&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=1920&h=1080&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&h=1080&fit=crop&auto=format&q=80',
    // Electric cars
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1920&h=1080&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=1920&h=1080&fit=crop&auto=format&q=80',
    // Classic cars
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&h=1080&fit=crop&auto=format&q=80',
    // SUVs
    'https://images.unsplash.com/photo-1549317336-206569e8475c?w=1920&h=1080&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&auto=format&q=80',
    // Sports cars
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&h=1080&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&h=1080&fit=crop&auto=format&q=80'
  ];

  // Rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Parse URL parameters - reactive to URL changes
  useEffect(() => {
    const parseUrlParams = () => {
      try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        
        const newFilters = {
          location: urlParams.get('location') || '',
          startDate: urlParams.get('startDate') || '',
          endDate: urlParams.get('endDate') || '',
          fuelType: urlParams.get('fuelType') || '',
          transmission: urlParams.get('transmission') || '',
          category: urlParams.get('category') || '',
          seats: urlParams.get('seats') || '',
          minPrice: '',
          maxPrice: ''
        };
        
        setFilters(newFilters);
      } catch (error) {
        console.error('❌ URL PARSING ERROR:', error);
      }
    };

    // Parse on mount
    parseUrlParams();

    // Listen for URL changes (including programmatic changes)
    const handleUrlChange = () => {
      parseUrlParams();
    };

    // Listen to both popstate and custom events
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('urlchange', handleUrlChange);
    
    // Also check for URL changes periodically (fallback)
    let lastUrl = window.location.search;
    const interval = setInterval(() => {
      const currentUrl = window.location.search;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        parseUrlParams();
      }
    }, 100);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('urlchange', handleUrlChange);
      clearInterval(interval);
    };
  }, []);


  // Fetch cars data - Use a simple key since we're doing all filtering client-side
  const { data: carsData, isLoading, error } = useQuery({
    queryKey: ['cars'],
    queryFn: () => carApi.searchCars({
      sortBy: 'date' as const,
      sortOrder: 'desc' as const,
      page: 1,
      limit: 50,
      // Remove all filters from API call - we'll apply them client-side
      // This ensures we get all cars and can filter them properly
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Helper function to determine car category based on make, model, and price
  const getCarCategory = (car: any) => {
    const price = parseFloat(car.pricePerDay.toString());
    const make = car.make.toLowerCase();
    const model = car.model.toLowerCase();
    
    // Economy cars (lowest tier)
    if (
      ['toyota', 'honda', 'ford', 'volkswagen', 'nissan', 'hyundai', 'kia', 'renault', 'peugeot', 'citroen'].includes(make) ||
      price < 40
    ) {
      return 'economy';
    }
    
    // Compact cars (mid-low tier)
    if (price >= 40 && price < 60) {
      return 'compact';
    }
    
    // Premium brands and mid-high tier (£60-150)
    if (
      ['bmw', 'mercedes', 'audi', 'jaguar', 'range rover', 'tesla', 'volvo', 'lexus'].includes(make) ||
      (price >= 60 && price <= 150) ||
      model.includes('model') ||
      model.includes('sport')
    ) {
      return 'premium';
    }
    
    // Luxury brands and highest tier (>£150 or exclusive brands)
    if (
      ['porsche', 'ferrari', 'lamborghini', 'maserati', 'bentley', 'rolls-royce', 'aston martin'].includes(make) ||
      price > 150 ||
      model.includes('911') ||
      model.includes('f-type')
    ) {
      return 'luxury';
    }
    
    // Default to premium for anything else
    return 'premium';
  };

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
      filtered = filtered.filter(car => parseFloat(car.pricePerDay.toString()) >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(car => parseFloat(car.pricePerDay.toString()) <= parseFloat(filters.maxPrice));
    }
    
    if (filters.fuelType) {
      filtered = filtered.filter(car => car.fuelType === filters.fuelType);
    }
    
    if (filters.transmission) {
      filtered = filtered.filter(car => car.transmission === filters.transmission);
    }
    
    if (filters.seats) {
      filtered = filtered.filter(car => car.seats.toString() === filters.seats);
    }
    
    // Category filtering based on derived category
    if (filters.category) {
      filtered = filtered.filter(car => getCarCategory(car) === filters.category);
    }
    
    // Sort cars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseFloat(a.pricePerDay.toString()) - parseFloat(b.pricePerDay.toString());
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
    // Clear the filters state
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      fuelType: '',
      transmission: '',
      startDate: '',
      endDate: '',
      category: '',
      seats: ''
    });
    
    // Update the URL to remove query parameters
    const newUrl = window.location.pathname; // Just the path without query params
    window.history.pushState({}, '', newUrl);
    
    // Trigger custom event to notify of URL change
    window.dispatchEvent(new CustomEvent('urlchange'));
    
    console.log('🧹 CLEAR: Filters cleared and URL updated to:', newUrl);
  };

  const applyFilters = () => {
    // Build URL with current filters
    const urlParams = new URLSearchParams();
    
    if (filters.location) urlParams.set('location', filters.location);
    if (filters.startDate) urlParams.set('startDate', filters.startDate);
    if (filters.endDate) urlParams.set('endDate', filters.endDate);
    if (filters.fuelType) urlParams.set('fuelType', filters.fuelType);
    if (filters.transmission) urlParams.set('transmission', filters.transmission);
    if (filters.category) urlParams.set('category', filters.category);
    if (filters.seats) urlParams.set('seats', filters.seats);
    
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({}, '', newUrl);
    
    // Trigger custom event to notify of URL change
    window.dispatchEvent(new CustomEvent('urlchange'));
    
    console.log('🔍 SEARCH: Filters applied and URL updated to:', newUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mauve-50 via-white to-bleu-50">
      {/* Hero Section with Attractive Image */}
      <div className="relative min-h-screen overflow-hidden group">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImages[currentImageIndex]}
            alt="Car rental platform"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = heroImages[(currentImageIndex + 1) % heroImages.length];
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center">
          <div className="container mx-auto px-4 py-20">
            {/* Title Section */}
            <div className="max-w-5xl mx-auto text-center text-white mb-16">
              <div className="animate-fade-in">
                <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                  Find Your Perfect
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
                    Ride
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Discover luxury cars, electric vehicles, and classic rides across the UK
                </p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-6xl mx-auto relative z-10 px-4">
              <div className="bg-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500">
                <div className="space-y-8">
                  {/* First Row - Location and Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Location */}
                    <div className="relative group">
                      <label className="text-lg font-semibold text-white mb-3 block group-hover:text-blue-300 transition-colors">
                        <MapPin className="inline w-5 h-5 mr-2" />
                        Where are you going?
                      </label>
                      <div className="relative">
                        <LocationPicker
                          value={filters.location}
                          onChange={(location) => setFilters(prev => ({ ...prev, location }))}
                          placeholder="Enter city or location"
                          className="h-14 text-lg bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30 focus:border-blue-400 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Start Date */}
                    <div className="relative group">
                      <label className="text-lg font-semibold text-white mb-3 block group-hover:text-blue-300 transition-colors">
                        Pick-up Date
                      </label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={filters.startDate}
                          onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                          className="h-14 text-lg bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30 focus:border-blue-400 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="relative group">
                      <label className="text-lg font-semibold text-white mb-3 block group-hover:text-blue-300 transition-colors">
                        Return Date
                      </label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={filters.endDate}
                          onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                          className="h-14 text-lg bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30 focus:border-blue-400 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  {/* Second Row - Price Range and Search */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
                    {/* Price Range */}
                    <div className="lg:col-span-2">
                      <label className="text-lg font-semibold text-white mb-3 block">
                        Price Range (£ per day)
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                          <Input
                            type="number"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                            className="h-14 text-lg bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30 focus:border-blue-400 transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <div className="relative group">
                          <Input
                            type="number"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                            className="h-14 text-lg bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30 focus:border-blue-400 transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className="flex justify-center lg:justify-end">
                      <button
                        onClick={applyFilters}
                        className="group relative w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                      >
                        <Search className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Search Cars</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 mt-16 min-h-screen">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
              Available Vehicles
            </h2>
            {carsData && (
              <div className="flex items-center gap-4">
                <p className="text-lg text-gray-700 font-medium">
                  <span className="font-semibold text-mauve-600">{filteredCars.length}</span> vehicles found
                  <span className="text-sm text-gray-500">({carsData.total} total)</span>
                </p>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="bg-mauve-100 text-mauve-800">
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
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              : "space-y-4"
          }>
            {filteredCars.map((car) => (
              <div 
                key={car.id} 
                className={viewMode === 'list' ? "w-full" : "w-full"}
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
                <div className="w-16 h-16 bg-mauve-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-mauve-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Verified Owners</h4>
                <p className="text-gray-700 text-sm font-medium">All car owners are verified and trusted members of our community</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-rose-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Best Prices</h4>
                <p className="text-gray-700 text-sm font-medium">Competitive rates with no hidden fees or surprise charges</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-bleu-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-bleu-600" />
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
