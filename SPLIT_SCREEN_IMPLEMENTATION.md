# Split-Screen Car Rental View - Implementation Guide

## Overview
A high-performance split-screen layout for ShareWheelz car rental platform with Canvas-optimized Leaflet map and responsive car list.

## Files Created

### 1. **SplitScreenCars.tsx** (Inline Styles)
- Location: `client/src/pages/SplitScreenCars.tsx`
- Uses inline React styles
- Lightweight, no dependencies

### 2. **SplitScreenCarsStyled.tsx** (Styled Components)
- Location: `client/src/pages/SplitScreenCarsStyled.tsx`
- Uses styled-components library
- Better type safety and hover effects

### 3. **Express Route**
- Location: `server/routes/cars-split.ts`
- Endpoint: `GET /api/cars`
- Returns all cars without pagination

## TypeScript Interface

```typescript
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
```

## Layout Specifications

### Container (100vh)
```css
display: flex;
height: 100vh;
overflow: hidden;
```

### Left Panel (40%)
- Contains Leaflet map
- Full height
- Canvas rendering enabled

### Right Panel (60%)
- Scrollable car list
- Header with view toggle
- Grid or List mode

## Map Configuration (Performance Critical)

### MapContainer Props
```tsx
<MapContainer
  center={[54.5, -2.0]}
  zoom={6}
  style={{ height: '100%', width: '100%' }}
  preferCanvas={true}  // CRITICAL for performance
>
```

### CircleMarker (Red Dots)
```tsx
<CircleMarker
  center={[car.lat, car.lng]}
  radius={5}
  fillColor="#ef4444"
  fillOpacity={1}
  color="#dc2626"
  weight={1}
/>
```

## View Modes

### Grid Mode
```css
display: grid;
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
gap: 20px;
```

### List Mode
```css
display: flex;
flex-direction: column;
gap: 16px;
```

## Data Fetching

### React Component
```typescript
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
    });
}, []);
```

### Express Route
```typescript
router.get('/cars', async (req, res) => {
  const cars = await storage.getAllCars();
  res.json({ cars, total: cars.length });
});
```

## Integration Steps

### 1. Add Route to App
```typescript
// In App.tsx or routes file
import SplitScreenCars from './pages/SplitScreenCars';

<Route path="/cars/split" component={SplitScreenCars} />
```

### 2. Register Express Route
```typescript
// In server/index.ts
import carsSplitRoutes from './routes/cars-split';
app.use('/api', carsSplitRoutes);
```

### 3. Install Dependencies (if using styled-components)
```bash
npm install styled-components
npm install -D @types/styled-components
```

## Performance Features

✅ **Canvas Rendering** - `preferCanvas={true}` prevents DOM lag
✅ **CircleMarkers** - Lightweight dots instead of image markers
✅ **Single Fetch** - All data loaded at once (no pagination)
✅ **Optimized Re-renders** - Minimal state updates

## Customization Options

### Change Map Center
```typescript
center={[51.5074, -0.1278]} // London
```

### Change Marker Color
```typescript
fillColor="#3b82f6" // Blue
fillColor="#10b981" // Green
```

### Adjust Panel Widths
```css
leftPanel: { width: '30%' }
rightPanel: { width: '70%' }
```

### Add Filters
```typescript
const [filters, setFilters] = useState({ city: '', maxPrice: 0 });
const filteredCars = cars.filter(car => 
  (!filters.city || car.city === filters.city) &&
  (!filters.maxPrice || car.price <= filters.maxPrice)
);
```

## Testing

1. Navigate to `/cars/split`
2. Verify map loads with red dots
3. Click dots to see popups
4. Toggle between Grid/List views
5. Scroll car list independently
6. Check performance with 100+ cars

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Responsive (may need media queries)

## Mobile Optimization (Optional)

```css
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  .leftPanel, .rightPanel {
    width: 100%;
    height: 50vh;
  }
}
```

## Next Steps

1. Add car detail modal on card click
2. Implement map marker clustering for 1000+ cars
3. Add real-time availability updates
4. Sync map bounds with visible cars
5. Add booking flow integration
