import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Users, Shield, CreditCard, MapPin, Star } from 'lucide-react';

const steps = [
  {
    icon: Car,
    title: "Inscrivez votre voiture",
    description: "Ajoutez votre véhicule avec photos et détails. Fixez vos prix et disponibilités."
  },
  {
    icon: Users,
    title: "Rencontrez les locataires",
    description: "Recevez des demandes de location. Échangez avec les locataires avant validation."
  },
  {
    icon: Shield,
    title: "Location sécurisée",
    description: "Assurance incluse, paiement sécurisé. Remise des clés en toute confiance."
  },
  {
    icon: CreditCard,
    title: "Recevez vos gains",
    description: "Vos revenus sont versés automatiquement après chaque location réussie."
  }
];

const benefits = [
  {
    icon: MapPin,
    title: "Partout au Maroc",
    description: "Casablanca, Rabat, Marrakech, Fès... Votre voiture peut générer des revenus dans toutes les grandes villes."
  },
  {
    icon: Star,
    title: "Communauté de confiance",
    description: "Système d'évaluations et vérifications pour des échanges en toute sécurité."
  },
  {
    icon: Shield,
    title: "Protection complète",
    description: "Assurance tous risques incluse. Votre véhicule est protégé pendant chaque location."
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Comment ça marche ?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transformez votre voiture en source de revenus en 4 étapes simples. 
            Rejoignez des milliers de propriétaires qui gagnent de l'argent avec leur véhicule.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            4 étapes pour commencer à gagner
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
            Pourquoi choisir Tomobilto ?
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
                Prêt à faire travailler votre voiture ?
              </h2>
              <p className="text-primary-foreground/90 mb-8 text-lg">
                Inscrivez-vous gratuitement et commencez à générer des revenus dès aujourd'hui.
              </p>
              <Button variant="secondary" size="lg" className="hover-elevate">
                Inscrire ma voiture
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}