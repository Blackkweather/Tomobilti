import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  PoundSterling, 
  Calendar, 
  Users, 
  Car, 
  Star,
  Eye,
  Clock,
  MapPin,
  BarChart3,
  PieChart,
  Activity,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalBookings: number;
    averageRating: number;
    activeCars: number;
    revenueGrowth: number;
    bookingGrowth: number;
    ratingGrowth: number;
    carGrowth: number;
  };
  revenue: {
    daily: Array<{ date: string; amount: number }>;
    monthly: Array<{ month: string; amount: number }>;
    yearly: Array<{ year: string; amount: number }>;
  };
  bookings: {
    status: Array<{ status: string; count: number; percentage: number }>;
    monthly: Array<{ month: string; count: number }>;
    topCars: Array<{ carId: string; title: string; bookings: number; revenue: number }>;
  };
  users: {
    newUsers: Array<{ date: string; count: number }>;
    userTypes: Array<{ type: string; count: number; percentage: number }>;
    topLocations: Array<{ location: string; users: number }>;
  };
  performance: {
    pageViews: Array<{ page: string; views: number }>;
    conversionRate: number;
    averageSessionDuration: number;
    bounceRate: number;
  };
}

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API response
      const mockData: AnalyticsData = {
        overview: {
          totalRevenue: 125000,
          totalBookings: 342,
          averageRating: 4.7,
          activeCars: 28,
          revenueGrowth: 12.5,
          bookingGrowth: 8.3,
          ratingGrowth: 2.1,
          carGrowth: 15.2
        },
        revenue: {
          daily: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            amount: Math.floor(Math.random() * 5000) + 1000
          })),
          monthly: [
            { month: 'Jan', amount: 15000 },
            { month: 'Feb', amount: 18000 },
            { month: 'Mar', amount: 22000 },
            { month: 'Apr', amount: 19000 },
            { month: 'May', amount: 25000 },
            { month: 'Jun', amount: 28000 }
          ],
          yearly: [
            { year: '2021', amount: 120000 },
            { year: '2022', amount: 150000 },
            { year: '2023', amount: 180000 },
            { year: '2024', amount: 125000 }
          ]
        },
        bookings: {
          status: [
            { status: 'completed', count: 280, percentage: 82 },
            { status: 'upcoming', count: 35, percentage: 10 },
            { status: 'cancelled', count: 27, percentage: 8 }
          ],
          monthly: [
            { month: 'Jan', count: 45 },
            { month: 'Feb', count: 52 },
            { month: 'Mar', count: 68 },
            { month: 'Apr', count: 58 },
            { month: 'May', count: 72 },
            { month: 'Jun', count: 78 }
          ],
          topCars: [
            { carId: '1', title: 'BMW 3 Series', bookings: 45, revenue: 18000 },
            { carId: '2', title: 'Mercedes A-Class', bookings: 38, revenue: 15200 },
            { carId: '3', title: 'Tesla Model 3', bookings: 32, revenue: 19200 },
            { carId: '4', title: 'Audi A4', bookings: 28, revenue: 14000 },
            { carId: '5', title: 'Volkswagen Golf', bookings: 25, revenue: 10000 }
          ]
        },
        users: {
          newUsers: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 10) + 1
          })),
          userTypes: [
            { type: 'renter', count: 1200, percentage: 65 },
            { type: 'owner', count: 450, percentage: 25 },
            { type: 'both', count: 180, percentage: 10 }
          ],
          topLocations: [
            { location: 'Casablanca', users: 320 },
            { location: 'Rabat', users: 280 },
            { location: 'Marrakech', users: 250 },
            { location: 'Fez', users: 180 },
            { location: 'Tangier', users: 150 }
          ]
        },
        performance: {
          pageViews: [
            { page: 'Home', views: 12500 },
            { page: 'Cars', views: 8900 },
            { page: 'Car Details', views: 5600 },
            { page: 'Booking', views: 2100 },
            { page: 'Dashboard', views: 1800 }
          ],
          conversionRate: 3.2,
          averageSessionDuration: 4.5,
          bounceRate: 28.5
        }
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load analytics data</p>
          <Button onClick={fetchAnalyticsData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Comprehensive insights into your platform performance</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getGrowthIcon(analyticsData.overview.revenueGrowth)}
                  <span className={`text-sm font-medium ${getGrowthColor(analyticsData.overview.revenueGrowth)}`}>
                    {analyticsData.overview.revenueGrowth > 0 ? '+' : ''}{analyticsData.overview.revenueGrowth}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.overview.totalBookings)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getGrowthIcon(analyticsData.overview.bookingGrowth)}
                  <span className={`text-sm font-medium ${getGrowthColor(analyticsData.overview.bookingGrowth)}`}>
                    {analyticsData.overview.bookingGrowth > 0 ? '+' : ''}{analyticsData.overview.bookingGrowth}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.averageRating}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getGrowthIcon(analyticsData.overview.ratingGrowth)}
                  <span className={`text-sm font-medium ${getGrowthColor(analyticsData.overview.ratingGrowth)}`}>
                    {analyticsData.overview.ratingGrowth > 0 ? '+' : ''}{analyticsData.overview.ratingGrowth}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Cars</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.activeCars}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getGrowthIcon(analyticsData.overview.carGrowth)}
                  <span className={`text-sm font-medium ${getGrowthColor(analyticsData.overview.carGrowth)}`}>
                    {analyticsData.overview.carGrowth > 0 ? '+' : ''}{analyticsData.overview.carGrowth}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <PoundSterling className="h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Cars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.bookings.topCars.map((car, index) => (
                      <div key={car.carId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-green-600">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{car.title}</p>
                            <p className="text-sm text-gray-600">{car.bookings} bookings</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(car.revenue)}</p>
                          <p className="text-sm text-gray-600">revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.bookings.status.map((status) => (
                      <div key={status.status} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={status.status === 'completed' ? 'default' : status.status === 'upcoming' ? 'secondary' : 'destructive'}>
                            {status.status}
                          </Badge>
                          <span className="text-sm text-gray-600">{status.count} bookings</span>
                        </div>
                        <span className="font-semibold">{status.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Revenue chart would be rendered here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Booking analytics chart would be rendered here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.users.userTypes.map((type) => (
                      <div key={type.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{type.type}</Badge>
                          <span className="text-sm text-gray-600">{formatNumber(type.count)} users</span>
                        </div>
                        <span className="font-semibold">{type.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.users.topLocations.map((location, index) => (
                      <div key={location.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{location.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatNumber(location.users)}</p>
                          <p className="text-sm text-gray-600">users</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.performance.conversionRate}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Avg Session Duration</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.performance.averageSessionDuration}m</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.performance.bounceRate}%</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.performance.pageViews.map((page) => (
                    <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">{page.page}</span>
                      </div>
                      <span className="font-semibold">{formatNumber(page.views)} views</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}











