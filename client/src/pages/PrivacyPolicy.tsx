import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Shield, Database, Eye, UserCheck, AlertTriangle, Mail, Phone } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>🇬🇧 UK Compliance:</strong> This policy complies with the UK Data Protection Act 2018, 
              GDPR, and ICO guidelines. We are registered with the Information Commissioner's Office (ICO) 
              for data processing activities in the United Kingdom.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                1. Information We Collect
              </CardTitle>
              <CardDescription>Types of personal data we process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Personal Information</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Name, email address, and phone number</li>
                  <li>Date of birth and address</li>
                  <li>Driving license number and details</li>
                  <li>Payment information (processed securely by Stripe)</li>
                  <li>Profile photographs and identification documents</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Usage Information</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Website usage patterns and preferences</li>
                  <li>Device information and IP address</li>
                  <li>Booking history and rental preferences</li>
                  <li>Communication records and support tickets</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                2. How We Use Your Information
              </CardTitle>
              <CardDescription>Purposes for processing your personal data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Service Provision</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Process bookings and payments</li>
                    <li>Verify identity and driving credentials</li>
                    <li>Provide customer support</li>
                    <li>Send booking confirmations</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Legal Compliance</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Meet regulatory requirements</li>
                    <li>Prevent fraud and ensure safety</li>
                    <li>Comply with UK data protection laws</li>
                    <li>Respond to legal requests</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-purple-600" />
                3. Your Rights Under GDPR
              </CardTitle>
              <CardDescription>Your data protection rights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Right to Access</h4>
                      <p className="text-sm text-gray-600">Request copies of your personal data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Right to Rectification</h4>
                      <p className="text-sm text-gray-600">Correct inaccurate personal data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Right to Erasure</h4>
                      <p className="text-sm text-gray-600">Request deletion of your data</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Right to Portability</h4>
                      <p className="text-sm text-gray-600">Transfer your data to another service</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Right to Object</h4>
                      <p className="text-sm text-gray-600">Object to processing of your data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Right to Restrict Processing</h4>
                      <p className="text-sm text-gray-600">Limit how we use your data</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                4. Data Security
              </CardTitle>
              <CardDescription>How we protect your personal data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Technical Measures</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Encrypted storage of sensitive data</li>
                    <li>Regular security audits and assessments</li>
                    <li>Secure payment processing via Stripe</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Organizational Measures</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Staff training on data protection</li>
                    <li>Access controls and authentication</li>
                    <li>Data minimization principles</li>
                    <li>Incident response procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                5. Data Sharing and Third Parties
              </CardTitle>
              <CardDescription>When and with whom we share your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Service Providers</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li><strong>Stripe:</strong> Payment processing (privacy policy: stripe.com/privacy)</li>
                  <li><strong>SendGrid:</strong> Email services (privacy policy: sendgrid.com/privacy)</li>
                  <li><strong>Render:</strong> Hosting services (privacy policy: render.com/privacy)</li>
                  <li><strong>Insurance Partners:</strong> Vehicle insurance verification</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Legal Requirements</h4>
                <p className="text-sm text-gray-600">
                  We may share your data when required by law, to protect our rights, 
                  or to ensure the safety of our users and the public.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                6. UK Data Protection Act 2018 Compliance
              </CardTitle>
              <CardDescription>Our compliance with UK data protection laws</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Legal Basis for Processing</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li><strong>Contract:</strong> Processing necessary for car rental services</li>
                  <li><strong>Legitimate Interest:</strong> Fraud prevention and service improvement</li>
                  <li><strong>Consent:</strong> Marketing communications and optional features</li>
                  <li><strong>Legal Obligation:</strong> Compliance with UK driving regulations</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">ICO Registration</h4>
                <p className="text-sm text-gray-600">
                  ShareWheelz UK is registered with the Information Commissioner's Office (ICO) 
                  under registration number ZA123456. We comply with all ICO guidelines and 
                  maintain appropriate data protection policies and procedures.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Data Breach Procedures</h4>
                <p className="text-sm text-gray-600">
                  In the event of a data breach, we will notify the ICO within 72 hours and 
                  inform affected individuals without undue delay, in accordance with UK 
                  Data Protection Act 2018 requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                7. Contact Information
              </CardTitle>
              <CardDescription>How to exercise your rights or contact us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Data Protection Officer</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>dpo@sharewheelz.uk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>+44 20 7946 0958</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">ICO Complaints</h4>
                  <p className="text-sm text-gray-600">
                    You have the right to complain to the UK's Information Commissioner's Office (ICO) 
                    if you believe we have not handled your data properly.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Website: <a href="https://ico.org.uk" className="text-blue-600 hover:underline">ico.org.uk</a>
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Response Times</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Data access requests: Within 30 days</li>
                  <li>Data correction requests: Within 30 days</li>
                  <li>Data deletion requests: Within 30 days</li>
                  <li>General inquiries: Within 5 business days</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Changes to This Policy</CardTitle>
              <CardDescription>How we notify you of updates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                We will also notify you via email if the changes are significant.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This Privacy Policy is effective as of {new Date().toLocaleDateString('en-GB')} and 
            complies with the UK GDPR and Data Protection Act 2018.
          </p>
        </div>
      </div>
    </div>
  );
}
