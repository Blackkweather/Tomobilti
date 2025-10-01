import axios from 'axios';

export interface SMSMessage {
  to: string;
  text: string;
  from?: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
}

export interface SMSDeliveryStatus {
  messageId: string;
  status: 'PENDING' | 'DELIVERED' | 'FAILED' | 'EXPIRED';
  timestamp: string;
  error?: string;
}

export class InfobipSMSService {
  private static apiKey: string;
  private static baseUrl: string;
  private static senderName: string;
  private static isInitialized = false;

  /**
   * Initialize Infobip SMS service
   */
  static initialize() {
    this.apiKey = process.env.INFOBIP_API_KEY || '';
    this.baseUrl = process.env.INFOBIP_BASE_URL || 'https://api.infobip.com';
    this.senderName = process.env.INFOBIP_SENDER_NAME || 'ShareWheelz';

    if (!this.apiKey) {
      console.warn('⚠️  Infobip API key not found. SMS features will be disabled.');
      return;
    }

    this.isInitialized = true;
    console.log('✅ Infobip SMS service initialized successfully');
  }

  /**
   * Send SMS message
   */
  static async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    if (!this.isInitialized || !this.apiKey) {
      console.warn('Infobip SMS service not initialized or API key missing');
      return {
        success: false,
        error: 'SMS service not configured'
      };
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/sms/2/text/single`,
        {
          from: message.from || this.senderName,
          to: message.to,
          text: message.text
        },
        {
          headers: {
            'Authorization': `App ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      const result = response.data;
      
      if (result.messages && result.messages.length > 0) {
        const messageResult = result.messages[0];
        return {
          success: messageResult.status.groupId === 1, // 1 = ACCEPTED
          messageId: messageResult.messageId,
          error: messageResult.status.groupId !== 1 ? messageResult.status.description : undefined,
          cost: messageResult.cost
        };
      }

      return {
        success: false,
        error: 'No message result returned'
      };

    } catch (error: any) {
      console.error('Infobip SMS error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.requestError?.serviceException?.text || error.message
      };
    }
  }

  /**
   * Send bulk SMS messages
   */
  static async sendBulkSMS(messages: SMSMessage[]): Promise<SMSResponse[]> {
    if (!this.isInitialized || !this.apiKey) {
      console.warn('Infobip SMS service not initialized or API key missing');
      return messages.map(() => ({
        success: false,
        error: 'SMS service not configured'
      }));
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/sms/2/text/advanced`,
        {
          messages: messages.map(msg => ({
            from: msg.from || this.senderName,
            to: msg.to,
            text: msg.text
          }))
        },
        {
          headers: {
            'Authorization': `App ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      const results = response.data.messages || [];
      return results.map((result: any) => ({
        success: result.status.groupId === 1,
        messageId: result.messageId,
        error: result.status.groupId !== 1 ? result.status.description : undefined,
        cost: result.cost
      }));

    } catch (error: any) {
      console.error('Infobip bulk SMS error:', error.response?.data || error.message);
      return messages.map(() => ({
        success: false,
        error: error.response?.data?.requestError?.serviceException?.text || error.message
      }));
    }
  }

  /**
   * Get SMS delivery status
   */
  static async getDeliveryStatus(messageId: string): Promise<SMSDeliveryStatus | null> {
    if (!this.isInitialized || !this.apiKey) {
      return null;
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/sms/2/reports/${messageId}`,
        {
          headers: {
            'Authorization': `App ${this.apiKey}`,
            'Accept': 'application/json'
          }
        }
      );

      const result = response.data;
      return {
        messageId: result.messageId,
        status: this.mapStatus(result.status.groupId),
        timestamp: result.doneAt || result.sentAt,
        error: result.status.groupId !== 1 ? result.status.description : undefined
      };

    } catch (error: any) {
      console.error('Infobip delivery status error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Send booking confirmation SMS
   */
  static async sendBookingConfirmation(
    phoneNumber: string,
    bookingDetails: {
      bookingId: string;
      carName: string;
      startDate: string;
      endDate: string;
      totalAmount: number;
      pickupLocation: string;
    }
  ): Promise<SMSResponse> {
    const message = `🚗 ShareWheelz Booking Confirmed!

Booking ID: ${bookingDetails.bookingId}
Car: ${bookingDetails.carName}
Dates: ${bookingDetails.startDate} - ${bookingDetails.endDate}
Pickup: ${bookingDetails.pickupLocation}
Total: £${bookingDetails.totalAmount}

Thank you for choosing ShareWheelz!`;

    return this.sendSMS({
      to: phoneNumber,
      text: message
    });
  }

  /**
   * Send booking reminder SMS
   */
  static async sendBookingReminder(
    phoneNumber: string,
    bookingDetails: {
      bookingId: string;
      carName: string;
      pickupTime: string;
      pickupLocation: string;
    }
  ): Promise<SMSResponse> {
    const message = `⏰ ShareWheelz Reminder

Your booking is tomorrow!
Car: ${bookingDetails.carName}
Pickup: ${bookingDetails.pickupTime}
Location: ${bookingDetails.pickupLocation}

Booking ID: ${bookingDetails.bookingId}

Need help? Contact support.`;

    return this.sendSMS({
      to: phoneNumber,
      text: message
    });
  }

  /**
   * Send emergency alert SMS
   */
  static async sendEmergencyAlert(
    phoneNumber: string,
    alertDetails: {
      type: 'accident' | 'breakdown' | 'theft' | 'damage';
      bookingId: string;
      carName: string;
      message: string;
    }
  ): Promise<SMSResponse> {
    const alertEmoji = {
      accident: '🚨',
      breakdown: '🔧',
      theft: '🚔',
      damage: '⚠️'
    };

    const message = `${alertEmoji[alertDetails.type]} ShareWheelz Emergency Alert

${alertDetails.message}

Booking ID: ${alertDetails.bookingId}
Car: ${alertDetails.carName}

Please contact us immediately for assistance.`;

    return this.sendSMS({
      to: phoneNumber,
      text: message
    });
  }

  /**
   * Send verification code SMS
   */
  static async sendVerificationCode(
    phoneNumber: string,
    code: string
  ): Promise<SMSResponse> {
    const message = `🔐 ShareWheelz Verification Code

Your verification code is: ${code}

This code expires in 10 minutes.
Do not share this code with anyone.`;

    return this.sendSMS({
      to: phoneNumber,
      text: message
    });
  }

  /**
   * Send promotional SMS
   */
  static async sendPromotionalSMS(
    phoneNumber: string,
    promotionDetails: {
      title: string;
      description: string;
      discountCode?: string;
      expiryDate?: string;
    }
  ): Promise<SMSResponse> {
    let message = `🎉 ShareWheelz Special Offer!

${promotionDetails.title}

${promotionDetails.description}`;

    if (promotionDetails.discountCode) {
      message += `\n\nUse code: ${promotionDetails.discountCode}`;
    }

    if (promotionDetails.expiryDate) {
      message += `\n\nValid until: ${promotionDetails.expiryDate}`;
    }

    message += '\n\nBook now at sharewheelz.com';

    return this.sendSMS({
      to: phoneNumber,
      text: message
    });
  }

  /**
   * Check if SMS service is available
   */
  static isAvailable(): boolean {
    return this.isInitialized && !!this.apiKey;
  }

  /**
   * Map Infobip status codes to readable status
   */
  private static mapStatus(groupId: number): 'PENDING' | 'DELIVERED' | 'FAILED' | 'EXPIRED' {
    switch (groupId) {
      case 1: return 'PENDING';    // ACCEPTED
      case 3: return 'DELIVERED';   // DELIVERED_TO_HANDSET
      case 5: return 'FAILED';      // REJECTED
      case 6: return 'EXPIRED';    // EXPIRED
      default: return 'FAILED';
    }
  }

  /**
   * Validate phone number format
   */
  static validatePhoneNumber(phoneNumber: string): boolean {
    // Basic UK phone number validation
    const ukPhoneRegex = /^(\+44|0)[1-9]\d{8,9}$/;
    return ukPhoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }

  /**
   * Format phone number for UK
   */
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // If it starts with 44, it's already international format
    if (cleaned.startsWith('44')) {
      return `+${cleaned}`;
    }
    
    // If it starts with 0, replace with +44
    if (cleaned.startsWith('0')) {
      return `+44${cleaned.substring(1)}`;
    }
    
    // If it's missing the country code, add +44
    if (cleaned.length === 10) {
      return `+44${cleaned}`;
    }
    
    return phoneNumber; // Return original if can't format
  }
}

export default InfobipSMSService;
