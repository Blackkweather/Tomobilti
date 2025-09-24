import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Users, Shield, CreditCard, MapPin, Star } from 'lucide-react';

const steps = [
  {
    icon: Car,
    title: "List Your Car",
    description: "Add your vehicle with photos and details. Set your prices and availability."
  },
  {
    icon: Users,
    title: "Meet Renters",
    description: "Receive rental requests. Exchange with renters before validation."
  },
  {
    icon: Shield,
    title: "Secure Rental",
    description: "Insurance included, secure payment. Key handover with confidence."
  },
  {
    icon: CreditCard,
    title: "Receive Your Earnings",
    description: "Your income is automatically transferred after each successful rental."
  }
];

const benefits = [
  {
    icon: MapPin,
    title: "All Across the UK",
    description: "London, Manchester, Birmingham, Edinburgh... Your car can generate income in all major cities."
  },
  {
    icon: Star,
    title: "Trusted Community",
    description: "Rating and verification system for secure exchanges."
  },
  {
    icon: Shield,
    title: "Complete Protection",
    description: "Comprehensive insurance included. Your vehicle is protected during every rental."
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How Does It Work?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your car into a source of income in 4 simple steps. 
            Join thousands of owners who earn money with their vehicle.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            4 Steps to Start Earning
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.title} className="text-center hover-elevate">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Tomobilto?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="text-center hover-elevate">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-4 text-lg">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container px-4 text-center">
          <Card className="bg-primary text-primary-foreground max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Put Your Car to Work?
              </h2>
              <p className="text-primary-foreground/90 mb-8 text-lg">
                Sign up for free and start generating income today.
              </p>
              <Button variant="secondary" size="lg" className="hover-elevate">
                List My Car
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}