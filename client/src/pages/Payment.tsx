import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, CreditCard, CheckCircle, XCircle, Calendar, MapPin, Car } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Secure payment for your car rental booking</p>
          <p className="text-sm text-gray-500 mt-2">Booking ID: {bookingId}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Car Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {booking.car.images && booking.car.images.length > 0 && (
                    <img
                      src={booking.car.images[0]}
                      alt={booking.car.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{booking.car.title}</h3>
                    <p className="text-gray-600">
                      {booking.car.make} {booking.car.model} ({booking.car.year})
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{booking.car.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Rental Period */}
              <div className="space-y-3">
                <h4 className="font-semibold">Rental Period</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {formatDate(booking.startDate)} at {formatTime(booking.startTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {formatDate(booking.endDate)} at {formatTime(booking.endTime)}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold">Pricing Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily Rate</span>
                    <span>{booking.car.pricePerDay} {booking.car.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>{booking.serviceFee} {booking.car.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Insurance</span>
                    <span>{booking.insurance} {booking.car.currency}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>{booking.totalAmount} {booking.car.currency}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
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
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    />
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
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pay {booking.totalAmount} {booking.car.currency}
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