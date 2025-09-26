import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Loader2, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MapPin, 
  Car, 
  Shield, 
  Lock, 
  ArrowLeft,
  Clock,
  User,
  Phone,
  Mail,
  AlertTriangle,
  Info,
  Gift,
  Star,
  Zap,
  Settings,
  Users
} from 'lucide-react';
import { bookingApi, paymentApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface BookingData {
  id: string;
  carId: string;
  renterId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  serviceFee: number;
  insurance: number;
  status: string;
  paymentStatus: string;
  message: string;
  car: {
    id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    pricePerDay: number;
    currency: string;
    location: string;
    city: string;
    images: string[];
  };
  renter: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

const Payment: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mock'>('mock');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract booking ID from URL
  const bookingId = location.pathname.split('/payment/')[1];

  console.log('Payment component loaded, bookingId:', bookingId);

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching booking:', bookingId);
        const bookingData = await bookingApi.getBooking(bookingId);
        console.log('Booking data received:', bookingData);
        setBooking(bookingData);
        setError(null);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err instanceof Error ? err.message : 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    if (!booking) return;

    // Validate form fields for credit card payment
    if (paymentMethod === 'card') {
      const { number, expiry, cvv, name } = cardDetails;
      
      if (!number.trim()) {
        alert('Please enter your card number');
        return;
      }
      
      if (!expiry.trim()) {
        alert('Please enter the expiry date');
        return;
      }
      
      if (!cvv.trim()) {
        alert('Please enter the CVV');
        return;
      }
      
      if (!name.trim()) {
        alert('Please enter the cardholder name');
        return;
      }
      
      // Basic card number validation (should be 16 digits)
      const cardNumberDigits = number.replace(/\s/g, '');
      if (cardNumberDigits.length !== 16 || !/^\d+$/.test(cardNumberDigits)) {
        alert('Please enter a valid 16-digit card number');
        return;
      }
      
      // Basic expiry date validation (MM/YY format)
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Please enter expiry date in MM/YY format (e.g., 12/25)');
        return;
      }
      
      // Basic CVV validation (3-4 digits)
      if (!/^\d{3,4}$/.test(cvv)) {
        alert('Please enter a valid CVV (3-4 digits)');
        return;
      }
    }

    try {
      // Create payment intent
      const paymentIntent = await paymentApi.createPaymentIntent(
        booking.totalAmount,
        booking.car.currency,
        booking.id,
        user?.email || '',
        `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        booking.car.title,
        paymentMethod === 'mock'
      );

      if (paymentMethod === 'mock') {
        // For mock payments, directly confirm using paymentIntentId
        await paymentApi.confirmPayment(paymentIntent.paymentIntentId);
        // Redirect to booking confirmation page
        setLocation(`/booking-confirmation/${bookingId}`);
      } else {
        // For real card payments, you would integrate with Stripe Elements here
        // For now, we'll use mock payment
        await paymentApi.confirmPayment(paymentIntent.paymentIntentId);
        setLocation(`/booking-confirmation/${bookingId}`);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payment details...</p>
          <p className="text-sm text-gray-500 mt-2">Booking ID: {bookingId}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Booking</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500 mb-4">Booking ID: {bookingId}</p>
              <Button onClick={() => setLocation('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show not found state
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
              <p className="text-gray-600 mb-4">
                The booking you're looking for doesn't exist or has been cancelled.
              </p>
              <p className="text-sm text-gray-500 mb-4">Booking ID: {bookingId}</p>
              <Button onClick={() => setLocation('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main payment page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation('/cars')}
              className="mr-4 hover:bg-blue-50 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cars
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Your Payment</h1>
          <p className="text-xl text-gray-600 mb-2">Secure payment for your car rental booking</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1 text-green-600" />
              SSL Secured
            </div>
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-1 text-blue-600" />
              Encrypted Payment
            </div>
            <div className="flex items-center">
              <Gift className="h-4 w-4 mr-1 text-purple-600" />
              Free Cancellation
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Booking ID: {bookingId}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Booking Summary */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center gap-2 text-white">
                <Car className="h-6 w-6" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Car Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {booking.car.images && booking.car.images.length > 0 && (
                    <img
                      src={booking.car.images[0]}
                      alt={booking.car.title}
                      className="w-24 h-24 object-cover rounded-xl shadow-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900">{booking.car.title}</h3>
                    <p className="text-gray-600 text-lg">
                      {booking.car.make} {booking.car.model} ({booking.car.year})
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-600">{booking.car.location}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge className="bg-green-100 text-green-700">
                        <Star className="h-3 w-3 mr-1" />
                        4.8 Rating
                      </Badge>
                      <Badge variant="outline">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Rental Period */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Rental Period
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium mb-1">Pick-up</div>
                    <div className="font-semibold">{formatDate(booking.startDate)}</div>
                    <div className="text-sm text-gray-600">{formatTime(booking.startTime)}</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium mb-1">Drop-off</div>
                    <div className="font-semibold">{formatDate(booking.endDate)}</div>
                    <div className="text-sm text-gray-600">{formatTime(booking.endTime)}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Enhanced Pricing Breakdown */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                  Pricing Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Daily Rate</span>
                    <span className="font-medium">{booking.car.pricePerDay} {booking.car.currency}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">{booking.serviceFee} {booking.car.currency}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Insurance</span>
                    <span className="font-medium">{booking.insurance} {booking.car.currency}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-4">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-xl font-bold text-blue-600">{booking.totalAmount} {booking.car.currency}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Booking Status:</span>
                <Badge className={`${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {booking.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Payment Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('card')}
                    className="h-12"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit Card
                  </Button>
                  <Button
                    variant={paymentMethod === 'mock' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('mock')}
                    className="h-12"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Test Payment
                  </Button>
                </div>
              </div>

              {/* Card Details Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium mb-2">💳 Credit Card Information</p>
                    <p className="text-xs text-blue-600">Please fill in all the required fields below</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber" className="text-sm font-medium">
                      Card Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className={!cardDetails.number.trim() ? 'border-red-300 focus:border-red-500' : ''}
                    />
                    {!cardDetails.number.trim() && (
                      <p className="text-xs text-red-500 mt-1">Card number is required</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry" className="text-sm font-medium">
                        Expiry Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className={!cardDetails.expiry.trim() ? 'border-red-300 focus:border-red-500' : ''}
                      />
                      {!cardDetails.expiry.trim() && (
                        <p className="text-xs text-red-500 mt-1">Expiry date is required</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-sm font-medium">
                        CVV <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className={!cardDetails.cvv.trim() ? 'border-red-300 focus:border-red-500' : ''}
                      />
                      {!cardDetails.cvv.trim() && (
                        <p className="text-xs text-red-500 mt-1">CVV is required</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="cardName" className="text-sm font-medium">
                      Cardholder Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className={!cardDetails.name.trim() ? 'border-red-300 focus:border-red-500' : ''}
                    />
                    {!cardDetails.name.trim() && (
                      <p className="text-xs text-red-500 mt-1">Cardholder name is required</p>
                    )}
                  </div>
                </div>
              )}

              {/* Mock Payment Info */}
              {paymentMethod === 'mock' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    This is a test payment mode. No real money will be charged.
                    The payment will be automatically processed for testing purposes.
                  </AlertDescription>
                </Alert>
              )}

              {/* Security Notice */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Secure Payment</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your payment information is encrypted and secure. We use industry-standard
                      security measures to protect your data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                className="w-full h-12 text-lg"
                size="lg"
                disabled={paymentMethod === 'card' && (
                  !cardDetails.number.trim() || 
                  !cardDetails.expiry.trim() || 
                  !cardDetails.cvv.trim() || 
                  !cardDetails.name.trim()
                )}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {paymentMethod === 'card' && (
                  !cardDetails.number.trim() || 
                  !cardDetails.expiry.trim() || 
                  !cardDetails.cvv.trim() || 
                  !cardDetails.name.trim()
                ) ? (
                  'Please fill in all payment details'
                ) : (
                  `Pay ${booking.totalAmount} ${booking.car.currency}`
                )}
              </Button>

              {/* Back Button */}
              <Button
                variant="outline"
                onClick={() => setLocation(`/car-details/${booking.car.id}`)}
                className="w-full"
              >
                Back to Car Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;