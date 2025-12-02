import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "../lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  Car, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Download, 
  Search, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity,
  Award,
  RefreshCw,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Booking {
  id: string;
  carId: string;
  car: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    images: string[];
  };
  renter: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  createdAt: string;
}

export default function BookingManagement() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<"all" | Booking["status"]>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "price" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedBookings, setExpandedBookings] = useState<Set<string>>(new Set());

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings/owner"],
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: Booking["status"] }) => {
      await apiRequest("PATCH", `/api/bookings/${bookingId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/owner"] });
    },
  });

  // Enhanced filtering and sorting
  const processedBookings = bookings
    .filter(booking => {
      const matchesFilter = filter === "all" || booking.status === filter;
      const matchesSearch = searchTerm === "" || 
        booking.car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.renter.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.renter.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.renter.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "price":
          comparison = a.totalPrice - b.totalPrice;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Calculate booking analytics
  const analytics = {
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, booking) => sum + booking.totalPrice, 0),
    averageBookingValue: bookings.length > 0 ? bookings.reduce((sum, booking) => sum + booking.totalPrice, 0) / bookings.length : 0,
    statusBreakdown: {
      pending: bookings.filter(b => b.status === "pending").length,
      confirmed: bookings.filter(b => b.status === "confirmed").length,
      active: bookings.filter(b => b.status === "active").length,
      completed: bookings.filter(b => b.status === "completed").length,
      cancelled: bookings.filter(b => b.status === "cancelled").length,
    },
    monthlyRevenue: calculateMonthlyRevenue(bookings),
    topRenters: getTopRenters(bookings),
    recentActivity: bookings.slice(0, 5)
  };

  function calculateMonthlyRevenue(bookings: Booking[]): any[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenue = months.map(month => ({ month, revenue: 0, bookings: 0 }));
    
    bookings.forEach(booking => {
      const month = new Date(booking.createdAt).getMonth();
      revenue[month].revenue += booking.totalPrice;
      revenue[month].bookings += 1;
    });
    
    return revenue;
  }

  function getTopRenters(bookings: Booking[]): any[] {
    const renterMap = new Map();
    
    bookings.forEach(booking => {
      const renterId = booking.renter.email;
      if (renterMap.has(renterId)) {
        const existing = renterMap.get(renterId);
        existing.totalSpent += booking.totalPrice;
        existing.bookings += 1;
      } else {
        renterMap.set(renterId, {
          name: `${booking.renter.firstName} ${booking.renter.lastName}`,
          email: booking.renter.email,
          totalSpent: booking.totalPrice,
          bookings: 1
        });
      }
    });
    
    return Array.from(renterMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  }

  const toggleBookingExpansion = (bookingId: string) => {
    const newExpanded = new Set(expandedBookings);
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId);
    } else {
      newExpanded.add(bookingId);
    }
    setExpandedBookings(newExpanded);
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/bookings/owner"] });
  };

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-purple-100 text-purple-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
              You need to be logged in to manage your bookings.
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
              <p className="text-gray-600 mt-2">Manage and track all your car rental bookings</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={refreshData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Bookings</p>
                    <p className="text-2xl font-bold">{analytics.totalBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold">£{analytics.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Avg Booking Value</p>
                    <p className="text-2xl font-bold">£{analytics.averageBookingValue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Active Bookings</p>
                    <p className="text-2xl font-bold">{analytics.statusBreakdown.active}</p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-200" />
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
                  <input
                    type="text"
                    placeholder="Search bookings by car, renter name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="price">Sort by Price</option>
                    <option value="status">Sort by Status</option>
                  </select>
                  
                  <Button
                    variant="outline"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-3 py-2"
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">All Bookings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-blue-600" />
                      Booking Status Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analytics.statusBreakdown).map(([status, count]) => (
                        <div key={status} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              status === 'pending' ? 'bg-yellow-500' :
                              status === 'confirmed' ? 'bg-blue-500' :
                              status === 'active' ? 'bg-green-500' :
                              status === 'completed' ? 'bg-purple-500' :
                              'bg-red-500'
                            }`}></div>
                            <span className="capitalize">{status}</span>
                          </div>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Renters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      Top Renters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topRenters.map((renter, index) => (
                        <div key={renter.email} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{renter.name}</p>
                            <p className="text-sm text-gray-600">{renter.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">£{renter.totalSpent.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">{renter.bookings} bookings</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <div className="space-y-4">
                {processedBookings.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No bookings found
                      </h3>
                      <p className="text-gray-600">
                        {searchTerm || filter !== "all" 
                          ? "Try adjusting your search or filter criteria"
                          : "You don't have any bookings yet"
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  processedBookings.map((booking) => (
                    <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                              {booking.car.images && booking.car.images.length > 0 ? (
                                <img
                                  src={booking.car.images[0]}
                                  alt={`${booking.car.make} ${booking.car.model}`}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Car className="h-10 w-10 text-gray-400" />
                                </div>
                              )}
                              
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {booking.car.make} {booking.car.model} ({booking.car.year})
                                </h3>
                                <p className="text-gray-600 mb-2">
                                  License: {booking.car.licensePlate}
                                </p>
                                
                                <div className="flex items-center gap-6 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{calculateDays(booking.startDate, booking.endDate)} days</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="font-semibold text-green-600">£{booking.totalPrice}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    {booking.renter.firstName} {booking.renter.lastName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{booking.renter.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{booking.renter.phone}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleBookingExpansion(booking.id)}
                                >
                                  {expandedBookings.has(booking.id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {expandedBookings.has(booking.id) && (
                              <div className="mt-4 pt-4 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Booking Details</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><span className="font-medium">Booking ID:</span> {booking.id}</p>
                                      <p><span className="font-medium">Created:</span> {formatDate(booking.createdAt)}</p>
                                      <p><span className="font-medium">Duration:</span> {calculateDays(booking.startDate, booking.endDate)} days</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-2">Actions</h4>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateBookingMutation.mutate({ 
                                          bookingId: booking.id, 
                                          status: booking.status === "pending" ? "confirmed" : "completed" 
                                        })}
                                        disabled={updateBookingMutation.isPending}
                                      >
                                        {booking.status === "pending" ? (
                                          <>
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Confirm
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Complete
                                          </>
                                        )}
                                      </Button>
                                      
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateBookingMutation.mutate({ 
                                          bookingId: booking.id, 
                                          status: "cancelled" 
                                        })}
                                        disabled={updateBookingMutation.isPending}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Cancel
                                      </Button>
                                      
                                      <Button size="sm" variant="outline">
                                        <MessageSquare className="h-4 w-4 mr-1" />
                                        Message
                                      </Button>
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
                {/* Monthly Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      Monthly Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.monthlyRevenue.map((month) => (
                        <div key={month.month} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{month.month}</span>
                            <span className="font-semibold">£{month.revenue.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ 
                                width: `${Math.max(10, (month.revenue / Math.max(...analytics.monthlyRevenue.map(m => m.revenue))) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Booking Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.monthlyRevenue.map((month) => (
                        <div key={month.month} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{month.month}</span>
                            <span className="font-semibold">{month.bookings} bookings</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ 
                                width: `${Math.max(10, (month.bookings / Math.max(...analytics.monthlyRevenue.map(m => m.bookings))) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* Main content ends here - Footer is handled by App.tsx */}
    </div>
  );
}
