import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { 
  Car, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Star, 
  PoundSterling,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  User,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Award,
  MapPin,
  Users,
  MessageSquare,
  Settings,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';
import { carApi, bookingApi } from '../lib/api';

// Helper function to calculate car statistics
const calculateCarStats = (cars: any[], bookings: any[]) => {
  const totalEarnings = bookings.reduce((sum, booking) => sum + (parseFloat(booking.totalAmount) || 0), 0);
  const totalBookings = bookings.length;
  const averageRating = cars.length > 0 ? cars.reduce((sum, car) => sum + (car.rating || 0), 0) / cars.length : 0;
  const averageOccupancy = cars.length > 0 ? cars.reduce((sum, car) => {
    const carBookings = bookings.filter(b => b.carId === car.id);
    const totalDays = carBookings.reduce((sum, booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    return sum + Math.min((totalDays / 30) * 100, 100); // Assume 30 days per month
  }, 0) / cars.length : 0;
  
  return { totalEarnings, totalBookings, averageRating, averageOccupancy };
};

const statusConfig = {
  available: { label: 'Available', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  rented: { label: 'Rented', variant: 'secondary' as const, icon: Clock, color: 'text-blue-600 bg-blue-50' },
  maintenance: { label: 'Maintenance', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600 bg-red-50' }
};

const bookingStatusConfig = {
  upcoming: { label: 'Upcoming', variant: 'default' as const, color: 'text-blue-600 bg-blue-50' },
  active: { label: 'Active', variant: 'secondary' as const, color: 'text-green-600 bg-green-50' },
  completed: { label: 'Completed', variant: 'outline' as const, color: 'text-gray-600 bg-gray-50' },
  confirmed: { label: 'Confirmed', variant: 'default' as const, color: 'text-green-600 bg-green-50' },
  pending: { label: 'Pending', variant: 'secondary' as const, color: 'text-yellow-600 bg-yellow-50' },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, color: 'text-red-600 bg-red-50' }
};

export default function OwnerDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch owner's cars
  const { data: carsData, isLoading: carsLoading, error: carsError } = useQuery({
    queryKey: ['ownerCars', user?.id],
    queryFn: async () => {
      if (!user?.id) return { cars: [] };
      const response = await fetch(`/api/cars/owner/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch cars');
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Fetch owner's bookings
  const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ['ownerBookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return { bookings: [] };
      const response = await fetch(`/api/bookings/owner/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
    enabled: !!user?.id,
  });

  const cars = carsData?.cars || [];
  const bookings = bookingsData?.bookings || [];
  
  // Debug: Log the bookings data structure
  console.log('OwnerDashboard - Bookings data:', bookings);
  console.log('OwnerDashboard - Cars data:', cars);
  console.log('OwnerDashboard - Bookings loading:', bookingsLoading);
  console.log('OwnerDashboard - Bookings error:', bookingsError);
  console.log('OwnerDashboard - Cars loading:', carsLoading);
  console.log('OwnerDashboard - Cars error:', carsError);
  
  // Debug: Log individual booking details
  if (bookings.length > 0) {
    console.log('First booking details:', bookings[0]);
    console.log('Booking status:', bookings[0].status);
    console.log('Booking renter:', bookings[0].renter);
    console.log('Booking car:', bookings[0].car);
  }
  
  // Calculate statistics from real data
  const { totalEarnings, totalBookings, averageRating, averageOccupancy } = calculateCarStats(cars, bookings);
  
  // Mock growth data (you can replace with real calculations later)
  const thisMonthEarnings = totalEarnings * 0.3; // Assume 30% of total is this month
  const thisMonthBookings = Math.floor(totalBookings * 0.3);
  const earningsGrowth = 12.5; // Mock percentage
  const bookingsGrowth = 8.3; // Mock percentage

  const handleAddCar = () => {
    setLocation('/add-car');
  };

  const handleEditCar = (carId: string) => {
    setLocation(`/edit-car/${carId}`);
  };

  const handleViewCar = (carId: string) => {
    setLocation(`/cars/${carId}`);
  };

  const handleViewBooking = (bookingId: string) => {
    setLocation(`/booking/${bookingId}`);
  };

  const handleSettings = () => {
    setLocation('/settings');
  };

  const handleAnalytics = () => {
    setLocation('/analytics');
  };

  const handleMessageRenter = (bookingId: string) => {
    // Find the booking to get renter details
    const booking = bookings.find((b: any) => b.id === bookingId);
    if (booking && booking.renter) {
      // Navigate to messaging app
      console.log('Navigating to messages for booking:', bookingId);
      setLocation('/messages');
    } else {
      alert('Messaging feature coming soon! This will allow you to communicate with the renter.');
    }
  };

  // Show loading state
  if (carsLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mauve-50 via-white to-bleu-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mauve-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (carsError || bookingsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mauve-50 via-white to-bleu-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <XCircle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-4">
            {carsError?.message || bookingsError?.message || 'Failed to load data'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mauve-50 via-white to-bleu-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-mauve-500 to-bleu-500 rounded-xl">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-mauve-600 to-bleu-600 bg-clip-text text-transparent">
                  Owner Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">Manage your fleet and maximize earnings</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Unknown'}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleSettings}
              variant="outline" 
              className="hover-elevate active-elevate-2 border-mauve-200 hover:border-mauve-300 hover:bg-mauve-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              onClick={handleAddCar} 
              className="bg-gradient-to-r from-mauve-500 to-bleu-500 hover:from-mauve-600 hover:to-bleu-600 hover-elevate active-elevate-2 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <PoundSterling className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Total Earnings</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    £{totalEarnings.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">+{earningsGrowth}%</span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Total Bookings</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalBookings}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowUpRight className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-600 font-medium">+{bookingsGrowth}%</span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Car className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Active Vehicles</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {cars.length}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="text-purple-600 font-medium">{averageOccupancy.toFixed(0)}%</span>
                    <span className="text-muted-foreground">avg occupancy</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full">
                  <Car className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Star className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-600 font-medium">Excellent</span>
                    <span className="text-muted-foreground">performance</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mauve-500 data-[state=active]:to-bleu-500 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="cars" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mauve-500 data-[state=active]:to-bleu-500 data-[state=active]:text-white">
              <Car className="h-4 w-4 mr-2" />
              My Vehicles
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mauve-500 data-[state=active]:to-bleu-500 data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Overview */}
              <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-mauve-600" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">This Month Earnings</span>
                        <span className="font-semibold text-green-600">£{thisMonthEarnings.toLocaleString()}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">This Month Bookings</span>
                        <span className="font-semibold text-blue-600">{thisMonthBookings}</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={handleAddCar}
                        variant="outline" 
                        className="h-auto p-4 justify-start hover-elevate border-mauve-200 hover:border-mauve-300 hover:bg-mauve-50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-mauve-100 rounded-lg">
                            <Plus className="h-4 w-4 text-mauve-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Add Vehicle</p>
                            <p className="text-xs text-muted-foreground">List a new car</p>
                          </div>
                        </div>
                      </Button>
                      <Button 
                        onClick={handleAnalytics}
                        variant="outline" 
                        className="h-auto p-4 justify-start hover-elevate border-bleu-200 hover:border-bleu-300 hover:bg-bleu-50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-bleu-100 rounded-lg">
                            <BarChart3 className="h-4 w-4 text-bleu-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">View Analytics</p>
                            <p className="text-xs text-muted-foreground">Detailed insights</p>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-bleu-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bookings.slice(0, 3).map((booking: any) => {
                    // Extract data from the enriched booking structure
                    const renterName = booking.renter ? 
                      `${booking.renter.firstName || ''} ${booking.renter.lastName || ''}`.trim() || 
                      'Unknown Renter' : 'Unknown Renter';
                    const carTitle = booking.car ? booking.car.title : 'Unknown Car';
                    const renterImage = booking.renter?.profileImage;
                    const safeRenterName = renterName || 'Unknown Renter';
                    
                    return (
                      <div key={booking.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={renterImage} alt={safeRenterName} />
                          <AvatarFallback>{safeRenterName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{safeRenterName}</p>
                          <p className="text-xs text-muted-foreground truncate">{carTitle}</p>
                        </div>
                        <Badge 
                          variant={bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig]?.variant || 'default'} 
                          className="text-xs"
                        >
                          {bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig]?.label || booking.status}
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cars" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {cars.map((car: any) => {
                // Use isAvailable field from database instead of non-existent status field
                const carStatus = car.isAvailable ? 'available' : 'rented';
                const statusInfo = statusConfig[carStatus as keyof typeof statusConfig] || statusConfig.available;
                const StatusIcon = statusInfo.icon;
                return (
                  <Card key={car.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={car.images?.[0] || '/assets/hero-car-1.jpg'} 
                          alt={car.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className={`${statusInfo.color} border-0`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="absolute top-3 left-3">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewCar(car.id)}
                              className="h-8 w-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCar(car.id)}
                              className="h-8 w-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-bold text-xl">{car.title}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{car.city || car.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-semibold">{car.rating}</span>
                            <span className="text-sm text-muted-foreground">({car.bookingsCount} trips)</span>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-mauve-600">£{car.pricePerDay}</p>
                            <p className="text-xs text-muted-foreground">per day</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Occupancy Rate</span>
                            <span className="font-semibold">{(() => {
                              const carBookings = bookings.filter((b: any) => b.carId === car.id);
                              const totalDays = carBookings.reduce((sum: number, booking: any) => {
                                const start = new Date(booking.startDate);
                                const end = new Date(booking.endDate);
                                return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                              }, 0);
                              const occupancyRate = Math.min((totalDays / 30) * 100, 100); // Assume 30 days per month
                              return Math.round(occupancyRate);
                            })()}%</span>
                          </div>
                          <Progress value={(() => {
                            const carBookings = bookings.filter((b: any) => b.carId === car.id);
                            const totalDays = carBookings.reduce((sum: number, booking: any) => {
                              const start = new Date(booking.startDate);
                              const end = new Date(booking.endDate);
                              return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                            }, 0);
                            const occupancyRate = Math.min((totalDays / 30) * 100, 100); // Assume 30 days per month
                            return Math.round(occupancyRate);
                          })()} className="h-2" />
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Total Earnings</p>
                              <p className="font-semibold text-green-600">£{(() => {
                                const carBookings = bookings.filter((b: any) => b.carId === car.id);
                                const carEarnings = carBookings.reduce((sum: number, booking: any) => sum + (parseFloat(booking.totalAmount) || 0), 0);
                                return carEarnings.toLocaleString();
                              })()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Next Booking</p>
                              <p className="font-semibold">{(() => {
                                const carBookings = bookings.filter((b: any) => b.carId === car.id);
                                const upcomingBooking = carBookings.find((b: any) => new Date(b.startDate) > new Date());
                                return upcomingBooking ? new Date(upcomingBooking.startDate).toLocaleDateString() : 'None';
                              })()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-4">When customers book your cars, they'll appear here.</p>
                <Button onClick={handleAddCar} className="bg-mauve-600 hover:bg-mauve-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Car
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: any) => {
                // Extract data from the enriched booking structure
                const renterName = booking.renter ? 
                  `${booking.renter.firstName || ''} ${booking.renter.lastName || ''}`.trim() || 
                  'Unknown Renter' : 'Unknown Renter';
                const carTitle = booking.car ? booking.car.title : 'Unknown Car';
                const renterImage = booking.renter?.profileImage;
                
                // Ensure renterName is never undefined
                const safeRenterName = renterName || 'Unknown Renter';
                
                // Calculate days until pickup
                const startDate = new Date(booking.startDate);
                const today = new Date();
                const daysUntil = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <Card key={booking.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14">
                            <AvatarImage src={renterImage} alt={safeRenterName} />
                            <AvatarFallback className="text-lg">{safeRenterName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h3 className="font-bold text-lg">{safeRenterName}</h3>
                            <p className="text-muted-foreground">{carTitle}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</span>
                              {daysUntil > 0 && (
                                <span className="text-blue-600 font-medium">{daysUntil} days until pickup</span>
                              )}
                            </div>
                            {booking.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-medium">{booking.rating}/5</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-bold text-lg">£{parseFloat(booking.totalAmount || 0).toFixed(2)}</p>
                            <Badge className={`${bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig]?.color || 'text-gray-600 bg-gray-50'}`}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewBooking(booking.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMessageRenter(booking.id)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
