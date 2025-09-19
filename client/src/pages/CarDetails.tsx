import { useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, Users, Fuel, Settings, Calendar } from "lucide-react";
import BookingModal from "@/components/BookingModal";

export default function CarDetails() {
  const [, params] = useRoute("/car/:id");
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Mock car data - replace with API call
  const car = {
    id: params?.id || "1",
    title: "Dacia Logan - Berline Familiale",
    description: "Berline spacieuse et économique, parfaite pour les familles. Climatisation, GPS intégré.",
    make: "Dacia",
    model: "Logan",
    year: 2021,
    fuelType: "essence",
    transmission: "manual",
    seats: 5,
    pricePerDay: "250.00",
    location: "Casablanca, Maarif",
    images: ["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format"],
    owner: {
      name: "Ahmed Bennani",
      rating: 4.8,
      reviewCount: 24
    },
    features: ["Climatisation", "GPS", "Bluetooth", "USB", "Airbags"],
    reviews: [
      {
        id: "1",
        reviewer: "Fatima Z.",
        rating: 5,
        comment: "Excellente voiture, très propre et confortable. Ahmed est un propriétaire très professionnel.",
        date: "Il y a 2 semaines"
      },
      {
        id: "2", 
        reviewer: "Youssef M.",
        rating: 4,
        comment: "Bonne expérience, voiture fiable pour mon voyage à Rabat.",
        date: "Il y a 1 mois"
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Car Images and Details */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <img 
              src={car.images?.[0] || '/placeholder-car.jpg'} 
              alt={car.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{car.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {car.location}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {car.owner.rating} ({car.owner.reviewCount} avis)
              </span>
            </div>
            <p className="text-gray-700">{car.description}</p>
          </div>

          {/* Car Specs */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{car.seats} places</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4" />
                  <span>{car.fuelType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{car.year}</span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Équipements</h4>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature) => (
                    <Badge key={feature} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Avis des locataires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {car.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{review.reviewer?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{review.reviewer}</div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-1">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{car.pricePerDay} MAD</span>
                <span className="text-sm font-normal text-gray-600">par jour</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar>
                    <AvatarFallback>{car.owner.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{car.owner.name}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {car.owner.rating} ({car.owner.reviewCount} avis)
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setShowBookingModal(true)}
              >
                Réserver maintenant
              </Button>
              
              <div className="mt-4 text-center text-sm text-gray-600">
                Annulation gratuite jusqu'à 24h avant
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal 
          car={car}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
}