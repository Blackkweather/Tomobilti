/**
 * UK Phone Number utilities for ShareWheelz platform
 * Handles UK phone number formatting, validation, and display
 */

export const UK_COUNTRY_CODE = '+44' as const;
export const UK_PHONE_PREFIXES = [
  '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', // London and surrounding
  '11', '12', '13', '14', '15', '16', '17', '18', '19', // Various regions
  '7', '8', '9' // Mobile prefixes
] as const;

/**
 * Format a phone number to UK format
 * @param phoneNumber - Raw phone number
 * @param includeCountryCode - Whether to include +44 prefix (default: true)
 * @returns Formatted UK phone number
 */
export function formatUKPhoneNumber(
  phoneNumber: string, 
  includeCountryCode: boolean = true
): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle different input formats
  let formatted = cleaned;
  
  // If it starts with 44, remove it (we'll add +44)
  if (cleaned.startsWith('44')) {
    formatted = cleaned.substring(2);
  }
  
  // If it starts with 0, remove it (UK national format)
  if (formatted.startsWith('0')) {
    formatted = formatted.substring(1);
  }
  
  // Format based on length
  if (formatted.length === 10) {
    // Mobile or landline: 7XXX XXX XXX
    const areaCode = formatted.substring(0, 4);
    const firstPart = formatted.substring(4, 7);
    const secondPart = formatted.substring(7);
    
    if (includeCountryCode) {
      return `+44 ${areaCode} ${firstPart} ${secondPart}`;
    } else {
      return `0${areaCode} ${firstPart} ${secondPart}`;
    }
  } else if (formatted.length === 11) {
    // Some landlines: 20X XXX XXXX
    const areaCode = formatted.substring(0, 3);
    const firstPart = formatted.substring(3, 6);
    const secondPart = formatted.substring(6);
    
    if (includeCountryCode) {
      return `+44 ${areaCode} ${firstPart} ${secondPart}`;
    } else {
      return `0${areaCode} ${firstPart} ${secondPart}`;
    }
  }
  
  // Fallback: return as-is with country code if requested
  return includeCountryCode ? `+44 ${formatted}` : formatted;
}

/**
 * Validate UK phone number format
 * @param phoneNumber - Phone number to validate
 * @returns Validation result with details
 */
export function validateUKPhoneNumber(phoneNumber: string): {
  isValid: boolean;
  formatted?: string;
  error?: string;
} {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid UK number length
  if (cleaned.length < 10 || cleaned.length > 11) {
    return {
      isValid: false,
      error: 'UK phone numbers must be 10-11 digits long'
    };
  }
  
  // Check if it starts with valid UK prefixes
  let numberToCheck = cleaned;
  
  // Remove country code if present
  if (cleaned.startsWith('44')) {
    numberToCheck = cleaned.substring(2);
  }
  
  // Remove leading 0 if present
  if (numberToCheck.startsWith('0')) {
    numberToCheck = numberToCheck.substring(1);
  }
  
  // Check mobile numbers (start with 7)
  if (numberToCheck.startsWith('7') && numberToCheck.length === 10) {
    return {
      isValid: true,
      formatted: formatUKPhoneNumber(phoneNumber)
    };
  }
  
  // Check landline numbers
  const validLandlinePrefixes = ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29'];
  const areaCode = numberToCheck.substring(0, 2);
  
  if (validLandlinePrefixes.includes(areaCode) && numberToCheck.length === 10) {
    return {
      isValid: true,
      formatted: formatUKPhoneNumber(phoneNumber)
    };
  }
  
  return {
    isValid: false,
    error: 'Invalid UK phone number format'
  };
}

/**
 * Get phone number placeholder for UK format
 * @returns UK phone number placeholder string
 */
export function getUKPhonePlaceholder(): string {
  return '+44 7XXX XXX XXX';
}

/**
 * Extract area code from UK phone number
 * @param phoneNumber - UK phone number
 * @returns Area code or null if not found
 */
export function extractUKAreaCode(phoneNumber: string): string | null {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  let numberToCheck = cleaned;
  
  // Remove country code if present
  if (cleaned.startsWith('44')) {
    numberToCheck = cleaned.substring(2);
  }
  
  // Remove leading 0 if present
  if (numberToCheck.startsWith('0')) {
    numberToCheck = numberToCheck.substring(1);
  }
  
  // Extract area code
  if (numberToCheck.startsWith('7')) {
    return 'Mobile';
  } else if (numberToCheck.length >= 2) {
    return numberToCheck.substring(0, 2);
  }
  
  return null;
}

/**
 * Check if phone number is mobile
 * @param phoneNumber - UK phone number
 * @returns True if mobile number
 */
export function isUKMobileNumber(phoneNumber: string): boolean {
  const cleaned = phoneNumber.replace(/\D/g, '');
  let numberToCheck = cleaned;
  
  // Remove country code if present
  if (cleaned.startsWith('44')) {
    numberToCheck = cleaned.substring(2);
  }
  
  // Remove leading 0 if present
  if (numberToCheck.startsWith('0')) {
    numberToCheck = numberToCheck.substring(1);
  }
  
  return numberToCheck.startsWith('7') && numberToCheck.length === 10;
}

/**
 * Get UK phone number examples
 * @returns Array of example UK phone numbers
 */
export function getUKPhoneExamples(): string[] {
  return [
    '+44 7700 900123', // Mobile
    '+44 20 7946 0958', // London landline
    '+44 161 234 5678', // Manchester landline
    '+44 131 234 5678', // Edinburgh landline
    '+44 121 234 5678'  // Birmingham landline
  ];
}
