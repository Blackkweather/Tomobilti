import { test, expect } from '@playwright/test';

/**
 * E2E Test: Authentication Flow
 * 
 * Tests the complete authentication journey:
 * 1. Registration
 * 2. Email verification
 * 3. Login
 * 4. Logout
 * 5. Password reset
 */

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete registration flow', async ({ page }) => {
    // Navigate to register page
    await page.click('a:has-text("Sign Up")');
    await expect(page).toHaveURL(/.*register/);

    // Fill registration form
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.selectOption('select[name="userType"]', 'renter');

    // Submit form
    await page.click('button:has-text("Register")');

    // Should redirect or show success message
    await expect(page).toHaveURL(/.*(dashboard|login|verify)/);
  });

  test('should login with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.click('a:has-text("Login")');
    await expect(page).toHaveURL(/.*login/);

    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit form
    await page.click('button:has-text("Login")');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill with invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    await page.click('button:has-text("Login")');

    // Should show error message
    await expect(page.locator('text=/invalid.*credentials/i')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First login (assuming user is logged in)
    // This would require setting up auth state or using fixtures
    
    // Click logout
    await page.click('button:has-text("Logout")');

    // Should redirect to home or login
    await expect(page).toHaveURL(/.*(home|login)/);
  });

  test('should reset password', async ({ page }) => {
    await page.goto('/login');

    // Click forgot password link
    await page.click('a:has-text("Forgot Password")');

    // Fill email
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button:has-text("Reset")');

    // Should show success message
    await expect(page.locator('text=/reset.*email/i')).toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    await page.goto('/register');

    // Try to submit empty form
    await page.click('button:has-text("Register")');

    // Should show validation errors
    await expect(page.locator('text=/required/i').first()).toBeVisible();
  });
});



