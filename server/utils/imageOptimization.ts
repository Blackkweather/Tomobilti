import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

interface OptimizedImage {
  originalPath: string;
  optimizedPath: string;
  format: string;
  size: number;
  originalSize: number;
  compressionRatio: number;
}

class ImageOptimizationUtility {
  private static instance: ImageOptimizationUtility;
  
  static getInstance(): ImageOptimizationUtility {
    if (!ImageOptimizationUtility.instance) {
      ImageOptimizationUtility.instance = new ImageOptimizationUtility();
    }
    return ImageOptimizationUtility.instance;
  }

  /**
   * Optimize a single image
   */
  async optimizeImage(
    inputPath: string, 
    outputPath: string, 
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage> {
    const {
      quality = 85,
      format = 'webp',
      width,
      height,
      fit = 'inside'
    } = options;

    try {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      const originalSize = originalStats.size;

      // Create Sharp instance
      let sharpInstance = sharp(inputPath);

      // Apply resizing if dimensions specified
      if (width || height) {
        sharpInstance = sharpInstance.resize(width, height, { 
          fit,
          withoutEnlargement: true 
        });
      }

      // Apply format-specific optimizations
      switch (format) {
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality });
          break;
        case 'avif':
          sharpInstance = sharpInstance.avif({ quality });
          break;
        case 'jpeg':
          sharpInstance = sharpInstance.jpeg({ quality });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({ quality });
          break;
      }

      // Process and save
      await sharpInstance.toFile(outputPath);

      // Get optimized file size
      const optimizedStats = fs.statSync(outputPath);
      const optimizedSize = optimizedStats.size;

      return {
        originalPath: inputPath,
        optimizedPath: outputPath,
        format,
        size: optimizedSize,
        originalSize,
        compressionRatio: (originalSize - optimizedSize) / originalSize
      };

    } catch (error) {
      throw new Error(`Failed to optimize image ${inputPath}: ${error.message}`);
    }
  }

  /**
   * Generate responsive images for different screen sizes
   */
  async generateResponsiveImages(
    inputPath: string,
    outputDir: string,
    baseName?: string
  ): Promise<OptimizedImage[]> {
    const sizes = [
      { width: 400, height: 300, suffix: 'sm' },
      { width: 800, height: 600, suffix: 'md' },
      { width: 1200, height: 900, suffix: 'lg' },
      { width: 1920, height: 1080, suffix: 'xl' }
    ];

    const fileName = baseName || path.basename(inputPath, path.extname(inputPath));
    const results: OptimizedImage[] = [];

    for (const size of sizes) {
      const outputPath = path.join(outputDir, `${fileName}_${size.suffix}.webp`);
      
      try {
        const result = await this.optimizeImage(inputPath, outputPath, {
          format: 'webp',
          quality: 85,
          width: size.width,
          height: size.height,
          fit: 'cover'
        });
        
        results.push(result);
      } catch (error) {
        console.error(`Failed to generate ${size.suffix} image:`, error);
      }
    }

    return results;
  }

  /**
   * Optimize all images in a directory
   */
  async optimizeDirectory(
    inputDir: string,
    outputDir: string,
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage[]> {
    if (!fs.existsSync(inputDir)) {
      throw new Error(`Input directory does not exist: ${inputDir}`);
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = fs.readdirSync(inputDir);
    const imageFiles = files.filter(file => 
      /.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(file)
    );

    const results: OptimizedImage[] = [];

    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const fileName = path.basename(file, path.extname(file));
      const outputPath = path.join(outputDir, `${fileName}.webp`);

      try {
        const result = await this.optimizeImage(inputPath, outputPath, options);
        results.push(result);
        
        console.log(`✅ Optimized: ${file} (${(result.compressionRatio * 100).toFixed(1)}% smaller)`);
      } catch (error) {
        console.error(`❌ Failed to optimize ${file}:`, error);
      }
    }

    return results;
  }

  /**
   * Generate srcset string for responsive images
   */
  generateSrcSet(responsiveImages: OptimizedImage[]): string {
    return responsiveImages
      .map(img => {
        const width = this.extractWidthFromPath(img.optimizedPath);
        return `${img.optimizedPath} ${width}w`;
      })
      .join(', ');
  }

  /**
   * Generate sizes attribute for responsive images
   */
  generateSizes(): string {
    return '(max-width: 400px) 400px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1920px';
  }

  private extractWidthFromPath(filePath: string): number {
    const match = filePath.match(/_(d+)w/);
    return match ? parseInt(match[1]) : 400;
  }

  /**
   * Get optimization statistics
   */
  getOptimizationStats(results: OptimizedImage[]): {
    totalImages: number;
    totalOriginalSize: number;
    totalOptimizedSize: number;
    totalSavings: number;
    averageCompressionRatio: number;
  } {
    const totalOriginalSize = results.reduce((sum, img) => sum + img.originalSize, 0);
    const totalOptimizedSize = results.reduce((sum, img) => sum + img.size, 0);
    const totalSavings = totalOriginalSize - totalOptimizedSize;
    const averageCompressionRatio = results.length > 0 
      ? results.reduce((sum, img) => sum + img.compressionRatio, 0) / results.length 
      : 0;

    return {
      totalImages: results.length,
      totalOriginalSize,
      totalOptimizedSize,
      totalSavings,
      averageCompressionRatio
    };
  }
}

export default ImageOptimizationUtility.getInstance();