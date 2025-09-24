import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Car, 
  Calendar, 
  Star, 
  DollarSign, 
  Users, 
  Plus, 
  TrendingUp, 
  Clock,
  MapPin,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'cars' | 'bookings'>('overview');

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Accès non autorisé</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
          <Link href="/login">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Se connecter
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user.userType === 'owner' || user.userType === 'both';
  const isRenter = user.userType === 'renter' || user.userType === 'both';

  // Fetch user's cars if they're an owner
  const { data: carsData, isLoading: carsLoading } = useQuery({
    queryKey: ['userCars', user.id],
    queryFn: async () => {
      if (!isOwner) return { cars: [] };
      const response = await fetch(`/api/cars/owner/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch cars');
      return response.json();
    },
    enabled: isOwner,
  });

  // Fetch user's bookings (as renter)
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['userBookings', user.id],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/renter/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
  });

  const cars = carsData?.cars || [];
  const bookings = bookingsData?.bookings || [];
  const totalEarnings = bookings.reduce((sum: number, booking: any) => {
    return sum + (parseFloat(booking.totalAmount) || 0);
  }, 0);

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Annulé</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800"><AlertCircle className="w-3 h-3 mr-1" />Inconnu</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Modern Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-white to-green-50 rounded-3xl shadow-xl p-8 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent mb-3">
                  Bonjour, {user.firstName} ! 👋
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  Gérez votre activité de location de véhicules en toute simplicité
                </p>
                <div className="flex items-center space-x-6">
                  <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 px-4 py-2 text-sm font-medium">
                    {isOwner && isRenter ? 'Propriétaire & Locataire' : isOwner ? 'Propriétaire' : 'Locataire'}
                  </Badge>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 via-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">
                    {user.firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3">
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <TrendingUp className="w-5 h-5 inline mr-3" />
                Vue d'ensemble
              </button>
              {isOwner && (
                <button
                  onClick={() => setActiveTab('cars')}
                  className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'cars'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <Car className="w-5 h-5 inline mr-3" />
                  Mes Véhicules ({cars.length})
                </button>
              )}
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'bookings'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <Calendar className="w-5 h-5 inline mr-3" />
                Réservations ({bookings.length})
              </button>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Revenus Totaux</p>
                      <p className="text-3xl font-bold text-green-700">£{totalEarnings.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-green-200 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Véhicules</p>
                      <p className="text-3xl font-bold text-blue-700">{cars.length}</p>
                    </div>
                    <div className="p-3 bg-blue-200 rounded-full">
                      <Car className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Réservations</p>
                      <p className="text-3xl font-bold text-purple-700">{bookings.length}</p>
                    </div>
                    <div className="p-3 bg-purple-200 rounded-full">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Note Moyenne</p>
                      <p className="text-3xl font-bold text-yellow-700">4.8</p>
                    </div>
                    <div className="p-3 bg-yellow-200 rounded-full">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-green-600" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isOwner && (
                    <Link href="/add-car">
                      <Button className="w-full h-20 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center space-y-2">
                        <Plus className="w-6 h-6" />
                        <span>Ajouter un Véhicule</span>
                      </Button>
                    </Link>
                  )}
                  <Link href="/cars">
                    <Button variant="outline" className="w-full h-20 border-blue-200 text-blue-600 hover:bg-blue-50 flex flex-col items-center justify-center space-y-2">
                      <Eye className="w-6 h-6" />
                      <span>Explorer les Véhicules</span>
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" className="w-full h-20 border-purple-200 text-purple-600 hover:bg-purple-50 flex flex-col items-center justify-center space-y-2">
                      <Users className="w-6 h-6" />
                      <span>Mon Profil</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cars Tab */}
        {activeTab === 'cars' && isOwner && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Mes Véhicules</h2>
                <p className="text-gray-600 mt-1">Gérez votre flotte de véhicules</p>
              </div>
              <Link href="/add-car">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3">
                  <Plus className="w-5 h-5 mr-2" />
                  Ajouter un Véhicule
                </Button>
              </Link>
            </div>

            {carsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Car className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun véhicule</h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Vous n'avez pas encore de véhicules dans votre flotte.<br />
                    Commencez par ajouter votre premier véhicule !
                  </p>
                  <Link href="/add-car">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                      <Plus className="w-5 h-5 mr-2" />
                      Ajouter mon premier véhicule
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car: any) => (
                  <Card key={car.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={car.images?.[0] || 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format'}
                        alt={car.title}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                      <Badge className={`absolute top-3 right-3 ${
                        car.isAvailable 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {car.isAvailable ? 'Disponible' : 'Indisponible'}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-3 text-gray-900">{car.title}</h3>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-green-600" />
                          {car.location}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-green-600 text-lg">
                            £{car.pricePerDay}/day
                          </span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="font-medium">4.8</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-6">
                        <Button variant="outline" size="sm" className="flex-1 border-green-200 text-green-600 hover:bg-green-50">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50">
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes Réservations</h2>
            
            {bookingsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune réservation</h3>
                  <p className="text-gray-500 mb-6">Vous n'avez pas encore de réservations</p>
                  <Link href="/cars">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Car className="w-4 h-4 mr-2" />
                      Explorer les Véhicules
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: any) => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={booking.car?.images?.[0] || 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format'}
                            alt={booking.car?.title}
                            className="w-16 h-16 object-cover rounded-lg"
                            loading="lazy"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">{booking.car?.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 space-x-4">
                              <span>{new Date(booking.startDate).toLocaleDateString('fr-FR')}</span>
                              <span>→</span>
                              <span>{new Date(booking.endDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              {booking.car?.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            £{booking.totalAmount}
                          </div>
                          <div className="mt-2">
                            {getBookingStatusBadge(booking.status)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}