/**
 * Test Utilities and Helpers
 * Common utilities for writing tests across the ShareWheelz platform
 */

import { vi } from 'vitest';

/**
 * Mock fetch response helper
 */
export const createMockResponse = (data: any, status = 200, headers: Record<string, string> = {}) => {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: new Headers({
      'Content-Type': 'application/json',
      ...headers,
    }),
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as Response;
};

/**
 * Mock fetch with response
 */
export const mockFetch = (response: Response) => {
  global.fetch = vi.fn(() => Promise.resolve(response)) as any;
};

/**
 * Mock fetch with error
 */
export const mockFetchError = (error: Error) => {
  global.fetch = vi.fn(() => Promise.reject(error)) as any;
};

/**
 * Create a mock car object for testing
 */
export const createMockCar = (overrides: Partial<any> = {}) => {
  return {
    id: '1',
    title: 'Test Car',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    pricePerDay: 50,
    currency: 'GBP',
    location: 'London',
    city: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    images: ['/assets/test-car.jpg'],
    ownerId: 'owner1',
    isAvailable: true,
    ...overrides,
  };
};

/**
 * Create a mock user object for testing
 */
export const createMockUser = (overrides: Partial<any> = {}) => {
  return {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    userType: 'renter',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Create a mock booking object for testing
 */
export const createMockBooking = (overrides: Partial<any> = {}) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 3);

  return {
    id: '1',
    carId: '1',
    renterId: '1',
    ownerId: 'owner1',
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    totalAmount: 150,
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Create a mock review object for testing
 */
export const createMockReview = (overrides: Partial<any> = {}) => {
  return {
    id: '1',
    bookingId: '1',
    carId: '1',
    reviewerId: '1',
    rating: 5,
    comment: 'Great car!',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Wait for async operations to complete
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create mock IntersectionObserver
 */
export const createMockIntersectionObserver = () => {
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();
  const takeRecords = vi.fn(() => []);

  global.IntersectionObserver = vi.fn((callback: IntersectionObserverCallback) => {
    return {
      observe,
      unobserve,
      disconnect,
      takeRecords,
      root: null,
      rootMargin: '',
      thresholds: [],
    } as IntersectionObserver;
  }) as any;

  return { observe, unobserve, disconnect, takeRecords };
};

/**
 * Mock window.matchMedia
 */
export const mockMatchMedia = (matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};



