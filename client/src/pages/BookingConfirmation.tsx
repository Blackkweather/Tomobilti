import { useRoute } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CheckCircle, Calendar as CalendarIcon, MapPin, Car, User, Phone, Mail, AlertCircle, Download } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { bookingApi } from "../lib/api";

export default function BookingConfirmation() {
  const [, params] = useRoute("/booking-confirmation/:bookingId");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { user } = useAuth();
  
  console.log('BookingConfirmation component loaded');
  console.log('Params:', params);
  console.log('Booking ID from params:', params?.bookingId);
  
  // Generate a shorter booking code (4numbers-4numbers format)
  const generateShortBookingCode = (originalId: string | undefined) => {
    if (!originalId || originalId === 'unknown') {
      return '1234-5678';
    }
    // Extract numbers from the original ID and format as 4-4
    const numbers = originalId.replace(/\D/g, ''); // Remove all non-digits
    if (numbers.length >= 8) {
      return `${numbers.substring(0, 4)}-${numbers.substring(4, 8)}`;
    } else {
      // If not enough digits, pad with zeros
      const padded = numbers.padEnd(8, '0');
      return `${padded.substring(0, 4)}-${padded.substring(4, 8)}`;
    }
  };
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      console.log('fetchBookingDetails called');
      console.log('params?.bookingId:', params?.bookingId);
      
      if (!params?.bookingId) {
        console.log('No booking ID found');
        setError('Booking ID is missing.');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Fetching booking with ID:', params.bookingId);
        const fetchedBooking = await bookingApi.getBooking(params.bookingId);
        console.log('Booking fetched successfully:', fetchedBooking);
        setBooking(fetchedBooking);
      } catch (err) {
        console.error("Failed to fetch booking details:", err);
        setError("Failed to load booking details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [params?.bookingId]);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      console.log('Starting EXACT COPY PDF generation...');
      
      // Import jsPDF directly
      const { default: jsPDF } = await import('jspdf');
      console.log('jsPDF imported successfully');
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      console.log('PDF document created');
      
      // Get booking data with fallbacks - ensure all values are strings
      const bookingData = booking || {
        id: params?.bookingId || 'unknown',
        shortId: generateShortBookingCode(params?.bookingId),
        car: { 
          title: 'Sample Car', 
          pricePerDay: 50,
          plateNumber: 'TBD'
        },
        startDate: '2025-01-15',
        endDate: '2025-01-17',
        totalAmount: 150,
        serviceFee: 20,
        insurance: 30,
        currency: 'GBP'
      };
      
      // Add short ID to existing booking data
      if (booking && booking.id) {
        bookingData.shortId = generateShortBookingCode(booking.id);
      }
      
      console.log('PDF Booking Data:', bookingData);
      console.log('Short ID:', bookingData.shortId);
      
      const userData = user || {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+44 20 7123 4567'
      };

      // Helper function to safely convert values to strings
      const safeText = (value: any) => {
        if (value === null || value === undefined) return '';
        return String(value);
      };

      // Calculate rental days
      const rentalDays = Math.ceil((new Date(bookingData.endDate).getTime() - new Date(bookingData.startDate).getTime()) / (1000 * 60 * 60 * 24));
      const subtotal = Number(bookingData.totalAmount || 0);
      const tax = subtotal * 0.2;
      const total = subtotal + tax;

      let yPosition = 10;
      
      // EXACT COPY OF WEB PAGE DESIGN
      
      // 1. Professional Header Section - Dark gradient background
      pdf.setFillColor(30, 41, 59); // Slate-800 color
      pdf.rect(0, 0, 210, 35, 'F');
      
      // Logo placeholder (since we can't easily add images)
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('SHAREWHEELZ', 15, 15);
      pdf.setFontSize(10);
      pdf.setTextColor(203, 213, 225); // Slate-300
      pdf.text('Premium Car Rental Services', 15, 20);
      
      // Contact info on right
      pdf.setFontSize(8);
      pdf.setTextColor(226, 232, 240); // Slate-200
      pdf.text('1234 Car Avenue, London, UK SW1A 1AA', 120, 8);
      pdf.text('info@sharewheelz.uk', 120, 12);
      pdf.text('+44 20 7123 4567', 120, 16);
      pdf.text('www.sharewheelz.uk', 120, 20);
      
      // Professional Accent Bar
      pdf.setFillColor(156, 79, 255); // Mauve-600
      pdf.rect(0, 35, 210, 2, 'F');
      
      yPosition = 45;
      
      // 2. Invoice Details Section
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BOOKING CONFIRMATION', 15, yPosition);
      
      // SINGLE BOOKING CODE - Right under the title
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(67, 56, 202); // Indigo color
      pdf.text(`Booking Code: ${safeText(bookingData.shortId)}`, 15, yPosition + 8);
      
      // Booking date on right
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Booking Date', 150, yPosition - 5);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(safeText(new Date().toLocaleDateString('en-GB')), 150, yPosition);
      
      yPosition += 20;
      
      // 3. BILL TO Section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BILL TO', 15, yPosition);
      yPosition += 8;
      
      // Gray background box
      pdf.setFillColor(249, 250, 251); // Gray-50
      pdf.rect(15, yPosition - 3, 180, 15, 'F');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(safeText(`${userData.firstName} ${userData.lastName}`), 17, yPosition + 2);
      yPosition += 4;
      pdf.setFont('helvetica', 'normal');
      pdf.text(safeText(userData.email), 17, yPosition + 2);
      yPosition += 4;
      pdf.text(safeText(userData.phone || 'Phone not provided'), 17, yPosition + 2);
      
      yPosition += 15;
      
      // 4. VEHICLE INFORMATION Section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('VEHICLE INFORMATION', 15, yPosition);
      yPosition += 8;
      
      // Gray background box
      pdf.setFillColor(249, 250, 251); // Gray-50
      pdf.rect(15, yPosition - 3, 180, 20, 'F');
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      // Vehicle info in columns - FIXED SPACING
      pdf.text('Car Model', 17, yPosition + 2);
      pdf.setFont('helvetica', 'bold');
      pdf.text(safeText(bookingData.car?.title || 'N/A'), 17, yPosition + 6);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Plate Number', 100, yPosition + 2); // Moved further right
      pdf.setFont('helvetica', 'bold');
      pdf.text(safeText(bookingData.car?.plateNumber || 'TBD'), 100, yPosition + 6);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Rental Period', 160, yPosition + 2); // Moved further right
      pdf.setFont('helvetica', 'bold');
      pdf.text(safeText(`${new Date(bookingData.startDate).toLocaleDateString('en-GB')} - ${new Date(bookingData.endDate).toLocaleDateString('en-GB')}`), 160, yPosition + 6);
      
      yPosition += 20;
      
      // 5. CHARGES Table
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CHARGES', 15, yPosition);
      yPosition += 8;
      
      // Table header
      pdf.setFillColor(30, 41, 59); // Slate-800 color
      pdf.rect(15, yPosition - 3, 180, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Description', 17, yPosition + 2);
      pdf.text('Rate', 80, yPosition + 2);
      pdf.text('Quantity', 110, yPosition + 2);
      pdf.text('Subtotal', 150, yPosition + 2);
      
      yPosition += 8;
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      
      // Table rows
      pdf.text('Car Rental Charges', 17, yPosition + 2);
      pdf.text(safeText(`£${Number(bookingData.car?.pricePerDay || 0).toFixed(2)}`), 80, yPosition + 2);
      pdf.text(safeText(`${rentalDays} days`), 110, yPosition + 2);
      pdf.setFont('helvetica', 'bold');
      pdf.text(safeText(`£${subtotal.toFixed(2)}`), 150, yPosition + 2);
      
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      pdf.text('Service Fee', 17, yPosition + 2);
      pdf.text('-', 80, yPosition + 2);
      pdf.text('-', 110, yPosition + 2);
      pdf.setFont('helvetica', 'bold');
      pdf.text(safeText(`£${Number(bookingData.serviceFee || 0).toFixed(2)}`), 150, yPosition + 2);
      
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      pdf.text('Insurance', 17, yPosition + 2);
      pdf.text('-', 80, yPosition + 2);
      pdf.text('-', 110, yPosition + 2);
      pdf.setFont('helvetica', 'bold');
      pdf.text(safeText(`£${Number(bookingData.insurance || 0).toFixed(2)}`), 150, yPosition + 2);
      
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
      pdf.text('Other Service', 17, yPosition + 2);
      pdf.text('-', 80, yPosition + 2);
      pdf.text('-', 110, yPosition + 2);
      pdf.text('-', 150, yPosition + 2);
      
      yPosition += 8;
      
      // Tax and Total
      pdf.setFont('helvetica', 'bold');
      pdf.text('Taxes (20%)', 17, yPosition + 2);
      pdf.text(safeText(`£${tax.toFixed(2)}`), 150, yPosition + 2);
      
      yPosition += 6;
      pdf.setFillColor(30, 41, 59); // Slate-800 color
      pdf.rect(15, yPosition - 3, 180, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text('Total Charges', 17, yPosition + 2);
      pdf.text(safeText(`£${total.toFixed(2)}`), 150, yPosition + 2);
      
      yPosition += 15;
      pdf.setTextColor(0, 0, 0);
      
      // 6. PAYMENT INFORMATION Section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PAYMENT INFORMATION', 15, yPosition);
      yPosition += 8;
      
      // Gray background box
      pdf.setFillColor(249, 250, 251); // Gray-50
      pdf.rect(15, yPosition - 3, 180, 25, 'F');
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      // Payment info in columns
      pdf.text('Payment Due Date', 17, yPosition + 2);
      pdf.setFont('helvetica', 'bold');
      pdf.text(safeText(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')), 17, yPosition + 6);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Payment Method', 80, yPosition + 2);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Credit Card', 80, yPosition + 6);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Bank Name', 140, yPosition + 2);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ShareWheelz Bank', 140, yPosition + 6);
      
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Account Name', 17, yPosition + 2);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ShareWheelz Ltd', 17, yPosition + 6);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Account Number', 80, yPosition + 2);
      pdf.setFont('helvetica', 'bold');
      pdf.text('1234567890', 80, yPosition + 6);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Routing Number', 140, yPosition + 2);
      pdf.setFont('helvetica', 'bold');
      pdf.text('987654321', 140, yPosition + 6);
      
      yPosition += 20;
      
      // 7. NOTES Section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('NOTES', 15, yPosition);
      yPosition += 8;
      
      // Gray background box
      pdf.setFillColor(249, 250, 251); // Gray-50
      pdf.rect(15, yPosition - 3, 180, 15, 'F');
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const notesText = 'Thank you for choosing ShareWheelz for your car rental needs. If you have any questions regarding this booking confirmation or need further assistance, please don\'t hesitate to contact us at +44 20 7123 4567 or info@sharewheelz.uk.';
      pdf.text(safeText(notesText), 17, yPosition + 2, { maxWidth: 176 });
      
      yPosition += 20;
      
      // 8. Professional E-Signature Section - EXACT COPY
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DIGITAL SIGNATURE', 15, yPosition);
      yPosition += 8;
      
      // Signature line
      pdf.setDrawColor(100, 116, 139); // Slate-300
      pdf.setLineWidth(2);
      pdf.line(15, yPosition, 75, yPosition);
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Authorized Digital Signature', 15, yPosition + 5);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ShareWheelz Management Team', 15, yPosition + 9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(safeText(`Digitally signed on ${new Date().toLocaleDateString('en-GB')}`), 15, yPosition + 13);
      
      // Elegant cursive signature - EXACT COPY FROM WEB PAGE
      pdf.setTextColor(67, 56, 202); // Indigo-800
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Share Wheelzs', 120, yPosition + 5);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DIGITAL SIGNATURE', 120, yPosition + 9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Authorized Representative', 120, yPosition + 13);
      
      console.log('EXACT COPY PDF generated successfully');
      
      // Download
      const fileName = `booking-confirmation-${bookingData.id}.pdf`;
      pdf.save(fileName);
      
      console.log('PDF saved:', fileName);
      
    } catch (error: any) {
      console.error('PDF Error:', error);
      alert(`PDF Error: ${error.message}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking confirmation...</p>
          <p className="text-sm text-gray-500 mt-2">Booking ID: {params?.bookingId}</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Booking</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Booking ID: {params?.bookingId}</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">No Booking Found</h1>
          <p className="text-gray-600 mb-4">The booking could not be found.</p>
          <p className="text-sm text-gray-500">Booking ID: {params?.bookingId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Professional Header Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-8">
          <div className="flex justify-between items-center">
            {/* Logo/Branding */}
            <div className="flex items-center">
              <img 
                src="/assets/MAIN LOGO.png?v=5" 
                alt="ShareWheelz Logo" 
                className="h-16 mr-6"
              />
              <div>
                <h1 className="text-4xl font-bold text-white tracking-wide">SHAREWHEELZ</h1>
                <p className="text-lg text-slate-300 font-light">Premium Car Rental Services</p>
              </div>
            </div>
            
            {/* Company Contact Information */}
            <div className="text-right text-slate-200">
              <div className="space-y-2">
                <div className="flex items-center justify-end mb-1">
                  <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="text-sm">1234 Car Avenue, London, UK SW1A 1AA</span>
                </div>
                <div className="flex items-center justify-end mb-1">
                  <Mail className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="text-sm">info@sharewheelz.uk</span>
                </div>
                <div className="flex items-center justify-end mb-1">
                  <Phone className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="text-sm">+44 20 7123 4567</span>
                </div>
                <div className="flex items-center justify-end">
                  <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="text-sm">www.sharewheelz.uk</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-mauve-600 to-rose-500"></div>

        {/* Invoice Details Section */}
        <div className="px-8 py-6 bg-white">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">BOOKING CONFIRMATION</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Booking Code</p>
              <p className="text-lg font-semibold text-slate-800">{generateShortBookingCode(booking.id)}</p>
              <p className="text-sm text-gray-600">Booking Date</p>
              <p className="text-lg font-semibold text-slate-800">
                {new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* BILL TO Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">BILL TO</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-600">{user?.phone || 'Phone not provided'}</p>
            </div>
          </div>

          {/* VEHICLE INFORMATION Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">VEHICLE INFORMATION</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Car Model</p>
                  <p className="font-semibold text-gray-900">{booking.car?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Plate Number</p>
                  <p className="font-semibold text-gray-900">{booking.car?.plateNumber || 'TBD'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rental Period</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(booking.startDate).toLocaleDateString('en-GB')} - {new Date(booking.endDate).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charges Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">CHARGES</h3>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="px-4 py-3 text-left font-semibold">Description</th>
                    <th className="px-4 py-3 text-center font-semibold">Rate</th>
                    <th className="px-4 py-3 text-center font-semibold">Quantity</th>
                    <th className="px-4 py-3 text-center font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3">Car Rental Charges</td>
                    <td className="px-4 py-3 text-center">£{Number(booking.car?.pricePerDay || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">£{Number(booking.totalAmount || 0).toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3">Service Fee</td>
                    <td className="px-4 py-3 text-center">-</td>
                    <td className="px-4 py-3 text-center">-</td>
                    <td className="px-4 py-3 text-center font-semibold">£{Number(booking.serviceFee || 0).toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3">Insurance</td>
                    <td className="px-4 py-3 text-center">-</td>
                    <td className="px-4 py-3 text-center">-</td>
                    <td className="px-4 py-3 text-center font-semibold">£{Number(booking.insurance || 0).toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3">Other Service</td>
                    <td className="px-4 py-3 text-center">-</td>
                    <td className="px-4 py-3 text-center">-</td>
                    <td className="px-4 py-3 text-center font-semibold">-</td>
                  </tr>
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 font-semibold" colSpan={3}>Taxes (20%)</td>
                    <td className="px-4 py-3 text-center font-semibold">£{(Number(booking.totalAmount || 0) * 0.2).toFixed(2)}</td>
                  </tr>
                  <tr className="bg-slate-800 text-white">
                    <td className="px-4 py-3 font-bold text-lg" colSpan={3}>Total Charges</td>
                    <td className="px-4 py-3 text-center font-bold text-lg">£{(Number(booking.totalAmount || 0) * 1.2).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* PAYMENT INFORMATION Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">PAYMENT INFORMATION</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Due Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-900">Credit Card</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bank Name</p>
                  <p className="font-semibold text-gray-900">ShareWheelz Bank</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Name</p>
                  <p className="font-semibold text-gray-900">ShareWheelz Ltd</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-semibold text-gray-900">1234567890</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Routing Number</p>
                  <p className="font-semibold text-gray-900">987654321</p>
                </div>
              </div>
            </div>
          </div>

          {/* NOTES Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">NOTES</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                Thank you for choosing ShareWheelz for your car rental needs. If you have any questions regarding this booking confirmation or need further assistance, please don't hesitate to contact us at +44 20 7123 4567 or info@sharewheelz.uk.
              </p>
            </div>
          </div>

          {/* Professional E-Signature Section */}
          <div className="mb-8">
            <div className="flex justify-between items-end">
              <div className="flex-1">
                <div className="border-b-2 border-slate-300 w-64 mb-2"></div>
                <p className="text-sm text-slate-600">Authorized Digital Signature</p>
                <p className="text-sm font-semibold text-slate-800">ShareWheelz Management Team</p>
                <p className="text-xs text-slate-500">Digitally signed on {new Date().toLocaleDateString('en-GB')}</p>
              </div>
              <div className="text-right">
                {/* Elegant cursive signature - no box */}
                <div className="text-center">
                  <div className="mb-2">
                    <span className="text-3xl font-cursive text-indigo-800 font-bold" style={{
                      fontFamily: 'Brush Script MT, cursive',
                      textShadow: '0 0 4px rgba(67, 56, 202, 0.4)',
                      letterSpacing: '2px'
                    }}>
                      Share Wheelzs
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">DIGITAL SIGNATURE</p>
                  <p className="text-xs text-slate-500">Authorized Representative</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button 
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 font-semibold"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? 'Generating PDF...' : 'Download Confirmation'}
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gradient-to-r from-mauve-600 to-rose-500 hover:from-mauve-700 hover:to-rose-600 text-white px-8 py-3 font-semibold"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
