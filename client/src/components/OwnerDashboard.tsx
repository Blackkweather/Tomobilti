import { useState } from 'react';
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
  DollarSign,
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

// Enhanced mock data with more realistic information
const mockCars = [
  {
    id: '1',
    title: 'BMW 3 Series',
    make: 'BMW',
    model: '3 Series',
    year: 2022,
    location: 'London, Westminster',
    pricePerDay: 45,
    status: 'available',
    totalEarnings: 13500,
    bookingsCount: 15,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&auto=format',
    occupancyRate: 78,
    lastBooking: '2024-12-15',
    nextBooking: '2024-12-20'
  },
  {
    id: '2', 
    title: 'Ford Focus',
    make: 'Ford',
    model: 'Focus',
    year: 2021,
    location: 'Manchester, City Centre',
    pricePerDay: 28,
    status: 'rented',
    totalEarnings: 8400,
    bookingsCount: 12,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop&auto=format',
    occupancyRate: 65,
    lastBooking: '2024-12-10',
    nextBooking: '2024-12-18'
  },
  {
    id: '3',
    title: 'Tesla Model 3',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    location: 'Edinburgh, New Town',
    pricePerDay: 65,
    status: 'available',
    totalEarnings: 19500,
    bookingsCount: 18,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop&auto=format',
    occupancyRate: 85,
    lastBooking: '2024-12-12',
    nextBooking: '2024-12-19'
  }
];

const mockBookings = [
  {
    id: 'b1',
    carTitle: 'BMW 3 Series',
    renterName: 'James Smith',
    renterImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format',
    startDate: '2024-12-20',
    endDate: '2024-12-23',
    totalAmount: 1350,
    status: 'upcoming',
    daysUntil: 2,
    rating: null
  },
  {
    id: 'b2',
    carTitle: 'Ford Focus', 
    renterName: 'Sarah Johnson',
    renterImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&auto=format',
    startDate: '2024-12-15',
    endDate: '2024-12-17',
    totalAmount: 560,
    status: 'completed',
    daysUntil: 0,
    rating: 5
  },
  {
    id: 'b3',
    carTitle: 'Tesla Model 3',
    renterName: 'Michael Brown',
    renterImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format',
    startDate: '2024-12-10',
    endDate: '2024-12-12',
    totalAmount: 1300,
    status: 'completed',
    daysUntil: 0,
    rating: 4
  }
];

const statusConfig = {
  available: { label: 'Available', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  rented: { label: 'Rented', variant: 'secondary' as const, icon: Clock, color: 'text-blue-600 bg-blue-50' },
  maintenance: { label: 'Maintenance', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600 bg-red-50' }
};

const bookingStatusConfig = {
  upcoming: { label: 'Upcoming', variant: 'default' as const, color: 'text-blue-600 bg-blue-50' },
  active: { label: 'Active', variant: 'secondary' as const, color: 'text-green-600 bg-green-50' },
  completed: { label: 'Completed', variant: 'outline' as const, color: 'text-gray-600 bg-gray-50' }
};

export default function OwnerDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleAddCar = () => {
    setLocation('/add-car');
  };

  const handleEditCar = (carId: string) => {
    setLocation(`/edit-car/${carId}`);
  };

  const handleViewCar = (carId: string) => {
    setLocation(`/cars/${carId}`);
  };

  // Calculate statistics
  const totalEarnings = mockCars.reduce((sum, car) => sum + car.totalEarnings, 0);
  const totalBookings = mockCars.reduce((sum, car) => sum + car.bookingsCount, 0);
  const averageRating = mockCars.length > 0 ? mockCars.reduce((sum, car) => sum + car.rating, 0) / mockCars.length : 0;
  const averageOccupancy = mockCars.length > 0 ? mockCars.reduce((sum, car) => sum + car.occupancyRate, 0) / mockCars.length : 0;
  const thisMonthEarnings = 4200; // Mock data
  const thisMonthBookings = 8; // Mock data
  const earningsGrowth = 12.5; // Mock percentage
  const bookingsGrowth = 8.3; // Mock percentage

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
                <span>Member since {new Date(user.createdAt).toLocaleDateString('en-GB', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="hover-elevate active-elevate-2"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              onClick={handleAddCar} 
              className="bg-gradient-to-r from-mauve-500 to-bleu-500 hover:from-mauve-600 hover:to-bleu-600 hover-elevate active-elevate-2"
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
                      <DollarSign className="h-5 w-5 text-green-600" />
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
                    {mockCars.length}
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
                      <Button variant="outline" className="h-auto p-4 justify-start hover-elevate">
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
                      <Button variant="outline" className="h-auto p-4 justify-start hover-elevate">
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
                  {mockBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={booking.renterImage} alt={booking.renterName} />
                        <AvatarFallback>{booking.renterName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{booking.renterName}</p>
                        <p className="text-xs text-muted-foreground truncate">{booking.carTitle}</p>
                      </div>
                      <Badge variant={bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig].variant} className="text-xs">
                        {bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig].label}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cars" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockCars.map((car) => {
                const StatusIcon = statusConfig[car.status as keyof typeof statusConfig].icon;
                return (
                  <Card key={car.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={car.image} 
                          alt={car.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className={`${statusConfig[car.status as keyof typeof statusConfig].color} border-0`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[car.status as keyof typeof statusConfig].label}
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
                            <span>{car.location}</span>
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
                            <span className="font-semibold">{car.occupancyRate}%</span>
                          </div>
                          <Progress value={car.occupancyRate} className="h-2" />
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Total Earnings</p>
                              <p className="font-semibold text-green-600">£{car.totalEarnings.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Next Booking</p>
                              <p className="font-semibold">{car.nextBooking}</p>
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
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <Card key={booking.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={booking.renterImage} alt={booking.renterName} />
                          <AvatarFallback className="text-lg">{booking.renterName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg">{booking.renterName}</h3>
                          <p className="text-muted-foreground">{booking.carTitle}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{booking.startDate} to {booking.endDate}</span>
                            {booking.daysUntil > 0 && (
                              <span className="text-blue-600 font-medium">{booking.daysUntil} days until pickup</span>
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
                      
                      <div className="text-right space-y-2">
                        <Badge variant={bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig].variant} className="text-sm">
                          {bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig].label}
                        </Badge>
                        <p className="text-2xl font-bold text-mauve-600">
                          £{booking.totalAmount}
                        </p>
                        <Button variant="outline" size="sm" className="hover-elevate">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}