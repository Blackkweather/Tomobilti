import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Grid, List } from 'lucide-react';
// import styled from 'styled-components'; // Removed - using Tailwind CSS instead
import 'leaflet/dist/leaflet.css';

// TypeScript Interface
interface Car {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: number;
  image: string;
  make?: string;
  model?: string;
  city?: string;
}

type ViewMode = 'grid' | 'list';

// Tailwind CSS classes instead of styled-components

export default function SplitScreenCarsStyled() {
  const [cars, setCars] = useState<Car[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(true);

  // Fetch all cars at once on mount
  useEffect(() => {
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        const transformedCars = (data.cars || data).map((car: any) => ({
          id: car.id,
          name: car.title || `${car.make} ${car.model}`,
          lat: parseFloat(car.latitude) || 51.5074,
          lng: parseFloat(car.longitude) || -0.1278,
          price: parseFloat(car.pricePerDay),
          image: car.images?.[0] || '/placeholder.jpg',
          make: car.make,
          model: car.model,
          city: car.city
        }));
        setCars(transformedCars);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch cars:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel - Map (50%) */}
      <div className="w-1/2 h-full">
        <MapContainer
          center={[54.5, -2.0]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          preferCanvas={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {cars.map(car => (
            <CircleMarker
              key={car.id}
              center={[car.lat, car.lng]}
              radius={5}
              fillColor="#ef4444"
              fillOpacity={1}
              color="#dc2626"
              weight={1}
            >
              <Popup>
                <div style={{ minWidth: '150px' }}>
                  <img src={car.image} alt={car.name} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  <h3 style={{ fontSize: '14px', margin: '8px 0 4px' }}>{car.name}</h3>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#2563eb' }}>£{car.price}/day</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Right Panel - Car List (50%) */}
      <div className="w-1/2 h-full flex flex-col bg-gray-50">
        <div className="p-5 bg-white border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold m-0">Available Cars ({cars.length})</h1>
          <div className="flex gap-2">
            <button 
              className={`p-2 px-3 border rounded-md cursor-pointer flex items-center justify-center transition-all ${viewMode === 'grid' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-black hover:bg-gray-50'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button>
            <button 
              className={`p-2 px-3 border rounded-md cursor-pointer flex items-center justify-center transition-all ${viewMode === 'list' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-black hover:bg-gray-50'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="text-center py-10 text-lg text-gray-500">Loading cars...</div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {cars.map(car => (
                <div key={car.id} className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md">
                  <img src={car.image} alt={car.name} className="w-full h-45 object-cover" />
                  <div className="p-4 flex-1">
                    <h3 className="text-base font-semibold mb-2">{car.name}</h3>
                    {car.city && <p className="text-sm text-gray-500 mb-2">{car.city}</p>}
                    <p className="text-lg font-bold text-blue-600 mb-3">£{car.price}/day</p>
                    <button 
                      onClick={() => window.location.href = `/cars/${car.id}`}
                      className="w-full py-2 px-4 bg-blue-600 text-white border-none rounded-md cursor-pointer text-sm font-medium transition-colors hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cars.map(car => (
                <div key={car.id} className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md flex">
                  <img src={car.image} alt={car.name} className="w-48 h-45 object-cover" />
                  <div className="p-4 flex-1">
                    <h3 className="text-base font-semibold mb-2">{car.name}</h3>
                    {car.city && <p className="text-sm text-gray-500 mb-2">{car.city}</p>}
                    <p className="text-lg font-bold text-blue-600 mb-3">£{car.price}/day</p>
                    <button 
                      onClick={() => window.location.href = `/cars/${car.id}`}
                      className="w-full py-2 px-4 bg-blue-600 text-white border-none rounded-md cursor-pointer text-sm font-medium transition-colors hover:bg-blue-700"
                    >
                      View Details
                    </button>
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
