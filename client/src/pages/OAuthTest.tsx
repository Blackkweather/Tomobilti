import React, { useState } from 'react';
import { Link } from 'wouter';
import SocialLoginButtons from '../components/SocialLoginButtons';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function OAuthTest() {
  const [testResults, setTestResults] = useState<{
    google: 'pending' | 'success' | 'error';
    facebook: 'pending' | 'success' | 'error';
  }>({
    google: 'pending',
    facebook: 'pending'
  });

  const handleOAuthSuccess = (provider: string, user: any) => {
    console.log(`${provider} OAuth success:`, user);
    setTestResults(prev => ({
      ...prev,
      [provider.toLowerCase()]: 'success'
    }));
  };

  const handleOAuthError = (provider: string, error: string) => {
    console.log(`${provider} OAuth error:`, error);
    setTestResults(prev => ({
      ...prev,
      [provider.toLowerCase()]: 'error'
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Link href="/login" className="flex items-center text-blue-600 hover:text-blue-500">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Login
              </Link>
              <img 
                src="/assets/MAIN LOGO.png?v=5" 
                alt="ShareWheelz" 
                className="h-12 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              OAuth Integration Test
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Test Google and Facebook OAuth functionality
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Test Results */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Test Results:</h3>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    </svg>
                  </div>
                  <span className="font-medium">Google OAuth</span>
                </div>
                <div className="flex items-center">
                  {testResults.google === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  )}
                  {testResults.google === 'error' && (
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <span className={`text-sm font-medium ${
                    testResults.google === 'success' ? 'text-green-600' :
                    testResults.google === 'error' ? 'text-red-600' :
                    'text-gray-500'
                  }`}>
                    {testResults.google === 'success' ? 'Working' :
                     testResults.google === 'error' ? 'Error' :
                     'Pending'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="font-medium">Facebook OAuth</span>
                </div>
                <div className="flex items-center">
                  {testResults.facebook === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  )}
                  {testResults.facebook === 'error' && (
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <span className={`text-sm font-medium ${
                    testResults.facebook === 'success' ? 'text-green-600' :
                    testResults.facebook === 'error' ? 'text-red-600' :
                    'text-gray-500'
                  }`}>
                    {testResults.facebook === 'success' ? 'Working' :
                     testResults.facebook === 'error' ? 'Error' :
                     'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Test OAuth Buttons:</h3>
              <SocialLoginButtons 
                onSuccess={(user) => {
                  console.log('OAuth test success:', user);
                  // Determine which provider succeeded
                  if (user.email) {
                    handleOAuthSuccess('google', user);
                  }
                }}
                onError={(error) => {
                  console.log('OAuth test error:', error);
                  // For testing purposes, we'll assume it's Google if we can't determine
                  handleOAuthError('google', error);
                }}
              />
            </div>

            {/* Environment Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Environment Configuration:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Google Client ID:</span>
                  <span className="font-mono text-xs">
                    {process.env.REACT_APP_GOOGLE_CLIENT_ID ? 
                      `${process.env.REACT_APP_GOOGLE_CLIENT_ID.substring(0, 20)}...` : 
                      'Not configured (using fallback)'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Facebook App ID:</span>
                  <span className="font-mono text-xs">
                    {process.env.REACT_APP_FACEBOOK_APP_ID ? 
                      `${process.env.REACT_APP_FACEBOOK_APP_ID.substring(0, 10)}...` : 
                      'Not configured (using fallback)'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Test Instructions:</strong><br/>
                1. Click the Google or Facebook buttons above<br/>
                2. Complete the OAuth flow in the popup/redirect<br/>
                3. Check the test results above<br/>
                4. If successful, you'll be redirected to the dashboard
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
