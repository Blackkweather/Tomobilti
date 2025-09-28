import { test, expect } from '@playwright/test';

test.describe('ShareWheelz Platform', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ShareWheelz/);
  });

  test('should navigate to cars page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Rent a car');
    await expect(page).toHaveURL(/.*cars/);
  });

  test('should search for cars', async ({ page }) => {
    await page.goto('/cars');
    await page.fill('input[placeholder*="location"]', 'London');
    await page.click('button:has-text("Search Cars")');
    // Add more specific assertions based on your search implementation
  });

  test('should display membership page', async ({ page }) => {
    await page.goto('/become-member');
    await expect(page.locator('h1')).toContainText('Become a');
    await expect(page.locator('text=Valued Member')).toBeVisible();
  });
});
