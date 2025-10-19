import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Car, MapPin, Info, Zap, Award, CarFront, Wind } from 'lucide-react';

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
    icon: 'Car'
  },
  {
    id: 'compact',
    name: 'Compact Cars',
    category: 'Compact',
    dailyRate: 35,
    weeklyRate: 210,
    monthlyRate: 700,
    description: 'Mid-size cars like Ford Focus, VW Golf',
    icon: 'Car'
  },
  {
    id: 'intermediate',
    name: 'Intermediate Cars',
    category: 'Intermediate',
    dailyRate: 45,
    weeklyRate: 270,
    monthlyRate: 900,
    description: 'Larger sedans like BMW 3 Series, Audi A4',
    icon: 'Car'
  },
  {
    id: 'luxury',
    name: 'Luxury Cars',
    category: 'Luxury',
    dailyRate: 80,
    weeklyRate: 480,
    monthlyRate: 1600,
    description: 'Premium vehicles like BMW 5 Series, Mercedes E-Class',
    icon: 'Award'
  },
  {
    id: 'suv',
    name: 'SUV/Crossovers',
    category: 'SUV',
    dailyRate: 60,
    weeklyRate: 360,
    monthlyRate: 1200,
    description: 'SUVs like Range Rover Evoque, BMW X3',
    icon: 'CarFront'
  },
  {
    id: 'convertible',
    name: 'Convertibles',
    category: 'Convertible',
    dailyRate: 70,
    weeklyRate: 420,
    monthlyRate: 1400,
    description: 'Convertible cars like BMW Z4, Audi TT',
    icon: 'Wind'
  },
  {
    id: 'electric',
    name: 'Electric Vehicles',
    category: 'Electric',
    dailyRate: 55,
    weeklyRate: 330,
    monthlyRate: 1100,
    description: 'EVs like Tesla Model 3, Nissan Leaf',
    icon: 'Zap'
  },
  {
    id: 'sports',
    name: 'Sports Cars',
    category: 'Sports',
    dailyRate: 120,
    weeklyRate: 720,
    monthlyRate: 2400,
    description: 'High-performance cars like Porsche 911, Ferrari',
    icon: 'TrendingUp'
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
    const weeklyRate = dailyRate * 7 * 0.85;
    const monthlyRate = dailyRate * 30 * 0.8;
    
    const utilization = utilizationRate / 100;
    
    const dailyEarnings = dailyRate * utilization;
    const weeklyEarnings = weeklyRate * utilization;
    const monthlyEarnings = monthlyRate * utilization;
    const yearlyEarnings = monthlyEarnings * 12;
    
    const platformFee = yearlyEarnings * 0.15;
    const insuranceCost = yearlyEarnings * 0.08;
    const maintenanceCost = yearlyEarnings * 0.12;
    
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Earnings Calculator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Calculate your potential earnings from renting out your vehicle in the UK</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-600" />
                Vehicle Selection
              </h2>
              
              <div className="space-y-3">
                {vehicleTypes.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all shadow-sm hover:shadow-md ${
                      selectedVehicle.id === vehicle.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedVehicle.id === vehicle.id ? 'bg-blue-500' : 'bg-blue-100'
                      }`}>
                        {vehicle.icon === 'Car' && <Car className={`h-6 w-6 ${selectedVehicle.id === vehicle.id ? 'text-white' : 'text-blue-600'}`} />}
                        {vehicle.icon === 'Award' && <Award className={`h-6 w-6 ${selectedVehicle.id === vehicle.id ? 'text-white' : 'text-blue-600'}`} />}
                        {vehicle.icon === 'CarFront' && <CarFront className={`h-6 w-6 ${selectedVehicle.id === vehicle.id ? 'text-white' : 'text-blue-600'}`} />}
                        {vehicle.icon === 'Wind' && <Wind className={`h-6 w-6 ${selectedVehicle.id === vehicle.id ? 'text-white' : 'text-blue-600'}`} />}
                        {vehicle.icon === 'Zap' && <Zap className={`h-6 w-6 ${selectedVehicle.id === vehicle.id ? 'text-white' : 'text-blue-600'}`} />}
                        {vehicle.icon === 'TrendingUp' && <TrendingUp className={`h-6 w-6 ${selectedVehicle.id === vehicle.id ? 'text-white' : 'text-blue-600'}`} />}
                      </div>
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
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Location
              </h2>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                {ukCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
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

          <div className="lg:col-span-2">
            {calculation && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
                  <h2 className="text-2xl font-bold mb-6">Projected Annual Earnings</h2>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-200">
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

                  <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-red-200">
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

                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-200">
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
    </div>
  );
}
