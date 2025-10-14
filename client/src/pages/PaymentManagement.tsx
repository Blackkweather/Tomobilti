import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Loader2, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MapPin, 
  Car, 
  Shield, 
  Lock, 
  ArrowLeft,
  Clock,
  User,
  Phone,
  Mail,
  AlertTriangle,
  Info,
  Gift,
  Star,
  Zap,
  Settings,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Download,
  Eye,
  EyeOff,
  Filter,
  Search,
  RefreshCw,
  Plus,
  Minus,
  Receipt,
  FileText,
  Banknote,
  Wallet,
  Smartphone,
  Laptop,
  Monitor,
  Printer,
  Share2,
  Bookmark,
  Archive,
  Trash2,
  Edit,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  QrCode,
  Send,
  MessageSquare,
  Bell,
  HelpCircle,
  ShieldCheck,
  Award,
  Target,
  Activity,
  PieChart as PieChartIcon,
  LineChart,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';
import { bookingApi, paymentApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';


interface PaymentData {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'paypal' | 'bank_transfer' | 'crypto';
  createdAt: string;
  processedAt?: string;
  refundedAt?: string;
  description: string;
  fees: number;
  netAmount: number;
  transactionId: string;
  receiptUrl?: string;
}

interface BillingData {
  totalSpent: number;
  totalEarnings: number;
  monthlySpending: number;
  monthlyEarnings: number;
  averageTransaction: number;
  totalTransactions: number;
  pendingPayments: number;
  refundedAmount: number;
  paymentMethods: any[];
  recentTransactions: PaymentData[];
  spendingByCategory: any[];
  monthlyTrends: any[];
}

export default function PaymentManagement() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(new Set());
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);

  // Fetch payment data
  const { data: paymentsData, isLoading, error, refetch } = useQuery({
    queryKey: ['payments', user?.id],
    queryFn: () => {
      // Mock payment data since getPayments doesn't exist in API
      return Promise.resolve({
        payments: [
          {
            id: '1',
            bookingId: 'booking-1',
            amount: 150.00,
            currency: 'usd',
            status: 'completed' as const,
            method: 'card' as const,
            createdAt: new Date().toISOString(),
            processedAt: new Date().toISOString(),
            description: 'Car rental payment',
            fees: 5.00,
            netAmount: 145.00,
            transactionId: 'txn_123456789',
            receiptUrl: '/receipts/receipt-1.pdf'
          },
          {
            id: '2',
            bookingId: 'booking-2',
            amount: 200.00,
            currency: 'usd',
            status: 'pending' as const,
            method: 'paypal' as const,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            description: 'Car rental payment',
            fees: 6.00,
            netAmount: 194.00,
            transactionId: 'txn_987654321'
          },
          {
            id: '3',
            bookingId: 'booking-3',
            amount: 100.00,
            currency: 'usd',
            status: 'failed' as const,
            method: 'card' as const,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            description: 'Car rental payment',
            fees: 3.00,
            netAmount: 97.00,
            transactionId: 'txn_456789123'
          }
        ]
      });
    },
    enabled: !!user,
  });

  const payments = paymentsData?.payments || [];

  // Calculate billing analytics
  const billingAnalytics: BillingData = {
    totalSpent: payments.reduce((sum: number, p: PaymentData) => sum + p.amount, 0),
    totalEarnings: payments.filter((p: PaymentData) => p.status === 'completed').reduce((sum: number, p: PaymentData) => sum + p.netAmount, 0),
    monthlySpending: calculateMonthlySpending(payments),
    monthlyEarnings: calculateMonthlyEarnings(payments),
    averageTransaction: payments.length > 0 ? payments.reduce((sum: number, p: PaymentData) => sum + p.amount, 0) / payments.length : 0,
    totalTransactions: payments.length,
    pendingPayments: payments.filter((p: PaymentData) => p.status === 'pending').length,
    refundedAmount: payments.filter((p: PaymentData) => p.status === 'refunded').reduce((sum: number, p: PaymentData) => sum + p.amount, 0),
    paymentMethods: getPaymentMethods(payments),
    recentTransactions: payments.slice(0, 10),
    spendingByCategory: calculateSpendingByCategory(payments),
    monthlyTrends: calculateMonthlyTrends(payments)
  };

  function calculateMonthlySpending(payments: PaymentData[]): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return payments
      .filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, p) => sum + p.amount, 0);
  }

  function calculateMonthlyEarnings(payments: PaymentData[]): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return payments
      .filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear && 
               p.status === 'completed';
      })
      .reduce((sum, p) => sum + p.netAmount, 0);
  }

  function getPaymentMethods(payments: PaymentData[]): any[] {
    const methods = new Map();
    
    payments.forEach(payment => {
      if (methods.has(payment.method)) {
        const existing = methods.get(payment.method);
        existing.count += 1;
        existing.totalAmount += payment.amount;
      } else {
        methods.set(payment.method, {
          method: payment.method,
          count: 1,
          totalAmount: payment.amount,
          icon: getPaymentMethodIcon(payment.method)
        });
      }
    });
    
    return Array.from(methods.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }

  function getPaymentMethodIcon(method: string) {
    switch (method) {
      case 'card': return CreditCard;
      case 'paypal': return Wallet;
      case 'bank_transfer': return Banknote;
      case 'crypto': return Zap;
      default: return CreditCard;
    }
  }

  function calculateSpendingByCategory(payments: PaymentData[]): any[] {
    const categories = new Map();
    
    payments.forEach((payment: PaymentData) => {
      const category = getPaymentCategory(payment.description);
      if (categories.has(category)) {
        const existing = categories.get(category);
        existing.amount += payment.amount;
        existing.count += 1;
      } else {
        categories.set(category, {
          category,
          amount: payment.amount,
          count: 1,
          color: getCategoryColor(category)
        });
      }
    });
    
    return Array.from(categories.values()).sort((a, b) => b.amount - a.amount);
  }

  function getPaymentCategory(description: string): string {
    if (description.toLowerCase().includes('rental')) return 'Car Rental';
    if (description.toLowerCase().includes('insurance')) return 'Insurance';
    if (description.toLowerCase().includes('fee')) return 'Service Fees';
    if (description.toLowerCase().includes('deposit')) return 'Deposits';
    return 'Other';
  }

  function getCategoryColor(category: string): string {
    switch (category) {
      case 'Car Rental': return 'bg-blue-500';
      case 'Insurance': return 'bg-green-500';
      case 'Service Fees': return 'bg-orange-500';
      case 'Deposits': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  }

  function calculateMonthlyTrends(payments: PaymentData[]): any[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trends = months.map(month => ({ month, spending: 0, earnings: 0 }));
    
    payments.forEach(payment => {
      const month = new Date(payment.createdAt).getMonth();
      trends[month].spending += payment.amount;
      if (payment.status === 'completed') {
        trends[month].earnings += payment.netAmount;
      }
    });
    
    return trends;
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = searchTerm === '' || 
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || payment.method === filterMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const toggleTransactionExpansion = (paymentId: string) => {
    const newExpanded = new Set(expandedTransactions);
    if (newExpanded.has(paymentId)) {
      newExpanded.delete(paymentId);
    } else {
      newExpanded.add(paymentId);
    }
    setExpandedTransactions(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You need to be logged in to view payment information.
            </p>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600 mt-2">Manage your payments, billing, and financial analytics</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Spent</p>
                    <p className="text-2xl font-bold">{formatCurrency(billingAnalytics.totalSpent)}</p>
                    <p className="text-blue-200 text-xs">
                      <TrendingUpIcon className="h-3 w-3 inline mr-1" />
                      +12.5% this month
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Earnings</p>
                    <p className="text-2xl font-bold">{formatCurrency(billingAnalytics.totalEarnings)}</p>
                    <p className="text-green-200 text-xs">
                      <TrendingUpIcon className="h-3 w-3 inline mr-1" />
                      +8.3% this month
                    </p>
                  </div>
                  <TrendingUpIcon className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Transactions</p>
                    <p className="text-2xl font-bold">{billingAnalytics.totalTransactions}</p>
                    <p className="text-purple-200 text-xs">
                      {billingAnalytics.pendingPayments} pending
                    </p>
                  </div>
                  <Receipt className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Avg Transaction</p>
                    <p className="text-2xl font-bold">{formatCurrency(billingAnalytics.averageTransaction)}</p>
                    <p className="text-orange-200 text-xs">
                      Per transaction
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Controls */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search payments by description or transaction ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterMethod} onValueChange={setFilterMethod}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="methods">Payment Methods</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending by Category */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5 text-blue-600" />
                      Spending by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {billingAnalytics.spendingByCategory.map((category, index) => (
                        <div key={category.category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{category.category}</span>
                            <span className="font-semibold">{formatCurrency(category.amount)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${category.color}`}
                              style={{ 
                                width: `${Math.max(10, (category.amount / Math.max(...billingAnalytics.spendingByCategory.map(c => c.amount))) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {billingAnalytics.paymentMethods.map((method, index) => {
                        const Icon = method.icon;
                        return (
                          <div key={method.method} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-gray-600" />
                              <div>
                                <p className="font-medium capitalize">{method.method.replace('_', ' ')}</p>
                                <p className="text-sm text-gray-600">{method.count} transactions</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(method.totalAmount)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <div className="space-y-4">
                {filteredPayments.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No transactions found
                      </h3>
                      <p className="text-gray-600">
                        {searchTerm || filterStatus !== "all" || filterMethod !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "You don't have any transactions yet"
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredPayments.map((payment: PaymentData) => (
                    <Card key={payment.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex-shrink-0">
                                {getPaymentMethodIcon(payment.method)({ className: "h-8 w-8 text-gray-600" })}
                              </div>
                              
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {payment.description}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  Transaction ID: {payment.transactionId}
                                </p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(payment.createdAt)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="font-semibold text-green-600">{formatCurrency(payment.amount)}</span>
                                  </div>
                                  {payment.fees > 0 && (
                                    <div className="flex items-center gap-1">
                                      <Info className="h-4 w-4" />
                                      <span>Fees: {formatCurrency(payment.fees)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Badge className={getStatusColor(payment.status)}>
                                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </Badge>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                                  <span>•</span>
                                  <span>{payment.currency.toUpperCase()}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleTransactionExpansion(payment.id)}
                                >
                                  {expandedTransactions.has(payment.id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                                
                                {payment.receiptUrl && (
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {expandedTransactions.has(payment.id) && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Transaction Details</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><span className="font-medium">ID:</span> {payment.id}</p>
                                      <p><span className="font-medium">Booking ID:</span> {payment.bookingId}</p>
                                      <p><span className="font-medium">Net Amount:</span> {formatCurrency(payment.netAmount)}</p>
                                      {payment.processedAt && (
                                        <p><span className="font-medium">Processed:</span> {formatDate(payment.processedAt)}</p>
                                      )}
                                      {payment.refundedAt && (
                                        <p><span className="font-medium">Refunded:</span> {formatDate(payment.refundedAt)}</p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-2">Actions</h4>
                                    <div className="flex gap-2">
                                      {payment.receiptUrl && (
                                        <Button size="sm" variant="outline">
                                          <Download className="h-4 w-4 mr-1" />
                                          Download Receipt
                                        </Button>
                                      )}
                                      
                                      <Button size="sm" variant="outline">
                                        <Share2 className="h-4 w-4 mr-1" />
                                        Share
                                      </Button>
                                      
                                      {payment.status === 'completed' && (
                                        <Button size="sm" variant="outline">
                                          <RefreshCw className="h-4 w-4 mr-1" />
                                          Request Refund
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-blue-600" />
                      Monthly Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {billingAnalytics.monthlyTrends.slice(-6).map((trend) => (
                        <div key={trend.month} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{trend.month}</span>
                            <span className="font-semibold">{formatCurrency(trend.spending)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ 
                                width: `${Math.max(10, (trend.spending / Math.max(...billingAnalytics.monthlyTrends.map(t => t.spending))) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      Payment Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Successful Payments</span>
                        <span className="font-semibold">
                          {payments.filter((p: PaymentData) => p.status === 'completed').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pending Payments</span>
                        <span className="font-semibold text-yellow-600">
                          {payments.filter((p: PaymentData) => p.status === 'pending').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Failed Payments</span>
                        <span className="font-semibold text-red-600">
                          {payments.filter((p: PaymentData) => p.status === 'failed').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Refunded Amount</span>
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(billingAnalytics.refundedAmount)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="methods" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Payment Methods Management
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Manage your saved payment methods and billing information
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* Footer is rendered globally in App */}
    </div>
  );
}
