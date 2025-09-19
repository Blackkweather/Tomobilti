import { CarSearch } from "../../shared/schema";

const API_BASE = '/api';

// Car API functions
export const carApi = {
  searchCars: async (filters: CarSearch) => {
    const params = new URLSearchParams();
    
    if (filters.location) params.set('location', filters.location);
    if (filters.city) params.set('city', filters.city);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.fuelType?.length) {
      filters.fuelType.forEach(fuel => params.append('fuelType', fuel));
    }
    if (filters.transmission) params.set('transmission', filters.transmission);
    if (filters.seats) params.set('seats', filters.seats);
    if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
    params.set('page', filters.page.toString());
    params.set('limit', filters.limit.toString());

    const response = await fetch(`${API_BASE}/cars?${params}`);
    if (!response.ok) throw new Error('Failed to fetch cars');
    return response.json();
  },

  getCar: async (id: string) => {
    const response = await fetch(`${API_BASE}/cars/${id}`);
    if (!response.ok) throw new Error('Failed to fetch car');
    return response.json();
  },

  createCar: async (carData: any) => {
    const response = await fetch(`${API_BASE}/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    if (!response.ok) throw new Error('Failed to create car');
    return response.json();
  },

  updateCar: async (id: string, updates: any) => {
    const response = await fetch(`${API_BASE}/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update car');
    return response.json();
  },

  deleteCar: async (id: string) => {
    const response = await fetch(`${API_BASE}/cars/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete car');
  }
};

// Booking API functions
export const bookingApi = {
  getRenterBookings: async (renterId: string) => {
    const response = await fetch(`${API_BASE}/bookings/renter/${renterId}`);
    if (!response.ok) throw new Error('Failed to fetch renter bookings');
    return response.json();
  },

  getOwnerBookings: async (ownerId: string) => {
    const response = await fetch(`${API_BASE}/bookings/owner/${ownerId}`);
    if (!response.ok) throw new Error('Failed to fetch owner bookings');
    return response.json();
  },

  createBooking: async (bookingData: any) => {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return response.json();
  },

  updateBooking: async (id: string, updates: any) => {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update booking');
    return response.json();
  },

  cancelBooking: async (id: string) => {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to cancel booking');
    return response.json();
  }
};

// Review API functions
export const reviewApi = {
  getCarReviews: async (carId: string) => {
    const response = await fetch(`${API_BASE}/reviews/car/${carId}`);
    if (!response.ok) throw new Error('Failed to fetch car reviews');
    return response.json();
  },

  createReview: async (reviewData: any) => {
    const response = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) throw new Error('Failed to create review');
    return response.json();
  }
};

// Owner API functions
export const ownerApi = {
  getStats: async (ownerId: string) => {
    const response = await fetch(`${API_BASE}/owners/${ownerId}/stats`);
    if (!response.ok) throw new Error('Failed to fetch owner stats');
    return response.json();
  }
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) throw new Error('API health check failed');
  return response.json();
};