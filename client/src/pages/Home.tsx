import { useState } from 'react';
import Hero from '@/components/Hero';
import CarCard from '@/components/CarCard';
import SearchFilters from '@/components/SearchFilters';
import BookingModal from '@/components/BookingModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Fuel, Users, Shield, Star, TrendingUp } from 'lucide-react';

// Import generated images
import carImage1 from '@assets/generated_images/Car_rental_listing_photo_bdcce465.png';
import carImage2 from '@assets/generated_images/Electric_car_in_Morocco_b06b165b.png';
import ownerImage from '@assets/generated_images/Moroccan_car_owner_profile_7a556a9c.png';

// todo: remove mock functionality
const mockCars = [
  {
    id: '1',
    title: 'BMW Série 3 - Berline Premium',
    location: 'Casablanca, Maarif',
    pricePerDay: 450,
    currency: 'MAD',
    rating: 4.8,
    reviewCount: 23,
    fuelType: 'essence' as const,
    transmission: 'automatic' as const,
    seats: 5,
    image: carImage1,
    ownerName: 'Ahmed Bennani',
    ownerImage: ownerImage,
    isAvailable: true
  },
  {
    id: '2',
    title: 'Tesla Model 3 - Électrique',
    location: 'Rabat, Agdal',
    pricePerDay: 650,
    currency: 'MAD',
    rating: 4.9,
    reviewCount: 31,
    fuelType: 'electric' as const,
    transmission: 'automatic' as const,
    seats: 5,
    image: carImage2,
    ownerName: 'Youssef Alami',
    isAvailable: true
  },
  {
    id: '3',
    title: 'Peugeot 208 - Citadine Économique',
    location: 'Marrakech, Guéliz',
    pricePerDay: 280,
    currency: 'MAD',
    rating: 4.6,
    reviewCount: 15,
    fuelType: 'diesel' as const,
    transmission: 'manual' as const,
    seats: 4,
    image: carImage1,
    ownerName: 'Fatima Zahra',
    isAvailable: true
  },
  {
    id: '4',
    title: 'Dacia Duster - SUV Familial',
    location: 'Fès, Ville Nouvelle',
    pricePerDay: 380,
    currency: 'MAD',
    rating: 4.5,
    reviewCount: 18,
    fuelType: 'essence' as const,
    transmission: 'manual' as const,
    seats: 7,
    image: carImage2,
    ownerName: 'Hassan Tazi',
    isAvailable: false
  },
  {
    id: '5',
    title: 'Mercedes Classe A - Luxe',
    location: 'Tangier, Marina',
    pricePerDay: 550,
    currency: 'MAD',
    rating: 4.9,
    reviewCount: 27,
    fuelType: 'hybrid' as const,
    transmission: 'automatic' as const,
    seats: 5,
    image: carImage1,
    ownerName: 'Laila Benjelloun',
    isAvailable: true
  },
  {
    id: '6',
    title: 'Renault Clio - Compacte',
    location: 'Agadir, Centre',
    pricePerDay: 250,
    currency: 'MAD',
    rating: 4.4,
    reviewCount: 12,
    fuelType: 'diesel' as const,
    transmission: 'manual' as const,
    seats: 4,
    image: carImage2,
    ownerName: 'Omar Filali',
    isAvailable: true
  }
];

const features = [
  {
    icon: MapPin,
    title: 'Partout au Maroc',
    description: 'Trouvez des véhicules dans toutes les grandes villes marocaines'
  },
  {
    icon: Fuel,
    title: 'Tous carburants',
    description: 'Essence, diesel, électrique et hybride disponibles'
  },
  {
    icon: Shield,
    title: 'Sécurisé',
    description: 'Paiements sécurisés et assurance incluse'
  },
  {
    icon: Users,
    title: 'Communauté',
    description: 'Louez entre particuliers ou avec des professionnels'
  }
];

const stats = [
  { value: '2,500+', label: 'Véhicules disponibles' },
  { value: '15,000+', label: 'Clients satisfaits' },
  { value: '8', label: 'Villes desservies' },
  { value: '4.8★', label: 'Note moyenne' }
];

export default function Home() {
  const [filteredCars, setFilteredCars] = useState(mockCars);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleFiltersChange = (filters: any) => {
    console.log('Filters applied:', filters);
    // todo: remove mock functionality - implement real filtering
    setFilteredCars(mockCars);
  };

  const handleCarBook = (carId: string) => {
    const car = mockCars.find(c => c.id === carId);
    if (car) {
      setSelectedCar(car);
      setIsBookingModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-primary" data-testid={`stat-value-${index}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir RentMa ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              La première plateforme de location de voitures entre particuliers au Maroc. 
              Simple, sécurisée et adaptée aux besoins marocains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover-elevate">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cars Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24">
                <SearchFilters onFiltersChange={handleFiltersChange} />
              </div>
            </div>

            {/* Cars Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Véhicules disponibles</h2>
                  <p className="text-muted-foreground">
                    {filteredCars.filter(car => car.isAvailable).length} véhicules disponibles
                  </p>
                </div>
                
                <Button variant="outline" className="hover-elevate active-elevate-2">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trier par prix
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <div key={car.id} onClick={() => handleCarBook(car.id)}>
                    <CarCard {...car} />
                  </div>
                ))}
              </div>

              {filteredCars.length === 0 && (
                <Card className="p-8 text-center">
                  <CardContent>
                    <div className="text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="font-semibold mb-2">Aucun véhicule trouvé</h3>
                      <p>Essayez de modifier vos critères de recherche</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container px-4">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Vous avez une voiture ? Gagnez de l'argent !
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Partagez votre véhicule avec notre communauté et générez des revenus supplémentaires 
                en toute sécurité. Inscription gratuite et processus simplifié.
              </p>
              <Button variant="secondary" size="lg" className="hover-elevate active-elevate-2">
                Devenir propriétaire hôte
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        car={selectedCar}
      />
    </div>
  );
}