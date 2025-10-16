#!/usr/bin/env node

/**
 * ShareWheelz Testing Setup
 * Comprehensive testing framework for 100% reliability
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 ShareWheelz Testing Setup');
console.log('============================\n');

// 1. Update package.json with testing scripts
function updatePackageJson() {
  console.log('📦 Updating package.json with testing scripts...');
  
  const packageJsonPath = 'package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add testing dependencies
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    '@testing-library/react': '^13.4.0',
    '@testing-library/jest-dom': '^5.16.5',
    '@testing-library/user-event': '^14.4.3',
    'jest': '^29.5.0',
    'jest-environment-jsdom': '^29.5.0',
    '@types/jest': '^29.5.2',
    'supertest': '^6.3.3',
    '@types/supertest': '^2.0.12',
    'cypress': '^12.10.0',
    'playwright': '^1.35.0',
    'nyc': '^15.1.0',
    'eslint-plugin-testing-library': '^5.10.3',
    'eslint-plugin-jest-dom': '^4.0.2'
  };
  
  // Add testing scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'test': 'jest',
    'test:unit': 'jest --testPathPattern=unit',
    'test:integration': 'jest --testPathPattern=integration',
    'test:e2e': 'cypress run',
    'test:e2e:open': 'cypress open',
    'test:e2e:staging': 'cypress run --config baseUrl=https://staging.sharewheelz.uk',
    'test:smoke:production': 'cypress run --config baseUrl=https://sharewheelz.uk --spec "cypress/e2e/smoke/**/*"',
    'test:coverage': 'nyc jest --coverage',
    'test:watch': 'jest --watch',
    'test:ci': 'jest --ci --coverage --watchAll=false',
    'lint': 'eslint . --ext .ts,.tsx,.js,.jsx',
    'lint:fix': 'eslint . --ext .ts,.tsx,.js,.jsx --fix',
    'type-check': 'tsc --noEmit',
    'format:check': 'prettier --check .',
    'format': 'prettier --write .',
    'audit:performance': 'node scripts/performance-security-analysis.cjs',
    'analyze:bundle': 'npm run build && npx webpack-bundle-analyzer client/dist/assets/*.js',
    'report:performance': 'node scripts/generate-performance-report.cjs'
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('   ✅ Package.json updated with testing scripts');
}

// 2. Create Jest configuration
function createJestConfig() {
  console.log('\n⚙️ Creating Jest configuration...');
  
  const jestConfig = `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js)',
    '<rootDir>/server/**/__tests__/**/*.(ts|js)',
    '<rootDir>/server/**/*.(test|spec).(ts|js)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'server/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/setupTests.ts',
    '!src/index.tsx'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testTimeout: 10000,
  verbose: true
};`;

  fs.writeFileSync('jest.config.js', jestConfig);
  console.log('   ✅ Jest configuration created');
}

// 3. Create test setup file
function createTestSetup() {
  console.log('\n🔧 Creating test setup file...');
  
  const setupTests = `import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Suppress console warnings in tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});`;

  fs.writeFileSync('src/setupTests.ts', setupTests);
  console.log('   ✅ Test setup file created');
}

