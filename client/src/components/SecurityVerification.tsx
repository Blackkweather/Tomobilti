import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  Upload, 
  Phone, 
  Mail, 
  CreditCard,
  Car,
  AlertTriangle,
  Star
} from 'lucide-react';

interface SecurityVerificationProps {
  user: {
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isIdVerified: boolean;
    isLicenseVerified: boolean;
    isBackgroundChecked: boolean;
    securityScore: number;
    isBlocked: boolean;
    blockReason?: string;
  };
  onVerify: (type: string) => void;
}

export default function SecurityVerification({ user, onVerify }: SecurityVerificationProps) {
  const [uploading, setUploading] = useState<string | null>(null);

  const verificationSteps = [
    {
      id: 'email',
      title: 'Email Verification',
      description: 'Verify your email address',
      icon: Mail,
      completed: user.isEmailVerified,
      required: true,
      action: 'Verify Email'
    },
    {
      id: 'phone',
      title: 'Phone Verification',
      description: 'Verify your phone number',
      icon: Phone,
      completed: user.isPhoneVerified,
      required: true,
      action: 'Verify Phone'
    },
    {
      id: 'id',
      title: 'ID Verification',
      description: 'Upload government-issued ID',
      icon: CreditCard,
      completed: user.isIdVerified,
      required: true,
      action: 'Upload ID'
    },
    {
      id: 'license',
      title: 'Driver License',
      description: 'Upload valid driving license',
      icon: Car,
      completed: user.isLicenseVerified,
      required: true,
      action: 'Upload License'
    },
    {
      id: 'background',
      title: 'Background Check',
      description: 'Complete background verification',
      icon: Shield,
      completed: user.isBackgroundChecked,
      required: false,
      action: 'Start Check'
    }
  ];

  const calculateSecurityScore = () => {
    const requiredSteps = verificationSteps.filter(step => step.required);
    const completedRequired = requiredSteps.filter(step => step.completed).length;
    const optionalSteps = verificationSteps.filter(step => !step.required);
    const completedOptional = optionalSteps.filter(step => step.completed).length;
    
    const requiredScore = (completedRequired / requiredSteps.length) * 70;
    const optionalScore = (completedOptional / optionalSteps.length) * 30;
    
    return Math.round(requiredScore + optionalScore);
  };

  const securityScore = calculateSecurityScore();
  const completedSteps = verificationSteps.filter(step => step.completed).length;
  const totalSteps = verificationSteps.length;

  if (user.isBlocked) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Account Restricted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">
            Your account has been temporarily restricted for security reasons.
          </p>
          {user.blockReason && (
            <p className="text-sm text-red-500 mb-4">
              Reason: {user.blockReason}
            </p>
          )}
          <Button variant="outline" className="border-red-300 text-red-600">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Security Score</span>
              <span className="text-2xl font-bold text-green-600">{securityScore}%</span>
            </div>
            <Progress value={securityScore} className="h-2" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{completedSteps} of {totalSteps} verifications completed</span>
              <Badge variant={securityScore >= 80 ? "default" : securityScore >= 60 ? "secondary" : "destructive"}>
                {securityScore >= 80 ? "High Security" : securityScore >= 60 ? "Medium Security" : "Low Security"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Steps */}
      <div className="grid gap-4">
        {verificationSteps.map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.id} className={`${step.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${step.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Icon className={`h-5 w-5 ${step.completed ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {step.title}
                        {step.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                        {step.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {step.completed ? (
                      <Badge variant="default" className="bg-green-600">
                        Verified
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onVerify(step.id)}
                        disabled={uploading === step.id}
                      >
                        {uploading === step.id ? (
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        {step.action}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Security Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Instant booking approval</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Higher trust rating</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Priority customer support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Enhanced insurance coverage</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
