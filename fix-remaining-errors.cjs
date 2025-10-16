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

// Fix route parameter types
fixFile('client/src/pages/BookingDetails.tsx', [
  {
    search: 'const { bookingId } = useParams();',
    replace: 'const { bookingId } = useParams<{ bookingId: string }>();'
  }
]);

fixFile('client/src/pages/EditCar.tsx', [
  {
    search: 'const { id } = useParams();',
    replace: 'const { id } = useParams<{ id: string }>();'
  }
]);

// Fix form data type issues
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

// Fix CarsDebug fuelType issue
fixFile('client/src/pages/CarsDebug.tsx', [
  {
    search: 'fuelType: filters.fuelType,',
    replace: 'fuelType: filters.fuelType ? [filters.fuelType] : undefined,'
  }
]);

// Fix Security page userType issue
fixFile('client/src/pages/Security.tsx', [
  {
    search: 'userType: formData.userType,',
    replace: 'userType: formData.userType as "renter" | "owner",'
  }
]);

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

// Fix Lucide React icon imports - replace non-existent icons with existing ones
const lucideIconFixes = [
  { search: 'MessageSquareCheck', replace: 'MessageSquare' },
  { search: 'MessageSquareInfo', replace: 'MessageSquare' },
  { search: 'MessageSquareQuestion', replace: 'MessageSquare' },
  { search: 'MessageSquareForward', replace: 'MessageSquare' },
  { search: 'MessageSquareEdit', replace: 'MessageSquare' },
  { search: 'MessageSquareDelete', replace: 'MessageSquare' },
  { search: 'MessageSquarePin', replace: 'MessageSquare' },
  { search: 'MessageSquareUnpin', replace: 'MessageSquare' },
  { search: 'MessageSquareArchive', replace: 'MessageSquare' },
  { search: 'MessageSquareUnarchive', replace: 'MessageSquare' },
  { search: 'MessageSquareStar', replace: 'MessageSquare' },
  { search: 'MessageSquareUnstar', replace: 'MessageSquare' },
  { search: 'MessageSquareFlag', replace: 'MessageSquare' },
  { search: 'MessageSquareUnflag', replace: 'MessageSquare' },
  { search: 'MessageSquareReport', replace: 'MessageSquare' },
  { search: 'MessageSquareBlock', replace: 'MessageSquare' },
  { search: 'MessageSquareUnblock', replace: 'MessageSquare' },
  { search: 'MessageSquareMute', replace: 'MessageSquare' },
  { search: 'MessageSquareUnmute', replace: 'MessageSquare' },
  { search: 'MessageSquareHide', replace: 'MessageSquare' },
  { search: 'MessageSquareShow', replace: 'MessageSquare' },
  { search: 'MessageSquareUnlock', replace: 'MessageSquare' },
  { search: 'MessageSquareKey', replace: 'MessageSquare' },
  { search: 'MessageSquareShield', replace: 'MessageSquare' }
];

// Apply Lucide icon fixes to both message files
['client/src/pages/Messages.tsx', 'client/src/pages/EnhancedMessages.tsx'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove all the problematic MessageSquareShield* imports and usages
    content = content.replace(/MessageSquareShield\w*,?\s*/g, '');
    
    // Fix the remaining imports
    lucideIconFixes.forEach(fix => {
      content = content.replace(new RegExp(fix.search, 'g'), fix.replace);
    });
    
    // Clean up any duplicate commas in imports
    content = content.replace(/,\s*,/g, ',');
    content = content.replace(/{\s*,/g, '{');
    content = content.replace(/,\s*}/g, '}');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed Lucide icons in: ${filePath}`);
  }
});

console.log('TypeScript error fixes completed!');