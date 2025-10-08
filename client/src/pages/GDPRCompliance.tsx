import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Shield, Cookie, Eye, Database, UserCheck, AlertTriangle } from 'lucide-react';

export default function GDPRCompliance() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem('gdpr-consent');
    if (savedConsent) {
      setConsentGiven(true);
      const preferences = JSON.parse(savedConsent);
      setCookiePreferences(preferences);
    }
  }, []);

  const handleConsent = () => {
    localStorage.setItem('gdpr-consent', JSON.stringify(cookiePreferences));
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());
    setConsentGiven(true);
    
    // Track consent in analytics (if analytics cookies are enabled)
    if (cookiePreferences.analytics) {
      // Initialize analytics here
      console.log('Analytics tracking enabled');
    }
  };

  const handleCookieChange = (type, checked) => {
    setCookiePreferences(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  if (consentGiven) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">GDPR Compliance</h1>
            <p className="text-gray-600">Your data protection rights and our compliance measures</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  Your Rights
                </CardTitle>
                <CardDescription>Under GDPR, you have the following rights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Right to Access</h4>
                      <p className="text-sm text-gray-600">Request copies of your personal data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Right to Rectification</h4>
                      <p className="text-sm text-gray-600">Correct inaccurate personal data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Right to Erasure</h4>
                      <p className="text-sm text-gray-600">Request deletion of your data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Right to Portability</h4>
                      <p className="text-sm text-gray-600">Transfer your data to another service</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Right to Object</h4>
                      <p className="text-sm text-gray-600">Object to processing of your data</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  Data We Collect
                </CardTitle>
                <CardDescription>Types of personal data we process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Account Information</h4>
                      <p className="text-sm text-gray-600">Name, email, phone number</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Identity Documents</h4>
                      <p className="text-sm text-gray-600">Driving license, ID verification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Booking Data</h4>
                      <p className="text-sm text-gray-600">Rental history, payment information</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Usage Analytics</h4>
                      <p className="text-sm text-gray-600">Website usage, preferences</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Data Protection
                </CardTitle>
                <CardDescription>How we protect your personal data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Encryption</h4>
                      <p className="text-sm text-gray-600">All data encrypted in transit and at rest</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Access Controls</h4>
                      <p className="text-sm text-gray-600">Strict access controls and authentication</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Regular Audits</h4>
                      <p className="text-sm text-gray-600">Regular security audits and assessments</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Data Minimization</h4>
                      <p className="text-sm text-gray-600">We only collect necessary data</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Contact & Complaints
                </CardTitle>
                <CardDescription>How to exercise your rights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Data Protection Officer</h4>
                    <p className="text-sm text-gray-600">Email: dpo@sharewheelz.uk</p>
                    <p className="text-sm text-gray-600">Phone: +44 20 7946 0958</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium">ICO Complaints</h4>
                    <p className="text-sm text-gray-600">You can complain to the UK's Information Commissioner's Office (ICO)</p>
                    <p className="text-sm text-gray-600">Website: ico.org.uk</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium">Response Time</h4>
                    <p className="text-sm text-gray-600">We respond to all requests within 30 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button 
              onClick={() => setConsentGiven(false)}
              variant="outline"
              className="mr-4"
            >
              Update Cookie Preferences
            </Button>
            <Button onClick={() => window.location.href = '/privacy-policy'}>
              View Full Privacy Policy
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GDPR Cookie Consent</h1>
          <p className="text-gray-600">We respect your privacy and comply with GDPR regulations</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-orange-600" />
              Cookie Preferences
            </CardTitle>
            <CardDescription>
              Choose which cookies you allow us to use. You can change these settings at any time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="necessary" className="font-medium">Necessary Cookies</Label>
                  <p className="text-sm text-gray-600">Required for the website to function properly</p>
                </div>
                <Checkbox
                  id="necessary"
                  checked={cookiePreferences.necessary}
                  disabled
                  className="opacity-50"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="analytics" className="font-medium">Analytics Cookies</Label>
                  <p className="text-sm text-gray-600">Help us understand how you use our website</p>
                </div>
                <Checkbox
                  id="analytics"
                  checked={cookiePreferences.analytics}
                  onCheckedChange={(checked) => handleCookieChange('analytics', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="marketing" className="font-medium">Marketing Cookies</Label>
                  <p className="text-sm text-gray-600">Used to show you relevant advertisements</p>
                </div>
                <Checkbox
                  id="marketing"
                  checked={cookiePreferences.marketing}
                  onCheckedChange={(checked) => handleCookieChange('marketing', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="preferences" className="font-medium">Preference Cookies</Label>
                  <p className="text-sm text-gray-600">Remember your settings and preferences</p>
                </div>
                <Checkbox
                  id="preferences"
                  checked={cookiePreferences.preferences}
                  onCheckedChange={(checked) => handleCookieChange('preferences', checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Button 
                onClick={() => setShowDetails(!showDetails)}
                variant="outline"
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showDetails ? 'Hide' : 'Show'} Detailed Information
              </Button>

              {showDetails && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <h4 className="font-medium">Legal Basis for Processing</h4>
                    <p className="text-sm text-gray-600">
                      We process your personal data based on consent (Article 6(1)(a) GDPR) 
                      and legitimate interests (Article 6(1)(f) GDPR).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Data Retention</h4>
                    <p className="text-sm text-gray-600">
                      We retain your data only as long as necessary for the purposes 
                      for which it was collected, typically 7 years for financial records.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Third-Party Sharing</h4>
                    <p className="text-sm text-gray-600">
                      We may share data with payment processors, insurance providers, 
                      and legal authorities when required by law.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleConsent}
                className="flex-1"
              >
                Accept Selected Cookies
              </Button>
              <Button 
                onClick={() => {
                  setCookiePreferences({
                    necessary: true,
                    analytics: false,
                    marketing: false,
                    preferences: false
                  });
                  handleConsent();
                }}
                variant="outline"
                className="flex-1"
              >
                Accept Only Necessary
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By clicking "Accept", you consent to our use of cookies in accordance with our 
              <a href="/privacy-policy" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
