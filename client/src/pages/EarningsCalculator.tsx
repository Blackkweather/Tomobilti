import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  Calculator, 
  PoundSterling, 
  Calendar, 
  Car, 
  TrendingUp, 
  Info,
  Star,
  Shield,
  Clock,
  Users,
  MapPin,
  Fuel,
  Settings,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'wouter';

interface CalculatorInputs {
  carValue: number;
  dailyRate: number;
  utilizationRate: number; // percentage of days rented per month
  serviceFee: number; // platform fee percentage
  insuranceCost: number; // monthly insurance cost
  maintenanceCost: number; // monthly maintenance cost
}

interface CalculationResult {
  monthlyEarnings: number;
  yearlyEarnings: number;
  netMonthlyEarnings: number;
  netYearlyEarnings: number;
  utilizationDays: number;
  grossRevenue: number;
  platformFee: number;
  totalCosts: number;
  profitMargin: number;
}

interface EarningsCalculatorProps {
  config?: {
    defaultCarValue?: number;
    defaultDailyRate?: number;
    defaultUtilizationRate?: number;
    defaultServiceFee?: number;
    defaultInsuranceCost?: number;
    defaultMaintenanceCost?: number;
    platformName?: string;
    currency?: string;
    presetScenarios?: Array<{
      name: string;
      description: string;
      inputs: Partial<CalculatorInputs>;
    }>;
  };
}

