import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Shield, 
  CreditCard, 
  Phone, 
  Mail, 
  Clock, 
  Car, 
  Users,
  CheckCircle,
  Info,
  FileText,
  Headphones,
  Zap
} from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '../contexts/AuthContext';

export default function Services() {
  const { isAuthenticated } = useAuth();
  const insuranceFeatures = [
    {
      icon: Shield,
      title: "Comprehensive Coverage",
      description: "Full protection including collision, theft, and third-party liability",
      included: true
    },
    {
      icon: CreditCard,
      title: "No Hidden Fees",
      description: "Transparent pricing with no surprise charges or additional costs",
      included: true
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance for any issues or emergencies",
      included: true
    },
    {
      icon: Users,
      title: "Verified Drivers",
      description: "All renters are verified with valid licenses and clean records",
      included: true
    }
  ];


  const vehicleCategories = [
    {
      icon: Car,
      title: "Economy Cars",
      description: "Perfect for city driving and short trips",
      priceRange: "£25-45/day",
      features: ["Fuel efficient", "Easy parking", "Low cost"],
      examples: ["Ford Fiesta", "Vauxhall Corsa", "Nissan Micra"]
    },
    {
      icon: Car,
      title: "Compact Cars",
      description: "Great balance of comfort and efficiency",
      priceRange: "£35-55/day",
      features: ["More space", "Better comfort", "Good fuel economy"],
      examples: ["Volkswagen Golf", "Ford Focus", "Toyota Corolla"]
    },
    {
      icon: Car,
      title: "Mid-size Sedans",
      description: "Comfortable for longer journeys",
      priceRange: "£45-75/day",
      features: ["Spacious interior", "Premium features", "Smooth ride"],
      examples: ["BMW 3 Series", "Mercedes C-Class", "Audi A4"]
    },
    {
      icon: Car,
      title: "Luxury Vehicles",
      description: "Premium experience for special occasions",
      priceRange: "£75-150/day",
      features: ["Premium amenities", "Advanced technology", "Superior comfort"],
      examples: ["BMW 5 Series", "Mercedes E-Class", "Audi A6"]
    },
    {
      icon: Zap,
      title: "Electric Vehicles",
      description: "Eco-friendly and modern technology",
      priceRange: "£40-80/day",
      features: ["Zero emissions", "Low running costs", "Quiet operation"],
      examples: ["Tesla Model 3", "Nissan Leaf", "BMW i3"]
    },
    {
      icon: Users,
      title: "Family Vehicles",
      description: "Spacious options for family trips",
      priceRange: "£50-90/day",
      features: ["7+ seats", "Large boot space", "Child safety features"],
      examples: ["Volkswagen Touran", "Ford Galaxy", "Peugeot 5008"]
    }
  ];

  const rentalTerms = [
    {
      title: "Booking & Cancellation",
      items: [
        "Free cancellation up to 24 hours before pickup",
        "50% refund for cancellations within 24 hours",
        "No refund for no-shows",
        "Instant confirmation for most bookings"
      ]
    },
    {
      title: "Pickup & Return",
      items: [
        "Flexible pickup and return times",
        "Contact owner 30 minutes before pickup",
        "Vehicle inspection required at pickup",
        "Return vehicle in same condition"
      ]
    },
    {
      title: "Insurance & Coverage",
      items: [
        "Comprehensive insurance included",
        "Excess varies by vehicle type",
        "Additional coverage available",
        "24/7 roadside assistance"
      ]
    },
    {
      title: "Driver Requirements",
      items: [
        "Valid UK driving license required",
        "Minimum age varies by vehicle",
        "Clean driving record preferred",
        "ID verification required"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 premium-heading">
              Complete Rental Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Everything you need for a perfect car rental experience in the UK
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="glass-card text-white border border-white/20 px-4 py-2 text-lg">
                ✓ Insurance Included
              </Badge>
              <Badge className="glass-card text-white border border-white/20 px-4 py-2 text-lg">
                ✓ 24/7 Support
              </Badge>
              <Badge className="glass-card text-white border border-white/20 px-4 py-2 text-lg">
                ✓ Verified Owners
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Coverage */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 premium-heading">Insurance Coverage</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive protection for every rental with transparent terms and no hidden fees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insuranceFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="modern-card hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <Icon className="h-12 w-12 mx-auto text-green-500" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                    <div className="mt-4">
                      <Badge className="gradient-success text-white border-0">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Included
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vehicle Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 premium-heading">Vehicle Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from a wide range of vehicles to match your needs and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicleCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="modern-card hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-8 w-8 text-blue-500" />
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                    </div>
                    <p className="text-gray-600">{category.description}</p>
                    <Badge className="gradient-accent text-white border-0 w-fit">
                      {category.priceRange}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          {category.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Popular Models:</h4>
                        <div className="flex flex-wrap gap-1">
                          {category.examples.map((example, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>


      {/* Rental Terms */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 premium-heading">Rental Terms & Conditions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Clear and fair terms to ensure a smooth rental experience for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {rentalTerms.map((section, index) => (
              <Card key={index} className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 premium-heading">Need Help?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our support team is here to help you 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="modern-card text-center hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">Speak directly with our support team</p>
                <Button className="gradient-primary text-white border-0">
                  +44 20 1234 5678
                </Button>
              </CardContent>
            </Card>

            <Card className="modern-card text-center hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <Mail className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">Get help via email within 2 hours</p>
                <Button className="gradient-success text-white border-0">
                  support@sharewheelz.uk
                </Button>
              </CardContent>
            </Card>

            <Card className="modern-card text-center hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <Headphones className="h-12 w-12 mx-auto text-purple-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Chat with us in real-time</p>
                <Button className="gradient-accent text-white border-0">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of satisfied customers and find your perfect car today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars">
              <Button className="glass-card text-white border border-white/20 hover:scale-105 transition-transform px-8 py-3 text-lg">
                Browse Cars
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link href="/become-member">
                <Button className="glass-card text-white border border-white/20 hover:scale-105 transition-transform px-8 py-3 text-lg">
                  Become a Member
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

