import { useState, useEffect } from 'react';
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
  PoundSterling,
  Eye,
  Zap,
  Shield,
  Gift
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { bookingApi, carApi, reviewApi } from '../lib/api';
import LoadingSpinner from './LoadingSpinner';

const bookingStatusConfig = {
  confirmed: { label: 'Confirmed', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock, color: 'text-blue-600 bg-blue-50' },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600 bg-red-50' },
  completed: { label: 'Completed', variant: 'outline' as const, icon: CheckCircle, color: 'text-gray-600 bg-gray-50' }
};

export default function RenterDashboard() {
  const [selectedTab, setSelectedTab] = useState('bookings');
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch user's bookings as a renter
  const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ['renterBookings', user?.id],
    queryFn: () => bookingApi.getRenterBookings(user!.id),
    enabled: !!user?.id,
  });

  // Fetch user's reviews
  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useQuery({
    queryKey: ['userReviews', user?.id],
    queryFn: () => reviewApi.getUserReviews(user!.id),
    enabled: !!user?.id,
  });

  // Fetch all cars for favorites (we'll implement favorites API later)
  const { data: carsData, isLoading: carsLoading, error: carsError } = useQuery({
    queryKey: ['allCars'],
    queryFn: () => carApi.searchCars({ sortBy: 'date', sortOrder: 'desc', page: 1, limit: 100 }),
  });

  const bookings = bookingsData?.bookings || [];
  const reviews = reviewsData?.reviews || [];
  const cars = carsData?.cars || [];

  // Calculate statistics from real data
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter((b: any) => b.status === 'confirmed').length;
  const totalSpent = bookings
    .filter((b: any) => b.status === 'confirmed')
    .reduce((sum: number, b: any) => sum + (parseFloat(b.totalAmount) || 0), 0);
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length 
    : 0;

  // Calculate this month's data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthBookings = bookings.filter((b: any) => {
    const bookingDate = new Date(b.startDate);
    return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
  });
  
  const thisMonthSpent = thisMonthBookings
    .filter((b: any) => b.status === 'confirmed')
    .reduce((sum: number, b: any) => sum + (parseFloat(b.totalAmount) || 0), 0);
  
  const tripsThisMonth = thisMonthBookings.length;
  const savingsThisMonth = Math.round(thisMonthSpent * 0.1); // 10% savings estimate

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingApi.cancelBooking(bookingId);
      // Refresh bookings data
      window.location.reload();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const handleLeaveReview = (bookingId: string) => {
    // Navigate to review page or open review modal
    console.log('Leave review for booking:', bookingId);
  };

  const handleRemoveFromFavorites = (carId: string) => {
    // TODO: Implement remove from favorites API
    console.log('Remove from favorites:', carId);
  };

  const handleBookFavorite = (carId: string) => {
    setLocation(`/cars/${carId}`);
  };

  const handleViewCar = (carId: string) => {
    setLocation(`/cars/${carId}`);
  };

  const handleMessageOwner = (bookingId: string) => {
    // Find the booking to get owner details
    const booking = bookings.find((b: any) => b.id === bookingId);
    if (booking && booking.owner) {
      // Navigate to messaging app
      console.log('Navigating to messages for booking:', bookingId);
      setLocation('/messages');
    } else {
      alert('Messaging feature coming soon! This will allow you to communicate with the car owner.');
    }
  };

  const formatCurrency = (amount: string | number | null | undefined) => {
    if (amount == null || amount === '') return '£0.00';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount) || !isFinite(numAmount)) return '£0.00';
    return `£${numAmount.toFixed(2)}`;
  };

  // Calculate booking total if missing
  const calculateBookingTotal = (booking: any) => {
    if (booking.totalAmount && !isNaN(parseFloat(booking.totalAmount))) {
      return booking.totalAmount;
    }
    
    // Calculate from booking data
    if (booking.startDate && booking.endDate && booking.car?.pricePerDay) {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const pricePerDay = parseFloat(booking.car.pricePerDay) || 0;
      const subtotal = days * pricePerDay;
      const serviceFee = subtotal * 0.1; // 10%
      const insurance = subtotal * 0.05; // 5%
      return subtotal + serviceFee + insurance;
    }
    
    return 0;
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (bookingsLoading || reviewsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-mauve-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

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
              variant="outline" 
              className="hover-elevate active-elevate-2"
              onClick={() => setLocation('/settings')}
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
                      <PoundSterling className="h-5 w-5 text-purple-600" />
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
                  <PoundSterling className="h-6 w-6 text-white" />
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
                {bookings.length === 0 ? (
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
                  bookings.map((booking: any) => {
                    const statusConfig = bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig];
                    const StatusIcon = statusConfig.icon;
                    
                    // Calculate days until pickup
                    const daysUntil = Math.ceil((new Date(booking.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <Card key={booking.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-0">
                          <div className="flex gap-6 p-6">
                            <img 
                              src={booking.car?.images?.[0] || '/assets/hero-car-1.jpg'} 
                              alt={booking.car?.title || 'Car'}
                              className="w-32 h-24 rounded-lg object-cover"
                            />
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-xl">{booking.car?.title || `${booking.car?.make} ${booking.car?.model}`}</h3>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span>{booking.car?.city || booking.car?.location}</span>
                                  </div>
                                </div>
                                <Badge className={`${statusConfig.color} border-0`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig.label}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={booking.car?.owner?.profileImage || `https://ui-avatars.com/api/?name=${booking.car?.owner?.firstName}&background=random`} alt={booking.car?.owner?.firstName} />
                                  <AvatarFallback className="text-xs">{booking.car?.owner?.firstName?.charAt(0) || 'O'}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-muted-foreground">
                                  Owner: <span className="font-medium">{booking.car?.owner?.firstName} {booking.car?.owner?.lastName}</span>
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-sm">
                                  <p className="text-muted-foreground">
                                    {formatDate(booking.startDate)} to {formatDate(booking.endDate)}
                                    {daysUntil > 0 && (
                                      <span className="ml-2 text-blue-600 font-medium">({daysUntil} days until pickup)</span>
                                    )}
                                  </p>
                                  <p className="font-bold text-2xl text-rose-600">
                                    {formatCurrency(calculateBookingTotal(booking))}
                                  </p>
                                </div>
                                
                                <div className="flex gap-2">
                                  {booking.status === 'pending' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleCancelBooking(booking.id)}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                  {booking.status === 'confirmed' && (
                                    <Button 
                                      size="sm"
                                      onClick={() => handleLeaveReview(booking.id)}
                                      className="bg-gradient-to-r from-rose-500 to-mauve-500 hover:from-rose-600 hover:to-mauve-600"
                                    >
                                      Leave Review
                                    </Button>
                                  )}
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleMessageOwner(booking.id)}
                                  >
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
                        <Button 
                          variant="outline" 
                          className="w-full justify-start hover-elevate"
                          onClick={() => setLocation('/cars')}
                        >
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
                        <Button 
                          variant="outline" 
                          className="w-full justify-start hover-elevate"
                          onClick={() => setSelectedTab('favorites')}
                        >
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
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Favorites Coming Soon</h3>
                <p className="text-muted-foreground mb-6">The favorites feature is being developed. You'll be able to save your favorite cars here!</p>
                <Button 
                  onClick={() => setLocation('/cars')}
                  className="bg-gradient-to-r from-rose-500 to-mauve-500 hover:from-rose-600 hover:to-mauve-600"
                >
                  Browse Cars
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {reviews.length === 0 ? (
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
            ) : (
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <Card key={review.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <img 
                          src={review.car?.images?.[0] || '/assets/hero-car-1.jpg'} 
                          alt={review.car?.title || 'Car'}
                          className="w-20 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{review.car?.title || `${review.car?.make} ${review.car?.model}`}</h3>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-gray-600 mb-2">{review.comment}</p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Reviewed on {formatDate(review.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
