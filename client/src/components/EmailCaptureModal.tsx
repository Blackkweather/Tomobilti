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
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden animate-in zoom-in-95 duration-700">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-full p-1 hover:bg-white/20 transition-colors z-10"
        >
          <X className="h-4 w-4 text-white" />
        </button>

        <div className="p-6 text-center">
          <div className="mx-auto w-14 h-14 bg-black rounded-full flex items-center justify-center mb-3">
            <Gift className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-white/90 mb-4">
            {description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-sm bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60"
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

            <p className="text-xs text-white/60">
              By submitting, you agree to receive marketing emails. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
