import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { 
  Star, 
  MapPin, 
  Users, 
  Fuel, 
  Settings, 
  Calendar, 
  ArrowLeft, 
  Heart, 
  Share2, 
  Shield, 
  Clock, 
  Zap, 
  Car as CarIcon, 
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle,
  Camera,
  ChevronLeft,
  ChevronRight,
  User,
  Info,
  BookOpen,
  Copy,
  MessageSquare,
  Award,
  Mountain
} from "lucide-react";
import { Link, useLocation } from "wouter";
import ReservationBar from "../components/ReservationBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";
import { carApi, reviewApi } from "../lib/api";
import { getSpecificCarImage } from "../utils/carImages";
import type { Car } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';

// Mapping des images par type de voiture
const carTypeImages: Record<string, string> = {
  'SUV': '/assets/SUV.png',
  'Sport': '/assets/Sport car.png',
  'Luxury': '/assets/luxury Sedam.png',
  'Classic': '/assets/CLASSIC.png',
  'Convertible': '/assets/CONVERTIBLES.png',
  'Electric': '/assets/ELECTRIC.png',
  'Sedan': '/assets/luxury Sedam.png',
  'Hatchback': '/assets/CLASSIC.png',
  'Coupe': '/assets/Sport car.png',
  'Crossover': '/assets/SUV.png',
  'Pickup': '/assets/SUV.png',
  'Van': '/assets/SUV.png',
  'Truck': '/assets/SUV.png',
  'Minivan': '/assets/SUV.png',
  'Wagon': '/assets/luxury Sedam.png',
  'Roadster': '/assets/CONVERTIBLES.png',
  'Cabriolet': '/assets/CONVERTIBLES.png',
  'Hybrid': '/assets/ELECTRIC.png',
  'EV': '/assets/ELECTRIC.png',
  'Vintage': '/assets/CLASSIC.png',
  'Premium': '/assets/luxury Sedam.png',
  'Supercar': '/assets/Sport car.png',
  'Hypercar': '/assets/Sport car.png'
};

// Fonction pour déterminer le type de voiture basé sur les propriétés existantes
// Function to determine vehicle category based on make/model
const getVehicleCategory = (make: string, model: string): string => {
  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();
  
  // Electric vehicles
  if (makeLower.includes('tesla') || modelLower.includes('electric') || modelLower.includes('ev')) {
    return 'electric';
  }
  
  // Sports cars
  if (makeLower.includes('porsche') || makeLower.includes('ferrari') || makeLower.includes('lamborghini') || 
      makeLower.includes('mclaren') || makeLower.includes('aston martin') || modelLower.includes('gt') ||
      modelLower.includes('sport') || modelLower.includes('turbo')) {
    return 'sports';
  }
  
  // Luxury sedans
  if (makeLower.includes('mercedes') || makeLower.includes('bmw') || makeLower.includes('audi') ||
      makeLower.includes('lexus') || makeLower.includes('jaguar') || makeLower.includes('maserati')) {
    return 'luxury';
  }
  
  // SUVs
  if (makeLower.includes('range rover') || makeLower.includes('land rover') || makeLower.includes('jeep') ||
      modelLower.includes('suv') || modelLower.includes('x5') || modelLower.includes('q7') ||
      modelLower.includes('glc') || modelLower.includes('evoque') || modelLower.includes('discovery')) {
    return 'suv';
  }
  
  // Classic cars
  if (makeLower.includes('classic') || modelLower.includes('classic') || 
      (parseInt(make) < 2000 && parseInt(make) > 1950)) {
    return 'classic';
  }
  
  // Convertibles
  if (modelLower.includes('convertible') || modelLower.includes('cabrio') || modelLower.includes('roadster')) {
    return 'convertible';
  }
  
  // Default to luxury for premium brands
  return 'luxury';
};

const vehicleCategoryIcons = {
  sports: Zap,
  luxury: Award,
  electric: Zap,
  classic: Calendar,
  convertible: Shield,
  suv: Mountain
};