export default function EarningsCalculator({ config = {} }: EarningsCalculatorProps) {
  // Default configuration
  const defaultConfig = {
    defaultCarValue: 15000,
    defaultDailyRate: 50,
    defaultUtilizationRate: 60,
    defaultServiceFee: 10,
    defaultInsuranceCost: 100,
    defaultMaintenanceCost: 50,
    platformName: 'ShareWheelz',
    currency: '£',
    presetScenarios: [
      {
        name: "Economy Car",
        description: "Small, fuel-efficient vehicle",
        inputs: { carValue: 12000, dailyRate: 35, utilizationRate: 70, serviceFee: 10, insuranceCost: 80, maintenanceCost: 40 }
      },
      {
        name: "Mid-Range Car",
        description: "Popular family vehicle",
        inputs: { carValue: 20000, dailyRate: 60, utilizationRate: 65, serviceFee: 10, insuranceCost: 120, maintenanceCost: 60 }
      },
      {
        name: "Luxury Car",
        description: "Premium vehicle",
        inputs: { carValue: 50000, dailyRate: 150, utilizationRate: 45, serviceFee: 10, insuranceCost: 200, maintenanceCost: 100 }
      },
      {
        name: "Electric Vehicle",
        description: "Modern EV with high demand",
        inputs: { carValue: 35000, dailyRate: 80, utilizationRate: 75, serviceFee: 10, insuranceCost: 150, maintenanceCost: 30 }
      }
    ]
  };

  const finalConfig = { ...defaultConfig, ...config };

  const [inputs, setInputs] = useState<CalculatorInputs>({
    carValue: finalConfig.defaultCarValue,
    dailyRate: finalConfig.defaultDailyRate,
    utilizationRate: finalConfig.defaultUtilizationRate,
    serviceFee: finalConfig.defaultServiceFee,
    insuranceCost: finalConfig.defaultInsuranceCost,
    maintenanceCost: finalConfig.defaultMaintenanceCost
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const calculateEarnings = () => {
    const { carValue, dailyRate, utilizationRate, serviceFee, insuranceCost, maintenanceCost } = inputs;
    
    // Calculate utilization days (assuming 30 days per month)
    const utilizationDays = Math.round((utilizationRate / 100) * 30);
    
    // Calculate gross revenue
    const grossRevenue = utilizationDays * dailyRate;
    
    // Calculate platform fee
    const platformFee = grossRevenue * (serviceFee / 100);
    
    // Calculate total costs
    const totalCosts = insuranceCost + maintenanceCost;
    
    // Calculate net earnings
    const monthlyEarnings = grossRevenue - platformFee - totalCosts;
    const yearlyEarnings = monthlyEarnings * 12;
    const netMonthlyEarnings = monthlyEarnings;
    const netYearlyEarnings = yearlyEarnings;
    
    // Calculate profit margin
    const profitMargin = grossRevenue > 0 ? ((monthlyEarnings / grossRevenue) * 100) : 0;

    setResult({
      monthlyEarnings,
      yearlyEarnings,
      netMonthlyEarnings,
      netYearlyEarnings,
      utilizationDays,
      grossRevenue,
      platformFee,
      totalCosts,
      profitMargin
    });
  };

  useEffect(() => {
    calculateEarnings();
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const applyPreset = (preset: typeof finalConfig.presetScenarios[0]) => {
    setInputs(prev => ({
      ...prev,
      ...preset.inputs
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Earnings Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your potential earnings from renting out your vehicle on {finalConfig.platformName}. 
            Get accurate estimates based on your car's value, location, and market demand.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Input */}
          <div className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2 text-blue-600" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preset Scenarios */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Quick Start Scenarios</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {finalConfig.presetScenarios.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(preset)}
                        className="text-left h-auto p-3"
                      >
                        <div>
                          <div className="font-medium text-sm">{preset.name}</div>
                          <div className="text-xs text-gray-500">{preset.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Basic Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="carValue">Car Value ({finalConfig.currency})</Label>
                    <Input
                      id="carValue"
                      type="number"
                      value={inputs.carValue}
                      onChange={(e) => handleInputChange('carValue', Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dailyRate">Daily Rate ({finalConfig.currency})</Label>
                    <Input
                      id="dailyRate"
                      type="number"
                      value={inputs.dailyRate}
                      onChange={(e) => handleInputChange('dailyRate', Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="utilizationRate">Utilization Rate (%)</Label>
                  <Input
                    id="utilizationRate"
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.utilizationRate}
                    onChange={(e) => handleInputChange('utilizationRate', Number(e.target.value))}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Percentage of days your car is rented per month
                  </p>
                </div>

                {/* Advanced Settings */}
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full justify-between"
                  >
                    <span>Advanced Settings</span>
                    <ArrowRight className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                  </Button>
                  
                  {showAdvanced && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="serviceFee">Platform Fee (%)</Label>
                          <Input
                            id="serviceFee"
                            type="number"
                            min="0"
                            max="20"
                            value={inputs.serviceFee}
                            onChange={(e) => handleInputChange('serviceFee', Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="insuranceCost">Insurance Cost ({finalConfig.currency}/month)</Label>
                          <Input
                            id="insuranceCost"
                            type="number"
                            value={inputs.insuranceCost}
                            onChange={(e) => handleInputChange('insuranceCost', Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="maintenanceCost">Maintenance Cost ({finalConfig.currency}/month)</Label>
                        <Input
                          id="maintenanceCost"
                          type="number"
                          value={inputs.maintenanceCost}
                          onChange={(e) => handleInputChange('maintenanceCost', Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2 text-green-600" />
                  Tips to Maximize Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">Set Competitive Prices</div>
                    <div className="text-xs text-gray-600">Research local market rates to optimize your pricing</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">High-Quality Photos</div>
                    <div className="text-xs text-gray-600">Professional photos increase booking rates by 40%</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">Maintain High Ratings</div>
                    <div className="text-xs text-gray-600">Excellent service leads to more repeat bookings</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">Flexible Availability</div>
                    <div className="text-xs text-gray-600">More availability = higher utilization rates</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Main Earnings Display */}
                <Card className="shadow-xl bg-gradient-to-br from-green-50 to-blue-50">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <div className="text-5xl font-bold text-green-600 mb-2">
                        {finalConfig.currency}{result.netMonthlyEarnings.toFixed(0)}
                      </div>
                      <div className="text-lg text-gray-600">Estimated Monthly Earnings</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{finalConfig.currency}{result.netYearlyEarnings.toFixed(0)}</div>
                        <div className="text-sm text-gray-600">Yearly Earnings</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{result.utilizationDays}</div>
                        <div className="text-sm text-gray-600">Days Rented/Month</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center mb-4">
                      <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {result.profitMargin.toFixed(1)}% Profit Margin
                      </span>
                    </div>

                    <Link href="/become-host">
                      <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                        <Car className="h-5 w-5 mr-2" />
                        Start Earning Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Detailed Breakdown */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PoundSterling className="h-5 w-5 mr-2 text-blue-600" />
                      {finalConfig.currency} Earnings Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Gross Revenue</span>
                        <span className="font-medium">{finalConfig.currency}{result.grossRevenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Platform Fee ({inputs.serviceFee}%)</span>
                        <span className="font-medium text-red-600">-{finalConfig.currency}{result.platformFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Insurance Cost</span>
                        <span className="font-medium text-red-600">-{finalConfig.currency}{inputs.insuranceCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Maintenance Cost</span>
                        <span className="font-medium text-red-600">-{finalConfig.currency}{inputs.maintenanceCost.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between items-center font-semibold text-lg">
                        <span>Net Monthly Earnings</span>
                        <span className="text-green-600">{finalConfig.currency}{result.netMonthlyEarnings.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Insights */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                      Market Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{inputs.utilizationRate}%</div>
                        <div className="text-sm text-gray-600">Utilization Rate</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {inputs.utilizationRate >= 70 ? 'Excellent' : 
                           inputs.utilizationRate >= 50 ? 'Good' : 'Could be improved'}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{finalConfig.currency}{inputs.dailyRate}</div>
                        <div className="text-sm text-gray-600">Daily Rate</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {inputs.dailyRate >= 80 ? 'Premium' : 
                           inputs.dailyRate >= 50 ? 'Competitive' : 'Budget-friendly'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm text-yellow-800">Optimization Tip</div>
                          <div className="text-xs text-yellow-700 mt-1">
                            {inputs.utilizationRate < 50 
                              ? 'Consider lowering your daily rate or improving your listing to increase bookings.'
                              : 'Your utilization rate looks good! Focus on maintaining quality service.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of car owners who are already earning with ShareWheelz
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/become-host">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Car className="h-5 w-5 mr-2" />
                    Become a Host
                  </Button>
                </Link>
                <Link href="/add-car">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    <PoundSterling className="h-5 w-5 mr-2" />
                    List Your Car
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
