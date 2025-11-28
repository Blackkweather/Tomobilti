import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onClick?: () => void;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  placeholder?: string;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  onError,
  onClick,
  objectFit = 'cover',
  placeholder
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(placeholder || src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset state when src changes
    setIsLoading(true);
    setHasError(false);
    setImageSrc(placeholder || src);
  }, [src, placeholder]);

  const handleLoad = () => {
    setIsLoading(false);
    // Once loaded, switch to actual image if we were showing placeholder
    if (placeholder && imageSrc === placeholder) {
      setImageSrc(src);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setHasError(true);
    if (onError) {
      onError(e);
    } else {
      // Default fallback
      setImageSrc('/assets/placeholder-car.png');
    }
  };

  // Generate responsive srcset for Cloudinary images
  const getSrcSet = (imageUrl: string): string | undefined => {
    if (!imageUrl || imageUrl.startsWith('data:') || imageUrl.startsWith('/assets/')) {
      return undefined; // Don't generate srcset for data URLs or local assets
    }
    
    // If it's a Cloudinary URL, we could add transformations here
    // For now, return undefined to use the original src
    return undefined;
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {hasError && !imageSrc && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Image not available</span>
        </div>
      )}
      
      {/* Actual image */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        loading={loading}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ objectFit }}
        decoding="async"
        // Add fetchpriority for above-the-fold images
        fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      />
    </div>
  );
}
