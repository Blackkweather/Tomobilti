import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { 
  Calendar, 
  Heart, 
  Star, 
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Car,
  User,
  ArrowUpRight,
  Activity,
  Target,
  Award,
  MessageSquare,
  Settings,
  BarChart3,
  LineChart,
  TrendingUp,
  DollarSign,
  Eye,
  Zap,
  Shield,
  Gift
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';

// Enhanced mock data
const mockBookings = [
  {
    id: 'b1',
    carTitle: 'BMW 3 Series - Premium Sedan',
    carImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&auto=format',
    ownerName: 'James Smith',
    ownerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format',
    location: 'London, Westminster',
    startDate: '2024-12-20',
    endDate: '2024-12-23',
    totalAmount: 1350,
    status: 'upcoming',
    canReview: false,
    daysUntil: 2,
    rating: null
  },
  {
    id: 'b2',
    carTitle: 'Ford Focus - City Car',
    carImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop&auto=format',
    ownerName: 'Sarah Johnson',
    ownerImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&auto=format',
    location: 'Manchester, Centre',
    startDate: '2024-12-10',
    endDate: '2024-12-13',
    totalAmount: 840,
    status: 'completed',
    canReview: true,
    daysUntil: 0,
    rating: 5
  },
  {
    id: 'b3',
    carTitle: 'Tesla Model 3 - Electric',
    carImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop&auto=format',
    ownerName: 'Michael Brown',
    ownerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format',
    location: 'Edinburgh, New Town',
    startDate: '2024-12-05',
    endDate: '2024-12-08',
    totalAmount: 1950,
    status: 'completed',
    canReview: true,
    daysUntil: 0,
    rating: 4
  }
];

const mockFavorites = [
  {
    id: 'f1',
    title: 'Tesla Model 3 - Electric',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop&auto=format',
    location: 'Edinburgh, New Town',
    pricePerDay: 65,
    rating: 4.9,
    ownerName: 'Michael Brown',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023
  },
  {
    id: 'f2',
    title: 'Mercedes A-Class',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&auto=format',
    location: 'Glasgow, City Centre',
    pricePerDay: 50,
    rating: 4.7,
    ownerName: 'Emma Wilson',
    make: 'Mercedes',
    model: 'A-Class',
    year: 2022
  },
  {
    id: 'f3',
    title: 'Audi A4 - Premium',
    image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=400&h=300&fit=crop&auto=format',
    location: 'Birmingham, City Centre',
    pricePerDay: 55,
    rating: 4.8,
    ownerName: 'David Lee',
    make: 'Audi',
    model: 'A4',
    year: 2021
  }
];

const bookingStatusConfig = {
  upcoming: { label: 'Upcoming', variant: 'default' as const, icon: Clock, color: 'text-blue-600 bg-blue-50' },
  active: { label: 'Active', variant: 'secondary' as const, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  completed: { label: 'Completed', variant: 'outline' as const, icon: CheckCircle, color: 'text-gray-600 bg-gray-50' },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600 bg-red-50' }
};

export default function RenterDashboard() {
  const [selectedTab, setSelectedTab] = useState('bookings');
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleCancelBooking = (bookingId: string) => {
    console.log('Cancel booking:', bookingId);
  };

  const handleLeaveReview = (bookingId: string) => {
    console.log('Leave review for booking:', bookingId);
  };

  const handleRemoveFromFavorites = (favoriteId: string) => {
    console.log('Remove from favorites:', favoriteId);
  };

  const handleBookFavorite = (favoriteId: string) => {
    setLocation('/cars');
  };

  const handleViewCar = (carId: string) => {
    setLocation(`/cars/${carId}`);
  };

  // Calculate statistics
  const totalBookings = mockBookings.length;
  const completedBookings = mockBookings.filter(b => b.status === 'completed').length;
  const totalSpent = mockBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const averageRating = mockBookings
    .filter(b => b.rating)
    .reduce((sum, b) => sum + (b.rating || 0), 0) / mockBookings.filter(b => b.rating).length || 0;
  const thisMonthSpent = 1200; // Mock data
  const savingsThisMonth = 150; // Mock data
  const tripsThisMonth = 3; // Mock data

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-mauve-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-rose-500 to-mauve-500 rounded-xl">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-mauve-600 bg-clip-text text-transparent">
                  My Renter Space
                </h1>
                <p className="text-muted-foreground text-lg">Manage your bookings and discover amazing cars</p>
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
              onClick={() => setLocation('/cars')}
              className="bg-gradient-to-r from-rose-500 to-mauve-500 hover:from-rose-600 hover:to-mauve-600 hover-elevate active-elevate-2"
            >
              <Car className="h-4 w-4 mr-2" />
              Browse Cars
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
                    <span className="text-blue-600 font-medium">+{tripsThisMonth}</span>
                    <span className="text-muted-foreground">this month</span>
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
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Completed Trips</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {completedBookings}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">{averageRating.toFixed(1)}/5</span>
                    <span className="text-muted-foreground">avg rating</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
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
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Total Spent</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    £{totalSpent.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-purple-600 font-medium">£{thisMonthSpent}</span>
                    <span className="text-muted-foreground">this month</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full">
                  <DollarSign className="h-6 w-6 text-white" />
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
                      <Gift className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Savings</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    £{savingsThisMonth}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-600 font-medium">Member</span>
                    <span className="text-muted-foreground">discounts</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full">
                  <Gift className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border shadow-lg">
            <TabsTrigger value="bookings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-mauve-500 data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-mauve-500 data-[state=active]:text-white">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-mauve-500 data-[state=active]:text-white">
              <Star className="h-4 w-4 mr-2" />
              My Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bookings List */}
              <div className="lg:col-span-2 space-y-4">
                {mockBookings.length === 0 ? (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
                      <p className="text-muted-foreground mb-6">Start your journey by booking your first car!</p>
                      <Button 
                        onClick={() => setLocation('/cars')}
                        className="bg-gradient-to-r from-rose-500 to-mauve-500 hover:from-rose-600 hover:to-mauve-600"
                      >
                        Browse Cars
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  mockBookings.map((booking) => {
                    const statusConfig = bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig];
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <Card key={booking.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-0">
                          <div className="flex gap-6 p-6">
                            <img 
                              src={booking.carImage} 
                              alt={booking.carTitle}
                              className="w-32 h-24 rounded-lg object-cover"
                            />
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-xl">{booking.carTitle}</h3>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span>{booking.location}</span>
                                  </div>
                                </div>
                                <Badge className={`${statusConfig.color} border-0`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig.label}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={booking.ownerImage} alt={booking.ownerName} />
                                  <AvatarFallback className="text-xs">{booking.ownerName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-muted-foreground">
                                  Owner: <span className="font-medium">{booking.ownerName}</span>
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-sm">
                                  <p className="text-muted-foreground">
                                    {booking.startDate} to {booking.endDate}
                                    {booking.daysUntil > 0 && (
                                      <span className="ml-2 text-blue-600 font-medium">({booking.daysUntil} days until pickup)</span>
                                    )}
                                  </p>
                                  <p className="font-bold text-2xl text-rose-600">
                                    £{booking.totalAmount}
                                  </p>
                                </div>
                                
                                <div className="flex gap-2">
                                  {booking.status === 'upcoming' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleCancelBooking(booking.id)}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                  {booking.canReview && (
                                    <Button 
                                      size="sm"
                                      onClick={() => handleLeaveReview(booking.id)}
                                      className="bg-gradient-to-r from-rose-500 to-mauve-500 hover:from-rose-600 hover:to-mauve-600"
                                    >
                                      Leave Review
                                    </Button>
                                  )}
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Message
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>

              {/* Quick Actions & Stats */}
              <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-rose-600" />
                      Trip Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">This Month Trips</span>
                        <span className="font-semibold text-blue-600">{tripsThisMonth}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Money Saved</span>
                        <span className="font-semibold text-green-600">£{savingsThisMonth}</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-lg mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start hover-elevate">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-100 rounded-lg">
                              <Car className="h-4 w-4 text-rose-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Browse Cars</p>
                              <p className="text-xs text-muted-foreground">Find your next ride</p>
                            </div>
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start hover-elevate">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-mauve-100 rounded-lg">
                              <Heart className="h-4 w-4 text-mauve-600" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">View Favorites</p>
                              <p className="text-xs text-muted-foreground">Saved vehicles</p>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {mockFavorites.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
                  <p className="text-muted-foreground mb-6">Add vehicles to your favorites to find them easily.</p>
                  <Button 
                    onClick={() => setLocation('/cars')}
                    className="bg-gradient-to-r from-rose-500 to-mauve-500 hover:from-rose-600 hover:to-mauve-600"
                  >
                    Browse Cars
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockFavorites.map((favorite) => (
                  <Card key={favorite.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={favorite.image} 
                          alt={favorite.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 right-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromFavorites(favorite.id)}
                            className="h-8 w-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm"
                          >
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                        <div className="absolute top-3 left-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCar(favorite.id)}
                            className="h-8 w-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-bold text-xl">{favorite.title}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{favorite.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-semibold">{favorite.rating}</span>
                            <span className="text-sm text-muted-foreground">• {favorite.ownerName}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-rose-600">£{favorite.pricePerDay}</p>
                            <p className="text-xs text-muted-foreground">per day</p>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleBookFavorite(favorite.id)}
                          className="w-full bg-gradient-to-r from-rose-500 to-mauve-500 hover:from-rose-600 hover:to-mauve-600 hover-elevate active-elevate-2"
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                <p className="text-muted-foreground mb-6">Your vehicle ratings will appear here after your trips.</p>
                <Button 
                  onClick={() => setLocation('/cars')}
                  className="bg-gradient-to-r from-rose-500 to-mauve-500 hover:from-rose-600 hover:to-mauve-600"
                >
                  Start Your First Trip
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}