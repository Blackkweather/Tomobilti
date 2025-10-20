import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageUrls = [
  // F-Pace SUV
  'https://res.cloudinary.com/desowqsmy/image/upload/v1760986107/sharewheelz/cars/f-pace-suv-1.jpg',
  'https://res.cloudinary.com/desowqsmy/image/upload/v1760986109/sharewheelz/cars/f-pace-suv-2.jpg',
  'https://res.cloudinary.com/desowqsmy/image/upload/v1760986110/sharewheelz/cars/f-pace-suv-3.jpg',
  'https://res.cloudinary.com/desowqsmy/image/upload/v1760986111/sharewheelz/cars/f-pace-suv-4.jpg',
  
  // Ferrari
  'https://res.cloudinary.com/desowqsmy/image/upload/v1760986113/sharewheelz/cars/ferrari-1.jpg',
  'https://res.cloudinary.com/desowqsmy/image/upload/v1760986114/sharewheelz/cars/ferrari-2.jpg',
  'https://res.cloudinary.com/desowqsmy/image/upload/v1760986115/sharewheelz/cars/ferrari-3.jpg',
  'https://res.cloudinary.com/desowqsmy/image/upload/v1760986116/sharewheelz/cars/ferrari-4.jpg',
  
  // F-Type Convertible
  'https://res.cloudinary.com/desowqsmy/image/upload/v1760986118/sharewheelz/cars/f-type-convertible-1.jpg',
  'https://res.cloudinary.com/desowqsmy/image/upload/v1760986119/sharewheelz/cars/f-type-convertible-2.jpg',
  
  // Range Rover
  'https://res.cloudinary.com/desowqsmy/image/upload/v1760986120/sharewheelz/cars/range-rover-1.png',
  
  // Tesla
  'https://res.cloudinary.com/desowqsmy/image/upload/v1760986123/sharewheelz/cars/tesla-1.jpg',
];

async function verifyImages() {
  console.log('🔍 Verifying Cloudinary images...\n');
  
  let successCount = 0;
  let failCount = 0;

  for (const url of imageUrls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      
      if (response.ok) {
        console.log(`✅ ${url.split('/').pop()} - OK (${response.status})`);
        successCount++;
      } else {
        console.log(`❌ ${url.split('/').pop()} - FAILED (${response.status})`);
        failCount++;
      }
    } catch (error) {
      console.log(`❌ ${url.split('/').pop()} - ERROR: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n=== Verification Complete ===');
  console.log(`✅ Success: ${successCount}/${imageUrls.length}`);
  console.log(`❌ Failed: ${failCount}/${imageUrls.length}`);
  
  if (successCount === imageUrls.length) {
    console.log('\n🎉 All images are accessible on Cloudinary CDN!');
  } else {
    console.log('\n⚠️  Some images are not accessible. Check the URLs above.');
  }
}

// Also list all images in the folder
async function listCloudinaryImages() {
  console.log('\n📂 Listing all images in sharewheelz/cars folder...\n');
  
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'sharewheelz/cars',
      max_results: 50
    });
    
    console.log(`Found ${result.resources.length} images:\n`);
    result.resources.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.public_id}`);
      console.log(`   URL: ${resource.secure_url}`);
      console.log(`   Size: ${(resource.bytes / 1024).toFixed(2)} KB`);
      console.log(`   Format: ${resource.format}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error listing images:', error.message);
  }
}

(async () => {
  await verifyImages();
  await listCloudinaryImages();
})();
