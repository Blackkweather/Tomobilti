import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Car, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Star, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Edit
} from 'lucide-react';

// todo: remove mock functionality
const mockCars = [
  {
    id: '1',
    title: 'BMW Série 3',
    location: 'Casablanca',
    pricePerDay: 450,
    status: 'available',
    totalEarnings: 13500,
    bookingsCount: 15,
    rating: 4.8,
    image: '/api/placeholder/200/150'
  },
  {
    id: '2', 
    title: 'Peugeot 208',
    location: 'Rabat',
    pricePerDay: 280,
    status: 'rented',
    totalEarnings: 8400,
    bookingsCount: 12,
    rating: 4.6,
    image: '/api/placeholder/200/150'
  }
];

const mockBookings = [
  {
    id: 'b1',
    carTitle: 'BMW Série 3',
    renterName: 'Karim Alaoui',
    startDate: '2024-12-20',
    endDate: '2024-12-23',
    totalAmount: 1350,
    status: 'upcoming',
    renterImage: '/api/placeholder/40/40'
  },
  {
    id: 'b2',
    carTitle: 'Peugeot 208', 
    renterName: 'Sarah Bennani',
    startDate: '2024-12-15',
    endDate: '2024-12-17',
    totalAmount: 560,
    status: 'completed',
    renterImage: '/api/placeholder/40/40'
  }
];

const statusConfig = {
  available: { label: 'Disponible', variant: 'default' as const, icon: CheckCircle },
  rented: { label: 'Loué', variant: 'secondary' as const, icon: Clock },
  maintenance: { label: 'Maintenance', variant: 'destructive' as const, icon: XCircle }
};

const bookingStatusConfig = {
  upcoming: { label: 'À venir', variant: 'default' as const },
  active: { label: 'En cours', variant: 'secondary' as const },
  completed: { label: 'Terminé', variant: 'outline' as const }
};

export default function OwnerDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const handleAddCar = () => {
    console.log('Add new car clicked');
  };

  const handleEditCar = (carId: string) => {
    console.log('Edit car clicked:', carId);
  };

  const totalEarnings = mockCars.reduce((sum, car) => sum + car.totalEarnings, 0);
  const totalBookings = mockCars.reduce((sum, car) => sum + car.bookingsCount, 0);
  const averageRating = mockCars.reduce((sum, car) => sum + car.rating, 0) / mockCars.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord propriétaire</h1>
          <p className="text-muted-foreground">Gérez vos véhicules et réservations</p>
        </div>
        <Button onClick={handleAddCar} data-testid="button-add-car" className="hover-elevate active-elevate-2">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un véhicule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Gains totaux</p>
                <p className="text-2xl font-bold" data-testid="text-total-earnings">
                  {totalEarnings.toLocaleString()} MAD
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Réservations</p>
                <p className="text-2xl font-bold" data-testid="text-total-bookings">
                  {totalBookings}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Véhicules</p>
                <p className="text-2xl font-bold" data-testid="text-total-cars">
                  {mockCars.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
                <p className="text-2xl font-bold" data-testid="text-average-rating">
                  {averageRating.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="cars" data-testid="tab-cars">Mes véhicules</TabsTrigger>
          <TabsTrigger value="bookings" data-testid="tab-bookings">Réservations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Réservations récentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={booking.renterImage} alt={booking.renterName} />
                        <AvatarFallback>{booking.renterName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{booking.renterName}</p>
                        <p className="text-sm text-muted-foreground">{booking.carTitle}</p>
                      </div>
                    </div>
                    <Badge variant={bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig].variant}>
                      {bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig].label}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Taux d'occupation</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Gains ce mois</span>
                    <span className="font-semibold text-primary">4,200 MAD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Réservations ce mois</span>
                    <span className="font-semibold">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cars" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockCars.map((car) => {
              const StatusIcon = statusConfig[car.status as keyof typeof statusConfig].icon;
              return (
                <Card key={car.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img 
                        src={car.image} 
                        alt={car.title}
                        className="w-20 h-16 rounded-md object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{car.title}</h3>
                            <p className="text-sm text-muted-foreground">{car.location}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCar(car.id)}
                            data-testid={`button-edit-car-${car.id}`}
                            className="hover-elevate active-elevate-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={statusConfig[car.status as keyof typeof statusConfig].variant}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[car.status as keyof typeof statusConfig].label}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-sm">{car.rating}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Prix/jour</p>
                            <p className="font-semibold">{car.pricePerDay} MAD</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Gains totaux</p>
                            <p className="font-semibold text-primary">{car.totalEarnings.toLocaleString()} MAD</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <div className="space-y-4">
            {mockBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={booking.renterImage} alt={booking.renterName} />
                        <AvatarFallback>{booking.renterName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{booking.renterName}</h3>
                        <p className="text-sm text-muted-foreground">{booking.carTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.startDate} au {booking.endDate}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant={bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig].variant}>
                        {bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig].label}
                      </Badge>
                      <p className="text-lg font-semibold text-primary mt-2">
                        {booking.totalAmount} MAD
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}