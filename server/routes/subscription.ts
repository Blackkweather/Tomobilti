import { Router } from 'express';
import { SubscriptionService, SUBSCRIPTION_PLANS, WEBHOOK_EVENT_HANDLERS } from '../services/subscription';
import { z } from 'zod';

const router = Router();

// Schema for subscription creation
const createSubscriptionSchema = z.object({
  planId: z.enum(['basic', 'premium']),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

// Get available subscription plans
router.get('/plans', async (req, res) => {
  try {
    res.json({
      success: true,
      plans: SUBSCRIPTION_PLANS,
    });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription plans',
    });
  }
});

// Create checkout session for subscription
router.post('/checkout', async (req, res) => {
  try {
    const { planId, successUrl, cancelUrl } = createSubscriptionSchema.parse(req.body);
    
    // Get user ID from session/auth middleware
    const userId = req.user?.id || 'anonymous';
    
    const session = await SubscriptionService.createCheckoutSession(
      userId,
      planId,
      successUrl,
      cancelUrl
    );

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
    });
  }
});

// Create customer portal session
router.post('/portal', async (req, res) => {
  try {
    const { customerId, returnUrl } = z.object({
      customerId: z.string(),
      returnUrl: z.string().url(),
    }).parse(req.body);

    const session = await SubscriptionService.createPortalSession(
      customerId,
      returnUrl
    );

    res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating portal session:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create portal session',
    });
  }
});

// Get subscription details
router.get('/:subscriptionId', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    
    const subscription = await SubscriptionService.getSubscription(subscriptionId);
    
    res.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        planId: subscription.metadata.planId,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
    });
  }
});

// Cancel subscription
router.post('/:subscriptionId/cancel', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    
    const subscription = await SubscriptionService.cancelSubscription(subscriptionId);
    
    res.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        canceledAt: subscription.canceled_at,
      },
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
    });
  }
});

// Update subscription
router.post('/:subscriptionId/update', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { newPriceId } = z.object({
      newPriceId: z.string(),
    }).parse(req.body);
    
    const subscription = await SubscriptionService.updateSubscription(
      subscriptionId,
      newPriceId
    );
    
    res.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
      },
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update subscription',
    });
  }
});

// Stripe webhook endpoint
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const payload = JSON.stringify(req.body);

    const event = SubscriptionService.verifyWebhookSignature(payload, signature);
    
    const handler = WEBHOOK_EVENT_HANDLERS[event.type as keyof typeof WEBHOOK_EVENT_HANDLERS];
    
    if (handler) {
      await handler(event.data.object as any);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      message: 'Webhook signature verification failed',
    });
  }
});

export default router;
