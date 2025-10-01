import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Car, Calendar, MapPin, Info } from 'lucide-react';

interface VehicleType {
  id: string;
  name: string;
  category: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  description: string;
  icon: string;
}

interface CalculationResult {
  dailyEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  yearlyEarnings: number;
  utilizationRate: number;
  netEarnings: number;
  platformFee: number;
  insuranceCost: number;
  maintenanceCost: number;
}

const vehicleTypes: VehicleType[] = [
  {
    id: 'economy',
    name: 'Economy Cars',
    category: 'Economy',
    dailyRate: 25,
    weeklyRate: 150,
    monthlyRate: 500,
    description: 'Small, fuel-efficient cars like Ford Fiesta, Vauxhall Corsa',
    icon: '🚗'
  },
  {
    id: 'compact',
    name: 'Compact Cars',
    category: 'Compact',
    dailyRate: 35,
    weeklyRate: 210,
    monthlyRate: 700,
    description: 'Mid-size cars like Ford Focus, VW Golf',
    icon: '🚙'
  },
  {
    id: 'intermediate',
    name: 'Intermediate Cars',
    category: 'Intermediate',
    dailyRate: 45,
    weeklyRate: 270,
    monthlyRate: 900,
    description: 'Larger sedans like BMW 3 Series, Audi A4',
    icon: '🚘'
  },
  {
    id: 'luxury',
    name: 'Luxury Cars',
    category: 'Luxury',
    dailyRate: 80,
    weeklyRate: 480,
    monthlyRate: 1600,
    description: 'Premium vehicles like BMW 5 Series, Mercedes E-Class',
    icon: '🏎️'
  },
  {
    id: 'suv',
    name: 'SUV/Crossovers',
    category: 'SUV',
    dailyRate: 60,
    weeklyRate: 360,
    monthlyRate: 1200,
    description: 'SUVs like Range Rover Evoque, BMW X3',
    icon: '🚙'
  },
  {
    id: 'convertible',
    name: 'Convertibles',
    category: 'Convertible',
    dailyRate: 70,
    weeklyRate: 420,
    monthlyRate: 1400,
    description: 'Convertible cars like BMW Z4, Audi TT',
    icon: '🚗'
  },
  {
    id: 'electric',
    name: 'Electric Vehicles',
    category: 'Electric',
    dailyRate: 55,
    weeklyRate: 330,
    monthlyRate: 1100,
    description: 'EVs like Tesla Model 3, Nissan Leaf',
    icon: '⚡'
  },
  {
    id: 'sports',
    name: 'Sports Cars',
    category: 'Sports',
    dailyRate: 120,
    weeklyRate: 720,
    monthlyRate: 2400,
    description: 'High-performance cars like Porsche 911, Ferrari',
    icon: '🏁'
  }
];

const ukCities = [
  'London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield',
  'Bristol', 'Edinburgh', 'Glasgow', 'Newcastle', 'Nottingham', 'Leicester',
  'Coventry', 'Bradford', 'Cardiff', 'Belfast', 'Brighton', 'Plymouth',
  'Southampton', 'Norwich', 'Swindon', 'Huddersfield', 'York', 'Ipswich',
  'Blackpool', 'Middlesbrough', 'Bolton', 'Reading', 'Preston', 'Newport'
];

