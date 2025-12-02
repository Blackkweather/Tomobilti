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
  Car as CarIcon, 
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
  CheckCircle,
  BarChart3,
  Search,
  X,
  Ban,
  CheckSquare,
  XCircle,
  TrendingUp,
  Activity,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

import { formatCurrency } from '../utils/currency';

// Admin API functions
const adminApi = {
  // Cars
  getAllCars: async () => {
    const response = await fetch('/api/admin/cars', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to toggle car availability');
    return response.json();
  },

  deleteCar: async (carId: string) => {
    const response = await fetch(`/api/cars/${carId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to delete car');
    return response.json();
  },

  blockUser: async (userId: string) => {
    const response = await fetch(`/api/admin/users/${userId}/block`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to block user');
    return response.json();
  },

  unblockUser: async (userId: string) => {
    const response = await fetch(`/api/admin/users/${userId}/unblock`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to unblock user');
    return response.json();
  },

  verifyUser: async (userId: string) => {
    const response = await fetch(`/api/admin/users/${userId}/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to verify user');
    return response.json();
  },

  unverifyUser: async (userId: string) => {
    const response = await fetch(`/api/admin/users/${userId}/unverify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to unverify user');
    return response.json();
  },

  resetUserPassword: async (userId: string, newPassword: string) => {
    const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newPassword })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reset password');
    }
    return response.json();
  },

  // Users
  getAllUsers: async () => {
    const response = await fetch('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // Bookings
  getAllBookings: async () => {
    const response = await fetch('/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  },

  updateBookingStatus: async (bookingId: string, status: string) => {
    const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update booking status');
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
  isVerified?: boolean;
  isIdVerified?: boolean;
  isLicenseVerified?: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [settings, setSettings] = useState({ maintenanceMode: false, bookingWindowDays: 90, maxCancellationHours: 24 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'available' | 'unavailable'>('all');
  const [userFilterType, setUserFilterType] = useState<'all' | 'owner' | 'renter' | 'admin'>('all');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'cancelled' | 'completed'>('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // Fetch cars (enabled only if admin)
  const { data: cars, isLoading: carsLoading, error: carsError } = useQuery({
    queryKey: ['admin', 'cars'],
    queryFn: adminApi.getAllCars,
    retry: 1,
    enabled: isAuthenticated && user?.userType === 'admin'
  });

  // Fetch users (enabled only if admin)
  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminApi.getAllUsers,
    retry: 1,
    enabled: isAuthenticated && user?.userType === 'admin'
  });

  // Fetch bookings (enabled only if admin)
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: adminApi.getAllBookings,
    retry: 1,
    enabled: isAuthenticated && user?.userType === 'admin'
  });

  // Fetch platform settings
  const { data: settingsData, isLoading: settingsLoading, error: settingsError } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const res = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch settings');
      return res.json();
    },
    enabled: isAuthenticated && user?.userType === 'admin'
  });

  // Update settings state when data is fetched
  useEffect(() => {
    if (settingsData) {
      setSettings(settingsData);
    }
  }, [settingsData]);

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

  // Delete car mutation
  const deleteCarMutation = useMutation({
    mutationFn: adminApi.deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cars'] });
    }
  });

  // User management mutations
  const blockUserMutation = useMutation({
    mutationFn: adminApi.blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });

  const unblockUserMutation = useMutation({
    mutationFn: adminApi.unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });

  const verifyUserMutation = useMutation({
    mutationFn: adminApi.verifyUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });

  const unverifyUserMutation = useMutation({
    mutationFn: adminApi.unverifyUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({ userId, password }: { userId: string; password: string }) =>
      adminApi.resetUserPassword(userId, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setResetPasswordUserId(null);
      setNewPassword('');
      alert('Password reset successfully!');
    },
    onError: (error: Error) => {
      alert(`Failed to reset password: ${error.message}`);
    }
  });

  // Update booking status mutation
  const updateBookingStatusMutation = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) =>
      adminApi.updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (payload: typeof settings) => {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update settings');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
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

  const handleDeleteCar = (carId: string, carTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${carTitle}"? This action cannot be undone.`)) {
      deleteCarMutation.mutate(carId);
    }
  };

  const handleBlockUser = (userId: string) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      blockUserMutation.mutate(userId);
    }
  };

  const handleUnblockUser = (userId: string) => {
    unblockUserMutation.mutate(userId);
  };

  const handleVerifyUser = (userId: string) => {
    verifyUserMutation.mutate(userId);
  };

  const handleUnverifyUser = (userId: string) => {
    unverifyUserMutation.mutate(userId);
  };

  const handleResetPassword = (userId: string) => {
    setResetPasswordUserId(userId);
    setNewPassword('');
  };

  const handleSubmitResetPassword = () => {
    if (!resetPasswordUserId || !newPassword) {
      alert('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    if (window.confirm('Are you sure you want to reset this user\'s password?')) {
      resetPasswordMutation.mutate({ userId: resetPasswordUserId, password: newPassword });
    }
  };

  // Calculate stats
  const stats = {
    totalUsers: users?.length || 0,
    totalCars: cars?.length || 0,
    totalBookings: bookings?.length || 0,
    activeBookings: bookings?.filter((b: any) => b.status === 'confirmed').length || 0,
    availableCars: cars?.filter((c: Car) => c.isAvailable).length || 0,
    verifiedUsers: users?.filter((u: AdminUser) => u.isVerified || (u.isIdVerified && u.isLicenseVerified)).length || 0,
    blockedUsers: users?.filter((u: AdminUser) => u.isBlocked).length || 0,
  };

  // Filter functions
  const filteredCars = cars?.filter((car: Car) => {
    const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'available' && car.isAvailable) ||
      (filterType === 'unavailable' && !car.isAvailable);
    return matchesSearch && matchesFilter;
  }) || [];

  const filteredUsers = users?.filter((user: AdminUser) => {
    const matchesSearch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = userFilterType === 'all' || user.userType === userFilterType;
    return matchesSearch && matchesFilter;
  }) || [];

  const filteredBookings = bookings?.filter((booking: any) => {
    const matchesSearch = booking.carTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.renterName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = bookingFilterStatus === 'all' || booking.status === bookingFilterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  // Check if user is admin - AFTER all hooks
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
        {(carsError || usersError || bookingsError) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p className="font-semibold">API Error</p>
            </div>
            <p className="text-sm text-red-600 mt-1">
              {carsError && `Cars: ${carsError.message} `}
              {usersError && `Users: ${usersError.message} `}
              {bookingsError && `Bookings: ${bookingsError.message}`}
            </p>
            <p className="text-xs text-red-500 mt-2">
              Make sure you're logged in as an admin user and have valid authentication token.
            </p>
          </div>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center gap-2">
              <CarIcon className="h-4 w-4" />
              Cars ({stats.totalCars})
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users ({stats.totalUsers})
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Bookings ({stats.totalBookings})
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview/Dashboard Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.verifiedUsers} verified, {stats.blockedUsers} blocked
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
                  <CarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCars}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.availableCars} available
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeBookings} active
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Platform Status</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <Badge variant={settings.maintenanceMode ? "destructive" : "default"}>
                      {settings.maintenanceMode ? "Maintenance" : "Active"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    System operational
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('cars')}>
                    <CarIcon className="h-4 w-4 mr-2" />
                    Manage Cars
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('users')}>
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('bookings')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    View Bookings
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Platform Settings
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.blockedUsers > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm">{stats.blockedUsers} blocked user(s)</p>
                    </div>
                  )}
                  {stats.totalCars === 0 && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded mb-2">
                      <CarIcon className="h-4 w-4 text-blue-600" />
                      <p className="text-sm">No cars in the system</p>
                    </div>
                  )}
                  {settings.maintenanceMode && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 rounded mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <p className="text-sm">Maintenance mode is active</p>
                    </div>
                  )}
                  {stats.blockedUsers === 0 && stats.totalCars > 0 && !settings.maintenanceMode && (
                    <p className="text-sm text-gray-500">No alerts at this time</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cars Management */}
          <TabsContent value="cars" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CarIcon className="h-5 w-5" />
                    All Cars ({filteredCars.length})
                  </CardTitle>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search cars..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterType === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterType === 'available' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('available')}
                    >
                      Available
                    </Button>
                    <Button
                      variant={filterType === 'unavailable' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('unavailable')}
                    >
                      Unavailable
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {carsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : carsError ? (
                  <div className="text-center py-8 text-red-600">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Error loading cars: {carsError.message}</p>
                  </div>
                ) : !cars || cars.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CarIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No cars found in the system.</p>
                  </div>
                ) : filteredCars.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CarIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No cars found matching your search.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCars.map((car: Car) => (
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
                              title={car.isAvailable ? "Make Unavailable" : "Make Available"}
                            >
                              {car.isAvailable ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteCar(car.id, car.title)}
                              disabled={deleteCarMutation.isPending}
                              title="Delete Car"
                            >
                              <Trash2 className="h-4 w-4" />
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
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    All Users ({filteredUsers.length})
                  </CardTitle>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={userFilterType === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUserFilterType('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={userFilterType === 'owner' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUserFilterType('owner')}
                    >
                      Owners
                    </Button>
                    <Button
                      variant={userFilterType === 'renter' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUserFilterType('renter')}
                    >
                      Renters
                    </Button>
                    <Button
                      variant={userFilterType === 'admin' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUserFilterType('admin')}
                    >
                      Admins
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : usersError ? (
                  <div className="text-center py-8 text-red-600">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Error loading users: {usersError.message}</p>
                  </div>
                ) : !users || users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No users found in the system.</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No users found matching your search.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((adminUser: AdminUser) => (
                      <div key={adminUser.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{adminUser.firstName} {adminUser.lastName}</h3>
                              <Badge variant={adminUser.userType === 'admin' ? 'default' : 'secondary'}>
                                {adminUser.userType}
                              </Badge>
                              {(adminUser.isVerified || (adminUser.isIdVerified && adminUser.isLicenseVerified)) && (
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
                            {expandedUserId === adminUser.id && (
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm space-y-2">
                                <p><span className="font-medium">User ID:</span> {adminUser.id}</p>
                                <p><span className="font-medium">Account Created:</span> {new Date(adminUser.createdAt).toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setExpandedUserId(expandedUserId === adminUser.id ? null : adminUser.id)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleResetPassword(adminUser.id)}
                              title="Reset Password"
                            >
                              <Lock className="h-4 w-4 text-blue-600" />
                            </Button>
                            {(adminUser.isVerified || (adminUser.isIdVerified && adminUser.isLicenseVerified)) ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUnverifyUser(adminUser.id)}
                                disabled={unverifyUserMutation.isPending}
                                title="Unverify User"
                              >
                                <XCircle className="h-4 w-4 text-yellow-600" />
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleVerifyUser(adminUser.id)}
                                disabled={verifyUserMutation.isPending}
                                title="Verify User"
                              >
                                <CheckSquare className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            {adminUser.isBlocked ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUnblockUser(adminUser.id)}
                                disabled={unblockUserMutation.isPending}
                                title="Unblock User"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            ) : (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleBlockUser(adminUser.id)}
                                disabled={blockUserMutation.isPending}
                                title="Block User"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            )}
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

          {/* Password Reset Modal */}
          {resetPasswordUserId && (() => {
            const userToReset = users?.find((u: AdminUser) => u.id === resetPasswordUserId);
            return (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Reset User Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userToReset && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">
                            Resetting password for:
                          </p>
                          <p className="text-sm text-gray-900 mt-1">
                            {userToReset.firstName} {userToReset.lastName} ({userToReset.email})
                          </p>
                        </div>
                      )}
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min 8 characters)"
                          className="mt-1"
                          autoFocus
                        />
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setResetPasswordUserId(null);
                            setNewPassword('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSubmitResetPassword}
                          disabled={resetPasswordMutation.isPending || !newPassword || newPassword.length < 8}
                        >
                          {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })()}

          {/* Other tabs can be added here */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    All Bookings ({filteredBookings.length})
                  </CardTitle>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={bookingFilterStatus === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBookingFilterStatus('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={bookingFilterStatus === 'confirmed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBookingFilterStatus('confirmed')}
                    >
                      Confirmed
                    </Button>
                    <Button
                      variant={bookingFilterStatus === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBookingFilterStatus('pending')}
                    >
                      Pending
                    </Button>
                    <Button
                      variant={bookingFilterStatus === 'cancelled' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBookingFilterStatus('cancelled')}
                    >
                      Cancelled
                    </Button>
                    <Button
                      variant={bookingFilterStatus === 'completed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBookingFilterStatus('completed')}
                    >
                      Completed
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : bookingsError ? (
                  <div className="text-center py-8 text-red-600">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Error loading bookings: {bookingsError.message}</p>
                  </div>
                ) : !bookings || bookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No bookings found.</p>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No bookings found matching your search.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking: any) => (
                      <div key={booking.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{booking.carTitle}</h3>
                              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Renter:</span> {booking.renterName}
                              </div>
                              <div>
                                <span className="font-medium">Owner:</span> {booking.ownerName}
                              </div>
                              <div>
                                <span className="font-medium">Start:</span> {new Date(booking.startDate).toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">End:</span> {new Date(booking.endDate).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setExpandedBookingId(expandedBookingId === booking.id ? null : booking.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateBookingStatusMutation.mutate({ bookingId: booking.id, status: 'confirmed' })}
                              disabled={updateBookingStatusMutation.isPending || booking.status === 'confirmed'}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => updateBookingStatusMutation.mutate({ bookingId: booking.id, status: 'cancelled' })}
                              disabled={updateBookingStatusMutation.isPending || booking.status === 'cancelled'}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                        {expandedBookingId === booking.id && (
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                            <div>
                              <p><span className="font-medium">Booking ID:</span> {booking.id}</p>
                              <p><span className="font-medium">Status:</span> {booking.status}</p>
                            </div>
                            <div>
                              <p><span className="font-medium">Created:</span> {new Date(booking.createdAt).toLocaleString()}</p>
                              <p><span className="font-medium">Total:</span> {formatCurrency(Number(booking.totalPrice || booking.totalAmount || 0))}</p>
                            </div>
                            <div>
                              <p><span className="font-medium">Notes:</span> {booking.notes || '—'}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Platform Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {settingsError ? (
                  <div className="text-center py-8 text-red-600">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Error loading settings: {settingsError.message}</p>
                  </div>
                ) : (
                  <form
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateSettingsMutation.mutate(settings);
                    }}
                  >
                    <div className="col-span-1 md:col-span-3 flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div>
                        <p className="font-medium">Maintenance Mode</p>
                        <p className="text-sm text-gray-600">Temporarily disable new bookings</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSettings(s => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
                      >
                        {settings.maintenanceMode ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bookingWindowDays">Booking Window (days)</Label>
                      <Input
                        id="bookingWindowDays"
                        type="number"
                        value={settings.bookingWindowDays}
                        min={1}
                        onChange={(e) => setSettings(s => ({ ...s, bookingWindowDays: parseInt(e.target.value || '0', 10) }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxCancellationHours">Max Cancellation (hours)</Label>
                      <Input
                        id="maxCancellationHours"
                        type="number"
                        value={settings.maxCancellationHours}
                        min={0}
                        onChange={(e) => setSettings(s => ({ ...s, maxCancellationHours: parseInt(e.target.value || '0', 10) }))}
                      />
                    </div>

                    <div className="col-span-1 md:col-span-3 flex justify-end gap-2">
                      <Button type="submit" disabled={updateSettingsMutation.isPending}>
                        {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer is rendered globally in App */}
    </div>
  );
}




