import Stripe from 'stripe';
import { z } from 'zod';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

// Subscription plan schemas
export const subscriptionPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  period: z.enum(['month', 'year']),
  features: z.array(z.string()),
  stripePriceId: z.string().optional(),
  stripeProductId: z.string().optional(),
});

export const membershipTierSchema = z.enum(['basic', 'premium']);

export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;
export type MembershipTier = z.infer<typeof membershipTierSchema>;

// Subscription plans configuration
export const SUBSCRIPTION_PLANS: Record<MembershipTier, SubscriptionPlan> = {
  basic: {
    id: 'basic',
    name: 'Basic Member',
    price: 9.99,
    period: 'month',
    features: [
      '5% discount on all rentals',
      'Basic loyalty points (1 point per £1)',
      'Standard customer support',
      'Basic verification',
      'Access to member-only vehicles'
    ],
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID,
    stripeProductId: process.env.STRIPE_BASIC_PRODUCT_ID,
  },
  premium: {
    id: 'premium',
    name: 'Premium Member',
    price: 19.99,
    period: 'month',
    features: [
      '15% discount on all rentals',
      'Enhanced loyalty points (2 points per £1)',
      'Priority customer support',
      'Enhanced verification & insurance',
      'Access to luxury vehicles',
      'Free cancellation up to 24h',
      'Exclusive member events'
    ],
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    stripeProductId: process.env.STRIPE_PREMIUM_PRODUCT_ID,
  },
};

// Subscription service class
export class SubscriptionService {
  /**
   * Create a Stripe checkout session for subscription
   */
  static async createCheckoutSession(
    userId: string,
    planId: MembershipTier,
    successUrl: string,
    cancelUrl: string
  ) {
    const plan = SUBSCRIPTION_PLANS[planId];
    
    if (!plan.stripePriceId) {
      throw new Error(`Stripe price ID not configured for plan: ${planId}`);
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        planId,
      },
      customer_email: undefined, // Will be set by Stripe if user is not logged in
    });

    return session;
  }

  /**
   * Create a Stripe customer portal session
   */
  static async createPortalSession(customerId: string, returnUrl: string) {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  }

  /**
   * Get subscription details from Stripe
   */
  static async getSubscription(subscriptionId: string) {
    return await stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * Cancel a subscription
   */
  static async cancelSubscription(subscriptionId: string) {
    return await stripe.subscriptions.cancel(subscriptionId);
  }

  /**
   * Update subscription
   */
  static async updateSubscription(
    subscriptionId: string,
    newPriceId: string
  ) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    return await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });
  }

  /**
   * Calculate discount based on membership tier
   */
  static calculateDiscount(amount: number, tier: MembershipTier): number {
    const discountPercentage = tier === 'premium' ? 0.15 : 0.05;
    return Math.round(amount * discountPercentage * 100) / 100;
  }

  /**
   * Calculate loyalty points based on membership tier
   */
  static calculateLoyaltyPoints(amount: number, tier: MembershipTier): number {
    const pointsMultiplier = tier === 'premium' ? 2 : 1;
    return Math.floor(amount * pointsMultiplier);
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(payload: string, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  /**
   * Handle successful subscription creation
   */
  static async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    // This would typically update your database
    // with the new subscription information
    console.log('Subscription created:', subscription.id);
    
    // You would implement database updates here
    // await updateUserSubscription(subscription.metadata.userId, {
    //   subscriptionId: subscription.id,
    //   status: subscription.status,
    //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    //   planId: subscription.metadata.planId,
    // });
  }

  /**
   * Handle subscription updates
   */
  static async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    console.log('Subscription updated:', subscription.id);
    
    // Update subscription in database
    // await updateUserSubscription(subscription.metadata.userId, {
    //   subscriptionId: subscription.id,
    //   status: subscription.status,
    //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    // });
  }

  /**
   * Handle subscription cancellation
   */
  static async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    console.log('Subscription cancelled:', subscription.id);
    
    // Update subscription status in database
    // await updateUserSubscription(subscription.metadata.userId, {
    //   subscriptionId: subscription.id,
    //   status: 'cancelled',
    // });
  }
}

// Webhook event handlers
export const WEBHOOK_EVENT_HANDLERS = {
  'customer.subscription.created': SubscriptionService.handleSubscriptionCreated,
  'customer.subscription.updated': SubscriptionService.handleSubscriptionUpdated,
  'customer.subscription.deleted': SubscriptionService.handleSubscriptionDeleted,
} as const;

export type WebhookEventType = keyof typeof WEBHOOK_EVENT_HANDLERS;
