import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import LoadingSpinner from '../components/LoadingSpinner';

export default function FacebookCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // This component just shows a loading spinner
    // The actual OAuth processing happens on the server side
    // The server will redirect to the home page with the token
    console.log('Facebook callback component loaded');
    
    // Show loading for a moment, then redirect to home
    const timer = setTimeout(() => {
      setLocation('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          Processing Facebook Login...
        </h2>
        <p className="mt-2 text-gray-600">
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  );
}
