import Stripe from 'stripe';
import { config } from 'dotenv';

config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

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
      const paymentIntent = await stripe.paymentIntents.create({
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
      console.error('Stripe payment intent creation failed:', error);
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
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
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
      const refund = await stripe.refunds.create({
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
      return await stripe.paymentMethods.retrieve(paymentMethodId);
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
      return await stripe.customers.create({
        email,
        name,
      });
    } catch (error: any) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  }
}

export default PaymentService;



