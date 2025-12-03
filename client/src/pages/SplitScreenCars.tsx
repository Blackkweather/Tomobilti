import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { Grid, List, Zap } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Car {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: number;
  image: string;
  instantBook?: boolean;
  deliveryAvailable?: boolean;
}

type ViewMode = 'grid' | 'list';

function MapEvents({ onBoundsChange }: { onBoundsChange: (bounds: L.LatLngBounds) => void }) {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    },
  });
  return null;
}

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

export default function SplitScreenCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(true);

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
          instantBook: car.instantBook || false,
          deliveryAvailable: car.deliveryAvailable || false
        }));
        setCars(transformedCars);
        setFilteredCars(transformedCars);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch cars:', err);
        setLoading(false);
      });
  }, []);

  const handleBoundsChange = (bounds: L.LatLngBounds) => {
    const filtered = cars.filter(car =>
      car.lat <= bounds.getNorth() &&
      car.lat >= bounds.getSouth() &&
      car.lng <= bounds.getEast() &&
      car.lng >= bounds.getWest()
    );
    setFilteredCars(filtered);
  };

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
  };

  const memoizedMarkers = useMemo(() => (
    filteredCars.map(car => (
      <CircleMarker
        key={car.id}
        center={[car.lat, car.lng]}
        radius={5}
        fillColor="#ef4444"
        fillOpacity={1}
        color="#dc2626"
        weight={1}
        eventHandlers={{
          click: () => handleCarClick(car)
        }}
      >
        <Popup>
          <div style={{ minWidth: '150px' }}>
            <img src={car.image} alt={car.name} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
            <h3 style={{ fontSize: '14px', margin: '8px 0 4px' }}>{car.name}</h3>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#2563eb' }}>£{car.price}/day</p>
          </div>
        </Popup>
      </CircleMarker>
    ))
  ), [filteredCars]);

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
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
          <MapEvents onBoundsChange={handleBoundsChange} />
          {selectedCar && <MapRecenter lat={selectedCar.lat} lng={selectedCar.lng} />}
          {memoizedMarkers}
        </MapContainer>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.header}>
          <h1 style={styles.title}>Available Cars ({filteredCars.length})</h1>
          <div style={styles.toggleContainer}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                ...styles.toggleButton,
                ...(viewMode === 'grid' ? styles.toggleButtonActive : {})
              }}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                ...styles.toggleButton,
                ...(viewMode === 'list' ? styles.toggleButtonActive : {})
              }}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div style={styles.scrollContainer}>
          {loading ? (
            <div style={styles.loading}>Loading cars...</div>
          ) : (
            <div style={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
              {filteredCars.map(car => (
                <div 
                  key={car.id} 
                  style={{
                    ...(viewMode === 'grid' ? styles.cardGrid : styles.cardList),
                    ...(selectedCar?.id === car.id ? styles.cardSelected : {})
                  }}
                  onClick={() => handleCarClick(car)}
                >
                  <img src={car.image} alt={car.name} style={styles.cardImage} />
                  <div style={styles.cardContent}>
                    {car.instantBook && (
                      <div style={styles.instantBadge}>
                        <Zap size={14} style={{ fill: 'currentColor' }} />
                        <span>Instant Book</span>
                      </div>
                    )}
                    <h3 style={styles.cardTitle}>{car.name}</h3>
                    <p style={styles.cardPrice}>£{car.price}/day</p>
                    {car.deliveryAvailable && (
                      <p style={styles.deliveryBadge}>🚚 Delivery available</p>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/cars/${car.id}`;
                      }}
                      style={styles.cardButton}
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

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden'
  },
  leftPanel: {
    width: '50%',
    height: '100%'
  },
  rightPanel: {
    width: '50%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9fafb'
  },
  header: {
    padding: '20px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0
  },
  toggleContainer: {
    display: 'flex',
    gap: '8px'
  },
  toggleButton: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  toggleButtonActive: {
    backgroundColor: '#2563eb',
    color: 'white',
    borderColor: '#2563eb'
  },
  scrollContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px'
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  cardGrid: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer'
  },
  cardList: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    cursor: 'pointer'
  },
  cardImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover'
  },
  cardContent: {
    padding: '16px'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 8px 0'
  },
  cardPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2563eb',
    margin: '0 0 12px 0'
  },
  cardButton: {
    width: '100%',
    padding: '8px 16px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  cardSelected: {
    border: '2px solid #2563eb',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#6b7280'
  },
  instantBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    backgroundColor: '#9333ea',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '12px',
    marginBottom: '8px'
  },
  deliveryBadge: {
    fontSize: '13px',
    color: '#059669',
    margin: '4px 0 8px 0',
    fontWeight: '500'
  }
};
