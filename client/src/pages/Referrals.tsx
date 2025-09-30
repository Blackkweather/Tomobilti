import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  referralHistory: Array<{
    id: string;
    referredUser: string;
    status: "pending" | "completed" | "cancelled";
    earnings: number;
    createdAt: string;
    completedAt?: string;
  }>;
  program: {
    referrerBonus: number;
    refereeBonus: number;
    minimumBooking: number;
    expiryDays: number;
  };
}

export default function Referrals() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: referralData, isLoading } = useQuery<ReferralData>({
    queryKey: ["/api/referrals"],
  });

  const sendInviteMutation = useMutation({
    mutationFn: async (email: string) => {
      await apiRequest("POST", "/api/referrals/invite", { email });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/referrals"] });
      setEmail("");
    },
  });

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      sendInviteMutation.mutate(email.trim());
    }
  };

  const copyReferralLink = () => {
    if (referralData) {
      const link = `${window.location.origin}/register?ref=${referralData.referralCode}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnSocial = (platform: "facebook" | "twitter" | "whatsapp") => {
    if (!referralData) return;
    
    const link = `${window.location.origin}/register?ref=${referralData.referralCode}`;
    const text = `Join ShareWheelz and get $${referralData.program.refereeBonus} off your first booking!`;
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + link)}`;
        break;
    }
    
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => `£${amount}`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!referralData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Refer Friends & Earn</h1>
          <p className="mt-2 text-gray-600">
            Share ShareWheelz with friends and earn {formatCurrency(referralData.program.referrerBonus)} for each successful referral
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Referrals</dt>
                    <dd className="text-2xl font-bold text-gray-900">{referralData.totalReferrals}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">💰</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {formatCurrency(referralData.totalEarnings)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">⏳</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Earnings</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {formatCurrency(referralData.pendingEarnings)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">How It Works</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📤</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">1. Share Your Link</h3>
                <p className="text-gray-600">
                  Send your unique referral link to friends via email, social media, or messaging apps.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">2. Friend Signs Up</h3>
                <p className="text-gray-600">
                  Your friend creates an account using your link and gets {formatCurrency(referralData.program.refereeBonus)} off their first booking.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">3. You Earn Money</h3>
                <p className="text-gray-600">
                  When they complete a booking of {formatCurrency(referralData.program.minimumBooking)}+, you earn {formatCurrency(referralData.program.referrerBonus)}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Share Your Referral Link</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Code</label>
              <div className="flex">
                <input
                  type="text"
                  value={referralData.referralCode}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 bg-gray-50"
                />
                <button
                  onClick={copyReferralLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md text-sm font-medium"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Share on Social Media</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => shareOnSocial("facebook")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  📘 Facebook
                </button>
                <button
                  onClick={() => shareOnSocial("twitter")}
                  className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  🐦 Twitter
                </button>
                <button
                  onClick={() => shareOnSocial("whatsapp")}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  💬 WhatsApp
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Send Email Invitation</h3>
              <form onSubmit={handleSendInvite} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter friend's email"
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={sendInviteMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-md text-sm font-medium disabled:opacity-50"
                >
                  {sendInviteMutation.isPending ? "Sending..." : "Send Invite"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Referral History</h2>
          </div>
          <div className="p-6">
            {referralData.referralHistory.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No referrals yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start sharing your referral link to earn money!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {referralData.referralHistory.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{referral.referredUser}</p>
                      <p className="text-xs text-gray-500">
                        Referred on {new Date(referral.createdAt).toLocaleDateString()}
                        {referral.completedAt && (
                          <span> • Completed on {new Date(referral.completedAt).toLocaleDateString()}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                        {referral.status.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(referral.earnings)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
