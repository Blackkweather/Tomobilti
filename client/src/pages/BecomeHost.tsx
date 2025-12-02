import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Car, PoundSterling, Shield, Clock, Users } from "lucide-react";
import { Link } from "wouter";

export default function BecomeHost() {
  const [showCalculator, setShowCalculator] = useState(false);


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
              <Button size="lg" className="btn-animated-border btn-white border-2">
                Start Now
              </Button>
            </Link>
            <Link href="/earnings-calculator">
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-animated-border btn-white border-2"
              >
                Calculate My Earnings
              </Button>
            </Link>
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
