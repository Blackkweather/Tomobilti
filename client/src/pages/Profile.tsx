import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar as CalendarIcon, 
  Crown, 
  CheckCircle, 
  Clock,
  Edit,
  Save,
  X,
  Camera,
  MapPin,
  Globe,
  Shield,
  Bell,
  Settings,
  Key,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  Star,
  Award,
  TrendingUp,
  Car,
  Calendar,
  CreditCard,
  FileText,
  Lock,
  Unlock,
  AlertTriangle,
  Info,
  Check,
  XCircle,
  Plus,
  Minus,
  RefreshCw,
  Share2,
  Bookmark,
  Heart,
  MessageSquare,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  Users,
  Zap,
  Target,
  Award as AwardIcon
} from 'lucide-react';
import Footer from '../components/Footer';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  dateOfBirth?: string;
  gender?: string;
  userType: 'renter' | 'owner' | 'both';
  membershipTier: 'purple' | 'black' | 'gold';
  isVerified: boolean;
  joinedAt: string;
  lastActiveAt: string;
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      marketing: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'friends';
      showEmail: boolean;
      showPhone: boolean;
      showLocation: boolean;
    };
    language: string;
    timezone: string;
    currency: string;
  };
  stats: {
    totalBookings: number;
    totalEarnings: number;
    averageRating: number;
    totalReviews: number;
    memberSince: string;
    carsOwned: number;
    tripsCompleted: number;
  };
}

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: '',
    location: '',
    website: '',
    dateOfBirth: '',
    gender: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      sms: true,
      push: true,
      marketing: false,
    },
    privacy: {
      profileVisibility: 'public' as const,
      showEmail: false,
      showPhone: false,
      showLocation: true,
    },
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
  });

  // Mock user profile data
  const userProfile: UserProfile = {
    id: user?.id || '1',
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    avatar: user?.profileImage || '/assets/placeholder-avatar.png',
    bio: 'Passionate car enthusiast and experienced driver. Love exploring new places and meeting new people through car sharing.',
    location: 'New York, NY',
    website: 'https://johndoe.com',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    userType: (user?.userType as 'renter' | 'owner' | 'both') || 'both' as 'renter' | 'owner' | 'both',
    membershipTier: (user?.membershipTier as 'purple' | 'black' | 'gold') || 'gold' as 'purple' | 'black' | 'gold',
    isVerified: true,
    joinedAt: '2023-01-15',
    lastActiveAt: new Date().toISOString(),
    preferences,
    stats: {
      totalBookings: 24,
      totalEarnings: 12500,
      averageRating: 4.8,
      totalReviews: 18,
      memberSince: '2023-01-15',
      carsOwned: 2,
      tripsCompleted: 24,
    }
  };

  const handleSave = () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
    // Mock profile update - in real app, this would call an API
    console.log('Profile updated:', formData);
  };

  const handleCancel = () => {
    setFormData({
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      phone: userProfile.phone || '',
      bio: userProfile.bio || '',
      location: userProfile.location || '',
      website: userProfile.website || '',
      dateOfBirth: userProfile.dateOfBirth || '',
      gender: userProfile.gender || '',
    });
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // TODO: Implement password change API call
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const getMembershipColor = (tier: string) => {
    switch (tier) {
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'black': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipLabel = (tier: string) => {
    switch (tier) {
      case 'purple': return 'Starter Boost';
      case 'black': return 'Elite Mobility';
      case 'gold': return 'Smart Driver';
      default: return 'Member';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You need to be logged in to view your profile.
            </p>
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Profile Header Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userProfile.avatar} alt={`${userProfile.firstName} ${userProfile.lastName}`} />
                    <AvatarFallback className="text-2xl">
                      {userProfile.firstName[0]}{userProfile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full"
                      onClick={() => {/* TODO: Implement avatar upload */}}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {userProfile.firstName} {userProfile.lastName}
                      </h2>
                      <div className="flex items-center gap-4 mb-3">
                        <Badge className={getMembershipColor(userProfile.membershipTier)}>
                          <Crown className="h-3 w-3 mr-1" />
                          {getMembershipLabel(userProfile.membershipTier)}
                        </Badge>
                        {userProfile.isVerified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge variant="outline" className="capitalize">
                          {userProfile.userType}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{userProfile.bio}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{userProfile.email}</span>
                        </div>
                        {userProfile.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{userProfile.phone}</span>
                          </div>
                        )}
                        {userProfile.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{userProfile.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Joined {formatDate(userProfile.joinedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Last Active</div>
                      <div className="text-sm font-medium">
                        {formatDate(userProfile.lastActiveAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Bookings</p>
                    <p className="text-2xl font-bold">{userProfile.stats.totalBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Earnings</p>
                    <p className="text-2xl font-bold">{formatCurrency(userProfile.stats.totalEarnings)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Average Rating</p>
                    <p className="text-2xl font-bold">{userProfile.stats.averageRating}</p>
                  </div>
                  <Star className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Cars Owned</p>
                    <p className="text-2xl font-bold">{userProfile.stats.carsOwned}</p>
                  </div>
                  <Car className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Completed booking</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Added new car</p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Received payment</p>
                          <p className="text-xs text-gray-500">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AwardIcon className="h-5 w-5 text-yellow-600" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Star className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Top Rated Host</p>
                          <p className="text-xs text-gray-500">4.8+ average rating</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Verified Member</p>
                          <p className="text-xs text-gray-500">Identity verified</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Car className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Car Owner</p>
                          <p className="text-xs text-gray-500">2 cars listed</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Change Password</h4>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                      <Button variant="outline" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </div>
                    
                    {showPasswordForm && (
                      <div className="space-y-4 p-4 border rounded-lg">
                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handlePasswordChange}>
                            <Save className="h-4 w-4 mr-2" />
                            Update Password
                          </Button>
                          <Button variant="outline" onClick={() => setShowPasswordForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline">
                        <Shield className="h-4 w-4 mr-2" />
                        Enable 2FA
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Login Sessions</h4>
                        <p className="text-sm text-gray-600">Manage your active sessions</p>
                      </div>
                      <Button variant="outline">
                        <Activity className="h-4 w-4 mr-2" />
                        View Sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-blue-600" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={preferences.notifications.email}
                        onCheckedChange={(checked) => 
                          setPreferences({
                            ...preferences,
                            notifications: { ...preferences.notifications, email: checked }
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates via SMS</p>
                      </div>
                      <Switch
                        checked={preferences.notifications.sms}
                        onCheckedChange={(checked) => 
                          setPreferences({
                            ...preferences,
                            notifications: { ...preferences.notifications, sms: checked }
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Receive push notifications</p>
                      </div>
                      <Switch
                        checked={preferences.notifications.push}
                        onCheckedChange={(checked) => 
                          setPreferences({
                            ...preferences,
                            notifications: { ...preferences.notifications, push: checked }
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing Emails</h4>
                        <p className="text-sm text-gray-600">Receive promotional content</p>
                      </div>
                      <Switch
                        checked={preferences.notifications.marketing}
                        onCheckedChange={(checked) => 
                          setPreferences({
                            ...preferences,
                            notifications: { ...preferences.notifications, marketing: checked }
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="profileVisibility">Profile Visibility</Label>
                      <Select
                        value={preferences.privacy.profileVisibility}
                        onValueChange={(value: any) => 
                          setPreferences({
                            ...preferences,
                            privacy: { ...preferences.privacy, profileVisibility: value }
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show Email</h4>
                        <p className="text-sm text-gray-600">Display email on profile</p>
                      </div>
                      <Switch
                        checked={preferences.privacy.showEmail}
                        onCheckedChange={(checked) => 
                          setPreferences({
                            ...preferences,
                            privacy: { ...preferences.privacy, showEmail: checked }
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show Phone</h4>
                        <p className="text-sm text-gray-600">Display phone on profile</p>
                      </div>
                      <Switch
                        checked={preferences.privacy.showPhone}
                        onCheckedChange={(checked) => 
                          setPreferences({
                            ...preferences,
                            privacy: { ...preferences.privacy, showPhone: checked }
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show Location</h4>
                        <p className="text-sm text-gray-600">Display location on profile</p>
                      </div>
                      <Switch
                        checked={preferences.privacy.showLocation}
                        onCheckedChange={(checked) => 
                          setPreferences({
                            ...preferences,
                            privacy: { ...preferences.privacy, showLocation: checked }
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Activity Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Completed booking #BK-001</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">Completed</Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Added new car: BMW X5</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                      <Badge variant="outline" className="text-blue-600">New Listing</Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Received payment: $150.00</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                      <Badge variant="outline" className="text-purple-600">Payment</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}