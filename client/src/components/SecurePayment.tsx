import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  CreditCard, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  EyeOff,
  Banknote,
  Clock,
  Star
} from 'lucide-react';

interface SecurePaymentProps {
  amount: number;
  currency: string;
  onPayment: (paymentData: any) => void;
  onCancel: () => void;
}

export default function SecurePayment({ amount, currency, onPayment, onCancel }: SecurePaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'wallet'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    billingAddress: ''
  });
  const [showCvv, setShowCvv] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [securityChecks, setSecurityChecks] = useState({
    fraudCheck: false,
    identityVerification: false,
    paymentVerification: false
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate security checks
    setTimeout(() => {
      setSecurityChecks({
        fraudCheck: true,
        identityVerification: true,
        paymentVerification: true
      });
      
      setTimeout(() => {
        onPayment({
          method: paymentMethod,
          amount,
          currency,
          transactionId: `TXN_${Date.now()}`,
          securityScore: 95
        });
        setIsProcessing(false);
      }, 2000);
    }, 1000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (cleanNumber.startsWith('5')) return 'Mastercard';
    if (cleanNumber.startsWith('3')) return 'American Express';
    return 'Card';
  };

  return (
    <div className="space-y-6">
      {/* Payment Amount */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-green-600">
              {currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '£'} {amount.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Includes insurance, service fees, and taxes
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Shield className="h-5 w-5" />
            Secure Payment Protection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Fraud protection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>PCI DSS compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Identity verification</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Card
              </Button>
              <Button
                variant={paymentMethod === 'bank' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('bank')}
                className="flex items-center gap-2"
              >
                <Banknote className="h-4 w-4" />
                Bank Transfer
              </Button>
              <Button
                variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('wallet')}
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Digital Wallet
              </Button>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={(e) => setCardData(prev => ({ 
                        ...prev, 
                        number: formatCardNumber(e.target.value) 
                      }))}
                      maxLength={19}
                    />
                    {cardData.number && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Badge variant="outline" className="text-xs">
                          {getCardType(cardData.number)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        setCardData(prev => ({ ...prev, expiry: value }));
                      }}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <div className="relative">
                      <Input
                        id="cvv"
                        placeholder="123"
                        type={showCvv ? 'text' : 'password'}
                        value={cardData.cvv}
                        onChange={(e) => setCardData(prev => ({ 
                          ...prev, 
                          cvv: e.target.value.replace(/\D/g, '').substring(0, 4) 
                        }))}
                        maxLength={4}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowCvv(!showCvv)}
                      >
                        {showCvv ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardData.name}
                    onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Input
                    id="billingAddress"
                    placeholder="123 Main Street, London, UK"
                    value={cardData.billingAddress}
                    onChange={(e) => setCardData(prev => ({ ...prev, billingAddress: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Bank Transfer Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Account Name:</span>
                      <span className="font-medium">Tomobilto Ltd</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sort Code:</span>
                      <span className="font-medium">20-00-00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Number:</span>
                      <span className="font-medium">12345678</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reference:</span>
                      <span className="font-medium">TOM-{Date.now()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  Payment will be processed within 1-3 business days
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Apple Pay
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Google Pay
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <Lock className="h-4 w-4 inline mr-1" />
                  Secure digital wallet payment with biometric authentication
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Checks */}
      {isProcessing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Clock className="h-5 w-5 animate-spin" />
              Processing Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {securityChecks.fraudCheck ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                )}
                <span className="text-sm">Fraud detection check</span>
              </div>
              <div className="flex items-center gap-2">
                {securityChecks.identityVerification ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                )}
                <span className="text-sm">Identity verification</span>
              </div>
              <div className="flex items-center gap-2">
                {securityChecks.paymentVerification ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                )}
                <span className="text-sm">Payment authorization</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={isProcessing || (paymentMethod === 'card' && (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name))}
        >
          {isProcessing ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Pay Securely
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
