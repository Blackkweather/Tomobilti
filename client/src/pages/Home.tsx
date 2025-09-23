import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Hero from '../components/Hero';
import { carApi } from '../lib/api';
import CarCard from '../components/CarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Car } from '@shared/schema';

export default function Home() {
  // Fetch featured cars
  const { data: carsData, isLoading: carsLoading } = useQuery({
    queryKey: ['featuredCars'],
    queryFn: () => carApi.searchCars({ 
      page: 1, 
      limit: 6,
      sortBy: 'rating',
      sortOrder: 'desc'
    }),
  });

  const features = [
    {
      title: 'Partout au Maroc',
      description: 'Trouvez des véhicules dans toutes les grandes villes marocaines',
      icon: '📍'
    },
    {
      title: 'Tous carburants',
      description: 'Essence, diesel, électrique et hybride disponibles',
      icon: '⛽'
    },
    {
      title: 'Sécurisé',
      description: 'Paiements sécurisés et assurance incluse',
      icon: '🛡️'
    },
    {
      title: 'Communauté',
      description: 'Louez entre particuliers ou avec des professionnels',
      icon: '👥'
    }
  ];

  // Dynamic stats based on real data
  const stats = [
    { value: carsData?.total ? `${carsData.total}+` : '2,500+', label: 'Véhicules disponibles' },
    { value: '15,000+', label: 'Clients satisfaits' },
    { value: '8', label: 'Villes desservies' },
    { value: '4.8★', label: 'Note moyenne' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-green-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir Tomobilto ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La première plateforme de location de voitures entre particuliers au Maroc. 
              Simple, sécurisée et adaptée aux besoins marocains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Cars Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Véhicules populaires</h2>
            <p className="text-gray-600">Découvrez quelques-uns de nos véhicules les plus demandés</p>
          </div>

          {carsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Chargement des véhicules..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carsData?.cars?.slice(0, 6).map((car: any) => (
                <div key={car.id} className="transform hover:scale-105 transition-transform">
                  <CarCard
                    id={car.id}
                    title={car.title}
                    location={car.location}
                    pricePerDay={parseFloat(car.pricePerDay)}
                    currency={car.currency || 'MAD'}
                    rating={car.rating || 0}
                    reviewCount={car.reviewCount || 0}
                    fuelType={car.fuelType}
                    transmission={car.transmission}
                    seats={car.seats}
                    image={car.images?.[0] || 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format'}
                    ownerName={car.owner ? `${car.owner.firstName} ${car.owner.lastName}` : 'Propriétaire'}
                    ownerImage={car.owner?.profileImage}
                    isAvailable={car.isAvailable}
                  />
                </div>
              )) || (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Aucun véhicule disponible pour le moment.</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/cars">
              <button className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors font-semibold">
                Voir tous les véhicules
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vous avez une voiture ? Gagnez de l'argent !
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Partagez votre véhicule avec notre communauté et générez des revenus supplémentaires 
            en toute sécurité. Inscription gratuite et processus simplifié.
          </p>
          <Link href="/become-host">
            <button className="bg-white text-green-600 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-semibold">
              Devenir propriétaire hôte
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}