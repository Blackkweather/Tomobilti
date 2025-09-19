import { useRoute } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, MapPin, Car, User, Phone, Mail, AlertCircle } from "lucide-react";

export default function BookingConfirmation() {
  const [, params] = useRoute("/booking-confirmation/:id");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const validateBookingId = () => {
      if (!params?.id || params.id.length < 3) {
        setError('ID de réservation invalide');
        setIsLoading(false);
        return;
      }
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    
    validateBookingId();
  }, [params?.id]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement de votre réservation...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.href = '/'}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }
  
  // Mock booking data
  const booking = {
    id: params?.id || "1",
    status: "confirmed",
    carTitle: "Dacia Logan - Berline Familiale",
    carImage: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop&auto=format",
    startDate: "15 Janvier 2024",
    endDate: "17 Janvier 2024",
    startTime: "10:00",
    endTime: "18:00",
    location: "Casablanca, Maarif",
    totalDays: 3,
    pricePerDay: 250,
    totalAmount: 750,
    owner: {
      name: "Ahmed Bennani",
      phone: "+212 6 12 34 56 78",
      email: "ahmed.bennani@example.com"
    },
    renter: {
      name: "Fatima Zahra",
      phone: "+212 6 34 56 78 90",
      email: "fatima.zahra@example.com"
    },
    bookingDate: "12 Janvier 2024",
    paymentMethod: "Carte bancaire",
    confirmationCode: "TOM-2024-001"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Réservation confirmée !</h1>
          <p className="text-gray-600">
            Votre réservation a été confirmée avec succès. Vous recevrez un email de confirmation.
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Détails de la réservation</span>
              <Badge variant="default">Confirmée</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <img 
                src={booking.carImage} 
                alt={booking.carTitle}
                className="w-24 h-18 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{booking.carTitle}</h3>
                <div className="flex items-center gap-1 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{booking.location}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Dates et heures
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Début:</span>
                    <span>{booking.startDate} à {booking.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fin:</span>
                    <span>{booking.endDate} à {booking.endTime}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Durée:</span>
                    <span>{booking.totalDays} jours</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Coût total</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{booking.pricePerDay} MAD × {booking.totalDays} jours</span>
                    <span>{booking.totalAmount} MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de service</span>
                    <span>0 MAD</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{booking.totalAmount} MAD</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations de contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Propriétaire</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{booking.owner.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{booking.owner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{booking.owner.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Locataire</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{booking.renter.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{booking.renter.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{booking.renter.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Reference */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Code de confirmation</h4>
              <div className="text-2xl font-mono font-bold text-blue-600 bg-blue-50 py-3 px-6 rounded-lg inline-block">
                {booking.confirmationCode}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Présentez ce code au propriétaire lors de la récupération du véhicule
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.print()}>
            Imprimer
          </Button>
          <Button onClick={() => window.location.href = "/renter-dashboard"}>
            Voir mes réservations
          </Button>
        </div>

        {/* Important Notes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informations importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Présentez-vous avec une pièce d'identité valide et votre permis de conduire</li>
              <li>• Contactez le propriétaire 30 minutes avant l'heure de récupération</li>
              <li>• Vérifiez l'état du véhicule avant de partir</li>
              <li>• Annulation gratuite jusqu'à 24h avant le début de la location</li>
              <li>• En cas de problème, contactez notre support: +212 5 22 00 00 00</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}