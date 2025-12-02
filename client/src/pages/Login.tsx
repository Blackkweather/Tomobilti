import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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
  Car,
  Zap
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

// Helper function for smart redirection based on user type
const redirectBasedOnUserType = (userType: string, setLocation: (path: string) => void) => {
  if (userType === 'admin') {
    setLocation('/admin');
    return;
  }
  if (userType === 'owner') {
    setLocation('/owner-dashboard');
  } else if (userType === 'renter') {
    setLocation('/renter-dashboard');
  } else if (userType === 'both') {
    setLocation('/dashboard'); // Show dashboard selector for users with both capabilities
  } else {
    // Unknown user type: send to admin if token exists and UI will guard, otherwise renter
    setLocation('/renter-dashboard');
  }
};

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated, loading, user, logout } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading && user) {
      // Smart redirection based on user type
      redirectBasedOnUserType(user.userType, setLocation);
    }
  }, [isAuthenticated, loading, user, setLocation]);

  // Show message if already authenticated
  if (isAuthenticated && !loading && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Already Signed In
            </CardTitle>
            <p className="text-gray-600 mt-2">
              You're already logged in as <span className="font-medium">{user.email}</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => {
                logout();
                window.location.reload();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Sign Out and Switch Account
            </Button>
            <Button
              onClick={() => redirectBasedOnUserType(user.userType, setLocation)}
              variant="outline"
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(form.email, form.password);
      // Smart redirection based on user type
      redirectBasedOnUserType(response.user.userType, setLocation);
    } catch (err: any) {
      setError(err.message || 'Login error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
              <img 
                src="/assets/MAIN LOGO.png?v=5" 
                alt="ShareWheelz" 
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome Back!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Sign in to continue your journey with the UK's leading peer-to-peer car rental platform.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Multiple Vehicles</h3>
                <p className="text-gray-600">From city cars to luxury vehicles</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">100% Secure</h3>
                <p className="text-gray-600">Verified owners and full insurance</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Instant Booking</h3>
                <p className="text-gray-600">Book and drive in minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Excellent Service</h3>
                <p className="text-gray-600">Trusted by our growing community</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Growing</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Ongoing</div>
              <div className="text-sm text-gray-600">Successful Rentals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:max-w-none">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto h-16 w-auto flex items-center justify-center mb-4">
                <img 
                  src="/assets/MAIN LOGO.png?v=5" 
                  alt="ShareWheelz" 
                  className="h-16 w-auto"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Sign in to your account
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Or{' '}
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  create a new account
                </Link>
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      autoComplete="current-password"
                      required
                      disabled={isLoading}
                      value={form.password}
                      onChange={handleChange('password')}
                      className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="Your password"
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

                {/* Error Alert */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/password-reset"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
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
                      <span className="ml-2">Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Sign In
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Social Login Buttons - Outside the form */}
              <SocialLoginButtons 
                onSuccess={(user) => {
                  console.log('OAuth login successful:', user);
                  redirectBasedOnUserType(user.userType, setLocation);
                }}
                onError={(error) => {
                  setError(error);
                }}
              />

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
