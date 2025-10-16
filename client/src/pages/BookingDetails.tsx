import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, User, Car, CreditCard, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { carApi, bookingApi } from '../lib/api';

export default function BookingDetails() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [, setLocation] = useLocation();

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingApi.getBooking(bookingId!),
    enabled: !!bookingId,
  });

  const { data: car } = useQuery({
    queryKey: ['car', booking?.carId],
    queryFn: () => carApi.getCar(booking!.carId),
    enabled: !!booking?.carId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mauve-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mauve-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/dashboard/owner')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
              <p className="text-gray-600">The booking you're looking for doesn't exist or has been removed.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renterName = booking.renter ? 
    `${booking.renter.firstName || ''} ${booking.renter.lastName || ''}`.trim() || 
    'Unknown Renter' : 'Unknown Renter';
  const carTitle = booking.car ? booking.car.title : 'Unknown Car';
  const renterImage = booking.renter?.profileImage;
  const safeRenterName = renterName || 'Unknown Renter';

  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const daysUntil = Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const bookingStatusConfig = {
    upcoming: { label: 'Upcoming', variant: 'default' as const, color: 'text-blue-600 bg-blue-50' },
    active: { label: 'Active', variant: 'secondary' as const, color: 'text-green-600 bg-green-50' },
    completed: { label: 'Completed', variant: 'outline' as const, color: 'text-gray-600 bg-gray-50' },
    confirmed: { label: 'Confirmed', variant: 'default' as const, color: 'text-green-600 bg-green-50' },
    pending: { label: 'Pending', variant: 'secondary' as const, color: 'text-yellow-600 bg-yellow-50' },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const, color: 'text-red-600 bg-red-50' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mauve-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => setLocation('/dashboard/owner')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Booking Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Booking Details</span>
                  <Badge 
                    className={`${bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig]?.color || 'text-gray-600 bg-gray-50'}`}
                  >
                    {bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig]?.label || booking.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Renter Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={renterImage} alt={safeRenterName} />
                    <AvatarFallback className="text-xl">{safeRenterName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{safeRenterName}</h3>
                    <p className="text-muted-foreground">{carTitle}</p>
                    {daysUntil > 0 && (
                      <p className="text-blue-600 font-medium">{daysUntil} days until pickup</p>
                    )}
                  </div>
                </div>

                {/* Booking Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">{startDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">End Date</p>
                      <p className="text-sm text-muted-foreground">{endDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Car Images */}
                {car?.images && car.images.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Car Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {car.images.slice(0, 6).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${carTitle} ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Info */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-bold text-lg">£{parseFloat(booking.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="font-mono text-sm">{booking.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            {booking.rating && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < booking.rating! ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{booking.rating}/5</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
