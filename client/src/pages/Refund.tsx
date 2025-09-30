export default function Refund() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Refund Policy</h1>
            <p className="mt-2 text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="p-6 prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Cancellation Policy</h2>
              <p className="text-gray-700 mb-4">
                Our cancellation policy varies based on when you cancel your reservation:
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium text-green-800 mb-2">Free Cancellation</h3>
                <p className="text-green-700">Cancel up to 24 hours before your trip starts for a full refund.</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Partial Refund</h3>
                <p className="text-yellow-700">Cancel 2-24 hours before: 50% refund of the total booking cost.</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-800 mb-2">No Refund</h3>
                <p className="text-red-700">Cancel less than 2 hours before or no-show: No refund available.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Refund Processing</h2>
              <p className="text-gray-700 mb-4">
                Refunds are processed according to the following timeline:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Credit Cards:</strong> 5-7 business days</li>
                <li><strong>Debit Cards:</strong> 7-10 business days</li>
                <li><strong>Digital Wallets:</strong> 1-3 business days</li>
                <li><strong>Bank Transfers:</strong> 3-5 business days</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Processing times may vary depending on your financial institution.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Host Cancellations</h2>
              <p className="text-gray-700 mb-4">
                If a car owner cancels your confirmed booking:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Full refund regardless of timing</li>
                <li>£50 credit for future bookings</li>
                <li>Assistance finding alternative vehicles</li>
                <li>Reimbursement for reasonable expenses incurred</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Trip Modifications</h2>
              <p className="text-gray-700 mb-4">
                Changes to your booking may affect refund eligibility:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Shortening trip:</strong> Refund for unused days (minus fees)</li>
                <li><strong>Extending trip:</strong> Pay additional amount at current rates</li>
                <li><strong>Date changes:</strong> Subject to availability and price differences</li>
                <li><strong>Vehicle changes:</strong> Price difference applies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Damage and Incidents</h2>
              <p className="text-gray-700 mb-4">
                Refunds may be affected by damage or incidents:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Security deposit may be used for damages</li>
                <li>Additional charges for excessive cleaning</li>
                <li>Traffic violations are renter's responsibility</li>
                <li>Insurance claims may affect refund processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Special Circumstances</h2>
              <p className="text-gray-700 mb-4">
                We may provide full refunds in exceptional cases:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Natural disasters or extreme weather</li>
                <li>Government travel restrictions</li>
                <li>Medical emergencies (with documentation)</li>
                <li>Vehicle safety issues discovered before trip</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Each case is reviewed individually and may require supporting documentation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Fees and Charges</h2>
              <p className="text-gray-700 mb-4">
                The following fees are non-refundable:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Service fees (unless host cancels)</li>
                <li>Processing fees for payment methods</li>
                <li>Optional add-ons (GPS, car seats, etc.)</li>
                <li>Delivery and pickup fees</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                If you disagree with a refund decision:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Contact our support team within 24 hours</li>
                <li>Provide all relevant documentation</li>
                <li>Allow 3-5 business days for review</li>
                <li>Escalate to management if needed</li>
                <li>Final decisions are binding</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Refund Request Process</h2>
              <p className="text-gray-700 mb-4">
                To request a refund:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Log into your ShareWheelz account</li>
                <li>Go to "My Bookings" and select the trip</li>
                <li>Click "Cancel Booking" or "Request Refund"</li>
                <li>Follow the prompts and provide reason</li>
                <li>Submit any required documentation</li>
                <li>Receive confirmation email with timeline</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For refund-related questions or assistance:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Email: refunds@sharewheelz.uk</p>
                <p className="text-gray-700">Phone: 1-800-TOMOBIL</p>
                <p className="text-gray-700">Live Chat: Available 24/7 in your account</p>
                <p className="text-gray-700">Response Time: Within 24 hours</p>
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Important Note</h3>
              <p className="text-blue-700">
                This refund policy is subject to change. Any changes will be communicated via email and posted on our website. 
                The policy in effect at the time of booking applies to your reservation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
