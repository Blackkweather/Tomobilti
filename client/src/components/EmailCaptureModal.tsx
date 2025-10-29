import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Gift, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trackEmailCapture, trackEvent } from '@/lib/analytics';

interface EmailCaptureModalProps {
  source?: 'welcome_popup' | 'pricing_access' | 'brochure_download';
  title?: string;
  description?: string;
  onSuccess?: (discountCode: string) => void;
}

export default function EmailCaptureModal({ 
  source = 'welcome_popup',
  title = 'Get 10% Off Your First Booking!',
  description = 'Join thousands of happy drivers. Enter your email and receive an exclusive discount code.',
  onSuccess
}: EmailCaptureModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkText, setIsDarkText] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('EmailCaptureModal mounted');
    // Show email capture modal after 2 seconds
    const timer = setTimeout(() => {
      console.log('Opening email modal');
      setIsOpen(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const checkBackground = () => {
      const viewportHeight = window.innerHeight;
      
      // Check multiple points where the popup is positioned (bottom-left area)
      const checkPoints = [
        { x: 100, y: viewportHeight - 150 },
        { x: 150, y: viewportHeight - 200 },
        { x: 200, y: viewportHeight - 180 }
      ];
      
      let totalBrightness = 0;
      let validChecks = 0;
      
      for (const point of checkPoints) {
        const elementsAtPoint = document.elementsFromPoint(point.x, point.y);
        
        // Skip the popup itself and check elements behind it
        for (const element of elementsAtPoint) {
          const styles = window.getComputedStyle(element);
          const zIndex = styles.zIndex;
          
          // Skip the popup modal (z-index 9999) and other high z-index overlays
          if (zIndex && parseInt(zIndex) > 100) {
            continue;
          }
          
          // Skip fixed positioned elements (likely overlays)
          if (styles.position === 'fixed') {
            continue;
          }
          
          const bgColor = styles.backgroundColor;
          
          // Parse RGB values
          if (bgColor && bgColor.includes('rgb')) {
            const rgbMatch = bgColor.match(/\d+/g);
            if (rgbMatch && rgbMatch.length >= 3) {
              const [r, g, b, a] = rgbMatch.map(Number);
              
              // Skip fully transparent backgrounds
              if (a !== undefined && a === 0) continue;
              if (bgColor.includes('rgba') && rgbMatch.length >= 4 && rgbMatch[3] === '0') continue;
              
              // Calculate brightness
              const brightness = (r + g + b) / 3;
              totalBrightness += brightness;
              validChecks++;
              
              console.log('Background detected:', { bgColor, brightness, element: element.tagName });
              break; // Found a valid background, check next point
            }
          }
        }
      }
      
      // Determine if background is light or dark
      const avgBrightness = validChecks > 0 ? totalBrightness / validChecks : 0;
      const isLight = avgBrightness > 180; // Threshold for light background
      
      console.log('Average brightness:', avgBrightness, 'Is light:', isLight);
      setIsDarkText(isLight);
    };

    // Check on mount and scroll
    checkBackground();
    window.addEventListener('scroll', checkBackground);
    window.addEventListener('resize', checkBackground);
    
    return () => {
      window.removeEventListener('scroll', checkBackground);
      window.removeEventListener('resize', checkBackground);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? '' 
        : 'http://localhost:5000';
        
      const response = await fetch(`${baseUrl}/api/email-leads`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, source }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          // Try to parse as JSON
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || errorJson.message || `HTTP error! status: ${response.status}`);
        } catch (e) {
          // If parsing fails, use the raw text
          throw new Error(`Server error (${response.status}): ${errorText.slice(0, 100)}`);
        }
      }

      const data = await response.json();

      if (response.ok) {
        // Track successful email capture
        trackEmailCapture(source, data.discountCode);
        
        toast({
          title: '🎉 Success!',
          description: `Your discount code: ${data.discountCode}`,
        });
        
        // Store discount code
        localStorage.setItem('discountCode', data.discountCode);
        localStorage.setItem('emailCaptureCompleted', 'true');
        
        if (onSuccess) {
          onSuccess(data.discountCode);
        }
        
        setIsOpen(false);
      } else {
        toast({
          title: 'Error',
          description: data.error || data.message || 'Something went wrong',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Email capture error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    trackEvent('email_popup_closed', 'Lead Generation', source);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 md:left-6 lg:left-8 z-[9999] max-md:left-1/2 max-md:-translate-x-1/2 max-md:bottom-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden animate-in zoom-in-95 duration-700 transition-colors duration-300">
        <button
          onClick={handleClose}
          className={`absolute right-3 top-3 rounded-full p-1 transition-colors z-10 ${
            isDarkText ? 'hover:bg-black/20 text-black' : 'hover:bg-white/20 text-white'
          }`}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 text-center">
          <div className="mx-auto w-14 h-14 bg-black rounded-full flex items-center justify-center mb-3">
            <Gift className="w-7 h-7 text-white" />
          </div>
          <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
            isDarkText ? 'text-black' : 'text-white'
          }`}>
            {title}
          </h3>
          <p className={`text-sm mb-4 transition-colors duration-300 ${
            isDarkText ? 'text-gray-800' : 'text-white/90'
          }`}>
            {description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                isDarkText ? 'text-gray-600' : 'text-white/60'
              }`} />
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-9 text-sm bg-white/10 backdrop-blur-md border-white/20 transition-colors duration-300 ${
                  isDarkText 
                    ? 'text-black placeholder:text-gray-600' 
                    : 'text-white placeholder:text-white/60'
                }`}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800 text-white" 
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Get My 10% Discount'}
            </Button>

            <p className={`text-xs transition-colors duration-300 ${
              isDarkText ? 'text-gray-700' : 'text-white/60'
            }`}>
              By submitting, you agree to receive marketing emails. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
