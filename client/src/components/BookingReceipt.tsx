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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const receiptRef = React.useRef<HTMLDivElement | null>(null);
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

  const handleDownloadPdf = async () => {
    // Build branded HTML (same as print template) but render off-screen
    const html = `
      <html>
        <head>
          <meta charset=\"utf-8\" />
          <title>Booking Receipt - ${bookingId}</title>
          <style>
            @page { size: A4; margin: 14mm; }
            :root {
              --brand: #2563eb;
              --brand-2: #7c3aed;
              --text: #111827;
              --muted: #6b7280;
              --line: #e5e7eb;
              --bg: #ffffff;
            }
            * { box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif; margin: 0; color: var(--text); background: var(--bg); }
            .container { padding: 14mm; }
            .header { display:flex; align-items:center; justify-content:space-between; border-bottom: 2px solid var(--line); padding-bottom: 12px; margin-bottom: 18px; }
            .brand { display:flex; align-items:center; gap: 12px; }
            .brand img { height: 42px; width:auto; }
            .brand-name { font-size: 22px; font-weight: 800; letter-spacing: .2px; color: var(--brand); }
            .doc-meta { text-align:right; font-size: 12px; color: var(--muted); }
            .title { margin: 6px 0 0; font-size: 20px; color: var(--text); font-weight:700; }
            .badge { display:inline-block; padding: 4px 10px; background: #ecfdf5; color:#065f46; border:1px solid #a7f3d0; border-radius: 999px; font-size: 12px; font-weight:600; }
            .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; }
            .card { border:1px solid var(--line); border-radius: 10px; padding: 14px; }
            .section-title { margin: 0 0 10px; font-size: 14px; font-weight:700; color: var(--brand); }
            .row { display:flex; justify-content: space-between; gap: 10px; margin: 6px 0; font-size: 13px; }
            .label { color: var(--muted); }
            table { width:100%; border-collapse: collapse; font-size: 13px; }
            th, td { padding: 10px 12px; text-align: left; }
            thead th { background: #f8fafc; border-bottom: 1px solid var(--line); color:#334155; font-weight:700; }
            tbody td { border-bottom: 1px solid var(--line); }
            tfoot td { border-top: 2px solid var(--line); font-weight:800; font-size: 14px; }
            .muted { color: var(--muted); }
            .footer { text-align:center; margin-top: 16px; font-size: 11px; color: var(--muted); }
          </style>
        </head>
        <body>
          <div class=\"container\">
            <div class=\"header\">
              <div class=\"brand\">
                <img src=\"/assets/MAIN LOGO.png?v=5\" alt=\"ShareWheelz\" />
                <div>
                  <div class=\"brand-name\">ShareWheelz</div>
                  <div class=\"muted\" style=\"font-size:11px;\">Modern car sharing platform</div>
                </div>
              </div>
              <div class=\"doc-meta\">
                <div class=\"title\">Booking Receipt</div>
                <div>Receipt #${bookingId}</div>
                <div>${new Date().toLocaleString('en-GB')}</div>
                <div class=\"badge\" style=\"margin-top:6px;\">Confirmed</div>
              </div>
            </div>

            <div class=\"grid\">
              <div class=\"card\">
                <div class=\"section-title\">Booking Details</div>
                <div class=\"row\"><span class=\"label\">Vehicle</span><span>${booking.car.year} ${booking.car.make} ${booking.car.model}</span></div>
                <div class=\"row\"><span class=\"label\">License Plate</span><span>${booking.car.licensePlate}</span></div>
                <div class=\"row\"><span class=\"label\">Pickup</span><span>${formatDate(booking.dates.startDate)} — ${formatTime(booking.dates.startTime)}</span></div>
                <div class=\"row\"><span class=\"label\">Return</span><span>${formatDate(booking.dates.endDate)} — ${formatTime(booking.dates.endTime)}</span></div>
                <div class=\"row\"><span class=\"label\">Duration</span><span>${booking.pricing.totalDays} day(s)</span></div>
              </div>
              <div class=\"card\">
                <div class=\"section-title\">Contacts</div>
                <div class=\"row\"><span class=\"label\">Owner</span><span>${booking.owner.name} — ${booking.owner.phone}</span></div>
                <div class=\"row\"><span class=\"label\">Renter</span><span>${booking.renter.name} — ${booking.renter.phone}</span></div>
                <div class=\"row\"><span class=\"label\">Support</span><span>support@sharewheelz.uk</span></div>
              </div>
            </div>

            <div class=\"card\" style=\"margin-bottom:18px;\">
              <div class=\"section-title\">Pricing</div>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style=\"width: 180px;\">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Daily Rate × ${booking.pricing.totalDays} day(s)</td>
                    <td>£${booking.pricing.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Service Fee</td>
                    <td>£${booking.pricing.serviceFee.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Insurance</td>
                    <td>£${booking.pricing.insurance.toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total</td>
                    <td>£${booking.pricing.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class=\"grid\">
              <div class=\"card\">
                <div class=\"section-title\">Payment</div>
                <div class=\"row\"><span class=\"label\">Method</span><span>${booking.payment.method}</span></div>
                <div class=\"row\"><span class=\"label\">Transaction ID</span><span>${booking.payment.transactionId}</span></div>
                <div class=\"row\"><span class=\"label\">Status</span><span>${booking.payment.status}</span></div>
                <div class=\"row\"><span class=\"label\">Paid At</span><span>${new Date(booking.payment.paidAt).toLocaleString('en-GB')}</span></div>
              </div>
              <div class=\"card\">
                <div class=\"section-title\">Notes</div>
                <div class=\"muted\" style=\"font-size:12px; line-height:1.5;\">Please present this receipt upon pickup. Ensure your driving license and ID match the booking details. Contact support for any changes.</div>
              </div>
            </div>

            <div class=\"footer\">
              Thank you for choosing ShareWheelz • sharewheelz.uk • Company No. 00000000
            </div>
          </div>
        </body>
      </html>
    `;

    // Render HTML into a hidden iframe to rasterize with html2canvas
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();

    // Wait a tick for assets to load, then capture
    setTimeout(async () => {
      try {
        const body = doc.body as HTMLBodyElement;
        const canvas = await html2canvas(body, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let y = 0;
        if (imgHeight < pageHeight) {
          pdf.addImage(imgData, 'PNG', 0, y, imgWidth, imgHeight);
        } else {
          let heightLeft = imgHeight;
          let position = 0;
          while (heightLeft > 0) {
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            if (heightLeft > 0) {
              pdf.addPage();
              position = position - pageHeight;
            }
          }
        }

        pdf.save(`ShareWheelz_Receipt_${bookingId}.pdf`);
      } finally {
        document.body.removeChild(iframe);
      }
    }, 300);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleEmailReceipt = () => {
    // In a real implementation, this would send an email
    alert('Receipt has been sent to your email address!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4" ref={receiptRef}>
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
                  onClick={handleDownloadPdf}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  onClick={handlePrintReceipt}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Print / Save as PDF
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












