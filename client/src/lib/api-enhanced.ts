import { CarSearch, loginSchema, registerSchema, User, Car, Booking, Review, Notification } from "@shared/schema";
import { z } from 'zod';

const API_BASE = '/api';

// Lazy initialization for SSR compatibility
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

const setAuthToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

// Enhanced error handling
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request options with retry and abort
interface RequestOptions extends RequestInit {
  retry?: number;
  retryDelay?: number;
  timeout?: number;
}

// API request helper with retry logic and AbortController
const apiRequest = async <T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> => {
  const {
    retry = 2,
    retryDelay = 1000,
    timeout = 30000,
    ...fetchOptions
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers as Record<string, string>,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      if (!response.ok) {
        let errorMessage = 'An error occurred';
        let errorDetails = null;

        if (isJson) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || `HTTP error: ${response.status}`;
            errorDetails = errorData.details || errorData;
          } catch {
            errorMessage = `HTTP error: ${response.status} ${response.statusText}`;
          }
        } else {
          const text = await response.text();
          errorMessage = text || `HTTP error: ${response.status} ${response.statusText}`;
        }

        // User-friendly error messages
        if (response.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (response.status === 404) {
          errorMessage = 'The requested resource was not found.';
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please try again later.';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        throw new ApiError(errorMessage, response.status, undefined, errorDetails);
      }

      return isJson ? await response.json() : await response.text();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx) or abort
      if (error instanceof ApiError && error.status && error.status < 500) {
        throw error;
      }
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 0, 'TIMEOUT');
      }

      // Retry on network errors or 5xx
      if (attempt < retry) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }

      // Final attempt failed
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error. Please check your internet connection.', 0, 'NETWORK_ERROR');
      }
      throw new ApiError(error instanceof Error ? error.message : 'An unexpected error occurred', 0, 'UNKNOWN_ERROR');
    }
  }

  throw lastError || new ApiError('Request failed', 0, 'UNKNOWN_ERROR');
};

// Type-safe API responses
interface AuthResponse {
  token: string;
  user: User;
}

interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
}

interface PreferencesData {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  marketingEmails?: boolean;
  language?: string;
  currency?: string;
  timezone?: string;
}

interface CarData {
  ownerId: string;
  title: string;
  description?: string;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  transmission: string;
  seats: number;
  pricePerDay: string;
  currency: string;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  isAvailable?: boolean;
}

interface BookingData {
  carId: string;
  renterId: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  totalAmount: string;
  serviceFee: string;
  insurance: string;
  message?: string;
}

interface ReviewData {
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  carId: string;
  rating: number;
  comment?: string;
}

