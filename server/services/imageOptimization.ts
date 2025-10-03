import sharp from 'sharp';
import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  resize?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export interface OptimizedImage {
  originalName: string;
  optimizedName: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  url: string;
  thumbnailUrl?: string;
}

export class ImageOptimizationService {
  private static uploadDir = path.join(process.cwd(), 'public', 'uploads');
  private static optimizedDir = path.join(process.cwd(), 'public', 'optimized');
  private static thumbnailDir = path.join(process.cwd(), 'public', 'thumbnails');

  /**
   * Initialize directories
   */
  static async initialize() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.mkdir(this.optimizedDir, { recursive: true });
      await fs.mkdir(this.thumbnailDir, { recursive: true });
      console.log('✅ Image optimization directories initialized');
    } catch (error) {
      console.error('Failed to initialize image directories:', error);
    }
  }

  /**
   * Configure multer for file uploads
   */
  static getMulterConfig() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${randomUUID()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      }
    });

    const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 5 // Maximum 5 files per request
      }
    });
  }

  /**
   * Optimize a single image
   */
  static async optimizeImage(
    inputPath: string,
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage> {
    try {
      const {
        width = 1200,
        height = 800,
        quality = 85,
        format = 'webp',
        resize = 'cover'
      } = options;

      const originalStats = await fs.stat(inputPath);
      const originalSize = originalStats.size;

      // Generate optimized filename
      const ext = format === 'jpeg' ? 'jpg' : format;
      const optimizedName = `${randomUUID()}-${Date.now()}.${ext}`;
      const outputPath = path.join(this.optimizedDir, optimizedName);

      // Optimize image
      let sharpInstance = sharp(inputPath);

      // Resize if dimensions provided
      if (width && height) {
        sharpInstance = sharpInstance.resize(width, height, {
          fit: resize,
          position: 'center'
        });
      }

      // Apply format and quality
      switch (format) {
        case 'jpeg':
          sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({ quality, progressive: true });
          break;
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality });
          break;
      }

      // Write optimized image
      await sharpInstance.toFile(outputPath);

      // Get optimized file size
      const optimizedStats = await fs.stat(outputPath);
      const optimizedSize = optimizedStats.size;

      // Calculate compression ratio
      const compressionRatio = ((originalSize - optimizedSize) / originalSize) * 100;

      return {
        originalName: path.basename(inputPath),
        optimizedName,
        originalSize,
        optimizedSize,
        compressionRatio: Math.round(compressionRatio * 100) / 100,
        url: `/optimized/${optimizedName}`,
      };
    } catch (error) {
      console.error('Image optimization failed:', error);
      throw new Error('Failed to optimize image');
    }
  }

  /**
   * Create thumbnail
   */
  static async createThumbnail(
    inputPath: string,
    size: number = 300
  ): Promise<string> {
    try {
      const thumbnailName = `${randomUUID()}-thumb-${Date.now()}.webp`;
      const thumbnailPath = path.join(this.thumbnailDir, thumbnailName);

      await sharp(inputPath)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 80 })
        .toFile(thumbnailPath);

      return `/thumbnails/${thumbnailName}`;
    } catch (error) {
      console.error('Thumbnail creation failed:', error);
      throw new Error('Failed to create thumbnail');
    }
  }

  /**
   * Optimize multiple images
   */
  static async optimizeImages(
    inputPaths: string[],
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage[]> {
    try {
      const promises = inputPaths.map(path => this.optimizeImage(path, options));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Batch image optimization failed:', error);
      throw new Error('Failed to optimize images');
    }
  }

  /**
   * Generate responsive images
   */
  static async generateResponsiveImages(
    inputPath: string,
    sizes: number[] = [400, 800, 1200, 1600]
  ): Promise<{ [key: string]: string }> {
    try {
      const responsiveImages: { [key: string]: string } = {};

      for (const size of sizes) {
        const optimized = await this.optimizeImage(inputPath, {
          width: size,
          height: Math.round(size * 0.75), // 4:3 aspect ratio
          quality: size <= 400 ? 90 : size <= 800 ? 85 : 80,
          format: 'webp'
        });

        responsiveImages[`${size}w`] = optimized.url;
      }

      return responsiveImages;
    } catch (error) {
      console.error('Responsive image generation failed:', error);
      throw new Error('Failed to generate responsive images');
    }
  }

  /**
   * Get image metadata
   */
  static async getImageMetadata(inputPath: string) {
    try {
      const metadata = await sharp(inputPath).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size,
        density: metadata.density,
        hasAlpha: metadata.hasAlpha,
        channels: metadata.channels
      };
    } catch (error) {
      console.error('Failed to get image metadata:', error);
      throw new Error('Failed to get image metadata');
    }
  }

  /**
   * Clean up temporary files
   */
  static async cleanupTempFiles(filePaths: string[]) {
    try {
      const promises = filePaths.map(async (filePath) => {
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.warn(`Failed to delete temp file ${filePath}:`, error);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to cleanup temp files:', error);
    }
  }

  /**
   * Validate image file
   */
  static async validateImage(filePath: string): Promise<boolean> {
    try {
      const metadata = await sharp(filePath).metadata();
      return !!(metadata.width && metadata.height && metadata.format);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get optimized image URL with fallback
   */
  static getOptimizedImageUrl(
    originalUrl: string,
    width?: number,
    height?: number,
    quality?: number
  ): string {
    // In production, this would integrate with a CDN like Cloudinary or AWS CloudFront
    // For now, return the original URL with optimization parameters
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality) params.append('q', quality.toString());

    const queryString = params.toString();
    return queryString ? `${originalUrl}?${queryString}` : originalUrl;
  }
}

export default ImageOptimizationService;
























