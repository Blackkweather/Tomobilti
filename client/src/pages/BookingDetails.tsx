import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

interface BookingDetails {
  id: string;
  carId: string;
  car: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    images: string[];
    pricePerDay: number;
  };
  renter: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  createdAt: string;
  notes?: string;
  pickupLocation: string;
  dropoffLocation: string;
}

export default function BookingDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");

  const { data: booking, isLoading } = useQuery<BookingDetails>({
    queryKey: [`/api/bookings/${id}`],
    enabled: !!id,
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ status, notes }: { status?: string; notes?: string }) => {
      await apiRequest("PATCH", `/api/bookings/${id}`, { status, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/bookings/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/owner"] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleStatusUpdate = (status: string) => {
    updateBookingMutation.mutate({ status });
  };

  const handleNotesUpdate = () => {
    updateBookingMutation.mutate({ notes });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
          <button
            onClick={() => setLocation("/booking-management")}
            className="mt-4 text-blue-600 hover:text-blue-500"
          >
            Back to Booking Management
          </button>
        </div>
      </div>
    );
  }

  const days = calculateDays(booking.startDate, booking.endDate);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => setLocation("/booking-management")}
            className="text-blue-600 hover:text-blue-500 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Booking Management
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Booking Details
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Booking ID: {booking.id}
                </p>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                {booking.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Car Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Car Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <img
                    src={booking.car.images[0] || "/placeholder-car.jpg"}
                    alt={`${booking.car.make} ${booking.car.model}`}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h5 className="font-medium text-gray-900">
                    {booking.car.year} {booking.car.make} {booking.car.model}
                  </h5>
                  <p className="text-sm text-gray-600">
                    License Plate: {booking.car.licensePlate}
                  </p>
                  <p className="text-sm text-gray-600">
                    Rate: ${booking.car.pricePerDay}/day
                  </p>
                </div>
              </div>

              {/* Renter Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Renter Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      {booking.renter.firstName} {booking.renter.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Email: {booking.renter.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {booking.renter.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="border-t border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                      <dd className="text-sm text-gray-900">{formatDate(booking.startDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">End Date</dt>
                      <dd className="text-sm text-gray-900">{formatDate(booking.endDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Duration</dt>
                      <dd className="text-sm text-gray-900">{days} day{days !== 1 ? 's' : ''}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Pickup Location</dt>
                      <dd className="text-sm text-gray-900">{booking.pickupLocation}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Dropoff Location</dt>
                      <dd className="text-sm text-gray-900">{booking.dropoffLocation}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total Price</dt>
                      <dd className="text-lg font-semibold text-green-600">${booking.totalPrice}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="border-t border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Notes</h4>
              <div className="space-y-4">
                {booking.notes && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{booking.notes}</p>
                  </div>
                )}
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this booking..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleNotesUpdate}
                    disabled={!notes.trim() || updateBookingMutation.isPending}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {updateBookingMutation.isPending ? "Saving..." : "Save Notes"}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Actions</h4>
              <div className="flex flex-wrap gap-3">
                {booking.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate("confirmed")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => handleStatusUpdate("cancelled")}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Decline Booking
                    </button>
                  </>
                )}
                {booking.status === "confirmed" && (
                  <button
                    onClick={() => handleStatusUpdate("active")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Start Rental
                  </button>
                )}
                {booking.status === "active" && (
                  <button
                    onClick={() => handleStatusUpdate("completed")}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Complete Rental
                  </button>
                )}
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="border-t border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Booking Timeline</h4>
              <div className="text-sm text-gray-600">
                <p>Created: {formatDateTime(booking.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}