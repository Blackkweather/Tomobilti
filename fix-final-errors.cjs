const fs = require('fs');
const path = require('path');

function fixFile(filePath, fixes) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  fixes.forEach(fix => {
    if (content.includes(fix.search)) {
      content = content.replace(new RegExp(fix.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fix.replace);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
}

// Fix remaining client issues
fixFile('client/src/pages/AddCar.tsx', [
  {
    search: 'year: parseInt(formData.year),',
    replace: 'year: parseInt(formData.year as string),'
  },
  {
    search: 'pricePerDay: parseFloat(formData.pricePerDay),',
    replace: 'pricePerDay: parseFloat(formData.pricePerDay as string),'
  }
]);

fixFile('client/src/pages/EditCar.tsx', [
  {
    search: 'year: parseInt(formData.year),',
    replace: 'year: parseInt(formData.year as string),'
  },
  {
    search: 'pricePerDay: parseFloat(formData.pricePerDay),',
    replace: 'pricePerDay: parseFloat(formData.pricePerDay as string),'
  }
]);

fixFile('client/src/pages/CarsDebug.tsx', [
  {
    search: 'fuelType: filters.fuelType,',
    replace: 'fuelType: filters.fuelType ? [filters.fuelType] : undefined,'
  }
]);

fixFile('client/src/pages/Security.tsx', [
  {
    search: 'userType: formData.userType,',
    replace: 'userType: formData.userType as "renter" | "owner",'
  }
]);

// Fix duplicate MessageSquare imports
['client/src/pages/Messages.tsx', 'client/src/pages/EnhancedMessages.tsx'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the import section with a clean single MessageSquare import
    content = content.replace(
      /import\s*{\s*[^}]*MessageSquare[^}]*\s*}\s*from\s*['"]lucide-react['"];?/g,
      'import { MessageSquare } from "lucide-react";'
    );
    
    // Replace all MessageSquare variants with just MessageSquare
    content = content.replace(/MessageSquare\w*/g, 'MessageSquare');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed duplicate MessageSquare in: ${filePath}`);
  }
});

// Fix car images utility
fixFile('client/src/utils/carImages.ts', [
  {
    search: 'const makeImages = carImagesByMake[make.toLowerCase()] || carImagesByMake.default;',
    replace: 'const makeImages = carImagesByMake[make.toLowerCase() as keyof typeof carImagesByMake] || carImagesByMake.default;'
  },
  {
    search: 'return makeImages[model.toLowerCase()] || makeImages.default || carImagesByMake.default;',
    replace: 'return makeImages[model.toLowerCase() as keyof typeof makeImages] || (makeImages as any).default || carImagesByMake.default;'
  }
]);

// Fix setupTests issues
fixFile('client/src/setupTests.ts', [
  {
    search: `global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};`,
    replace: `global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
} as any;`
  },
  {
    search: `Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
});`,
    replace: `Object.defineProperty(window, 'localStorage', {
  value: {
    length: 0,
    key: vi.fn(),
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
});`
  },
  {
    search: `Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
});`,
    replace: `Object.defineProperty(window, 'sessionStorage', {
  value: {
    length: 0,
    key: vi.fn(),
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
});`
  }
]);

// Remove backup file that's causing issues
if (fs.existsSync('client/src/pages/AddCar-backup.tsx')) {
  fs.unlinkSync('client/src/pages/AddCar-backup.tsx');
  console.log('Removed AddCar-backup.tsx');
}

console.log('Final error fixes completed!');