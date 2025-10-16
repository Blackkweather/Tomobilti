import { db } from "../server/db";
import { cars, users } from "@shared/schema";
import { eq } from "drizzle-orm";

const demoCars = [
  {
    title: "Mercedes-Benz G-Class (G-Wagon) 2023",
    make: "Mercedes-Benz",
    model: "G-Class",
    year: 2023,
    fuelType: "diesel",
    transmission: "automatic",
    seats: 5,
    pricePerDay: "250.00",
    city: "London",
    location: "Mayfair, London",
    description: "Luxury SUV with exceptional off-road capability. Perfect for city driving and weekend adventures.",
    images: [
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg",
      "https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg"
    ],
    mileage: 15000,
    condition: "excellent"
  },
  {
    title: "BMW M4 Competition 2024",
    make: "BMW",
    model: "M4",
    year: 2024,
    fuelType: "essence",
    transmission: "automatic",
    seats: 4,
    pricePerDay: "180.00",
    city: "Manchester",
    location: "City Centre, Manchester",
    description: "High-performance sports coupe with 503 HP. Thrilling driving experience guaranteed.",
    images: [
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg"
    ],
    mileage: 5000,
    condition: "excellent"
  },
  {
    title: "Tesla Model 3 Long Range 2024",
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    fuelType: "electric",
    transmission: "automatic",
    seats: 5,
    pricePerDay: "95.00",
    city: "Birmingham",
    location: "Edgbaston, Birmingham",
    description: "Premium electric sedan with autopilot. Zero emissions, maximum technology.",
    images: [
      "https://images.pexels.com/photos/13861/IMG_3496bfree.jpg"
    ],
    mileage: 8000,
    condition: "excellent"
  },
  {
    title: "Range Rover Sport HSE 2023",
    make: "Land Rover",
    model: "Range Rover Sport",
    year: 2023,
    fuelType: "hybrid",
    transmission: "automatic",
    seats: 7,
    pricePerDay: "220.00",
    city: "Edinburgh",
    location: "New Town, Edinburgh",
    description: "Luxury SUV combining performance with comfort. Perfect for family trips.",
    images: [
      "https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg"
    ],
    mileage: 12000,
    condition: "excellent"
  },
  {
    title: "Porsche 911 Carrera 2023",
    make: "Porsche",
    model: "911",
    year: 2023,
    fuelType: "essence",
    transmission: "automatic",
    seats: 4,
    pricePerDay: "300.00",
    city: "London",
    location: "Knightsbridge, London",
    description: "Iconic sports car with legendary performance. The ultimate driving machine.",
    images: [
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg"
    ],
    mileage: 7000,
    condition: "excellent"
  },
  {
    title: "Audi e-tron GT 2024",
    make: "Audi",
    model: "e-tron GT",
    year: 2024,
    fuelType: "electric",
    transmission: "automatic",
    seats: 4,
    pricePerDay: "200.00",
    city: "Bristol",
    location: "Clifton, Bristol",
    description: "Electric grand tourer with stunning design and performance.",
    images: [
      "https://images.pexels.com/photos/13861/IMG_3496bfree.jpg"
    ],
    mileage: 3000,
    condition: "excellent"
  },
  {
    title: "Volkswagen Golf GTI 2023",
    make: "Volkswagen",
    model: "Golf GTI",
    year: 2023,
    fuelType: "essence",
    transmission: "manual",
    seats: 5,
    pricePerDay: "65.00",
    city: "Leeds",
    location: "City Centre, Leeds",
    description: "The original hot hatch. Fun, practical, and affordable.",
    images: [
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg"
    ],
    mileage: 18000,
    condition: "good"
  },
  {
    title: "Mini Cooper S 2024",
    make: "Mini",
    model: "Cooper S",
    year: 2024,
    fuelType: "essence",
    transmission: "automatic",
    seats: 4,
    pricePerDay: "55.00",
    city: "Oxford",
    location: "City Centre, Oxford",
    description: "Iconic British design meets modern performance. Perfect for city driving.",
    images: [
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg"
    ],
    mileage: 6000,
    condition: "excellent"
  },
  {
    title: "Jaguar F-Type R 2023",
    make: "Jaguar",
    model: "F-Type",
    year: 2023,
    fuelType: "essence",
    transmission: "automatic",
    seats: 2,
    pricePerDay: "280.00",
    city: "Cambridge",
    location: "City Centre, Cambridge",
    description: "British sports car with supercharged V8. Pure driving pleasure.",
    images: [
      "https://images.pexels.com/photos/16626609/pexels-photo-16626609.jpeg",
      "https://images.pexels.com/photos/20695257/pexels-photo-20695257.jpeg"
    ],
    mileage: 9000,
    condition: "excellent"
  },
  {
    title: "Ford Mustang GT 2024",
    make: "Ford",
    model: "Mustang",
    year: 2024,
    fuelType: "essence",
    transmission: "automatic",
    seats: 4,
    pricePerDay: "150.00",
    city: "Liverpool",
    location: "City Centre, Liverpool",
    description: "American muscle car with iconic V8 sound. Unforgettable experience.",
    images: [
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg"
    ],
    mileage: 11000,
    condition: "excellent"
  }
];

async function seedCars() {
  try {
    console.log("🌱 Starting car seeding...");

    // Get or create demo owner
    let demoOwner = await db.query.users.findFirst({
      where: eq(users.email, "demo.owner@sharewheelz.uk")
    });

    if (!demoOwner) {
      console.log("Creating demo owner...");
      const [newOwner] = await db.insert(users).values({
        email: "demo.owner@sharewheelz.uk",
        password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxIvJ7K6.", // Demo123!
        firstName: "Demo",
        lastName: "Owner",
        userType: "owner",
        phone: "+44 20 1234 5678",
        isEmailVerified: true
      }).returning();
      demoOwner = newOwner;
    }

    console.log(`✅ Demo owner ready: ${demoOwner.email}`);

    // Insert cars
    for (const car of demoCars) {
      await db.insert(cars).values({
        ownerId: demoOwner.id,
        ...car,
        isAvailable: true,
        hasAirbags: true,
        hasAbs: true,
        hasEsp: true,
        hasBluetooth: true,
        hasGps: true,
        hasParkingSensors: true,
        hasAlarm: true,
        hasImmobilizer: true
      });
      console.log(`✅ Added: ${car.title}`);
    }

    console.log(`\n🎉 Successfully seeded ${demoCars.length} cars!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding cars:", error);
    process.exit(1);
  }
}

seedCars();
