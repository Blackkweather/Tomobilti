import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle, 
  Phone, 
  Mail, 
  Clock,
  Shield,
  FileText,
  Camera,
  User,
  Car,
  CreditCard,
  MessageCircle
} from 'lucide-react';
import Footer from '../components/Footer';

export default function Report() {
  const [formData, setFormData] = useState({
    type: '',
    urgency: '',
    subject: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    relatedBooking: '',
    evidence: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const reportTypes = [
    {
      id: 'safety',
      title: 'Safety Concern',
      description: 'Report unsafe behavior or conditions',
      icon: Shield,
      color: 'red'
    },
    {
      id: 'fraud',
      title: 'Fraud or Scam',
      description: 'Report suspicious or fraudulent activity',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      id: 'harassment',
      title: 'Harassment',
      description: 'Report inappropriate or abusive behavior',
      icon: User,
      color: 'orange'
    },
    {
      id: 'vehicle',
      title: 'Vehicle Issue',
      description: 'Report problems with vehicle condition or safety',
      icon: Car,
      color: 'yellow'
    },
    {
      id: 'payment',
      title: 'Payment Problem',
      description: 'Report issues with billing or payments',
      icon: CreditCard,
      color: 'blue'
    },
    {
      id: 'technical',
      title: 'Technical Issue',
      description: 'Report bugs or technical problems',
      icon: FileText,
      color: 'purple'
    },
    {
      id: 'other',
      title: 'Other',
      description: 'Report any other issue not listed above',
      icon: MessageCircle,
      color: 'gray'
    }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Can wait 24-48 hours', color: 'green' },
    { value: 'medium', label: 'Medium - Needs attention within 24 hours', color: 'yellow' },
    { value: 'high', label: 'High - Urgent, needs immediate attention', color: 'orange' },
    { value: 'critical', label: 'Critical - Emergency situation', color: 'red' }
  ];

  const emergencyContacts = [
    {
      type: 'Emergency Support',
      number: '+44 20 1234 5678',
      description: 'For immediate safety concerns',
      available: '24/7'
    },
    {
      type: 'Safety Hotline',
      number: '+44 20 1234 5680',
      description: 'Report safety violations',
      available: '24/7'
    },
    {
      type: 'General Support',
      number: '+44 20 1234 5679',
      description: 'Non-emergency issues',
      available: 'Mon-Fri 9AM-6PM'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        type: '',
        urgency: '',
        subject: '',
        description: '',
        contactEmail: '',
        contactPhone: '',
        relatedBooking: '',
        evidence: ''
      });
      setSubmitStatus('idle');
    }, 3000);
  };

  const selectedType = reportTypes.find(type => type.id === formData.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Report a Problem
            </h1>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Help us maintain a safe and trustworthy community by reporting any issues 
              or concerns you encounter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
                Emergency: +44 20 1234 5678
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Live Chat Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {contact.type}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {contact.number}
                  </p>
                  <p className="text-gray-600 mb-3">
                    {contact.description}
                  </p>
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    {contact.available}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Would You Like to Report?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the type of issue you're experiencing to help us route your report appropriately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reportTypes.map((type) => (
              <Card 
                key={type.id} 
                className={`p-6 cursor-pointer transition-all duration-300 ${
                  formData.type === type.id 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => handleInputChange('type', type.id)}
              >
                <CardContent className="p-0 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    type.color === 'red' ? 'bg-red-100' :
                    type.color === 'orange' ? 'bg-orange-100' :
                    type.color === 'yellow' ? 'bg-yellow-100' :
                    type.color === 'blue' ? 'bg-blue-100' :
                    type.color === 'purple' ? 'bg-purple-100' :
                    'bg-gray-100'
                  }`}>
                    <type.icon className={`w-8 h-8 ${
                      type.color === 'red' ? 'text-red-600' :
                      type.color === 'orange' ? 'text-orange-600' :
                      type.color === 'yellow' ? 'text-yellow-600' :
                      type.color === 'blue' ? 'text-blue-600' :
                      type.color === 'purple' ? 'text-purple-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Report Form */}
          {formData.type && (
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-center mb-8">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    selectedType?.color === 'red' ? 'bg-red-100' :
                    selectedType?.color === 'orange' ? 'bg-orange-100' :
                    selectedType?.color === 'yellow' ? 'bg-yellow-100' :
                    selectedType?.color === 'blue' ? 'bg-blue-100' :
                    selectedType?.color === 'purple' ? 'bg-purple-100' :
                    'bg-gray-100'
                  }`}>
                    <selectedType?.icon className={`w-6 h-6 ${
                      selectedType?.color === 'red' ? 'text-red-600' :
                      selectedType?.color === 'orange' ? 'text-orange-600' :
                      selectedType?.color === 'yellow' ? 'text-yellow-600' :
                      selectedType?.color === 'blue' ? 'text-blue-600' :
                      selectedType?.color === 'purple' ? 'text-purple-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Report: {selectedType?.title}
                    </h3>
                    <p className="text-gray-600">
                      {selectedType?.description}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="urgency" className="text-gray-700 font-medium">
                        Urgency Level *
                      </Label>
                      <Select
                        value={formData.urgency}
                        onValueChange={(value) => handleInputChange('urgency', value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                        <SelectContent>
                          {urgencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full bg-${level.color}-500 mr-3`}></div>
                                {level.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="relatedBooking" className="text-gray-700 font-medium">
                        Related Booking ID (Optional)
                      </Label>
                      <Input
                        id="relatedBooking"
                        type="text"
                        value={formData.relatedBooking}
                        onChange={(e) => handleInputChange('relatedBooking', e.target.value)}
                        className="mt-2"
                        placeholder="e.g., BOOK-123456"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-gray-700 font-medium">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="mt-2"
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-700 font-medium">
                      Detailed Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="mt-2 min-h-[150px]"
                      placeholder="Please provide as much detail as possible about the issue, including dates, times, and any relevant information..."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="evidence" className="text-gray-700 font-medium">
                      Evidence or Additional Information
                    </Label>
                    <Textarea
                      id="evidence"
                      value={formData.evidence}
                      onChange={(e) => handleInputChange('evidence', e.target.value)}
                      className="mt-2 min-h-[100px]"
                      placeholder="Screenshots, photos, or other evidence (describe what you have)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="contactEmail" className="text-gray-700 font-medium">
                        Contact Email *
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPhone" className="text-gray-700 font-medium">
                        Contact Phone (Optional)
                      </Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        className="mt-2"
                        placeholder="+44 20 1234 5678"
                      />
                    </div>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <span>Report submitted successfully! We'll investigate and get back to you soon.</span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                      <AlertTriangle className="w-5 h-5" />
                      <span>There was an error submitting your report. Please try again.</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Submitting Report...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.location.href = 'tel:+442012345678'}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Emergency
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
