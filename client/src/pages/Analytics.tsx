import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  TrendingDown,
  PoundSterling,
  Calendar,
  Car,
  Star,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Download,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';


export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [useDateRange, setUseDateRange] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch owner's cars for analytics
  const { data: carsData, isLoading: carsLoading, error: carsError } = useQuery({
    queryKey: ['ownerCars', user?.id],
    queryFn: async () => {
      if (!user?.id) return { cars: [] };
      const response = await fetch(`/api/cars/owner/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch cars');
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Fetch owner's bookings for analytics
  const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ['ownerBookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return { bookings: [] };
      const response = await fetch(`/api/bookings/owner/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
    enabled: !!user?.id,
  });

  const cars = carsData?.cars || [];
  const bookings = bookingsData?.bookings || [];
  
  // Calculate real analytics from actual data
  const calculateRealAnalytics = () => {
    // If no data, return empty analytics
    if (cars.length === 0 && bookings.length === 0) {
      return {
        earnings: { total: 0, thisMonth: 0, lastMonth: 0, growth: 0 },
        bookings: { total: 0, thisMonth: 0, lastMonth: 0, growth: 0 },
        cars: { total: 0, active: 0, maintenance: 0, averageRating: 0 },
        occupancy: { average: 0, bestPerformer: 'No data', worstPerformer: 'No data' },
        monthlyData: [],
        topPerformers: []
      };
    }
    
    const totalEarnings = bookings.reduce((sum: any, booking: any) => sum + (parseFloat(booking.totalAmount) || 0), 0);
    const totalBookings = bookings.length;
    const averageRating = cars.length > 0 ? cars.reduce((sum: any, car: any) => sum + (car.rating || 0), 0) / cars.length : 0;
    
    // Calculate this month's data
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthBookings = bookings.filter((booking: any) => {
      const bookingDate = new Date(booking.startDate);
      return bookingDate >= thisMonthStart;
    });
    const thisMonthEarnings = thisMonthBookings.reduce((sum: any, booking: any) => sum + (parseFloat(booking.totalAmount) || 0), 0);
    
    // Calculate last month's data
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthBookings = bookings.filter((booking: any) => {
      const bookingDate = new Date(booking.startDate);
      return bookingDate >= lastMonthStart && bookingDate <= lastMonthEnd;
    });
    const lastMonthEarnings = lastMonthBookings.reduce((sum: any, booking: any) => sum + (parseFloat(booking.totalAmount) || 0), 0);
    
    // Calculate growth percentages
    const earningsGrowth = lastMonthEarnings > 0 ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100 : 0;
    const bookingsGrowth = lastMonthBookings.length > 0 ? ((thisMonthBookings.length - lastMonthBookings.length) / lastMonthBookings.length) * 100 : 0;
    
    // Calculate occupancy rate (simplified)
    const averageOccupancy = cars.length > 0 ? cars.reduce((sum: any, car: any) => {
      const carBookings = bookings.filter((b: any) => b.carId === car.id);
      const totalDays = carBookings.reduce((sum: any, booking: any) => {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }, 0);
      return sum + Math.min((totalDays / 30) * 100, 100); // Assume 30 days per month
    }, 0) / cars.length : 0;
    
    // Calculate top performers
    const topPerformers = cars.map((car: any) => {
      const carBookings = bookings.filter((b: any) => b.carId === car.id);
      const carEarnings = carBookings.reduce((sum: any, booking: any) => sum + (parseFloat(booking.totalAmount) || 0), 0);
      return {
        car: car.title || `${car.make} ${car.model}`,
        earnings: carEarnings,
        bookings: carBookings.length,
        rating: car.rating || 0
      };
    }).sort((a: any, b: any) => b.earnings - a.earnings);
    
    // Generate monthly data for the last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthBookings = bookings.filter((booking: any) => {
        const bookingDate = new Date(booking.startDate);
        return bookingDate >= monthDate && bookingDate <= monthEnd;
      });
      const monthEarnings = monthBookings.reduce((sum: any, booking: any) => sum + (parseFloat(booking.totalAmount) || 0), 0);
      
      monthlyData.push({
        month: monthDate.toLocaleDateString('en-GB', { month: 'short' }),
        earnings: monthEarnings,
        bookings: monthBookings.length
      });
    }
    
    return {
      earnings: {
        total: totalEarnings,
        thisMonth: thisMonthEarnings,
        lastMonth: lastMonthEarnings,
        growth: earningsGrowth
      },
      bookings: {
        total: totalBookings,
        thisMonth: thisMonthBookings.length,
        lastMonth: lastMonthBookings.length,
        growth: bookingsGrowth
      },
      cars: {
        total: cars.length,
        active: cars.filter((car: any) => car.status === 'available').length,
        maintenance: cars.filter((car: any) => car.status === 'maintenance').length,
        averageRating: averageRating
      },
      occupancy: {
        average: averageOccupancy,
        bestPerformer: topPerformers[0]?.car || 'No data',
        worstPerformer: topPerformers[topPerformers.length - 1]?.car || 'No data'
      },
      monthlyData,
      topPerformers: topPerformers.slice(0, 3)
    };
  };

  const analytics = calculateRealAnalytics();
  const isLoading = carsLoading || bookingsLoading;
  const error = carsError || bookingsError;

  const handleBack = () => {
    setLocation('/owner-dashboard');
  };

  const generateCSV = () => {
    const analytics = calculateRealAnalytics();
    const rows = [
      ['Metric', 'Value'],
      ['Total Earnings', `£${analytics.earnings.total.toFixed(2)}`],
      ['This Month Earnings', `£${analytics.earnings.thisMonth.toFixed(2)}`],
      ['Total Bookings', analytics.bookings.total.toString()],
      ['This Month Bookings', analytics.bookings.thisMonth.toString()],
      ['Active Cars', analytics.cars.active.toString()],
      ['Average Rating', analytics.cars.averageRating.toFixed(2)],
    ];
    return rows.map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mauve-50 via-white to-bleu-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mauve-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mauve-50 via-white to-bleu-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <XCircle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Analytics</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Show message if no data
  if (cars.length === 0 && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mauve-50 via-white to-bleu-50">
        <div className="container mx-auto p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBack}
                variant="outline"
                size="sm"
                className="hover-elevate"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-mauve-600 to-bleu-600 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">Detailed insights into your car rental business</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="p-6 bg-gradient-to-r from-mauve-100 to-bleu-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <BarChart3 className="h-12 w-12 text-mauve-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">No Data Available Yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Start by adding some vehicles to your fleet and getting bookings to see your analytics here.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setLocation('/add-car')} className="bg-gradient-to-r from-mauve-500 to-bleu-500 hover:from-mauve-600 hover:to-bleu-600">
                  <Car className="h-4 w-4 mr-2" />
                  Add Your First Vehicle
                </Button>
                <Button onClick={handleBack} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mauve-50 via-white to-bleu-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="hover-elevate"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-mauve-600 to-bleu-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">Detailed insights into your car rental business</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const csv = generateCSV();
                downloadCSV(csv, 'analytics-export.csv');
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.print();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Period Selection with Date Range Picker */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={selectedPeriod === '1month' ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedPeriod('1month');
                    setUseDateRange(false);
                  }}
                  className="hover-elevate"
                >
                  1 Month
                </Button>
                <Button
                  variant={selectedPeriod === '3months' ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedPeriod('3months');
                    setUseDateRange(false);
                  }}
                  className="hover-elevate"
                >
                  3 Months
                </Button>
                <Button
                  variant={selectedPeriod === '6months' ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedPeriod('6months');
                    setUseDateRange(false);
                  }}
                  className="hover-elevate"
                >
                  6 Months
                </Button>
                <Button
                  variant={selectedPeriod === '1year' ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedPeriod('1year');
                    setUseDateRange(false);
                  }}
                  className="hover-elevate"
                >
                  1 Year
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useDateRange"
                  checked={useDateRange}
                  onChange={(e) => {
                    setUseDateRange(e.target.checked);
                    if (e.target.checked) setSelectedPeriod('');
                  }}
                  className="w-4 h-4"
                />
                <Label htmlFor="useDateRange" className="cursor-pointer">Custom Date Range</Label>
              </div>
            </div>
            {useDateRange && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <PoundSterling className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Total Earnings</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    £{analytics.earnings.total.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">+{analytics.earnings.growth}%</span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
            </div>
                    <span className="text-sm text-muted-foreground">Total Bookings</span>
          </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.bookings.total}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowUpRight className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-600 font-medium">+{analytics.bookings.growth}%</span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Car className="h-5 w-5 text-purple-600" />
            </div>
                    <span className="text-sm text-muted-foreground">Active Vehicles</span>
          </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.cars.active}/{analytics.cars.total}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="text-purple-600 font-medium">{analytics.occupancy.average}%</span>
                    <span className="text-muted-foreground">avg occupancy</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full">
                  <Car className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Star className="h-5 w-5 text-amber-600" />
            </div>
                    <span className="text-sm text-muted-foreground">Average Rating</span>
          </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.cars.averageRating}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-600 font-medium">Excellent</span>
                    <span className="text-muted-foreground">performance</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mauve-500 data-[state=active]:to-bleu-500 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mauve-500 data-[state=active]:to-bleu-500 data-[state=active]:text-white">
              <PoundSterling className="h-4 w-4 mr-2" />
              Earnings
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mauve-500 data-[state=active]:to-bleu-500 data-[state=active]:text-white">
              <Car className="h-4 w-4 mr-2" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mauve-500 data-[state=active]:to-bleu-500 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Earnings Chart */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-mauve-600" />
                    Monthly Earnings Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
            <div className="space-y-3">
                    {analytics.monthlyData.map((month, index) => (
                      <div key={month.month} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{month.month}</span>
                          <span className="font-semibold text-green-600">£{month.earnings.toLocaleString()}</span>
                        </div>
                        <Progress value={(month.earnings / Math.max(...analytics.monthlyData.map(m => m.earnings))) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-bleu-600" />
                    Top Performing Vehicles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.topPerformers.map((vehicle, index) => (
                    <div key={vehicle.car} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-mauve-500 to-bleu-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{vehicle.car}</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-sm text-muted-foreground">{vehicle.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">£{vehicle.earnings.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.bookings} bookings</p>
                  </div>
                </div>
              ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg bg-green-50">
                    <PoundSterling className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">£{analytics.earnings.thisMonth.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">This Month</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50">
                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">£{analytics.earnings.lastMonth.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Last Month</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50">
                    <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">+{analytics.earnings.growth}%</p>
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Vehicle Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Average Occupancy Rate</span>
                    <span className="font-semibold">{analytics.occupancy.average}%</span>
          </div>
                  <Progress value={analytics.occupancy.average} className="h-3" />
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 rounded-lg bg-green-50">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-green-600">{analytics.occupancy.bestPerformer}</p>
                      <p className="text-sm text-muted-foreground">Best Performer</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-orange-50">
                      <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-orange-600">{analytics.occupancy.worstPerformer}</p>
                      <p className="text-sm text-muted-foreground">Needs Attention</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Booking Trends</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">This Month</span>
                        <span className="font-semibold">{analytics.bookings.thisMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Month</span>
                        <span className="font-semibold">{analytics.bookings.lastMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Growth</span>
                        <span className="font-semibold text-green-600">+{analytics.bookings.growth}%</span>
            </div>
          </div>
        </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Customer Satisfaction</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Average Rating</span>
                        <span className="font-semibold">{analytics.cars.averageRating}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Reviews</span>
                        <span className="font-semibold">{analytics.bookings.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <span className="font-semibold text-green-600">Excellent</span>
                      </div>
                    </div>
          </div>
        </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