// Authentication API
export const authApi = {
  login: async (credentials: z.infer<typeof loginSchema>): Promise<AuthResponse> => {
    const validatedData = loginSchema.parse(credentials);
    const response = await apiRequest<AuthResponse>(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  register: async (userData: z.infer<typeof registerSchema>): Promise<AuthResponse> => {
    const validatedData = registerSchema.parse(userData);
    const response = await apiRequest<AuthResponse>(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  logout: async (): Promise<{ message: string }> => {
    setAuthToken(null);
    return { message: 'Logged out successfully' };
  },

  getCurrentUser: async (): Promise<User> => {
    return apiRequest<User>(`${API_BASE}/auth/me`);
  },

  updateProfile: async (profileData: ProfileUpdateData): Promise<User> => {
    return apiRequest<User>(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  changePassword: async (passwordData: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`${API_BASE}/auth/password`, {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  deleteAccount: async (password: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`${API_BASE}/auth/account`, {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  },

  updatePreferences: async (preferences: PreferencesData): Promise<User> => {
    return apiRequest<User>(`${API_BASE}/auth/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },
};

// Car API
export const carApi = {
  searchCars: async (filters: CarSearch): Promise<{ cars: Car[]; total: number }> => {
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

    return apiRequest<{ cars: Car[]; total: number }>(`${API_BASE}/cars?${params}`);
  },

  getCar: async (id: string): Promise<Car> => {
    return apiRequest<Car>(`${API_BASE}/cars/${id}`);
  },

  createCar: async (carData: CarData): Promise<Car> => {
    return apiRequest<Car>(`${API_BASE}/cars`, {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  },

  updateCar: async (id: string, updates: Partial<CarData>): Promise<Car> => {
    return apiRequest<Car>(`${API_BASE}/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteCar: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`${API_BASE}/cars/${id}`, {
      method: 'DELETE',
    });
  },

  getOwnerCars: async (ownerId: string): Promise<Car[]> => {
    const response = await apiRequest<Car[] | { cars: Car[] }>(`${API_BASE}/cars/owner/${ownerId}`);
    return Array.isArray(response) ? response : response.cars || [];
  },
};

// Booking API
export const bookingApi = {
  getBooking: async (bookingId: string): Promise<Booking> => {
    return apiRequest<Booking>(`${API_BASE}/bookings/${bookingId}`);
  },

  getRenterBookings: async (renterId: string): Promise<Booking[]> => {
    return apiRequest<Booking[]>(`${API_BASE}/bookings/renter/${renterId}`);
  },

  getOwnerBookings: async (ownerId: string): Promise<Booking[]> => {
    return apiRequest<Booking[]>(`${API_BASE}/bookings/owner/${ownerId}`);
  },

  getCarBookings: async (carId: string): Promise<Booking[]> => {
    return apiRequest<Booking[]>(`${API_BASE}/bookings/car/${carId}`);
  },

  createBooking: async (bookingData: BookingData): Promise<Booking> => {
    return apiRequest<Booking>(`${API_BASE}/bookings`, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  updateBooking: async (id: string, updates: Partial<BookingData>): Promise<Booking> => {
    return apiRequest<Booking>(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  cancelBooking: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
    });
  },
};

// Review API
export const reviewApi = {
  getCarReviews: async (carId: string): Promise<Review[]> => {
    return apiRequest<Review[]>(`${API_BASE}/reviews/car/${carId}`);
  },

  getUserReviews: async (userId: string): Promise<Review[]> => {
    return apiRequest<Review[]>(`${API_BASE}/reviews/user/${userId}`);
  },

  createReview: async (reviewData: ReviewData): Promise<Review> => {
    return apiRequest<Review>(`${API_BASE}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },
};

// Notification API
export const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    return apiRequest<Notification[]>(`${API_BASE}/notifications`);
  },

  markNotificationAsRead: async (notificationId: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`${API_BASE}/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  markAllNotificationsAsRead: async (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`${API_BASE}/notifications/mark-all-read`, {
      method: 'PUT',
    });
  },
};

// Payment API
export const paymentApi = {
  createPaymentIntent: async (
    amount: number,
    currency: string,
    bookingId: string,
    customerEmail?: string,
    customerName?: string,
    carTitle?: string,
    mockPayment?: boolean
  ): Promise<{ clientSecret: string; paymentIntentId: string }> => {
    return apiRequest<{ clientSecret: string; paymentIntentId: string }>(`${API_BASE}/payments/create-intent`, {
      method: 'POST',
      body: JSON.stringify({
        amount,
        currency,
        bookingId,
        customerEmail,
        customerName,
        carTitle,
        mockPayment,
      }),
    });
  },

  confirmPayment: async (paymentIntentId: string): Promise<{ status: string }> => {
    return apiRequest<{ status: string }>(`${API_BASE}/payments/status/${paymentIntentId}`);
  },

  refundPayment: async (paymentIntentId: string, amount?: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`${API_BASE}/payments/refund`, {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId, amount }),
    });
  },
};

// Messaging API
export const messagingApi = {
  getConversations: async (): Promise<any[]> => {
    return apiRequest<any[]>(`${API_BASE}/conversations`);
  },

  getConversationMessages: async (conversationId: string): Promise<any[]> => {
    return apiRequest<any[]>(`${API_BASE}/conversations/${conversationId}/messages`);
  },

  createConversation: async (bookingId: string): Promise<any> => {
    return apiRequest<any>(`${API_BASE}/conversations`, {
      method: 'POST',
      body: JSON.stringify({ bookingId }),
    });
  },

  sendMessage: async (conversationId: string, content: string, messageType: string = 'text'): Promise<any> => {
    return apiRequest<any>(`${API_BASE}/messages`, {
      method: 'POST',
      body: JSON.stringify({ conversationId, content, messageType }),
    });
  },

  markMessageAsRead: async (messageId: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`${API_BASE}/messages/${messageId}/read`, {
      method: 'PUT',
    });
  },
};

// Health check
export const healthCheck = async (): Promise<{ status: string }> => {
  return apiRequest<{ status: string }>(`${API_BASE}/health`);
};

// Export for backward compatibility
export { getAuthToken, setAuthToken, ApiError };
