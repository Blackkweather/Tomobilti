import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Shield, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  Car, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Star,
  Eye
} from 'lucide-react';
import SecurityVerification from '../components/SecurityVerification';
import VehicleSafety from '../components/VehicleSafety';
import SecurityReviews from '../components/SecurityReviews';
import FraudDetection from '../components/FraudDetection';
import EmailVerificationModal from '../components/EmailVerificationModal';
import PhoneVerificationModal from '../components/PhoneVerificationModal';
import DocumentUploadModal from '../components/DocumentUploadModal';
import BackgroundCheckModal from '../components/BackgroundCheckModal';

export default function Security() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('verification');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [documentType, setDocumentType] = useState<'id' | 'license'>('id');
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState({
    name: user?.emergencyContactName || '',
    phone: user?.emergencyContactPhone || '',
    relation: user?.emergencyContactRelation || ''
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be logged in to access security settings.</p>
        </div>
      </div>
    );
  }

  const handleVerification = async (type: string) => {
    try {
      switch (type) {
        case 'email':
          // Open email verification modal
          setIsEmailModalOpen(true);
          break;
          
        case 'phone':
          // Open phone verification modal
          setIsPhoneModalOpen(true);
          break;
          
        case 'id':
          // Open ID document upload modal
          setDocumentType('id');
          setIsDocumentModalOpen(true);
          break;
          
        case 'license':
          // Open license document upload modal
          setDocumentType('license');
          setIsDocumentModalOpen(true);
          break;
          
        case 'background':
          // Open background check modal
          setIsBackgroundModalOpen(true);
          break;
          
        default:
          console.log(`Starting ${type} verification...`);
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('An error occurred during verification. Please try again.');
    }
  };

  const handleEmailVerificationSuccess = () => {
    // Refresh user data or show success message
    alert('Email verified successfully!');
    // You might want to refresh the user data here
    // or update the local state to reflect the verification
  };

  const handlePhoneVerificationSuccess = () => {
    alert('Phone number verified successfully!');
    // You might want to refresh the user data here
  };

  const handleDocumentUploadSuccess = () => {
    alert(`${documentType === 'id' ? 'ID document' : 'Driving license'} uploaded successfully! It will be reviewed within 24 hours.`);
    // You might want to refresh the user data here
  };

  const handleBackgroundCheckSuccess = () => {
    alert('Background check initiated successfully! You will be notified when it\'s complete.');
    // You might want to refresh the user data here
  };

  const handleEmergencyContactUpdate = async () => {
    try {
      const response = await fetch('/api/auth/update-emergency-contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(emergencyContact)
      });
      
      if (response.ok) {
        alert('Emergency contact updated successfully!');
      } else {
        alert('Failed to update emergency contact. Please try again.');
      }
    } catch (error) {
      console.error('Emergency contact update error:', error);
      alert('An error occurred while updating emergency contact. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Center</h1>
            <p className="text-gray-600">
              Manage your account security, verification status, and safety settings
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="verification" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Verification
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Emergency
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="fraud" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Fraud Detection
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verification" className="space-y-6">
              <SecurityVerification 
                user={{
                  isEmailVerified: user.isEmailVerified || false,
                  isPhoneVerified: user.isPhoneVerified || false,
                  isIdVerified: user.isIdVerified || false,
                  isLicenseVerified: user.isLicenseVerified || false,
                  isBackgroundChecked: user.isBackgroundChecked || false,
                  securityScore: user.securityScore || 0,
                  isBlocked: user.isBlocked || false,
                  blockReason: user.blockReason
                }}
                onVerify={handleVerification}
              />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={user.firstName} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={user.lastName} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="email" 
                          value={user.email} 
                          disabled 
                          className="bg-gray-50"
                        />
                        {user.isEmailVerified ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="phone" 
                          value={user.phone || 'Not provided'} 
                          disabled 
                          className="bg-gray-50"
                        />
                        {user.isPhoneVerified ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Document Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ID Document</span>
                      <div className="flex items-center gap-2">
                        {user.isIdVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                        <Badge variant={user.isIdVerified ? "default" : "secondary"}>
                          {user.isIdVerified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Driving License</span>
                      <div className="flex items-center gap-2">
                        {user.isLicenseVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                        <Badge variant={user.isLicenseVerified ? "default" : "secondary"}>
                          {user.isLicenseVerified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Background Check</span>
                      <div className="flex items-center gap-2">
                        {user.isBackgroundChecked ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                        <Badge variant={user.isBackgroundChecked ? "default" : "secondary"}>
                          {user.isBackgroundChecked ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyName">Contact Name</Label>
                      <Input 
                        id="emergencyName"
                        value={emergencyContact.name}
                        onChange={(e) => setEmergencyContact(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Phone Number</Label>
                      <Input 
                        id="emergencyPhone"
                        value={emergencyContact.phone}
                        onChange={(e) => setEmergencyContact(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+44 20 1234 5678"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="emergencyRelation">Relationship</Label>
                      <Input 
                        id="emergencyRelation"
                        value={emergencyContact.relation}
                        onChange={(e) => setEmergencyContact(prev => ({ ...prev, relation: e.target.value }))}
                        placeholder="e.g., Spouse, Parent, Sibling, Friend"
                      />
                    </div>
                  </div>
                  <Button onClick={handleEmergencyContactUpdate} className="w-full">
                    Update Emergency Contact
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Emergency Procedures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p className="font-medium">In case of emergency:</p>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Contact our 24/7 support: +44 20 1234 5678</li>
                      <li>• Report incidents immediately through the app</li>
                      <li>• Contact local emergency services: 999</li>
                      <li>• Your emergency contact will be notified automatically</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <SecurityReviews 
                reviews={[
                  {
                    id: '1',
                    reviewerName: 'Sarah Johnson',
                    reviewerType: 'renter',
                    rating: 5,
                    securityRating: 5,
                    title: 'Excellent security and service',
                    comment: 'The car was in perfect condition and the security measures were top-notch. Felt completely safe throughout the rental.',
                    date: '2024-01-15',
                    verified: true,
                    helpful: 12,
                    reported: false,
                    carTitle: 'BMW 3 Series',
                    bookingDate: '2024-01-10'
                  },
                  {
                    id: '2',
                    reviewerName: 'Michael Brown',
                    reviewerType: 'owner',
                    rating: 4,
                    securityRating: 4,
                    title: 'Good experience overall',
                    comment: 'Professional renter, returned the car in excellent condition. Security verification process was smooth.',
                    date: '2024-01-12',
                    verified: true,
                    helpful: 8,
                    reported: false,
                    carTitle: 'Ford Focus',
                    bookingDate: '2024-01-08'
                  }
                ]}
                userType={user.userType || 'renter'}
                onAddReview={(review) => console.log('Adding review:', review)}
                onReportReview={(reviewId) => console.log('Reporting review:', reviewId)}
                onHelpfulReview={(reviewId) => console.log('Marking helpful:', reviewId)}
              />
            </TabsContent>

            <TabsContent value="fraud" className="space-y-6">
              <FraudDetection 
                userId={user.id}
                onSecurityAlert={(alert) => console.log('Security alert:', alert)}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          alert('Two-Factor Authentication setup will be available soon! This feature is currently under development.');
                        }}
                      >
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Login Notifications</p>
                        <p className="text-sm text-gray-600">Get notified of new logins</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          alert('Login notification settings will be available soon! You can configure email and SMS alerts for new logins.');
                        }}
                      >
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data Privacy</p>
                        <p className="text-sm text-gray-600">Manage your data and privacy</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          alert('Data privacy settings will be available soon! You can manage your data preferences, download your data, or request account deletion.');
                        }}
                      >
                        View Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Verification Modals */}
      <EmailVerificationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSuccess={handleEmailVerificationSuccess}
        userEmail={user.email}
      />

      <PhoneVerificationModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onSuccess={handlePhoneVerificationSuccess}
        currentPhone={user.phone}
      />

      <DocumentUploadModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        onSuccess={handleDocumentUploadSuccess}
        documentType={documentType}
      />

      <BackgroundCheckModal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
        onSuccess={handleBackgroundCheckSuccess}
      />
    </div>
  );
}
