// Car category images mapping
export const carCategoryImages = {
  // Sports cars
  'bmw-m4': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format',
  'm4': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format',
  'sports': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&auto=format',
  
  // Luxury cars
  'jaguar': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&auto=format',
  'luxury': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&auto=format',
  'audi-a8': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&auto=format',
  
  // Electric cars
  'tesla': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&auto=format',
  'electric': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&auto=format',
  'ev': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&auto=format',
  
  // Classic cars
  'porsche': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format',
  'classic': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format',
  'vintage': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format',
  
  // Convertibles
  'sls': 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop&auto=format',
  'convertible': 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop&auto=format',
  'cabriolet': 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop&auto=format',
  
  // SUVs/4x4
  'range-rover': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format',
  'suv': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format',
  '4x4': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format',
  'offroad': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format',
  
  // Default fallback
  'default': 'https://images.unsplash.com/photo-1549317331-3f1da8021b82?w=800&h=600&fit=crop&auto=format'
};

// Function to get car image based on make, model, or category
export const getCarImage = (car: any): string => {
  if (!car) return carCategoryImages.default;
  
  // Check if car has images array and first image exists
  if (car.images && car.images.length > 0 && car.images[0]) {
    return car.images[0];
  }
  
  // Get make and model in lowercase for matching
  const make = car.make?.toLowerCase() || '';
  const model = car.model?.toLowerCase() || '';
  const title = car.title?.toLowerCase() || '';
  const category = car.category?.toLowerCase() || '';
  
  // Create search terms
  const searchTerms = [make, model, title, category];
  
  // Find matching image
  for (const term of searchTerms) {
    if (term && carCategoryImages[term]) {
      return carCategoryImages[term];
    }
  }
  
  // Check for partial matches
  for (const term of searchTerms) {
    if (term) {
      for (const [key, image] of Object.entries(carCategoryImages)) {
        if (key !== 'default' && term.includes(key)) {
          return image;
        }
      }
    }
  }
  
  return carCategoryImages.default;
};

// Function to get category-specific images for featured cars
export const getFeaturedCarImages = () => {
  return {
    sports: carCategoryImages['bmw-m4'],
    luxury: carCategoryImages['jaguar'],
    electric: carCategoryImages['tesla'],
    classic: carCategoryImages['porsche'],
    convertible: carCategoryImages['sls'],
    suv: carCategoryImages['range-rover']
  };
};

