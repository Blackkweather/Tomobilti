import { useState } from 'react';
import { Link } from 'wouter';
import Hero from '../components/Hero';

export default function Home() {
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

  const stats = [
    { value: '2,500+', label: 'Véhicules disponibles' },
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">🚗 Photo véhicule</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Renault Clio {i}</h3>
                  <p className="text-gray-600 text-sm mb-2">📍 Casablanca</p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-bold">350 MAD/jour</span>
                    <span className="text-yellow-500">⭐ 4.8 (12)</span>
                  </div>
                  <Link href={`/car/${i}`}>
                    <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors">
                      Voir détails
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

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