export default function EarningsCalculator() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(vehicleTypes[0]);
  const [location, setLocation] = useState('London');
  const [utilizationRate, setUtilizationRate] = useState(70);
  const [customRate, setCustomRate] = useState('');
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);

  const calculateEarnings = (): CalculationResult => {
    const dailyRate = useCustomRate ? parseFloat(customRate) || 0 : selectedVehicle.dailyRate;
    const weeklyRate = dailyRate * 7 * 0.85; // 15% discount for weekly
    const monthlyRate = dailyRate * 30 * 0.8; // 20% discount for monthly
    
    const utilization = utilizationRate / 100;
    
    // Calculate gross earnings
    const dailyEarnings = dailyRate * utilization;
    const weeklyEarnings = weeklyRate * utilization;
    const monthlyEarnings = monthlyRate * utilization;
    const yearlyEarnings = monthlyEarnings * 12;
    
    // Calculate costs
    const platformFee = yearlyEarnings * 0.15; // 15% platform fee
    const insuranceCost = yearlyEarnings * 0.08; // 8% for insurance
    const maintenanceCost = yearlyEarnings * 0.12; // 12% for maintenance
    
    const netEarnings = yearlyEarnings - platformFee - insuranceCost - maintenanceCost;
    
    return {
      dailyEarnings,
      weeklyEarnings,
      monthlyEarnings,
      yearlyEarnings,
      utilizationRate: utilizationRate,
      netEarnings,
      platformFee,
      insuranceCost,
      maintenanceCost
    };
  };

  useEffect(() => {
    setCalculation(calculateEarnings());
  }, [selectedVehicle, location, utilizationRate, customRate, useCustomRate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-8">
        <Calculator className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">UK Car Rental Earning Calculator</h1>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              Vehicle Selection
            </h2>
            
            <div className="space-y-3">
              {vehicleTypes.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    selectedVehicle.id === vehicle.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{vehicle.icon}</span>
                        <div>
                      <div className="font-medium">{vehicle.name}</div>
                      <div className="text-sm text-gray-600">{vehicle.description}</div>
                      <div className="text-sm font-semibold text-blue-600">
                        {formatCurrency(vehicle.dailyRate)}/day
                      </div>
                        </div>
                  </div>
                </button>
              ))}
                </div>

            <div className="mt-4 pt-4 border-t">
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={useCustomRate}
                  onChange={(e) => setUseCustomRate(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium">Use custom daily rate</span>
              </label>
              {useCustomRate && (
                <input
                      type="number"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  placeholder="Enter daily rate in £"
                  className="w-full p-2 border rounded-lg"
                />
              )}
                  </div>
                </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Location
            </h2>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              {ukCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Utilization Rate
            </h2>
            <div className="space-y-3">
              <input
                type="range"
                min="10"
                    max="100"
                value={utilizationRate}
                onChange={(e) => setUtilizationRate(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600">{utilizationRate}%</span>
                <div className="text-sm text-gray-600">
                  {utilizationRate < 30 && 'Low demand area'}
                  {utilizationRate >= 30 && utilizationRate < 60 && 'Moderate demand'}
                  {utilizationRate >= 60 && utilizationRate < 80 && 'High demand area'}
                  {utilizationRate >= 80 && 'Very high demand (city center)'}
                </div>
                        </div>
                      </div>
                      </div>
                    </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {calculation && (
            <div className="space-y-6">
              {/* Main Earnings Display */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Projected Annual Earnings</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{formatCurrency(calculation.yearlyEarnings)}</div>
                    <div className="text-blue-200">Gross Annual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{formatCurrency(calculation.netEarnings)}</div>
                    <div className="text-blue-200">Net Annual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{formatCurrency(calculation.monthlyEarnings)}</div>
                    <div className="text-blue-200">Monthly</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{formatCurrency(calculation.weeklyEarnings)}</div>
                    <div className="text-blue-200">Weekly</div>
                  </div>
                </div>
          </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Revenue Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Daily Rate:</span>
                      <span className="font-semibold">{formatCurrency(useCustomRate ? parseFloat(customRate) || 0 : selectedVehicle.dailyRate)}</span>
                      </div>
                    <div className="flex justify-between">
                      <span>Utilization:</span>
                      <span className="font-semibold">{calculation.utilizationRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Earnings:</span>
                      <span className="font-semibold">{formatCurrency(calculation.dailyEarnings)}</span>
                      </div>
                    <div className="flex justify-between">
                      <span>Weekly Earnings:</span>
                      <span className="font-semibold">{formatCurrency(calculation.weeklyEarnings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Earnings:</span>
                      <span className="font-semibold">{formatCurrency(calculation.monthlyEarnings)}</span>
                    </div>
                  </div>
                      </div>

                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">Cost Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Platform Fee (15%):</span>
                      <span className="font-semibold">{formatCurrency(calculation.platformFee)}</span>
                      </div>
                    <div className="flex justify-between">
                      <span>Insurance (8%):</span>
                      <span className="font-semibold">{formatCurrency(calculation.insuranceCost)}</span>
                      </div>
                    <div className="flex justify-between">
                      <span>Maintenance (12%):</span>
                      <span className="font-semibold">{formatCurrency(calculation.maintenanceCost)}</span>
                      </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total Costs:</span>
                        <span>{formatCurrency(calculation.platformFee + calculation.insuranceCost + calculation.maintenanceCost)}</span>
                      </div>
                    </div>
                        </div>
                      </div>
                    </div>
                    
              {/* Tips and Information */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Tips to Maximize Earnings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Location Strategy:</h4>
                    <ul className="space-y-1 text-blue-600">
                      <li>• City centers have higher demand</li>
                      <li>• Near airports and train stations</li>
                      <li>• Tourist areas during peak season</li>
                      <li>• Business districts for weekday rentals</li>
                    </ul>
                  </div>
                        <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Vehicle Optimization:</h4>
                    <ul className="space-y-1 text-blue-600">
                      <li>• Keep vehicle clean and well-maintained</li>
                      <li>• Competitive pricing vs market rates</li>
                      <li>• Good photos and detailed descriptions</li>
                      <li>• Respond quickly to booking requests</li>
                    </ul>
                          </div>
                        </div>
                      </div>
                    </div>
          )}
        </div>
      </div>
    </div>
  );
}