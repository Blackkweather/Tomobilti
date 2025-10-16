import { db } from "../server/db";
import { cars } from "@shared/schema";

async function checkCars() {
  try {
    const allCars = await db.select().from(cars);
    
    console.log(`\n📊 Total cars in database: ${allCars.length}\n`);
    
    if (allCars.length === 0) {
      console.log("❌ No cars found in database");
    } else {
      console.log("✅ Cars found:\n");
      allCars.forEach((car, index) => {
        console.log(`${index + 1}. ${car.make} ${car.model} (${car.year})`);
        console.log(`   📍 ${car.city}`);
        console.log(`   💰 £${car.pricePerDay}/day`);
        console.log(`   🖼️  Images: ${car.images?.length || 0}`);
        console.log("");
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking cars:", error);
    process.exit(1);
  }
}

checkCars();
