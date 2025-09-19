import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "../lib/queryClient";

interface Booking {
  id: string;
  carId: string;
  car: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    images: string[];
  };
  renter: {
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
}

export default function BookingManagement() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | Booking["status"]>("all");

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings/owner"],
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: Booking["status"] }) => {
      await apiRequest("PATCH", `/api/bookings/${bookingId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/owner"] });
    },
  });

  const filteredBookings = bookings.filter(booking => 
    filter === "all" || booking.status === filter
  );

  const getStatusColor = (status: Booking["status"]) => {
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
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "confirmed", "active", "completed", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as typeof filter)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== "all" && (
                    <span className="ml-2 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {bookings.filter(booking => booking.status === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === "all" ? "No bookings yet." : `No ${filter} bookings.`}
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <li key={booking.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={booking.car.images[0] || "/placeholder-car.jpg"}
                            alt={`${booking.car.make} ${booking.car.model}`}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">
                                {booking.car.year} {booking.car.make} {booking.car.model}
                              </p>
                              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {booking.renter.firstName} {booking.renter.lastName} • {booking.renter.email}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(booking.startDate)} - {formatDate(booking.endDate)} 
                              ({calculateDays(booking.startDate, booking.endDate)} days)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              ${booking.totalPrice}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(booking.createdAt)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {booking.status === "pending" && (
                              <>
                                <button
                                  onClick={() => updateBookingMutation.mutate({ 
                                    bookingId: booking.id, 
                                    status: "confirmed" 
                                  })}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => updateBookingMutation.mutate({ 
                                    bookingId: booking.id, 
                                    status: "cancelled" 
                                  })}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                            {booking.status === "confirmed" && (
                              <button
                                onClick={() => updateBookingMutation.mutate({ 
                                  bookingId: booking.id, 
                                  status: "active" 
                                })}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Start Rental
                              </button>
                            )}
                            {booking.status === "active" && (
                              <button
                                onClick={() => updateBookingMutation.mutate({ 
                                  bookingId: booking.id, 
                                  status: "completed" 
                                })}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Complete
                              </button>
                            )}
                            <Link href={`/booking-details/${booking.id}`}>
                              <a className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                                Details
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}