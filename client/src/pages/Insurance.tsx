import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface InsurancePolicy {
  id: string;
  carId: string;
  car: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
  policyNumber: string;
  provider: string;
  coverageType: "basic" | "standard" | "premium";
  startDate: string;
  endDate: string;
  premium: number;
  status: "active" | "expired" | "pending";
  coverageDetails: {
    liability: number;
    collision: number;
    comprehensive: number;
    personalInjury: number;
  };
}

interface InsuranceClaim {
  id: string;
  policyId: string;
  bookingId: string;
  claimNumber: string;
  incidentDate: string;
  description: string;
  amount: number;
  status: "submitted" | "processing" | "approved" | "denied" | "paid";
  documents: string[];
  createdAt: string;
}

export default function Insurance() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"policies" | "claims">("policies");
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimForm, setClaimForm] = useState({
    policyId: "",
    bookingId: "",
    incidentDate: "",
    description: "",
    estimatedAmount: "",
  });

  const { data: policies = [] } = useQuery<InsurancePolicy[]>({
    queryKey: ["/api/insurance/policies"],
  });

  const { data: claims = [] } = useQuery<InsuranceClaim[]>({
    queryKey: ["/api/insurance/claims"],
  });

  const submitClaimMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/insurance/claims", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to submit claim");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/insurance/claims"] });
      setShowClaimForm(false);
      setClaimForm({
        policyId: "",
        bookingId: "",
        incidentDate: "",
        description: "",
        estimatedAmount: "",
      });
    },
  });

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(claimForm).forEach(([key, value]) => {
      formData.append(key, value);
    });
    submitClaimMutation.mutate(formData);
  };

  const getCoverageColor = (type: string) => {
    switch (type) {
      case "basic": return "bg-yellow-100 text-yellow-800";
      case "standard": return "bg-blue-100 text-blue-800";
      case "premium": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "expired": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "denied": return "bg-red-100 text-red-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "paid": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => `£${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Insurance Management</h1>
          {activeTab === "claims" && (
            <button
              onClick={() => setShowClaimForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              File New Claim
            </button>
          )}
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("policies")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "policies"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Insurance Policies ({policies.length})
              </button>
              <button
                onClick={() => setActiveTab("claims")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "claims"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Claims ({claims.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "policies" ? (
              <div className="space-y-6">
                {policies.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No insurance policies</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Insurance policies for your cars will appear here.
                    </p>
                  </div>
                ) : (
                  policies.map((policy) => (
                    <div key={policy.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {policy.car.year} {policy.car.make} {policy.car.model}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Policy #{policy.policyNumber} • {policy.provider}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCoverageColor(policy.coverageType)}`}>
                            {policy.coverageType.toUpperCase()}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(policy.status)}`}>
                            {policy.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Policy Details</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>Start Date: {new Date(policy.startDate).toLocaleDateString()}</p>
                            <p>End Date: {new Date(policy.endDate).toLocaleDateString()}</p>
                            <p>Premium: {formatCurrency(policy.premium)}/month</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Coverage Limits</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>Liability: {formatCurrency(policy.coverageDetails.liability)}</p>
                            <p>Collision: {formatCurrency(policy.coverageDetails.collision)}</p>
                            <p>Comprehensive: {formatCurrency(policy.coverageDetails.comprehensive)}</p>
                            <p>Personal Injury: {formatCurrency(policy.coverageDetails.personalInjury)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {claims.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No insurance claims</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Insurance claims will appear here when filed.
                    </p>
                  </div>
                ) : (
                  claims.map((claim) => (
                    <div key={claim.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Claim #{claim.claimNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Incident Date: {new Date(claim.incidentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                          {claim.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-sm text-gray-600">{claim.description}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <p>Claim Amount: {formatCurrency(claim.amount)}</p>
                          <p>Filed: {new Date(claim.createdAt).toLocaleDateString()}</p>
                        </div>
                        {claim.documents.length > 0 && (
                          <div className="text-sm text-gray-600">
                            <p>{claim.documents.length} document(s) attached</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Claim Form Modal */}
        {showClaimForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">File Insurance Claim</h2>
              </div>
              <form onSubmit={handleClaimSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Policy</label>
                  <select
                    value={claimForm.policyId}
                    onChange={(e) => setClaimForm(prev => ({ ...prev, policyId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a policy</option>
                    {policies.filter(p => p.status === "active").map((policy) => (
                      <option key={policy.id} value={policy.id}>
                        {policy.car.year} {policy.car.make} {policy.car.model} - {policy.policyNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking ID (if applicable)</label>
                  <input
                    type="text"
                    value={claimForm.bookingId}
                    onChange={(e) => setClaimForm(prev => ({ ...prev, bookingId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Incident Date</label>
                  <input
                    type="date"
                    value={claimForm.incidentDate}
                    onChange={(e) => setClaimForm(prev => ({ ...prev, incidentDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={claimForm.description}
                    onChange={(e) => setClaimForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the incident..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Amount</label>
                  <input
                    type="number"
                    value={claimForm.estimatedAmount}
                    onChange={(e) => setClaimForm(prev => ({ ...prev, estimatedAmount: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowClaimForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitClaimMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitClaimMutation.isPending ? "Filing..." : "File Claim"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
