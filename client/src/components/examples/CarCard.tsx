import CarCard from '../CarCard';
import carImage1 from '@assets/generated_images/Car_rental_listing_photo_bdcce465.png';
import carImage2 from '@assets/generated_images/Electric_car_in_Morocco_b06b165b.png';
import ownerImage from '@assets/generated_images/Moroccan_car_owner_profile_7a556a9c.png';

export default function CarCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* todo: remove mock functionality */}
      <CarCard
        id="1"
        title="BMW Série 3 - Berline Premium"
        location="Casablanca, Maarif"
        pricePerDay={450}
        currency="MAD"
        rating={4.8}
        reviewCount={23}
        fuelType="essence"
        transmission="automatic"
        seats={5}
        image={carImage1}
        ownerName="Ahmed Bennani"
        ownerImage={ownerImage}
        isAvailable={true}
      />
      
      <CarCard
        id="2"
        title="Tesla Model 3 - Électrique"
        location="Rabat, Agdal"
        pricePerDay={650}
        currency="MAD"
        rating={4.9}
        reviewCount={31}
        fuelType="electric"
        transmission="automatic"
        seats={5}
        image={carImage2}
        ownerName="Youssef Alami"
        isAvailable={true}
      />
      
      <CarCard
        id="3"
        title="Peugeot 208 - Citadine"
        location="Marrakech, Guéliz"
        pricePerDay={280}
        currency="MAD"
        rating={4.6}
        reviewCount={15}
        fuelType="diesel"
        transmission="manual"
        seats={4}
        image={carImage1}
        ownerName="Fatima Zahra"
        isAvailable={false}
      />
    </div>
  );
}