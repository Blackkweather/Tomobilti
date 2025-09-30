import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Shield, 
  Wrench, 
  Fuel, 
  Battery, 
  Car, 
  AlertTriangle,
  CheckCircle,
  Star,
  Users,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'wouter';

export default function RoadsideAssistance() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    {
      id: 'jump-start',
      name: 'Jump Start',
      description: 'Battery jump start service',
      icon: Battery,
      responseTime: '30-45 minutes',
      price: 'Free for members',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'flat-tire',
      name: 'Flat Tire',
      description: 'Tire change or repair service',
      icon: Wrench,
      responseTime: '45-60 minutes',
      price: 'Free for members',
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 'fuel-delivery',
      name: 'Fuel Delivery',
      description: 'Emergency fuel delivery',
      icon: Fuel,
      responseTime: '30-60 minutes',
      price: '£15 + fuel cost',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'lockout',
      name: 'Lockout Service',
      description: 'Car lockout assistance',
      icon: Car,
      responseTime: '30-45 minutes',
      price: 'Free for members',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'towing',
      name: 'Towing Service',
      description: 'Vehicle towing to nearest garage',
      icon: Car,
      responseTime: '60-90 minutes',
      price: 'Up to 10 miles free',
      color: 'bg-gray-100 text-gray-800'
    },
    {
      id: 'mechanical',
      name: 'Mechanical Issues',
      description: 'Basic mechanical problem diagnosis',
      icon: Wrench,
      responseTime: '45-75 minutes',
      price: 'Free diagnosis',
      color: 'bg-green-100 text-green-800'
    }
  ];

  const handleRequestService = (serviceId: string) => {
    setSelectedService(serviceId);
    // In a real app, this would open a modal or redirect to booking
    alert(`Requesting ${services.find(s => s.id === serviceId)?.name} service...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">24/7 Roadside Assistance</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get help when you need it most. Our professional roadside assistance team is available 
            24/7 to help you get back on the road safely and quickly.
          </p>
        </div>

        {/* Emergency Contact */}
        <Card className="shadow-xl bg-gradient-to-r from-red-600 to-orange-600 text-white mb-8">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Phone className="h-8 w-8 mr-3" />
              <h2 className="text-3xl font-bold">Emergency Hotline</h2>
            </div>
            <div className="text-4xl font-bold mb-2">0800-ROADSIDE</div>
            <p className="text-lg opacity-90">Available 24/7 for immediate assistance</p>
            <div className="mt-6">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                <Phone className="h-5 w-5 mr-2" />
                Call Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service) => (
            <Card key={service.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <service.icon className="h-6 w-6 mr-2 text-blue-600" />
                  {service.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{service.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Response: {service.responseTime}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700">{service.price}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleRequestService(service.id)}
                  className="w-full"
                  variant={selectedService === service.id ? "default" : "outline"}
                >
                  Request Service
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coverage Areas */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-blue-600" />
              Coverage Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800">London</h3>
                <p className="text-sm text-blue-600">Full coverage</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">Manchester</h3>
                <p className="text-sm text-green-600">Full coverage</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800">Birmingham</h3>
                <p className="text-sm text-purple-600">Full coverage</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800">Edinburgh</h3>
                <p className="text-sm text-orange-600">Full coverage</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                And many more cities across the UK. 
                <Link href="/contact" className="text-blue-600 hover:underline ml-1">
                  Check if we cover your area
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Call Us</h3>
                <p className="text-sm text-gray-600">Contact our 24/7 hotline</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Describe Issue</h3>
                <p className="text-sm text-gray-600">Tell us what's wrong</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Share Location</h3>
                <p className="text-sm text-gray-600">Send us your exact location</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wrench className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">4. Get Help</h3>
                <p className="text-sm text-gray-600">Professional assistance arrives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Benefits */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-600" />
              Membership Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Free jump start service</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Free tire change service</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Free lockout assistance</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Up to 10 miles free towing</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Priority response times</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Nationwide coverage</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Professional technicians</span>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link href="/become-member">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Users className="h-5 w-5 mr-2" />
                  Become a Member
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2 text-yellow-600" />
              Safety Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-gray-900">Before You Drive</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Check tire pressure and tread depth</li>
                  <li>• Ensure all lights are working</li>
                  <li>• Check oil and fluid levels</li>
                  <li>• Test your battery regularly</li>
                  <li>• Keep emergency supplies in your car</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-gray-900">If You Break Down</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Pull over to a safe location</li>
                  <li>• Turn on hazard lights</li>
                  <li>• Stay in your vehicle if on a busy road</li>
                  <li>• Call roadside assistance immediately</li>
                  <li>• Keep emergency contacts handy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

