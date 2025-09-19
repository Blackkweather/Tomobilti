import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, DollarSign, Shield, Clock, Users, Star } from "lucide-react";
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
      icon: DollarSign,
      title: "Gagnez jusqu'à 3000 MAD/mois",
      description: "Rentabilisez votre véhicule quand vous ne l'utilisez pas"
    },
    {
      icon: Shield,
      title: "Protection complète",
      description: "Assurance tous risques incluse pour chaque location"
    },
    {
      icon: Clock,
      title: "Flexibilité totale",
      description: "Vous décidez quand et à qui louer votre véhicule"
    },
    {
      icon: Users,
      title: "Communauté vérifiée",
      description: "Tous les locataires sont vérifiés et évalués"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Inscrivez-vous",
      description: "Créez votre compte propriétaire en quelques minutes"
    },
    {
      step: "2", 
      title: "Ajoutez votre véhicule",
      description: "Photos, description et tarifs de votre voiture"
    },
    {
      step: "3",
      title: "Recevez des demandes",
      description: "Les locataires vous contactent pour réserver"
    },
    {
      step: "4",
      title: "Gagnez de l'argent",
      description: "Recevez vos paiements automatiquement"
    }
  ];

  const testimonials = [
    {
      name: "Ahmed B.",
      location: "Casablanca",
      earning: "2800 MAD/mois",
      comment: "Excellent moyen de rentabiliser ma voiture. Service client très réactif.",
      rating: 5
    },
    {
      name: "Sara I.",
      location: "Rabat", 
      earning: "2200 MAD/mois",
      comment: "Plateforme sécurisée, locataires respectueux. Je recommande !",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Gagnez de l'argent avec votre voiture
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Transformez votre véhicule en source de revenus. Rejoignez des milliers de propriétaires qui gagnent jusqu'à 3000 MAD par mois.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Commencer maintenant
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={handleCalculateEarnings}
            >
              Calculer mes gains
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi devenir hôte ?</h2>
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
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
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

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos hôtes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <p className="text-gray-600">{testimonial.location}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {testimonial.earning}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      {showCalculator && (
        <section id="earnings-calculator" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Calculateur de gains</h2>
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-4">Estimation de vos gains mensuels</h3>
                  <div className="bg-blue-100 p-6 rounded-lg mb-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">2,400 MAD</div>
                    <p className="text-gray-600">Gain mensuel estimé</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    *Estimation basée sur une location moyenne de 15 jours par mois à 160 MAD/jour
                  </p>
                  <Link href="/login">
                    <Button size="lg">
                      Commencer maintenant
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
          <h2 className="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté d'hôtes et commencez à gagner de l'argent dès aujourd'hui.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Car className="h-5 w-5 mr-2" />
              Devenir hôte maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}