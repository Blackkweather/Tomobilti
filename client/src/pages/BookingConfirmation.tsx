import { useRoute } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CheckCircle, Calendar, MapPin, Car, User, Phone, Mail, AlertCircle, Download } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { bookingApi } from "../lib/api";
// Dynamic imports for PDF generation

export default function BookingConfirmation() {
  const [, params] = useRoute("/booking-confirmation/:id");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!params?.id) {
        setError('Booking ID is missing.');
        setIsLoading(false);
        return;
      }
      
      try {
        const fetchedBooking = await bookingApi.getBooking(params.id);
        setBooking(fetchedBooking);
      } catch (err) {
        console.error("Failed to fetch booking details:", err);
        setError("Failed to load booking details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [params?.id]);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      console.log('Starting PDF generation...');
      console.log('Booking data:', booking);
      console.log('User data:', user);
      
      // Import jsPDF directly
      const { default: jsPDF } = await import('jspdf');
      console.log('jsPDF imported successfully');
      
      // Create new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      console.log('PDF document created');
      
      // Get booking data with fallbacks
      const bookingData = booking || {
        id: params?.id || 'unknown',
        car: { 
          title: 'Sample Car', 
          make: 'Toyota', 
          model: 'Camry', 
          year: 2023 
        },
        startDate: '2025-01-15',
        endDate: '2025-01-17',
        totalAmount: 150,
        currency: 'MAD',
        status: 'confirmed'
      };
      
      const userData = user || {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+212 600 000 000'
      };

      console.log('Using booking data:', bookingData);
      console.log('Using user data:', userData);

      // Add content to PDF
      let yPosition = 20;
      
      // Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BOOKING CONFIRMATION', 105, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Success message
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(16, 185, 129); // Green color
      pdf.text('✓ Booking Confirmed Successfully!', 105, yPosition, { align: 'center' });
      yPosition += 20;
      
      // Booking details
      pdf.setTextColor(0, 0, 0); // Black color
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Booking Details', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      // Car information
      pdf.text(`Car: ${bookingData.car?.title || 'N/A'}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Make/Model: ${bookingData.car?.make || 'N/A'} ${bookingData.car?.model || 'N/A'}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Year: ${bookingData.car?.year || 'N/A'}`, 20, yPosition);
      yPosition += 7;
      
      // Dates
      try {
        pdf.text(`Start Date: ${new Date(bookingData.startDate).toLocaleDateString()}`, 20, yPosition);
        yPosition += 7;
        pdf.text(`End Date: ${new Date(bookingData.endDate).toLocaleDateString()}`, 20, yPosition);
        yPosition += 7;
      } catch (dateError) {
        pdf.text(`Start Date: ${bookingData.startDate}`, 20, yPosition);
        yPosition += 7;
        pdf.text(`End Date: ${bookingData.endDate}`, 20, yPosition);
        yPosition += 7;
      }
      
      // Amount
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Total Amount: ${bookingData.totalAmount || 0} ${bookingData.currency || 'MAD'}`, 20, yPosition);
      yPosition += 15;
      
      // Customer information
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Customer Information', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Name: ${userData.firstName || 'N/A'} ${userData.lastName || 'N/A'}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Email: ${userData.email || 'N/A'}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Phone: ${userData.phone || 'N/A'}`, 20, yPosition);
      yPosition += 15;
      
      // Booking reference
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Booking Reference', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246); // Blue color
      pdf.text(bookingData.id, 20, yPosition);
      yPosition += 20;
      
      // Footer
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Thank you for choosing Tomobilti!', 105, yPosition, { align: 'center' });
      yPosition += 5;
      pdf.text('For support, contact us at support@tomobilti.com', 105, yPosition, { align: 'center' });
      
      console.log('PDF content added successfully');
      
      // Download the PDF
      const fileName = `booking-confirmation-${bookingData.id}.pdf`;
      pdf.save(fileName);
      
      console.log('PDF saved successfully:', fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      alert(`Failed to generate PDF: ${error.message || 'Unknown error'}. Check console for details.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
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

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-yellow-600 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-4">The booking you are looking for could not be found.</p>
          <Button onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto" id="booking-confirmation-content">
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
                src={booking.car?.image || '/placeholder-car.jpg'} 
                alt={booking.car?.title || 'Car'}
                className="w-24 h-18 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{booking.car?.title || 'Car'}</h3>
                <div className="flex items-center gap-1 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{booking.car?.location || 'Location not specified'}</span>
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
                    <span>{new Date(booking.startDate).toLocaleDateString()} at {booking.startTime || '10:00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End:</span>
                    <span>{new Date(booking.endDate).toLocaleDateString()} at {booking.endTime || '18:00'}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Duration:</span>
                    <span>{Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))} days</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Total Cost</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{booking.car?.currency || 'MAD'} {booking.car?.pricePerDay || 0} × {Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))} days</span>
                    <span>{booking.car?.currency || 'MAD'} {booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>{booking.car?.currency || 'MAD'} 0</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{booking.car?.currency || 'MAD'} {booking.totalAmount}</span>
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
          <Button 
            variant="outline" 
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
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