import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}
