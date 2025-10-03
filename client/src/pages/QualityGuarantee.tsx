import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Shield, 
  CheckCircle, 
  Star, 
  Award, 
  Clock, 
  Users, 
  Car, 
  PoundSterling,
  ArrowRight,
  ThumbsUp,
  Heart,
  Zap
} from 'lucide-react';
import { Link } from 'wouter';

export default function QualityGuarantee() {
  const guarantees = [
    {
      icon: Car,
      title: "Vehicle Quality Guarantee",
      description: "Every vehicle on our platform meets strict quality standards",
      details: [
        "Comprehensive pre-rental inspection",
        "Regular maintenance and servicing",
        "Clean and well-maintained interiors",
        "Up-to-date safety features"
      ],
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: Shield,
      title: "Safety Guarantee",
      description: "Your safety is our top priority",
      details: [
        "All vehicles insured and roadworthy",
        "Verified and background-checked owners",
        "24/7 roadside assistance",
        "Emergency support available"
      ],
      color: "bg-green-100 text-green-800"
    },
    {
      icon: PoundSterling,
      title: "Price Guarantee",
      description: "Transparent pricing with no hidden fees",
      details: [
        "No surprise charges at pickup",
        "Clear breakdown of all costs",
        "Best price guarantee",
        "Flexible cancellation policies"
      ],
      color: "bg-purple-100 text-purple-800"
    },
    {
      icon: Users,
      title: "Service Guarantee",
      description: "Exceptional customer service every time",
      details: [
        "24/7 customer support",
        "Quick response to issues",
        "Satisfaction guarantee",
        "Easy booking and cancellation"
      ],
      color: "bg-orange-100 text-orange-800"
    }
  ];

  const qualityStandards = [
    {
      category: "Vehicle Standards",
      items: [
        "Annual safety inspection required",
        "Regular maintenance schedule",
        "Clean and sanitized interiors",
        "Working air conditioning and heating",
        "Up-to-date registration and insurance"
      ]
    },
    {
      category: "Owner Standards",
      items: [
        "Background check verification",
        "Valid driving license",
        "Insurance coverage verification",
        "Responsive communication"
      ]
    },
    {
      category: "Service Standards",
      items: [
        "24/7 customer support",
        "Quick response times",
        "Transparent pricing",
        "Easy booking process",
        "Flexible cancellation"
      ]
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Quality Guarantee</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We stand behind every rental with our comprehensive quality guarantee. 
            Your satisfaction and safety are our top priorities.
          </p>
        </div>

        {/* Main Guarantee Banner */}
        <Card className="shadow-xl bg-gradient-to-r from-green-600 to-blue-600 text-white mb-12">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-16 w-16 mr-4" />
              <div>
                <h2 className="text-4xl font-bold">100% Satisfaction Guarantee</h2>
                <p className="text-xl opacity-90">Or your money back</p>
              </div>
            </div>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              If you're not completely satisfied with your rental experience, 
              we'll make it right or provide a full refund.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cars">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  <Car className="h-5 w-5 mr-2" />
                  Browse Cars
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Users className="h-5 w-5 mr-2" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Guarantee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {guarantees.map((guarantee, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <guarantee.icon className="h-6 w-6 mr-3 text-green-600" />
                  {guarantee.title}
                </CardTitle>
                <p className="text-gray-600">{guarantee.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {guarantee.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quality Standards */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-600" />
              Our Quality Standards
            </CardTitle>
            <p className="text-gray-600">
              Every vehicle and owner on our platform must meet these strict standards
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {qualityStandards.map((standard, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">{standard.category}</h3>
                  <ul className="space-y-2">
                    {standard.items.map((item, itemIndex) => (
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

        {/* How We Ensure Quality */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-6 w-6 mr-2 text-blue-600" />
              How We Ensure Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Pre-Rental Inspection</h3>
                <p className="text-sm text-gray-600">Every vehicle is thoroughly inspected before each rental</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Owner Verification</h3>
                <p className="text-sm text-gray-600">All owners are background checked and verified</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Quality Assurance</h3>
                <p className="text-sm text-gray-600">Maintaining high standards through verification</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">Round-the-clock assistance when you need it</p>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* CTA Section */}
        <Card className="shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience Quality Guaranteed</h2>
            <p className="text-xl mb-8 opacity-90">
              Join our growing community of satisfied customers who trust our quality guarantee
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cars">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Car className="h-5 w-5 mr-2" />
                  Start Your Rental
                </Button>
              </Link>
              <Link href="/become-member">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  Become a Member
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}













