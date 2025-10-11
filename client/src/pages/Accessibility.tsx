import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

import { 
  Accessibility as AccessibilityIcon, 
  Eye, 
  Ear, 
  MousePointer, 
  Keyboard, 
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  Shield,
  Users,
  Phone,
  Mail,
  FileText
} from 'lucide-react';

export default function Accessibility() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: AccessibilityIcon },
    { id: 'features', title: 'Accessibility Features', icon: Settings },
    { id: 'standards', title: 'Standards & Compliance', icon: Shield },
    { id: 'assistive', title: 'Assistive Technologies', icon: MousePointer },
    { id: 'feedback', title: 'Feedback & Support', icon: Users }
  ];

  const accessibilityFeatures = [
    {
      category: 'Visual',
      icon: Eye,
      color: 'blue',
      features: [
        'High contrast mode available',
        'Text size can be increased up to 200%',
        'Alternative text for all images',
        'Color is not the only way to convey information',
        'Focus indicators are clearly visible'
      ]
    },
    {
      category: 'Auditory',
      icon: Ear,
      color: 'green',
      features: [
        'Audio content has text alternatives',
        'Visual alerts for important notifications',
        'Volume controls for media content',
        'Subtitles available for video content',
        'Audio descriptions where appropriate'
      ]
    },
    {
      category: 'Motor',
      icon: MousePointer,
      color: 'purple',
      features: [
        'Full keyboard navigation support',
        'Large clickable areas (minimum 44px)',
        'No time limits for form completion',
        'Skip links for main content',
        'Drag and drop alternatives available'
      ]
    },
    {
      category: 'Cognitive',
      icon: Keyboard,
      color: 'orange',
      features: [
        'Clear and simple language used',
        'Consistent navigation patterns',
        'Error messages are helpful and clear',
        'No flashing or blinking content',
        'Content is organized logically'
      ]
    }
  ];

  const standards = [
    {
      name: 'WCAG 2.1 AA',
      description: 'Web Content Accessibility Guidelines 2.1 Level AA',
      status: 'Compliant',
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'Section 508',
      description: 'US Federal accessibility requirements',
      status: 'Compliant',
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'ADA Compliance',
      description: 'Americans with Disabilities Act compliance',
      status: 'Compliant',
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'EN 301 549',
      description: 'European accessibility standard',
      status: 'In Progress',
      icon: AlertTriangle,
      color: 'yellow'
    }
  ];

  const assistiveTechnologies = [
    {
      name: 'Screen Readers',
      description: 'Compatible with popular screen readers',
      technologies: ['NVDA', 'JAWS', 'VoiceOver', 'TalkBack'],
      icon: Eye
    },
    {
      name: 'Voice Control',
      description: 'Supports voice navigation commands',
      technologies: ['Dragon NaturallySpeaking', 'Voice Control (iOS)', 'Voice Access (Android)'],
      icon: Ear
    },
    {
      name: 'Switch Navigation',
      description: 'Alternative input methods supported',
      technologies: ['Switch Control', 'Sip-and-puff devices', 'Eye tracking'],
      icon: MousePointer
    },
    {
      name: 'Mobile Accessibility',
      description: 'Optimized for mobile assistive technologies',
      technologies: ['VoiceOver (iOS)', 'TalkBack (Android)', 'Switch Control'],
      icon: Smartphone
    }
  ];

  const keyboardShortcuts = [
    { key: 'Tab', action: 'Navigate forward through interactive elements' },
    { key: 'Shift + Tab', action: 'Navigate backward through interactive elements' },
    { key: 'Enter', action: 'Activate buttons and links' },
    { key: 'Space', action: 'Activate buttons and checkboxes' },
    { key: 'Escape', action: 'Close modals and menus' },
    { key: 'Arrow Keys', action: 'Navigate within menus and lists' },
    { key: 'Home', action: 'Go to beginning of page' },
    { key: 'End', action: 'Go to end of page' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Accessibility
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We are committed to making Share Wheelz accessible to everyone. 
              Learn about our accessibility features and how we ensure an inclusive experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Report Accessibility Issue
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Accessibility Statement
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="py-8 bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className="flex items-center gap-2"
              >
                <section.icon className="w-4 h-4" />
                {section.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {activeSection === 'overview' && (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Our Accessibility Commitment
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Share Wheelz is committed to providing an accessible platform that works for everyone, 
                    regardless of ability or assistive technology used.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="p-8 text-center">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        WCAG 2.1 AA Compliant
                      </h3>
                      <p className="text-gray-600">
                        Our platform meets the highest international accessibility standards.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-8 text-center">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Inclusive Design
                      </h3>
                      <p className="text-gray-600">
                        We design with accessibility in mind from the ground up.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-8 text-center">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Settings className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Continuous Improvement
                      </h3>
                      <p className="text-gray-600">
                        We regularly test and improve our accessibility features.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === 'features' && (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Accessibility Features
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Discover the comprehensive accessibility features available on our platform.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {accessibilityFeatures.map((category, index) => (
                    <Card key={index} className="p-8">
                      <CardContent className="p-0">
                        <div className="flex items-center mb-6">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                            category.color === 'blue' ? 'bg-blue-100' :
                            category.color === 'green' ? 'bg-green-100' :
                            category.color === 'purple' ? 'bg-purple-100' :
                            category.color === 'orange' ? 'bg-orange-100' :
                            'bg-gray-100'
                          }`}>
                            <category.icon className={`w-6 h-6 ${
                              category.color === 'blue' ? 'text-blue-600' :
                              category.color === 'green' ? 'text-green-600' :
                              category.color === 'purple' ? 'text-purple-600' :
                              category.color === 'orange' ? 'text-orange-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {category.category} Accessibility
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {category.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'standards' && (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Standards & Compliance
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    We adhere to international accessibility standards and regulations.
                  </p>
                </div>

                <div className="space-y-6">
                  {standards.map((standard, index) => (
                    <Card key={index} className="p-6">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                              standard.color === 'green' ? 'bg-green-100' :
                              standard.color === 'yellow' ? 'bg-yellow-100' :
                              'bg-gray-100'
                            }`}>
                              <standard.icon className={`w-6 h-6 ${
                                standard.color === 'green' ? 'text-green-600' :
                                standard.color === 'yellow' ? 'text-yellow-600' :
                                'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {standard.name}
                              </h3>
                              <p className="text-gray-600">
                                {standard.description}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={standard.status === 'Compliant' ? 'default' : 'secondary'}
                            className={standard.status === 'Compliant' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                          >
                            {standard.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'assistive' && (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Assistive Technologies
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Our platform is compatible with a wide range of assistive technologies.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {assistiveTechnologies.map((tech, index) => (
                    <Card key={index} className="p-8">
                      <CardContent className="p-0">
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <tech.icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {tech.name}
                            </h3>
                            <p className="text-gray-600">
                              {tech.description}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Supported Technologies:</h4>
                          <div className="flex flex-wrap gap-2">
                            {tech.technologies.map((technology, techIndex) => (
                              <Badge key={techIndex} variant="outline">
                                {technology}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="p-8 bg-blue-50">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Keyboard Shortcuts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {keyboardShortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <kbd className="px-3 py-1 bg-gray-200 rounded text-sm font-mono">
                            {shortcut.key}
                          </kbd>
                          <span className="text-gray-700">{shortcut.action}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'feedback' && (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Feedback & Support
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    We value your feedback and are here to help with any accessibility concerns.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-8">
                    <CardContent className="p-0">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <Phone className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            Accessibility Support
                          </h3>
                          <p className="text-gray-600">
                            Dedicated support for accessibility issues
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <strong>Phone:</strong> +44 20 1234 5678
                        </div>
                        <div>
                          <strong>Email:</strong> admin@sharewheelz.uk
                        </div>
                        <div>
                          <strong>Hours:</strong> Monday-Friday, 9AM-6PM GMT
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-8">
                    <CardContent className="p-0">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            Report Issues
                          </h3>
                          <p className="text-gray-600">
                            Help us improve accessibility
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Button className="w-full">
                          Report Accessibility Issue
                        </Button>
                        <Button variant="outline" className="w-full">
                          Download Accessibility Statement
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="p-8 bg-yellow-50 border-yellow-200">
                  <CardContent className="p-0">
                    <div className="flex items-start">
                      <Info className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                          Accessibility Feedback
                        </h3>
                        <p className="text-yellow-700 mb-4">
                          We are committed to continuous improvement. If you encounter any accessibility 
                          barriers or have suggestions for improvement, please don't hesitate to contact us. 
                          We review all feedback and work to address issues promptly.
                        </p>
                        <div className="flex gap-4">
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Feedback
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Us
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
