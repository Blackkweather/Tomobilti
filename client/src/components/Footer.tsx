import { Link } from 'wouter';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Zap
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      icon: Shield,
      iconText: '100% Secure',
      iconDesc: 'Bank-level security',
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' }
      ]
    },
    {
      icon: Clock,
      iconText: '24/7 Support',
      iconDesc: 'Always here to help',
      title: 'Services',
      links: [
        { label: 'Rent a Car', href: '/cars' },
        { label: 'Become a Member', href: '/become-member' },
        { label: 'Fleet Management', href: '/fleet' },
        { label: 'Business Solutions', href: '/business' }
      ]
    },
    {
      icon: Star,
      iconText: 'Verified Owners',
      iconDesc: 'Trusted community',
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Safety Center', href: '/safety' },
        { label: 'Community Guidelines', href: '/guidelines' },
        { label: 'Report a Problem', href: '/report' },
        { label: 'FAQ', href: '/faq' }
      ]
    },
    {
      icon: Zap,
      iconText: 'Instant Booking',
      iconDesc: 'Book in seconds',
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/terms-of-service' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'GDPR Compliance', href: '/gdpr-compliance' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Insurance', href: '/insurance' },
        { label: 'Accessibility', href: '/accessibility' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-300' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-500' }
  ];

  return (
    <footer className="bg-gradient-to-br from-[#0a1440] via-[#1a237e] to-[#0a1440] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-4">
            <img 
              src="/assets/MAIN LOGO.png?v=5" 
              alt="ShareWheelz" 
              className="h-32 w-auto hover:scale-105 transition-transform duration-300 object-contain mx-auto"
            />
          </Link>
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            The UK's Premier Car Sharing Platform
          </h3>
          <p className="text-gray-300 text-base max-w-2xl mx-auto">
            Connect with trusted car owners and rent amazing vehicles for your next adventure.
          </p>
        </div>

        {/* Aligned Grid: Icons + Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 max-w-6xl mx-auto">
          {footerSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Icon Section */}
                <div className="mb-8 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform duration-300 mx-auto">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-white text-base mb-1 text-center">{section.iconText}</h4>
                  <p className="text-gray-400 text-sm text-center">{section.iconDesc}</p>
                </div>

                {/* Links Section - Centered under icon */}
                <div className="w-full flex flex-col items-center">
                  <h4 className="text-lg font-semibold text-white mb-4 text-center">
                    {section.title}
                  </h4>
                  <ul className="space-y-2 flex flex-col items-center">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link 
                          href={link.href}
                          className="text-gray-300 hover:text-white hover:underline transition-all duration-200 text-sm text-center"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 mb-12 border border-purple-500/30 shadow-lg shadow-purple-500/20 max-w-2xl mx-auto">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-3">Stay in the Loop</h4>
            <p className="text-gray-300 mb-6">Get exclusive deals, new features, and community updates.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20 flex-1"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <p className="text-gray-400 text-xs mt-3">No spam, unsubscribe at any time.</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-white mb-1">Headquarters</p>
                <p className="text-gray-300 text-sm">London, United Kingdom</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-white mb-1">Phone Support</p>
                <p className="text-gray-300 text-sm">+44 20 1234 5678</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-white mb-1">Email Support</p>
                <p className="text-gray-300 text-sm">contact@sharewheelz.uk</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-gray-300 text-sm">
                © {currentYear} ShareWheelz. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="/gdpr-compliance" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                  GDPR Compliance
                </Link>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm font-medium">Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-200 ${social.color} group`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