// 4. Create unit tests
function createUnitTests() {
  console.log('\n🧪 Creating unit tests...');
  
  // Create test directories
  const testDirs = [
    'src/components/__tests__',
    'src/pages/__tests__',
    'src/utils/__tests__',
    'src/hooks/__tests__',
    'server/__tests__',
    'server/services/__tests__'
  ];
  
  testDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Currency utility tests
  const currencyTests = `import { 
  formatCurrency, 
  formatPricePerDay, 
  formatTotalAmount, 
  parseCurrency,
  poundsToPence,
  penceToPounds,
  calculateServiceFee,
  calculateTotalAmount
} from '../currency';

describe('Currency Utils', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(25.50)).toBe('£25.50');
      expect(formatCurrency(100)).toBe('£100.00');
      expect(formatCurrency(0)).toBe('£0.00');
    });

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-25.50)).toBe('£-25.50');
    });

    it('should handle string inputs', () => {
      expect(formatCurrency('25.50')).toBe('£25.50');
      expect(formatCurrency('invalid')).toBe('£0.00');
    });

    it('should respect showSymbol parameter', () => {
      expect(formatCurrency(25.50, false)).toBe('25.50');
    });

    it('should respect decimals parameter', () => {
      expect(formatCurrency(25.50, true, 0)).toBe('£26');
    });
  });

  describe('formatPricePerDay', () => {
    it('should format price per day correctly', () => {
      expect(formatPricePerDay(50)).toBe('£50.00/day');
    });
  });

  describe('formatTotalAmount', () => {
    it('should format total amount correctly', () => {
      expect(formatTotalAmount(150.75)).toBe('£150.75');
    });
  });

  describe('parseCurrency', () => {
    it('should parse currency strings correctly', () => {
      expect(parseCurrency('£25.50')).toBe(25.50);
      expect(parseCurrency('25.50')).toBe(25.50);
      expect(parseCurrency('£1,234.56')).toBe(1234.56);
    });
  });

  describe('poundsToPence', () => {
    it('should convert pounds to pence correctly', () => {
      expect(poundsToPence(1)).toBe(100);
      expect(poundsToPence(25.50)).toBe(2550);
    });
  });

  describe('penceToPounds', () => {
    it('should convert pence to pounds correctly', () => {
      expect(penceToPounds(100)).toBe(1);
      expect(penceToPounds(2550)).toBe(25.50);
    });
  });

  describe('calculateServiceFee', () => {
    it('should calculate service fee correctly', () => {
      expect(calculateServiceFee(100)).toBe(10);
      expect(calculateServiceFee(100, 15)).toBe(15);
    });
  });

  describe('calculateTotalAmount', () => {
    it('should calculate total amount correctly', () => {
      expect(calculateTotalAmount(100, 10)).toBe(110);
      expect(calculateTotalAmount(100, 10, 5)).toBe(115);
    });
  });
});`;

  fs.writeFileSync('src/utils/__tests__/currency.test.ts', currencyTests);
  
  // UK Phone utility tests
  const ukPhoneTests = `import {
  formatUKPhoneNumber,
  validateUKPhoneNumber,
  getUKPhonePlaceholder,
  extractUKAreaCode,
  isUKMobileNumber,
  getUKPhoneExamples
} from '../ukPhone';

describe('UK Phone Utils', () => {
  describe('formatUKPhoneNumber', () => {
    it('should format mobile numbers correctly', () => {
      expect(formatUKPhoneNumber('07700900123')).toBe('+44 7700 900123');
      expect(formatUKPhoneNumber('447700900123')).toBe('+44 7700 900123');
    });

    it('should format landline numbers correctly', () => {
      expect(formatUKPhoneNumber('02079460958')).toBe('+44 20 7946 0958');
      expect(formatUKPhoneNumber('442079460958')).toBe('+44 20 7946 0958');
    });

    it('should respect includeCountryCode parameter', () => {
      expect(formatUKPhoneNumber('07700900123', false)).toBe('07700 900123');
    });
  });

  describe('validateUKPhoneNumber', () => {
    it('should validate mobile numbers', () => {
      const result = validateUKPhoneNumber('07700900123');
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('+44 7700 900123');
    });

    it('should validate landline numbers', () => {
      const result = validateUKPhoneNumber('02079460958');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid numbers', () => {
      const result = validateUKPhoneNumber('123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getUKPhonePlaceholder', () => {
    it('should return correct placeholder', () => {
      expect(getUKPhonePlaceholder()).toBe('+44 7XXX XXX XXX');
    });
  });

  describe('extractUKAreaCode', () => {
    it('should extract mobile area code', () => {
      expect(extractUKAreaCode('07700900123')).toBe('Mobile');
    });

    it('should extract landline area code', () => {
      expect(extractUKAreaCode('02079460958')).toBe('20');
    });
  });

  describe('isUKMobileNumber', () => {
    it('should identify mobile numbers', () => {
      expect(isUKMobileNumber('07700900123')).toBe(true);
      expect(isUKMobileNumber('02079460958')).toBe(false);
    });
  });

  describe('getUKPhoneExamples', () => {
    it('should return array of examples', () => {
      const examples = getUKPhoneExamples();
      expect(Array.isArray(examples)).toBe(true);
      expect(examples.length).toBeGreaterThan(0);
    });
  });
});`;

  fs.writeFileSync('src/utils/__tests__/ukPhone.test.ts', ukPhoneTests);
  
  console.log('   ✅ Unit tests created');
}

