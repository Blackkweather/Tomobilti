import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, MapPin, Fuel, Users, Star, Shield, Clock, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

import type { Car } from '@shared/schema';

interface BookingModalProps {
  car: Car & {
    owner?: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
    rating?: number;
    reviewCount?: number;
  };
  onClose: () => void;
}

export default function BookingModal({ car, onClose }: BookingModalProps) {
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    startTime: '10:00',
    endTime: '18:00',
    message: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!car) return null;

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePaymentDataChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateDates = () => {
    if (!bookingData.startDate || !bookingData.endDate) return { isValid: false, error: '' };
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
      return { isValid: false, error: 'Start date cannot be in the past' };
    }
    if (end <= start) {
      return { isValid: false, error: 'End date must be after start date' };
    }
    return { isValid: true, error: '' };
  };

  const { days, subtotal, serviceFee, insurance, total, dateError } = useMemo(() => {
    const validation = validateDates();
    if (!validation.isValid) {
      return { days: 0, subtotal: 0, serviceFee: 0, insurance: 0, total: 0, dateError: validation.error };
    }
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const calculatedSubtotal = calculatedDays * parseFloat(car.pricePerDay);
    const calculatedServiceFee = Math.round(calculatedSubtotal * 0.05);
    const calculatedInsurance = Math.round(calculatedSubtotal * 0.03);
    const calculatedTotal = calculatedSubtotal + calculatedServiceFee + calculatedInsurance;
    
    return {
      days: calculatedDays,
      subtotal: calculatedSubtotal,
      serviceFee: calculatedServiceFee,
      insurance: calculatedInsurance,
      total: calculatedTotal,
      dateError: ''
    };
  }, [bookingData.startDate, bookingData.endDate, car.pricePerDay]);

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    
    try {
      // Validate form
      const newErrors: Record<string, string> = {};
      
      // Validate dates
      if (!bookingData.startDate) {
        newErrors.startDate = 'Start date is required';
      }
      if (!bookingData.endDate) {
        newErrors.endDate = 'End date is required';
      }
      if (bookingData.startDate && bookingData.endDate) {
        const start = new Date(bookingData.startDate);
        const end = new Date(bookingData.endDate);
        if (start >= end) {
          newErrors.endDate = 'End date must be after start date';
        }
      }
      
      // Validate payment data
      if (paymentMethod === 'card') {
        if (!paymentData.cardNumber) {
          newErrors.cardNumber = 'Card number is required';
        } else if (paymentData.cardNumber.replace(/\s/g, '').length < 13) {
          newErrors.cardNumber = 'Card number must be at least 13 digits';
        }
        if (!paymentData.expiryDate) {
          newErrors.expiryDate = 'Expiry date is required';
        }
        if (!paymentData.cvv) {
          newErrors.cvv = 'CVV is required';
        }
        if (!paymentData.cardholderName) {
          newErrors.cardholderName = 'Cardholder name is required';
        }
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }
      
      // Create booking data for API
      const bookingPayload = {
        carId: car.id,
        renterId: user?.id,
        startDate: new Date(`${bookingData.startDate}T${bookingData.startTime}:00`).toISOString(),
        endDate: new Date(`${bookingData.endDate}T${bookingData.endTime}:00`).toISOString(),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        totalAmount: total.toString(),
        serviceFee: (total * 0.05).toString(),
        insurance: (total * 0.03).toString(),
        message: bookingData.message || null,
        status: 'pending',
        paymentStatus: 'pending'
      };
      
      console.log('Creating booking:', bookingPayload);
      
      // Call the booking API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingPayload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }
      
      const booking = await response.json();
      console.log('Booking created:', booking);
      
      // Simulate payment processing for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      alert(`Booking confirmed! Total: ${total} ${car.currency}\n\nBooking ID: ${booking.id}\n\nYou will receive a confirmation email shortly.`);
      
      setIsLoading(false);
      onClose();
      
    } catch (error) {
      console.error('Booking error:', error);
      alert(`Booking failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] md:w-full mx-4 md:mx-0" aria-describedby="booking-description">
        <DialogHeader>
          <DialogTitle>Book This Vehicle</DialogTitle>
          <p id="booking-description" className="sr-only">Booking form for the selected vehicle with automatic price calculation and rental dates. Complete your booking by selecting dates, times, and payment method.</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Car Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img 
                  src={car.images && car.images.length > 0 ? car.images[0] : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&auto=format'} 
                  alt={car.title}
                  className="w-20 h-16 rounded-lg object-cover"
                />
                
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">{car.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {car.city}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{car.rating}</span>
                      <span className="text-muted-foreground">({car.reviewCount} reviews)</span>
                    </div>
                    <Badge variant="outline">{car.fuelType}</Badge>
                    <span className="text-muted-foreground">{car.seats} seats</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={car.owner?.profileImage} />
                      <AvatarFallback className="text-xs">
                        {car.owner ? `${car.owner.firstName[0]}${car.owner.lastName[0]}` : 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {car.owner ? `${car.owner.firstName} ${car.owner.lastName}` : 'Owner'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Dates and Times
              </h3>
              
              {dateError && (
                <div className="text-red-600 text-sm">{dateError}</div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={bookingData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    data-testid="input-booking-start-date"
                    min={new Date().toISOString().split('T')[0]}
                    className={errors.startDate ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={bookingData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    data-testid="input-booking-start-time"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={bookingData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    data-testid="input-booking-end-date"
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                    className={errors.endDate ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={bookingData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    data-testid="input-booking-end-time"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Message to Owner (optional)</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Introduce yourself and explain the intended use of the vehicle..."
                  value={bookingData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  data-testid="input-booking-message"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Method
              </h3>
              
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                aria-label="Select payment method"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    PayPal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="apple" id="apple" />
                  <Label htmlFor="apple" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Apple Pay
                  </Label>
                </div>
              </RadioGroup>

              {/* Payment Form */}
              {paymentMethod === 'card' && (
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => handlePaymentDataChange('cardNumber', e.target.value)}
                        maxLength={19}
                        className={errors.cardNumber ? 'border-red-500 focus:border-red-500' : ''}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => handlePaymentDataChange('expiryDate', e.target.value)}
                          maxLength={5}
                          className={errors.expiryDate ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => handlePaymentDataChange('cvv', e.target.value)}
                          maxLength={4}
                          className={errors.cvv ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Cardholder Name</Label>
                      <Input
                        placeholder="John Smith"
                        value={paymentData.cardholderName}
                        onChange={(e) => handlePaymentDataChange('cardholderName', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {paymentMethod === 'paypal' && (
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <Building2 className="h-8 w-8 mx-auto text-blue-600" />
                      <p className="text-sm text-muted-foreground">
                        You will be redirected to PayPal to complete your payment securely.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {paymentMethod === 'apple' && (
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <Smartphone className="h-8 w-8 mx-auto text-gray-900" />
                      <p className="text-sm text-muted-foreground">
                        Complete your payment securely with Apple Pay.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4">
              <h3 className="font-semibold">Booking Summary</h3>
              
              {days > 0 && (
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span>{car.pricePerDay} {car.currency} x {days} day{days > 1 ? 's' : ''}</span>
                      <span data-testid="text-subtotal">{subtotal} {car.currency}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Service Fee</span>
                      <span data-testid="text-service-fee">{serviceFee} {car.currency}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Insurance</span>
                      <span data-testid="text-insurance">{insurance} {car.currency}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary" data-testid="text-total">
                        {total} {car.currency}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Protection info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Protection included</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} data-testid="button-cancel-booking">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmBooking} 
              disabled={!bookingData.startDate || !bookingData.endDate || isLoading}
              data-testid="button-confirm-booking"
              className="hover-elevate active-elevate-2"
            >
              {isLoading ? 'Processing...' : `Confirm Booking - ${total} ${car.currency}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}