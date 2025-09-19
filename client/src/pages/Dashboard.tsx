import { Link } from 'wouter';

export default function Dashboard() {
  const user = {
    firstName: 'Ahmed',
    lastName: 'Benali',
    email: 'ahmed@example.com',
    role: 'both' // 'renter', 'owner', or 'both'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenue, {user.firstName} !
            </h1>
            <p className="mt-2 text-gray-600">
              Choisissez votre tableau de bord :
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Renter Dashboard */}
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 text-blue-600 text-2xl">👤</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tableau de bord Locataire
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Parcourir et réserver des voitures
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-5">
                  <Link href="/dashboard/renter">
                    <button className="w-full bg-green-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                      Accéder au tableau locataire
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Owner Dashboard */}
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 text-green-600 text-2xl">🚗</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tableau de bord Propriétaire
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Gérer vos véhicules
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-5">
                  <Link href="/dashboard/owner">
                    <button className="w-full bg-green-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                      Accéder au tableau propriétaire
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">📅</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Réservations actives
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        2
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">🚙</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Mes véhicules
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        1
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">💰</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Revenus ce mois
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        2,450 MAD
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/cars">
                  <button className="w-full bg-green-50 text-green-700 py-3 px-4 rounded-md hover:bg-green-100 transition-colors text-sm font-medium">
                    🔍 Chercher une voiture
                  </button>
                </Link>
                <Link href="/add-car">
                  <button className="w-full bg-green-50 text-green-700 py-3 px-4 rounded-md hover:bg-green-100 transition-colors text-sm font-medium">
                    ➕ Ajouter un véhicule
                  </button>
                </Link>
                <Link href="/booking-management">
                  <button className="w-full bg-yellow-50 text-yellow-700 py-3 px-4 rounded-md hover:bg-yellow-100 transition-colors text-sm font-medium">
                    📋 Mes réservations
                  </button>
                </Link>
                <Link href="/settings">
                  <button className="w-full bg-gray-50 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium">
                    ⚙️ Paramètres
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}