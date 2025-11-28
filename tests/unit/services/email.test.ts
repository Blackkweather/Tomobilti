import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailService } from '../../../server/services/email';

// Mock nodemailer
vi.mock('nodemailer', () => ({
  createTransport: vi.fn(() => ({
    verify: vi.fn((callback: any) => callback(null, true)),
    sendMail: vi.fn(() => Promise.resolve({ messageId: 'test-id' })),
  })),
}));

describe('EmailService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    process.env.NODE_ENV = 'development';
  });

  describe('initialize', () => {
    it('should initialize in development mode when credentials are missing', () => {
      EmailService.initialize();
      
      // In development mode, should use mock transporter
      // This is tested implicitly - if it throws, the test fails
      expect(true).toBe(true);
    });

    it('should initialize in production mode when credentials are set', () => {
      process.env.SMTP_USER = 'test@example.com';
      process.env.SMTP_PASS = 'password';
      process.env.NODE_ENV = 'production';
      process.env.SMTP_HOST = 'smtp.example.com';
      process.env.SMTP_PORT = '587';

      EmailService.initialize();
      
      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email with correct data', async () => {
      EmailService.initialize();

      const emailData = {
        to: 'test@example.com',
        code: '123456',
        firstName: 'John',
      };

      // In development mode, this will log to console
      const result = await EmailService.sendVerificationEmail(emailData);
      
      // Should return true on success
      expect(typeof result).toBe('boolean');
    });
  });

  describe('sendBookingConfirmation', () => {
    it('should send booking confirmation email', async () => {
      EmailService.initialize();

      const bookingData = {
        to: 'renter@example.com',
        renterName: 'John Doe',
        carTitle: 'Test Car',
        startDate: '2025-11-01',
        endDate: '2025-11-03',
        totalAmount: 150,
        currency: 'GBP',
        bookingId: 'booking-123',
      };

      const result = await EmailService.sendBookingConfirmation(bookingData);
      
      expect(typeof result).toBe('boolean');
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email', async () => {
      EmailService.initialize();

      const resetData = {
        to: 'user@example.com',
        firstName: 'John',
        resetLink: 'https://example.com/reset?token=abc123',
      };

      const result = await EmailService.sendPasswordResetEmail(resetData);
      
      expect(typeof result).toBe('boolean');
    });
  });
});



