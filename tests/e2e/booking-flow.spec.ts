import { test, expect } from '@playwright/test';

/**
 * E2E Test: Complete Booking Flow
 * 
 * This test covers the critical user journey:
 * 1. Search for a car
 * 2. View car details
 * 3. Select dates
 * 4. Complete booking
 */

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
  });

  test('should complete a booking flow', async ({ page }) => {
    // Step 1: Search for cars
    await page.fill('input[placeholder*="location"]', 'London');
    await page.click('button:has-text("Search")');
    
    // Wait for results
    await page.waitForSelector('[data-testid="car-card"]', { timeout: 5000 });
    
    // Step 2: Click on first car
    await page.click('[data-testid="car-card"]:first-child');
    
    // Wait for car details page
    await page.waitForSelector('h1', { timeout: 5000 });
    
    // Step 3: Select dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    const dayAfterStr = dayAfter.toISOString().split('T')[0];
    
    // Select start date
    await page.fill('input[type="date"]:first-of-type', tomorrowStr);
    
    // Select end date
    await page.fill('input[type="date"]:last-of-type', dayAfterStr);
    
    // Step 4: Click Book Now
    await page.click('button:has-text("Book Now")');
    
    // Should redirect to login if not authenticated, or booking page if authenticated
    await expect(page).toHaveURL(/.*(login|booking)/);
  });

  test('should validate date selection', async ({ page }) => {
    await page.goto('/cars/1'); // Assuming car ID 1 exists
    
    // Try to select end date before start date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() + 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    await page.fill('input[type="date"]:first-of-type', tomorrowStr);
    await page.fill('input[type="date"]:last-of-type', yesterdayStr);
    
    // Should show error message
    await expect(page.locator('text=/start date must be before/i')).toBeVisible();
    
    // Book Now button should be disabled
    const bookButton = page.locator('button:has-text("Book Now")');
    await expect(bookButton).toBeDisabled();
  });
});



