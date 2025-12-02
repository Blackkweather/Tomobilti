import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Upload, X, Plus } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export default function ImageUpload({ 
  images = [], 
  onImagesChange, 
  maxImages = 10,
  className = '' 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      // In a real implementation, you would upload files to a server
      // For now, we'll create object URLs for demonstration
      const newImages: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not an image`);
          continue;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 5MB`);
          continue;
        }
        
        // Create object URL for preview
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
      }
      
      // Add new images to existing ones
      const updatedImages = [...images, ...newImages].slice(0, maxImages);
      onImagesChange(updatedImages);
      
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Car Photos</h3>
        <p className="text-sm text-gray-600">
          Add up to {maxImages} photos of your car. High-quality photos help attract more renters.
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {images.map((image, index) => (
          <Card key={index} className="relative group">
            <CardContent className="p-0">
              <div className="aspect-square relative overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`Car photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
                
                {/* Image number */}
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add more images button */}
        {images.length < maxImages && (
          <Card className="border-dashed border-2 border-gray-300 hover:border-mauve-400 transition-colors duration-200">
            <CardContent className="p-0">
              <button
                onClick={openFileDialog}
                disabled={isUploading}
                className="w-full aspect-square flex flex-col items-center justify-center text-gray-400 hover:text-mauve-600 transition-colors duration-200"
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mauve-600"></div>
                ) : (
                  <>
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Add Photo</span>
                  </>
                )}
              </button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          onClick={openFileDialog}
          disabled={isUploading || images.length >= maxImages}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? 'Uploading...' : 'Upload Photos'}
        </Button>
        
        {images.length > 0 && (
          <Button
            variant="outline"
            onClick={() => onImagesChange([])}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Tips */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Photo Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Take photos in good lighting</li>
          <li>• Include exterior shots from multiple angles</li>
          <li>• Show the interior and key features</li>
          <li>• Make sure the car is clean and presentable</li>
        </ul>
      </div>
    </div>
  );
}
