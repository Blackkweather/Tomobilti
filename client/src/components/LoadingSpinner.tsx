import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground font-medium">{text}</p>
      )}
    </div>
  );
}

// Enhanced loading component with brand colors
export function BrandedLoadingSpinner({ size = 'md', text = 'Loading...' }: { size?: 'sm' | 'md' | 'lg'; text?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`animate-spin rounded-full border-3 border-gray-200 border-t-blue-500 border-r-blue-400 ${sizeClasses[size]}`}></div>
      <p className="text-sm text-gray-600 font-medium">{text}</p>
    </div>
  );
}

// Pulse loading for cards
export function CardLoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-48 w-full rounded-t-lg"></div>
      <div className="p-4 space-y-3">
        <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
        <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
        <div className="bg-gray-200 h-3 w-2/3 rounded"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="bg-gray-200 h-6 w-20 rounded"></div>
          <div className="bg-gray-200 h-8 w-24 rounded"></div>
        </div>
      </div>
    </div>
  );
}
