import { describe, it, expect } from 'vitest';

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// UK Phone validation
const isValidUKPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+44|0)[1-9]\d{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password strength validation
const isStrongPassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
};

describe('Validation Utilities', () => {
  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
    });
  });

  describe('UK Phone Validation', () => {
    it('should validate correct UK phone numbers', () => {
      expect(isValidUKPhone('+44 20 1234 5678')).toBe(true);
      expect(isValidUKPhone('02012345678')).toBe(true);
      expect(isValidUKPhone('07123456789')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidUKPhone('123')).toBe(false);
      expect(isValidUKPhone('+1 555 123 4567')).toBe(false);
      expect(isValidUKPhone('invalid')).toBe(false);
    });
  });

  describe('Password Strength', () => {
    it('should validate strong passwords', () => {
      expect(isStrongPassword('Password123')).toBe(true);
      expect(isStrongPassword('MyP@ssw0rd')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isStrongPassword('short')).toBe(false);
      expect(isStrongPassword('nouppercase123')).toBe(false);
      expect(isStrongPassword('NOLOWERCASE123')).toBe(false);
      expect(isStrongPassword('NoNumbers')).toBe(false);
    });
  });
});



