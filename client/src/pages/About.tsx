import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Users, Car, Shield, Award, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const stats = [
    { icon: Users, label: "Active Users", value: "10,000+" },
    { icon: Car, label: "Available Vehicles", value: "2,500+" },
    { icon: Shield, label: "Secure Rentals", value: "50,000+" },
    { icon: Award, label: "Average Rating", value: "4.8/5" }
  ];

  const team = [
    {
      name: "James Smith",
      role: "CEO & Founder",
      description: "Expert in shared mobility with 10 years of experience in the automotive sector."
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      description: "Software engineer passionate about innovative technological solutions."
    },
    {
      name: "Michael Brown",
      role: "Commercial Director",
      description: "Specialist in business development and strategic partnerships."
    }
  ];

  const values = [
    {
      title: "Trust",
      description: "We create a secure environment where owners and renters can interact with confidence."
    },
    {
      title: "Innovation",
      description: "We use the latest technologies to constantly improve the user experience."
    },
    {
      title: "Community",
      description: "We build a supportive community that promotes sharing and mutual aid."
    },
    {
      title: "Sustainability",
      description: "We promote more sustainable mobility by optimizing the use of existing vehicles."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Tomobilti
            </h1>
            <p className="text-xl mb-8">
              The first UK peer-to-peer vehicle sharing platform. 
              We connect car owners with renters for more accessible and sustainable mobility.
            </p>
            <Link href="/cars">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Discover Our Vehicles
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
            <h2 className="text-3xl font-bold text-center mb-12">Our Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Revolutionizing Mobility in the UK</h3>
                <p className="text-gray-700 mb-6">
                  At Tomobilti, we believe that every vehicle can be better utilized. 
                  Our platform allows UK residents to monetize their cars while 
                  offering an affordable and flexible alternative to traditional transport methods.
                </p>
                <p className="text-gray-700">
                  We are committed to creating a trusted community where shared mobility 
                  becomes the norm, thus helping to reduce urban congestion and environmental impact.
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
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
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
            <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-gray-600">
                    123 Oxford Street<br />
                    London, UK
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-gray-600">
                    +44 20 1234 5678<br />
                    Mon-Fri: 9am-6pm
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">
                    contact@tomobilti.co.uk<br />
                    support@tomobilti.co.uk
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
          <h2 className="text-3xl font-bold mb-6">Join the Mobility Revolution</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're an owner or renter, Tomobilti offers you a new way to think about mobility.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/become-host">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Become a Host
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}