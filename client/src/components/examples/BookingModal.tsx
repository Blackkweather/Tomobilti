import { useState } from 'react';
import { Button } from '@/components/ui/button';
import BookingModal from '../BookingModal';
import carImage from '@assets/generated_images/Car_rental_listing_photo_bdcce465.png';
import ownerImage from '@assets/generated_images/Moroccan_car_owner_profile_7a556a9c.png';

export default function BookingModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  // todo: remove mock functionality
  const mockCar = {
    id: '1',
    title: 'BMW Série 3 - Berline Premium',
    location: 'Casablanca, Maarif',
    pricePerDay: 450,
    currency: 'MAD',
    rating: 4.8,
    reviewCount: 23,
    fuelType: 'Essence',
    transmission: 'automatic',
    seats: 5,
    image: carImage,
    ownerName: 'Ahmed Bennani',
    ownerImage: ownerImage
  };

  return (
    <div className="p-6">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-booking">
        Ouvrir Modal Réservation
      </Button>
      
      <BookingModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        car={mockCar}
      />
    </div>
  );
}