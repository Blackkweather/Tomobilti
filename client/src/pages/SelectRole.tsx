import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Car, User } from 'lucide-react';
import { setAuthToken } from '../lib/api';

export default function SelectRole() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
      setAuthToken(urlToken);
    } else {
      setLocation('/login');
    }
  }, [setLocation]);

  const handleRoleSelection = async (role: 'renter' | 'owner') => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/auth/update-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userType: role })
      });

      if (response.ok) {
        if (role === 'owner') {
          setLocation('/owner-dashboard');
        } else {
          setLocation('/renter-dashboard');
        }
      }
    } catch (error) {
      console.error('Role selection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Choose Your Role</CardTitle>
          <p className="text-gray-600 mt-2">How would you like to use ShareWheelz?</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            onClick={() => handleRoleSelection('renter')}
            disabled={loading}
            className="h-48 flex flex-col items-center justify-center gap-4 bg-blue-600 hover:bg-blue-700"
          >
            <User className="h-16 w-16" />
            <div>
              <div className="text-xl font-bold">I want to rent</div>
              <div className="text-sm opacity-90">Find and book vehicles</div>
            </div>
          </Button>
          <Button
            onClick={() => handleRoleSelection('owner')}
            disabled={loading}
            className="h-48 flex flex-col items-center justify-center gap-4 bg-green-600 hover:bg-green-700"
          >
            <Car className="h-16 w-16" />
            <div>
              <div className="text-xl font-bold">I want to list my car</div>
              <div className="text-sm opacity-90">Earn money from your vehicle</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
