import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Grid, List } from 'lucide-react';
import styled from 'styled-components';
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

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  width: 50%;
  height: 100%;
`;

const RightPanel = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
`;

const Header = styled.div`
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

const ToggleContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.$active ? '#2563eb' : '#d1d5db'};
  background-color: ${props => props.$active ? '#2563eb' : 'white'};
  color: ${props => props.$active ? 'white' : 'black'};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.$active ? '#1d4ed8' : '#f3f4f6'};
  }
`;

const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div<{ $listMode: boolean }>`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  display: ${props => props.$listMode ? 'flex' : 'block'};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.img<{ $listMode: boolean }>`
  width: ${props => props.$listMode ? '200px' : '100%'};
  height: 180px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 16px;
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const CardCity = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
`;

const CardPrice = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #2563eb;
  margin: 0 0 12px 0;
`;

const CardButton = styled.button`
  width: 100%;
  padding: 8px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #6b7280;
`;

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
    <Container>
      {/* Left Panel - Map (40%) */}
      <LeftPanel>
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
      </LeftPanel>

      {/* Right Panel - Car List (60%) */}
      <RightPanel>
        <Header>
          <Title>Available Cars ({cars.length})</Title>
          <ToggleContainer>
            <ToggleButton $active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
              <Grid size={20} />
            </ToggleButton>
            <ToggleButton $active={viewMode === 'list'} onClick={() => setViewMode('list')}>
              <List size={20} />
            </ToggleButton>
          </ToggleContainer>
        </Header>

        <ScrollContainer>
          {loading ? (
            <Loading>Loading cars...</Loading>
          ) : viewMode === 'grid' ? (
            <GridContainer>
              {cars.map(car => (
                <Card key={car.id} $listMode={false}>
                  <CardImage src={car.image} alt={car.name} $listMode={false} />
                  <CardContent>
                    <CardTitle>{car.name}</CardTitle>
                    {car.city && <CardCity>{car.city}</CardCity>}
                    <CardPrice>£{car.price}/day</CardPrice>
                    <CardButton>View Details</CardButton>
                  </CardContent>
                </Card>
              ))}
            </GridContainer>
          ) : (
            <ListContainer>
              {cars.map(car => (
                <Card key={car.id} $listMode={true}>
                  <CardImage src={car.image} alt={car.name} $listMode={true} />
                  <CardContent>
                    <CardTitle>{car.name}</CardTitle>
                    {car.city && <CardCity>{car.city}</CardCity>}
                    <CardPrice>£{car.price}/day</CardPrice>
                    <CardButton>View Details</CardButton>
                  </CardContent>
                </Card>
              ))}
            </ListContainer>
          )}
        </ScrollContainer>
      </RightPanel>
    </Container>
  );
}
