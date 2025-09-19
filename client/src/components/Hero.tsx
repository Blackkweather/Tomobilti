import { useState } from 'react';
import { Link } from 'wouter';

export default function Hero() {
  const [searchLocation, setSearchLocation] = useState('');

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-green-600 to-green-800">
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10 container px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Gagnez
              <span className="block text-white bg-green-500/30 backdrop-blur-sm rounded-lg px-4 py-2 mt-2 inline-block">
                3000 MAD/mois
              </span>
              avec votre voiture
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-xl mx-auto font-medium">
              Votre voiture dort 95% du temps.
              <span className="block text-yellow-300 font-bold mt-2">
                Transformez-la en source de revenus.
              </span>
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl max-w-4xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  📍 Lieu
                </label>
                <input
                  placeholder="Casablanca, Rabat, Marrakech..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  📅 Début
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  📅 Fin
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 opacity-0">
                  Action
                </label>
                <Link href="/cars">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    🔍 Commencer à gagner
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-200 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="font-semibold text-green-300">✓ Inscription gratuite</div>
              <div>0 MAD de frais</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-300">✓ Paiement immédiat</div>
              <div>Argent versé en 24h</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-300">✓ Assurance incluse</div>
              <div>Zéro risque pour vous</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}