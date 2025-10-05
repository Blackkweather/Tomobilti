import { DatabaseStorage } from '../server/db.ts';

async function addCarsToProduction() {
  try {
    console.log('🚗 Adding cars to production database...');
    
    const storage = new DatabaseStorage();
    
    // Check if we have any users
    const allUsers = await storage.getAllUsers();
    console.log(`Found ${allUsers.length} users in database`);
    
    if (allUsers.length === 0) {
      console.log('❌ No users found. Initializing sample data first...');
      await storage.initializeSampleData();
      console.log('✅ Sample data initialized');
    }
    
    // Get users again after potential initialization
    const users = await storage.getAllUsers();
    const owners = users.filter(user => user.userType === 'owner');
    
    if (owners.length === 0) {
      console.log('❌ No car owners found. Creating sample owners...');
      
      // Create sample owners
      const owner1 = await storage.createUser({
        email: "ahmed.bennani@example.com",
        password: "demo_password_123",
        firstName: "Ahmed",
        lastName: "Bennani",
        phone: "+212 6 12 34 56 78",
        userType: "owner"
      });
      
      const owner2 = await storage.createUser({
        email: "youssef.alami@example.com", 
        password: "demo_password_123",
        firstName: "Youssef",
        lastName: "Alami",
        phone: "+212 6 23 45 67 89",
        userType: "owner"
      });
      
      const owner3 = await storage.createUser({
        email: "sara.idrissi@example.com", 
        password: "demo_password_123",
        firstName: "Sara",
        lastName: "Idrissi",
        phone: "+212 6 45 67 89 01",
        userType: "owner"
      });
      
      owners.push(owner1, owner2, owner3);
    }
    
    // Check if we have cars
    const allCars = await storage.getAllCars();
    console.log(`Found ${allCars.length} cars in database`);
    
    if (allCars.length === 0) {
      console.log('🚗 No cars found. Creating sample cars...');
      
      // Create sample cars
      const cars = [
        {
          ownerId: owners[0].id,
          title: "Dacia Logan - Berline Familiale",
          description: "Berline spacieuse et économique, parfaite pour les familles. Climatisation, GPS intégré.",
          make: "Dacia",
          model: "Logan",
          year: 2021,
          fuelType: "essence",
          transmission: "manual",
          seats: 5,
          pricePerDay: "250.00",
          location: "Casablanca, Maarif",
          city: "Casablanca",
          images: ["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format"],
          isAvailable: true
        },
        {
          ownerId: owners[1].id,
          title: "Renault Clio - Citadine Moderne",
          description: "Citadine moderne avec toutes les commodités. Idéale pour la ville, consommation réduite.",
          make: "Renault",
          model: "Clio",
          year: 2022,
          fuelType: "essence",
          transmission: "automatic", 
          seats: 5,
          pricePerDay: "320.00",
          location: "Rabat, Agdal",
          city: "Rabat",
          images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format"],
          isAvailable: true
        },
        {
          ownerId: owners[0].id,
          title: "Peugeot 208 - Compacte Élégante",
          description: "Compacte élégante avec finitions soignées. Parfaite pour les déplacements urbains.",
          make: "Peugeot",
          model: "208",
          year: 2020,
          fuelType: "diesel",
          transmission: "manual",
          seats: 4,
          pricePerDay: "280.00",
          location: "Marrakech, Guéliz",
          city: "Marrakech",
          images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format"],
          isAvailable: true
        },
        {
          ownerId: owners[2].id,
          title: "Hyundai Tucson - SUV Confortable",
          description: "SUV spacieux et confortable pour vos voyages. 4x4, climatisation automatique.",
          make: "Hyundai",
          model: "Tucson",
          year: 2021,
          fuelType: "diesel",
          transmission: "automatic",
          seats: 7,
          pricePerDay: "480.00",
          location: "Fès, Centre-ville",
          city: "Fès",
          images: ["https://images.unsplash.com/photo-1606664515524-ed2e786a0bd6?w=800&h=600&fit=crop&auto=format"],
          isAvailable: true
        },
        {
          ownerId: owners[1].id,
          title: "Volkswagen Golf - Compacte Premium",
          description: "Compacte premium avec finitions haut de gamme. Conduite sportive et confortable.",
          make: "Volkswagen",
          model: "Golf",
          year: 2021,
          fuelType: "essence",
          transmission: "automatic",
          seats: 5,
          pricePerDay: "380.00",
          location: "Tanger, Centre",
          city: "Tanger",
          images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&auto=format"],
          isAvailable: true
        },
        {
          ownerId: owners[2].id,
          title: "Ford Focus - Berline Sportive",
          description: "Berline sportive avec excellent rapport qualité-prix. Conduite dynamique assurée.",
          make: "Ford",
          model: "Focus",
          year: 2020,
          fuelType: "essence",
          transmission: "manual",
          seats: 5,
          pricePerDay: "300.00",
          location: "Agadir, Secteur Touristique",
          city: "Agadir",
          images: ["https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop&auto=format"],
          isAvailable: true
        }
      ];
      
      for (const carData of cars) {
        const car = await storage.createCar(carData);
        console.log(`✅ Created car: ${car.title}`);
      }
      
      console.log(`🎉 Successfully created ${cars.length} cars!`);
    } else {
      console.log('✅ Cars already exist in database');
    }
    
    // Final check
    const finalCars = await storage.getAllCars();
    console.log(`📊 Total cars in database: ${finalCars.length}`);
    
    if (finalCars.length > 0) {
      console.log('🎉 Cars are now available on the website!');
    }
    
  } catch (error) {
    console.error('❌ Error adding cars:', error);
  }
}

addCarsToProduction();
