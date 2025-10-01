import Stripe from 'stripe';
import { config } from 'dotenv';

config();

// Check if Stripe is configured
const isStripeConfigured = process.env.STRIPE_SECRET_KEY && 
  process.env.STRIPE_SECRET_KEY.startsWith('sk_');

// Initialize Stripe or Mock Payment Service
let stripe: Stripe | null = null;
let mockPaymentService: any = null;

if (isStripeConfigured) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  });
  console.log('💳 Stripe payment service initialized');
} else {
  // Use mock payment service
  mockPaymentService = {
    paymentIntents: {
      create: async (params: any) => {
        const paymentIntentId = `pi_mock_${Math.random().toString(36).substr(2, 9)}`;
        console.log(`💳 Mock Payment Intent Created: ${paymentIntentId} - £${params.amount / 100}`);
        return {
          id: paymentIntentId,
          amount: params.amount,
          currency: params.currency,
          status: 'requires_payment_method',
          client_secret: `${paymentIntentId}_secret_${Math.random().toString(36).substr(2, 9)}`,
          metadata: params.metadata
        };
      },
      confirm: async (id: string, params: any) => {
        console.log(`✅ Mock Payment Confirmed: ${id}`);
        return {
          id,
          status: 'succeeded',
          payment_method: params.payment_method || 'card_mock'
        };
      },
      retrieve: async (id: string) => {
        console.log(`🔍 Mock Payment Retrieved: ${id}`);
        return {
          id,
          status: 'succeeded',
          amount: 10000, // £100
          currency: 'gbp'
        };
      }
    },
    subscriptions: {
      create: async (params: any) => {
        const subscriptionId = `sub_mock_${Math.random().toString(36).substr(2, 9)}`;
        console.log(`🔄 Mock Subscription Created: ${subscriptionId}`);
        return {
          id: subscriptionId,
          customer: params.customer,
          status: 'active',
          current_period_start: Math.floor(Date.now() / 1000),
          current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
          items: {
            data: [{
              id: `si_mock_${Math.random().toString(36).substr(2, 9)}`,
              price: {
                id: params.items[0].price,
                unit_amount: params.items[0].price.includes('basic') ? 999 : 1999,
                currency: 'gbp'
              }
            }]
          },
          metadata: params.metadata
        };
      },
      retrieve: async (id: string) => {
        console.log(`🔍 Mock Subscription Retrieved: ${id}`);
        return {
          id,
          status: 'active',
          current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
        };
      },
      cancel: async (id: string) => {
        console.log(`❌ Mock Subscription Canceled: ${id}`);
        return {
          id,
          status: 'canceled',
          canceled_at: Math.floor(Date.now() / 1000)
        };
      }
    },
    customers: {
      create: async (params: any) => {
        const customerId = `cus_mock_${Math.random().toString(36).substr(2, 9)}`;
        console.log(`👤 Mock Customer Created: ${customerId} - ${params.email}`);
        return {
          id: customerId,
          email: params.email,
          name: params.name,
          metadata: params.metadata,
          created: Math.floor(Date.now() / 1000)
        };
      }
    },
    refunds: {
      create: async (params: any) => {
        console.log(`💰 Mock Refund Created: ${params.payment_intent}`);
        return {
          id: `re_mock_${Math.random().toString(36).substr(2, 9)}`,
          payment_intent: params.payment_intent,
          amount: params.amount || 10000,
          status: 'succeeded'
        };
      }
    },
    paymentMethods: {
      retrieve: async (id: string) => {
        console.log(`🔍 Mock Payment Method Retrieved: ${id}`);
        return {
          id,
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025
          }
        };
      }
    },
    paypal: {
      createPayment: async (params: any) => {
        const paymentId = `paypal_${Math.random().toString(36).substr(2, 9)}`;
        console.log(`🔵 PayPal Payment Created: ${paymentId} - £${params.amount / 100}`);
        return {
          id: paymentId,
          amount: params.amount,
          currency: params.currency,
          status: 'created',
          approval_url: `https://www.paypal.com/paypalme/sharewheelz/${params.amount / 100}`,
          metadata: params.metadata
        };
      },
      executePayment: async (paymentId: string, payerId: string) => {
        console.log(`✅ PayPal Payment Executed: ${paymentId} - Payer: ${payerId}`);
        return {
          id: paymentId,
          state: 'approved',
          payer: {
            payer_info: {
              payer_id: payerId,
              email: 'user@example.com'
            }
          }
        };
      }
    },
    applePay: {
      createSession: async (params: any) => {
        const sessionId = `apple_${Math.random().toString(36).substr(2, 9)}`;
        console.log(`🍎 Apple Pay Session Created: ${sessionId} - £${params.amount / 100}`);
        return {
          id: sessionId,
          amount: params.amount,
          currency: params.currency,
          status: 'ready'
        };
      }
    },
           samsungPay: {
             createSession: async (params: any) => {
               const sessionId = `samsung_${Math.random().toString(36).substr(2, 9)}`;
               console.log(`📱 Samsung Pay Session Created: ${sessionId} - £${params.amount / 100}`);
               return {
                 id: sessionId,
                 amount: params.amount,
                 currency: params.currency,
                 status: 'ready'
               };
             }
           }
  };
  console.log('🎭 Mock payment service initialized (Stripe not configured)');
}

export interface PaymentIntentData {
  amount: number;
  currency: string;
  bookingId: string;
  customerEmail: string;
  customerName: string;
  carTitle: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  clientSecret?: string;
  error?: string;
}

