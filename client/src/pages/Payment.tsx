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
import CardDetector, { CardInfo, CARD_TYPES } from '../utils/cardDetector';
import PaymentForm from '../components/PaymentForm';

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
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [detectedCard, setDetectedCard] = useState<CardInfo | null>(null);

  // Extract booking ID from URL
  const bookingId = location.pathname.split('/payment/')[1];

  console.log('Payment component loaded, bookingId:', bookingId);

  // Detect card type when card number changes
  useEffect(() => {
    try {
      if (cardNumber.length >= 4) {
        const detected = CardDetector.detectCardType(cardNumber);
        setDetectedCard(detected);
      } else {
        setDetectedCard(null);
      }
    } catch (error) {
      console.error('Card detection error:', error);
      setDetectedCard(null);
    }
  }, [cardNumber]);

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
              <div className="space-y-2">
                <Button onClick={() => setLocation('/cars')} className="w-full">
                  Browse Cars
                </Button>
                <Button onClick={() => setLocation('/dashboard')} variant="outline" className="w-full">
                  Go to Dashboard
                </Button>
              </div>
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
                    <span className="font-medium">GBP {Number(booking.serviceFee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Insurance Discount</span>
                    <span className="font-medium">GBP {Number(booking.insurance || 0).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-4">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-xl font-bold text-blue-600">GBP {Number(booking.totalAmount || 0).toFixed(2)}</span>
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

          {/* Payment Methods */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
              
              {/* Payment Icons Row */}
              <div className="flex items-center justify-center gap-4 mb-6">
                {/* Credit Card */}
                <button
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMethod === 'card' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedMethod('card')}
                >
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </button>

                {/* PayPal */}
                <button
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMethod === 'paypal' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedMethod('paypal')}
                >
                  <img src="/assets/payment-logos/paypal.svg" alt="PayPal" className="h-8 w-8" />
                </button>

                {/* Apple Pay */}
                <button
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMethod === 'apple' 
                      ? 'border-gray-500 bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMethod('apple')}
                >
                  <img src="/assets/payment-logos/apple-pay.svg" alt="Apple Pay" className="h-8 w-8" />
                </button>

                {/* Google Pay */}
                <button
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMethod === 'google' 
                      ? 'border-gray-500 bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMethod('google')}
                >
                  <img src="/assets/payment-logos/google-pay.svg" alt="Google Pay" className="h-8 w-8" />
                </button>

                {/* Samsung Pay */}
                <button
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMethod === 'samsung' 
                      ? 'border-gray-500 bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMethod('samsung')}
                >
                  <img src="/assets/payment-logos/samsung-pay.svg" alt="Samsung Pay" className="h-8 w-8" />
                </button>
              </div>

              {/* Payment Form Based on Selection */}
              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Credit Card Details</h4>
                  
                  {/* Card Detection Display */}
                  {detectedCard && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <img src={detectedCard.icon} alt={detectedCard.name} className="h-6 w-6" />
                      <span className="text-sm font-medium text-gray-700">{detectedCard.name}</span>
                      {(() => {
                        try {
                          return CardDetector.validateLuhn(cardNumber) && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          );
                        } catch (error) {
                          console.error('Luhn validation error:', error);
                          return null;
                        }
                      })()}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => {
                          // Remove all non-digits
                          const digitsOnly = e.target.value.replace(/\D/g, '');
                          // Add spaces every 4 digits
                          const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
                          setCardNumber(formatted);
                        }}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          type="text"
                          placeholder="MM/YY"
                          value={`${expiryMonth}${expiryYear ? '/' + expiryYear : ''}`}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 2) {
                              setExpiryMonth(value);
                            } else if (value.length <= 4) {
                              setExpiryMonth(value.slice(0, 2));
                              setExpiryYear(value.slice(2));
                            }
                          }}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="text"
                          placeholder={detectedCard?.cvvLength === 4 ? "1234" : "123"}
                          value={cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            const maxLength = detectedCard?.cvvLength || 3;
                            if (value.length <= maxLength) {
                              setCvv(value);
                            }
                          }}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardholder">Cardholder Name</Label>
                      <Input
                        id="cardholder"
                        type="text"
                        placeholder="John Doe"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    onClick={() => {
                      console.log('Payment button clicked');
                      console.log('Booking ID:', booking.id);
                      console.log('Redirecting to:', `/booking-confirmation/${booking.id}`);
                      setLocation(`/booking-confirmation/${booking.id}`);
                    }}
                  >
                    <Lock className="h-5 w-5 mr-2" />
                    Pay GBP {Number(booking.totalAmount || 0).toFixed(2)}
                  </Button>
                </div>
              )}

              {selectedMethod === 'paypal' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <img src="/assets/payment-logos/paypal.svg" alt="PayPal" className="h-12 w-12 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-700 mb-2">Pay with PayPal</h4>
                    <p className="text-sm text-gray-500 mb-4">You will be redirected to PayPal to complete your payment</p>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    onClick={() => window.open('https://www.paypal.com/paypalme/sharewheelz', '_blank')}
                  >
                    <img src="/assets/payment-logos/paypal.svg" alt="PayPal" className="h-5 w-5 mr-2" />
                    Pay with PayPal
                  </Button>
                </div>
              )}

              {selectedMethod === 'apple' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <img src="/assets/payment-logos/apple-pay.svg" alt="Apple Pay" className="h-12 w-12 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-700 mb-2">Pay with Apple Pay</h4>
                    <p className="text-sm text-gray-500 mb-4">Use Touch ID or Face ID to complete your payment</p>
                  </div>
                  <Button 
                    className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg font-semibold"
                    onClick={() => {
                      console.log('Apple Pay button clicked');
                      console.log('Booking ID:', booking.id);
                      setLocation(`/booking-confirmation/${booking.id}`);
                    }}
                  >
                    <img src="/assets/payment-logos/apple-pay.svg" alt="Apple Pay" className="h-5 w-5 mr-2" />
                    Pay with Apple Pay
                  </Button>
                </div>
              )}

              {selectedMethod === 'google' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <img src="/assets/payment-logos/google-pay.svg" alt="Google Pay" className="h-12 w-12 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-700 mb-2">Pay with Google Pay</h4>
                    <p className="text-sm text-gray-500 mb-4">Use your Google account to complete your payment</p>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    onClick={() => {
                      console.log('Google Pay button clicked');
                      console.log('Booking ID:', booking.id);
                      setLocation(`/booking-confirmation/${booking.id}`);
                    }}
                  >
                    <img src="/assets/payment-logos/google-pay.svg" alt="Google Pay" className="h-5 w-5 mr-2" />
                    Pay with Google Pay
                  </Button>
                </div>
              )}

              {selectedMethod === 'samsung' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <img src="/assets/payment-logos/samsung-pay.svg" alt="Samsung Pay" className="h-12 w-12 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-700 mb-2">Pay with Samsung Pay</h4>
                    <p className="text-sm text-gray-500 mb-4">Use Samsung Pay to complete your payment</p>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    onClick={() => {
                      console.log('Samsung Pay button clicked');
                      console.log('Booking ID:', booking.id);
                      setLocation(`/booking-confirmation/${booking.id}`);
                    }}
                  >
                    <img src="/assets/payment-logos/samsung-pay.svg" alt="Samsung Pay" className="h-5 w-5 mr-2" />
                    Pay with Samsung Pay
                  </Button>
                </div>
              )}

              {/* Security Notice */}
              <div className="text-center text-sm text-gray-500 mt-4">
                <Lock className="h-4 w-4 inline mr-1" />
                Secure payment processing
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;