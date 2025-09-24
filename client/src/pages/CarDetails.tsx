import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Users, Fuel, Settings, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import BookingModal from "@/components/BookingModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";
import { carApi } from "@/lib/api";

export default function CarDetails() {
  const [, params] = useRoute("/cars/:id");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Fetch car data from API
  const { data: car, isLoading, error } = useQuery({
    queryKey: ['car', params?.id],
    queryFn: async () => {
      const response = await fetch(`/api/cars/${params?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch car details');
      }
      return response.json();
    },
    enabled: !!params?.id,
  });

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
          <Link href="/cars">
            <Button variant="outline">Back to Cars</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fuelTypeLabels = {
    essence: 'Petrol',
    diesel: 'Diesel',
    electric: 'Electric',
    hybrid: 'Hybrid'
  };

  const transmissionLabels = {
    manual: 'Manual',
    automatic: 'Automatic'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/cars">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{car.title}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{car.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {car.images && car.images.length > 0 ? (
                    car.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${car.title} - Image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ))
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&auto=format"
                      alt={car.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {car.description}
                </p>
              </CardContent>
            </Card>

            {/* Car Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{car.year}</div>
                    <div className="text-sm text-gray-600">Year</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{car.seats}</div>
                    <div className="text-sm text-gray-600">Seats</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Fuel className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <div className="text-sm text-gray-600">{fuelTypeLabels[car.fuelType]}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Settings className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <div className="text-sm text-gray-600">{transmissionLabels[car.transmission]}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Reviews ({car.reviewCount || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {car.reviewCount === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    No reviews yet. Be the first to leave a comment!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {/* Mock reviews - replace with real data */}
                    <div className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>FZ</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Fatima Z.</div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Excellent car, very clean and comfortable. The owner is very professional.
                      </p>
                      <div className="text-sm text-gray-500 mt-2">2 weeks ago</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      {car.pricePerDay} {car.currency}
                    </div>
                    <div className="text-gray-600">per day</div>
                  </div>
                  <Badge variant={car.isAvailable ? "default" : "secondary"}>
                    {car.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {car.isAvailable ? (
                  isAuthenticated ? (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => setShowBookingModal(true)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  ) : (
                    <Link href="/login">
                      <Button className="w-full" size="lg">
                        <Calendar className="w-4 h-4 mr-2" />
                        Login to Book
                      </Button>
                    </Link>
                  )
                ) : (
                  <Button className="w-full" size="lg" disabled>
                    Not Available
                  </Button>
                )}
                
                <div className="text-center text-sm text-gray-600">
                  ✓ Insurance included<br />
                  ✓ Free cancellation<br />
                  ✓ 24/7 Support
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle>Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={car.owner?.profileImage} />
                    <AvatarFallback>
                      {car.owner ? `${car.owner.firstName[0]}${car.owner.lastName[0]}` : 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {car.owner ? `${car.owner.firstName} ${car.owner.lastName}` : 'Owner'}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{car.rating?.toFixed(1) || 'New'}</span>
                      <span>({car.reviewCount || 0} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && isAuthenticated && (
        <BookingModal
          car={car}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
}