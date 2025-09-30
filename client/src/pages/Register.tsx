import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import SocialLoginButtons from '../components/SocialLoginButtons';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Users,
  Car,
  Zap,
  Clock,
  Heart,
  User,
  Phone,
  UserCheck
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

// Helper function for smart redirection based on user type
const redirectBasedOnUserType = (userType: string, setLocation: (path: string) => void) => {
  if (userType === 'owner') {
    setLocation('/dashboard/owner');
  } else if (userType === 'renter') {
    setLocation('/dashboard/renter');
  } else if (userType === 'both') {
    setLocation('/dashboard'); // Show dashboard selector for users with both capabilities
  } else {
    setLocation('/dashboard/renter'); // Fallback to renter dashboard
  }
};

export default function Register() {
  const [, setLocation] = useLocation();
  const { register, isAuthenticated, loading } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: 'renter' as 'renter' | 'owner' | 'both'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      // Smart redirection based on user type
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      redirectBasedOnUserType(user.userType, setLocation);
    }
  }, [isAuthenticated, loading, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must contain at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        userType: form.userType
      });
      // Smart redirection based on user type
      redirectBasedOnUserType(response.user.userType, setLocation);
    } catch (err: any) {
      setError(err.message || 'Registration error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Platform Info */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShareWheelz
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join ShareWheelz Today!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Start your journey with the UK's leading peer-to-peer car rental platform. Rent cars from locals or earn money by sharing yours.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Rent Anywhere</h3>
                <p className="text-gray-600">Access 2,500+ vehicles across the UK</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">100% Secure</h3>
                <p className="text-gray-600">Verified users and full insurance coverage</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Instant Booking</h3>
                <p className="text-gray-600">Book and drive in minutes, not hours</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Earn Money</h3>
                <p className="text-gray-600">Turn your car into a source of income</p>
              </div>
            </div>
          </div>

          {/* User Types */}
          <div className="space-y-4 pt-8 border-t">
            <h3 className="font-semibold text-gray-900 text-lg">Choose Your Role</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Renter</div>
                    <div className="text-sm text-gray-600">Rent cars from local owners</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Owner</div>
                    <div className="text-sm text-gray-600">Share your car and earn money</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Both</div>
                    <div className="text-sm text-gray-600">Rent and share - maximum flexibility</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side - Registration Form */}
        <div className="w-full max-w-md mx-auto lg:max-w-none">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto h-16 w-16 flex items-center justify-center mb-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ShareWheelz
                </span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Create your account
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Or{' '}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  sign in to your existing account
                </Link>
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        disabled={isLoading}
                        value={form.firstName}
                        onChange={handleChange('firstName')}
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="First name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        required
                        disabled={isLoading}
                        value={form.lastName}
                        onChange={handleChange('lastName')}
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={isLoading}
                      value={form.email}
                      onChange={handleChange('email')}
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number (Optional)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      disabled={isLoading}
                      value={form.phone}
                      onChange={handleChange('phone')}
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="+44 7XXX XXX XXX"
                    />
                  </div>
                </div>

                {/* User Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="userType" className="text-sm font-medium text-gray-700">
                    Account Type
                  </Label>
                  <select
                    id="userType"
                    name="userType"
                    disabled={isLoading}
                    value={form.userType}
                    onChange={handleChange('userType')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="renter">Renter - I want to rent cars</option>
                    <option value="owner">Owner - I want to rent out my car</option>
                    <option value="both">Both - I want to rent and rent out cars</option>
                  </select>
                  <p className="text-xs text-gray-500">
                    You can change this later in your profile settings.
                  </p>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      disabled={isLoading}
                      value={form.password}
                      onChange={handleChange('password')}
                      className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      disabled={isLoading}
                      value={form.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Terms and Conditions */}
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms-policies" className="text-blue-600 hover:text-blue-500 font-medium">
                      Terms & Policies
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Create Account
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </div>
                  )}
                </Button>

                {/* Social Login Buttons */}
                <SocialLoginButtons />
              </form>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-4 border-t">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-green-600" />
                  SSL Secured
                </div>
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-1 text-blue-600" />
                  Encrypted
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-purple-600" />
                  Verified
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
