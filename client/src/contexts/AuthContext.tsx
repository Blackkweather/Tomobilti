import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, getAuthToken, setAuthToken } from '../lib/api';
import type { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User; token: string; message: string }>;
  register: (userData: any) => Promise<{ user: User; token: string; message: string }>;
  oauthLogin: (provider: string, token: string, userData?: any) => Promise<{ user: User; token: string; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Check for token in URL first (OAuth callback)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      
      if (urlToken) {
        console.log('OAuth callback detected, processing token:', urlToken);
        // Store the token and clear URL
        setAuthToken(urlToken);
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Immediately fetch user data with the new token
        try {
          console.log('Fetching user data with OAuth token...');
          const response = await authApi.getCurrentUser();
          console.log('OAuth user data received:', response.user);
          setUser(response.user);
          setLoading(false);
          return;
        } catch (error) {
          console.error('Failed to get current user with URL token:', error);
          // Clear invalid token
          await authApi.logout();
        }
      }

      const token = getAuthToken();
      if (token) {
        try {
          const response = await authApi.getCurrentUser();
          setUser(response.user);
        } catch (error) {
          console.error('Failed to get current user:', error);
          // Clear invalid token
          await authApi.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
      return response; // Return response for redirection logic
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authApi.register(userData);
      setUser(response.user);
      return response; // Return response for redirection logic
    } catch (error) {
      throw error;
    }
  };

  const oauthLogin = async (provider: string, token: string, userData?: any) => {
    try {
      const response = await fetch(`/api/auth/oauth/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, ...userData }),
      });

      if (!response.ok) {
        throw new Error(`${provider} authentication failed`);
      }

      const data = await response.json();
      setUser(data.user);
      setAuthToken(data.token);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    oauthLogin,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
