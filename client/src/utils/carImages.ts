// Real car images mapping by make and model - using local assets for stability
export const carImages = {
  // BMW
  'bmw': {
    '3 series': '/assets/luxury Sedam.png',
    '5 series': '/assets/luxury Sedam.png',
    '7 series': '/assets/luxury Sedam.png',
    'x3': '/assets/SUV.png',
    'x5': '/assets/SUV.png',
    'm3': '/assets/Sport car.png',
    'm4': '/assets/Sport car.png',
    'i3': '/assets/ELECTRIC.png',
    'i8': '/assets/ELECTRIC.png'
  },
  
  // Mercedes-Benz
  'mercedes': {
    'c-class': '/assets/luxury Sedam.png',
    'e-class': '/assets/luxury Sedam.png',
    's-class': '/assets/luxury Sedam.png',
    'gla': '/assets/SUV.png',
    'glc': '/assets/SUV.png',
    'gle': '/assets/SUV.png',
    'amg': '/assets/Sport car.png',
    'sls': '/assets/Sport car.png'
  },
  
  // Audi
  'audi': {
    'a3': '/assets/luxury Sedam.png',
    'a4': '/assets/luxury Sedam.png',
    'a6': '/assets/luxury Sedam.png',
    'a8': '/assets/luxury Sedam.png',
    'q3': '/assets/SUV.png',
    'q5': '/assets/SUV.png',
    'q7': '/assets/SUV.png',
    'tt': '/assets/Sport car.png',
    'r8': '/assets/Sport car.png',
    'e-tron': '/assets/ELECTRIC.png'
  },
  
  // Tesla
  'tesla': {
    'model s': '/assets/ELECTRIC.png',
    'model 3': '/assets/ELECTRIC.png',
    'model x': '/assets/ELECTRIC.png',
    'model y': '/assets/ELECTRIC.png',
    'cybertruck': '/assets/ELECTRIC.png'
  },
  
  // Porsche
  'porsche': {
    '911': '/assets/Sport car.png',
    'cayenne': '/assets/SUV.png',
    'macan': '/assets/SUV.png',
    'panamera': '/assets/luxury Sedam.png',
    'boxster': '/assets/Sport car.png',
    'cayman': '/assets/Sport car.png',
    'taycan': '/assets/ELECTRIC.png'
  },
  
  // Jaguar
  'jaguar': {
    'xe': '/assets/luxury Sedam.png',
    'xf': '/assets/luxury Sedam.png',
    'xj': '/assets/luxury Sedam.png',
    'f-pace': '/assets/SUV.png',
    'e-pace': '/assets/SUV.png',
    'f-type': '/assets/Sport car.png'
  },
  
  // Range Rover
  'range rover': {
    'evoque': '/assets/SUV.png',
    'velar': '/assets/SUV.png',
    'sport': '/assets/SUV.png',
    'vogue': '/assets/SUV.png'
  },
  
  // Ford
  'ford': {
    'focus': '/assets/CLASSIC.png',
    'fiesta': '/assets/CLASSIC.png',
    'mustang': '/assets/Sport car.png',
    'explorer': '/assets/SUV.png',
    'edge': '/assets/SUV.png',
    'kuga': '/assets/SUV.png'
  },
  
  // Volkswagen
  'volkswagen': {
    'golf': '/assets/CLASSIC.png',
    'polo': '/assets/CLASSIC.png',
    'passat': '/assets/CLASSIC.png',
    'tiguan': '/assets/SUV.png',
    'touareg': '/assets/SUV.png',
    'id.3': '/assets/ELECTRIC.png',
    'id.4': '/assets/ELECTRIC.png'
  },
  
  // Nissan
  'nissan': {
    'leaf': '/assets/ELECTRIC.png',
    'qashqai': '/assets/SUV.png',
    'x-trail': '/assets/SUV.png',
    'juke': '/assets/SUV.png',
    'micra': '/assets/CLASSIC.png',
    'gt-r': '/assets/Sport car.png'
  },
  
  // Toyota
  'toyota': {
    'prius': '/assets/ELECTRIC.png',
    'camry': '/assets/CLASSIC.png',
    'corolla': '/assets/CLASSIC.png',
    'rav4': '/assets/SUV.png',
    'highlander': '/assets/SUV.png',
    'supra': '/assets/Sport car.png'
  },
  
  // Honda
  'honda': {
    'civic': '/assets/CLASSIC.png',
    'accord': '/assets/CLASSIC.png',
    'cr-v': '/assets/SUV.png',
    'hr-v': '/assets/SUV.png',
    'nsx': '/assets/Sport car.png'
  },
  
  // Lexus
  'lexus': {
    'is': '/assets/luxury Sedam.png',
    'es': '/assets/luxury Sedam.png',
    'ls': '/assets/luxury Sedam.png',
    'nx': '/assets/SUV.png',
    'rx': '/assets/SUV.png',
    'gx': '/assets/SUV.png',
    'lx': '/assets/SUV.png',
    'rc': '/assets/Sport car.png',
    'lc': '/assets/Sport car.png'
  },
  
  // Default fallback
  'default': '/assets/CLASSIC.png'
};

// Function to get car image based on make and model
export const getCarImage = ({ make, model }: { make: string; model: string }): string => {
  if (!make || !model) return carImages.default;
  
  const makeKey = make.toLowerCase().trim();
  const modelKey = model.toLowerCase().trim();
  
  // Check if we have a specific image for this make and model
  if (carImages[makeKey as keyof typeof carImages] && 
      carImages[makeKey as keyof typeof carImages][modelKey as keyof typeof carImages[typeof makeKey]]) {
    return carImages[makeKey as keyof typeof carImages][modelKey as keyof typeof carImages[typeof makeKey]];
  }
  
  // Fallback to default
  return carImages.default;
};

// Function to get specific car image with better error handling
export const getSpecificCarImage = (car: any): string => {
  if (!car) return carImages.default;
  
  // Check if car has images array and first image exists
  if (car.images && car.images.length > 0 && car.images[0]) {
    return car.images[0];
  }
  
  const make = car.make?.toLowerCase().trim() || '';
  const model = car.model?.toLowerCase().trim() || '';
  const title = car.title?.toLowerCase().trim() || '';
  
  // Try to get image based on make and model
  if (make && model) {
    return getCarImage({ make, model });
  }
  
  // Fallback to default
  return carImages.default;
};

// Function to search for car image (async for future API integration)
export const searchCarImage = async (make: string, model: string): Promise<string> => {
  try {
    // For now, return the local asset
    return getCarImage({ make, model });
  } catch (error) {
    console.warn('Failed to fetch car image:', error);
    return carImages.default;
  }
};

// Function to get featured car images
export const getFeaturedCarImages = (): string[] => {
  return [
    '/assets/luxury Sedam.png',
    '/assets/SUV.png',
    '/assets/Sport car.png',
    '/assets/ELECTRIC.png',
    '/assets/CLASSIC.png',
    '/assets/CONVERTIBLES.png'
  ];
};