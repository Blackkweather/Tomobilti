import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface SocialLoginButtonsProps {
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  onOutlookLogin?: () => void;
}

export default function SocialLoginButtons({ 
  onGoogleLogin, 
  onAppleLogin, 
  onOutlookLogin 
}: SocialLoginButtonsProps) {
  const handleGoogleLogin = () => {
    if (onGoogleLogin) {
      onGoogleLogin();
    } else {
      // Mock Google login for demo purposes
      alert('Google login is not configured yet. Please use email/password login for now.');
    }
  };

  const handleAppleLogin = () => {
    if (onAppleLogin) {
      onAppleLogin();
    } else {
      // Mock Apple login for demo purposes
      alert('Apple login is not configured yet. Please use email/password login for now.');
    }
  };

  const handleOutlookLogin = () => {
    if (onOutlookLogin) {
      onOutlookLogin();
    } else {
      // Mock Outlook login for demo purposes
      alert('Outlook login is not configured yet. Please use email/password login for now.');
    }
  };

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-3 gap-3">
        {/* Google */}
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          className="h-12 w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
        >
          <div className="flex items-center justify-center">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
        </Button>

        {/* Apple */}
        <Button
          variant="outline"
          onClick={handleAppleLogin}
          className="h-12 w-full hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 transition-all duration-200"
        >
          <div className="flex items-center justify-center">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>
        </Button>

        {/* Outlook */}
        <Button
          variant="outline"
          onClick={handleOutlookLogin}
          className="h-12 w-full hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
        >
          <div className="flex items-center justify-center">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.5 3.5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2v-13c0-1.1-.9-2-2-2h-9zm0 2h9v13h-9v-13zm1.5 1.5v2h6v-2h-6zm0 3v2h6v-2h-6zm0 3v2h6v-2h-6z"/>
              <path d="M12 8.5c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5-1.6-3.5-3.5-3.5zm0 5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>
            </svg>
          </div>
        </Button>
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
