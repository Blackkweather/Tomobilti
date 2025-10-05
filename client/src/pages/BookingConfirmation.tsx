import { useRoute } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { bookingApi } from "../lib/api";
import BookingReceipt from "../components/BookingReceipt";
import LoadingSpinner from "../components/LoadingSpinner";

export default function BookingConfirmation() {
  const [match, params] = useRoute<{ bookingId: string }>("/booking-confirmation/:bookingId");
  const bookingId: string | undefined = match ? params?.bookingId : undefined;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError('Booking ID is missing.');
        setIsLoading(false);
        return;
      }
      
      try {
        const fetchedBooking = await bookingApi.getBooking(bookingId);
        setBooking(fetchedBooking);
      } catch (err) {
        console.error("Failed to fetch booking details:", err);
        setError("Failed to load booking details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No booking found.</p>
        </div>
      </div>
    );
  }

  // Transform booking data to match BookingReceipt component interface
  const receiptData = {
    bookingId: bookingId || 'unknown',
    booking: {
      id: booking.id,
      car: {
        make: booking.car?.make || 'BMW',
        model: booking.car?.model || '3 Series',
        year: booking.car?.year || 2022,
        licensePlate: booking.car?.plateNumber || 'BM22 ABC',
        images: booking.car?.images || []
      },
      owner: {
        name: booking.owner?.name || 'John Smith',
        email: booking.owner?.email || 'john.smith@example.com',
        phone: booking.owner?.phone || '+44 7123 456789'
      },
      renter: {
        name: user ? `${user.firstName} ${user.lastName}` : 'Sarah Johnson',
        email: user?.email || 'sarah.johnson@example.com',
        phone: user?.phone || '+44 7987 654321'
      },
      dates: {
        startDate: booking.startDate || '2025-01-15',
        endDate: booking.endDate || '2025-01-17',
        startTime: '10:00',
        endTime: '18:00'
      },
      pricing: {
        dailyRate: Number(booking.car?.pricePerDay) || 85,
        totalDays: 2,
        subtotal: (Number(booking.car?.pricePerDay) || 85) * 2,
        serviceFee: Number(booking.serviceFee) || 17,
        insurance: Number(booking.insurance) || 15,
        total: Number(booking.totalAmount) || 202
      },
      payment: {
        method: 'Credit Card',
        transactionId: `TXN-${Date.now()}`,
        status: 'Completed',
        paidAt: new Date().toISOString()
      }
    }
  };

  return <BookingReceipt {...receiptData} />;
}