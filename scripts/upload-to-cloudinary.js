import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const images = [
  // F-Pace SUV (4 images)
  { path: 'f pace suv.jpeg', name: 'f-pace-suv-1' },
  { path: 'f pace suv 2.jpeg', name: 'f-pace-suv-2' },
  { path: 'f pace suv 3.jpeg', name: 'f-pace-suv-3' },
  { path: 'f pace suv 4.jpeg', name: 'f-pace-suv-4' },
  
  // Ferrari (4 images)
  { path: 'Ferrari.jpg', name: 'ferrari-1' },
  { path: 'ferrari 2.jpg', name: 'ferrari-2' },
  { path: 'ferrari 3.jpg', name: 'ferrari-3' },
  { path: 'ferrari 4.jpg', name: 'ferrari-4' },
  
  // F-Type Convertible (2 images)
  { path: 'jaguar f type convertible 1.jpg', name: 'f-type-convertible-1' },
  { path: 'jaguar f type convertible 2.jpeg', name: 'f-type-convertible-2' },
  
  // Range Rover (1 image)
  { path: 'Range Rover.jpg', name: 'range-rover-1' },
  
  // Tesla (1 image)
  { path: 'Tesla.jpg', name: 'tesla-1' },
];

async function uploadImages() {
  console.log('Starting Cloudinary upload...\n');
  const results = {};

  for (const image of images) {
    try {
      const imagePath = join(__dirname, '..', 'client', 'public', 'assets', image.path);
      console.log(`Uploading ${image.path}...`);
      
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: 'sharewheelz/cars',
        public_id: image.name,
        transformation: [
          { width: 1200, height: 800, crop: 'fill', quality: 'auto' },
        ],
      });
      
      console.log(`✅ Uploaded: ${result.secure_url}\n`);
      
      if (!results[image.name.split('-')[0]]) {
        results[image.name.split('-')[0]] = [];
      }
      results[image.name.split('-')[0]].push(result.secure_url);
      
    } catch (error) {
      console.error(`❌ Failed to upload ${image.path}:`, error.message);
    }
  }

  console.log('\n=== Upload Complete ===\n');
  console.log('URLs by car:');
  console.log(JSON.stringify(results, null, 2));
}

uploadImages();
