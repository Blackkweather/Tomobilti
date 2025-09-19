import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Fuel, Settings, Users, RotateCcw } from 'lucide-react';
import CarCard from '../components/CarCard';

export default function Cars() {
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    fuelType: '',
    transmission: ''
  });

  const sampleCars = [
    {
      id: '1',
      title: 'Renault Clio 2020',
      location: 'Casablanca',
      pricePerDay: 350,
      currency: 'MAD',
      rating: 4.8,
      reviewCount: 12,
      fuelType: 'essence' as const,
      transmission: 'manual' as const,
      seats: 5,
      image: '/attached_assets/generated_images/Car_rental_listing_photo_bdcce465.png',
      ownerName: 'Ahmed M.',
      ownerImage: '/attached_assets/generated_images/Moroccan_car_owner_profile_7a556a9c.png',
      isAvailable: true
    },
    {
      id: '2',
      title: 'Peugeot 208 2021',
      location: 'Rabat',
      pricePerDay: 400,
      currency: 'MAD',
      rating: 4.6,
      reviewCount: 8,
      fuelType: 'essence' as const,
      transmission: 'automatic' as const,
      seats: 5,
      image: '/attached_assets/generated_images/Electric_car_in_Morocco_b06b165b.png',
      ownerName: 'Fatima K.',
      ownerImage: '/attached_assets/generated_images/Moroccan_car_owner_profile_7a556a9c.png',
      isAvailable: true
    },
    {
      id: '3',
      title: 'Dacia Logan 2019',
      location: 'Marrakech',
      pricePerDay: 280,
      currency: 'MAD',
      rating: 4.5,
      reviewCount: 15,
      fuelType: 'diesel' as const,
      transmission: 'manual' as const,
      seats: 5,
      image: '/attached_assets/generated_images/Car_rental_listing_photo_bdcce465.png',
      ownerName: 'Youssef A.',
      ownerImage: '/attached_assets/generated_images/Moroccan_car_owner_profile_7a556a9c.png',
      isAvailable: true
    },
    {
      id: '4',
      title: 'Toyota Yaris 2022',
      location: 'Casablanca',
      pricePerDay: 450,
      currency: 'MAD',
      rating: 4.9,
      reviewCount: 20,
      fuelType: 'hybrid' as const,
      transmission: 'automatic' as const,
      seats: 5,
      image: '/attached_assets/generated_images/Electric_car_in_Morocco_b06b165b.png',
      ownerName: 'Amina B.',
      ownerImage: '/attached_assets/generated_images/Moroccan_car_owner_profile_7a556a9c.png',
      isAvailable: false
    },
    {
      id: '5',
      title: 'Hyundai i20 2021',
      location: 'Fès',
      pricePerDay: 380,
      currency: 'MAD',
      rating: 4.7,
      reviewCount: 10,
      fuelType: 'essence' as const,
      transmission: 'manual' as const,
      seats: 5,
      image: '/attached_assets/generated_images/Car_rental_listing_photo_bdcce465.png',
      ownerName: 'Hassan R.',
      ownerImage: '/attached_assets/generated_images/Moroccan_car_owner_profile_7a556a9c.png',
      isAvailable: true
    },
    {
      id: '6',
      title: 'Nissan Micra 2020',
      location: 'Agadir',
      pricePerDay: 320,
      currency: 'MAD',
      rating: 4.4,
      reviewCount: 6,
      fuelType: 'essence' as const,
      transmission: 'automatic' as const,
      seats: 5,
      image: '/attached_assets/generated_images/Electric_car_in_Morocco_b06b165b.png',
      ownerName: 'Khadija L.',
      ownerImage: '/attached_assets/generated_images/Moroccan_car_owner_profile_7a556a9c.png',
      isAvailable: true
    }
  ];

  const filteredCars = sampleCars.filter(car => {
    if (filters.location && !car.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.minPrice && car.pricePerDay < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && car.pricePerDay > parseInt(filters.maxPrice)) {
      return false;
    }
    if (filters.fuelType && car.fuelType !== filters.fuelType) {
      return false;
    }
    if (filters.transmission && car.transmission !== filters.transmission) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <Card className="sticky top-24 border-card-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">Filtres</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Ville
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Casablanca, Rabat..."
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="minPrice" className="text-sm font-medium text-foreground mb-2">
                        Prix min
                      </Label>
                      <Input
                        id="minPrice"
                        type="number"
                        placeholder="200"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxPrice" className="text-sm font-medium text-foreground mb-2">
                        Prix max
                      </Label>
                      <Input
                        id="maxPrice"
                        type="number"
                        placeholder="500"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fuelType" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Fuel className="h-4 w-4" />
                      Carburant
                    </Label>
                    <Select value={filters.fuelType} onValueChange={(value) => setFilters({...filters, fuelType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous</SelectItem>
                        <SelectItem value="essence">Essence</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="hybrid">Hybride</SelectItem>
                        <SelectItem value="electric">Électrique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="transmission" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Transmission
                    </Label>
                    <Select value={filters.transmission} onValueChange={(value) => setFilters({...filters, transmission: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toutes</SelectItem>
                        <SelectItem value="manual">Manuelle</SelectItem>
                        <SelectItem value="automatic">Automatique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setFilters({location: '', minPrice: '', maxPrice: '', fuelType: '', transmission: ''})}
                    className="w-full hover-elevate active-elevate-2"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cars Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Véhicules disponibles</h1>
                <p className="text-muted-foreground">
                  {filteredCars.length} véhicules trouvés
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground text-6xl mb-4">🚗</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Aucun véhicule trouvé</h3>
                <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}