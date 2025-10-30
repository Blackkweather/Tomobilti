import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
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
  LogIn,
  Zap,
  Fuel,
  Settings,
  Heart,
  Share2,
  Info,
  Calculator,
  ArrowRight,
  Lock,
  Gift,
  Copy,
  Mail,
  MessageSquare
} from 'lucide-react';
// import Calendar from './Calendar'; // Temporarily disabled
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
    // Vehicle specifications
    fuelType?: string;
    transmission?: string;
    seats?: number;
    // Reviews
    rating?: number;
    reviewCount?: number;
  };
  onBook: (bookingData: any) => void;
  className?: string;
  // Configuration options
  config?: {
    serviceFeePercentage?: number;
    insurancePercentage?: number;
    taxPercentage?: number;
    maxGuests?: number;
    minGuests?: number;
    platformName?: string;
  };
}

export default function ReservationBar({ car, onBook, className = '', config = {} }: ReservationBarProps) {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  // const [showCalendar, setShowCalendar] = useState(false); // Removed
  const [guests, setGuests] = useState(config.minGuests || 1);
  const [isBooking, setIsBooking] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Default configuration values
  const defaultConfig = {
    serviceFeePercentage: 10,
    insurancePercentage: 5,
    taxPercentage: 8,
    maxGuests: 8,
    minGuests: 1,
    platformName: 'ShareWheelz'
  };

  const finalConfig = { ...defaultConfig, ...config };
  
  // Share functionality
  const currentUrl = window.location.href;
  const shareText = `Check out this amazing car on ${finalConfig.platformName}: ${car.title}`;
  
  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Check out this car: ${car.title}`);
    const body = encodeURIComponent(`${shareText}\n\n${currentUrl}`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setSelectedDates({ start, end });
    if (start) setSelectedDates(prev => ({ ...prev, start }));
    if (end) setSelectedDates(prev => ({ ...prev, end }));
  };

  // getDateRangeText function removed - no longer needed

  const calculateTotal = () => {
    if (!selectedDates.start || !selectedDates.end) {
      return {
        days: 0,
        basePrice: 0,
        serviceFee: 0,
        insurance: 0,
        taxes: 0,
        total: 0
      };
    }
    
    const days = Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = days * car.pricePerDay;
    const serviceFee = basePrice * (finalConfig.serviceFeePercentage / 100);
    const insurance = basePrice * (finalConfig.insurancePercentage / 100);
    const taxes = basePrice * (finalConfig.taxPercentage / 100);
    
    return {
      days,
      basePrice,
      serviceFee,
      insurance,
      taxes,
      total: basePrice + serviceFee + insurance + taxes
    };
  };

  const handleBook = async () => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }

    if (!selectedDates.start || !selectedDates.end) {
      alert('Please select both start and end dates');
      return;
    }

    setIsBooking(true);
    
    try {
      const pricing = calculateTotal();
      await onBook({
        startDate: selectedDates.start,
        endDate: selectedDates.end,
        guests,
        totalAmount: pricing.total,
        pricing
      });
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const pricing = calculateTotal();

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Main Reservation Card */}
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Book This Vehicle</CardTitle>
            <div className="flex items-center gap-1 sm:gap-2">
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`h-8 w-8 sm:h-10 sm:w-10 ${isFavorited ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                >
                  <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 hover:text-gray-600">
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleShareWhatsApp} className="cursor-pointer">
                    <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                    Share on WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareEmail} className="cursor-pointer">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Share via Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                    <Copy className="h-4 w-4 mr-2 text-gray-600" />
                    {shareCopied ? 'Link Copied!' : 'Copy Link'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {/* Price Display */}
          <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {car.currency} {car.pricePerDay}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">per day</div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {car.rating || car.owner.rating} ({car.reviewCount || 0} reviews)
              </span>
            </div>
          </div>

          {/* Date Selection - Compact Layout */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                <input
                  type="date"
                  value={selectedDates.start ? selectedDates.start.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    handleDateSelect(date, selectedDates.end);
                  }}
                  className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                <input
                  type="date"
                  value={selectedDates.end ? selectedDates.end.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    handleDateSelect(selectedDates.start, date);
                  }}
                  className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Guest Selection - Compact */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700 flex items-center">
              <Users className="h-3 w-3 mr-1" />
              Guests
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setGuests(Math.max(finalConfig.minGuests, guests - 1))}
                className="rounded-r-none h-8 w-8"
              >
                -
              </Button>
              <div className="flex-1 text-center py-2 font-medium text-xs">{guests}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setGuests(Math.min(finalConfig.maxGuests, guests + 1))}
                className="rounded-l-none h-8 w-8"
              >
                +
              </Button>
            </div>
          </div>

          {/* Pricing Breakdown - Compact */}
          {pricing.days > 0 && (
            <div className="space-y-1 p-2 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{car.currency} {car.pricePerDay} × {pricing.days} days</span>
                <span className="font-medium">{car.currency} {pricing.basePrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Service fee</span>
                <span className="font-medium">{car.currency} {pricing.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Insurance</span>
                <span className="font-medium">{car.currency} {pricing.insurance.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium">{car.currency} {pricing.taxes.toFixed(2)}</span>
              </div>
              <div className="border-t pt-1 flex items-center justify-between font-semibold text-sm">
                <span>Total</span>
                <span className="text-green-600">{car.currency} {pricing.total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Book Button - Compact */}
          <Button
            onClick={handleBook}
            disabled={!selectedDates.start || !selectedDates.end || isBooking}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isBooking ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : !isAuthenticated ? (
              <div className="flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                Login to Book
              </div>
            ) : (
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Book Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            )}
          </Button>

          {/* Security Badges - Compact */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-600">
            <div className="flex items-center">
              <Shield className="h-3 w-3 mr-1 text-green-600" />
              <span>Secure</span>
            </div>
            <div className="flex items-center">
              <Lock className="h-3 w-3 mr-1 text-blue-600" />
              <span>SSL</span>
            </div>
            <div className="flex items-center">
              <Gift className="h-3 w-3 mr-1 text-purple-600" />
              <span>Free Cancel</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Quick Info */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-lg flex items-center">
            <Car className="h-5 w-5 mr-2 text-blue-600" />
            Quick Info
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {car.fuelType && (
              <div className="flex items-center p-2 sm:p-2 bg-blue-50 rounded-lg">
                <Fuel className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium">{car.fuelType}</span>
              </div>
            )}
            {car.transmission && (
              <div className="flex items-center p-2 sm:p-2 bg-green-50 rounded-lg">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-green-600" />
                <span className="text-xs sm:text-sm font-medium">{car.transmission}</span>
              </div>
            )}
            {car.seats && (
              <div className="flex items-center p-2 sm:p-2 bg-purple-50 rounded-lg">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-purple-600" />
                <span className="text-xs sm:text-sm font-medium">{car.seats} Seats</span>
              </div>
            )}
            <div className="flex items-center p-2 sm:p-2 bg-orange-50 rounded-lg">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-orange-600" />
              <span className="text-xs sm:text-sm font-medium">{car.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Owner Info */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-lg flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-600" />
            Hosted by {car.owner?.firstName && car.owner?.lastName ? `${car.owner.firstName} ${car.owner.lastName}` : car.owner?.name || 'Verified Owner'}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
              {car.owner.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 text-sm sm:text-base">{car.owner.name}</div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-2 w-2 sm:h-3 sm:w-3 ${
                        i < Math.floor(car.owner.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span>{car.owner.rating}</span>
                {car.owner.verified && (
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Modal - Removed for simplicity */}
    </div>
  );
}
