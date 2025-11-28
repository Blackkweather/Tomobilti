import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setAuthToken, getAuthToken, ApiError } from '../../../client/src/lib/api';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('API Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Auth Token Management', () => {
    it('should set and get auth token', () => {
      setAuthToken('test-token');
      expect(getAuthToken()).toBe('test-token');
      expect(localStorage.getItem('auth_token')).toBe('test-token');
    });

    it('should remove auth token when set to null', () => {
      setAuthToken('test-token');
      setAuthToken(null);
      expect(getAuthToken()).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('ApiError Class', () => {
    it('should create ApiError with message', () => {
      const error = new ApiError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ApiError');
    });

    it('should create ApiError with status code', () => {
      const error = new ApiError('Not found', 404);
      expect(error.status).toBe(404);
    });

    it('should create ApiError with code and details', () => {
      const error = new ApiError('Validation error', 400, 'VALIDATION_ERROR', { field: 'email' });
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toEqual({ field: 'email' });
    });

    it('should be instance of Error', () => {
      const error = new ApiError('Test error');
      expect(error).toBeInstanceOf(Error);
    });
  });
});



