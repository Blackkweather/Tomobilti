// Google Analytics 4 Integration

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || 'G-5VP1W713QM';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  // Load GA4 script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_path: window.location.pathname,
  });
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track email capture
export const trackEmailCapture = (source: string, discountCode: string) => {
  trackEvent('email_captured', 'Lead Generation', source);
  trackEvent('discount_code_generated', 'Conversion', discountCode);
};

// Track membership popup
export const trackMembershipPopup = (action: 'shown' | 'closed' | 'clicked') => {
  trackEvent(`membership_popup_${action}`, 'Engagement', 'Membership');
};

// Track section view (scroll tracking)
export const trackSectionView = (sectionName: string) => {
  trackEvent('section_viewed', 'Scroll Depth', sectionName);
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('button_click', 'Interaction', `${buttonName} - ${location}`);
};

// Track car card clicks
export const trackCarClick = (carId: string, carTitle: string) => {
  trackEvent('car_clicked', 'Product', carTitle, undefined);
};

// Track search
export const trackSearch = (searchTerm: string, filters: any) => {
  trackEvent('search', 'Search', searchTerm);
};

// Track booking started
export const trackBookingStarted = (carId: string, carTitle: string, price: number) => {
  trackEvent('booking_started', 'Conversion', carTitle, price);
};

// Track booking completed
export const trackBookingCompleted = (bookingId: string, totalAmount: number) => {
  trackEvent('purchase', 'Conversion', bookingId, totalAmount);
};
