/**
 * Payment Card Detection and Validation Utilities
 * 
 * Detects card types, validates numbers, and provides card information
 */

export interface CardInfo {
  type: 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'jcb' | 'maestro' | 'unknown';
  name: string;
  icon: string;
  pattern: RegExp;
  validLengths: number[];
  cvvLength: number;
}

export const CARD_TYPES: CardInfo[] = [
  {
    type: 'visa',
    name: 'Visa',
    icon: '/assets/payment-logos/visa.svg',
    pattern: /^4/,
    validLengths: [13, 16, 19],
    cvvLength: 3
  },
  {
    type: 'mastercard',
    name: 'Mastercard',
    icon: '/assets/payment-logos/mastercard.svg',
    pattern: /^5[1-5]|^2[2-7]/,
    validLengths: [16],
    cvvLength: 3
  },
  {
    type: 'amex',
    name: 'American Express',
    icon: '/assets/payment-logos/american-express.svg',
    pattern: /^3[47]/,
    validLengths: [15],
    cvvLength: 4
  },
  {
    type: 'discover',
    name: 'Discover',
    icon: '/assets/payment-logos/discover.svg',
    pattern: /^6(?:011|5)/,
    validLengths: [16],
    cvvLength: 3
  },
  {
    type: 'diners',
    name: 'Diners Club',
    icon: '/assets/payment-logos/diners.svg',
    pattern: /^3[0689]/,
    validLengths: [14],
    cvvLength: 3
  },
  {
    type: 'jcb',
    name: 'JCB',
    icon: '/assets/payment-logos/jcb.svg',
    pattern: /^35/,
    validLengths: [15, 16],
    cvvLength: 3
  },
  {
    type: 'maestro',
    name: 'Maestro',
    icon: '/assets/payment-logos/maestro.svg',
    pattern: /^(5[0678]|6)/,
    validLengths: [12, 13, 14, 15, 16, 17, 18, 19],
    cvvLength: 3
  }
];

export class CardDetector {
  /**
   * Detect card type from card number
   */
  static detectCardType(cardNumber: string): CardInfo | null {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    for (const cardType of CARD_TYPES) {
      if (cardType.pattern.test(cleanNumber)) {
        return cardType;
      }
    }
    
    return null;
  }

  /**
   * Validate card number using Luhn algorithm
   */
  static validateCardNumber(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (!/^\d+$/.test(cleanNumber)) {
      return false;
    }

    const cardType = this.detectCardType(cleanNumber);
    if (!cardType) {
      return false;
    }

    if (!cardType.validLengths.includes(cleanNumber.length)) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Format card number with spaces
   */
  static formatCardNumber(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    const cardType = this.detectCardType(cleanNumber);
    
    if (!cardType) {
      return cleanNumber;
    }

    // Format based on card type
    switch (cardType.type) {
      case 'amex':
        return cleanNumber.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
      case 'diners':
        return cleanNumber.replace(/(\d{4})(\d{6})(\d{4})/, '$1 $2 $3');
      default:
        return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
  }

  /**
   * Validate CVV
   */
  static validateCVV(cvv: string, cardType: CardInfo | null): boolean {
    if (!cardType) {
      return /^\d{3,4}$/.test(cvv);
    }
    
    return new RegExp(`^\\d{${cardType.cvvLength}}$`).test(cvv);
  }

  /**
   * Validate expiry date
   */
  static validateExpiryDate(month: string, year: string): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) {
      return false;
    }
    
    if (expYear < currentYear) {
      return false;
    }
    
    if (expYear === currentYear && expMonth < currentMonth) {
      return false;
    }
    
    return true;
  }

  /**
   * Validate Luhn algorithm (alias for validateCardNumber)
   */
  static validateLuhn(cardNumber: string): boolean {
    return this.validateCardNumber(cardNumber);
  }

  /**
   * Format card number with spaces (overloaded method)
   */
  static formatCardNumberWithType(cardNumber: string, cardType?: CardInfo): string {
    return this.formatCardNumber(cardNumber);
  }
}

export default CardDetector;
