import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Car, Shield, Award, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const stats = [
    { icon: Users, label: "Utilisateurs actifs", value: "10,000+" },
    { icon: Car, label: "Véhicules disponibles", value: "2,500+" },
    { icon: Shield, label: "Locations sécurisées", value: "50,000+" },
    { icon: Award, label: "Note moyenne", value: "4.8/5" }
  ];

  const team = [
    {
      name: "Youssef Alami",
      role: "CEO & Fondateur",
      description: "Expert en mobilité partagée avec 10 ans d'expérience dans le secteur automobile."
    },
    {
      name: "Fatima Benali",
      role: "CTO",
      description: "Ingénieure logiciel passionnée par les solutions technologiques innovantes."
    },
    {
      name: "Ahmed Tazi",
      role: "Directeur Commercial",
      description: "Spécialiste du développement commercial et des partenariats stratégiques."
    }
  ];

  const values = [
    {
      title: "Confiance",
      description: "Nous créons un environnement sécurisé où propriétaires et locataires peuvent interagir en toute confiance."
    },
    {
      title: "Innovation",
      description: "Nous utilisons les dernières technologies pour améliorer constamment l'expérience utilisateur."
    },
    {
      title: "Communauté",
      description: "Nous construisons une communauté solidaire qui favorise le partage et l'entraide."
    },
    {
      title: "Durabilité",
      description: "Nous promouvons une mobilité plus durable en optimisant l'utilisation des véhicules existants."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              À propos de Tomobilti
            </h1>
            <p className="text-xl mb-8">
              La première plateforme marocaine de partage de véhicules entre particuliers. 
              Nous connectons les propriétaires de voitures avec des locataires pour une mobilité plus accessible et durable.
            </p>
            <Link href="/cars">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Découvrir nos véhicules
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Notre Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Révolutionner la mobilité au Maroc</h3>
                <p className="text-gray-700 mb-6">
                  Chez Tomobilti, nous croyons que chaque véhicule peut être mieux utilisé. 
                  Notre plateforme permet aux Marocains de rentabiliser leurs voitures tout en 
                  offrant une alternative abordable et flexible aux moyens de transport traditionnels.
                </p>
                <p className="text-gray-700">
                  Nous nous engageons à créer une communauté de confiance où la mobilité partagée 
                  devient la norme, contribuant ainsi à réduire la congestion urbaine et l'impact environnemental.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <Card key={value.title}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{value.title}</h4>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre Équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={member.name} className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-blue-600" />
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <Badge variant="secondary">{member.role}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Contactez-nous</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Adresse</h3>
                  <p className="text-gray-600">
                    123 Boulevard Mohammed V<br />
                    Casablanca, Maroc
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Téléphone</h3>
                  <p className="text-gray-600">
                    +212 5 22 00 00 00<br />
                    Lun-Ven: 9h-18h
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">
                    contact@tomobilti.ma<br />
                    support@tomobilti.ma
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Rejoignez la révolution de la mobilité</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Que vous soyez propriétaire ou locataire, Tomobilti vous offre une nouvelle façon de penser la mobilité.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                S'inscrire maintenant
              </Button>
            </Link>
            <Link href="/become-host">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Devenir hôte
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}