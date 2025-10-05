#!/usr/bin/env node

/**
 * Mock Payment System for ShareWheelz
 * 
 * This provides a free alternative to Stripe for development and testing
 * until you get your Stripe account set up.
 */

const express = require('express');
const crypto = require('crypto');

class MockPaymentService {
  constructor() {
    this.payments = new Map();
    this.subscriptions = new Map();
  }

  // Mock payment processing
  async createPaymentIntent(amount, currency = 'GBP', metadata = {}) {
    const paymentIntentId = `pi_mock_${crypto.randomBytes(16).toString('hex')}`;
    
    const paymentIntent = {
      id: paymentIntentId,
      amount: Math.round(amount * 100), // Convert to pence
      currency: currency.toLowerCase(),
      status: 'requires_payment_method',
      metadata,
      created: Math.floor(Date.now() / 1000),
      client_secret: `${paymentIntentId}_secret_${crypto.randomBytes(16).toString('hex')}`
    };

    this.payments.set(paymentIntentId, paymentIntent);
    
    console.log(`💳 Mock Payment Intent Created: ${paymentIntentId} - £${amount}`);
    return paymentIntent;
  }

  // Mock payment confirmation
  async confirmPayment(paymentIntentId, paymentMethod = 'card_mock') {
    const payment = this.payments.get(paymentIntentId);
    if (!payment) {
      throw new Error('Payment intent not found');
    }

    payment.status = 'succeeded';
    payment.payment_method = paymentMethod;
    payment.confirmed_at = Math.floor(Date.now() / 1000);

    this.payments.set(paymentIntentId, payment);
    
    console.log(`✅ Mock Payment Confirmed: ${paymentIntentId} - £${payment.amount / 100}`);
    return payment;
  }

  // Mock subscription creation
  async createSubscription(customerId, priceId, metadata = {}) {
    const subscriptionId = `sub_mock_${crypto.randomBytes(16).toString('hex')}`;
    
    const subscription = {
      id: subscriptionId,
      customer: customerId,
      status: 'active',
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
      items: {
        data: [{
          id: `si_mock_${crypto.randomBytes(16).toString('hex')}`,
          price: {
            id: priceId,
            unit_amount: priceId.includes('basic') ? 999 : 1999, // £9.99 or £19.99
            currency: 'gbp'
          }
        }]
      },
      metadata
    };

    this.subscriptions.set(subscriptionId, subscription);
    
    console.log(`🔄 Mock Subscription Created: ${subscriptionId} - ${priceId}`);
    return subscription;
  }

  // Mock customer creation
  async createCustomer(email, name, metadata = {}) {
    const customerId = `cus_mock_${crypto.randomBytes(16).toString('hex')}`;
    
    const customer = {
      id: customerId,
      email,
      name,
      metadata,
      created: Math.floor(Date.now() / 1000)
    };

    console.log(`👤 Mock Customer Created: ${customerId} - ${email}`);
    return customer;
  }

  // Get payment status
  async getPaymentIntent(paymentIntentId) {
    return this.payments.get(paymentIntentId);
  }

  // Get subscription status
  async getSubscription(subscriptionId) {
    return this.subscriptions.get(subscriptionId);
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    subscription.status = 'canceled';
    subscription.canceled_at = Math.floor(Date.now() / 1000);
    
    this.subscriptions.set(subscriptionId, subscription);
    
    console.log(`❌ Mock Subscription Canceled: ${subscriptionId}`);
    return subscription;
  }
}

// Export singleton instance
const mockPaymentService = new MockPaymentService();

module.exports = {
  MockPaymentService,
  mockPaymentService,
  
  // Stripe-compatible API
  paymentIntents: {
    create: (params) => mockPaymentService.createPaymentIntent(params.amount / 100, params.currency, params.metadata),
    confirm: (id, params) => mockPaymentService.confirmPayment(id, params.payment_method),
    retrieve: (id) => mockPaymentService.getPaymentIntent(id)
  },
  
  subscriptions: {
    create: (params) => mockPaymentService.createSubscription(params.customer, params.items[0].price, params.metadata),
    retrieve: (id) => mockPaymentService.getSubscription(id),
    cancel: (id) => mockPaymentService.cancelSubscription(id)
  },
  
  customers: {
    create: (params) => mockPaymentService.createCustomer(params.email, params.name, params.metadata)
  }
};
























