export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="mt-2 text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="p-6 prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Tomobilti, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily use Tomobilti for personal, non-commercial transitory viewing only.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for commercial purposes or public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Car Rental Terms</h2>
              <p className="text-gray-700 mb-4">
                All car rentals are subject to availability and the following conditions:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Valid driver's license required</li>
                <li>Minimum age requirement of 21 years</li>
                <li>Credit card required for security deposit</li>
                <li>Insurance coverage is mandatory</li>
                <li>Fuel policy: return with same fuel level</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                Payment is due at the time of booking. We accept major credit cards and digital payment methods.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>All prices are in USD unless otherwise stated</li>
                <li>Cancellation fees may apply</li>
                <li>Refunds processed within 5-7 business days</li>
                <li>Late return fees apply after grace period</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                Users are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Providing accurate information</li>
                <li>Maintaining account security</li>
                <li>Reporting damages immediately</li>
                <li>Following traffic laws and regulations</li>
                <li>Returning vehicles in good condition</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Tomobilti shall not be liable for any damages arising from the use of our service, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Modifications</h2>
              <p className="text-gray-700 mb-4">
                Tomobilti may revise these terms at any time without notice. By using this service, you agree to be bound by the current version of these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Email: legal@tomobilti.com</p>
                <p className="text-gray-700">Phone: 1-800-TOMOBIL</p>
                <p className="text-gray-700">Address: 123 Main St, City, State 12345</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}