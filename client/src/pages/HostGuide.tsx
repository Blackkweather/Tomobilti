import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  CheckCircle, 
  Star, 
  PoundSterling, 
  Shield, 
  Users, 
  Car, 
  Calendar,
  MapPin,
  Clock,
  Camera,
  Settings,
  ArrowRight,
  ThumbsUp,
  Award,
  Zap
} from 'lucide-react';
import { Link } from 'wouter';

export default function HostGuide() {
  const steps = [
    {
      step: 1,
      title: "Create Your Account",
      description: "Sign up and verify your identity",
      icon: Users,
      details: [
        "Complete profile verification",
        "Upload valid driving license",
        "Provide contact information",
        "Set up payment preferences"
      ]
    },
    {
      step: 2,
      title: "List Your Vehicle",
      description: "Add your car details and photos",
      icon: Car,
      details: [
        "Vehicle specifications",
        "High-quality photos (8+ recommended)",
        "Set your daily rate",
        "Choose availability calendar"
      ]
    },
    {
      step: 3,
      title: "Get Approved",
      description: "Pass our safety and quality checks",
      icon: Shield,
      details: [
        "Vehicle safety inspection",
        "Insurance verification",
        "Background check completion",
        "Platform guidelines review"
      ]
    },
    {
      step: 4,
      title: "Start Earning",
      description: "Receive booking requests and earn money",
      icon: PoundSterling,
      details: [
        "Respond to booking requests",
        "Meet renters for handover",
        "Track your earnings",
        "Get paid automatically"
      ]
    }
  ];

  const tips = [
    {
      icon: Camera,
      title: "Take Great Photos",
      description: "High-quality photos increase bookings by 40%",
      tips: [
        "Use natural lighting",
        "Take photos from multiple angles",
        "Show interior and exterior",
        "Include unique features"
      ]
    },
    {
      icon: PoundSterling,
      title: "Set Competitive Prices",
      description: "Research local market rates for optimal pricing",
      tips: [
        "Check similar vehicles in your area",
        "Consider seasonal demand",
        "Factor in your costs",
        "Start competitive, adjust based on demand"
      ]
    },
    {
      icon: Calendar,
      title: "Manage Availability",
      description: "Keep your calendar updated for maximum bookings",
      tips: [
        "Block dates you need the car",
        "Set advance notice requirements",
        "Consider minimum rental periods",
        "Update availability regularly"
      ]
    },
    {
      icon: Star,
      title: "Maintain High Ratings",
      description: "Excellent service leads to more repeat bookings",
      tips: [
        "Respond quickly to messages",
        "Keep your car clean and maintained",
        "Be flexible with pickup/dropoff",
        "Provide clear instructions"
      ]
    }
  ];

  const requirements = [
    {
      category: "Vehicle Requirements",
      items: [
        "Vehicle must be less than 10 years old",
        "Valid insurance and registration",
        "Pass safety inspection",
        "Clean and well-maintained",
        "Working air conditioning and heating"
      ]
    },
    {
      category: "Owner Requirements",
      items: [
        "Valid UK driving license",
        "Background check verification",
        "Insurance coverage verification",
        "Responsive communication"
      ]
    },
    {
      category: "Documentation",
      items: [
        "Vehicle registration document",
        "Insurance certificate",
        "MOT certificate",
        "Service history",
        "Valid driving license"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Host Guide</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know to become a successful ShareWheelz host. 
            Start earning money from your vehicle today!
          </p>
        </div>

        {/* Getting Started */}
        <Card className="shadow-xl bg-gradient-to-r from-green-600 to-blue-600 text-white mb-12">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <Zap className="h-16 w-16 mr-4" />
              <div>
                <h2 className="text-4xl font-bold">Start Earning Today</h2>
                <p className="text-xl opacity-90">Join thousands of successful hosts</p>
              </div>
            </div>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              The average host earns £240 per month by renting out their vehicle 
              when they're not using it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/become-host">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  <Car className="h-5 w-5 mr-2" />
                  Become a Host
                </Button>
              </Link>
              <Link href="/earnings-calculator">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <PoundSterling className="h-5 w-5 mr-2" />
                  Calculate Earnings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
              How to Get Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {step.details.map((detail, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Tips */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ThumbsUp className="h-6 w-6 mr-2 text-blue-600" />
              Success Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tips.map((tip, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center">
                    <tip.icon className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {tip.tips.map((tipItem, tipIndex) => (
                      <li key={tipIndex} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{tipItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-6 w-6 mr-2 text-purple-600" />
              Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {requirements.map((requirement, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">{requirement.category}</h3>
                  <ul className="space-y-2">
                    {requirement.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Earnings Calculator */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PoundSterling className="h-6 w-6 mr-2 text-green-600" />
              Calculate Your Potential Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Use our earnings calculator to see how much you could earn by renting out your vehicle.
              </p>
              <Link href="/earnings-calculator">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <PoundSterling className="h-5 w-5 mr-2" />
                  Calculate Earnings
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-600" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Host Support</h3>
                <p className="text-sm text-gray-600 mb-4">Get help with hosting questions</p>
                <Link href="/contact">
                  <Button variant="outline">Contact Support</Button>
                </Link>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Host Resources</h3>
                <p className="text-sm text-gray-600 mb-4">Access guides and best practices</p>
                <Link href="/help">
                  <Button variant="outline">View Resources</Button>
                </Link>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Host Community</h3>
                <p className="text-sm text-gray-600 mb-4">Connect with other hosts</p>
                <Button variant="outline">Join Community</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Hosting?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join our community of successful hosts and start earning money today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/become-host">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Car className="h-5 w-5 mr-2" />
                  Become a Host
                </Button>
              </Link>
              <Link href="/add-car">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Settings className="h-5 w-5 mr-2" />
                  List Your Car
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}













