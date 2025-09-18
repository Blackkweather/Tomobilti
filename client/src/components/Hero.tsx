import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CalendarDays, MapPin, Search, Users } from 'lucide-react';
import heroImage from '@assets/generated_images/Moroccan_scenic_car_journey_81c68231.png';

export default function Hero() {
  const [searchData, setSearchData] = useState({
    location: '',
    startDate: '',
    endDate: '',
    guests: '2'
  });

  const handleSearch = () => {
    console.log('Hero search triggered:', searchData);
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Headlines */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Louez une voiture au
              <span className="block text-primary-foreground bg-primary/20 backdrop-blur-sm rounded-lg px-4 py-2 mt-2 inline-block">
                Maroc
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto">
              Découvrez le Maroc avec des véhicules locaux. 
              De Casablanca à Marrakech, trouvez la voiture parfaite.
            </p>
          </div>

          {/* Search Card */}
          <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-xl max-w-4xl mx-auto">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Lieu
                  </label>
                  <Input
                    data-testid="input-hero-location"
                    placeholder="Casablanca, Rabat, Marrakech..."
                    value={searchData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="bg-background"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Début
                  </label>
                  <Input
                    data-testid="input-hero-start-date"
                    type="date"
                    value={searchData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="bg-background"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Fin
                  </label>
                  <Input
                    data-testid="input-hero-end-date"
                    type="date"
                    value={searchData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="bg-background"
                  />
                </div>

                {/* Search Button */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2 opacity-0">
                    <Users className="h-4 w-4" />
                    Action
                  </label>
                  <Button 
                    onClick={handleSearch}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 hover-elevate active-elevate-2"
                    data-testid="button-hero-search"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-200 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="font-semibold">Tous carburants</div>
              <div>Essence, Diesel, Électrique</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Paiement sécurisé</div>
              <div>En Dirhams (MAD)</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Support 24/7</div>
              <div>En français et arabe</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}