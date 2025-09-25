import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');
  }
  return stripePromise;
};

export interface PaymentData {
  amount: number;
  currency: string;
  bookingId: string;
  customerEmail: string;
  customerName: string;
  carTitle: string;
}

export class StripeService {
  /**
   * Create payment intent and redirect to Stripe Checkout
   */
  static async processPayment(paymentData: PaymentData): Promise<{ success: boolean; error?: string }> {
    try {
      // Create payment intent on server
      const token = localStorage.getItem('auth_token');
      console.log('Payment token:', token ? `${token.substring(0, 20)}...` : 'No token');
      
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment creation failed');
      }

      const { clientSecret, paymentIntentId } = await response.json();

      // Check if Stripe is configured
      if (process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
        const stripe = await getStripe();
        if (!stripe) {
          throw new Error('Stripe not loaded');
        }

        // Confirm payment with Stripe
        const { error } = await stripe.confirmPayment({
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/booking-confirmation?bookingId=${paymentData.bookingId}`,
          },
        });

        if (error) {
          throw new Error(error.message);
        }
      } else {
        // For development mode without Stripe, simulate successful payment
        console.log('Development mode: Simulating successful payment');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      }

      return { success: true };
    } catch (error: any) {
      console.error('Payment processing failed:', error);
      return {
        success: false,
        error: error.message || 'Payment processing failed',
      };
    }
  }

  /**
   * Get payment status
   */
  static async getPaymentStatus(paymentIntentId: string): Promise<{ status: string; error?: string }> {
    try {
      const response = await fetch(`/api/payments/status/${paymentIntentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get payment status');
      }

      const data = await response.json();
      return { status: data.status };
    } catch (error: any) {
      console.error('Failed to get payment status:', error);
      return {
        status: 'unknown',
        error: error.message || 'Failed to get payment status',
      };
    }
  }
}

export default StripeService;
