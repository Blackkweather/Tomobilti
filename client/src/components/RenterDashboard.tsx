import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Calendar, 
  Heart, 
  Star, 
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Car,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// todo: remove mock functionality
const mockBookings = [
  {
    id: 'b1',
    carTitle: 'BMW 3 Series - Premium Sedan',
    carImage: '/api/placeholder/100/75',
    ownerName: 'James Smith',
    ownerImage: '/api/placeholder/40/40',
    location: 'London, Westminster',
    startDate: '2024-12-20',
    endDate: '2024-12-23',
    totalAmount: 1350,
    status: 'upcoming',
    canReview: false
  },
  {
    id: 'b2',
    carTitle: 'Ford Focus - City Car',
    carImage: '/api/placeholder/100/75',
    ownerName: 'Sarah Johnson',
    ownerImage: '/api/placeholder/40/40',
    location: 'Manchester, Centre',
    startDate: '2024-12-10',
    endDate: '2024-12-13',
    totalAmount: 840,
    status: 'completed',
    canReview: true
  }
];

const mockFavorites = [
  {
    id: 'f1',
    title: 'Tesla Model 3 - Electric',
    image: '/api/placeholder/100/75',
    location: 'Edinburgh, New Town',
    pricePerDay: 65,
    rating: 4.9,
    ownerName: 'Michael Brown'
  },
  {
    id: 'f2',
    title: 'Mercedes A-Class',
    image: '/api/placeholder/100/75', 
    location: 'Glasgow, City Centre',
    pricePerDay: 50,
    rating: 4.7,
    ownerName: 'Emma Wilson'
  }
];

const bookingStatusConfig = {
  upcoming: { label: 'Upcoming', variant: 'default' as const, icon: Clock },
  active: { label: 'Active', variant: 'secondary' as const, icon: CheckCircle },
  completed: { label: 'Completed', variant: 'outline' as const, icon: CheckCircle },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle }
};

interface BookingCardProps {
  booking: typeof mockBookings[0];
  onCancel: (id: string) => void;
  onReview: (id: string) => void;
}

const isValidId = (id: string): boolean => {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]+$/.test(id) && id.length <= 50;
};

function BookingCard({ booking, onCancel, onReview }: BookingCardProps) {
  const statusConfig = bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig] || bookingStatusConfig.upcoming;
  const StatusIcon = statusConfig.icon;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <img 
            src={booking.carImage} 
            alt={booking.carTitle}
            className="w-24 h-18 rounded-lg object-cover"
          />
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{booking.carTitle}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{booking.location}</span>
                </div>
              </div>
              <Badge variant={statusConfig.variant}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={booking.ownerImage} alt={booking.ownerName} />
                <AvatarFallback className="text-xs">{booking.ownerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                Owner: <span>{booking.ownerName}</span>
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="text-muted-foreground">
                  From {booking.startDate} to {booking.endDate}
                </p>
                <p className="font-semibold text-primary text-lg">
                  £{booking.totalAmount}
                </p>
              </div>
              
              <div className="flex gap-2">
                {booking.status === 'upcoming' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onCancel(booking.id)}
                    data-testid={`button-cancel-${booking.id}`}
                  >
                    Cancel
                  </Button>
                )}
                {booking.canReview && (
                  <Button 
                    size="sm"
                    onClick={() => onReview(booking.id)}
                    data-testid={`button-review-${booking.id}`}
                  >
                    Leave Review
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RenterDashboard() {
  const [selectedTab, setSelectedTab] = useState('bookings');
  const { user } = useAuth();

  const sanitizeForLog = (input: string): string => {
    return input.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '').slice(0, 100);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (!isValidId(bookingId)) return;
    console.log('Cancel booking:', sanitizeForLog(bookingId));
  };

  const handleLeaveReview = (bookingId: string) => {
    if (!isValidId(bookingId)) return;
    console.log('Leave review for booking:', sanitizeForLog(bookingId));
  };

  const handleRemoveFromFavorites = (favoriteId: string) => {
    if (!isValidId(favoriteId)) return;
    console.log('Remove from favorites:', sanitizeForLog(favoriteId));
  };

  const handleBookFavorite = (favoriteId: string) => {
    if (!isValidId(favoriteId)) return;
    console.log('Book favorite car:', sanitizeForLog(favoriteId));
  };

  const totalBookings = mockBookings.length;
  const completedBookings = mockBookings.filter(b => b.status === 'completed').length;
  const totalSpent = mockBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Renter Space</h1>
          <p className="text-muted-foreground">Manage your bookings and favorites</p>
          {user && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Member since {new Date(user.createdAt).toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold" data-testid="text-total-bookings">
                  {totalBookings}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Completed Trips</p>
                <p className="text-2xl font-bold" data-testid="text-completed-bookings">
                  {completedBookings}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold" data-testid="text-total-spent">
                  £{totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="bookings" data-testid="tab-bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="favorites" data-testid="tab-favorites">Favorites</TabsTrigger>
          <TabsTrigger value="reviews" data-testid="tab-reviews">My Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          {mockBookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Bookings</h3>
                <p className="text-muted-foreground">You don't have any bookings yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelBooking}
                  onReview={handleLeaveReview}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          {mockFavorites.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Favorites</h3>
                <p className="text-muted-foreground">Add vehicles to your favorites to find them easily.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockFavorites.map((favorite) => (
                <Card key={favorite.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img 
                        src={favorite.image} 
                        alt={favorite.title}
                        className="w-20 h-16 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{favorite.title}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {favorite.location}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromFavorites(favorite.id)}
                            data-testid={`button-remove-favorite-${favorite.id}`}
                            className="hover-elevate active-elevate-2"
                          >
                            <Heart className="h-4 w-4 fill-destructive text-destructive" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{favorite.rating}</span>
                          <span className="text-sm text-muted-foreground">• {favorite.ownerName}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-primary">£{favorite.pricePerDay}</span>
                            <span className="text-sm text-muted-foreground">/day</span>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => handleBookFavorite(favorite.id)}
                            data-testid={`button-book-favorite-${favorite.id}`}
                            className="hover-elevate active-elevate-2"
                          >
                            Book
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Reviews</h3>
              <p className="text-muted-foreground">Your vehicle ratings will appear here after your trips.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}