import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPricePerDay,
  formatTotalAmount,
  parseCurrency,
  poundsToPence,
  penceToPounds,
  calculateServiceFee,
  calculateTotalAmount,
  CURRENCY_CODE,
  CURRENCY_SYMBOL
} from '../../../client/src/utils/currency';

describe('Currency Utilities', () => {
  describe('formatCurrency', () => {
    it('should format numbers as GBP currency', () => {
      expect(formatCurrency(25.50)).toBe('£25.50');
      expect(formatCurrency(100)).toBe('£100.00');
      expect(formatCurrency(0)).toBe('£0.00');
    });

    it('should format strings as GBP currency', () => {
      expect(formatCurrency('25.50')).toBe('£25.50');
      expect(formatCurrency('100')).toBe('£100.00');
    });

    it('should handle invalid inputs', () => {
      expect(formatCurrency('invalid')).toBe('£0.00');
      expect(formatCurrency(NaN)).toBe('£0.00');
    });

    it('should format without symbol when requested', () => {
      expect(formatCurrency(25.50, false)).toBe('25.50');
    });

    it('should respect decimal places', () => {
      expect(formatCurrency(25.5, true, 0)).toBe('£26');
      expect(formatCurrency(25.555, true, 3)).toBe('£25.555');
    });
  });

  describe('formatPricePerDay', () => {
    it('should format price per day with /day suffix', () => {
      expect(formatPricePerDay(50)).toBe('£50.00/day');
      expect(formatPricePerDay('75.50')).toBe('£75.50/day');
    });
  });

  describe('formatTotalAmount', () => {
    it('should format total amount', () => {
      expect(formatTotalAmount(150.75)).toBe('£150.75');
      expect(formatTotalAmount('200')).toBe('£200.00');
    });
  });

  describe('parseCurrency', () => {
    it('should parse currency strings to numbers', () => {
      expect(parseCurrency('£25.50')).toBe(25.50);
      expect(parseCurrency('25.50')).toBe(25.50);
      expect(parseCurrency('£1,234.56')).toBe(1234.56);
    });

    it('should handle invalid inputs', () => {
      expect(parseCurrency('invalid')).toBe(0);
      expect(parseCurrency('')).toBe(0);
    });
  });

  describe('poundsToPence', () => {
    it('should convert pounds to pence', () => {
      expect(poundsToPence(1)).toBe(100);
      expect(poundsToPence(25.50)).toBe(2550);
      expect(poundsToPence(0.01)).toBe(1);
    });
  });

  describe('penceToPounds', () => {
    it('should convert pence to pounds', () => {
      expect(penceToPounds(100)).toBe(1);
      expect(penceToPounds(2550)).toBe(25.50);
      expect(penceToPounds(1)).toBe(0.01);
    });
  });

  describe('calculateServiceFee', () => {
    it('should calculate 10% service fee by default', () => {
      expect(calculateServiceFee(100)).toBe(10);
      expect(calculateServiceFee(50)).toBe(5);
    });

    it('should calculate custom service fee percentage', () => {
      expect(calculateServiceFee(100, 15)).toBe(15);
      expect(calculateServiceFee(100, 5)).toBe(5);
    });

    it('should round to 2 decimal places', () => {
      expect(calculateServiceFee(33.33)).toBe(3.33);
    });
  });

  describe('calculateTotalAmount', () => {
    it('should calculate total with rental and service fee', () => {
      expect(calculateTotalAmount(100, 10)).toBe(110);
      expect(calculateTotalAmount(50, 5)).toBe(55);
    });

    it('should include insurance fee when provided', () => {
      expect(calculateTotalAmount(100, 10, 5)).toBe(115);
      expect(calculateTotalAmount(50, 5, 2.50)).toBe(57.50);
    });
  });

  describe('Constants', () => {
    it('should have correct currency constants', () => {
      expect(CURRENCY_CODE).toBe('GBP');
      expect(CURRENCY_SYMBOL).toBe('£');
    });
  });
});