const determineCarType = (car: Car): string => {
  const makeModel = `${car.make} ${car.model}`.toLowerCase();
  const title = car.title?.toLowerCase() || '';
  const description = car.description?.toLowerCase() || '';
  
  // Vérifier les mots-clés dans le titre et la description
  if (title.includes('suv') || title.includes('crossover') || description.includes('suv') || 
      makeModel.includes('range rover') || makeModel.includes('jeep') || makeModel.includes('land cruiser') ||
      makeModel.includes('explorer') || makeModel.includes('tahoe') || makeModel.includes('suburban')) {
    return 'SUV';
  }
  
  if (title.includes('sport') || title.includes('coupe') || description.includes('sport') ||
      makeModel.includes('mustang') || makeModel.includes('corvette') || makeModel.includes('ferrari') ||
      makeModel.includes('lamborghini') || makeModel.includes('porsche') || makeModel.includes('bmw m')) {
    return 'Sport';
  }
  
  if (title.includes('luxury') || title.includes('premium') || description.includes('luxury') ||
      makeModel.includes('bmw') || makeModel.includes('mercedes') || makeModel.includes('audi') ||
      makeModel.includes('lexus') || makeModel.includes('infiniti') || makeModel.includes('acura')) {
    return 'Luxury';
  }
  
  if (title.includes('electric') || title.includes('hybrid') || description.includes('electric') ||
      makeModel.includes('tesla') || makeModel.includes('nissan leaf') || makeModel.includes('prius') ||
      makeModel.includes('bolt') || makeModel.includes('ioniq')) {
    return 'Electric';
  }
  
  if (title.includes('convertible') || title.includes('cabriolet') || description.includes('convertible') ||
      makeModel.includes('convertible') || makeModel.includes('cabriolet') || makeModel.includes('roadster')) {
    return 'Convertible';
  }
  
  if (title.includes('classic') || title.includes('vintage') || description.includes('classic') ||
      title.includes('oldtimer') || description.includes('vintage')) {
    return 'Classic';
  }
  
  // Par défaut, déterminer par la taille (nombre de sièges)
  if (car.seats >= 7) {
    return 'SUV'; // Probablement un SUV ou minivan
  } else if (car.seats <= 2) {
    return 'Sport'; // Probablement une voiture de sport
  } else {
    return 'Luxury'; // Probablement une berline
  }
};

// Fonction pour obtenir l'image par défaut basée sur le type de voiture
const getDefaultCarImage = (car: Car): string => {
  // Use the new specific car image function
  return getSpecificCarImage(car);
};