// 5. Create integration tests
function createIntegrationTests() {
  console.log('\n🔗 Creating integration tests...');
  
  const apiTests = `import request from 'supertest';
import { app } from '../../server/index';

describe('API Integration Tests', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'healthy');
    });
  });

  describe('Cars API', () => {
    it('should return cars list', async () => {
      const response = await request(app)
        .get('/api/cars')
        .expect(200);
      
      expect(response.body).toHaveProperty('cars');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.cars)).toBe(true);
    });

    it('should filter cars by city', async () => {
      const response = await request(app)
        .get('/api/cars?city=London')
        .expect(200);
      
      expect(response.body.cars.every((car: any) => car.city === 'London')).toBe(true);
    });
  });

  describe('Authentication API', () => {
    it('should register a new user', async () => {
      const userData = {
        email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        userType: 'renter'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);
      
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should reject invalid credentials', async () => {
      const loginData = {
        email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk',
        password: 'wrongpassword'
      };

      await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const promises = Array(10).fill(null).map(() =>
        request(app).get('/api/cars')
      );
      
      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});`;

  fs.writeFileSync('server/__tests__/api.integration.test.ts', apiTests);
  console.log('   ✅ Integration tests created');
}

// 6. Create Cypress E2E tests
function createE2ETests() {
  console.log('\n🎭 Creating E2E tests...');
  
  // Create Cypress directories
  const cypressDirs = [
    'cypress/e2e',
    'cypress/fixtures',
    'cypress/support',
    'cypress/e2e/smoke'
  ];
  
  cypressDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Cypress configuration
  const cypressConfig = `import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});`;

  fs.writeFileSync('cypress.config.ts', cypressConfig);
  
  // Smoke tests
  const smokeTests = `describe('ShareWheelz Smoke Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage', () => {
    cy.contains('ShareWheelz');
    cy.get('[data-testid="hero-section"]').should('be.visible');
  });

  it('should navigate to cars page', () => {
    cy.get('[data-testid="cars-link"]').click();
    cy.url().should('include', '/cars');
    cy.get('[data-testid="cars-grid"]').should('be.visible');
  });

  it('should display all 6 cars', () => {
    cy.visit('/cars');
    cy.get('[data-testid="car-card"]').should('have.length', 6);
  });

  it('should have working navigation', () => {
    cy.get('[data-testid="nav-home"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
    cy.get('[data-testid="nav-cars"]').click();
    cy.url().should('include', '/cars');
    
    cy.get('[data-testid="nav-login"]').click();
    cy.url().should('include', '/login');
  });

  it('should have responsive design', () => {
    cy.viewport(375, 667); // Mobile
    cy.get('[data-testid="mobile-menu"]').should('be.visible');
    
    cy.viewport(1280, 720); // Desktop
    cy.get('[data-testid="desktop-nav"]').should('be.visible');
  });
});`;

  fs.writeFileSync('cypress/e2e/smoke/basic.cy.ts', smokeTests);
  
  // Authentication tests
  const authTests = `describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('james.smith@example.com');
    cy.get('[data-testid="password-input"]').type('demo_password_123');
    cy.get('[data-testid="login-button"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should register a new user', () => {
    cy.visit('/register');
    
    cy.get('[data-testid="email-input"]').type('newuser@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="first-name-input"]').type('New');
    cy.get('[data-testid="last-name-input"]').type('User');
    cy.get('[data-testid="user-type-renter"]').check();
    cy.get('[data-testid="register-button"]').click();
    
    cy.url().should('include', '/dashboard');
  });
});`;

  fs.writeFileSync('cypress/e2e/auth.cy.ts', authTests);
  
  // Car booking tests
  const bookingTests = `describe('Car Booking Flow', () => {
  beforeEach(() => {
    // Login first
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('james.smith@example.com');
    cy.get('[data-testid="password-input"]').type('demo_password_123');
    cy.get('[data-testid="login-button"]').click();
  });

  it('should book a car successfully', () => {
    cy.visit('/cars');
    
    // Select first car
    cy.get('[data-testid="car-card"]').first().click();
    cy.url().should('include', '/cars/');
    
    // Select dates
    cy.get('[data-testid="start-date"]').type('2024-02-01');
    cy.get('[data-testid="end-date"]').type('2024-02-03');
    
    // Click book now
    cy.get('[data-testid="book-now-button"]').click();
    
    // Confirm booking
    cy.get('[data-testid="confirm-booking"]').click();
    
    // Should redirect to bookings page
    cy.url().should('include', '/bookings');
    cy.get('[data-testid="booking-success"]').should('be.visible');
  });

  it('should validate booking dates', () => {
    cy.visit('/cars');
    cy.get('[data-testid="car-card"]').first().click();
    
    // Try to book with invalid dates
    cy.get('[data-testid="start-date"]').type('2024-01-01');
    cy.get('[data-testid="end-date"]').type('2023-12-31'); // End before start
    
    cy.get('[data-testid="book-now-button"]').click();
    cy.get('[data-testid="date-error"]').should('be.visible');
  });
});`;

  fs.writeFileSync('cypress/e2e/booking.cy.ts', bookingTests);
  
  console.log('   ✅ E2E tests created');
}

