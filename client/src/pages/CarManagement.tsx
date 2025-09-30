import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "../lib/queryClient";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  status: "available" | "rented" | "maintenance";
  images: string[];
  totalBookings: number;
  totalEarnings: number;
}

export default function CarManagement() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "available" | "rented" | "maintenance">("all");

  const { data: cars = [], isLoading } = useQuery<Car[]>({
    queryKey: ["/api/cars/owner"],
  });

  const deleteCarMutation = useMutation({
    mutationFn: async (carId: string) => {
      await apiRequest("DELETE", `/api/cars/${carId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars/owner"] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ carId, status }: { carId: string; status: Car["status"] }) => {
      await apiRequest("PATCH", `/api/cars/${carId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars/owner"] });
    },
  });

  const filteredCars = cars.filter(car => filter === "all" || car.status === filter);

  const handleDeleteCar = (carId: string) => {
    if (confirm("Are you sure you want to delete this car?")) {
      deleteCarMutation.mutate(carId);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">My Cars</h1>
            <Link href="/add-car">
              <a className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Add New Car
              </a>
            </Link>
          </div>

          <div className="mb-6">
            <div className="flex space-x-4">
              {["all", "available", "rented", "maintenance"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as typeof filter)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== "all" && (
                    <span className="ml-2 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {cars.filter(car => car.status === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No cars found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === "all" ? "Get started by adding your first car." : `No cars with ${filter} status.`}
              </p>
              {filter === "all" && (
                <div className="mt-6">
                  <Link href="/add-car">
                    <a className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      Add Car
                    </a>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <div key={car.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={car.images[0] || "/placeholder-car.jpg"}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {car.year} {car.make} {car.model}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        car.status === "available" ? "bg-green-100 text-green-800" :
                        car.status === "rented" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {car.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{car.location}</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>£{car.pricePerDay}/day</span>
                      <span>{car.totalBookings} bookings</span>
                    </div>
                    <div className="text-sm font-medium text-green-600 mb-4">
                      Total Earnings: £{car.totalEarnings}
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/edit-car/${car.id}`}>
                        <a className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium text-center">
                          Edit
                        </a>
                      </Link>
                      <select
                        value={car.status}
                        onChange={(e) => updateStatusMutation.mutate({ 
                          carId: car.id, 
                          status: e.target.value as Car["status"] 
                        })}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                      <button
                        onClick={() => handleDeleteCar(car.id)}
                        className="px-3 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-md text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
