import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { setAuthToken } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle, XCircle } from 'lucide-react';

export default function FacebookCallback() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(decodeURIComponent(error));
        }

        if (token) {
          setAuthToken(token);
          
          const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (!response.ok) throw new Error('Failed to fetch user data');

          const userData = await response.json();
          setStatus('success');
          setMessage('Successfully authenticated with Facebook!');
          
          setTimeout(() => {
            if (userData.user?.userType === 'owner') {
              setLocation('/owner-dashboard');
            } else if (userData.user?.userType === 'renter') {
              setLocation('/renter-dashboard');
            } else {
              setLocation('/dashboard');
            }
          }, 2000);
        } else {
          throw new Error('No token received');
        }
      } catch (error) {
        console.error('Facebook callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Facebook authentication failed');
        setTimeout(() => setLocation('/login'), 3000);
      }
    };

    handleCallback();
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <LoadingSpinner />
              <h2 className="text-xl font-semibold text-gray-900 mt-4">
                Processing Facebook Login
              </h2>
              <p className="text-gray-600 mt-2">
                Please wait while we verify your Facebook account...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-gray-900 mt-4">
                Authentication Successful!
              </h2>
              <p className="text-gray-600 mt-2">{message}</p>
              <p className="text-sm text-gray-500 mt-4">
                Redirecting to your dashboard...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold text-gray-900 mt-4">
                Authentication Failed
              </h2>
              <p className="text-gray-600 mt-2">{message}</p>
              <p className="text-sm text-gray-500 mt-4">
                Redirecting to login page...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
