import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "../lib/queryClient";

interface FleetCar {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: "available" | "rented" | "maintenance" | "inactive";
  location: string;
  pricePerDay: number;
  images: string[];
  totalBookings: number;
  totalEarnings: number;
  utilizationRate: number;
  rating: number;
  lastBooking?: string;
  nextMaintenance?: string;
}

interface FleetStats {
  totalCars: number;
  activeCars: number;
  totalEarnings: number;
  averageUtilization: number;
  topPerformer: FleetCar;
}

export default function Fleet() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [filter, setFilter] = useState<"all" | FleetCar["status"]>("all");
  const [sortBy, setSortBy] = useState<"earnings" | "utilization" | "bookings" | "rating">("earnings");

  const { data: fleetStats } = useQuery<FleetStats>({
    queryKey: ["/api/fleet/stats"],
  });

  const { data: cars = [], isLoading } = useQuery<FleetCar[]>({
    queryKey: ["/api/fleet/cars"],
  });

  const updateCarStatusMutation = useMutation({
    mutationFn: async ({ carId, status }: { carId: string; status: FleetCar["status"] }) => {
      await apiRequest("PATCH", `/api/fleet/cars/${carId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fleet/cars"] });
      queryClient.invalidateQueries({ queryKey: ["/api/fleet/stats"] });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ carIds, action }: { carIds: string[]; action: string }) => {
      await apiRequest("POST", "/api/fleet/bulk-update", { carIds, action });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fleet/cars"] });
      setSelectedCars([]);
    },
  });

  const [selectedCars, setSelectedCars] = useState<string[]>([]);

  const filteredCars = cars.filter(car => filter === "all" || car.status === filter);
  
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case "earnings": return b.totalEarnings - a.totalEarnings;
      case "utilization": return b.utilizationRate - a.utilizationRate;
      case "bookings": return b.totalBookings - a.totalBookings;
      case "rating": return b.rating - a.rating;
      default: return 0;
    }
  });

  const handleSelectCar = (carId: string) => {
    setSelectedCars(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCars(selectedCars.length === sortedCars.length ? [] : sortedCars.map(car => car.id));
  };

  const getStatusColor = (status: FleetCar["status"]) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "rented": return "bg-blue-100 text-blue-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

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
            <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
            <p className="mt-2 text-gray-600">Manage your entire car fleet from one dashboard</p>
          </div>
          <Link href="/add-car">
            <a className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Add New Car
            </a>
          </Link>
        </div>

        {/* Fleet Stats */}
        {fleetStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">🚗</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Cars</dt>
                      <dd className="text-lg font-medium text-gray-900">{fleetStats.totalCars}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Cars</dt>
                      <dd className="text-lg font-medium text-gray-900">{fleetStats.activeCars}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                      <dd className="text-lg font-medium text-gray-900">{formatCurrency(fleetStats.totalEarnings)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">📊</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg Utilization</dt>
                      <dd className="text-lg font-medium text-gray-900">{fleetStats.averageUtilization}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Cars</option>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="earnings">Highest Earnings</option>
                  <option value="utilization">Best Utilization</option>
                  <option value="bookings">Most Bookings</option>
                  <option value="rating">Highest Rated</option>
                </select>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 rounded-md ${view === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setView("table")}
                    className={`p-2 rounded-md ${view === "table" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {selectedCars.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedCars.length} selected</span>
                  <button
                    onClick={() => bulkUpdateMutation.mutate({ carIds: selectedCars, action: "activate" })}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => bulkUpdateMutation.mutate({ carIds: selectedCars, action: "deactivate" })}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Deactivate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cars Display */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCars.map((car) => (
              <div key={car.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedCars.includes(car.id)}
                    onChange={() => handleSelectCar(car.id)}
                    className="absolute top-2 left-2 h-4 w-4 text-blue-600 z-10"
                  />
                  <img
                    src={car.images[0] || "/placeholder-car.jpg"}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-48 object-cover"
                  />
                  <span className={`absolute top-2 right-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(car.status)}`}>
                    {car.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(car.pricePerDay)}/day</p>
                      <p className="text-xs text-gray-500">⭐ {car.rating.toFixed(1)}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{car.location} • {car.licensePlate}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <p>Bookings: {car.totalBookings}</p>
                      <p>Earnings: {formatCurrency(car.totalEarnings)}</p>
                    </div>
                    <div>
                      <p>Utilization: {car.utilizationRate}%</p>
                      {car.lastBooking && (
                        <p>Last: {new Date(car.lastBooking).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/edit-car/${car.id}`}>
                      <a className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium text-center">
                        Edit
                      </a>
                    </Link>
                    <select
                      value={car.status}
                      onChange={(e) => updateCarStatusMutation.mutate({ 
                        carId: car.id, 
                        status: e.target.value as FleetCar["status"] 
                      })}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCars.length === sortedCars.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earnings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCars.map((car) => (
                  <tr key={car.id}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCars.includes(car.id)}
                        onChange={() => handleSelectCar(car.id)}
                        className="h-4 w-4 text-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={car.images[0] || "/placeholder-car.jpg"}
                          alt=""
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {car.year} {car.make} {car.model}
                          </div>
                          <div className="text-sm text-gray-500">{car.licensePlate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(car.status)}`}>
                        {car.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(car.totalEarnings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {car.utilizationRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {car.totalBookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/edit-car/${car.id}`}>
                        <a className="text-blue-600 hover:text-blue-900 mr-4">Edit</a>
                      </Link>
                      <Link href={`/car/${car.id}`}>
                        <a className="text-green-600 hover:text-green-900">View</a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}