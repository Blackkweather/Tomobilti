export default function Legal() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Legal Information</h1>
            <p className="mt-2 text-sm text-gray-600">Important legal documents and information</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">📋 Terms of Service</h2>
                <p className="text-blue-700 mb-4">
                  Our complete terms and conditions for using ShareWheelz services.
                </p>
                <a href="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
                  Read Terms of Service →
                </a>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-900 mb-4">🔒 Privacy Policy</h2>
                <p className="text-green-700 mb-4">
                  How we collect, use, and protect your personal information.
                </p>
                <a href="/privacy" className="text-green-600 hover:text-green-500 font-medium">
                  Read Privacy Policy →
                </a>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-yellow-900 mb-4">💰 Refund Policy</h2>
                <p className="text-yellow-700 mb-4">
                  Cancellation terms and refund procedures for bookings.
                </p>
                <a href="/refund" className="text-yellow-600 hover:text-yellow-500 font-medium">
                  Read Refund Policy →
                </a>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-purple-900 mb-4">🛡️ Insurance Terms</h2>
                <p className="text-purple-700 mb-4">
                  Coverage details and insurance requirements for rentals.
                </p>
                <a href="/insurance" className="text-purple-600 hover:text-purple-500 font-medium">
                  View Insurance Info →
                </a>
              </div>
            </div>

            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Legal Entity</h3>
                      <p className="text-gray-700">ShareWheelz Inc.</p>
                      
                      <h3 className="font-medium text-gray-900 mb-2 mt-4">Registration</h3>
                      <p className="text-gray-700">Delaware Corporation</p>
                      <p className="text-gray-700">EIN: 12-3456789</p>
                      
                      <h3 className="font-medium text-gray-900 mb-2 mt-4">Business License</h3>
                      <p className="text-gray-700">License #: BL-2024-001</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Headquarters</h3>
                      <p className="text-gray-700">
                        123 Main Street<br/>
                        Suite 100<br/>
                        San Francisco, CA 94105<br/>
                        United States
                      </p>
                      
                      <h3 className="font-medium text-gray-900 mb-2 mt-4">Contact</h3>
                      <p className="text-gray-700">legal@sharewheelz.uk</p>
                      <p className="text-gray-700">+1 (800) TOMOBIL</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Compliance & Certifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">🔐</div>
                    <h3 className="font-medium text-gray-900">SOC 2 Compliant</h3>
                    <p className="text-sm text-gray-600">Security & Privacy</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">🛡️</div>
                    <h3 className="font-medium text-gray-900">PCI DSS</h3>
                    <p className="text-sm text-gray-600">Payment Security</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">🌍</div>
                    <h3 className="font-medium text-gray-900">GDPR Ready</h3>
                    <p className="text-sm text-gray-600">Data Protection</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  All content, trademarks, and intellectual property on this platform are owned by ShareWheelz Inc. or our licensors.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>ShareWheelz® is a registered trademark</li>
                  <li>All brand elements are protected</li>
                  <li>User-generated content is subject to our terms</li>
                  <li>API and software are proprietary</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Dispute Resolution</h2>
                <p className="text-gray-700 mb-4">
                  We are committed to resolving disputes fairly and efficiently:
                </p>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                  <li><strong>Direct Resolution:</strong> Contact our support team first</li>
                  <li><strong>Mediation:</strong> Third-party mediation if needed</li>
                  <li><strong>Arbitration:</strong> Binding arbitration as final resort</li>
                  <li><strong>Jurisdiction:</strong> Delaware state courts for legal matters</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Regulatory Compliance</h2>
                <p className="text-gray-700 mb-4">
                  ShareWheelz operates in compliance with applicable laws and regulations:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Department of Transportation regulations</li>
                  <li>State and local business licensing</li>
                  <li>Consumer protection laws</li>
                  <li>Anti-money laundering (AML) requirements</li>
                  <li>Know Your Customer (KYC) procedures</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Legal Notices</h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800 mb-2">Disclaimer</h3>
                    <p className="text-yellow-700 text-sm">
                      Information provided is for general purposes only and does not constitute legal advice. 
                      Consult with qualified professionals for specific legal matters.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 mb-2">Updates</h3>
                    <p className="text-blue-700 text-sm">
                      Legal documents may be updated periodically. Users will be notified of material changes 
                      via email and platform notifications.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Legal Team</h2>
                <p className="text-gray-700 mb-4">
                  For legal inquiries, compliance questions, or document requests:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Email:</strong> legal@sharewheelz.uk</p>
                  <p className="text-gray-700"><strong>Phone:</strong> +44 20 7946 0958</p>
                  <p className="text-gray-700"><strong>Mail:</strong> Legal Department, ShareWheelz Inc., 123 Main St, Suite 100, London, UK SW1A 1AA</p>
                  <p className="text-gray-700"><strong>Response Time:</strong> 3-5 business days</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}