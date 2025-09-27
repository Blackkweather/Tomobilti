// Demo file to show how the new car image system works
import { getSpecificCarImage, getCarImage } from './carImages';

// Example cars to demonstrate the image matching
const exampleCars = [
  { make: 'BMW', model: '3 Series', title: 'BMW 3 Series - Premium Sedan' },
  { make: 'Tesla', model: 'Model S', title: 'Tesla Model S - Electric Luxury' },
  { make: 'Porsche', model: '911', title: 'Porsche 911 - Sports Car' },
  { make: 'Mercedes', model: 'C-Class', title: 'Mercedes C-Class - Luxury Sedan' },
  { make: 'Audi', model: 'A4', title: 'Audi A4 - Premium Sedan' },
  { make: 'Ford', model: 'Mustang', title: 'Ford Mustang - Sports Car' },
  { make: 'Toyota', model: 'Prius', title: 'Toyota Prius - Hybrid' },
  { make: 'Range Rover', model: 'Sport', title: 'Range Rover Sport - Luxury SUV' },
  { make: 'Honda', model: 'Civic', title: 'Honda Civic - Compact Car' },
  { make: 'Nissan', model: 'Leaf', title: 'Nissan Leaf - Electric Car' }
];

// Function to demonstrate image matching
export const demonstrateCarImages = () => {
  console.log('🚗 Car Image System Demo:');
  console.log('========================');
  
  exampleCars.forEach(car => {
    const staticImage = getCarImage(car);
    const dynamicImage = getSpecificCarImage(car);
    
    console.log(`\n${car.make} ${car.model}:`);
    console.log(`  Static Image: ${staticImage}`);
    console.log(`  Dynamic Image: ${dynamicImage}`);
  });
  
  console.log('\n✨ The system now searches for real car images by make and model!');
  console.log('📸 Dynamic images use Unsplash to find actual photos of the specific car.');
  console.log('🔄 Static images fall back to our curated collection if dynamic fails.');
};

// Export for use in components
export { exampleCars };
