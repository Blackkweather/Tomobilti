/**
 * Currency formatting utilities for ShareWheelz platform
 * All monetary values are displayed in GBP (£) as per UK market requirements
 */

export const CURRENCY_CODE = 'GBP' as const;
export const CURRENCY_SYMBOL = '£' as const;

/**
 * Format a number as GBP currency
 * @param amount - The amount to format (in pence or pounds)
 * @param showSymbol - Whether to show the £ symbol (default: true)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | string,
  showSymbol: boolean = true,
  decimals: number = 2
): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return showSymbol ? '£0.00' : '0.00';
  }

  const formatted = numericAmount.toFixed(decimals);
  return showSymbol ? `${CURRENCY_SYMBOL}${formatted}` : formatted;
}

/**
 * Format a price per day with proper GBP formatting
 * @param pricePerDay - Price per day amount
 * @returns Formatted price string
 */
export function formatPricePerDay(pricePerDay: number | string): string {
  return formatCurrency(pricePerDay, true, 2) + '/day';
}

/**
 * Format a total amount with proper GBP formatting
 * @param totalAmount - Total amount
 * @returns Formatted total string
 */
export function formatTotalAmount(totalAmount: number | string): string {
  return formatCurrency(totalAmount, true, 2);
}

/**
 * Parse currency string to number
 * @param currencyString - Currency string like "£25.50" or "25.50"
 * @returns Numeric value
 */
export function parseCurrency(currencyString: string): number {
  const cleaned = currencyString.replace(/[£,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Convert amount to pence (for Stripe payments)
 * @param pounds - Amount in pounds
 * @returns Amount in pence
 */
export function poundsToPence(pounds: number): number {
  return Math.round(pounds * 100);
}

/**
 * Convert pence to pounds
 * @param pence - Amount in pence
 * @returns Amount in pounds
 */
export function penceToPounds(pence: number): number {
  return pence / 100;
}

/**
 * Calculate service fee (typically 10% of rental amount)
 * @param rentalAmount - Base rental amount
 * @param feePercentage - Service fee percentage (default: 10)
 * @returns Service fee amount
 */
export function calculateServiceFee(rentalAmount: number, feePercentage: number = 10): number {
  return Math.round((rentalAmount * feePercentage / 100) * 100) / 100;
}

/**
 * Calculate total booking amount including fees
 * @param rentalAmount - Base rental amount
 * @param serviceFee - Service fee amount
 * @param insuranceFee - Insurance fee amount
 * @returns Total amount
 */
export function calculateTotalAmount(
  rentalAmount: number,
  serviceFee: number,
  insuranceFee: number = 0
): number {
  return rentalAmount + serviceFee + insuranceFee;
}
