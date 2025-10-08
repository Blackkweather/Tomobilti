#!/usr/bin/env node

/**
 * ShareWheelz Image Optimization Script
 * Optimizes all images for web delivery
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('🖼️ ShareWheelz Image Optimization');
console.log('==================================
');

async function optimizeAllImages() {
  const inputDir = path.join(process.cwd(), 'client/public/assets');
  const outputDir = path.join(process.cwd(), 'client/public/assets/optimized');
  
  if (!fs.existsSync(inputDir)) {
    console.log('❌ Assets directory not found');
    return;
  }

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(file)
  );

  console.log(`Found ${imageFiles.length} images to optimize...
`);

  const results = [];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const fileName = path.basename(file, path.extname(file));
    
    console.log(`Optimizing ${file}...`);
    
    try {
      // Get original size
      const originalStats = fs.statSync(inputPath);
      const originalSize = originalStats.size;
      totalOriginalSize += originalSize;

      // Generate multiple formats and sizes
      const formats = [
        { ext: 'webp', quality: 85 },
        { ext: 'avif', quality: 80 },
        { ext: 'jpg', quality: 90 }
      ];

      const sizes = [
        { width: 400, height: 300, suffix: 'sm' },
        { width: 800, height: 600, suffix: 'md' },
        { width: 1200, height: 900, suffix: 'lg' },
        { width: 1920, height: 1080, suffix: 'xl' }
      ];

      for (const format of formats) {
        for (const size of sizes) {
          const outputPath = path.join(outputDir, `${fileName}_${size.suffix}.${format.ext}`);
          
          await sharp(inputPath)
            .resize(size.width, size.height, { 
              fit: 'cover',
              withoutEnlargement: true 
            })
            [format.ext]({ quality: format.quality })
            .toFile(outputPath);
          
          const optimizedStats = fs.statSync(outputPath);
          totalOptimizedSize += optimizedStats.size;
        }
      }

      const compressionRatio = (originalSize - (totalOptimizedSize - totalOriginalSize + originalSize)) / originalSize;
      
      results.push({
        file,
        originalSize,
        compressionRatio: compressionRatio * 100
      });

      console.log(`   ✅ ${file}: ${(compressionRatio * 100).toFixed(1)}% smaller`);

    } catch (error) {
      console.error(`   ❌ Failed to optimize ${file}:`, error.message);
    }
  }

  // Generate summary
  console.log('\n📊 OPTIMIZATION SUMMARY');
  console.log('=======================');
  console.log(`Total images processed: ${results.length}`);
  console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings: ${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Average compression: ${(results.reduce((sum, r) => sum + r.compressionRatio, 0) / results.length).toFixed(1)}%`);

  // Generate responsive image manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    images: results.map(result => ({
      original: result.file,
      optimized: {
        webp: sizes.map(size => `${path.basename(result.file, path.extname(result.file))}_${size.suffix}.webp`),
        avif: sizes.map(size => `${path.basename(result.file, path.extname(result.file))}_${size.suffix}.avif`),
        jpg: sizes.map(size => `${path.basename(result.file, path.extname(result.file))}_${size.suffix}.jpg`)
      },
      compressionRatio: result.compressionRatio
    }))
  };

  fs.writeFileSync(
    path.join(outputDir, 'image-manifest.json'), 
    JSON.stringify(manifest, null, 2)
  );

  console.log('\n🎉 Image optimization completed!');
  console.log('✅ All images optimized');
  console.log('✅ Multiple formats generated (WebP, AVIF, JPG)');
  console.log('✅ Responsive sizes created');
  console.log('✅ Manifest file generated');
}

optimizeAllImages().catch(console.error);