import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  Mail, 
  Phone, 
  ArrowLeft, 
  CheckCircle, 
  Clock,
  Shield,
  Key,
  AlertCircle
} from 'lucide-react';
import { Link } from 'wouter';

interface VerificationStep {
  step: 'email' | 'phone' | 'code' | 'password' | 'success';
  title: string;
  description: string;
}

export default function PasswordReset() {
  const [currentStep, setCurrentStep] = useState<'email' | 'phone' | 'code' | 'password' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const steps: VerificationStep[] = [
    {
      step: 'email',
      title: 'Enter Your Email',
      description: 'We\'ll send a verification code to your email address'
    },
    {
      step: 'phone',
      title: 'Verify Your Phone',
      description: 'We\'ll also send a code to your registered phone number'
    },
    {
      step: 'code',
      title: 'Enter Verification Codes',
      description: 'Please enter both codes to verify your identity'
    },
    {
      step: 'password',
      title: 'Create New Password',
      description: 'Enter your new secure password'
    },
    {
      step: 'success',
      title: 'Password Reset Complete',
      description: 'Your password has been successfully reset'
    }
  ];

  const currentStepData = steps.find(s => s.step === currentStep);

  const handleEmailSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email exists (simulate)
      if (email && email.includes('@')) {
        setSuccess('Verification code sent to your email');
        setCurrentStep('phone');
      } else {
        setError('Please enter a valid email address');
      }
    } catch (err) {
      setError('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if phone is valid (simulate)
      if (phone && phone.length >= 10) {
        setSuccess('Verification code sent to your phone');
        setCurrentStep('code');
      } else {
        setError('Please enter a valid phone number');
      }
    } catch (err) {
      setError('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeVerification = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if codes are valid (simulate)
      if (verificationCode && verificationCode.length >= 6) {
        setSuccess('Codes verified successfully');
        setCurrentStep('password');
      } else {
        setError('Please enter valid verification codes');
      }
    } catch (err) {
      setError('Invalid verification codes');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Validate passwords
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password reset successfully');
      setCurrentStep('success');
    } catch (err) {
      setError('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async (type: 'email' | 'phone') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(`${type === 'email' ? 'Email' : 'SMS'} code resent successfully`);
    } catch (err) {
      setError(`Failed to resend ${type} code`);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep === 'phone') setCurrentStep('email');
    else if (currentStep === 'code') setCurrentStep('phone');
    else if (currentStep === 'password') setCurrentStep('code');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <Key className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Secure password reset with dual verification</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => {
              const stepIndex = steps.findIndex(s => s.step === currentStep);
              const isCompleted = index < stepIndex;
              const isCurrent = index === stepIndex;
              
              return (
                <React.Fragment key={step.step}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              {currentStepData?.title}
            </CardTitle>
            <p className="text-gray-600 text-sm">
              {currentStepData?.description}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            {/* Step Content */}
            {currentStep === 'email' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleEmailSubmit}
                  disabled={isLoading || !email}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </div>
            )}

            {currentStep === 'phone' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send an SMS verification code
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={goBack}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handlePhoneSubmit}
                    disabled={isLoading || !phone}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send SMS Code'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'code' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                    Verification Code
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the 6-digit code sent to your email and phone
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => resendCode('email')}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Resend Email
                  </Button>
                  <Button 
                    onClick={() => resendCode('phone')}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Resend SMS
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={goBack}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleCodeVerification}
                    disabled={isLoading || !verificationCode}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Codes'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'password' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Password Requirements</span>
                  </div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains uppercase and lowercase letters</li>
                    <li>• Contains at least one number</li>
                    <li>• Contains at least one special character</li>
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={goBack}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handlePasswordReset}
                    disabled={isLoading || !newPassword || !confirmPassword}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'success' && (
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Password Reset Complete!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your password has been successfully reset. You can now log in with your new password.
                  </p>
                </div>

                <Link href="/login">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Go to Login
                  </Button>
                </Link>
              </div>
            )}

            {/* Back to Login */}
            {currentStep !== 'success' && (
              <div className="text-center pt-4 border-t border-gray-200">
                <Link href="/login">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Your account security is our priority</span>
          </div>
        </div>
      </div>
    </div>
  );
}








