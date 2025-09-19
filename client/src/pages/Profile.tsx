import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Car, Calendar, MapPin } from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data
  const user = {
    id: "1",
    firstName: "Ahmed",
    lastName: "Bennani", 
    email: "ahmed.bennani@example.com",
    phone: "+212 6 12 34 56 78",
    userType: "owner",
    rating: 4.8,
    reviewCount: 24,
    joinDate: "Mars 2023",
    totalBookings: 45,
    totalEarnings: 12500
  };

  const bookings = [
    {
      id: "1",
      carTitle: "Dacia Logan - Berline Familiale",
      dates: "15-17 Jan 2024",
      status: "completed",
      amount: "500 MAD",
      location: "Casablanca"
    },
    {
      id: "2", 
      carTitle: "Renault Clio - Citadine Moderne",
      dates: "22-24 Jan 2024",
      status: "upcoming",
      amount: "640 MAD",
      location: "Rabat"
    }
  ];

  const reviews = [
    {
      id: "1",
      reviewer: "Fatima Z.",
      rating: 5,
      comment: "Excellente voiture, très propre et confortable. Ahmed est un propriétaire très professionnel.",
      date: "Il y a 2 semaines",
      carTitle: "Dacia Logan"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">
                  {user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
                <div className="flex items-center gap-4 mt-2 text-gray-600">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {user.rating} ({user.reviewCount} avis)
                  </span>
                  <Badge variant={user.userType === "owner" ? "default" : "secondary"}>
                    {user.userType === "owner" ? "Propriétaire" : "Locataire"}
                  </Badge>
                  <span>Membre depuis {user.joinDate}</span>
                </div>
                {user.userType === "owner" && (
                  <div className="flex gap-6 mt-4">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{user.totalEarnings} MAD</div>
                      <div className="text-sm text-gray-600">Gains totaux</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{user.totalBookings}</div>
                      <div className="text-sm text-gray-600">Réservations</div>
                    </div>
                  </div>
                )}
              </div>
              <Button 
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Sauvegarder" : "Modifier profil"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input 
                      id="firstName" 
                      value={user.firstName}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input 
                      id="lastName" 
                      value={user.lastName}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={user.email}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    value={user.phone}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Mes réservations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Car className="h-8 w-8 text-gray-400" />
                        <div>
                          <div className="font-semibold">{booking.carTitle}</div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {booking.dates}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {booking.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{booking.amount}</div>
                        <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                          {booking.status === "completed" ? "Terminé" : "À venir"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Avis reçus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{review.reviewer[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{review.reviewer}</div>
                            <div className="text-sm text-gray-600">{review.carTitle}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">{review.date}</div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Changer le mot de passe</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}