// 7. Create ESLint configuration for testing
function createESLintConfig() {
  console.log('\n🔍 Creating ESLint configuration for testing...');
  
  const eslintConfig = `module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended'
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'testing-library',
    'jest-dom'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'testing-library/await-async-query': 'error',
    'testing-library/no-await-sync-query': 'error',
    'testing-library/no-debugging-utils': 'warn',
    'testing-library/no-dom-import': 'error',
    'jest-dom/prefer-checked': 'error',
    'jest-dom/prefer-enabled-disabled': 'error',
    'jest-dom/prefer-required': 'error',
    'jest-dom/prefer-to-have-attribute': 'error'
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
      env: {
        jest: true
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
};`;

  fs.writeFileSync('.eslintrc.js', eslintConfig);
  console.log('   ✅ ESLint configuration created');
}

// Main execution
function main() {
  console.log('Starting comprehensive testing setup...\n');
  
  updatePackageJson();
  createJestConfig();
  createTestSetup();
  createUnitTests();
  createIntegrationTests();
  createE2ETests();
  createESLintConfig();
  
  console.log('\n🎉 TESTING SETUP COMPLETE!');
  console.log('==========================');
  console.log('✅ Package.json updated with testing scripts');
  console.log('✅ Jest configuration created');
  console.log('✅ Test setup file created');
  console.log('✅ Unit tests created');
  console.log('✅ Integration tests created');
  console.log('✅ E2E tests created');
  console.log('✅ ESLint configuration created');
  console.log('\n🚀 Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run test');
  console.log('3. Run: npm run test:e2e:open');
  console.log('4. Run: npm run test:coverage');
}

main();
