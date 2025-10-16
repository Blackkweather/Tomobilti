import { DatabaseStorage } from '../server/db_sqlite_simple.js';
import { randomUUID } from 'crypto';

const storage = new DatabaseStorage();

const specificCars = [
  {
    // Classic Car - Porsche 911 F Model
    title: "Porsche 911 F Model - Classic Sports Car",
    description: "Iconic classic Porsche 911 F Model with timeless design and exceptional performance. Perfect for enthusiasts who appreciate automotive heritage and driving excellence.",
    make: "Porsche",
    model: "911 F",
    year: 1973,
    fuelType: "essence",
    transmission: "manual",
    seats: 2,
    pricePerDay: "120.00",
    currency: "GBP",
    location: "London, Westminster",
    city: "London",
    latitude: 51.5074,
    longitude: -0.1278,
    images: ["/assets/CLASSIC.png"],
    isAvailable: true
  },
  {
    // Convertible - Jaguar F-Type
    title: "Jaguar F-Type Convertible - Luxury Sports Car",
    description: "Stunning Jaguar F-Type Convertible with breathtaking design and exhilarating performance. Experience the thrill of open-top driving with British luxury and style.",
    make: "Jaguar",
    model: "F-Type",
    year: 2023,
    fuelType: "essence",
    transmission: "automatic",
    seats: 2,
    pricePerDay: "95.00",
    currency: "GBP",
    location: "Manchester, City Centre",
    city: "Manchester",
    latitude: 53.4808,
    longitude: -2.2426,
    images: ["/assets/CONVERTIBLES.png"],
    isAvailable: true
  },
  {
    // Electric - Tesla Model X
    title: "Tesla Model X - Electric SUV",
    description: "Revolutionary Tesla Model X electric SUV with falcon-wing doors, autopilot capabilities, and zero emissions. Experience the future of automotive technology.",
    make: "Tesla",
    model: "Model X",
    year: 2023,
    fuelType: "electric",
    transmission: "automatic",
    seats: 7,
    pricePerDay: "110.00",
    currency: "GBP",
    location: "Edinburgh, New Town",
    city: "Edinburgh",
    latitude: 55.9533,
    longitude: -3.1883,
    images: ["/assets/ELECTRIC.png"],
    isAvailable: true
  },
  {
    // Sport Car - Jaguar F-Pace
    title: "Jaguar F-Pace Sport - Performance SUV",
    description: "Dynamic Jaguar F-Pace Sport combining SUV practicality with sports car performance. Featuring advanced technology and luxurious interior finishes.",
    make: "Jaguar",
    model: "F-Pace Sport",
    year: 2023,
    fuelType: "essence",
    transmission: "automatic",
    seats: 5,
    pricePerDay: "85.00",
    currency: "GBP",
    location: "Birmingham, City Centre",
    city: "Birmingham",
    latitude: 52.4862,
    longitude: -1.8904,
    images: ["/assets/Sport car.png"],
    isAvailable: true
  },
  {
    // SUV - Range Rover Evoque Sport
    title: "Range Rover Evoque Sport - Premium SUV",
    description: "Sophisticated Range Rover Evoque Sport with commanding presence and refined luxury. Perfect for urban adventures and countryside escapes.",
    make: "Range Rover",
    model: "Evoque Sport",
    year: 2023,
    fuelType: "essence",
    transmission: "automatic",
    seats: 5,
    pricePerDay: "75.00",
    currency: "GBP",
    location: "Liverpool, City Centre",
    city: "Liverpool",
    latitude: 53.4084,
    longitude: -2.9916,
    images: ["/assets/SUV.png"],
    isAvailable: true
  }
];

async function addSpecificCars() {
  console.log('🚗 Adding specific car models to database...');
  
  try {
    // Check if user exists, if not create one
    let ownerId;
    const existingUser = await storage.getUserByEmail('john.smith@example.com');
    
    if (!existingUser) {
      console.log('👤 Creating test user...');
      const testUser = await storage.createUser({
        firstName: 'John',
        lastName: 'Smith',
        email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk',
        password: 'password123',
        phone: '+44 20 1234 5678'
      });
      ownerId = testUser.id;
      console.log(`✅ Created test user: ${testUser.firstName} ${testUser.lastName}`);
    } else {
      ownerId = existingUser.id;
      console.log(`👤 Using existing user: ${existingUser.firstName} ${existingUser.lastName}`);
    }

    // Add each car
    for (const carData of specificCars) {
      console.log(`\n🚙 Adding ${carData.make} ${carData.model}...`);
      
      const car = await storage.createCar({
        ...carData,
        ownerId: ownerId
      });
      
      console.log(`✅ Added: ${car.title}`);
      console.log(`   📍 Location: ${car.location}`);
      console.log(`   💰 Price: £${car.pricePerDay}/day`);
      console.log(`   🖼️  Image: ${car.images[0]}`);
    }

    console.log('\n🎉 All specific cars added successfully!');
    
    // Get total count using searchCars
    const result = await storage.searchCars({ page: 1, limit: 1000 });
    console.log(`📊 Total cars in database: ${result.total}`);
    
  } catch (error) {
    console.error('❌ Error adding cars:', error);
  }
}

addSpecificCars();
