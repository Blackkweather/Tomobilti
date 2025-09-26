import { useState, useEffect } from 'react';
import { carApi } from '../lib/api';

export default function CarsSimple() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        console.log('Fetching cars...');
        const result = await carApi.searchCars({});
        console.log('Cars result:', result);
        setCars(result.cars || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading cars...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Vehicle
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover amazing cars from trusted owners across the UK. 
              From city cars to luxury vehicles, find your ideal ride.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Available Vehicles
          </h2>
          <p className="text-gray-600">
            {cars.length} vehicles found
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Car Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200">
                {car.images && car.images.length > 0 ? (
                  <img
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <span>No image</span>
                  </div>
                )}
              </div>

              {/* Car Details */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {car.title || `${car.make} ${car.model}`}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {car.city || car.location}
                </p>
                
                {/* Car Specs */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                  <div>{car.fuelType}</div>
                  <div>{car.transmission}</div>
                  <div>{car.seats} seats</div>
                  <div>{car.year}</div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {car.currency} {car.pricePerDay}
                    </div>
                    <div className="text-sm text-gray-600">per day</div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
