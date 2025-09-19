import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

interface EarningsData {
  totalEarnings: number;
  availableBalance: number;
  pendingPayouts: number;
  nextPayoutDate: string;
  recentTransactions: Transaction[];
  monthlyBreakdown: MonthlyEarning[];
}

interface Transaction {
  id: string;
  type: "earning" | "payout" | "fee";
  amount: number;
  description: string;
  bookingId?: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface MonthlyEarning {
  month: string;
  grossEarnings: number;
  platformFee: number;
  netEarnings: number;
  bookings: number;
}

export default function Earnings() {
  const queryClient = useQueryClient();
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "1y">("30d");

  const { data: earnings, isLoading } = useQuery<EarningsData>({
    queryKey: ["/api/earnings", timeRange],
  });

  const requestPayoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/earnings/payout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/earnings"] });
    },
  });

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!earnings) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                      {formatCurrency(earnings.totalEarnings)}
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
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">💳</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Available Balance</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {formatCurrency(earnings.availableBalance)}
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Payouts</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {formatCurrency(earnings.pendingPayouts)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Section */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Payout Information</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next automatic payout</p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(earnings.nextPayoutDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => requestPayoutMutation.mutate()}
                disabled={earnings.availableBalance < 25 || requestPayoutMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {requestPayoutMutation.isPending ? "Processing..." : "Request Payout"}
              </button>
            </div>
            {earnings.availableBalance < 25 && (
              <p className="mt-2 text-sm text-gray-500">
                Minimum payout amount is $25
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Breakdown */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Monthly Breakdown</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {earnings.monthlyBreakdown.map((month, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{month.month}</h4>
                      <span className="text-sm text-gray-500">{month.bookings} bookings</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gross Earnings:</span>
                        <span className="text-gray-900">{formatCurrency(month.grossEarnings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform Fee:</span>
                        <span className="text-red-600">-{formatCurrency(month.platformFee)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span className="text-gray-900">Net Earnings:</span>
                        <span className="text-green-600">{formatCurrency(month.netEarnings)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {earnings.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()} • {transaction.type}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className={`text-sm font-medium ${
                        transaction.type === "earning" ? "text-green-600" : 
                        transaction.type === "fee" ? "text-red-600" : "text-gray-900"
                      }`}>
                        {transaction.type === "earning" ? "+" : transaction.type === "fee" ? "-" : ""}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}