import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Lock,
  Clock,
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Activity
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login' | 'payment' | 'booking' | 'profile_update' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  location?: string;
  ipAddress?: string;
  device?: string;
  resolved: boolean;
  action?: string;
}

interface FraudDetectionProps {
  userId: string;
  onSecurityAlert: (alert: SecurityEvent) => void;
}

export default function FraudDetection({ userId, onSecurityAlert }: FraudDetectionProps) {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [riskScore, setRiskScore] = useState(15); // 0-100, lower is better
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    // Simulate security monitoring
    const interval = setInterval(() => {
      // Simulate random security events
      if (Math.random() < 0.1) { // 10% chance of event
        const newEvent: SecurityEvent = {
          id: `event_${Date.now()}`,
          type: ['login', 'payment', 'booking', 'profile_update', 'suspicious_activity'][Math.floor(Math.random() * 5)] as any,
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          description: generateEventDescription(),
          timestamp: new Date().toISOString(),
          location: 'London, UK',
          ipAddress: '192.168.1.100',
          device: 'Chrome on Windows',
          resolved: false
        };
        
        setSecurityEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
        onSecurityAlert(newEvent);
        
        // Update risk score based on event
        if (newEvent.severity === 'high') {
          setRiskScore(prev => Math.min(100, prev + 10));
        } else if (newEvent.severity === 'medium') {
          setRiskScore(prev => Math.min(100, prev + 5));
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [onSecurityAlert]);

  const generateEventDescription = () => {
    const descriptions = [
      'Multiple failed login attempts detected',
      'Payment transaction from new device',
      'Booking request from unusual location',
      'Profile information updated',
      'Suspicious activity pattern detected',
      'New device login detected',
      'High-value transaction initiated',
      'Account accessed from multiple locations',
      'Unusual booking pattern detected',
      'Payment method changed'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'High Risk', color: 'text-red-600 bg-red-100' };
    if (score >= 60) return { level: 'Medium Risk', color: 'text-orange-600 bg-orange-100' };
    if (score >= 40) return { level: 'Low Risk', color: 'text-yellow-600 bg-yellow-100' };
    return { level: 'Very Low Risk', color: 'text-green-600 bg-green-100' };
  };

  const resolveEvent = (eventId: string) => {
    setSecurityEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, resolved: true, action: 'Resolved by user' }
          : event
      )
    );
    setRiskScore(prev => Math.max(0, prev - 5));
  };

  const riskLevel = getRiskLevel(riskScore);

  return (
    <div className="space-y-6">
      {/* Risk Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Risk Score</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{riskScore}</span>
                <Badge className={riskLevel.color}>
                  {riskLevel.level}
                </Badge>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  riskScore >= 80 ? 'bg-red-500' :
                  riskScore >= 60 ? 'bg-orange-500' :
                  riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Monitoring Status</span>
              <div className="flex items-center gap-2">
                {isMonitoring ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span>Paused</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Features Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-600" />
                <span className="text-sm">Fraud Detection</span>
              </div>
              <Badge variant="default" className="bg-green-600">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                <span className="text-sm">Payment Monitoring</span>
              </div>
              <Badge variant="default" className="bg-green-600">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm">Location Tracking</span>
              </div>
              <Badge variant="default" className="bg-green-600">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                <span className="text-sm">Behavior Analysis</span>
              </div>
              <Badge variant="default" className="bg-green-600">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityEvents.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear</h3>
                <p className="text-gray-600">No security events detected</p>
              </div>
            ) : (
              securityEvents.map((event) => (
                <div 
                  key={event.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    event.resolved ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
                  }`}
                >
                  <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                    {getSeverityIcon(event.severity)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{event.description}</span>
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity.toUpperCase()}
                      </Badge>
                      {event.resolved && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Resolved
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        )}
                        {event.ipAddress && (
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {event.ipAddress}
                          </span>
                        )}
                      </div>
                      {event.device && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {event.device}
                        </div>
                      )}
                    </div>
                    
                    {event.action && (
                      <div className="text-xs text-green-600 mt-1">
                        Action: {event.action}
                      </div>
                    )}
                  </div>
                  
                  {!event.resolved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveEvent(event.id)}
                      className="text-xs"
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskScore >= 60 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">High Risk Detected</h4>
                  <p className="text-sm text-orange-700">
                    Consider enabling two-factor authentication and reviewing recent account activity.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Keep Your Account Secure</h4>
                <p className="text-sm text-blue-700">
                  Regularly update your password and enable login notifications for better security.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Fraud Protection Active</h4>
                <p className="text-sm text-green-700">
                  Our AI-powered fraud detection system is monitoring your account 24/7.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
