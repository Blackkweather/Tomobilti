import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function MicrosoftCallback() {
  const [, setLocation] = useLocation();
  const { oauthLogin } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleMicrosoftCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`Microsoft OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Microsoft');
        }

        // Exchange code for access token
        const tokenResponse = await fetch('/api/auth/oauth/microsoft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken: code }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json();

        // Use the access token to authenticate
        await oauthLogin('microsoft', tokenData.token, {
          userID: tokenData.user?.id
        });

        setStatus('success');
        setMessage('Successfully authenticated with Microsoft!');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          setLocation('/dashboard');
        }, 2000);

      } catch (error) {
        console.error('Microsoft callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Microsoft authentication failed');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          setLocation('/login');
        }, 3000);
      }
    };

    handleMicrosoftCallback();
  }, [oauthLogin, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mauve-50 via-white to-bleu-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <LoadingSpinner />
              <h2 className="text-xl font-semibold text-gray-900 mt-4">
                Completing Microsoft Authentication
              </h2>
              <p className="text-gray-600 mt-2">
                Please wait while we verify your Microsoft account...
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




