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
        setError('Invalid booking ID');
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
          <p>Loading your booking...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  
  // Mock booking data
  const booking = {
    id: params?.id || "1",
    status: "confirmed",
    carTitle: "Ford Focus - Family Sedan",
    carImage: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop&auto=format",
    startDate: "15 January 2024",
    endDate: "17 January 2024",
    startTime: "10:00",
    endTime: "18:00",
    location: "London, Westminster",
    totalDays: 3,
    pricePerDay: 25,
    totalAmount: 75,
    owner: {
      name: "James Smith",
      phone: "+44 20 1234 5678",
      email: "james.smith@example.com"
    },
    renter: {
      name: "Sarah Johnson",
      phone: "+44 20 9876 5432",
      email: "sarah.johnson@example.com"
    },
    bookingDate: "12 January 2024",
    paymentMethod: "Credit Card",
    confirmationCode: "TOM-2024-001"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Your booking has been confirmed successfully. You will receive a confirmation email.
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Details</span>
              <Badge variant="default">Confirmed</Badge>
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
                  Dates and Times
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Start:</span>
                    <span>{booking.startDate} at {booking.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End:</span>
                    <span>{booking.endDate} at {booking.endTime}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Duration:</span>
                    <span>{booking.totalDays} days</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Total Cost</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>£{booking.pricePerDay} × {booking.totalDays} days</span>
                    <span>£{booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>£0</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>£{booking.totalAmount}</span>
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
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Owner</h4>
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
                <h4 className="font-semibold mb-3">Renter</h4>
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
              <h4 className="font-semibold mb-2">Confirmation Code</h4>
              <div className="text-2xl font-mono font-bold text-blue-600 bg-blue-50 py-3 px-6 rounded-lg inline-block">
                {booking.confirmationCode}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Present this code to the owner when picking up the vehicle
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.print()}>
            Print
          </Button>
          <Button onClick={() => window.location.href = "/renter-dashboard"}>
            View My Bookings
          </Button>
        </div>

        {/* Important Notes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Bring a valid ID and your driving license</li>
              <li>• Contact the owner 30 minutes before pickup time</li>
              <li>• Check the vehicle condition before leaving</li>
              <li>• Free cancellation up to 24h before rental start</li>
              <li>• For issues, contact our support: +44 20 1234 5678</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}