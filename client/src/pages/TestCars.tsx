import { useState, useEffect } from 'react';
import { carApi } from '../lib/api';

export default function TestCars() {
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
    return <div className="p-8">Loading cars...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Cars ({cars.length})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((car) => (
          <div key={car.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{car.title}</h3>
            <p className="text-gray-600">{car.make} {car.model}</p>
            <p className="text-blue-600 font-bold">£{car.pricePerDay}/day</p>
            <p className="text-sm text-gray-500">{car.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
