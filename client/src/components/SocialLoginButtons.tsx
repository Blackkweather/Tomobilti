import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface OAuthProvider {
  name: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  onClick: () => Promise<void>;
}

interface SocialLoginButtonsProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

export default function SocialLoginButtons({ 
  onSuccess, 
  onError 
}: SocialLoginButtonsProps) {
  const { login } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const handleOAuthLogin = async (provider: string, token: string, userData?: any) => {
    try {
      setLoading(provider);
      setError('');

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
      
      // Store token and update auth context
      localStorage.setItem('authToken', data.token);
      
      if (onSuccess) {
        onSuccess(data.user);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `${provider} login failed`;
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Load Google Identity Services
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id',
        callback: async (response: any) => {
          await handleOAuthLogin('google', response.credential);
        },
      });

      // Trigger the sign-in flow
      window.google.accounts.id.prompt();

    } catch (error) {
      setError('Google Sign-In failed. Please try again.');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      // Load Facebook SDK
      if (!window.FB) {
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = () => {
            window.FB.init({
              appId: process.env.REACT_APP_FACEBOOK_APP_ID || 'your-facebook-app-id',
              cookie: true,
              xfbml: true,
              version: 'v18.0'
            });
            resolve();
          };
        });
      }

      window.FB.login(async (response: any) => {
        if (response.authResponse) {
          await handleOAuthLogin('facebook', response.authResponse.accessToken, {
            userID: response.authResponse.userID
          });
        } else {
          setError('Facebook login was cancelled.');
        }
      }, { scope: 'email' });

    } catch (error) {
      setError('Facebook login failed. Please try again.');
    }
  };

  const handleAppleLogin = async () => {
    try {
      // Apple Sign-In implementation
      if (!window.AppleID) {
        const script = document.createElement('script');
        script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = () => {
            window.AppleID.auth.init({
              clientId: process.env.REACT_APP_APPLE_CLIENT_ID || 'your-apple-client-id',
              scope: 'name email',
              redirectURI: window.location.origin,
              state: 'apple-signin',
              usePopup: true
            });
            resolve();
          };
        });
      }

      window.AppleID.auth.signIn().then(async (response: any) => {
        await handleOAuthLogin('apple', response.authorization.id_token, {
          user: response.user
        });
      });

    } catch (error) {
      setError('Apple Sign-In failed. Please try again.');
    }
  };

  const handleGitHubLogin = async () => {
    try {
      // GitHub OAuth redirect
      const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID || 'your-github-client-id';
      const redirectUri = encodeURIComponent(window.location.origin + '/auth/github/callback');
      const scope = encodeURIComponent('user:email');
      
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    } catch (error) {
      setError('GitHub login failed. Please try again.');
    }
  };

  const providers: OAuthProvider[] = [
    {
      name: 'Google',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      color: 'hover:bg-red-50 hover:border-red-300 hover:text-red-600',
      hoverColor: 'hover:bg-red-50',
      onClick: handleGoogleLogin
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600',
      hoverColor: 'hover:bg-blue-50',
      onClick: handleFacebookLogin
    },
    {
      name: 'Apple',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      color: 'hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800',
      hoverColor: 'hover:bg-gray-50',
      onClick: handleAppleLogin
    },
    {
      name: 'GitHub',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      color: 'hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800',
      hoverColor: 'hover:bg-gray-50',
      onClick: handleGitHubLogin
    }
  ];

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {providers.map((provider) => (
          <Button
            key={provider.name}
            variant="outline"
            onClick={provider.onClick}
            disabled={loading === provider.name}
            className={`h-12 w-full transition-all duration-200 ${provider.color}`}
          >
            <div className="flex items-center justify-center">
              {loading === provider.name ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                provider.icon
              )}
            </div>
          </Button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

// Extend Window interface for OAuth providers
declare global {
  interface Window {
    google?: any;
    FB?: any;
    AppleID?: any;
  }
}