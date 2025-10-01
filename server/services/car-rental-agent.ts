import { Agent } from '@openai/agents';
import OpenAI from 'openai';

export interface CarRentalAgentConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AgentResponse {
  success: boolean;
  response: string;
  agentType: string;
  metadata?: any;
}

export class CarRentalAgentService {
  private client: OpenAI;
  private agents: Map<string, Agent> = new Map();
  private isInitialized = false;

  constructor(config: CarRentalAgentConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
    this.initializeAgents();
  }

  private initializeAgents() {
    // Customer Support Agent
    const supportAgent = new Agent({
      name: 'ShareWheelz Support Agent',
      instructions: `You are Alanna, a professional customer support agent for ShareWheelz, a UK car rental platform.

Your role:
- Provide helpful, friendly support for car rental inquiries
- Answer questions about bookings, pricing, policies, and services
- Help users with technical issues and account problems
- Escalate complex issues when necessary
- Always maintain a professional, helpful tone

Key information about ShareWheelz:
- UK-based peer-to-peer car rental platform
- Available in all major UK cities
- Supports all fuel types (petrol, diesel, electric, hybrid)
- Secure payments and comprehensive insurance included
- 24/7 customer support
- Membership tiers: Purple (£9.99/month), Gold (£19.99/month), Elite (£199/year)

Always sign your responses as "Alanna from ShareWheelz Support"`,
      model: 'gpt-3.5-turbo',
    });

    // Booking Assistant Agent
    const bookingAgent = new Agent({
      name: 'Booking Assistant Agent',
      instructions: `You are a specialized booking assistant for ShareWheelz car rental platform.

Your expertise:
- Help users find the perfect car for their needs
- Explain booking processes and requirements
- Provide pricing information and discounts
- Assist with date and location selection
- Handle booking modifications and cancellations
- Explain insurance and payment options

Booking process:
1. Search available vehicles
2. Select dates and location
3. Choose preferred car
4. Complete payment
5. Receive confirmation

Always be helpful and provide clear, step-by-step guidance.`,
      model: 'gpt-3.5-turbo',
    });

    // Host Support Agent
    const hostAgent = new Agent({
      name: 'Host Support Agent',
      instructions: `You are a specialized support agent for ShareWheelz hosts (car owners).

Your responsibilities:
- Help hosts optimize their listings
- Provide guidance on pricing strategies
- Assist with earnings calculations
- Help with car maintenance and safety
- Explain host policies and requirements
- Support with customer communication

Host benefits:
- Earn money from idle vehicles
- Flexible scheduling
- Comprehensive insurance coverage
- 24/7 roadside assistance
- Marketing support

Always provide practical, actionable advice for hosts.`,
      model: 'gpt-3.5-turbo',
    });

    // Technical Support Agent
    const techAgent = new Agent({
      name: 'Technical Support Agent',
      instructions: `You are a technical support specialist for ShareWheelz platform.

Your expertise:
- Platform navigation and features
- Account management issues
- Payment and billing problems
- App and website functionality
- Security and privacy concerns
- Integration and API questions

Technical capabilities:
- Troubleshoot common issues
- Provide step-by-step solutions
- Escalate complex technical problems
- Guide users through platform features
- Explain security measures

Always provide clear, technical solutions and escalate when needed.`,
      model: 'gpt-3.5-turbo',
    });

    this.agents.set('support', supportAgent);
    this.agents.set('booking', bookingAgent);
    this.agents.set('host', hostAgent);
    this.agents.set('technical', techAgent);

    this.isInitialized = true;
    console.log('✅ Car Rental Agent Service initialized with 4 specialized agents');
  }

  async processMessage(
    message: string,
    agentType: 'support' | 'booking' | 'host' | 'technical' = 'support',
    context?: any
  ): Promise<AgentResponse> {
    if (!this.isInitialized) {
      return {
        success: false,
        response: 'Agent service not initialized',
        agentType: 'error',
      };
    }

    const agent = this.agents.get(agentType);
    if (!agent) {
      return {
        success: false,
        response: 'Agent not found',
        agentType: 'error',
      };
    }

    try {
      // Use the OpenAI client directly for now since the Agent API might be different
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: agent.instructions || 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || 'No response generated';

      return {
        success: true,
        response: content,
        agentType,
        metadata: {
          model: 'gpt-3.5-turbo',
          tokens: response.usage?.total_tokens,
        },
      };
    } catch (error: any) {
      console.error(`Agent ${agentType} error:`, error);
      
      // Fallback to predefined responses
      const fallbackResponse = this.getFallbackResponse(message, agentType);
      
      return {
        success: true,
        response: fallbackResponse,
        agentType,
        metadata: {
          fallback: true,
          error: error.message,
        },
      };
    }
  }

  private getFallbackResponse(message: string, agentType: string): string {
    const lowerMessage = message.toLowerCase();

    switch (agentType) {
      case 'support':
        if (lowerMessage.includes('booking') || lowerMessage.includes('rent')) {
          return "Hi! I'm Alanna from ShareWheelz Support. I can help you with booking a car. Our platform offers vehicles across all major UK cities with secure payments and comprehensive insurance. How can I assist you with your rental needs?";
        }
        if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
          return "Hello! I'm Alanna from ShareWheelz Support. Our pricing includes the base daily rate plus service fees and insurance. Members get discounts: Purple 5%, Gold 15%, Elite 20%. Would you like me to help you find the best rates for your trip?";
        }
        return "Hi! I'm Alanna from ShareWheelz Support. I'm here to help with any questions about our car rental platform. We operate across the UK with all fuel types available. What can I assist you with today?";

      case 'booking':
        return "I'm your booking assistant! I can help you find the perfect car for your trip. We have vehicles available across the UK with flexible booking options. What dates and location are you looking for?";

      case 'host':
        return "Hello! I'm here to help ShareWheelz hosts optimize their earnings. I can assist with pricing strategies, listing optimization, and host policies. What aspect of hosting would you like help with?";

      case 'technical':
        return "I'm your technical support specialist. I can help with platform navigation, account issues, and technical problems. What technical issue can I help you resolve today?";

      default:
        return "Hello! I'm Alanna from ShareWheelz Support. I'm here to help with any questions about our car rental platform. How can I assist you today?";
    }
  }

  async getAgentCapabilities(): Promise<any> {
    return {
      availableAgents: Array.from(this.agents.keys()),
      agentDescriptions: {
        support: 'General customer support and inquiries',
        booking: 'Specialized booking assistance',
        host: 'Host-specific support and guidance',
        technical: 'Technical support and troubleshooting',
      },
      isInitialized: this.isInitialized,
    };
  }

  isAvailable(): boolean {
    return this.isInitialized && this.agents.size > 0;
  }
}

export default CarRentalAgentService;
