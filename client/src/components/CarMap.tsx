import React, { useEffect, useRef, Suspense } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Car, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { getCityCoordinates } from '../utils/ukCities';
import { Link } from 'wouter';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: iconRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Car {
  id: string;
  title: string;
  make: string;
  model: string;
  pricePerDay: number | string;
  location: string;
  city: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  images?: string[];
}

interface CarMapProps {
  cars: Car[];
  selectedCity?: string;
  onCarClick?: (carId: string) => void;
  className?: string;
}

// Component to handle map view updates when cars change
function MapUpdater({ cars }: { cars: Car[] }) {
  const map = useMap();

  useEffect(() => {
    if (cars.length === 0) return;

    // Get all valid coordinates
    const validCars = cars.filter(car => {
      const lat = car.latitude ? parseFloat(car.latitude.toString()) : null;
      const lng = car.longitude ? parseFloat(car.longitude.toString()) : null;
      return lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng);
    });

    if (validCars.length === 0) {
      // If no coordinates, try to use city coordinates
      const cityCoords = cars
        .map(car => getCityCoordinates(car.city))
        .filter(Boolean) as Array<{ latitude: number; longitude: number }>;

      if (cityCoords.length > 0) {
        const bounds = L.latLngBounds(
          cityCoords.map(coord => [coord.latitude, coord.longitude] as [number, number])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        // Default to UK center
        map.setView([54.5, -2.0], 6);
      }
      return;
    }

    // Fit bounds to show all cars
    const bounds = L.latLngBounds(
      validCars.map(car => [
        parseFloat(car.latitude!.toString()),
        parseFloat(car.longitude!.toString())
      ] as [number, number])
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [cars, map]);

  return null;
}

export default function CarMap({ cars, selectedCity, onCarClick, className = '' }: CarMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Get coordinates for each car
  const getCarCoordinates = (car: Car): [number, number] | null => {
    // First try to use car's latitude/longitude
    if (car.latitude && car.longitude) {
      const lat = parseFloat(car.latitude.toString());
      const lng = parseFloat(car.longitude.toString());
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    }

    // Fallback to city coordinates
    const cityCoords = getCityCoordinates(car.city);
    if (cityCoords) {
      return [cityCoords.latitude, cityCoords.longitude];
    }

    return null;
  };

  // Filter cars with valid coordinates
  const carsWithCoords = cars
    .map(car => ({
      car,
      coords: getCarCoordinates(car)
    }))
    .filter(({ coords }) => coords !== null) as Array<{ car: Car; coords: [number, number] }>;

  // Default center (UK center)
  const defaultCenter: [number, number] = [54.5, -2.0];
  const defaultZoom = 6;

  if (carsWithCoords.length === 0) {
    return (
      <div className={`w-full h-full bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No location data available</p>
          <p className="text-sm mt-2">Cars need latitude/longitude or city information to display on map</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white ${className}`}>
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      }>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%', minHeight: '400px' }}
          scrollWheelZoom={true}
          className="z-0"
          key={`map-${carsWithCoords.length}`} // Force re-render when cars change
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater cars={cars} />

          {carsWithCoords.map(({ car, coords }) => (
            <Marker
              key={car.id}
              position={coords}
              icon={DefaultIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-start gap-3">
                    {car.images && car.images.length > 0 && (
                      <img
                        src={car.images[0]}
                        alt={car.title}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{car.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {car.make} {car.model}
                      </p>
                      <p className="text-sm font-bold text-blue-600 mb-2">
                        {formatCurrency(car.pricePerDay)}/day
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {car.city}
                      </p>
                      <Link href={`/cars/${car.id}`}>
                        <button
                          onClick={() => onCarClick?.(car.id)}
                          className="w-full mt-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Suspense>
    </div>
  );
}