export default function CarDetails() {
  const [match, params] = useRoute<{ id: string }>("/cars/:id");
  const carId: string | undefined = match ? params?.id : undefined;
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  
  // Share functionality
  const currentUrl = window.location.href;
  const shareText = `Check out this amazing car on ShareWheelz`;
  
  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Check out this car on ShareWheelz`);
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
  
  // Handle booking and redirect to payment
  const handleBookingAndPayment = async (bookingData: any) => {
    try {
      // Create booking via API
      const bookingPayload = {
        carId: car?.id,
        renterId: user?.id,
        startDate: bookingData.startDate.toISOString(),
        endDate: bookingData.endDate.toISOString(),
        startTime: '09:00', // Default start time
        endTime: '17:00',   // Default end time
        totalAmount: bookingData.totalAmount.toString(),
        serviceFee: (bookingData.totalAmount * 0.1).toString(), // 10% service fee
        insurance: (bookingData.totalAmount * 0.05).toString(), // 5% insurance
        status: 'pending',
        paymentStatus: 'pending'
      };
      
      console.log('Creating booking:', bookingPayload);
      
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }
      
      const booking = await response.json();
      console.log('Booking created:', booking);
      
      // Invalidate renter bookings cache to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ['renterBookings', user?.id] });
      
      // Redirect to payment page
      setLocation(`/payment/${booking.id}`);
      
    } catch (error) {
      console.error('Booking error:', error);
      alert(`Booking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Fetch car data from API
  const { data: car, isLoading, error } = useQuery<Car & { owner?: any }>({
    queryKey: ['car', carId],
    queryFn: async () => {
      if (!carId) {
        throw new Error('Car ID is required');
      }
      try {
        const result = await carApi.getCar(carId);
        return result;
      } catch (err) {
        console.error('Error fetching car data:', err);
        throw err;
      }
    },
    enabled: !!carId,
    retry: 1,
    retryDelay: 1000,
  });

  // Fetch reviews for this car
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', carId],
    queryFn: () => reviewApi.getCarReviews(carId!),
    enabled: !!carId,
  });

  const reviews = reviewsData?.reviews || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length 
    : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Car Not Found</h2>
          <p className="text-gray-600 mb-4">This car does not exist or has been deleted.</p>
          <p className="text-sm text-gray-500 mb-4">Error: {error?.toString()}</p>
          <Link href="/cars">
            <Button variant="outline">Back to Cars</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fuelTypeLabels: Record<string, string> = {
    essence: 'Petrol',
    diesel: 'Diesel',
    electric: 'Electric',
    hybrid: 'Hybrid'
  };

  const transmissionLabels: Record<string, string> = {
    manual: 'Manual',
    automatic: 'Automatic'
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b shadow-sm relative z-30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/cars">
                <Button variant="outline" size="sm" className="btn-outline hover-lift">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Cars
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold gradient-text">{car.title}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{car.location}</span>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">0.0 (0 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`${isFavorited ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                >
                  <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                    <Share2 className="h-5 w-5" />
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 pb-8 relative z-10">
            {/* Car Images Gallery */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Main Image */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={car.images[currentImageIndex]}
                        alt={car.title}
                        className="w-full h-full object-contain cursor-pointer transition-transform duration-300"
                        onClick={() => setShowImageModal(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-blue-50 to-purple-50">
                        <img
                          src={getDefaultCarImage(car)}
                          alt={`${car.make} ${car.model}`}
                          className="w-32 h-32 object-contain mb-4 opacity-80"
                          onError={(e) => {
                            // Fallback si l'image ne charge pas
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden text-center">
                          <Camera className="w-16 h-16 opacity-50 mx-auto mb-2" />
                          <span className="text-lg font-medium">{car.make} {car.model}</span>
                          <span className="block text-sm opacity-75">{determineCarType(car)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Arrows */}
                  {car.images && car.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                        onClick={() => setCurrentImageIndex((prev: number) => 
                          prev === 0 ? (car.images?.length || 1) - 1 : prev - 1
                        )}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                        onClick={() => setCurrentImageIndex((prev: number) => 
                          prev === (car.images?.length || 1) - 1 ? 0 : prev + 1
                        )}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Picture count badge */}
                  {car.images && car.images.length > 0 && (
                    <div className="absolute top-4 left-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full font-medium">
                      {car.images.length} photo{car.images.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {car.images && car.images.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2 overflow-x-auto">
                      {car.images.map((image, index) => (
                        <button
                          key={index}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={image}
                            alt={`${car.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Info Section */}
            <Card className="bg-white shadow-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3">
                    <CarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Quick Info</h2>
                </div>
                
                {/* Location Badge */}
                <div className="flex items-center mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 border border-orange-200 text-gray-700">
                    <MapPin className="h-4 w-4 mr-1 text-red-500" />
                    {car.location}
                  </span>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 mt-1">Rating</span>
                    <span className="text-sm font-medium text-gray-900">0.0</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-xs text-gray-600 mt-1">Seats</span>
                    <span className="text-sm font-medium text-gray-900">{car.seats}</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Fuel className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-gray-600 mt-1">Fuel</span>
                    <span className="text-sm font-medium text-gray-900">{fuelTypeLabels[car.fuelType] || car.fuelType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features & Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CarIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Features & Amenities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Default features based on car type */}
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium">Air Conditioning</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium">Bluetooth</span>
                  </div>
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="text-sm font-medium">GPS Navigation</span>
                  </div>
                  <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-orange-600 mr-3" />
                    <span className="text-sm font-medium">USB Charging</span>
                  </div>
                  <div className="flex items-center p-3 bg-red-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                    <span className="text-sm font-medium">Child Seat Available</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium">Parking Assist</span>
                  </div>
                  
                  {/* Dynamic features from car data */}
                  {(car as any).features && (car as any).features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-gray-600 mr-3" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Safety & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Safety & Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 bg-green-50 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-900">Full Insurance Coverage</div>
                      <div className="text-sm text-gray-600">Comprehensive protection included</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-900">24/7 Roadside Assistance</div>
                      <div className="text-sm text-gray-600">Help available anytime</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                    <Star className="h-6 w-6 text-purple-600 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-900">Verified Owner</div>
                      <div className="text-sm text-gray-600">Identity and documents verified</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-900">Instant Booking</div>
                      <div className="text-sm text-gray-600">Confirm your rental immediately</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Reviews {reviews.length > 0 && `(${reviews.length})`}
                  </div>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{averageRating.toFixed(1)}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No reviews yet. Be the first to review this car!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {review.user?.firstName?.[0] || 'U'}
                              {review.user?.lastName?.[0] || ''}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">
                                  {review.user?.firstName} {review.user?.lastName || 'Anonymous'}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-gray-700 mt-2">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 relative z-20">
            {/* Reservation Bar */}
            <div id="booking" className="sticky top-24 z-20 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
              <ReservationBar
                car={{
                  id: car.id,
                  title: car.title,
                  pricePerDay: Number(car.pricePerDay),
                  currency: car.currency,
                  location: car.location,
                  owner: {
                    name: (car.owner?.firstName && car.owner?.lastName) ? `${car.owner.firstName} ${car.owner.lastName}` : car.owner?.name || 'Verified Owner',
                    rating: 0,
                    verified: true
                  },
                  images: car.images || [],
                  features: [
                    car.fuelType,
                    car.transmission,
                    `${car.seats} seats`,
                    car.year.toString()
                  ]
                }}
                onBook={(data) => {
                  // Create booking and redirect to payment
                  handleBookingAndPayment(data);
                }}
              />
            </div>

            {/* Host Profile - Enhanced */}
            <Card className="bg-white shadow-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mr-3">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Hosted by {car.owner?.firstName && car.owner?.lastName ? `${car.owner.firstName} ${car.owner.lastName}` : car.owner?.name || 'Verified Owner'}</h2>
                </div>

                {/* Host Info */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={car.owner?.profileImage || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000) + 1500000000000}/150x150/?portrait`} />
                    <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                      {car.owner?.firstName?.[0]}{car.owner?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {car.owner?.firstName && car.owner?.lastName ? `${car.owner.firstName} ${car.owner.lastName}` : car.owner?.name || 'Verified Owner'}
                    </h3>
                    
                    {/* Rating and Reviews */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">0.0 (0 reviews)</span>
                    </div>
                    
                    {/* Status Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified Host
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <Clock className="h-3 w-3 mr-1" />
                        Responds within 1 hour
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Send Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call Host
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Host Stats */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">24</div>
                    <div className="text-sm text-gray-600">Total Rentals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">98%</div>
                    <div className="text-sm text-gray-600">Response Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main content ends here - Footer is handled by App.tsx */}
    </div>
  );
}
