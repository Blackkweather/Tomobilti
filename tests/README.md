# ShareWheelz Test Suite

This directory contains the comprehensive test suite for the ShareWheelz platform.

## Structure

```
tests/
├── setup.ts                    # Test environment setup
├── helpers/
│   └── testUtils.ts            # Common test utilities and helpers
├── unit/
│   ├── utils/
│   │   ├── currency.test.ts     # Currency utility tests
│   │   ├── dateUtils.test.ts   # Date utility tests
│   │   └── validation.test.ts  # Validation utility tests
│   ├── hooks/
│   │   ├── useScrollTracking.test.ts
│   │   ├── useScrollAnimation.test.ts
│   │   └── useToast.test.ts
│   ├── lib/
│   │   └── api.test.ts         # API helper tests
│   └── components/
│       └── ReservationBar.test.tsx
├── integration/
│   └── api/
│       ├── auth.test.ts        # Authentication API tests
│       ├── cars.test.ts        # Car API tests
│       └── bookings.test.ts    # Booking API tests
└── e2e/
    └── booking-flow.spec.ts    # E2E booking flow tests
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### E2E Tests Only
```bash
npm run test:e2e
```

### With Coverage
```bash
npm run test:coverage
```

## Test Utilities

The `tests/helpers/testUtils.ts` file provides common utilities:

- `createMockResponse()` - Create mock fetch responses
- `mockFetch()` - Mock fetch with a response
- `mockFetchError()` - Mock fetch with an error
- `createMockCar()` - Create mock car objects
- `createMockUser()` - Create mock user objects
- `createMockBooking()` - Create mock booking objects
- `createMockIntersectionObserver()` - Mock IntersectionObserver
- `mockMatchMedia()` - Mock window.matchMedia

## Writing Tests

### Unit Tests
Unit tests should be placed in `tests/unit/` and test individual functions, utilities, and components in isolation.

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../../../client/src/utils/currency';

describe('formatCurrency', () => {
  it('should format numbers as GBP currency', () => {
    expect(formatCurrency(25.50)).toBe('£25.50');
  });
});
```

### Integration Tests
Integration tests should be placed in `tests/integration/` and test API endpoints and database interactions.

Example:
```typescript
import { describe, it, expect } from 'vitest';

describe('Car API', () => {
  it('should return list of cars', async () => {
    const response = await fetch('/api/cars');
    const data = await response.json();
    expect(data.cars).toBeDefined();
  });
});
```

### E2E Tests
E2E tests should be placed in `tests/e2e/` and test complete user flows using Playwright.

Example:
```typescript
import { test, expect } from '@playwright/test';

test('should complete booking flow', async ({ page }) => {
  await page.goto('/');
  // ... test steps
});
```

## Coverage Goals

- **Unit Tests:** 80%+ coverage
- **Integration Tests:** 70%+ coverage
- **Component Tests:** 60%+ coverage
- **E2E Tests:** 100% of critical user journeys

## Best Practices

1. **Isolation:** Each test should be independent and not rely on other tests
2. **Cleanup:** Always clean up after tests (use `afterEach` and `afterAll`)
3. **Mocking:** Mock external dependencies (APIs, localStorage, etc.)
4. **Descriptive Names:** Use clear, descriptive test names
5. **AAA Pattern:** Arrange, Act, Assert
6. **Test One Thing:** Each test should verify one specific behavior

## CI/CD Integration

Tests run automatically in CI/CD pipeline:
- On every pull request
- Before merging to main
- On every push to main

## Notes

- Tests use Vitest as the test runner
- React Testing Library for component tests
- Playwright for E2E tests
- Test setup is configured in `vitest.config.ts`



