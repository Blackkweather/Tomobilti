import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Car, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Wrench,
  Clock,
  Star
} from 'lucide-react';

interface VehicleSafetyProps {
  car: {
    vin?: string;
    registrationNumber?: string;
    motExpiry?: string;
    insuranceExpiry?: string;
    isInsured: boolean;
    insuranceProvider?: string;
    hasAirbags: boolean;
    hasAbs: boolean;
    hasEsp: boolean;
    hasBluetooth: boolean;
    hasGps: boolean;
    hasParkingSensors: boolean;
    hasAlarm: boolean;
    hasImmobilizer: boolean;
    hasTrackingDevice: boolean;
    mileage?: number;
    lastServiceDate?: string;
    nextServiceDue?: string;
    condition: string;
  };
}

export default function VehicleSafety({ car }: VehicleSafetyProps) {
  const [showDetails, setShowDetails] = useState(false);

  const safetyFeatures = [
    { name: 'Airbags', enabled: car.hasAirbags, required: true },
    { name: 'ABS Brakes', enabled: car.hasAbs, required: true },
    { name: 'ESP/Stability Control', enabled: car.hasEsp, required: false },
    { name: 'Bluetooth', enabled: car.hasBluetooth, required: false },
    { name: 'GPS Navigation', enabled: car.hasGps, required: false },
    { name: 'Parking Sensors', enabled: car.hasParkingSensors, required: false },
  ];

  const securityFeatures = [
    { name: 'Alarm System', enabled: car.hasAlarm, required: false },
    { name: 'Immobilizer', enabled: car.hasImmobilizer, required: false },
    { name: 'Tracking Device', enabled: car.hasTrackingDevice, required: false },
  ];

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'excellent': return <Star className="h-4 w-4" />;
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'fair': return <AlertTriangle className="h-4 w-4" />;
      case 'poor': return <XCircle className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  const isMotValid = car.motExpiry ? new Date(car.motExpiry) > new Date() : false;
  const isInsuranceValid = car.insuranceExpiry ? new Date(car.insuranceExpiry) > new Date() : false;
  const isServiceDue = car.nextServiceDue ? new Date(car.nextServiceDue) <= new Date() : false;

  const safetyScore = Math.round(
    (safetyFeatures.filter(f => f.enabled).length / safetyFeatures.length) * 50 +
    (securityFeatures.filter(f => f.enabled).length / securityFeatures.length) * 30 +
    (isMotValid ? 10 : 0) +
    (isInsuranceValid ? 10 : 0)
  );

  return (
    <div className="space-y-6">
      {/* Safety Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vehicle Safety & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Safety Score</span>
              <span className="text-2xl font-bold text-green-600">{safetyScore}%</span>
            </div>
            <Progress value={safetyScore} className="h-2" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Vehicle Condition</span>
              <Badge className={getConditionColor(car.condition)}>
                <span className="flex items-center gap-1">
                  {getConditionIcon(car.condition)}
                  {car.condition.charAt(0).toUpperCase() + car.condition.slice(1)}
                </span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Legal Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">MOT Certificate</span>
              <div className="flex items-center gap-2">
                {isMotValid ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <Badge variant={isMotValid ? "default" : "destructive"}>
                  {isMotValid ? "Valid" : "Expired"}
                </Badge>
              </div>
            </div>
            {car.motExpiry && (
              <p className="text-xs text-gray-500">
                Expires: {new Date(car.motExpiry).toLocaleDateString()}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm">Insurance</span>
              <div className="flex items-center gap-2">
                {isInsuranceValid ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <Badge variant={isInsuranceValid ? "default" : "destructive"}>
                  {isInsuranceValid ? "Valid" : "Expired"}
                </Badge>
              </div>
            </div>
            {car.insuranceExpiry && (
              <p className="text-xs text-gray-500">
                Expires: {new Date(car.insuranceExpiry).toLocaleDateString()}
              </p>
            )}
            {car.insuranceProvider && (
              <p className="text-xs text-gray-500">
                Provider: {car.insuranceProvider}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Safety Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Safety Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {safetyFeatures.map((feature) => (
              <div key={feature.name} className="flex items-center justify-between">
                <span className="text-sm">{feature.name}</span>
                <div className="flex items-center gap-1">
                  {feature.enabled ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  {feature.required && (
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {securityFeatures.map((feature) => (
              <div key={feature.name} className="flex items-center justify-between">
                <span className="text-sm">{feature.name}</span>
                <div className="flex items-center gap-1">
                  {feature.enabled ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {car.mileage && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Mileage</span>
                <span className="text-sm font-medium">{car.mileage.toLocaleString()} miles</span>
              </div>
            )}
            
            {car.lastServiceDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Service</span>
                <span className="text-sm font-medium">
                  {new Date(car.lastServiceDate).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {car.nextServiceDue && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Next Service Due</span>
                <div className="flex items-center gap-2">
                  {isServiceDue ? (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-green-600" />
                  )}
                  <span className={`text-sm font-medium ${isServiceDue ? 'text-red-600' : 'text-green-600'}`}>
                    {new Date(car.nextServiceDue).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
