import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from './ui/dialog';
import { 
  Phone, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  AlertCircle,
  Shield
} from 'lucide-react';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentPhone?: string;
}

export default function PhoneVerificationModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  currentPhone 
}: PhoneVerificationModalProps) {
  const [phoneNumber, setPhoneNumber] = useState(currentPhone || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [step, setStep] = useState<'phone' | 'code'>('phone');

  // Timer for resend cooldown
  const startTimer = () => {
    setTimeLeft(60); // 60 seconds cooldown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsSendingCode(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/send-phone-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ phone: phoneNumber })
      });

      if (response.ok) {
        setSuccess(true);
        setStep('code');
        startTimer();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send verification code');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ 
          phone: phoneNumber,
          code: verificationCode 
        })
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setVerificationCode('');
        setPhoneNumber('');
        setStep('phone');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid verification code');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber(currentPhone || '');
    setVerificationCode('');
    setError('');
    setSuccess(false);
    setTimeLeft(0);
    setStep('phone');
    onClose();
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      setError('');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d+\-\s()]/g, ''); // Allow phone number characters
    setPhoneNumber(value);
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Verify Your Phone Number
          </DialogTitle>
          <DialogDescription>
            {step === 'phone' 
              ? 'Enter your phone number to receive a verification code via SMS.'
              : `We've sent a 6-digit verification code to ${phoneNumber}`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">
                Verification code sent successfully!
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Phone Number Input */}
          {step === 'phone' && (
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="+44 20 1234 5678"
                className="text-center"
              />
              <p className="text-xs text-gray-500">
                Include country code (e.g., +44 for UK, +1 for US)
              </p>
            </div>
          )}

          {/* Verification Code Input */}
          {step === 'code' && (
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="verification-code"
                  type="text"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  placeholder="123456"
                  className="text-center text-lg font-mono tracking-widest"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter the 6-digit code sent to your phone
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {step === 'phone' ? (
              <Button
                onClick={handleSendCode}
                disabled={isSendingCode || !phoneNumber.trim()}
                className="w-full"
              >
                {isSendingCode ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Send Verification Code
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify Phone Number
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSendCode}
                  disabled={isSendingCode || timeLeft > 0}
                  className="w-full"
                >
                  {isSendingCode ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : timeLeft > 0 ? (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Resend in {timeLeft}s
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      Resend Code
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• SMS delivery may take a few minutes</p>
            <p>• The code expires in 15 minutes</p>
            <p>• You can request a new code after 1 minute</p>
            <p>• Standard SMS rates may apply</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
