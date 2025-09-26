import { useState, useEffect } from 'react';
import { carApi } from '../lib/api';

export default function CarsDebugSimple() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        console.log('🔍 Fetching cars...');
        const result = await carApi.searchCars({});
        console.log('✅ Cars result:', result);
        setCars(result.cars || []);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching cars:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  console.log('🎯 CarsDebugSimple render:', { loading, error, carsCount: cars.length });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading cars...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Cars Debug Simple ({cars.length} cars)</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-lg mb-2">{car.title || `${car.make} ${car.model}`}</h3>
              <p className="text-gray-600 mb-2">{car.city || car.location}</p>
              <p className="text-blue-600 font-bold text-xl">£{car.pricePerDay}/day</p>
              <div className="mt-4 text-sm text-gray-500">
                <p>{car.fuelType} • {car.transmission} • {car.seats} seats • {car.year}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify({ loading, error, carsCount: cars.length }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
