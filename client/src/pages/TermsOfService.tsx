import { useEffect } from "react";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm">ShareWheelz Ltd — Peer-to-Peer Car-Sharing Platform | Registered in England &amp; Wales</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">SHAREWHEELZ LTD — TERMS OF SERVICE</h1>
        <p className="text-lg text-gray-600 mb-4">(Legal-Protection Edition – 20 October 2025)</p>
        <p className="text-sm text-gray-500 mb-12">Effective Date: 20 October 2025</p>

        <section className="mb-12 p-6 bg-blue-50 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">GOVERNING FRAMEWORK NOTICE</h2>
          <p className="mb-4">ShareWheelz Ltd ("ShareWheelz") is a United Kingdom company incorporated under the Companies Act 2006. These Terms of Service ("Terms") are governed by the laws of England and Wales, including applicable consumer-protection and data-protection legislation.</p>
          <p className="mb-4">ShareWheelz is a technology platform enabling peer-to-peer vehicle sharing within the UK. It is not itself an insurer, broker, or financial institution. Any regulated insurance activity is carried out exclusively by an FCA-authorised third-party partner, whose details are provided in each rental transaction.</p>
          <p className="font-semibold">By accessing or using the ShareWheelz website, mobile application, or related digital services (collectively the "Service"), you agree to these Terms.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. INTRODUCTION AND ACCEPTANCE</h2>
          <p className="mb-3"><strong>1.1 Purpose.</strong> ShareWheelz provides a secure online platform through which verified vehicle owners ("Owners") and qualified renters ("Renters") may connect and conclude private rental agreements.</p>
          <p className="mb-3"><strong>1.2 Binding Agreement.</strong> Use of the Service constitutes acceptance of these Terms and all published policies referenced herein.</p>
          <p><strong>1.3 Independence.</strong> ShareWheelz operates as an independent intermediary. Nothing in these Terms creates an employment, agency, partnership, or fiduciary relationship between ShareWheelz and any user.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. DEFINITIONS</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Owner</strong> – a user who lists a vehicle for private hire on the platform.</li>
            <li><strong>Renter</strong> – a user who hires a listed vehicle.</li>
            <li><strong>Rental Period</strong> – the time from vehicle hand-over to return.</li>
            <li><strong>Platform Insurance</strong> – the commercial motor policy arranged and underwritten by an authorised third-party insurer.</li>
            <li><strong>Service Fee</strong> – the percentage retained by ShareWheelz for platform access and support.</li>
            <li><strong>Damage or Loss</strong> – any physical or financial harm occurring during a rental.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. USER ELIGIBILITY AND VERIFICATION</h2>
          <p className="mb-3"><strong>3.1</strong> Users must:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>be 21 years or older;</li>
            <li>hold a valid UK or approved international driving licence;</li>
            <li>complete identity and address verification; and</li>
            <li>consent to basic fraud-prevention screening.</li>
          </ul>
          <p className="mb-3"><strong>3.2</strong> ShareWheelz performs verification on a reasonable-efforts basis only and does not guarantee the accuracy of user-supplied information.</p>
          <p className="mb-3"><strong>3.3</strong> Owners remain responsible for vehicle roadworthiness, MOT status, tax, and insurance notifications.</p>
          <p><strong>3.4</strong> Providing false information or failing to maintain vehicle compliance may result in account suspension or removal.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. PLATFORM SERVICES AND RESPONSIBILITIES</h2>
          <p className="mb-3"><strong>4.1</strong> ShareWheelz provides digital tools for listing, booking, payment facilitation, and support.</p>
          <p className="mb-3"><strong>4.2</strong> The rental agreement exists solely between Owner and Renter. ShareWheelz is not a party to that contract and assumes no liability for its performance, except where expressly required by law.</p>
          <p><strong>4.3</strong> Nothing in these Terms imposes any duty of care on ShareWheelz beyond statutory minimums.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. PAYMENTS AND FEES</h2>
          <p className="mb-3"><strong>5.1</strong> Payments are processed through FCA-regulated payment providers. ShareWheelz does not hold client funds in trust.</p>
          <p className="mb-3"><strong>5.2</strong> A Service Fee is deducted from each transaction. The remaining amount is remitted to the Owner after deducting any applicable charges.</p>
          <p><strong>5.3</strong> Refunds or security-deposit adjustments are handled once any active dispute is resolved. ShareWheelz is not liable for processor or banking delays.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. INSURANCE AND LIABILITY</h2>
          <p className="mb-3"><strong>6.1</strong> Insurance coverage is provided by an FCA-authorised insurer partner. Policy terms, limits, and excess apply as stated in each rental summary.</p>
          <p className="mb-3"><strong>6.2</strong> ShareWheelz is not an insurer and does not guarantee coverage decisions made by the insurer.</p>
          <p className="mb-3"><strong>6.3</strong> Owners must inform their personal insurer that their vehicle is listed for peer-to-peer rental.</p>
          <p><strong>6.4 Limitation of Liability.</strong> To the maximum extent permitted by law, ShareWheelz's aggregate liability for any claim shall not exceed the total Service Fees paid by that user within the preceding twelve months. ShareWheelz is not liable for indirect or consequential loss.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. USER CONDUCT</h2>
          <p>Users must operate vehicles lawfully and respect Owner property. Prohibited conduct includes reckless driving, intoxication, unlawful use, sub-letting, and providing false information. Violations may result in immediate account termination and referral to authorities.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. AUDIT AND COMPLIANCE</h2>
          <p className="mb-3"><strong>8.1</strong> ShareWheelz may conduct internal reviews to ensure ongoing compliance with UK law.</p>
          <p className="mb-3"><strong>8.2</strong> ShareWheelz cooperates with competent authorities upon lawful request while protecting user confidentiality under the UK GDPR.</p>
          <p className="mb-3"><strong>8.3</strong> Such cooperation does not constitute an admission of liability or wrongdoing.</p>
          <p><strong>8.4</strong> ShareWheelz may inspect listings, review claims, and suspend accounts pending investigation, consistent with its Privacy Policy and legal obligations.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. DISPUTE RESOLUTION</h2>
          <p className="mb-3"><strong>9.1</strong> Users must first use the ShareWheelz internal resolution process.</p>
          <p className="mb-3"><strong>9.2</strong> If unresolved, disputes shall be submitted to confidential arbitration in London under the LCIA Rules, unless a mandatory consumer right requires court jurisdiction.</p>
          <p className="mb-3"><strong>9.3</strong> Each party bears its own legal costs unless the arbitrator decides otherwise.</p>
          <p className="mb-3"><strong>9.4</strong> Any claim must be brought within six months of the relevant event.</p>
          <p className="mb-3"><strong>9.5</strong> Users waive class or representative actions to the extent permitted by law.</p>
          <p><strong>9.6</strong> Each user indemnifies ShareWheelz and its officers against losses arising from that user's breach or negligence. This obligation survives termination.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. DATA PROTECTION</h2>
          <p className="mb-3"><strong>10.1</strong> ShareWheelz processes personal data in accordance with the UK GDPR and Data Protection Act 2018 for verification, booking, and support purposes only.</p>
          <p><strong>10.2</strong> Data is stored securely within the UK and retained only as required by law. Users may exercise their data rights by contacting privacy@sharewheelz.uk.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. FORCE MAJEURE</h2>
          <p>ShareWheelz is not liable for failure to perform caused by events beyond reasonable control including natural disasters, network failures, or government actions.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. ASSIGNMENT AND SEVERABILITY</h2>
          <p>Rights and obligations under these Terms may not be assigned without ShareWheelz's written consent. If any provision is held invalid, the remainder continues in effect.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. GOVERNING LAW AND JURISDICTION</h2>
          <p>These Terms are governed by English law. Subject to the arbitration provisions above, the courts of England and Wales have exclusive jurisdiction for enforcement.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">14. CONTACT</h2>
          <div className="space-y-2">
            <p><strong>Support</strong> – support@sharewheelz.uk</p>
            <p><strong>Legal</strong> – legal@sharewheelz.uk</p>
            <p><strong>Registered Office</strong> – London, United Kingdom</p>
          </div>
        </section>

        <section className="p-6 bg-green-50 border-l-4 border-green-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">TRANSPARENCY STATEMENT</h2>
          <p>ShareWheelz Ltd is committed to lawful and responsible operation within the UK mobility sector. All compliance measures are implemented on a reasonable-efforts basis and subject to verification by independent authorities where required by law. Nothing herein constitutes a public representation of regulatory status beyond current registrations or partnerships.</p>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-6 px-6 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© 2025 ShareWheelz Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
