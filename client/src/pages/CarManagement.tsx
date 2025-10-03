import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Car, 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  MapPin, 
  Calendar, 
  Fuel, 
  Settings,
  Upload,
  Image as ImageIcon,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  Filter,
  Search,
  MoreHorizontal,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import Footer from '../components/Footer';

export default function CarManagement() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Fetch owner's cars
  const { data: cars, isLoading, error } = useQuery({
    queryKey: ['cars', 'owner', user?.id],
    queryFn: () => carApi.getOwnerCars(user?.id || ''),
    enabled: isAuthenticated && !!user?.id,
  });

  // Delete car mutation
  const deleteCarMutation = useMutation({
    mutationFn: (carId: string) => carApi.deleteCar(carId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars', 'owner'] });
      setSelectedCar(null);
    },
  });

  const handleDeleteCar = (carId: string) => {
    if (confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      deleteCarMutation.mutate(carId);
    }
  };

  // Filter and sort cars
  const filteredCars = cars?.filter((car: any) => {
    const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && car.isActive) ||
                         (filterStatus === 'inactive' && !car.isActive);
    
    return matchesSearch && matchesFilter;
  }).sort((a: any, b: any) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'price':
        return b.pricePerDay - a.pricePerDay;
      case 'earnings':
        return (b.totalEarnings || 0) - (a.totalEarnings || 0);
      case 'bookings':
        return (b.totalBookings || 0) - (a.totalBookings || 0);
      default:
        return 0;
    }
  }) || [];

  // Calculate analytics
  const analytics = {
    totalCars: cars?.length || 0,
    activeCars: cars?.filter((car: any) => car.isActive).length || 0,
    totalEarnings: cars?.reduce((sum: number, car: any) => sum + (car.totalEarnings || 0), 0) || 0,
    totalBookings: cars?.reduce((sum: number, car: any) => sum + (car.totalBookings || 0), 0) || 0,
    averageRating: cars?.reduce((sum: number, car: any) => sum + (car.averageRating || 0), 0) / (cars?.length || 1) || 0
  };

  const handleEditCar = (carId: string) => {
    setLocation(`/edit-car/${carId}`);
  };

  const handleViewCar = (carId: string) => {
    setLocation(`/cars/${carId}`);
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You need to be logged in to manage your cars.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setLocation('/')}>
                Go Home
              </Button>
              <Button onClick={() => setLocation('/login')}>
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center space-y-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900">Error Loading Cars</h2>
            <p className="text-muted-foreground">
              There was an error loading your cars. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Cars</h1>
              <p className="text-gray-600 mt-1">
                Manage your vehicle listings and bookings
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setLocation('/add-car')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Car
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Cars</p>
                  <p className="text-2xl font-bold">{analytics.totalCars}</p>
                </div>
                <Car className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active Cars</p>
                  <p className="text-2xl font-bold">{analytics.activeCars}</p>
                </div>
                <Activity className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Earnings</p>
                  <p className="text-2xl font-bold">{formatCurrency(analytics.totalEarnings)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Total Bookings</p>
                  <p className="text-2xl font-bold">{analytics.totalBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Avg Rating</p>
                  <p className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search cars by name, make, or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Cars</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="earnings">Sort by Earnings</option>
                  <option value="bookings">Sort by Bookings</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!cars || cars.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No cars listed yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start earning by listing your first vehicle
              </p>
              <Button
                onClick={() => setLocation('/add-car')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                List Your First Car
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCars.map((car: any) => (
              <Card key={car.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {car.title || `${car.make} ${car.model}`}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="line-clamp-1">{car.city || car.location}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={car.isAvailable ? "default" : "secondary"}
                      className={car.isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {car.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Car Image */}
                  <div className="relative">
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={car.images[0]}
                        alt={car.title}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/placeholder-car.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Image Count Badge */}
                    {car.images && car.images.length > 1 && (
                      <Badge className="absolute top-2 right-2 bg-black bg-opacity-60 text-white">
                        +{car.images.length - 1} more
                      </Badge>
                    )}
                  </div>

                  {/* Car Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{car.year}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Fuel className="h-4 w-4 mr-1" />
                      <span className="capitalize">{car.fuelType}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Settings className="h-4 w-4 mr-1" />
                      <span className="capitalize">{car.transmission}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Car className="h-4 w-4 mr-1" />
                      <span>{car.seats} seats</span>
                    </div>
                  </div>

                  {/* Analytics Row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs text-blue-600 font-medium">Earnings</p>
                      <p className="text-sm font-bold text-blue-800">{formatCurrency(car.totalEarnings || 0)}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <p className="text-xs text-green-600 font-medium">Rating</p>
                      <p className="text-sm font-bold text-green-800">{car.averageRating?.toFixed(1) || 'N/A'}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <p className="text-xs text-purple-600 font-medium">Bookings</p>
                      <p className="text-sm font-bold text-purple-800">{car.totalBookings || 0}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(car.pricePerDay)}
                      </div>
                      <div className="text-sm text-gray-600">per day</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCar(car.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCar(car.id)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCar(car.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={deleteCarMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}