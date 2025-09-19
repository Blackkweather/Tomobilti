import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface ReportData {
  financialSummary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    taxableIncome: number;
  };
  bookingStats: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    averageBookingValue: number;
    occupancyRate: number;
  };
  carPerformance: Array<{
    carId: string;
    make: string;
    model: string;
    year: number;
    revenue: number;
    expenses: number;
    profit: number;
    utilizationRate: number;
    bookings: number;
  }>;
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
    bookings: number;
  }>;
  expenseCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export default function Reports() {
  const [reportType, setReportType] = useState<"financial" | "performance" | "tax">("financial");
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "1y" | "ytd">("ytd");

  const { data: reportData, isLoading } = useQuery<ReportData>({
    queryKey: ["/api/reports", reportType, timeRange],
  });

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const exportReport = (format: "pdf" | "csv") => {
    const params = new URLSearchParams({
      type: reportType,
      range: timeRange,
      format,
    });
    window.open(`/api/reports/export?${params}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reportData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Reports</h1>
          <div className="flex space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="ytd">Year to date</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={() => exportReport("pdf")}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Export PDF
              </button>
              <button
                onClick={() => exportReport("csv")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setReportType("financial")}
                className={`px-6 py-3 text-sm font-medium ${
                  reportType === "financial"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Financial Report
              </button>
              <button
                onClick={() => setReportType("performance")}
                className={`px-6 py-3 text-sm font-medium ${
                  reportType === "performance"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Performance Report
              </button>
              <button
                onClick={() => setReportType("tax")}
                className={`px-6 py-3 text-sm font-medium ${
                  reportType === "tax"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tax Report
              </button>
            </nav>
          </div>

          <div className="p-6">
            {reportType === "financial" && (
              <div className="space-y-8">
                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm">💰</span>
                        </div>
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(reportData.financialSummary.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm">💸</span>
                        </div>
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(reportData.financialSummary.totalExpenses)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm">📈</span>
                        </div>
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">Net Profit</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(reportData.financialSummary.netProfit)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm">🧾</span>
                        </div>
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">Taxable Income</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(reportData.financialSummary.taxableIncome)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Breakdown */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Financial Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expenses</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.monthlyBreakdown.map((month, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {month.month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(month.revenue)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(month.expenses)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={month.profit >= 0 ? "text-green-600" : "text-red-600"}>
                                {formatCurrency(month.profit)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {month.bookings}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Expense Categories */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Breakdown</h3>
                  <div className="space-y-3">
                    {reportData.expenseCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">{category.category}</span>
                        <div className="flex items-center space-x-4">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{formatPercentage(category.percentage)}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(category.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {reportType === "performance" && (
              <div className="space-y-8">
                {/* Booking Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.bookingStats.totalBookings}</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.bookingStats.completedBookings}</p>
                  </div>
                  <div className="bg-red-50 p-6 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Cancelled</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.bookingStats.cancelledBookings}</p>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Avg Booking Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(reportData.bookingStats.averageBookingValue)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(reportData.bookingStats.occupancyRate)}
                    </p>
                  </div>
                </div>

                {/* Car Performance */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Car Performance Analysis</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expenses</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.carPerformance.map((car) => (
                          <tr key={car.carId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {car.year} {car.make} {car.model}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(car.revenue)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(car.expenses)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={car.profit >= 0 ? "text-green-600" : "text-red-600"}>
                                {formatCurrency(car.profit)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatPercentage(car.utilizationRate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {car.bookings}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {reportType === "tax" && (
              <div className="space-y-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Tax Information</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>This report is for informational purposes only. Please consult with a tax professional for official tax preparation.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Gross Income:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(reportData.financialSummary.totalRevenue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Business Expenses:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(reportData.financialSummary.totalExpenses)}
                        </span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="text-sm font-medium text-gray-900">Taxable Income:</span>
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(reportData.financialSummary.taxableIncome)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Deductible Expenses</h3>
                    <div className="space-y-2">
                      {reportData.expenseCategories.map((category, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-sm text-gray-600">{category.category}:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(category.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}