export class PaymentService {
  /**
   * Create a payment intent for a booking
   */
  static async createPaymentIntent(data: PaymentIntentData): Promise<PaymentResult> {
    try {
      const paymentService = stripe || mockPaymentService;
      
      const paymentIntent = await paymentService.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency.toLowerCase(),
        metadata: {
          bookingId: data.bookingId,
          customerEmail: data.customerEmail,
          carTitle: data.carTitle,
        },
        description: `Payment for ${data.carTitle} booking`,
        receipt_email: data.customerEmail,
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error: any) {
      console.error('Payment intent creation failed:', error);
      return {
        success: false,
        error: error.message || 'Payment processing failed',
      };
    }
  }

  /**
   * Confirm a payment intent
   */
  static async confirmPaymentIntent(paymentIntentId: string): Promise<PaymentResult> {
    try {
      const paymentService = stripe || mockPaymentService;
      const paymentIntent = await paymentService.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentIntentId: paymentIntent.id,
        };
      }

      return {
        success: false,
        error: `Payment not completed. Status: ${paymentIntent.status}`,
      };
    } catch (error: any) {
      console.error('Payment confirmation failed:', error);
      return {
        success: false,
        error: error.message || 'Payment confirmation failed',
      };
    }
  }

  /**
   * Refund a payment
   */
  static async refundPayment(paymentIntentId: string, amount?: number): Promise<PaymentResult> {
    try {
      const paymentService = stripe || mockPaymentService;
      const refund = await paymentService.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
      });

      return {
        success: true,
        paymentIntentId: refund.payment_intent as string,
      };
    } catch (error: any) {
      console.error('Refund failed:', error);
      return {
        success: false,
        error: error.message || 'Refund failed',
      };
    }
  }

  /**
   * Get payment method details
   */
  static async getPaymentMethod(paymentMethodId: string) {
    try {
      const paymentService = stripe || mockPaymentService;
      return await paymentService.paymentMethods.retrieve(paymentMethodId);
    } catch (error: any) {
      console.error('Failed to retrieve payment method:', error);
      throw error;
    }
  }

  /**
   * Create a customer
   */
  static async createCustomer(email: string, name: string) {
    try {
      const paymentService = stripe || mockPaymentService;
      return await paymentService.customers.create({
        email,
        name,
      });
    } catch (error: any) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  }

  /**
   * Create PayPal payment
   */
  static async createPayPalPayment(data: PaymentIntentData): Promise<PaymentResult> {
    try {
      const paymentService = stripe || mockPaymentService;
      
      if (mockPaymentService && paymentService === mockPaymentService) {
        const paypalPayment = await paymentService.paypal.createPayment({
          amount: Math.round(data.amount * 100),
          currency: data.currency.toLowerCase(),
          metadata: {
            bookingId: data.bookingId,
            customerEmail: data.customerEmail,
            carTitle: data.carTitle,
          }
        });

        return {
          success: true,
          paymentIntentId: paypalPayment.id,
          clientSecret: paypalPayment.approval_url,
        };
      }

      // Real PayPal integration would go here
      throw new Error('PayPal integration not implemented for Stripe mode');
      
    } catch (error: any) {
      console.error('PayPal payment creation failed:', error);
      return {
        success: false,
        error: error.message || 'PayPal payment failed',
      };
    }
  }

  /**
   * Execute PayPal payment
   */
  static async executePayPalPayment(paymentId: string, payerId: string): Promise<PaymentResult> {
    try {
      const paymentService = stripe || mockPaymentService;
      
      if (mockPaymentService && paymentService === mockPaymentService) {
        const result = await paymentService.paypal.executePayment(paymentId, payerId);
        
        return {
          success: true,
          paymentIntentId: result.id,
        };
      }

      // Real PayPal integration would go here
      throw new Error('PayPal integration not implemented for Stripe mode');
      
    } catch (error: any) {
      console.error('PayPal payment execution failed:', error);
      return {
        success: false,
        error: error.message || 'PayPal payment execution failed',
      };
    }
  }

  /**
   * Create Apple Pay session
   */
  static async createApplePaySession(data: PaymentIntentData): Promise<PaymentResult> {
    try {
      const paymentService = stripe || mockPaymentService;
      
      if (mockPaymentService && paymentService === mockPaymentService) {
        const session = await paymentService.applePay.createSession({
          amount: Math.round(data.amount * 100),
          currency: data.currency.toLowerCase(),
          metadata: {
            bookingId: data.bookingId,
            customerEmail: data.customerEmail,
            carTitle: data.carTitle,
          }
        });

        return {
          success: true,
          paymentIntentId: session.id,
        };
      }

      // Real Apple Pay integration would go here
      throw new Error('Apple Pay integration not implemented for Stripe mode');
      
    } catch (error: any) {
      console.error('Apple Pay session creation failed:', error);
      return {
        success: false,
        error: error.message || 'Apple Pay session creation failed',
      };
    }
  }

  /**
   * Create Samsung Pay session
   */
  static async createSamsungPaySession(data: PaymentIntentData): Promise<PaymentResult> {
    try {
      const paymentService = stripe || mockPaymentService;
      
      if (mockPaymentService && paymentService === mockPaymentService) {
        const session = await paymentService.samsungPay.createSession({
          amount: Math.round(data.amount * 100),
          currency: data.currency.toLowerCase(),
          metadata: {
            bookingId: data.bookingId,
            customerEmail: data.customerEmail,
            carTitle: data.carTitle,
          }
        });

        return {
          success: true,
          paymentIntentId: session.id,
        };
      }

      // Real Samsung Pay integration would go here
      throw new Error('Samsung Pay integration not implemented for Stripe mode');
      
    } catch (error: any) {
      console.error('Samsung Pay session creation failed:', error);
      return {
        success: false,
        error: error.message || 'Samsung Pay session creation failed',
      };
    }
  }
}

export default PaymentService;





