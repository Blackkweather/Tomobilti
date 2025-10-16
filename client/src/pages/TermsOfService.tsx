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
        <p className="text-lg text-gray-600 mb-8">(LEGAL PROTECTION EDITION)</p>
        <p className="text-sm text-gray-500 mb-12">Effective Date: 14 October 2025</p>

        <section className="mb-12 p-6 bg-blue-50 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">GOVERNING FRAMEWORK NOTICE</h2>
          <p className="mb-4">ShareWheelz Ltd ("ShareWheelz") is a United Kingdom-based peer-to-peer car-sharing platform registered under the Companies Act 2006. These Terms of Service ("Terms") are issued pursuant to UK law, including the Consumer Rights Act 2015, the Unfair Contract Terms Act 1977, the Financial Services and Markets Act 2000, and the Data Protection Act 2018 / UK GDPR.</p>
          <p className="mb-4">ShareWheelz operates in full compliance with UK consumer-protection and financial-services regulations. Our appointed insurance partner is an FCA-authorised insurer providing comprehensive vehicle-sharing coverage.</p>
          <p className="font-semibold">By using our website, mobile application, or related services (collectively the "Service"), you agree to be bound by these Terms.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. INTRODUCTION AND ACCEPTANCE</h2>
          <p className="mb-3"><strong>1.1 Purpose.</strong> ShareWheelz provides a secure digital marketplace connecting verified vehicle owners ("Owners") with qualified renters ("Renters") throughout the United Kingdom.</p>
          <p className="mb-3"><strong>1.2 Binding Agreement.</strong> Accessing or using the Service constitutes acceptance of these Terms and all incorporated policies.</p>
          <p><strong>1.3 Transparency Commitment.</strong> ShareWheelz upholds principles of legality, fairness, and transparency and is subject to oversight by UK regulatory bodies including the Financial Conduct Authority (FCA), Information Commissioner's Office (ICO), and Trading Standards.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. DEFINITIONS</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Owner:</strong> A user listing a vehicle for rent on the platform.</li>
            <li><strong>Renter:</strong> A user hiring a listed vehicle.</li>
            <li><strong>Rental Period:</strong> The time from vehicle collection to return.</li>
            <li><strong>Platform Insurance:</strong> The commercial insurance policy arranged by ShareWheelz through an FCA-authorised partner.</li>
            <li><strong>Excess:</strong> The portion of a claim payable by the Renter.</li>
            <li><strong>Service Fee:</strong> A fee retained by ShareWheelz for use of the platform.</li>
            <li><strong>Damage or Loss:</strong> Any physical or financial harm, theft, accident, or loss arising from a rental.</li>
            <li><strong>Third-Party Claim:</strong> A claim by any person other than the Owner, Renter, or ShareWheelz.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. USER ELIGIBILITY AND VERIFICATION</h2>
          <p className="mb-3"><strong>3.1 Eligibility Requirements.</strong> Users must:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>be at least 21 years old;</li>
            <li>hold a full, valid UK or approved international driving licence;</li>
            <li>pass identity, address, and licence verification;</li>
            <li>consent to background and fraud-prevention checks.</li>
          </ul>
          <p className="mb-3"><strong>3.2 Owner Duties.</strong> Owners must ensure each listed vehicle is road-taxed, MOT-certified, insured, and roadworthy. Vehicles with unresolved safety recalls are strictly prohibited.</p>
          <p className="mb-3"><strong>3.3 Renter Duties.</strong> Renters must disclose any driving-licence suspensions or restrictions and may not authorise unverified drivers to operate the vehicle.</p>
          <p><strong>3.4 Duty of Accuracy.</strong> Supplying false or incomplete information constitutes a material breach and may result in immediate termination and potential legal action.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. PLATFORM SERVICES AND RESPONSIBILITIES</h2>
          <p className="mb-3"><strong>4.1 ShareWheelz provides:</strong></p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>secure booking, payment, and messaging systems;</li>
            <li>user verification;</li>
            <li>insurance facilitation;</li>
            <li>24/7 customer support;</li>
            <li>mediation and dispute resolution.</li>
          </ul>
          <p><strong>4.2</strong> ShareWheelz acts as a facilitating intermediary and is not a party to the rental contract between Owner and Renter except for insurance and payment processing obligations.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. PAYMENTS, FEES, AND REFUNDS</h2>
          <p className="mb-3"><strong>5.1 Structure.</strong></p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Rental Fee → paid to Owner.</li>
            <li>Service Fee (5–10 %) → retained by ShareWheelz.</li>
            <li>Insurance Fee (3–5 %) → forwarded to insurance partner.</li>
            <li>Processing Fee → payment-gateway cost.</li>
          </ul>
          <p className="mb-3"><strong>5.2 Security Deposits.</strong> A pre-authorisation may be held on the Renter's payment method. ShareWheelz may deduct authorised amounts to cover verified losses.</p>
          <p className="mb-3"><strong>5.3 Refunds.</strong> Refunds are processed within 5–10 business days and are subject to completion of any ongoing dispute procedure.</p>
          <p><strong>5.4 Regulatory Compliance.</strong> All payment activities comply with the Payment Services Regulations 2017 and are executed through FCA-regulated processors (e.g., Stripe Payments UK Ltd).</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. INSURANCE AND LIABILITY</h2>
          <p className="mb-3"><strong>6.1 Insurance Partner.</strong> All rentals are covered by ShareWheelz's appointed FCA-authorised insurance partner providing:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>comprehensive third-party liability up to £1 million;</li>
            <li>vehicle damage and theft protection;</li>
            <li>roadside assistance across the UK;</li>
            <li>standard £500 excess per claim (subject to optional waiver).</li>
          </ul>
          <p className="mb-3"><strong>6.2 Primary Coverage.</strong> During each Rental Period, the Platform Insurance serves as the primary insurance; personal Owner policies remain suspended for that period.</p>
          <p className="mb-3"><strong>6.3 Owner's Disclosure.</strong> Owners must notify their private insurer that vehicles are listed for peer-to-peer rental to prevent policy invalidation.</p>
          <p><strong>6.4 Limitation of Liability.</strong> ShareWheelz's liability is limited strictly to the coverage provided under its Platform Insurance. We are not liable for indirect, consequential, or punitive damages.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. USER CONDUCT AND PROHIBITED USES</h2>
          <p className="mb-3">Users must operate vehicles lawfully and responsibly. The following are strictly prohibited: reckless driving, intoxication, racing, towing, off-road use, commercial carriage, transport of prohibited goods, smoking, or falsifying information.</p>
          <p>Violations may result in termination, forfeiture of deposits, reporting to authorities, and permanent platform bans.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. AUDIT, COMPLIANCE, AND REGULATORY OVERSIGHT</h2>
          <p className="mb-3"><strong>8.1</strong> ShareWheelz conducts annual internal audits and maintains full transparency with UK regulators.</p>
          <p className="mb-3"><strong>8.2</strong> We cooperate with the FCA, DVLA, ICO, and Trading Standards on lawful requests while preserving user confidentiality.</p>
          <p className="mb-3"><strong>8.3</strong> Such cooperation shall never constitute an admission of liability.</p>
          <p><strong>8.4</strong> ShareWheelz reserves the right to inspect listings, review claims, and suspend accounts pending investigation.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. DISPUTE RESOLUTION AND LEGAL IMMUNITY</h2>
          <p className="mb-3"><strong>9.1 Internal Mediation (Mandatory)</strong></p>
          <p className="mb-4">All disputes must first be submitted through ShareWheelz's internal resolution portal. The company shall have 30 days to review and propose settlement.</p>
          <p className="mb-3"><strong>9.2 Arbitration (Primary Mechanism)</strong></p>
          <p className="mb-2">Unresolved disputes shall be referred to confidential binding arbitration administered by the London Court of International Arbitration (LCIA).</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Seat: London, England</li>
            <li>Language: English</li>
            <li>Decision: final and enforceable</li>
            <li>Costs: each party bears own legal fees unless otherwise ordered.</li>
          </ul>
          <p className="mb-3"><strong>9.3 Limited Court Access</strong></p>
          <p className="mb-4">Only for enforcement of arbitral awards or statutory rights may proceedings be brought in the High Court of Justice (London).</p>
          <p className="mb-3"><strong>9.4 Limitation of Claims</strong></p>
          <p className="mb-4">Any claim must be filed within six months of the event giving rise to it.</p>
          <p className="mb-3"><strong>9.5 Class-Action Waiver</strong></p>
          <p className="mb-4">Users waive the right to bring or join collective or representative actions.</p>
          <p className="mb-3"><strong>9.6 Indemnity</strong></p>
          <p>Each User indemnifies ShareWheelz, its directors, employees, and partners against all losses or claims arising from the User's negligence, breach, or unlawful acts. This obligation survives account termination.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. CONSUMER AND DATA PROTECTION</h2>
          <p className="mb-3"><strong>10.1</strong> ShareWheelz processes personal data under the UK GDPR and Data Protection Act 2018 solely for verification, bookings, insurance, and compliance.</p>
          <p className="mb-3"><strong>10.2</strong> Data is securely stored within the UK and retained only as required by law. Users may access, rectify, or request deletion of their data by contacting privacy@sharewheelz.uk.</p>
          <p><strong>10.3</strong> We maintain registration with the ICO and uphold lawful processing, transparency, and user-rights policies.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. FORCE MAJEURE</h2>
          <p>Neither party is liable for failure to perform obligations due to events beyond reasonable control, including natural disasters, strikes, network outages, or government actions.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. ASSIGNMENT AND SEVERABILITY</h2>
          <p>Users may not assign rights or obligations under these Terms without written consent. If any clause is held invalid, the remainder shall continue in effect.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. GOVERNING LAW AND JURISDICTION</h2>
          <p>These Terms are governed by English law. Subject to Clause 9, the courts of England and Wales have exclusive jurisdiction for enforcement or appeal.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">14. CONTACT INFORMATION</h2>
          <div className="space-y-2">
            <p><strong>General Support:</strong> support@sharewheelz.uk | +44 20 7946 0958</p>
            <p><strong>Legal &amp; Compliance:</strong> legal@sharewheelz.uk</p>
            <p><strong>Insurance Partner:</strong> [Official FCA-Authorised Insurance Partner]</p>
            <p><strong>Registered Office:</strong> London, United Kingdom</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">15. SIGNATURE</h2>
          <p className="mb-2">For and on behalf of ShareWheelz Ltd</p>
          <p className="mb-2">Authorised Representative: ________________________</p>
          <p>Date: 14 October 2025</p>
        </section>

        <section className="p-6 bg-green-50 border-l-4 border-green-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">TRANSPARENCY AND ACCOUNTABILITY STATEMENT</h2>
          <p>ShareWheelz Ltd is committed to lawful, transparent, and responsible operations within the UK sharing-mobility sector. We maintain comprehensive compliance frameworks, annual insurance audits, user-protection mechanisms, and transparent cooperation with regulators to ensure the safety and trust of every participant.</p>
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
