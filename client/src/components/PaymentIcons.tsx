import React from 'react';

// Official Payment Logos from datatrans/payment-logos repository
// https://github.com/datatrans/payment-logos

// Visa Logo Component
export const VisaIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/assets/payment-logos/visa.svg" 
    alt="Visa" 
    className={className}
    style={{ maxWidth: '100%', height: 'auto' }}
  />
);

// Mastercard Logo Component
export const MastercardIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/assets/payment-logos/mastercard.svg" 
    alt="Mastercard" 
    className={className}
    style={{ maxWidth: '100%', height: 'auto' }}
  />
);

// Maestro Logo Component
export const MaestroIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/assets/payment-logos/maestro.svg" 
    alt="Maestro" 
    className={className}
    style={{ maxWidth: '100%', height: 'auto' }}
  />
);

// American Express Logo Component
export const AmexIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/assets/payment-logos/american-express.svg" 
    alt="American Express" 
    className={className}
    style={{ maxWidth: '100%', height: 'auto' }}
  />
);

// Discover Logo Component
export const DiscoverIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/assets/payment-logos/discover.svg" 
    alt="Discover" 
    className={className}
    style={{ maxWidth: '100%', height: 'auto' }}
  />
);

// PayPal Logo Component
export const PayPalIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/assets/payment-logos/paypal.svg" 
    alt="PayPal" 
    className={className}
    style={{ maxWidth: '100%', height: 'auto' }}
  />
);

// Apple Pay Logo Component
export const ApplePayIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/assets/payment-logos/apple-pay.svg" 
    alt="Apple Pay" 
    className={className}
    style={{ maxWidth: '100%', height: 'auto' }}
  />
);

// Google Pay Logo Component
export const GooglePayIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/assets/payment-logos/google-pay.svg" 
    alt="Google Pay" 
    className={className}
    style={{ maxWidth: '100%', height: 'auto' }}
  />
);

// Samsung Pay Logo Component
export const SamsungPayIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/assets/payment-logos/samsung-pay.svg" 
    alt="Samsung Pay" 
    className={className}
    style={{ maxWidth: '100%', height: 'auto' }}
  />
);

// Generic Card Icon Component (fallback)
export const CardIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div className={`${className} bg-gray-200 rounded flex items-center justify-center`}>
    <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-500" fill="currentColor">
      <rect x="2" y="6" width="20" height="12" rx="2" fill="currentColor" opacity="0.3"/>
      <rect x="2" y="4" width="20" height="2" fill="currentColor"/>
      <circle cx="6" cy="12" r="1" fill="currentColor"/>
      <rect x="10" y="11" width="8" height="2" rx="1" fill="currentColor"/>
    </svg>
  </div>
);

// Payment method icon mapping
export const getPaymentIcon = (cardType: string, className?: string) => {
  const iconProps = { className: className || "w-6 h-6" };
  
  switch (cardType.toLowerCase()) {
    case 'visa':
      return <VisaIcon {...iconProps} />;
    case 'mastercard':
      return <MastercardIcon {...iconProps} />;
    case 'maestro':
      return <MaestroIcon {...iconProps} />;
    case 'amex':
    case 'american express':
      return <AmexIcon {...iconProps} />;
    case 'discover':
      return <DiscoverIcon {...iconProps} />;
    case 'paypal':
      return <PayPalIcon {...iconProps} />;
    case 'apple_pay':
    case 'apple pay':
      return <ApplePayIcon {...iconProps} />;
    case 'google_pay':
    case 'google pay':
      return <GooglePayIcon {...iconProps} />;
    case 'samsung_pay':
    case 'samsung pay':
      return <SamsungPayIcon {...iconProps} />;
    default:
      return <CardIcon {...iconProps} />;
  }
};

// Payment method icons for selection
export const PaymentMethodIcons = {
  visa: VisaIcon,
  mastercard: MastercardIcon,
  maestro: MaestroIcon,
  amex: AmexIcon,
  discover: DiscoverIcon,
  paypal: PayPalIcon,
  apple_pay: ApplePayIcon,
  google_pay: GooglePayIcon,
  samsung_pay: SamsungPayIcon,
  card: CardIcon,
};

// All available payment logos
export const PaymentLogos = {
  // Credit/Debit Cards
  visa: '/assets/payment-logos/visa.svg',
  mastercard: '/assets/payment-logos/mastercard.svg',
  maestro: '/assets/payment-logos/maestro.svg',
  'american-express': '/assets/payment-logos/american-express.svg',
  discover: '/assets/payment-logos/discover.svg',
  
  // Digital Wallets
  paypal: '/assets/payment-logos/paypal.svg',
  'apple-pay': '/assets/payment-logos/apple-pay.svg',
  'google-pay': '/assets/payment-logos/google-pay.svg',
  'samsung-pay': '/assets/payment-logos/samsung-pay.svg',
};

export default {
  VisaIcon,
  MastercardIcon,
  MaestroIcon,
  AmexIcon,
  DiscoverIcon,
  PayPalIcon,
  ApplePayIcon,
  GooglePayIcon,
  SamsungPayIcon,
  CardIcon,
  getPaymentIcon,
  PaymentMethodIcons,
  PaymentLogos,
};