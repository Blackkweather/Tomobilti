import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Fuel, Users, Star, Shield, Clock } from 'lucide-react';

import type { Car } from '@shared/schema';

interface BookingModalProps {
  car: Car & {
    owner?: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
    rating?: number;
    reviewCount?: number;
  };
  onClose: () => void;
}

export default function BookingModal({ car, onClose }: BookingModalProps) {
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    startTime: '10:00',
    endTime: '18:00',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!car) return null;

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const validateDates = () => {
    if (!bookingData.startDate || !bookingData.endDate) return { isValid: false, error: '' };
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
      return { isValid: false, error: 'La date de début ne peut pas être dans le passé' };
    }
    if (end <= start) {
      return { isValid: false, error: 'La date de fin doit être après la date de début' };
    }
    return { isValid: true, error: '' };
  };

  const { days, subtotal, serviceFee, insurance, total, dateError } = useMemo(() => {
    const validation = validateDates();
    if (!validation.isValid) {
      return { days: 0, subtotal: 0, serviceFee: 0, insurance: 0, total: 0, dateError: validation.error };
    }
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const calculatedSubtotal = calculatedDays * parseFloat(car.pricePerDay);
    const calculatedServiceFee = Math.round(calculatedSubtotal * 0.05);
    const calculatedInsurance = Math.round(calculatedSubtotal * 0.03);
    const calculatedTotal = calculatedSubtotal + calculatedServiceFee + calculatedInsurance;
    
    return {
      days: calculatedDays,
      subtotal: calculatedSubtotal,
      serviceFee: calculatedServiceFee,
      insurance: calculatedInsurance,
      total: calculatedTotal,
      dateError: ''
    };
  }, [bookingData.startDate, bookingData.endDate, car.pricePerDay]);

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    console.log('Booking confirmed:', { car: car.id, ...bookingData, total });
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      // Show success message
    }, 2000);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="booking-description">
        <DialogHeader>
          <DialogTitle>Réserver ce véhicule</DialogTitle>
          <p id="booking-description" className="sr-only">Formulaire de réservation pour le véhicule sélectionné avec calcul automatique des prix et dates de location.</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Car Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img 
                  src={car.images && car.images.length > 0 ? car.images[0] : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&auto=format'} 
                  alt={car.title}
                  className="w-20 h-16 rounded-lg object-cover"
                />
                
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">{car.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {car.city}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{car.rating}</span>
                      <span className="text-muted-foreground">({car.reviewCount} avis)</span>
                    </div>
                    <Badge variant="outline">{car.fuelType}</Badge>
                    <span className="text-muted-foreground">{car.seats} places</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={car.owner?.profileImage} />
                      <AvatarFallback className="text-xs">
                        {car.owner ? `${car.owner.firstName[0]}${car.owner.lastName[0]}` : 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {car.owner ? `${car.owner.firstName} ${car.owner.lastName}` : 'Propriétaire'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Dates et horaires
              </h3>
              
              {dateError && (
                <div className="text-red-600 text-sm">{dateError}</div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input
                    type="date"
                    value={bookingData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    data-testid="input-booking-start-date"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Heure de début</Label>
                  <Input
                    type="time"
                    value={bookingData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    data-testid="input-booking-start-time"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input
                    type="date"
                    value={bookingData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    data-testid="input-booking-end-date"
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Heure de fin</Label>
                  <Input
                    type="time"
                    value={bookingData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    data-testid="input-booking-end-time"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Message au propriétaire (optionnel)</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Présentez-vous et expliquez l'utilisation prévue du véhicule..."
                  value={bookingData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  data-testid="input-booking-message"
                />
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4">
              <h3 className="font-semibold">Récapitulatif de la réservation</h3>
              
              {days > 0 && (
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span>{car.pricePerDay} {car.currency} x {days} jour{days > 1 ? 's' : ''}</span>
                      <span data-testid="text-subtotal">{subtotal} {car.currency}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Frais de service</span>
                      <span data-testid="text-service-fee">{serviceFee} {car.currency}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Assurance</span>
                      <span data-testid="text-insurance">{insurance} {car.currency}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary" data-testid="text-total">
                        {total} {car.currency}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Protection info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Protection incluse</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Confirmation instantanée</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Support 24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} data-testid="button-cancel-booking">
              Annuler
            </Button>
            <Button 
              onClick={handleConfirmBooking} 
              disabled={!bookingData.startDate || !bookingData.endDate || isLoading}
              data-testid="button-confirm-booking"
              className="hover-elevate active-elevate-2"
            >
              {isLoading ? 'Confirmation...' : `Confirmer - ${total} ${car.currency}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}