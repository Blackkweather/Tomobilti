import twilio from 'twilio';

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

export class TwilioSMSService {
  private static client: twilio.Twilio | null = null;
  private static phoneNumber: string;
  private static isInitialized = false;

  /**
   * Initialize Twilio SMS service
   */
  static initialize() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER || '+212720-155047';

    if (!accountSid || !authToken) {
      console.warn('⚠️  Twilio credentials not found. SMS features will be disabled.');
      return;
    }

    try {
      this.client = twilio(accountSid, authToken);
      this.isInitialized = true;
      console.log('✅ Twilio SMS service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Twilio SMS service:', error);
    }
  }

  /**
   * Send SMS message
   */
  static async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    if (!this.isInitialized || !this.client) {
      console.warn('Twilio SMS service not initialized or client missing');
      return {
        success: false,
        error: 'SMS service not configured'
      };
    }

    try {
      const result = await this.client.messages.create({
        body: message.text,
        from: message.from || this.phoneNumber,
        to: message.to
      });

      return {
        success: true,
        messageId: result.sid,
        cost: parseFloat(result.price || '0')
      };

    } catch (error: any) {
      console.error('Twilio SMS error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send bulk SMS messages
   */
  static async sendBulkSMS(messages: SMSMessage[]): Promise<SMSResponse[]> {
    if (!this.isInitialized || !this.client) {
      console.warn('Twilio SMS service not initialized or client missing');
      return messages.map(() => ({
        success: false,
        error: 'SMS service not configured'
      }));
    }

    const results: SMSResponse[] = [];
    
    for (const message of messages) {
      try {
        const result = await this.client!.messages.create({
          body: message.text,
          from: message.from || this.phoneNumber,
          to: message.to
        });

        results.push({
          success: true,
          messageId: result.sid,
          cost: parseFloat(result.price || '0')
        });

      } catch (error: any) {
        console.error('Twilio bulk SMS error:', error.message);
        results.push({
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Get SMS delivery status
   */
  static async getDeliveryStatus(messageId: string): Promise<SMSDeliveryStatus | null> {
    if (!this.isInitialized || !this.client) {
      return null;
    }

    try {
      const message = await this.client.messages(messageId).fetch();
      
      return {
        messageId: message.sid,
        status: this.mapStatus(message.status),
        timestamp: message.dateCreated.toISOString(),
        error: message.errorMessage || undefined
      };

    } catch (error: any) {
      console.error('Twilio delivery status error:', error.message);
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
    return this.isInitialized && !!this.client;
  }

  /**
   * Map Twilio status to readable status
   */
  private static mapStatus(status: string): 'PENDING' | 'DELIVERED' | 'FAILED' | 'EXPIRED' {
    switch (status) {
      case 'queued':
      case 'sending':
        return 'PENDING';
      case 'sent':
      case 'delivered':
        return 'DELIVERED';
      case 'failed':
      case 'undelivered':
        return 'FAILED';
      default:
        return 'FAILED';
    }
  }

  /**
   * Validate phone number format
   */
  static validatePhoneNumber(phoneNumber: string): boolean {
    // Basic international phone number validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }

  /**
   * Format phone number for international use
   */
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +, add it
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return cleaned;
  }
}

export default TwilioSMSService;
