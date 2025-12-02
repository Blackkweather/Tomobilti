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
  ArrowUpRight,
  Activity,
  Target,
  Award,
  MapPin,
  MessageSquare,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';

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
  const [timeRange, setTimeRange] = useState('30d');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

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
  
  // Enhanced analytics calculations
  const enhancedStats = {
    totalEarnings,
    totalBookings,
    averageRating,
    averageOccupancy,
    monthlyGrowth: calculateGrowthRate(bookings, timeRange),
    topPerformingCar: getTopPerformingCar(cars, bookings),
    recentActivity: getRecentActivity(bookings),
    earningsTrend: calculateEarningsTrend(bookings, timeRange),
    occupancyRate: calculateOccupancyRate(cars, bookings),
    customerSatisfaction: calculateCustomerSatisfaction(cars),
    revenueBreakdown: calculateRevenueBreakdown(bookings),
    seasonalTrends: calculateSeasonalTrends(bookings)
  };

  // Helper functions for enhanced analytics
  function calculateGrowthRate(bookings: any[], period: string): number {
    const now = new Date();
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const currentPeriod = bookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      return bookingDate >= new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
    });
    
    const previousPeriod = bookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      const start = new Date(now.getTime() - (periodDays * 2) * 24 * 60 * 60 * 1000);
      const end = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
      return bookingDate >= start && bookingDate < end;
    });
    
    if (previousPeriod.length === 0) return 100;
    return ((currentPeriod.length - previousPeriod.length) / previousPeriod.length) * 100;
  }

  function getTopPerformingCar(cars: any[], bookings: any[]): any {
    if (!cars.length) return null;
    
    return cars.reduce((top, car) => {
      const carBookings = bookings.filter(b => b.carId === car.id);
      const carEarnings = carBookings.reduce((sum, b) => sum + (parseFloat(b.totalAmount) || 0), 0);
      
      const topEarnings = bookings.filter(b => b.carId === top.id)
        .reduce((sum, b) => sum + (parseFloat(b.totalAmount) || 0), 0);
      
      return carEarnings > topEarnings ? car : top;
    });
  }

  function getRecentActivity(bookings: any[]): any[] {
    return bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  function calculateEarningsTrend(bookings: any[], period: string): any[] {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const trend = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayBookings = bookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate >= dayStart && bookingDate <= dayEnd;
      });
      
      const dayEarnings = dayBookings.reduce((sum, b) => sum + (parseFloat(b.totalAmount) || 0), 0);
      
      trend.push({
        date: date.toISOString().split('T')[0],
        earnings: dayEarnings,
        bookings: dayBookings.length
      });
    }
    
    return trend;
  }

  function calculateOccupancyRate(cars: any[], bookings: any[]): number {
    if (!cars.length) return 0;
    
    const totalDays = cars.length * 30; // Assuming 30 days period
    const bookedDays = bookings.reduce((sum, booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    
    return (bookedDays / totalDays) * 100;
  }

  function calculateCustomerSatisfaction(cars: any[]): number {
    if (!cars.length) return 0;
    return cars.reduce((sum, car) => sum + (car.rating || 0), 0) / cars.length;
  }

  function calculateRevenueBreakdown(bookings: any[]): any {
    const breakdown = {
      daily: 0,
      weekly: 0,
      monthly: 0,
      total: 0
    };
    
    bookings.forEach(booking => {
      const amount = parseFloat(booking.totalAmount) || 0;
      breakdown.total += amount;
      
      const days = Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24));
      
      if (days <= 1) breakdown.daily += amount;
      else if (days <= 7) breakdown.weekly += amount;
      else breakdown.monthly += amount;
    });
    
    return breakdown;
  }

  function calculateSeasonalTrends(bookings: any[]): any {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trends = months.map(month => ({ month, bookings: 0, earnings: 0 }));
    
    bookings.forEach(booking => {
      const month = new Date(booking.createdAt).getMonth();
      trends[month].bookings += 1;
      trends[month].earnings += parseFloat(booking.totalAmount) || 0;
    });
    
    return trends;
  }

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };
  
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

  // Show loading state with skeleton loaders
  if (carsLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mauve-50 via-white to-bleu-50">
        <div className="container mx-auto p-6 space-y-8">
          {/* Header Skeleton */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="h-12 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
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
            {/* Enhanced Analytics Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h2>
                <p className="text-gray-600">Comprehensive insights into your car rental business</p>
              </div>
              <div className="flex gap-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
                <Button onClick={refreshData} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Earnings</p>
                      <p className="text-2xl font-bold">£{enhancedStats.totalEarnings.toLocaleString()}</p>
                      <p className="text-blue-200 text-xs">
                        {enhancedStats.monthlyGrowth > 0 ? (
                          <span className="flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +{enhancedStats.monthlyGrowth.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            {enhancedStats.monthlyGrowth.toFixed(1)}%
                          </span>
                        )}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Bookings</p>
                      <p className="text-2xl font-bold">{enhancedStats.totalBookings}</p>
                      <p className="text-green-200 text-xs">
                        <span className="flex items-center">
                          <Activity className="h-3 w-3 mr-1" />
                          {enhancedStats.occupancyRate.toFixed(1)}% occupancy
                        </span>
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Avg Rating</p>
                      <p className="text-2xl font-bold">{enhancedStats.customerSatisfaction.toFixed(1)}</p>
                      <p className="text-purple-200 text-xs">
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          Customer satisfaction
                        </span>
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Active Cars</p>
                      <p className="text-2xl font-bold">{cars.length}</p>
                      <p className="text-orange-200 text-xs">
                        <span className="flex items-center">
                          <Car className="h-3 w-3 mr-1" />
                          In your fleet
                        </span>
                      </p>
                    </div>
                    <Car className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

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

            {/* Enhanced Analytics Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing Car */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Top Performing Car
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {enhancedStats.topPerformingCar ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        {enhancedStats.topPerformingCar.images && enhancedStats.topPerformingCar.images.length > 0 ? (
                          <img
                            src={enhancedStats.topPerformingCar.images[0]}
                            alt={enhancedStats.topPerformingCar.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Car className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{enhancedStats.topPerformingCar.title}</h4>
                          <p className="text-gray-600">{enhancedStats.topPerformingCar.make} {enhancedStats.topPerformingCar.model}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium">{enhancedStats.topPerformingCar.rating?.toFixed(1) || 'N/A'}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              £{enhancedStats.topPerformingCar.pricePerDay}/day
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            £{bookings.filter((b: any) => b.carId === enhancedStats.topPerformingCar.id)
                              .reduce((sum: number, b: any) => sum + (parseFloat(b.totalAmount) || 0), 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">Total Earnings</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {bookings.filter((b: any) => b.carId === enhancedStats.topPerformingCar.id).length}
                          </p>
                          <p className="text-xs text-gray-600">Bookings</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {enhancedStats.occupancyRate.toFixed(0)}%
                          </p>
                          <p className="text-xs text-gray-600">Occupancy</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No cars available yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Revenue Breakdown */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Daily Rentals</span>
                        </div>
                        <span className="font-semibold">£{enhancedStats.revenueBreakdown.daily.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(enhancedStats.revenueBreakdown.daily / enhancedStats.revenueBreakdown.total) * 100} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Weekly Rentals</span>
                        </div>
                        <span className="font-semibold">£{enhancedStats.revenueBreakdown.weekly.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(enhancedStats.revenueBreakdown.weekly / enhancedStats.revenueBreakdown.total) * 100} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">Monthly Rentals</span>
                        </div>
                        <span className="font-semibold">£{enhancedStats.revenueBreakdown.monthly.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(enhancedStats.revenueBreakdown.monthly / enhancedStats.revenueBreakdown.total) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Revenue</span>
                      <span className="text-xl font-bold text-green-600">£{enhancedStats.revenueBreakdown.total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Earnings Trend Chart */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-600" />
                  Earnings Trend ({timeRange})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {enhancedStats.earningsTrend.slice(-7).map((day, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-gray-600 mb-2">
                          {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                        </div>
                        <div 
                          className="bg-blue-500 rounded-t-sm mx-auto"
                          style={{ 
                            height: `${Math.max(20, (day.earnings / Math.max(...enhancedStats.earningsTrend.map(d => d.earnings))) * 100)}px`,
                            width: '20px'
                          }}
                        ></div>
                        <div className="text-xs text-gray-600 mt-1">
                          £{day.earnings.toFixed(0)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Lowest: £{Math.min(...enhancedStats.earningsTrend.map(d => d.earnings)).toFixed(0)}</span>
                    <span>Highest: £{Math.max(...enhancedStats.earningsTrend.map(d => d.earnings)).toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
