import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { formatCurrency, formatPricePerDay, formatTotalAmount, parseCurrency, poundsToPence, penceToPounds, calculateServiceFee, calculateTotalAmount } from '../utils/currency';

describe('Currency Utilities', () => {
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
      expect(formatCurrency(25.50, true)).toBe('£25.50');
    });

    it('should respect decimals parameter', () => {
      expect(formatCurrency(25.5, true, 0)).toBe('£26');
      expect(formatCurrency(25.5, true, 3)).toBe('£25.500');
    });
  });

  describe('formatPricePerDay', () => {
    it('should format price per day correctly', () => {
      expect(formatPricePerDay(25.50)).toBe('£25.50/day');
      expect(formatPricePerDay(100)).toBe('£100.00/day');
    });
  });

  describe('formatTotalAmount', () => {
    it('should format total amount correctly', () => {
      expect(formatTotalAmount(125.75)).toBe('£125.75');
      expect(formatTotalAmount(0)).toBe('£0.00');
    });
  });

  describe('parseCurrency', () => {
    it('should parse currency strings correctly', () => {
      expect(parseCurrency('£25.50')).toBe(25.50);
      expect(parseCurrency('25.50')).toBe(25.50);
      expect(parseCurrency('£1,250.75')).toBe(1250.75);
      expect(parseCurrency('invalid')).toBe(0);
    });
  });

  describe('poundsToPence', () => {
    it('should convert pounds to pence correctly', () => {
      expect(poundsToPence(1)).toBe(100);
      expect(poundsToPence(25.50)).toBe(2550);
      expect(poundsToPence(0)).toBe(0);
    });
  });

  describe('penceToPounds', () => {
    it('should convert pence to pounds correctly', () => {
      expect(penceToPounds(100)).toBe(1);
      expect(penceToPounds(2550)).toBe(25.50);
      expect(penceToPounds(0)).toBe(0);
    });
  });

  describe('calculateServiceFee', () => {
    it('should calculate service fee correctly with default percentage', () => {
      expect(calculateServiceFee(100)).toBe(10);
      expect(calculateServiceFee(250.50)).toBe(25.05);
    });

    it('should calculate service fee correctly with custom percentage', () => {
      expect(calculateServiceFee(100, 15)).toBe(15);
      expect(calculateServiceFee(200, 5)).toBe(10);
    });
  });

  describe('calculateTotalAmount', () => {
    it('should calculate total amount correctly', () => {
      expect(calculateTotalAmount(100, 10, 5)).toBe(115);
      expect(calculateTotalAmount(250, 25, 0)).toBe(275);
    });

    it('should handle zero insurance fee', () => {
      expect(calculateTotalAmount(100, 10)).toBe(110);
    });
  });
});
