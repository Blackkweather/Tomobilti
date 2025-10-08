import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { FileText, Shield, AlertTriangle, Car, CreditCard, User } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                1. Acceptance of Terms
              </CardTitle>
              <CardDescription>By using ShareWheelz, you agree to these terms</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Welcome to ShareWheelz, the UK's premier peer-to-peer car rental platform. 
                These Terms of Service ("Terms") govern your use of our website, mobile application, 
                and services (collectively, the "Service") operated by ShareWheelz Ltd ("we", "us", or "our").
              </p>
              <p className="text-sm text-gray-600">
                By accessing or using our Service, you agree to be bound by these Terms. 
                If you disagree with any part of these terms, you may not access the Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-green-600" />
                2. Service Description
              </CardTitle>
              <CardDescription>What ShareWheelz provides</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Platform Services</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Connect car owners with renters across the UK</li>
                  <li>Facilitate secure bookings and payments</li>
                  <li>Provide insurance coverage for rentals</li>
                  <li>Offer customer support and dispute resolution</li>
                  <li>Enable user verification and safety checks</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">User Types</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li><strong>Renters:</strong> Individuals seeking to rent vehicles</li>
                  <li><strong>Owners:</strong> Individuals offering their vehicles for rent</li>
                  <li><strong>Both:</strong> Users who both rent and offer vehicles</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                3. User Responsibilities
              </CardTitle>
              <CardDescription>Your obligations when using our service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Account Requirements</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain up-to-date contact details</li>
                    <li>Keep login credentials secure</li>
                    <li>Verify identity and driving credentials</li>
                    <li>Be at least 18 years old</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Conduct Requirements</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Use vehicles responsibly and legally</li>
                    <li>Return vehicles in the same condition</li>
                    <li>Report any accidents or damage immediately</li>
                    <li>Comply with UK driving laws</li>
                    <li>Respect other users and their property</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
                4. Payments and Fees
              </CardTitle>
              <CardDescription>How payments work on our platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Payment Structure</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li><strong>Rental Fee:</strong> Paid to the vehicle owner</li>
                  <li><strong>Service Fee:</strong> 5-10% of rental fee (paid to ShareWheelz)</li>
                  <li><strong>Insurance Fee:</strong> 3-5% of rental fee (for coverage)</li>
                  <li><strong>Processing Fee:</strong> Small fee for payment processing</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Payment Terms</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Payments are processed securely via Stripe</li>
                  <li>Rental fees are held until completion</li>
                  <li>Refunds processed within 5-10 business days</li>
                  <li>All prices are in British Pounds (GBP)</li>
                  <li>VAT is included in all displayed prices</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                5. Insurance and Liability
              </CardTitle>
              <CardDescription>Coverage and responsibility for damages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Insurance Coverage</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Comprehensive insurance included in rental fee</li>
                  <li>Coverage up to £1,000,000 for third-party claims</li>
                  <li>Excess of £500 for damage claims</li>
                  <li>Coverage valid throughout the UK</li>
                  <li>24/7 roadside assistance included</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">User Responsibilities</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Report accidents immediately to us and police</li>
                  <li>Do not drive under the influence of alcohol/drugs</li>
                  <li>Ensure all passengers wear seatbelts</li>
                  <li>Do not use vehicles for commercial purposes</li>
                  <li>Follow all UK traffic laws and regulations</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Limitation of Liability</h4>
                <p className="text-sm text-gray-600">
                  ShareWheelz's liability is limited to the insurance coverage provided. 
                  Users are responsible for any damages exceeding the insurance limits 
                  and for violations of these terms.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Prohibited Activities</CardTitle>
              <CardDescription>Activities not allowed on our platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">General Prohibitions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Fraudulent or misleading information</li>
                    <li>Harassment or abuse of other users</li>
                    <li>Violation of UK laws or regulations</li>
                    <li>Commercial use without permission</li>
                    <li>Attempting to circumvent our systems</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Vehicle-Specific Prohibitions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Smoking in vehicles</li>
                    <li>Transporting pets without permission</li>
                    <li>Off-road driving</li>
                    <li>Racing or reckless driving</li>
                    <li>Transporting illegal substances</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Account Suspension and Termination</CardTitle>
              <CardDescription>When and how accounts may be suspended</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Grounds for Suspension</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Violation of these Terms of Service</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Non-payment of fees or damages</li>
                  <li>Repeated complaints from other users</li>
                  <li>Providing false information</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Suspension Process</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Written notice of violation</li>
                  <li>Opportunity to respond and appeal</li>
                  <li>Temporary suspension pending investigation</li>
                  <li>Permanent termination for serious violations</li>
                  <li>Right to data portability upon termination</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Dispute Resolution</CardTitle>
              <CardDescription>How we handle disputes between users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Resolution Process</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Direct communication between users encouraged</li>
                  <li>ShareWheelz mediation available</li>
                  <li>Evidence collection and review</li>
                  <li>Fair resolution based on platform policies</li>
                  <li>Appeal process for disputed decisions</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Legal Jurisdiction</h4>
                <p className="text-sm text-gray-600">
                  These Terms are governed by English law. Any disputes will be subject to 
                  the exclusive jurisdiction of the English courts. For EU residents, 
                  you may also have the right to use the European Commission's Online 
                  Dispute Resolution platform.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to Terms</CardTitle>
              <CardDescription>How we notify you of updates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                We reserve the right to modify these Terms at any time. We will notify users 
                of significant changes via email and by posting the updated Terms on our website. 
                Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Information</CardTitle>
              <CardDescription>How to reach us with questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">General Inquiries</h4>
                  <p className="text-sm text-gray-600">Email: support@sharewheelz.uk</p>
                  <p className="text-sm text-gray-600">Phone: +44 20 7946 0958</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Legal Matters</h4>
                  <p className="text-sm text-gray-600">Email: legal@sharewheelz.uk</p>
                  <p className="text-sm text-gray-600">Address: London, United Kingdom</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            These Terms of Service are effective as of {new Date().toLocaleDateString('en-GB')} 
            and comply with UK consumer protection laws.
          </p>
        </div>
      </div>
    </div>
  );
}
