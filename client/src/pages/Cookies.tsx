import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { 
  Cookie, 
  Settings, 
  Shield, 
  BarChart3, 
  Users, 
  Target,
  CheckCircle,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function Cookies() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });

  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      required: true,
      icon: Shield,
      color: 'green',
      examples: [
        'Authentication cookies',
        'Security cookies',
        'Load balancing cookies',
        'User interface customization'
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      required: false,
      icon: BarChart3,
      color: 'blue',
      examples: [
        'Google Analytics',
        'Page view tracking',
        'User behavior analysis',
        'Performance monitoring'
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies are used to deliver relevant advertisements and marketing campaigns.',
      required: false,
      icon: Target,
      color: 'purple',
      examples: [
        'Advertising cookies',
        'Social media cookies',
        'Retargeting pixels',
        'Campaign tracking'
      ]
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization.',
      required: false,
      icon: Settings,
      color: 'orange',
      examples: [
        'Language preferences',
        'Location settings',
        'User preferences',
        'Third-party integrations'
      ]
    }
  ];

  const cookieDetails = [
    {
      name: '_ga',
      type: 'Analytics',
      purpose: 'Google Analytics - distinguishes users',
      duration: '2 years',
      domain: '.sharewheelz.com'
    },
    {
      name: '_gid',
      type: 'Analytics',
      purpose: 'Google Analytics - distinguishes users',
      duration: '24 hours',
      domain: '.sharewheelz.com'
    },
    {
      name: 'session_id',
      type: 'Essential',
      purpose: 'Maintains user session',
      duration: 'Session',
      domain: '.sharewheelz.com'
    },
    {
      name: 'user_preferences',
      type: 'Functional',
      purpose: 'Stores user preferences',
      duration: '1 year',
      domain: '.sharewheelz.com'
    },
    {
      name: 'marketing_consent',
      type: 'Marketing',
      purpose: 'Tracks marketing consent',
      duration: '1 year',
      domain: '.sharewheelz.com'
    }
  ];

  const handlePreferenceChange = (cookieType: string, enabled: boolean) => {
    if (cookieType === 'essential') return; // Can't disable essential cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [cookieType]: enabled
    }));
  };

  const handleSavePreferences = () => {
    // Save preferences to localStorage or send to server
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    alert('Cookie preferences saved successfully!');
  };

  const handleAcceptAll = () => {
    setCookiePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    });
    handleSavePreferences();
  };

  const handleRejectAll = () => {
    setCookiePreferences({
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    });
    handleSavePreferences();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Learn about how we use cookies and similar technologies to enhance your 
              experience on Share Wheelz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Manage Preferences
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Types */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Types of Cookies We Use
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We use different types of cookies to provide and improve our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cookieTypes.map((type) => (
              <Card key={type.id} className="p-8">
                <CardContent className="p-0">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        type.color === 'green' ? 'bg-green-100' :
                        type.color === 'blue' ? 'bg-blue-100' :
                        type.color === 'purple' ? 'bg-purple-100' :
                        type.color === 'orange' ? 'bg-orange-100' :
                        'bg-gray-100'
                      }`}>
                        <type.icon className={`w-6 h-6 ${
                          type.color === 'green' ? 'text-green-600' :
                          type.color === 'blue' ? 'text-blue-600' :
                          type.color === 'purple' ? 'text-purple-600' :
                          type.color === 'orange' ? 'text-orange-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {type.name}
                        </h3>
                        {type.required && (
                          <Badge variant="secondary" className="mt-1">
                            Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!type.required && (
                      <Switch
                        checked={cookiePreferences[type.id as keyof typeof cookiePreferences]}
                        onCheckedChange={(enabled) => handlePreferenceChange(type.id, enabled)}
                      />
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    {type.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Examples:</h4>
                    <ul className="space-y-2">
                      {type.examples.map((example, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Cookie Details Table */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cookie Details
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Detailed information about the specific cookies we use on our platform.
            </p>
          </div>

          <Card className="max-w-6xl mx-auto">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cookie Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Purpose</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Duration</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Domain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cookieDetails.map((cookie, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-900">{cookie.name}</td>
                        <td className="px-6 py-4 text-sm">
                          <Badge variant={cookie.type === 'Essential' ? 'default' : 'secondary'}>
                            {cookie.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{cookie.purpose}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{cookie.duration}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{cookie.domain}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cookie Preferences */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Manage Your Cookie Preferences
            </h2>
            
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="space-y-6">
                  {cookieTypes.map((type) => (
                    <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                          type.color === 'green' ? 'bg-green-100' :
                          type.color === 'blue' ? 'bg-blue-100' :
                          type.color === 'purple' ? 'bg-purple-100' :
                          type.color === 'orange' ? 'bg-orange-100' :
                          'bg-gray-100'
                        }`}>
                          <type.icon className={`w-5 h-5 ${
                            type.color === 'green' ? 'text-green-600' :
                            type.color === 'blue' ? 'text-blue-600' :
                            type.color === 'purple' ? 'text-purple-600' :
                            type.color === 'orange' ? 'text-orange-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{type.name}</h3>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {type.required ? (
                          <Badge variant="default">Required</Badge>
                        ) : (
                          <Switch
                            checked={cookiePreferences[type.id as keyof typeof cookiePreferences]}
                            onCheckedChange={(enabled) => handlePreferenceChange(type.id, enabled)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button onClick={handleSavePreferences} className="flex-1">
                    Save Preferences
                  </Button>
                  <Button onClick={handleAcceptAll} variant="outline" className="flex-1">
                    Accept All
                  </Button>
                  <Button onClick={handleRejectAll} variant="outline" className="flex-1">
                    Reject All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Info className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      How to Control Cookies
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Use our cookie preference center above</li>
                    <li>• Modify your browser settings</li>
                    <li>• Use browser extensions to block cookies</li>
                    <li>• Contact us for assistance</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Important Notes
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Essential cookies cannot be disabled</li>
                    <li>• Disabling cookies may affect functionality</li>
                    <li>• Preferences are stored locally</li>
                    <li>• You can change preferences anytime</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
