import OpenAI from 'openai';

class OpenAIService {
  private client: OpenAI | null = null;
  private isInitialized = false;
  private requestCount = 0;
  private lastResetTime = Date.now();
  private readonly maxRequestsPerMinute = 20; // Conservative limit
  private readonly resetInterval = 60 * 1000; // 1 minute

  constructor() {
    this.initialize();
  }

  private initialize() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    console.log('OpenAI API Key found:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');
    
    if (!apiKey) {
      console.warn('⚠️  OpenAI API key not found. ChatGPT features will be disabled.');
      return;
    }

    try {
      this.client = new OpenAI({
        apiKey: apiKey,
        timeout: 10000, // 10 second timeout
      });
      this.isInitialized = true;
      console.log('✅ OpenAI service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize OpenAI service:', error);
    }
  }

  private checkRateLimit(): boolean {
    const now = Date.now();
    
    // Reset counter if a minute has passed
    if (now - this.lastResetTime > this.resetInterval) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }
    
    // Check if we've exceeded the rate limit
    if (this.requestCount >= this.maxRequestsPerMinute) {
      console.warn(`⚠️ OpenAI rate limit exceeded: ${this.requestCount}/${this.maxRequestsPerMinute} requests per minute`);
      return false;
    }
    
    this.requestCount++;
    return true;
  }

  private async handleOpenAIError(error: any): Promise<string> {
    console.error('OpenAI API error:', error);
    
    if (error.status === 429) {
      console.warn('🚫 OpenAI rate limit hit (429). Using fallback response.');
      return 'I\'m experiencing high demand right now, but I can still help! Let me provide you with information about our services.';
    }
    
    if (error.status === 401) {
      console.error('🔑 OpenAI API key invalid (401)');
      return 'I\'m having trouble accessing my AI features right now, but I can still assist you with our car rental services.';
    }
    
    if (error.status === 500) {
      console.error('🔥 OpenAI server error (500)');
      return 'I\'m experiencing some technical difficulties, but I can still help you with ShareWheelz services.';
    }
    
    // For any other error, use fallback
    return 'I\'m having a moment of technical difficulty, but I\'m still here to help with ShareWheelz!';
  }

  async generateChatResponse(messages: Array<{role: 'user' | 'assistant' | 'system', content: string}>, context?: string): Promise<string> {
    if (!this.isInitialized || !this.client) {
      return this.getFallbackResponse(messages[messages.length - 1]?.content);
    }

    // Check rate limit before making request
    if (!this.checkRateLimit()) {
      console.warn('Rate limit exceeded, using fallback response');
      return this.getFallbackResponse(messages[messages.length - 1]?.content);
    }

    try {
      const systemMessage = `You are Alanna from ShareWheelz Support. UK car rental platform. Answer ONLY ShareWheelz questions. Be direct and helpful. Sign as "Alanna from ShareWheelz Support".

Services: Car rentals UK-wide, all fuel types, secure payments, insurance included.
Booking: Search → Select dates → Choose car → Pay → Get confirmation.
Pricing: Base price + 5-10% service fee + 3-5% insurance + UK taxes (all £).
Memberships: Purple £9.99/month (5% off), Gold £19.99/month (15% off + priority), Elite £199/year (20% off + VIP).
Cancellation: Free up to 24h before pickup.
Insurance: Basic included, additional options available.
Requirements: UK license, valid payment, age requirements.
Payment: Cards, PayPal, Apple/Google Pay.
Support: 24/7, priority for Gold/Elite members.

If unrelated question: "I'm here to help with ShareWheelz services. How can I assist you?"

${context ? `Additional context: ${context}` : ''}`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          ...messages
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || this.getFallbackResponse(messages[messages.length - 1]?.content);
    } catch (error) {
      return await this.handleOpenAIError(error);
    }
  }

  async generateQuickResponse(userMessage: string): Promise<string> {
    if (!this.isInitialized || !this.client) {
      console.log('OpenAI not initialized or client not available');
      return this.getFallbackResponse(userMessage);
    }

    // Check rate limit before making request
    if (!this.checkRateLimit()) {
      console.warn('Rate limit exceeded, using fallback response');
      return this.getFallbackResponse(userMessage);
    }

    console.log('Generating ChatGPT response for:', userMessage);
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are Alanna from ShareWheelz Support. UK car rental platform. Answer ONLY ShareWheelz questions. Be direct and helpful. Sign as "Alanna from ShareWheelz Support".

Services: Car rentals UK-wide, all fuel types, secure payments, insurance included.
Booking: Search → Select dates → Choose car → Pay → Get confirmation.
Pricing: Base price + 5-10% service fee + 3-5% insurance + UK taxes (all £).
Memberships: Purple £9.99/month (5% off), Gold £19.99/month (15% off + priority), Elite £199/year (20% off + VIP).
Cancellation: Free up to 24h before pickup.
Insurance: Basic included, additional options available.
Requirements: UK license, valid payment, age requirements.
Payment: Cards, PayPal, Apple/Google Pay.
Support: 24/7, priority for Gold/Elite members.

If unrelated question: "I'm here to help with ShareWheelz services. How can I assist you?"`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || this.getFallbackResponse(userMessage);
    } catch (error) {
      return await this.handleOpenAIError(error);
    }
  }

  private getFallbackResponse(userMessage?: string): string {
    if (userMessage) {
      const message = userMessage.toLowerCase();
      
              // Business/Enterprise rental requests
              if (message.includes('business') || message.includes('enterprise') || message.includes('company') || message.includes('10 ') || message.includes('multiple') || message.includes('fleet')) {
                return "Hi! I'm Alanna from ShareWheelz Support. For business rentals like 10 Jaguar F-Pace vehicles, we offer special enterprise solutions! Contact our business team at business@sharewheelz.com or call +44 20 7123 4567. We provide volume discounts, dedicated account managers, and flexible terms for corporate clients. What's your company name and rental dates?";
              }
              
              // Contact/Problem/Support questions
              if (message.includes('contact') || message.includes('problem') || message.includes('issue') || message.includes('complaint') || message.includes('who should i contact')) {
                return "Hi! I'm Alanna from ShareWheelz Support. I'm here 24/7 to help you! You can contact me directly through this chat, or reach our support team at support@sharewheelz.com. Gold members get priority support, Elite members get VIP support. What's your issue? I'll help resolve it right away.";
              }
      
      // Best membership question
      if (message.includes('best membership') || message.includes('best plan') || message.includes('recommend membership') || message.includes('whats the best')) {
        return "Hi! I'm Alanna from ShareWheelz Support. For the best value, I recommend our **Gold Plan (£19.99/month)** - it gives you 15% discount on all rentals, priority support, access to luxury vehicles, free cancellation up to 24h, and double loyalty points. If you rent frequently, the **Black Elite (£199/year)** offers 20% discount plus VIP perks and cashback. Which fits your usage better?";
      }
      
      // Membership plans question
      if (message.includes('membership') || message.includes('member') || message.includes('plan')) {
        return "Hi! I'm Alanna from ShareWheelz Support. We have 3 membership plans: **Purple (£9.99/month)** - 5% discount + loyalty points, **Gold (£19.99/month)** - 15% discount + priority support + luxury access, **Black Elite (£199/year)** - 20% discount + VIP perks + cashback. Which plan interests you?";
      }
      
      // Booking process
      if (message.includes('book') || message.includes('rent') || message.includes('rental') || message.includes('how to rent')) {
        return "Hi! I'm Alanna from ShareWheelz Support. To book a car: 1) Search available vehicles on our platform, 2) Select your dates (up to 12 months ahead), 3) Choose your preferred car, 4) Complete payment. You'll receive confirmation with pickup details. All rentals include basic insurance. Need help with any specific step?";
      }
      
      // Cancellation
      if (message.includes('cancel')) {
        return "Hello! I'm Alanna from ShareWheelz Support. Free cancellation up to 24 hours before pickup. Gold members get free cancellation up to 24h, Elite members can cancel anytime. Cancellations within 24 hours may incur fees. Cancel through your dashboard or contact us directly. What's your membership status?";
      }
      
      // Hosting
      if (message.includes('host') || message.includes('owner') || message.includes('list') || message.includes('become host')) {
        return "Hi! Alanna here from ShareWheelz Support. To become a host: 1) Create account & verify identity, 2) Add vehicle details & photos, 3) Complete verification process. It's free to list! Purple members get +10% search visibility boost. Your vehicle must be roadworthy with valid UK insurance. Ready to start?";
      }
      
      // Insurance
      if (message.includes('insurance')) {
        return "Hello! I'm Alanna from ShareWheelz Support. All rentals include basic liability insurance. Additional coverage available: comprehensive protection, collision damage waiver, personal accident insurance. Purple members get 5% insurance discount, Gold members get enhanced coverage. What protection level interests you?";
      }
      
      // Pricing
      if (message.includes('price') || message.includes('cost') || message.includes('fee') || message.includes('how much')) {
        return "Hello! I'm Alanna from ShareWheelz Support. Pricing includes: base daily rate (varies by vehicle), service fee (5-10%), insurance (3-5%), UK taxes. All prices in British Pounds (£). Members get discounts: Purple 5%, Gold 15%, Elite 20%. Need a specific quote?";
      }
      
      // Requirements
      if (message.includes('requirement') || message.includes('license') || message.includes('age') || message.includes('need to rent')) {
        return "Hello! I'm Alanna from ShareWheelz Support. Requirements: Valid UK driving license, minimum age requirements, valid payment method, identity verification for hosts. Vehicles must be roadworthy and insured. Hosts must respond within 24 hours. Need help with verification?";
      }
      
      // Payment methods
      if (message.includes('payment') || message.includes('pay') || message.includes('card') || message.includes('credit')) {
        return "Hi! I'm Alanna from ShareWheelz Support. We accept all major credit/debit cards, PayPal, Apple Pay, and Google Pay. Payment is required at booking confirmation. Security deposits may be held separately and released after your rental period. Need help with payment?";
      }
      
      // Help/Support
      if (message.includes('help') || message.includes('support')) {
        return "Hi! I'm Alanna from ShareWheelz Support. I'm here 24/7 to help with: bookings, cancellations, hosting, insurance, membership plans, pricing, requirements. We offer priority support for Gold members and VIP support for Elite members. What specific assistance do you need?";
      }
      
      // Greeting
      if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hi! I'm Alanna from ShareWheelz Support. Welcome to our car rental platform! I'm here to help you with bookings, membership plans, hosting, or any questions about our services. How can I assist you today?";
      }
      
      // General questions about the platform
      if (message.includes('what is') || message.includes('what are') || message.includes('tell me about') || message.includes('explain')) {
        return "Hi! I'm Alanna from ShareWheelz Support. ShareWheelz is a UK-based car rental platform connecting car owners with renters. We offer secure payments, comprehensive insurance, and operate across all major UK cities with petrol, diesel, electric, and hybrid vehicles. What specific aspect would you like to know more about?";
      }
    }
    
    const fallbackResponses = [
      "Hi! I'm Alanna from ShareWheelz Support. I'm here to help with car rentals, bookings, cancellations, hosting, insurance, and membership plans. We operate across all major UK cities with all fuel types. How can I assist you today?",
      "Hello! I'm Alanna from ShareWheelz Support. We offer 3 membership tiers with discounts up to 20%, free cancellation policies, and comprehensive insurance options. All prices in British Pounds (£). What would you like to know about our services?",
      "Hi! Alanna here from ShareWheelz Support. Our platform connects car owners with renters across the UK. We provide secure payments, insurance coverage, and 24/7 support. Members get exclusive benefits and discounts. How can I help you get started?",
      "Hello! I'm Alanna from ShareWheelz Support. We're a UK-based car rental platform with community-driven rentals. Available in all major cities with petrol, diesel, electric, and hybrid vehicles. What specific information do you need?"
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  isAvailable(): boolean {
    return this.isInitialized && this.client !== null;
  }
}

export default new OpenAIService();
