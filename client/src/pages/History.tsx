import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface BookingHistory {
  id: string;
  carId: string;
  car: {
    make: string;
    model: string;
    year: number;
    images: string[];
    licensePlate: string;
  };
  owner: {
    name: string;
    avatar?: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "completed" | "cancelled" | "active";
  createdAt: string;
  rating?: number;
  review?: string;
}

export default function History() {
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled" | "active">("all");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "price">("recent");

  const { data: bookings = [], isLoading } = useQuery<BookingHistory[]>({
    queryKey: ["/api/bookings/history"],
  });

  const filteredBookings = bookings.filter(booking => 
    filter === "all" || booking.status === filter
  );

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "price":
        return b.totalPrice - a.totalPrice;
      case "recent":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "active": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => `£${amount.toLocaleString()}`;

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      range: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      duration: `${diffDays} day${diffDays !== 1 ? 's' : ''}`
    };
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking History</h1>
            <p className="mt-2 text-gray-600">
              {bookings.length} total booking{bookings.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {bookings.length > 0 && (
            <div className="flex space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Bookings</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="price">Highest Price</option>
              </select>
            </div>
          )}
        </div>

        {sortedBookings.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all" 
                ? "Start by booking your first car rental."
                : `You don't have any ${filter} bookings.`
              }
            </p>
            {filter === "all" && (
              <div className="mt-6">
                <Link href="/cars">
                  <a className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Browse Cars
                  </a>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {sortedBookings.map((booking) => {
              const dateInfo = formatDateRange(booking.startDate, booking.endDate);
              
              return (
                <div key={booking.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <img
                          src={booking.car.images[0] || "/placeholder-car.jpg"}
                          alt={`${booking.car.make} ${booking.car.model}`}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {booking.car.year} {booking.car.make} {booking.car.model}
                            </h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>📅 {dateInfo.range}</span>
                            <span>⏱️ {dateInfo.duration}</span>
                            <span>🚗 {booking.car.licensePlate}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <img
                                src={booking.owner.avatar || "/default-avatar.png"}
                                alt={booking.owner.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="ml-2 text-sm text-gray-600">
                                Hosted by {booking.owner.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(booking.totalPrice)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Booked {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {booking.rating && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-start space-x-4">
                          <div>
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-medium text-gray-900 mr-2">Your Review:</span>
                              <div className="flex items-center">
                                {renderStars(booking.rating)}
                              </div>
                            </div>
                            {booking.review && (
                              <p className="text-sm text-gray-700">{booking.review}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <div className="flex space-x-4">
                        <Link href={`/booking-confirmation/${booking.id}`}>
                          <a className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                            View Details
                          </a>
                        </Link>
                        
                        {booking.status === "completed" && !booking.rating && (
                          <Link href={`/review/${booking.id}`}>
                            <a className="text-green-600 hover:text-green-500 text-sm font-medium">
                              Write Review
                            </a>
                          </Link>
                        )}
                        
                        {booking.status === "completed" && (
                          <Link href={`/car/${booking.carId}`}>
                            <a className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                              Book Again
                            </a>
                          </Link>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Booking ID: {booking.id}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
