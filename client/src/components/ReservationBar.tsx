import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  CreditCard,
  Shield,
  CheckCircle,
  AlertTriangle,
  Star,
  Car,
  LogIn
} from 'lucide-react';
import Calendar from './Calendar';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';

interface ReservationBarProps {
  car: {
    id: string;
    title: string;
    pricePerDay: number;
    currency: string;
    location: string;
    owner: {
      name: string;
      rating: number;
      verified: boolean;
    };
    images: string[];
    features: string[];
  };
  onBook: (bookingData: any) => void;
  className?: string;
}

export default function ReservationBar({ car, onBook, className = '' }: ReservationBarProps) {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  // Mock unavailable dates (in a real app, this would come from the API)
  const unavailableDates = [
    new Date(2024, 0, 15),
    new Date(2024, 0, 16),
    new Date(2024, 0, 20),
    new Date(2024, 0, 21),
    new Date(2024, 0, 25),
  ];

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // Can't book today

  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setSelectedDates({ start, end });
    if (start && end) {
      setShowCalendar(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedDates.start || !selectedDates.end) {
      return {
        days: 0,
        basePrice: 0,
        serviceFee: 0,
        insuranceFee: 0,
        taxes: 0,
        total: 0
      };
    }
    
    const diffTime = Math.abs(selectedDates.end.getTime() - selectedDates.start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const basePrice = diffDays * car.pricePerDay;
    const serviceFee = basePrice * 0.1; // 10% service fee
    const insuranceFee = basePrice * 0.05; // 5% insurance fee
    const taxes = (basePrice + serviceFee + insuranceFee) * 0.2; // 20% VAT
    
    return {
      days: diffDays,
      basePrice,
      serviceFee,
      insuranceFee,
      taxes,
      total: basePrice + serviceFee + insuranceFee + taxes
    };
  };

  const handleBook = async () => {
    if (!selectedDates.start || !selectedDates.end) return;
    
    setIsBooking(true);
    
    // Simulate booking process
    setTimeout(() => {
      const pricing = calculateTotal();
      onBook({
        carId: car.id,
        startDate: selectedDates.start,
        endDate: selectedDates.end,
        guests,
        pricing,
        totalAmount: pricing.total
      });
      setIsBooking(false);
    }, 2000);
  };

  const pricing = calculateTotal();
  const currencySymbol = car.currency === 'GBP' ? '£' : car.currency === 'EUR' ? '€' : car.currency === 'USD' ? '$' : car.currency;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Reservation Card */}
      <Card className="shadow-lg border-2 border-blue-100">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            Book This Vehicle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Price Display */}
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {currencySymbol}{car.pricePerDay}
            </div>
            <div className="text-sm text-blue-700">per day</div>
          </div>

          {/* Date Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Select Dates
            </label>
            <Button
              variant="outline"
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full justify-start h-12 text-left"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {selectedDates.start && selectedDates.end ? (
                <span>
                  {selectedDates.start.toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'short' 
                  })} - {selectedDates.end.toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </span>
              ) : (
                <span className="text-gray-500">Choose your dates</span>
              )}
            </Button>
          </div>

          {/* Calendar Popup */}
          {showCalendar && (
            <div className="relative">
              <div className="absolute z-50 mt-2 left-0 right-0">
                <Calendar
                  selectedDates={selectedDates}
                  onDateSelect={handleDateSelect}
                  unavailableDates={unavailableDates}
                  minDate={minDate}
                  className="shadow-2xl"
                />
              </div>
            </div>
          )}

          {/* Guests Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Number of Guests
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
              >
                -
              </Button>
              <div className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-md bg-gray-50">
                <Users className="h-4 w-4 inline mr-2" />
                {guests} guest{guests !== 1 ? 's' : ''}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuests(Math.min(8, guests + 1))}
                disabled={guests >= 8}
              >
                +
              </Button>
            </div>
          </div>

          {/* Pricing Breakdown */}
          {pricing.days > 0 && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Price Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{currencySymbol}{car.pricePerDay} × {pricing.days} days</span>
                  <span>{currencySymbol}{pricing.basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>{currencySymbol}{pricing.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance</span>
                  <span>{currencySymbol}{pricing.insuranceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>{currencySymbol}{pricing.taxes.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{currencySymbol}{pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Security Features */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Security Included
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Insurance</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Verified Owner</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {car.owner.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{car.owner.name}</span>
                {car.owner.verified && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">{car.owner.rating}</span>
              </div>
            </div>
          </div>

          {/* Book Button */}
          {isAuthenticated && user ? (
            <Button
              onClick={handleBook}
              disabled={!selectedDates.start || !selectedDates.end || isBooking}
              className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
            >
              {isBooking ? (
                <>
                  <Clock className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Book Now
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Shield className="h-8 w-8 mx-auto text-amber-600 mb-2" />
                <h3 className="font-semibold text-amber-800 mb-1">Login Required</h3>
                <p className="text-sm text-amber-700">
                  Please sign in to book this vehicle
                </p>
              </div>
              <Button
                onClick={() => setLocation('/login')}
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login to Book
              </Button>
            </div>
          )}

          {/* Additional Info */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>Free cancellation up to 24 hours before pickup</p>
            <p>Instant confirmation • Secure payment</p>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Car className="h-4 w-4" />
            Vehicle Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {car.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium text-sm">{car.location}</p>
              <p className="text-xs text-gray-500">Pickup location</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
