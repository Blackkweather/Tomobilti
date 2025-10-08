import React, { useState, useRef, useEffect } from 'react';
import { LazyImage } from './LazyImage';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 85,
  priority = false,
  sizes,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized image URLs
  const generateImageUrls = (originalSrc: string) => {
    const baseName = originalSrc.split('/').pop()?.split('.')[0] || 'image';
    const basePath = originalSrc.replace(/\/[^/]+$/, '');
    
    return {
      webp: `${basePath}/${baseName}.webp`,
      avif: `${basePath}/${baseName}.avif`,
      fallback: originalSrc
    };
  };

  useEffect(() => {
    const urls = generateImageUrls(src);
    
    // Try AVIF first (best compression)
    const testImg = new Image();
    testImg.onload = () => {
      setCurrentSrc(urls.avif);
    };
    testImg.onerror = () => {
      // Fallback to WebP
      const testWebP = new Image();
      testWebP.onload = () => {
        setCurrentSrc(urls.webp);
      };
      testWebP.onerror = () => {
        // Fallback to original
        setCurrentSrc(urls.fallback);
      };
      testWebP.src = urls.webp;
    };
    testImg.src = urls.avif;
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  if (priority) {
    // Render immediately for above-the-fold images
    return (
      <picture className={className}>
        <source srcSet={generateSrcSet(src, 'avif')} type="image/avif" />
        <source srcSet={generateSrcSet(src, 'webp')} type="image/webp" />
        <img
          ref={imgRef}
          src={currentSrc || src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="eager"
          decoding="async"
        />
      </picture>
    );
  }

  // Use lazy loading for below-the-fold images
  return (
    <LazyImage
      src={currentSrc || src}
      alt={alt}
      className={className}
      placeholder="/assets/placeholder.jpg"
      onLoad={handleLoad}
    />
  );
}

// Generate srcset for responsive images
function generateSrcSet(baseSrc: string, format: string): string {
  const baseName = baseSrc.split('/').pop()?.split('.')[0] || 'image';
  const basePath = baseSrc.replace(/\/[^/]+$/, '');
  
  const sizes = [
    { width: 400, suffix: 'sm' },
    { width: 800, suffix: 'md' },
    { width: 1200, suffix: 'lg' },
    { width: 1920, suffix: 'xl' }
  ];

  return sizes
    .map(size => `${basePath}/${baseName}_${size.suffix}.${format} ${size.width}w`)
    .join(', ');
}

// Export utility functions
export { generateSrcSet };