import { Link } from 'wouter';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Car, 
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
  Heart,
  Award,
  Zap
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'How It Works', href: '/how-it-works' }
    ],
    services: [
      { label: 'Rent a Car', href: '/cars' },
      { label: 'Become a Member', href: '/become-member' },
      { label: 'Fleet Management', href: '/fleet' },
      { label: 'Business Solutions', href: '/business' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Safety Center', href: '/safety' },
      { label: 'Community Guidelines', href: '/guidelines' },
      { label: 'Report a Problem', href: '/report' }
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'GDPR Compliance', href: '/gdpr-compliance' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Insurance', href: '/insurance' },
      { label: 'Accessibility', href: '/accessibility' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const features = [
    { icon: Shield, text: '100% Secure' },
    { icon: Clock, text: '24/7 Support' },
    { icon: Star, text: 'Verified Owners' },
    { icon: Zap, text: 'Instant Booking' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Logo Section - Centered */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center">
            <img 
              src="/assets/MAIN LOGO.png?v=5" 
              alt="ShareWheelz" 
              className="h-60 w-96 hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Brand Description */}
        <div className="mb-8">
          <p className="text-gray-300 mb-6 leading-relaxed">
            The UK's premier peer-to-peer car rental platform. Connect with trusted car owners 
            and rent amazing vehicles for your next adventure.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <feature.icon className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation - Side by Side Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8 max-w-6xl mx-auto">
          
          {/* Company Section */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm leading-relaxed"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Section */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white mb-6">Services</h4>
            <ul className="space-y-4">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm leading-relaxed"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm leading-relaxed"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section - Bottom */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-3">Stay Updated</h4>
            <p className="text-gray-300 mb-6">Get the latest news and offers from ShareWheelz</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-semibold text-white mb-1">Headquarters</p>
                <p className="text-gray-300 text-sm">London, United Kingdom</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-semibold text-white mb-1">Phone</p>
                <p className="text-gray-300 text-sm">+44 20 1234 5678</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-semibold text-white mb-1">Email</p>
                <p className="text-gray-300 text-sm">contact@sharewheelz.uk</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <p className="text-gray-300 text-sm">
                © {currentYear} Share Wheelz. All rights reserved.
              </p>
              <div className="flex gap-4">
                {footerLinks.legal.slice(0, 2).map((link, index) => (
                  <Link 
                    key={index}
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm">Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
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
