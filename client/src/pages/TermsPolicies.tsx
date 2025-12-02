import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Shield, 
  FileText, 
  CreditCard, 
  Car, 
  Users, 
  Lock, 
  Phone, 
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';

export default function TermsPolicies() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Policies</h1>
          <p className="text-xl text-gray-600 mb-6">
            Complete terms of service and policies for ShareWheelz platform
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Last updated: December 2024
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Version 2.1
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Table of Contents */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center text-white">
                <FileText className="h-6 w-6 mr-2" />
                Table of Contents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <a href="#general-terms" className="block text-blue-600 hover:text-blue-800 font-medium">1. General Terms of Use</a>
                  <a href="#rental-conditions" className="block text-blue-600 hover:text-blue-800 font-medium">2. Rental Conditions</a>
                  <a href="#booking-policy" className="block text-blue-600 hover:text-blue-800 font-medium">3. Booking & Payment Policy</a>
                  <a href="#insurance-policy" className="block text-blue-600 hover:text-blue-800 font-medium">4. Insurance Policy</a>
                  <a href="#cancellation-policy" className="block text-blue-600 hover:text-blue-800 font-medium">5. Cancellations & Extraordinary Circumstances</a>
                </div>
                <div className="space-y-2">
                  <a href="#responsibilities" className="block text-blue-600 hover:text-blue-800 font-medium">6. User Responsibilities</a>
                  <a href="#privacy-policy" className="block text-blue-600 hover:text-blue-800 font-medium">7. Privacy Policy</a>
                  <a href="#dispute-resolution" className="block text-blue-600 hover:text-blue-800 font-medium">8. Dispute Resolution</a>
                  <a href="#legal-compliance" className="block text-blue-600 hover:text-blue-800 font-medium">9. Legal Compliance</a>
                  <a href="#contact-information" className="block text-blue-600 hover:text-blue-800 font-medium">10. Contact Information</a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 1. General Terms of Use */}
          <Card id="general-terms" className="shadow-lg border-0">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center text-gray-900">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                1. General Terms of Use
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1.1 Eligibility Requirements</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Minimum age of 21 years for renters</li>
                  <li>Valid UK driving licence required</li>
                  <li>Clean driving record (no major violations in the last 3 years)</li>
                  <li>Valid government-issued photo ID</li>
                  <li>Registered UK bank account or valid credit card</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1.2 Account Registration</h3>
                <p className="text-gray-700 mb-2">By creating an account on ShareWheelz, you agree to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1.3 Platform Usage</h3>
                <p className="text-gray-700">
                  ShareWheelz provides a peer-to-peer car rental platform connecting vehicle owners with renters. 
                  We facilitate bookings but are not a party to the rental agreement between users.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Rental Conditions */}
          <Card id="rental-conditions" className="shadow-lg border-0">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center text-gray-900">
                <Car className="h-6 w-6 mr-2 text-green-600" />
                2. Rental Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.1 Vehicle Inspection</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Mandatory pre-rental inspection with photographic evidence</li>
                  <li>Report any existing damage before taking possession</li>
                  <li>Post-rental inspection within 2 hours of return</li>
                  <li>Renter responsible for any new damage not reported</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.2 Vehicle Usage Restrictions</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>No smoking in vehicles (£200 penalty)</li>
                  <li>No pets unless explicitly permitted by owner</li>
                  <li>Maximum mileage as specified in booking</li>
                  <li>UK driving only (no international travel)</li>
                  <li>No commercial use or ride-sharing services</li>
                  <li>No racing, off-road driving, or towing</li>
                </ul>
                <p className="text-sm text-gray-600 mt-3">
                  * Cleaning and restoration fees depending on the damages
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.3 Fuel Policy</h3>
                <p className="text-gray-700">
                  Return the vehicle with the same fuel level as collected. 
                  Failure to do so will result in refueling charges at £2.50 per litre plus a £25 service fee.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Booking & Payment Policy */}
          <Card id="booking-policy" className="shadow-lg border-0">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center text-gray-900">
                <CreditCard className="h-6 w-6 mr-2 text-purple-600" />
                3. Booking & Payment Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1 Booking Process</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Instant booking available for verified vehicles</li>
                  <li>Request booking requires owner approval within 24 hours</li>
                  <li>Full payment required at time of booking</li>
                  <li>Security deposit held separately (released after rental)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3.2 Pricing Structure</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Daily Rate:</strong> Set by vehicle owner</li>
                    <li><strong>Service Fee:</strong> 10% of booking value</li>
                    <li><strong>Insurance:</strong> 5% of booking value (included)</li>
                    <li><strong>VAT:</strong> 20% on service fee</li>
                    <li><strong>Security Deposit:</strong> £500-£2000 (varies by vehicle)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3.3 Payment Methods</h3>
                <p className="text-gray-700 mb-2">We accept the following payment methods:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Major credit cards (Visa, Mastercard, American Express)</li>
                  <li>Debit cards with sufficient funds</li>
                  <li>PayPal (verified accounts only)</li>
                  <li>Bank transfers for corporate bookings</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 4. Insurance Policy */}
          <Card id="insurance-policy" className="shadow-lg border-0">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center text-gray-900">
                <Shield className="h-6 w-6 mr-2 text-orange-600" />
                4. Insurance Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 Coverage Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-gray-700">Third-party liability (unlimited)</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-gray-700">Collision damage (£500 excess)</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-gray-700">Theft protection (£500 excess)</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-gray-700">Fire damage coverage</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-gray-700">Windscreen damage (£75 excess)</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-gray-700">24/7 roadside assistance</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-gray-700">European travel (additional fee)</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-gray-700">Key replacement coverage</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2 Exclusions</h3>
                <div className="bg-red-50 p-4 rounded-lg">
                  <ul className="list-disc pl-6 text-red-800 space-y-2">
                    <li>Damage caused by driving under the influence</li>
                    <li>Off-road or racing activities</li>
                    <li>Driving without valid licence</li>
                    <li>Deliberate damage or misuse</li>
                    <li>Personal belongings left in vehicle</li>
                    <li>Mechanical breakdown (owner's responsibility)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">4.3 Claims Process</h3>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                  <li>Report incidents immediately via app or phone</li>
                  <li>Provide police report for accidents</li>
                  <li>Submit photographic evidence</li>
                  <li>Cooperate fully with insurance investigation</li>
                  <li>Claims processed within 10 business days</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* 5. Cancellations & Extraordinary Circumstances */}
          <Card id="cancellation-policy" className="shadow-lg border-0">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center text-gray-900">
                <Clock className="h-6 w-6 mr-2 text-red-600" />
                5. Cancellations & Extraordinary Circumstances
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">5.1 General Principle</h3>
                <p className="text-gray-700">
                  All bookings made through the ShareWheels platform are binding commitments between the renter and the owner. ShareWheels acts solely as an intermediary and shall bear no liability for cancellations, delays, losses, or disputes arising between parties.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">5.2 Owner Cancellation</h3>
                <p className="text-gray-700 mb-3">
                  In the event an owner cancels a confirmed booking, the renter may be entitled to a refund and, where applicable, compensation, the amount and form of which shall be determined solely at the discretion of ShareWheels. ShareWheels shall not be liable for any inconvenience, loss, or additional costs incurred by the renter as a result of such cancellations.
                </p>
                <p className="text-gray-700">
                  Owners who repeatedly cancel reservations may be subject to account suspension or other corrective measures at the sole discretion of ShareWheels.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">5.3 Extraordinary Circumstances</h3>
                <p className="text-gray-700">
                  In cases where a booking cannot proceed due to extraordinary circumstances (including but not limited to extreme weather, natural disasters, government restrictions, public emergencies, or other events beyond reasonable control), ShareWheels shall have no responsibility or liability for any resulting losses, damages, costs, or inconvenience. Any refunds, credits, or alternative arrangements in such cases shall be granted only at the sole discretion of ShareWheels, without creating any ongoing obligation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 6. User Responsibilities */}
          <Card id="responsibilities" className="shadow-lg border-0">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="flex items-center text-gray-900">
                <AlertTriangle className="h-6 w-6 mr-2 text-indigo-600" />
                6. User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">6.1 Renter Responsibilities</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Drive safely and obey all traffic laws</li>
                  <li>Return vehicle clean and in same condition</li>
                  <li>Report accidents or damage immediately</li>
                  <li>Pay all fines, tolls, and parking charges</li>
                  <li>Secure the vehicle when not in use</li>
                  <li>Return keys and accessories as provided</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">6.2 Owner Responsibilities</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Maintain vehicle in safe, roadworthy condition</li>
                  <li>Provide accurate vehicle information and photos</li>
                  <li>Ensure valid MOT, road tax, and insurance</li>
                  <li>Be available for key handover at agreed times</li>
                  <li>Report any mechanical issues immediately</li>
                  <li>Respect renter's privacy during rental period</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">6.3 Platform Responsibilities</h3>
                <p className="text-gray-700">
                  ShareWheelz provides the platform, payment processing, insurance coordination, 
                  and customer support. We are not responsible for the condition or performance 
                  of individual vehicles.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 7. Privacy Policy */}
          <Card id="privacy-policy" className="shadow-lg border-0">
            <CardHeader className="bg-pink-50">
              <CardTitle className="flex items-center text-gray-900">
                <Lock className="h-6 w-6 mr-2 text-pink-600" />
                7. Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">7.1 Data Collection</h3>
                <p className="text-gray-700 mb-2">We collect the following information:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Personal identification information</li>
                  <li>Driving licence and vehicle registration details</li>
                  <li>Payment and billing information</li>
                  <li>Location data during rental periods</li>
                  <li>Communication records and customer support interactions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">7.2 Data Usage</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Processing bookings and payments</li>
                  <li>Providing customer support</li>
                  <li>Ensuring platform safety and security</li>
                  <li>Improving our services</li>
                  <li>Complying with legal requirements</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">7.3 Data Protection</h3>
                <p className="text-gray-700">
                  We comply with UK GDPR and employ industry-standard security measures 
                  to protect your personal information. Data is stored securely and 
                  shared only with necessary third parties.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 8. Dispute Resolution */}
          <Card id="dispute-resolution" className="shadow-lg border-0">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center text-gray-900">
                <Users className="h-6 w-6 mr-2 text-gray-600" />
                8. Dispute Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">8.1 Resolution Process</h3>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                  <li><strong>Direct Communication:</strong> Users attempt to resolve disputes directly</li>
                  <li><strong>Platform Mediation:</strong> ShareWheelz mediates if direct resolution fails</li>
                  <li><strong>Arbitration:</strong> Binding arbitration for unresolved disputes</li>
                  <li><strong>Legal Action:</strong> Court proceedings as last resort</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">8.2 Common Disputes</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Vehicle condition disagreements</li>
                  <li>Damage claims and responsibility</li>
                  <li>Late returns and additional charges</li>
                  <li>Cancellation and refund disputes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">8.3 Limitation of Liability</h3>
                <p className="text-gray-700">
                  ShareWheelz's liability is limited to the value of the booking. 
                  We are not liable for consequential damages, lost profits, or 
                  indirect losses arising from use of our platform.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 9. Legal Compliance */}
          <Card id="legal-compliance" className="shadow-lg border-0">
            <CardHeader className="bg-yellow-50">
              <CardTitle className="flex items-center text-gray-900">
                <FileText className="h-6 w-6 mr-2 text-yellow-600" />
                9. Legal Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">9.1 Governing Law</h3>
                <p className="text-gray-700">
                  These terms are governed by the laws of England and Wales. 
                  Any disputes will be subject to the exclusive jurisdiction of 
                  English courts.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">9.2 Regulatory Compliance</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Financial Conduct Authority (FCA) regulations</li>
                  <li>Data Protection Act 2018</li>
                  <li>Consumer Rights Act 2015</li>
                  <li>Road Traffic Act 1988</li>
                  <li>EU Motor Insurance Directive</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">9.3 Terms Updates</h3>
                <p className="text-gray-700">
                  We may update these terms periodically. Users will be notified 
                  of significant changes via email and app notifications. 
                  Continued use constitutes acceptance of updated terms.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 10. Contact Information */}
          <Card id="contact-information" className="shadow-lg border-0">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center text-gray-900">
                <Phone className="h-6 w-6 mr-2 text-blue-600" />
                10. Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Email Support</div>
                        <div className="text-gray-600">support@sharewheelz.uk</div>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-green-50 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Phone Support</div>
                        <div className="text-gray-600">+44 20 7946 0958</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Support Hours</div>
                        <div className="text-gray-600">24/7 Emergency Support</div>
                        <div className="text-gray-600">Mon-Fri 8AM-8PM General</div>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-orange-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Legal Address</div>
                        <div className="text-gray-600">ShareWheelz Ltd</div>
                        <div className="text-gray-600">123 Innovation Drive</div>
                        <div className="text-gray-600">London, UK SW1A 1AA</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="font-medium text-gray-900">Legal Inquiries</div>
                    <div className="text-gray-600">legal@sharewheelz.uk</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="font-medium text-gray-900">Privacy Concerns</div>
                    <div className="text-gray-600">privacy@sharewheelz.uk</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="font-medium text-gray-900">Insurance Claims</div>
                    <div className="text-gray-600">claims@sharewheelz.uk</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Emergency Roadside Assistance</h4>
                <p className="text-gray-700 mb-2">Available 24/7 for all active rentals</p>
                <div className="text-2xl font-bold text-blue-600">0800 HELP NOW</div>
                <div className="text-blue-600">(0800 435 7669)</div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm py-8">
            <p>&copy; 2024 ShareWheelz Ltd. All rights reserved.</p>
            <p className="mt-2">
              ShareWheelz is a registered trademark. Company Registration: 12345678 (England & Wales)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
