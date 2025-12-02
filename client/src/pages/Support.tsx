import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface SupportTicket {
  subject: string;
  category: string;
  priority: string;
  description: string;
  attachments?: File[];
}

const FAQ_ITEMS = [
  {
    question: "How do I book a car?",
    answer: "Browse available cars, select your dates, and click 'Book Now'. You'll need to provide payment information and verify your identity."
  },
  {
    question: "What happens if I need to cancel?",
    answer: "You can cancel up to 24 hours before your booking starts for a full refund. Cancellations within 24 hours may incur fees."
  },
  {
    question: "How do I become a car owner?",
    answer: "Click 'Become a Host' and follow the steps to list your car. You'll need to provide car details, photos, and verification documents."
  },
  {
    question: "What insurance coverage is provided?",
    answer: "All bookings include comprehensive insurance coverage. Details are available in your booking confirmation."
  },
  {
    question: "How do I contact customer support?",
    answer: "Use the contact form below, email support@sharewheelz.uk, or call our 24/7 helpline at +44 20 7946 0958."
  }
];

export default function Support() {
  const [activeTab, setActiveTab] = useState<"faq" | "contact">("faq");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [ticket, setTicket] = useState<SupportTicket>({
    subject: "",
    category: "general",
    priority: "medium",
    description: "",
  });

  const submitTicketMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to submit ticket");
      return response.json();
    },
    onSuccess: () => {
      setTicket({
        subject: "",
        category: "general",
        priority: "medium",
        description: "",
      });
      alert("Support ticket submitted successfully!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(ticket).forEach(([key, value]) => {
      if (key !== "attachments" && value) {
        formData.append(key, value);
      }
    });
    if (ticket.attachments) {
      ticket.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }
    submitTicketMutation.mutate(formData);
  };

  const handleChange = (field: keyof SupportTicket) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setTicket(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTicket(prev => ({ ...prev, attachments: Array.from(e.target.files!) }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="mt-2 text-gray-600">Find answers or get in touch with our support team</p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("faq")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "faq"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "contact"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Contact Support
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "faq" ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                {FAQ_ITEMS.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">{item.question}</span>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${
                          expandedFaq === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedFaq === index && (
                      <div className="px-4 pb-3 text-gray-600">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Still need help?</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    Can't find what you're looking for? Our support team is here to help.
                  </p>
                  <button
                    onClick={() => setActiveTab("contact")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Support</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">📧</div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-sm text-gray-600">support@sharewheelz.uk</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">📞</div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-sm text-gray-600">1-800-TOMOBIL</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">💬</div>
                    <h3 className="font-medium text-gray-900">Live Chat</h3>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={ticket.category}
                        onChange={handleChange("category")}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">General Question</option>
                        <option value="booking">Booking Issue</option>
                        <option value="payment">Payment Problem</option>
                        <option value="technical">Technical Issue</option>
                        <option value="account">Account Problem</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={ticket.priority}
                        onChange={handleChange("priority")}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={ticket.subject}
                      onChange={handleChange("subject")}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={ticket.description}
                      onChange={handleChange("description")}
                      rows={6}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Please provide as much detail as possible..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (optional)</label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      You can attach screenshots, documents, or other relevant files.
                    </p>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={submitTicketMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      {submitTicketMutation.isPending ? "Submitting..." : "Submit Support Ticket"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
