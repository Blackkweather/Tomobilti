import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

interface Promotion {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "percentage" | "fixed" | "free_day";
  value: number;
  minimumBooking?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  userUsageLimit?: number;
  userUsedCount: number;
  status: "active" | "expired" | "used" | "inactive";
  categories?: string[];
  image?: string;
}

interface UserPromotion {
  id: string;
  promotion: Promotion;
  usedAt?: string;
  bookingId?: string;
  discountAmount: number;
}

export default function Promotions() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"available" | "used">("available");
  const [promoCode, setPromoCode] = useState("");

  const { data: availablePromotions = [] } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions/available"],
  });

  const { data: usedPromotions = [] } = useQuery<UserPromotion[]>({
    queryKey: ["/api/promotions/used"],
  });

  const applyPromoMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/promotions/apply", { code });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions/available"] });
      setPromoCode("");
    },
  });

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      applyPromoMutation.mutate(promoCode.trim().toUpperCase());
    }
  };

  const getDiscountText = (promotion: Promotion) => {
    switch (promotion.type) {
      case "percentage":
        return `${promotion.value}% OFF`;
      case "fixed":
        return `$${promotion.value} OFF`;
      case "free_day":
        return `${promotion.value} FREE DAY${promotion.value > 1 ? 'S' : ''}`;
      default:
        return "DISCOUNT";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "expired": return "bg-red-100 text-red-800";
      case "used": return "bg-gray-100 text-gray-800";
      case "inactive": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isExpiringSoon = (validUntil: string) => {
    const expiryDate = new Date(validUntil);
    const now = new Date();
    const diffInDays = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7 && diffInDays > 0;
  };

  const formatCurrency = (amount: number) => `$${amount}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Promotions & Discounts</h1>
          <p className="mt-2 text-gray-600">Save money on your car rentals with exclusive offers</p>
        </div>

        {/* Promo Code Input */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Have a Promo Code?</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleApplyPromo} className="flex">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!promoCode.trim() || applyPromoMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-md text-sm font-medium disabled:opacity-50"
              >
                {applyPromoMutation.isPending ? "Applying..." : "Apply"}
              </button>
            </form>
            {applyPromoMutation.error && (
              <p className="mt-2 text-sm text-red-600">
                {applyPromoMutation.error.message}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("available")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "available"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Available Promotions ({availablePromotions.length})
              </button>
              <button
                onClick={() => setActiveTab("used")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "used"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Used Promotions ({usedPromotions.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "available" ? (
              <div className="space-y-6">
                {availablePromotions.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No promotions available</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Check back later for new deals and discounts.
                    </p>
                  </div>
                ) : (
                  availablePromotions.map((promotion) => (
                    <div key={promotion.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="flex">
                        {promotion.image && (
                          <img
                            src={promotion.image}
                            alt={promotion.title}
                            className="w-32 h-32 object-cover"
                          />
                        )}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className="text-lg font-medium text-gray-900">{promotion.title}</h3>
                                <span className="ml-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  {getDiscountText(promotion)}
                                </span>
                                {isExpiringSoon(promotion.validUntil) && (
                                  <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Expires Soon
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mb-3">{promotion.description}</p>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                <span>Code: <strong>{promotion.code}</strong></span>
                                <span>Valid until: {new Date(promotion.validUntil).toLocaleDateString()}</span>
                                {promotion.minimumBooking && (
                                  <span>Min booking: {formatCurrency(promotion.minimumBooking)}</span>
                                )}
                                {promotion.maxDiscount && (
                                  <span>Max discount: {formatCurrency(promotion.maxDiscount)}</span>
                                )}
                              </div>

                              {promotion.categories && promotion.categories.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {promotion.categories.map((category, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                    >
                                      {category}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                  {promotion.usageLimit && (
                                    <span>
                                      {promotion.usageLimit - promotion.usedCount} uses remaining
                                    </span>
                                  )}
                                  {promotion.userUsageLimit && (
                                    <span className="ml-4">
                                      You can use {promotion.userUsageLimit - promotion.userUsedCount} more time{promotion.userUsageLimit - promotion.userUsedCount !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => setPromoCode(promotion.code)}
                                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                                >
                                  Use This Code
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {usedPromotions.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No used promotions</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Promotions you've used will appear here.
                    </p>
                  </div>
                ) : (
                  usedPromotions.map((userPromo) => (
                    <div key={userPromo.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{userPromo.promotion.title}</h3>
                            <span className="ml-3 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                              {getDiscountText(userPromo.promotion)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{userPromo.promotion.description}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div>
                              <span>Code: <strong>{userPromo.promotion.code}</strong></span>
                              {userPromo.usedAt && (
                                <span className="ml-4">
                                  Used on: {new Date(userPromo.usedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-medium text-green-600">
                                Saved: {formatCurrency(userPromo.discountAmount)}
                              </p>
                              {userPromo.bookingId && (
                                <p className="text-xs">Booking #{userPromo.bookingId}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}