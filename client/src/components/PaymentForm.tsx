import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Smartphone,
  Globe
} from 'lucide-react';
import CardDetector, { CardInfo } from '../utils/cardDetector';
import { getPaymentIcon, PayPalIcon, ApplePayIcon, GooglePayIcon, SamsungPayIcon } from './PaymentIcons';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'samsung_pay';
}

interface PaymentFormProps {
  amount: number;
  currency?: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
  isLoading?: boolean;
}

export default function PaymentForm({ 
  amount, 
  currency = 'GBP', 
  onPaymentSuccess, 
  onPaymentError,
  isLoading = false 
}: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [detectedCard, setDetectedCard] = useState<CardInfo | null>(null);
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, Maestro',
      type: 'card'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <PayPalIcon className="w-6 h-6" />,
      description: 'Pay with your PayPal account',
      type: 'paypal'
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: <ApplePayIcon className="w-6 h-6" />,
      description: 'Pay with Touch ID or Face ID',
      type: 'apple_pay'
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      icon: <GooglePayIcon className="w-6 h-6" />,
      description: 'Pay with your Google account',
      type: 'google_pay'
    },
    {
      id: 'samsung_pay',
      name: 'Samsung Pay',
      icon: <SamsungPayIcon className="w-6 h-6" />,
      description: 'Pay with Samsung Pay',
      type: 'samsung_pay'
    }
  ];

  // Detect card type when card number changes
  useEffect(() => {
    if (cardNumber.length >= 4) {
      const detected = CardDetector.detectCardType(cardNumber);
      setDetectedCard(detected);
    } else {
      setDetectedCard(null);
    }
  }, [cardNumber]);

  // Validate form fields
  const validateCardForm = () => {
    const errors: Record<string, string> = {};

    if (!cardNumber) {
      errors.cardNumber = 'Card number is required';
    } else if (!CardDetector.validateCardNumber(cardNumber)) {
      errors.cardNumber = 'Invalid card number';
    }

    if (!expiryMonth || !expiryYear) {
      errors.expiry = 'Expiry date is required';
    } else if (!CardDetector.validateExpiryDate(expiryMonth, expiryYear)) {
      errors.expiry = 'Card has expired';
    }

    if (!cvv) {
      errors.cvv = 'CVV is required';
    } else if (!CardDetector.validateCVV(cvv, detectedCard)) {
      errors.cvv = `CVV must be ${detectedCard?.cvvLength || 3} digits`;
    }

    if (!cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = CardDetector.formatCardNumber(value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'month' | 'year') => {
    const value = e.target.value.replace(/\D/g, '');
    if (type === 'month') {
      setExpiryMonth(value.slice(0, 2));
    } else {
      setExpiryYear(value.slice(0, 4));
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const maxLength = detectedCard?.cvvLength || 3;
    setCvv(value.slice(0, maxLength));
  };

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Create PayPal payment URL
      const paypalUrl = `https://www.paypal.com/paypalme/sharewheelz/${amount}`;
      
      // Open PayPal in new window
      const paypalWindow = window.open(
        paypalUrl,
        'paypal',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      // Listen for PayPal completion (this is a simplified version)
      const checkClosed = setInterval(() => {
        if (paypalWindow?.closed) {
          clearInterval(checkClosed);
          setIsProcessing(false);
          
          // In a real implementation, you'd verify the payment with PayPal's API
          // For now, we'll simulate success
          setTimeout(() => {
            onPaymentSuccess({
              method: 'paypal',
              amount,
              currency,
              transactionId: `paypal_${Date.now()}`
            });
          }, 1000);
        }
      }, 1000);

    } catch (error) {
      setIsProcessing(false);
      onPaymentError('PayPal payment failed');
    }
  };

  const handleCardPayment = async () => {
    if (!validateCardForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, you'd call your payment service here
      onPaymentSuccess({
        method: 'card',
        cardType: detectedCard?.type,
        last4: cardNumber.slice(-4),
        amount,
        currency,
        transactionId: `card_${Date.now()}`
      });

    } catch (error) {
      onPaymentError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    switch (selectedMethod) {
      case 'card':
        await handleCardPayment();
        break;
      case 'paypal':
        await handlePayPalPayment();
        break;
      case 'apple_pay':
      case 'google_pay':
        // These would integrate with Apple Pay/Google Pay APIs
        onPaymentError('Apple Pay/Google Pay integration coming soon');
        break;
      default:
        onPaymentError('Please select a payment method');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Payment Amount */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">
              {currency} {amount.toFixed(2)}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Total amount to pay</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Choose Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-mauve-500 bg-mauve-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">{method.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium">{method.name}</h4>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
              {selectedMethod === method.id && (
                <CheckCircle className="w-5 h-5 text-mauve-600" />
              )}
            </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Card Payment Form */}
      {selectedMethod === 'card' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Card Details
              {detectedCard && (
                <Badge variant="secondary" className="ml-auto">
                  {detectedCard.name}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className={cardErrors.cardNumber ? 'border-red-500' : ''}
                />
                {detectedCard && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getPaymentIcon(detectedCard.type, "w-6 h-6")}
                  </div>
                )}
              </div>
              {cardErrors.cardNumber && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {cardErrors.cardNumber}
                </p>
              )}
            </div>

            {/* Expiry Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Month</Label>
                <Input
                  id="expiryMonth"
                  type="text"
                  placeholder="MM"
                  value={expiryMonth}
                  onChange={(e) => handleExpiryChange(e, 'month')}
                  className={cardErrors.expiry ? 'border-red-500' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryYear">Year</Label>
                <Input
                  id="expiryYear"
                  type="text"
                  placeholder="YYYY"
                  value={expiryYear}
                  onChange={(e) => handleExpiryChange(e, 'year')}
                  className={cardErrors.expiry ? 'border-red-500' : ''}
                />
              </div>
            </div>
            {cardErrors.expiry && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {cardErrors.expiry}
              </p>
            )}

            {/* CVV */}
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                placeholder={detectedCard?.cvvLength === 4 ? '1234' : '123'}
                value={cvv}
                onChange={handleCVVChange}
                className={cardErrors.cvv ? 'border-red-500' : ''}
              />
              {cardErrors.cvv && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {cardErrors.cvv}
                </p>
              )}
            </div>

            {/* Cardholder Name */}
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                type="text"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className={cardErrors.cardholderName ? 'border-red-500' : ''}
              />
              {cardErrors.cardholderName && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {cardErrors.cardholderName}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PayPal Payment Info */}
      {selectedMethod === 'paypal' && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <PayPalIcon className="w-16 h-16" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Pay with PayPal</h3>
            <p className="text-gray-600 mb-4">
              You'll be redirected to PayPal to complete your payment securely.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Amount:</strong> {currency} {amount.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Apple Pay / Google Pay / Samsung Pay Info */}
      {(selectedMethod === 'apple_pay' || selectedMethod === 'google_pay' || selectedMethod === 'samsung_pay') && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              {selectedMethod === 'apple_pay' ? (
                <ApplePayIcon className="w-16 h-16" />
              ) : selectedMethod === 'google_pay' ? (
                <GooglePayIcon className="w-16 h-16" />
              ) : (
                <SamsungPayIcon className="w-16 h-16" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {selectedMethod === 'apple_pay' ? 'Apple Pay' : 
               selectedMethod === 'google_pay' ? 'Google Pay' : 'Samsung Pay'}
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedMethod === 'apple_pay' 
                ? 'Pay securely with Touch ID or Face ID'
                : selectedMethod === 'google_pay'
                ? 'Pay securely with your Google account'
                : 'Pay securely with Samsung Pay'
              }
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Amount:</strong> {currency} {amount.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pay Button */}
      <Button
        onClick={handlePayment}
        disabled={isProcessing || isLoading}
        className="w-full h-12 text-lg"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Pay {currency} {amount.toFixed(2)}
          </>
        )}
      </Button>

      {/* Security Notice */}
      <div className="text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2">
          <Lock className="w-4 h-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
}
