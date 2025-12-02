import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { setAuthToken } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle, XCircle } from 'lucide-react';

export default function GoogleCallback() {
  const [, setLocation] = useLocation();
  const { oauthLogin } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const token = urlParams.get('token');
        const auth = urlParams.get('auth');

        if (error) {
          throw new Error(`Google OAuth error: ${error}`);
        }

        // If we have a token from the backend redirect, use it directly
        if (token && auth === 'google') {
          // Store the token and fetch user data
          setAuthToken(token);
          
          // Fetch current user to update auth context
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await response.json();
          
          // Update auth context by triggering a page refresh or using a different method
          // For now, we'll redirect to dashboard and let AuthContext handle the token
          setStatus('success');
          setMessage('Successfully authenticated with Google!');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            // Redirect based on user type
            if (userData.user?.userType === 'owner') {
              setLocation('/owner-dashboard');
            } else if (userData.user?.userType === 'renter') {
              setLocation('/renter-dashboard');
            } else {
              setLocation('/dashboard');
            }
          }, 2000);
          return;
        }

        if (!code) {
          throw new Error('No authorization code received from Google');
        }

        // Exchange code for access token
        const tokenResponse = await fetch('/api/auth/oauth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: code }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json();

        // Use the access token to authenticate
        await oauthLogin('google', tokenData.token, {
          userID: tokenData.user?.id
        });

        setStatus('success');
        setMessage('Successfully authenticated with Google!');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          // Redirect based on user type
          if (tokenData.user?.userType === 'owner') {
            setLocation('/owner-dashboard');
          } else if (tokenData.user?.userType === 'renter') {
            setLocation('/renter-dashboard');
          } else {
            setLocation('/dashboard');
          }
        }, 2000);

      } catch (error) {
        console.error('Google callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Google authentication failed');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          setLocation('/login');
        }, 3000);
      }
    };

    handleGoogleCallback();
  }, [oauthLogin, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mauve-50 via-white to-bleu-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <LoadingSpinner />
              <h2 className="text-xl font-semibold text-gray-900 mt-4">
                Completing Google Authentication
              </h2>
              <p className="text-gray-600 mt-2">
                Please wait while we verify your Google account...
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
