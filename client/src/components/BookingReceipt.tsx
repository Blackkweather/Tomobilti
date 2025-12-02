import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Download, 
  Mail, 
  Calendar, 
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
    // Build professional branded PDF template
    const logoUrl = `${window.location.origin}/assets/MAIN LOGO.png`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Booking Receipt - ${bookingId}</title>
          <style>
            @page { 
              size: A4; 
              margin: 15mm;
            }
            * { 
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #1f2937;
              background: #ffffff;
              line-height: 1.6;
            }
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              background: #ffffff;
            }
            .receipt-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo-section {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .logo-section img {
              height: 60px;
              width: auto;
              object-fit: contain;
            }
            .brand-info {
              display: flex;
              flex-direction: column;
            }
            .brand-name {
              font-size: 28px;
              font-weight: 800;
              color: #2563eb;
              letter-spacing: -0.5px;
              margin-bottom: 4px;
            }
            .brand-tagline {
              font-size: 12px;
              color: #6b7280;
              font-weight: 500;
            }
            .receipt-info {
              text-align: right;
            }
            .receipt-title {
              font-size: 24px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 8px;
            }
            .receipt-number {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 4px;
            }
            .receipt-date {
              font-size: 12px;
              color: #9ca3af;
              margin-bottom: 8px;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 14px;
              background: #d1fae5;
              color: #065f46;
              border: 1px solid #a7f3d0;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
            }
            .content-section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 18px;
              font-weight: 700;
              color: #2563eb;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e5e7eb;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 25px;
            }
            .info-card {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 18px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-size: 13px;
              color: #6b7280;
              font-weight: 500;
            }
            .info-value {
              font-size: 13px;
              color: #111827;
              font-weight: 600;
              text-align: right;
            }
            .pricing-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              background: #ffffff;
            }
            .pricing-table thead {
              background: #f3f4f6;
            }
            .pricing-table th {
              padding: 12px 16px;
              text-align: left;
              font-size: 13px;
              font-weight: 700;
              color: #374151;
              border-bottom: 2px solid #e5e7eb;
            }
            .pricing-table td {
              padding: 12px 16px;
              font-size: 13px;
              color: #111827;
              border-bottom: 1px solid #e5e7eb;
            }
            .pricing-table tbody tr:hover {
              background: #f9fafb;
            }
            .pricing-table tfoot {
              background: #f3f4f6;
            }
            .pricing-table tfoot td {
              font-size: 16px;
              font-weight: 800;
              color: #2563eb;
              border-top: 3px solid #2563eb;
              padding: 15px 16px;
            }
            .pricing-table .amount {
              text-align: right;
              font-weight: 600;
            }
            .pricing-table tfoot .amount {
              font-size: 18px;
            }
            .footer-section {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
            }
            .footer-text {
              font-size: 11px;
              color: #6b7280;
              line-height: 1.8;
            }
            .footer-text strong {
              color: #111827;
            }
            .notes-box {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 12px 16px;
              border-radius: 4px;
              font-size: 12px;
              color: #92400e;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="receipt-header">
              <div class="logo-section">
                <img src="${logoUrl}" alt="ShareWheelz Logo" onerror="this.style.display='none';" />
                <div class="brand-info">
                  <div class="brand-name">ShareWheelz</div>
                  <div class="brand-tagline">Premium Car Sharing Platform</div>
                </div>
              </div>
              <div class="receipt-info">
                <div class="receipt-title">Booking Receipt</div>
                <div class="receipt-number">Receipt #${bookingId}</div>
                <div class="receipt-date">${new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                <div class="status-badge" style="margin-top: 8px;">✓ Confirmed</div>
              </div>
            </div>

            <div class="content-section">
              <div class="section-title">Vehicle & Booking Details</div>
              <div class="info-grid">
                <div class="info-card">
                  <div class="info-row">
                    <span class="info-label">Vehicle</span>
                    <span class="info-value">${booking.car.year} ${booking.car.make} ${booking.car.model}</span>
              </div>
                  <div class="info-row">
                    <span class="info-label">License Plate</span>
                    <span class="info-value">${booking.car.licensePlate}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Pickup Date</span>
                    <span class="info-value">${formatDate(booking.dates.startDate)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Pickup Time</span>
                    <span class="info-value">${formatTime(booking.dates.startTime)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Return Date</span>
                    <span class="info-value">${formatDate(booking.dates.endDate)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Return Time</span>
                    <span class="info-value">${formatTime(booking.dates.endTime)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Duration</span>
                    <span class="info-value">${booking.pricing.totalDays} ${booking.pricing.totalDays === 1 ? 'day' : 'days'}</span>
                  </div>
                </div>
                <div class="info-card">
                  <div class="info-row">
                    <span class="info-label">Car Owner</span>
                    <span class="info-value">${booking.owner.name}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Owner Phone</span>
                    <span class="info-value">${booking.owner.phone}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Owner Email</span>
                    <span class="info-value" style="font-size: 11px;">${booking.owner.email}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Renter</span>
                    <span class="info-value">${booking.renter.name}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Renter Phone</span>
                    <span class="info-value">${booking.renter.phone}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Renter Email</span>
                    <span class="info-value" style="font-size: 11px;">${booking.renter.email}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Support</span>
                    <span class="info-value">support@sharewheelz.uk</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="content-section">
              <div class="section-title">Payment Breakdown</div>
              <table class="pricing-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th class="amount">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Daily Rate (${booking.car.make} ${booking.car.model}) × ${booking.pricing.totalDays} ${booking.pricing.totalDays === 1 ? 'day' : 'days'}</td>
                    <td class="amount">£${booking.pricing.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Service Fee (10%)</td>
                    <td class="amount">£${booking.pricing.serviceFee.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Insurance Coverage (5%)</td>
                    <td class="amount">£${booking.pricing.insurance.toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>Total Amount Paid</strong></td>
                    <td class="amount"><strong>£${booking.pricing.total.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="content-section">
              <div class="section-title">Payment Information</div>
              <div class="info-grid">
                <div class="info-card">
                  <div class="info-row">
                    <span class="info-label">Payment Method</span>
                    <span class="info-value">${booking.payment.method}</span>
              </div>
                  <div class="info-row">
                    <span class="info-label">Transaction ID</span>
                    <span class="info-value" style="font-size: 11px;">${booking.payment.transactionId}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Payment Status</span>
                    <span class="info-value" style="color: #059669;">${booking.payment.status}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Paid At</span>
                    <span class="info-value">${new Date(booking.payment.paidAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div class="info-card">
                  <div class="notes-box">
                    <strong>Important Notes:</strong><br>
                    • Please present this receipt upon vehicle pickup<br>
                    • Ensure your driving license and ID match the booking details<br>
                    • Contact support for any changes or cancellations<br>
                    • Free cancellation available up to 24 hours before pickup
                  </div>
                </div>
              </div>
            </div>

            <div class="footer-section">
              <div class="footer-text">
                <strong>ShareWheelz</strong> • The UK's Premier Car Sharing Platform<br>
                Website: <strong>sharewheelz.uk</strong> • Email: support@sharewheelz.uk • Phone: +44 20 1234 5678<br>
                Company Registration No: 00000000 • VAT No: GB000000000<br>
                Thank you for choosing ShareWheelz. We hope you enjoy your journey!
              </div>
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
    // Build the same professional template for printing
    const logoUrl = `${window.location.origin}/assets/MAIN LOGO.png`;
    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Booking Receipt - ${bookingId}</title>
          <style>
            @page { 
              size: A4; 
              margin: 15mm;
            }
            * { 
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #1f2937;
              background: #ffffff;
              line-height: 1.6;
            }
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              background: #ffffff;
            }
            .receipt-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo-section {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .logo-section img {
              height: 60px;
              width: auto;
              object-fit: contain;
            }
            .brand-info {
              display: flex;
              flex-direction: column;
            }
            .brand-name {
              font-size: 28px;
              font-weight: 800;
              color: #2563eb;
              letter-spacing: -0.5px;
              margin-bottom: 4px;
            }
            .brand-tagline {
              font-size: 12px;
              color: #6b7280;
              font-weight: 500;
            }
            .receipt-info {
              text-align: right;
            }
            .receipt-title {
              font-size: 24px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 8px;
            }
            .receipt-number {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 4px;
            }
            .receipt-date {
              font-size: 12px;
              color: #9ca3af;
              margin-bottom: 8px;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 14px;
              background: #d1fae5;
              color: #065f46;
              border: 1px solid #a7f3d0;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
            }
            .content-section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 18px;
              font-weight: 700;
              color: #2563eb;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e5e7eb;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 25px;
            }
            .info-card {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 18px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-size: 13px;
              color: #6b7280;
              font-weight: 500;
            }
            .info-value {
              font-size: 13px;
              color: #111827;
              font-weight: 600;
              text-align: right;
            }
            .pricing-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              background: #ffffff;
            }
            .pricing-table thead {
              background: #f3f4f6;
            }
            .pricing-table th {
              padding: 12px 16px;
              text-align: left;
              font-size: 13px;
              font-weight: 700;
              color: #374151;
              border-bottom: 2px solid #e5e7eb;
            }
            .pricing-table td {
              padding: 12px 16px;
              font-size: 13px;
              color: #111827;
              border-bottom: 1px solid #e5e7eb;
            }
            .pricing-table tfoot {
              background: #f3f4f6;
            }
            .pricing-table tfoot td {
              font-size: 16px;
              font-weight: 800;
              color: #2563eb;
              border-top: 3px solid #2563eb;
              padding: 15px 16px;
            }
            .pricing-table .amount {
              text-align: right;
              font-weight: 600;
            }
            .pricing-table tfoot .amount {
              font-size: 18px;
            }
            .footer-section {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
            }
            .footer-text {
              font-size: 11px;
              color: #6b7280;
              line-height: 1.8;
            }
            .footer-text strong {
              color: #111827;
            }
            .notes-box {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 12px 16px;
              border-radius: 4px;
              font-size: 12px;
              color: #92400e;
              line-height: 1.6;
            }
            @media print {
              body {
                padding: 0;
              }
              .receipt-container {
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="receipt-header">
              <div class="logo-section">
                <img src="${logoUrl}" alt="ShareWheelz Logo" onerror="this.style.display='none';" />
                <div class="brand-info">
                  <div class="brand-name">ShareWheelz</div>
                  <div class="brand-tagline">Premium Car Sharing Platform</div>
                </div>
              </div>
              <div class="receipt-info">
                <div class="receipt-title">Booking Receipt</div>
                <div class="receipt-number">Receipt #${bookingId}</div>
                <div class="receipt-date">${new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                <div class="status-badge" style="margin-top: 8px;">✓ Confirmed</div>
              </div>
            </div>

            <div class="content-section">
              <div class="section-title">Vehicle & Booking Details</div>
              <div class="info-grid">
                <div class="info-card">
                  <div class="info-row">
                    <span class="info-label">Vehicle</span>
                    <span class="info-value">${booking.car.year} ${booking.car.make} ${booking.car.model}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">License Plate</span>
                    <span class="info-value">${booking.car.licensePlate}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Pickup Date</span>
                    <span class="info-value">${formatDate(booking.dates.startDate)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Pickup Time</span>
                    <span class="info-value">${formatTime(booking.dates.startTime)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Return Date</span>
                    <span class="info-value">${formatDate(booking.dates.endDate)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Return Time</span>
                    <span class="info-value">${formatTime(booking.dates.endTime)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Duration</span>
                    <span class="info-value">${booking.pricing.totalDays} ${booking.pricing.totalDays === 1 ? 'day' : 'days'}</span>
                  </div>
                </div>
                <div class="info-card">
                  <div class="info-row">
                    <span class="info-label">Car Owner</span>
                    <span class="info-value">${booking.owner.name}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Owner Phone</span>
                    <span class="info-value">${booking.owner.phone}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Owner Email</span>
                    <span class="info-value" style="font-size: 11px;">${booking.owner.email}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Renter</span>
                    <span class="info-value">${booking.renter.name}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Renter Phone</span>
                    <span class="info-value">${booking.renter.phone}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Renter Email</span>
                    <span class="info-value" style="font-size: 11px;">${booking.renter.email}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Support</span>
                    <span class="info-value">support@sharewheelz.uk</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="content-section">
              <div class="section-title">Payment Breakdown</div>
              <table class="pricing-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th class="amount">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Daily Rate (${booking.car.make} ${booking.car.model}) × ${booking.pricing.totalDays} ${booking.pricing.totalDays === 1 ? 'day' : 'days'}</td>
                    <td class="amount">£${booking.pricing.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Service Fee (10%)</td>
                    <td class="amount">£${booking.pricing.serviceFee.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Insurance Coverage (5%)</td>
                    <td class="amount">£${booking.pricing.insurance.toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>Total Amount Paid</strong></td>
                    <td class="amount"><strong>£${booking.pricing.total.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="content-section">
              <div class="section-title">Payment Information</div>
              <div class="info-grid">
                <div class="info-card">
                  <div class="info-row">
                    <span class="info-label">Payment Method</span>
                    <span class="info-value">${booking.payment.method}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Transaction ID</span>
                    <span class="info-value" style="font-size: 11px;">${booking.payment.transactionId}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Payment Status</span>
                    <span class="info-value" style="color: #059669;">${booking.payment.status}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Paid At</span>
                    <span class="info-value">${new Date(booking.payment.paidAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div class="info-card">
                  <div class="notes-box">
                    <strong>Important Notes:</strong><br>
                    • Please present this receipt upon vehicle pickup<br>
                    • Ensure your driving license and ID match the booking details<br>
                    • Contact support for any changes or cancellations<br>
                    • Free cancellation available up to 24 hours before pickup
                  </div>
                </div>
              </div>
            </div>

            <div class="footer-section">
              <div class="footer-text">
                <strong>ShareWheelz</strong> • The UK's Premier Car Sharing Platform<br>
                Website: <strong>sharewheelz.uk</strong> • Email: support@sharewheelz.uk • Phone: +44 20 1234 5678<br>
                Company Registration No: 00000000 • VAT No: GB000000000<br>
                Thank you for choosing ShareWheelz. We hope you enjoy your journey!
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Open a new window with the receipt and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printHtml);
      printWindow.document.close();
      // Wait for images to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    }
  };

  const handleEmailReceipt = () => {
    // In a real implementation, this would send an email
    alert('Receipt has been sent to your email address!');
  };

  const handlePreviewReceipt = () => {
    const logoUrl = `${window.location.origin}/assets/MAIN LOGO.png`;
    const previewHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Booking Receipt - ${bookingId}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 20px; color: #1f2937; background: #ffffff; }
            .receipt-container { max-width: 800px; margin: 0 auto; }
            .receipt-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .logo-section { display: flex; align-items: center; gap: 15px; }
            .logo-section img { height: 60px; width: auto; object-fit: contain; }
            .brand-name { font-size: 28px; font-weight: 800; color: #2563eb; letter-spacing: -0.5px; margin-bottom: 4px; }
            .brand-tagline { font-size: 12px; color: #6b7280; font-weight: 500; }
            .receipt-info { text-align: right; }
            .receipt-title { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px; }
            .status-badge { display: inline-block; padding: 6px 14px; background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .section-title { font-size: 18px; font-weight: 700; color: #2563eb; margin: 25px 0 15px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .info-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .info-row:last-child { border-bottom: none; }
            .info-label { font-size: 13px; color: #6b7280; font-weight: 500; }
            .info-value { font-size: 13px; color: #111827; font-weight: 600; text-align: right; }
            .pricing-table { width: 100%; border-collapse: collapse; margin-top: 10px; background: #ffffff; }
            .pricing-table th { padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 700; color: #374151; border-bottom: 2px solid #e5e7eb; }
            .pricing-table td { padding: 12px 16px; font-size: 13px; color: #111827; border-bottom: 1px solid #e5e7eb; }
            .pricing-table tfoot td { font-size: 16px; font-weight: 800; color: #2563eb; border-top: 3px solid #2563eb; padding: 15px 16px; }
            .footer-section { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; }
            .footer-text { font-size: 11px; color: #6b7280; line-height: 1.8; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="receipt-header">
              <div class="logo-section">
                <img src="${logoUrl}" alt="ShareWheelz Logo" onerror="this.style.display='none';" />
                <div>
                  <div class="brand-name">ShareWheelz</div>
                  <div class="brand-tagline">Premium Car Sharing Platform</div>
                </div>
              </div>
              <div class="receipt-info">
                <div class="receipt-title">Booking Receipt</div>
                <div>Receipt #${bookingId}</div>
                <div>${new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                <div class="status-badge" style="margin-top: 8px;">✓ Confirmed</div>
              </div>
            </div>
            <div class="section-title">Vehicle & Booking Details</div>
            <div class="info-grid">
              <div class="info-card">
                <div class="info-row"><span class="info-label">Vehicle</span><span class="info-value">${booking.car.year} ${booking.car.make} ${booking.car.model}</span></div>
                <div class="info-row"><span class="info-label">License Plate</span><span class="info-value">${booking.car.licensePlate}</span></div>
                <div class="info-row"><span class="info-label">Pickup</span><span class="info-value">${formatDate(booking.dates.startDate)} • ${formatTime(booking.dates.startTime)}</span></div>
                <div class="info-row"><span class="info-label">Return</span><span class="info-value">${formatDate(booking.dates.endDate)} • ${formatTime(booking.dates.endTime)}</span></div>
                <div class="info-row"><span class="info-label">Duration</span><span class="info-value">${booking.pricing.totalDays} ${booking.pricing.totalDays === 1 ? 'day' : 'days'}</span></div>
              </div>
              <div class="info-card">
                <div class="info-row"><span class="info-label">Owner</span><span class="info-value">${booking.owner.name} — ${booking.owner.phone}</span></div>
                <div class="info-row"><span class="info-label">Renter</span><span class="info-value">${booking.renter.name} — ${booking.renter.phone}</span></div>
                <div class="info-row"><span class="info-label">Support</span><span class="info-value">support@sharewheelz.uk</span></div>
              </div>
            </div>
            <div class="section-title">Payment Breakdown</div>
            <table class="pricing-table">
              <thead>
                <tr><th>Description</th><th style="text-align:right;">Amount</th></tr>
              </thead>
              <tbody>
                <tr><td>Daily Rate × ${booking.pricing.totalDays} ${booking.pricing.totalDays === 1 ? 'day' : 'days'}</td><td style="text-align:right;">£${booking.pricing.subtotal.toFixed(2)}</td></tr>
                <tr><td>Service Fee</td><td style="text-align:right;">£${booking.pricing.serviceFee.toFixed(2)}</td></tr>
                <tr><td>Insurance</td><td style="text-align:right;">£${booking.pricing.insurance.toFixed(2)}</td></tr>
              </tbody>
              <tfoot>
                <tr><td>Total</td><td style="text-align:right;">£${booking.pricing.total.toFixed(2)}</td></tr>
              </tfoot>
            </table>
            <div class="section-title">Payment Info</div>
            <div class="info-grid">
              <div class="info-card">
                <div class="info-row"><span class="info-label">Method</span><span class="info-value">${booking.payment.method}</span></div>
                <div class="info-row"><span class="info-label">Transaction ID</span><span class="info-value">${booking.payment.transactionId}</span></div>
                <div class="info-row"><span class="info-label">Status</span><span class="info-value">${booking.payment.status}</span></div>
                <div class="info-row"><span class="info-label">Paid At</span><span class="info-value">${new Date(booking.payment.paidAt).toLocaleString('en-GB')}</span></div>
              </div>
              <div class="info-card"><div style="font-size:12px;color:#92400e;">Please bring ID and license at pickup.</div></div>
            </div>
            <div class="footer-section"><div class="footer-text"><strong>ShareWheelz</strong> • sharewheelz.uk • Company No. 00000000</div></div>
          </div>
        </body>
      </html>
    `;
    const w = window.open('', '_blank');
    if (w) {
      w.document.open();
      w.document.write(previewHtml);
      w.document.close();
    }
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
                  onClick={handlePreviewReceipt}
                  variant="outline"
                  className="w-full"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Preview Receipt
                </Button>
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
          <Link href="/renter-dashboard">
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












