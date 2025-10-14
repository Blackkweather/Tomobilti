import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Users, 
  Car, 
  Calendar, 
  Settings, 
  Edit, 
  Trash2, 
  Eye, 
  ToggleLeft, 
  ToggleRight,
  Shield,
  Crown,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

import { formatCurrency } from '../utils/currency';

// Admin API functions
const adminApi = {
  // Cars
  getAllCars: async () => {
    const response = await fetch('/api/admin/cars', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch cars');
    return response.json();
  },

  updateCar: async (carId: string, data: any) => {
    const response = await fetch(`/api/admin/cars/${carId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update car');
    return response.json();
  },

  toggleCarAvailability: async (carId: string) => {
    const response = await fetch(`/api/admin/cars/${carId}/toggle-availability`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to toggle car availability');
    return response.json();
  },

  // Users
  getAllUsers: async () => {
    const response = await fetch('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }
};

interface Car {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: string;
  currency: string;
  location: string;
  isAvailable: boolean;
  ownerName: string;
  images: string[];
}

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Check if user is admin
  if (!isAuthenticated || user?.userType !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
              <Link href="/">
                <Button>Go Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch cars
  const { data: cars, isLoading: carsLoading } = useQuery({
    queryKey: ['admin', 'cars'],
    queryFn: adminApi.getAllCars
  });

  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminApi.getAllUsers
  });

  // Update car mutation
  const updateCarMutation = useMutation({
    mutationFn: ({ carId, data }: { carId: string; data: any }) => adminApi.updateCar(carId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cars'] });
      setEditingCar(null);
    }
  });

  // Toggle car availability mutation
  const toggleCarMutation = useMutation({
    mutationFn: adminApi.toggleCarAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cars'] });
    }
  });

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
  };

  const handleUpdateCar = (data: any) => {
    if (editingCar) {
      updateCarMutation.mutate({ carId: editingCar.id, data });
    }
  };

  const handleToggleAvailability = (carId: string) => {
    toggleCarMutation.mutate(carId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-yellow-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600">Manage cars, users, and platform settings</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome, {user?.firstName}</p>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="cars" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cars" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Cars Management
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users Management
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Cars Management */}
          <TabsContent value="cars" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  All Cars ({cars?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {carsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cars?.map((car: Car) => (
                      <div key={car.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{car.title}</h3>
                              <Badge variant={car.isAvailable ? "default" : "secondary"}>
                                {car.isAvailable ? 'Available' : 'Unavailable'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Make/Model:</span> {car.make} {car.model}
                              </div>
                              <div>
                                <span className="font-medium">Year:</span> {car.year}
                              </div>
                              <div>
                                <span className="font-medium">Price:</span> {formatCurrency(Number(car.pricePerDay))}/day
                              </div>
                              <div>
                                <span className="font-medium">Owner:</span> {car.ownerName}
                              </div>
                              <div className="col-span-2">
                                <span className="font-medium">Location:</span> {car.location}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCar(car)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAvailability(car.id)}
                              disabled={toggleCarMutation.isPending}
                            >
                              {car.isAvailable ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Users ({users?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users?.map((adminUser: AdminUser) => (
                      <div key={adminUser.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{adminUser.firstName} {adminUser.lastName}</h3>
                              <Badge variant={adminUser.userType === 'admin' ? 'default' : 'secondary'}>
                                {adminUser.userType}
                              </Badge>
                              {adminUser.isVerified && (
                                <Badge variant="outline" className="text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                              {adminUser.isBlocked && (
                                <Badge variant="destructive">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Blocked
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Email:</span> {adminUser.email}
                              </div>
                              <div>
                                <span className="font-medium">Joined:</span> {new Date(adminUser.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Car Edit Modal */}
          {editingCar && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Edit Car: {editingCar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data = Object.fromEntries(formData.entries());
                    handleUpdateCar(data);
                  }}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" defaultValue={editingCar.title} />
                      </div>
                      <div>
                        <Label htmlFor="make">Make</Label>
                        <Input id="make" name="make" defaultValue={editingCar.make} />
                      </div>
                      <div>
                        <Label htmlFor="model">Model</Label>
                        <Input id="model" name="model" defaultValue={editingCar.model} />
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" name="year" type="number" defaultValue={editingCar.year} />
                      </div>
                      <div>
                        <Label htmlFor="pricePerDay">Price per Day</Label>
                        <Input id="pricePerDay" name="pricePerDay" defaultValue={editingCar.pricePerDay} />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" defaultValue={editingCar.location} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <Button type="button" variant="outline" onClick={() => setEditingCar(null)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={updateCarMutation.isPending}>
                        {updateCarMutation.isPending ? 'Updating...' : 'Update Car'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs can be added here */}
          <TabsContent value="bookings">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Bookings Management</h3>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Platform Settings</h3>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer is rendered globally in App */}
    </div>
  );
}




