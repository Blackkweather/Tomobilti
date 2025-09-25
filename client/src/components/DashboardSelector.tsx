import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Car, User, ArrowRight } from 'lucide-react';

export default function DashboardSelector() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<'owner' | 'renter' | null>(null);

  const handleSelectDashboard = (type: 'owner' | 'renter') => {
    setSelectedType(type);
    setTimeout(() => {
      setLocation(`/dashboard/${type}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12">
      <div className="max-w-4xl w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Choose your dashboard to continue
          </p>
          <p className="text-sm text-gray-500 mb-2">
            You can switch between dashboards anytime from the navigation menu
          </p>
          {user && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>Member since {new Date(user.createdAt).toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Owner Dashboard Option */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedType === 'owner' ? 'ring-2 ring-green-500 shadow-xl scale-105' : 'hover:shadow-lg'
            }`}
            onClick={() => handleSelectDashboard('owner')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Owner Dashboard</CardTitle>
              <p className="text-gray-600 mt-2">
                Manage your vehicles and bookings
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Manage your vehicle fleet
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  View booking requests
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Track earnings and analytics
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Add new vehicles
                </div>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={selectedType !== null}
              >
                {selectedType === 'owner' ? (
                  <>
                    <ArrowRight className="h-4 w-4 mr-2 animate-pulse" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <Car className="h-4 w-4 mr-2" />
                    Go to Owner Dashboard
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Renter Dashboard Option */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedType === 'renter' ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'hover:shadow-lg'
            }`}
            onClick={() => handleSelectDashboard('renter')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Renter Dashboard</CardTitle>
              <p className="text-gray-600 mt-2">
                Manage your bookings and rentals
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  View your bookings
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Track rental history
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Manage payments
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Browse available cars
                </div>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={selectedType !== null}
              >
                {selectedType === 'renter' ? (
                  <>
                    <ArrowRight className="h-4 w-4 mr-2 animate-pulse" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Go to Renter Dashboard
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            You can switch between dashboards anytime from the navigation menu
          </p>
        </div>
      </div>
    </div>
  );
}
