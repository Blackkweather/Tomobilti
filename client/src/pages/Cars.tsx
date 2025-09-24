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
      fuelType: 'all',
      transmission: 'all',
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
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur de chargement</h2>
          <p className="text-gray-600">Impossible de charger les voitures. Veuillez réessayer.</p>
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
            Trouvez votre voiture idéale
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Découvrez notre sélection de voitures disponibles dans tout le Maroc
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="location">📍 Lieu</Label>
                <Input
                  id="location"
                  placeholder="Casablanca, Rabat..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minPrice">💰 Prix min (MAD)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="200"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPrice">💰 Prix max (MAD)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="600"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">⛽ Carburant</Label>
                <Select value={filters.fuelType || 'all'} onValueChange={(value) => handleFilterChange('fuelType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="essence">Essence</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Électrique</SelectItem>
                    <SelectItem value="hybrid">Hybride</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">⚙️ Transmission</Label>
                <Select value={filters.transmission || 'all'} onValueChange={(value) => handleFilterChange('transmission', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="manual">Manuelle</SelectItem>
                    <SelectItem value="automatic">Automatique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">📅 Début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">📅 Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Effacer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {cars.length} voiture{cars.length > 1 ? 's' : ''} disponible{cars.length > 1 ? 's' : ''}
            </h2>
            {carsData && (
              <p className="text-gray-600">
                Page {carsData.page} sur {carsData.totalPages} • {carsData.total} résultat{carsData.total > 1 ? 's' : ''} au total
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune voiture trouvée</h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <Button onClick={clearFilters} variant="outline">
              Effacer les filtres
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