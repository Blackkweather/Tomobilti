import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface VerificationEmailData {
  to: string;
  firstName: string;
  verificationToken: string;
}

export interface BookingConfirmationData {
  to: string;
  firstName: string;
  carTitle: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  currency: string;
  bookingId: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter;

  /**
   * Initialize email transporter
   */
  static initialize() {
    // Temporarily disable email service for quick hosting
    console.log('📧 Email service temporarily disabled for hosting');
    console.log('   Email functionality will work in mock mode');
    return;

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email service initialization failed:', error);
        console.log('   Please check your SMTP credentials in .env file');
      } else {
        console.log('✅ Email service ready');
      }
    });
  }

  /**
   * Send email verification
   */
  static async sendVerificationEmail(data: VerificationEmailData): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${data.verificationToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #22c55e, #3b82f6); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Tomobilti</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Car Rental Platform</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to Tomobilti!</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Hi ${data.firstName},
          </p>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            Thank you for registering with Tomobilti! To complete your account setup, 
            please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #22c55e; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 8px; font-weight: 600; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #3b82f6;">${verificationUrl}</a>
          </p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            This link will expire in 24 hours. If you didn't create an account with Tomobilti, 
            please ignore this email.
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            © 2024 Tomobilti. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: data.to,
      subject: 'Verify your email - Tomobilti',
      html,
    });
  }

  /**
   * Send booking confirmation email
   */
  static async sendBookingConfirmation(data: BookingConfirmationData): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #22c55e, #3b82f6); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Tomobilti</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Booking Confirmation</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Booking Confirmed! 🎉</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Hi ${data.firstName},
          </p>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            Your car rental booking has been confirmed! Here are the details:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e;">
            <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
            <p style="margin: 10px 0;"><strong>Vehicle:</strong> ${data.carTitle}</p>
            <p style="margin: 10px 0;"><strong>Start Date:</strong> ${new Date(data.startDate).toLocaleDateString()}</p>
            <p style="margin: 10px 0;"><strong>End Date:</strong> ${new Date(data.endDate).toLocaleDateString()}</p>
            <p style="margin: 10px 0;"><strong>Total Amount:</strong> ${data.totalAmount} ${data.currency}</p>
            <p style="margin: 10px 0;"><strong>Booking ID:</strong> ${data.bookingId}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/booking-details/${data.bookingId}" 
               style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 8px; font-weight: 600; display: inline-block;">
              View Booking Details
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            If you have any questions, please contact our support team.
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            © 2024 Tomobilti. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: data.to,
      subject: `Booking Confirmation - ${data.carTitle}`,
      html,
    });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(to: string, firstName: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #22c55e, #3b82f6); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Tomobilti</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Password Reset</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Reset Your Password</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Hi ${firstName},
          </p>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            You requested to reset your password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 8px; font-weight: 600; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #3b82f6;">${resetUrl}</a>
          </p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            This link will expire in 1 hour. If you didn't request a password reset, 
            please ignore this email.
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            © 2024 Tomobilti. All rights reserved.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Reset your password - Tomobilti',
      html,
    });
  }

  /**
   * Generic email sending method
   */
  private static async sendEmail(data: EmailData): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.log(`📧 Email service disabled - Would send to ${data.to}: ${data.subject}`);
        return true; // Return true in development mode when email is disabled
      }

      await this.transporter.sendMail({
        from: `"Tomobilti" <${process.env.SMTP_USER}>`,
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
      });

      console.log(`✅ Email sent to ${data.to}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
}

export default EmailService;

