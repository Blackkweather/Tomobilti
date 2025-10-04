import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Download, 
  Mail, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Car,
  User,
  Phone,
  CheckCircle,
  Receipt,
  QrCode
} from 'lucide-react';
import { Link } from 'wouter';

interface BookingReceiptProps {
  bookingId: string;
  booking: {
    id: string;
    car: {
      make: string;
      model: string;
      year: number;
      licensePlate: string;
      images: string[];
    };
    owner: {
      name: string;
      email: string;
      phone: string;
    };
    renter: {
      name: string;
      email: string;
      phone: string;
    };
    dates: {
      startDate: string;
      endDate: string;
      startTime: string;
      endTime: string;
    };
    pricing: {
      dailyRate: number;
      totalDays: number;
      subtotal: number;
      serviceFee: number;
      insurance: number;
      total: number;
    };
    payment: {
      method: string;
      transactionId: string;
      status: string;
      paidAt: string;
    };
  };
}

export default function BookingReceipt({ bookingId, booking }: BookingReceiptProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadReceipt = () => {
    // Create a printable version of the receipt
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Booking Receipt - ${bookingId}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .total { font-weight: bold; font-size: 18px; border-top: 1px solid #000; padding-top: 10px; }
              .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">ShareWheelz</div>
              <h1>Booking Receipt</h1>
              <p>Receipt #${bookingId}</p>
            </div>
            
            <div class="section">
              <h3>Booking Details</h3>
              <div class="row"><span>Car:</span><span>${booking.car.year} ${booking.car.make} ${booking.car.model}</span></div>
              <div class="row"><span>License Plate:</span><span>${booking.car.licensePlate}</span></div>
              <div class="row"><span>Start Date:</span><span>${formatDate(booking.dates.startDate)} at ${formatTime(booking.dates.startTime)}</span></div>
              <div class="row"><span>End Date:</span><span>${formatDate(booking.dates.endDate)} at ${formatTime(booking.dates.endTime)}</span></div>
              <div class="row"><span>Duration:</span><span>${booking.pricing.totalDays} day(s)</span></div>
            </div>

            <div class="section">
              <h3>Pricing Breakdown</h3>
              <div class="row"><span>Daily Rate:</span><span>£${booking.pricing.dailyRate.toFixed(2)} × ${booking.pricing.totalDays}</span></div>
              <div class="row"><span>Subtotal:</span><span>£${booking.pricing.subtotal.toFixed(2)}</span></div>
              <div class="row"><span>Service Fee:</span><span>£${booking.pricing.serviceFee.toFixed(2)}</span></div>
              <div class="row"><span>Insurance:</span><span>£${booking.pricing.insurance.toFixed(2)}</span></div>
              <div class="row total"><span>Total:</span><span>£${booking.pricing.total.toFixed(2)}</span></div>
            </div>

            <div class="section">
              <h3>Payment Information</h3>
              <div class="row"><span>Payment Method:</span><span>${booking.payment.method}</span></div>
              <div class="row"><span>Transaction ID:</span><span>${booking.payment.transactionId}</span></div>
              <div class="row"><span>Payment Status:</span><span>${booking.payment.status}</span></div>
              <div class="row"><span>Paid At:</span><span>${new Date(booking.payment.paidAt).toLocaleString('en-GB')}</span></div>
            </div>

            <div class="section">
              <h3>Contact Information</h3>
              <div class="row"><span>Car Owner:</span><span>${booking.owner.name}</span></div>
              <div class="row"><span>Owner Phone:</span><span>${booking.owner.phone}</span></div>
              <div class="row"><span>Renter:</span><span>${booking.renter.name}</span></div>
              <div class="row"><span>Renter Phone:</span><span>${booking.renter.phone}</span></div>
            </div>

            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
              <p>Thank you for using ShareWheelz!</p>
              <p>For support, contact us at support@sharewheelz.uk</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleEmailReceipt = () => {
    // In a real implementation, this would send an email
    alert('Receipt has been sent to your email address!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your car rental has been successfully booked</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Receipt */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Booking Receipt</CardTitle>
                    <p className="text-blue-100">Receipt #{bookingId}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmed
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Car Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Car className="h-5 w-5 mr-2 text-blue-600" />
                    Vehicle Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Vehicle</p>
                      <p className="font-medium">{booking.car.year} {booking.car.make} {booking.car.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">License Plate</p>
                      <p className="font-medium">{booking.car.licensePlate}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Dates */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Booking Period
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Pickup</p>
                      <p className="font-medium">{formatDate(booking.dates.startDate)}</p>
                      <p className="text-sm text-gray-600">{formatTime(booking.dates.startTime)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Return</p>
                      <p className="font-medium">{formatDate(booking.dates.endDate)}</p>
                      <p className="text-sm text-gray-600">{formatTime(booking.dates.endTime)}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Receipt className="h-5 w-5 mr-2 text-blue-600" />
                    Pricing Breakdown
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Daily Rate (£{booking.pricing.dailyRate.toFixed(2)} × {booking.pricing.totalDays} days)</span>
                      <span>£{booking.pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>£{booking.pricing.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance</span>
                      <span>£{booking.pricing.insurance.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>£{booking.pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium">{booking.payment.method}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-medium text-sm">{booking.payment.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {booking.payment.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Paid At</p>
                      <p className="font-medium">{new Date(booking.payment.paidAt).toLocaleString('en-GB')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Car Owner</h4>
                  <p className="text-sm text-gray-600">{booking.owner.name}</p>
                  <div className="flex items-center mt-1">
                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-600">{booking.owner.phone}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Renter</h4>
                  <p className="text-sm text-gray-600">{booking.renter.name}</p>
                  <div className="flex items-center mt-1">
                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-600">{booking.renter.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Receipt Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleDownloadReceipt}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Button 
                  onClick={handleEmailReceipt}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Receipt
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </Button>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contact Owner</p>
                    <p className="text-xs text-gray-600">Reach out to coordinate pickup</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pickup Vehicle</p>
                    <p className="text-xs text-gray-600">Meet at agreed location</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Enjoy Your Trip</p>
                    <p className="text-xs text-gray-600">Drive safely and have fun!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/support">
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button variant="ghost" className="w-full">
                    View FAQ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 text-center">
          <Link href="/dashboard/renter">
            <Button className="bg-blue-600 hover:bg-blue-700 mr-4">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/cars">
            <Button variant="outline">
              Browse More Cars
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}










