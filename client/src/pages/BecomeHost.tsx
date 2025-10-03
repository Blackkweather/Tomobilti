import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Car, PoundSterling, Shield, Clock, Users, Star } from "lucide-react";
import { Link } from "wouter";

export default function BecomeHost() {
  const [showCalculator, setShowCalculator] = useState(false);

  const handleCalculateEarnings = () => {
    setShowCalculator(true);
    // Scroll to calculator section or open modal
    document.getElementById('earnings-calculator')?.scrollIntoView({ behavior: 'smooth' });
  };
  const benefits = [
    {
      icon: PoundSterling,
      title: "Earn up to £300/month",
      description: "Monetize your vehicle when you're not using it"
    },
    {
      icon: Shield,
      title: "Complete Protection",
      description: "Comprehensive insurance included for every rental"
    },
    {
      icon: Clock,
      title: "Total Flexibility",
      description: "You decide when and to whom to rent your vehicle"
    },
    {
      icon: Users,
      title: "Verified Community",
      description: "All renters are verified and rated"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your owner account in a few minutes"
    },
    {
      step: "2", 
      title: "Add Your Vehicle",
      description: "Photos, description and pricing for your car"
    },
    {
      step: "3",
      title: "Receive Requests",
      description: "Renters contact you to make bookings"
    },
    {
      step: "4",
      title: "Earn Money",
      description: "Receive your payments automatically"
    }
  ];


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Earn Money with Your Car
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Transform your vehicle into a source of income. Join thousands of owners who earn up to £300 per month.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Now
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={handleCalculateEarnings}
            >
              Calculate My Earnings
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Become a Host?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={benefit.title} className="text-center">
                <CardContent className="pt-6">
                  <benefit.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Does It Work?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Earnings Calculator */}
      {showCalculator && (
        <section id="earnings-calculator" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Earnings Calculator</h2>
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-4">Estimated Monthly Earnings</h3>
                  <div className="bg-blue-100 p-6 rounded-lg mb-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">£240</div>
                    <p className="text-gray-600">Estimated Monthly Earnings</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    *Estimation based on average rental of 15 days per month at £16/day
                  </p>
                  <Link href="/login">
                    <Button size="lg">
                      Start Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our host community and start earning money today.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Car className="h-5 w-5 mr-2" />
              Become a Host Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
