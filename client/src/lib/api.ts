import { CarSearch, loginSchema, registerSchema } from "@shared/schema";
import { z } from 'zod';

const API_BASE = '/api';

// Auth token management
let authToken: string | null = localStorage.getItem('auth_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export const getAuthToken = (): string | null => authToken;

// API request helper with auth and error handling
const apiRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<any> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
  }

  return response.json();
};

// Authentication API
export const authApi = {
  login: async (credentials: z.infer<typeof loginSchema>) => {
    const validatedData = loginSchema.parse(credentials);
    const response = await apiRequest(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(validatedData)
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  register: async (userData: z.infer<typeof registerSchema>) => {
    const validatedData = registerSchema.parse(userData);
    const response = await apiRequest(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(validatedData)
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  logout: async () => {
    setAuthToken(null);
    return { message: 'Déconnexion réussie' };
  },

  getCurrentUser: async () => {
    return apiRequest(`${API_BASE}/auth/me`);
  },

  updateProfile: async (profileData: any) => {
    return apiRequest(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    return apiRequest(`${API_BASE}/auth/password`, {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  },

  deleteAccount: async (password: string) => {
    return apiRequest(`${API_BASE}/auth/account`, {
      method: 'DELETE',
      body: JSON.stringify({ password })
    });
  },

  updatePreferences: async (preferences: any) => {
    return apiRequest(`${API_BASE}/auth/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }
};

// Car API functions
export const carApi = {
  searchCars: async (filters: CarSearch) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.set(key, value.toString());
        }
      }
    });

    return apiRequest(`${API_BASE}/cars?${params}`);
  },

  getCar: async (id: string) => {
    return apiRequest(`${API_BASE}/cars/${id}`);
  },

  createCar: async (carData: any) => {
    return apiRequest(`${API_BASE}/cars`, {
      method: 'POST',
      body: JSON.stringify(carData)
    });
  },

  updateCar: async (id: string, updates: any) => {
    return apiRequest(`${API_BASE}/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  deleteCar: async (id: string) => {
    return apiRequest(`${API_BASE}/cars/${id}`, {
      method: 'DELETE'
    });
  },

  getOwnerCars: async (ownerId: string) => {
    const response = await apiRequest(`${API_BASE}/cars/owner/${ownerId}`);
    // Handle both array response and object with cars property
    return Array.isArray(response) ? response : (response?.cars || []);
  }
};

// Booking API functions
export const bookingApi = {
  getBooking: async (bookingId: string) => {
    return apiRequest(`${API_BASE}/bookings/${bookingId}`);
  },

  getRenterBookings: async (renterId: string) => {
    return apiRequest(`${API_BASE}/bookings/renter/${renterId}`);
  },

  getOwnerBookings: async (ownerId: string) => {
    return apiRequest(`${API_BASE}/bookings/owner/${ownerId}`);
  },

  getCarBookings: async (carId: string) => {
    return apiRequest(`${API_BASE}/bookings/car/${carId}`);
  },

  createBooking: async (bookingData: any) => {
    return apiRequest(`${API_BASE}/bookings`, {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  updateBooking: async (id: string, updates: any) => {
    return apiRequest(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  cancelBooking: async (id: string) => {
    return apiRequest(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE'
    });
  }
};

// Review API functions
export const reviewApi = {
  getCarReviews: async (carId: string) => {
    return apiRequest(`${API_BASE}/reviews/car/${carId}`);
  },

  getUserReviews: async (userId: string) => {
    return apiRequest(`${API_BASE}/reviews/user/${userId}`);
  },

  createReview: async (reviewData: any) => {
    return apiRequest(`${API_BASE}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }
};

// Notification API functions
export const notificationApi = {
  getNotifications: async () => {
    return apiRequest(`${API_BASE}/notifications`);
  },

  markNotificationAsRead: async (notificationId: string) => {
    return apiRequest(`${API_BASE}/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
  },

  markAllNotificationsAsRead: async () => {
    return apiRequest(`${API_BASE}/notifications/mark-all-read`, {
      method: 'PUT'
    });
  }
};

// Payment API functions
export const paymentApi = {
  createPaymentIntent: async (amount: number, currency: string, bookingId: string, customerEmail?: string, customerName?: string, carTitle?: string, mockPayment?: boolean) => {
    return apiRequest(`${API_BASE}/payments/create-intent`, {
      method: 'POST',
      body: JSON.stringify({ 
        amount, 
        currency, 
        bookingId,
        customerEmail,
        customerName,
        carTitle,
        mockPayment
      })
    });
  },

  confirmPayment: async (paymentIntentId: string) => {
    return apiRequest(`${API_BASE}/payments/status/${paymentIntentId}`);
  },

  refundPayment: async (paymentIntentId: string, amount?: number) => {
    return apiRequest(`${API_BASE}/payments/refund`, {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId, amount })
    });
  }
};

// Messaging API functions
export const messagingApi = {
  getConversations: async () => {
    return apiRequest(`${API_BASE}/conversations`);
  },

  getConversationMessages: async (conversationId: string) => {
    return apiRequest(`${API_BASE}/conversations/${conversationId}/messages`);
  },

  createConversation: async (bookingId: string) => {
    return apiRequest(`${API_BASE}/conversations`, {
      method: 'POST',
      body: JSON.stringify({ bookingId })
    });
  },

  sendMessage: async (conversationId: string, content: string, messageType: string = 'text') => {
    return apiRequest(`${API_BASE}/messages`, {
      method: 'POST',
      body: JSON.stringify({ conversationId, content, messageType })
    });
  },

  markMessageAsRead: async (messageId: string) => {
    return apiRequest(`${API_BASE}/messages/${messageId}/read`, {
      method: 'PUT'
    });
  }
};

// Health check
export const healthCheck = async () => {
  return apiRequest(`${API_BASE}/health`);
};
