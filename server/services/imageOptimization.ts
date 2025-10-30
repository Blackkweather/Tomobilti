import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export class ImageOptimizationService {
  private static instance: ImageOptimizationService;
  
  static getInstance(): ImageOptimizationService {
    if (!ImageOptimizationService.instance) {
      ImageOptimizationService.instance = new ImageOptimizationService();
    }
    return ImageOptimizationService.instance;
  }

  /**
   * Convert image to WebP format with optimization
   */
  async convertToWebP(inputPath: string, outputPath: string, quality: number = 80): Promise<void> {
    try {
      await sharp(inputPath)
        .webp({ quality })
        .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
        .toFile(outputPath);
    } catch (error) {
      console.error('WebP conversion failed:', error);
      throw error;
    }
  }

  /**
   * Generate multiple sizes for responsive images
   */
  async generateResponsiveImages(inputPath: string, outputDir: string): Promise<string[]> {
    const sizes = [
      { width: 400, height: 300, suffix: 'sm' },
      { width: 800, height: 600, suffix: 'md' },
      { width: 1200, height: 900, suffix: 'lg' }
    ];

    const generatedImages: string[] = [];

    for (const size of sizes) {
      const outputPath = path.join(outputDir, `${path.basename(inputPath, path.extname(inputPath))}_${size.suffix}.webp`);
      
      await sharp(inputPath)
        .webp({ quality: 85 })
        .resize(size.width, size.height, { fit: 'cover' })
        .toFile(outputPath);
      
      generatedImages.push(outputPath);
    }

    return generatedImages;
  }

  /**
   * Optimize existing images in assets folder
   */
  async optimizeAssets(): Promise<void> {
    const assetsDir = path.join(process.cwd(), 'client/public/assets');
    
    if (!fs.existsSync(assetsDir)) {
      console.log('Assets directory not found');
      return;
    }

    const files = fs.readdirSync(assetsDir);
    const imageFiles = files.filter(file => /.(jpg|jpeg|png)$/i.test(file));

    for (const file of imageFiles) {
      const inputPath = path.join(assetsDir, file);
      const outputPath = path.join(assetsDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
      
      try {
        await this.convertToWebP(inputPath, outputPath);
        console.log(`Converted ${file} to WebP`);
      } catch (error) {
        console.error(`Failed to convert ${file}:`, error);
      }
    }
  }
}

export default ImageOptimizationService.getInstance();















