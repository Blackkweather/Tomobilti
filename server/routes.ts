import type { Express } from 'express';
import { registerAdminRoutes } from './routes/admin';
import oauthRoutes from './routes/oauth';
import { storage } from './storage';
import jwt from 'jsonwebtoken';
import { 
  carSearchSchema, 
  insertCarSchema, 
  insertBookingSchema, 
  insertReviewSchema,
  loginSchema,
  registerSchema,
  enhancedInsertCarSchema,
  insertEmailLeadSchema,
  InsertBooking,
  InsertReview
} from "@shared/sqlite-schema";
import { z } from "zod";
import { csrfProtection } from "./middleware/csrf";
import { sanitizeMiddleware, sanitizeInput } from "./middleware/sanitize";
import { EmailService } from "./services/email";
import { CarRentalAgentService } from "./services/car-rental-agent";
import OpenAIService from "./services/openai";
import multer from 'multer';
import { 
  authMiddleware, 
  optionalAuthMiddleware,
  requireAuth, 
  requireOwner,
  requireCarOwnership,
  generateToken,
  sanitizeUser
} from "./middleware/auth";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

export default function registerRoutes(app: Express) {
  // Test endpoint to verify server is working
  app.get('/api/test', (req, res) => {
    res.json({
      status: 'success',
      message: 'ShareWheelz server is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: process.env.DATABASE_URL ? 'connected' : 'not configured',
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured'
    });
  });
// Helper function to validate images are local only
const validateLocalImages = (images: string[]): string[] => {
  return images.filter(img => {
    // Only allow local assets, data URLs, or relative paths
    return img.startsWith('/assets/') || 
           img.startsWith('data:') || 
           img.startsWith('./') ||
           img.startsWith('../') ||
           !img.includes('http://') && !img.includes('https://');
  });
};

// Multer configuration for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Rate limiting configurations - ENABLED FOR PRODUCTION
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: { error: 'Too many login attempts, please try again later' }
});

app.use('/api', generalLimiter); // DISABLED FOR DEVELOPMENT
  app.use('/api', sanitizeMiddleware);
  
  // Authentication routes (no auth required)
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.verifyPassword(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      const token = generateToken(user.id);
      const sanitizedUser = sanitizeUser(user);
      
      res.json({ 
        message: 'Login successful',
        token,
        user: sanitizedUser
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.post('/api/auth/register', async (req, res) => {
    try {
      // Accept either firstName/lastName or a single name field (for tests)
      let raw = req.body as any;
      if (raw.name && (!raw.firstName || !raw.lastName)) {
        const parts = String(raw.name).trim().split(/\s+/);
        raw.firstName = raw.firstName || parts[0] || 'User';
        raw.lastName = raw.lastName || (parts.slice(1).join(' ') || '');
      }
      const userData = registerSchema.parse(raw);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }
      
      const user = await storage.createUser(userData);
      const token = generateToken(user.id);
      const sanitizedUser = sanitizeUser(user);
      
      // Send email verification
      try {
        const verificationToken = generateToken(user.id); // You might want to create a separate verification token
        await EmailService.sendVerificationEmail({
          to: user.email,
          firstName: user.firstName,
          verificationToken: verificationToken
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails
      }
      
      res.status(201).json({
        message: 'Account created successfully',
        token,
        user: sanitizedUser
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      console.error('Register error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/api/auth/me', authMiddleware, (req, res) => {
    const sanitizedUser = sanitizeUser(req.user!);
    res.json({ user: sanitizedUser });
  });

  app.put('/api/auth/profile', authMiddleware, async (req, res) => {
    try {
      const updates = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
      };

      // Validate required fields
      if (!updates.firstName || !updates.lastName || !updates.email) {
        return res.status(400).json({ error: 'First name, last name and email are required' });
      }

      // Check if email is already taken by another user
      const existingUser = await storage.getUserByEmail(updates.email);
      if (existingUser && existingUser.id !== req.user!.id) {
        return res.status(400).json({ error: 'This email is already used by another account' });
      }

      const updatedUser = await storage.updateUser(req.user!.id, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const sanitizedUser = sanitizeUser(updatedUser);
      res.json({ 
        message: 'Profile updated successfully',
        user: sanitizedUser 
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/auth/password', authMiddleware, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Validate required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must contain at least 8 characters' });
      }

      // Verify current password
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isCurrentPasswordValid = await storage.verifyPassword(user.email, currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Update password
      const success = await storage.updateUserPassword(req.user!.id, newPassword);
      if (!success) {
        return res.status(500).json({ error: 'Failed to update password' });
      }

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/auth/account', authMiddleware, async (req, res) => {
    try {
      const { password } = req.body;

      // Validate required fields
      if (!password) {
        return res.status(400).json({ error: 'Password is required to delete account' });
      }

      // Verify password
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isPasswordValid = await storage.verifyPassword(user.email, password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Incorrect password' });
      }

      // Delete user and all associated data
      const success = await storage.deleteUser(req.user!.id);
      if (!success) {
        return res.status(500).json({ error: 'Failed to delete account' });
      }

      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Account deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/auth/update-role', authMiddleware, async (req, res) => {
    try {
      const { userType, password } = req.body;

      if (!userType || !['renter', 'owner', 'both'].includes(userType)) {
        return res.status(400).json({ error: 'Invalid user type' });
      }

      const updates: any = { userType };
      
      // If password provided, include it in updates
      if (password && password.length >= 8) {
        updates.password = password;
      }

      const updatedUser = await storage.updateUser(req.user!.id, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const sanitizedUser = sanitizeUser(updatedUser);
      res.json({ 
        message: 'Role updated successfully',
        user: sanitizedUser 
      });
    } catch (error) {
      console.error('Role update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/auth/preferences', authMiddleware, async (req, res) => {
    try {
      const preferences = req.body;

      // Validate preferences structure
      const validPreferences = {
        emailNotifications: Boolean(preferences.emailNotifications),
        smsNotifications: Boolean(preferences.smsNotifications),
        marketingEmails: Boolean(preferences.marketingEmails),
        language: String(preferences.language || 'en'),
        currency: String(preferences.currency || 'GBP'),
        timezone: String(preferences.timezone || 'Europe/London')
      };

      const updatedUser = await storage.updateUser(req.user!.id, { preferences: validPreferences });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const sanitizedUser = sanitizeUser(updatedUser);
      res.json({ 
        message: 'Preferences updated successfully',
        user: sanitizedUser 
      });
    } catch (error) {
      console.error('Preferences update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Email verification endpoints
  app.post('/api/auth/send-verification-email', authMiddleware, async (req, res) => {
    try {
      const user = req.user!;
      
      // Check if user is already verified
      if (user.isVerified) {
        return res.status(400).json({ error: 'Email is already verified' });
      }

      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

      // Update user with verification code
      await storage.updateUser(user.id, {
        emailVerificationCode: verificationCode,
        emailVerificationExpires: expiresAt.toISOString()
      });

      // Send verification email
      try {
        await EmailService.sendVerificationEmail({
          to: user.email,
          firstName: user.firstName,
          verificationCode: verificationCode
        });
        
        res.json({ 
          message: 'Verification code sent to your email',
          expiresIn: 15 * 60 // 15 minutes in seconds
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        res.status(500).json({ error: 'Failed to send verification email' });
      }
    } catch (error) {
      console.error('Send verification email error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/verify-email', authMiddleware, async (req, res) => {
    try {
      const { code } = req.body;
      const user = req.user!;

      if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: 'Verification code is required' });
      }

      // Check if user is already verified
      if (user.isVerified) {
        return res.status(400).json({ error: 'Email is already verified' });
      }

      // Check if verification code exists and is not expired
      if (!user.emailVerificationCode || !user.emailVerificationExpires) {
        return res.status(400).json({ error: 'No verification code found. Please request a new one.' });
      }

      const expiresAt = new Date(user.emailVerificationExpires);
      if (expiresAt < new Date()) {
        return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
      }

      // Verify the code
      if (user.emailVerificationCode !== code) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      // Mark email as verified and clear verification code
      const updatedUser = await storage.updateUser(user.id, {
        isVerified: true,
        emailVerificationCode: null,
        emailVerificationExpires: null
      });

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const sanitizedUser = sanitizeUser(updatedUser);
      res.json({ 
        message: 'Email verified successfully',
        user: sanitizedUser 
      });
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Phone verification endpoints
  app.post('/api/auth/send-phone-verification', authMiddleware, async (req, res) => {
    try {
      const user = req.user!;
      const { phone } = req.body;
      
      if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
      }

      // Validate phone number format
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
      }

      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

      // Update user with phone verification code
      await storage.updateUser(user.id, {
        phone: phone,
        phoneVerificationCode: verificationCode,
        phoneVerificationExpires: expiresAt.toISOString()
      });

      // In a real implementation, you would send SMS here
      // For now, we'll just log the code (in production, remove this)
      console.log(`📱 SMS verification code for ${phone}: ${verificationCode}`);

      res.json({ 
        message: 'Verification code sent successfully',
        // Remove this in production - only for development
        code: process.env.NODE_ENV === 'development' ? verificationCode : undefined
      });
    } catch (error) {
      console.error('Send phone verification error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/verify-phone', authMiddleware, async (req, res) => {
    try {
      const user = req.user!;
      const { phone, code } = req.body;
      
      if (!phone || !code) {
        return res.status(400).json({ error: 'Phone number and verification code are required' });
      }

      // Check if verification code matches and is not expired
      if (!user.phoneVerificationCode || !user.phoneVerificationExpires) {
        return res.status(400).json({ error: 'No verification code found. Please request a new code.' });
      }

      if (user.phoneVerificationCode !== code) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      const expiresAt = new Date(user.phoneVerificationExpires);
      if (expiresAt < new Date()) {
        return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
      }

      // Mark phone as verified and clear verification code
      await storage.updateUser(user.id, {
        phone: phone,
        isPhoneVerified: true,
        phoneVerificationCode: null,
        phoneVerificationExpires: null
      });

      res.json({ message: 'Phone number verified successfully' });
    } catch (error) {
      console.error('Verify phone error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Document upload endpoint
  app.post('/api/auth/upload-document', authMiddleware, upload.single('document'), async (req, res) => {
    try {
      const user = req.user!;
      const { type } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: 'No document file uploaded' });
      }

      if (!type || !['id', 'license'].includes(type)) {
        return res.status(400).json({ error: 'Invalid document type. Must be "id" or "license"' });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, WebP, and PDF files are allowed.' });
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (req.file.size > maxSize) {
        return res.status(400).json({ error: 'File size too large. Maximum size is 10MB.' });
      }

      // Convert file to base64 for storage
      const fileBuffer = req.file.buffer;
      const base64Data = fileBuffer.toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64Data}`;

      // Update user with document information
      const updateData: any = {
        [`${type}DocumentStatus`]: 'pending',
        [`${type}DocumentUploadedAt`]: new Date().toISOString()
      };

      if (type === 'id') {
        updateData.idDocumentData = dataUrl;
      } else if (type === 'license') {
        updateData.licenseDocumentData = dataUrl;
      }

      await storage.updateUser(user.id, updateData);

      res.json({ 
        message: `${type === 'id' ? 'ID document' : 'Driving license'} uploaded successfully. It will be reviewed within 24 hours.`,
        documentType: type,
        status: 'pending'
      });
    } catch (error) {
      console.error('Document upload error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Background check endpoint
  app.post('/api/auth/start-background-check', authMiddleware, async (req, res) => {
    try {
      const user = req.user!;
      const { fullName, dateOfBirth, address, city, postalCode, country, additionalInfo } = req.body;
      
      // Validate required fields
      const requiredFields = ['fullName', 'dateOfBirth', 'address', 'city', 'postalCode', 'country'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: 'Missing required fields', 
          missingFields 
        });
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateOfBirth)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      }

      // Update user with background check information
      await storage.updateUser(user.id, {
        backgroundCheckStatus: 'pending',
        backgroundCheckStartedAt: new Date().toISOString(),
        backgroundCheckData: {
          fullName,
          dateOfBirth,
          address,
          city,
          postalCode,
          country,
          additionalInfo: additionalInfo || ''
        }
      });

      // In a real implementation, you would initiate the background check with a third-party service
      console.log(`🔍 Background check initiated for user ${user.id}:`, {
        fullName,
        dateOfBirth,
        address,
        city,
        postalCode,
        country
      });

      res.json({ 
        message: 'Background check initiated successfully. You will be notified when it\'s complete (usually within 3-5 business days).',
        status: 'pending',
        estimatedCompletion: '3-5 business days'
      });
    } catch (error) {
      console.error('Background check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Messaging routes
  app.get('/api/conversations', authMiddleware, async (req, res) => {
    try {
      const conversations = await storage.getUserConversations(req.user!.id);
      res.json({ conversations });
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/conversations/:conversationId/messages', authMiddleware, async (req, res) => {
    try {
      const messages = await storage.getConversationMessages(req.params.conversationId, req.user!.id);
      res.json({ messages });
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/conversations', authMiddleware, async (req, res) => {
    try {
      const { bookingId } = req.body as { bookingId: string; };
      const conversation = await storage.createConversation(bookingId, req.user!.id);
      res.json({ conversation });
    } catch (error) {
      console.error('Create conversation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/messages', authMiddleware, async (req, res) => {
    try {
      const { conversationId, content, messageType = 'text' } = req.body;
      const message = await storage.createMessage(conversationId, req.user!.id, content, messageType);
      
      // Send real-time message via WebSocket
      const messagingServer = (global as any).messagingServer;
      if (messagingServer) {
        messagingServer.sendMessageToConversation(conversationId, message);
      }
      
      res.json({ message });
    } catch (error) {
      console.error('Create message error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ChatGPT API endpoint with development-friendly rate limiting
  const chatLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: process.env.NODE_ENV === 'production' ? 10 : 100, // Much higher limit for development
    message: 'Too many chat requests, please wait a moment before trying again.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.post('/api/chatgpt/chat', chatLimiter, async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const response = await OpenAIService.generateQuickResponse(message);
      
      res.json({ 
        response,
        isAI: OpenAIService.isAvailable()
      });
    } catch (error) {
      console.error('ChatGPT API error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

  // SMS API endpoints
  app.post('/api/sms/send', async (req, res) => {
    try {
      const { to, text, from } = req.body;
      
      if (!to || !text) {
        return res.status(400).json({ error: 'Phone number and message text are required' });
      }

      // Mock SMS response since TwilioSMSService was removed
      const result = { success: true, messageId: 'mock-' + Date.now(), status: 'sent' };
      
      res.json(result);
    } catch (error) {
      console.error('SMS send error:', error);
      res.status(500).json({ error: 'Failed to send SMS' });
    }
  });

  app.post('/api/sms/booking-confirmation', async (req, res) => {
    try {
      const { phoneNumber, bookingDetails } = req.body;
      
      if (!phoneNumber || !bookingDetails) {
        return res.status(400).json({ error: 'Phone number and booking details are required' });
      }

      // Mock booking confirmation SMS
      const result = { success: true, messageId: 'mock-booking-' + Date.now(), status: 'sent' };
      
      res.json(result);
    } catch (error) {
      console.error('Booking confirmation SMS error:', error);
      res.status(500).json({ error: 'Failed to send booking confirmation SMS' });
    }
  });

  app.post('/api/sms/booking-reminder', async (req, res) => {
    try {
      const { phoneNumber, bookingDetails } = req.body;
      
      if (!phoneNumber || !bookingDetails) {
        return res.status(400).json({ error: 'Phone number and booking details are required' });
      }

      // Mock booking reminder SMS
      const result = { success: true, messageId: 'mock-reminder-' + Date.now(), status: 'sent' };
      
      res.json(result);
    } catch (error) {
      console.error('Booking reminder SMS error:', error);
      res.status(500).json({ error: 'Failed to send booking reminder SMS' });
    }
  });

  app.post('/api/sms/verification-code', async (req, res) => {
    try {
      const { phoneNumber, code } = req.body;
      
      if (!phoneNumber || !code) {
        return res.status(400).json({ error: 'Phone number and verification code are required' });
      }

      // Mock verification code SMS
      const result = { success: true, messageId: 'mock-verification-' + Date.now(), status: 'sent' };
      
      res.json(result);
    } catch (error) {
      console.error('Verification code SMS error:', error);
      res.status(500).json({ error: 'Failed to send verification code SMS' });
    }
  });

  app.get('/api/sms/status/:messageId', async (req, res) => {
    try {
      const { messageId } = req.params;
      
      if (!messageId) {
        return res.status(400).json({ error: 'Message ID is required' });
      }

      // Mock delivery status check
      const status = { status: 'delivered', timestamp: new Date().toISOString() };
      
      if (!status) {
        return res.status(404).json({ error: 'Message status not found' });
      }
      
      res.json(status);
    } catch (error) {
      console.error('SMS status error:', error);
      res.status(500).json({ error: 'Failed to get SMS status' });
    }
  });

  app.post('/api/sms/validate-phone', async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
      }

      // Mock phone validation
      const isValid = /^\+?[\d\s\-\(\)]{10,}$/.test(phoneNumber);
      const formatted = phoneNumber.replace(/\D/g, '');
      
      res.json({
        isValid,
        formatted,
        original: phoneNumber
      });
    } catch (error) {
      console.error('Phone validation error:', error);
      res.status(500).json({ error: 'Failed to validate phone number' });
    }
  });

  // AI Agent API endpoints
  app.post('/api/agent/support', async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

  // TODO: Implement agentService.processMessage(message, 'support', context)
  const response = {};
      
      res.json(response);
    } catch (error) {
      console.error('Support agent error:', error);
      res.status(500).json({ error: 'Failed to process support request' });
    }
  });

  app.post('/api/agent/booking', async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

  // TODO: Implement agentService.processMessage(message, 'booking', context)
  const response = {};
      
      res.json(response);
    } catch (error) {
      console.error('Booking agent error:', error);
      res.status(500).json({ error: 'Failed to process booking request' });
    }
  });

  app.post('/api/agent/host', async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

  // TODO: Implement agentService.processMessage(message, 'host', context)
  const response = {};
      
      res.json(response);
    } catch (error) {
      console.error('Host agent error:', error);
      res.status(500).json({ error: 'Failed to process host request' });
    }
  });

  app.post('/api/agent/technical', async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

  // TODO: Implement agentService.processMessage(message, 'technical', context)
  const response = {};
      
      res.json(response);
    } catch (error) {
      console.error('Technical agent error:', error);
      res.status(500).json({ error: 'Failed to process technical request' });
    }
  });

  app.get('/api/agent/capabilities', async (req, res) => {
    try {
  // TODO: Implement agentService.getAgentCapabilities()
  const capabilities = {};
      res.json(capabilities);
    } catch (error) {
      console.error('Agent capabilities error:', error);
      res.status(500).json({ error: 'Failed to get agent capabilities' });
    }
  });

  // OAuth callback endpoints
  app.get('/auth/google/callback', async (req, res) => {
    try {
      const { code, state } = req.query;
      
      if (!code) {
        return res.redirect('/login?error=oauth_error');
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || '865011521891-jnj5e09u8qc2hed7h6gnbgj4flscucf2.apps.googleusercontent.com',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: `${req.protocol}://${req.get('host')}/auth/google/callback`,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        throw new Error(`Token exchange failed: ${tokenData.error_description}`);
      }

      // Get user info from Google
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      const googleUser = await userResponse.json();

      // Create or find user in database
      let user = await storage.getUserByEmail(googleUser.email);
      let isNewUser = false;
      
      if (!user) {
        isNewUser = true;
        console.log('Creating new OAuth user:', googleUser.email);
        try {
          // OAuth users don't have passwords - don't include password field
          user = await storage.createUser({
            email: googleUser.email,
            firstName: googleUser.given_name || '',
            lastName: googleUser.family_name || '',
            profileImage: googleUser.picture,
            userType: 'renter'
          } as any);
          console.log('OAuth user created successfully:', user.id);
        } catch (createError) {
          console.error('Failed to create OAuth user:', createError);
          throw createError;
        }
      } else {
        console.log('Existing user found:', user.email);
      }

      // Generate JWT token
      const jwtToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      // Redirect based on whether user is new or existing
      if (isNewUser) {
        // New user - ask them to select role
        res.redirect(`/select-role?token=${jwtToken}&auth=google`);
      } else {
        // Existing user - redirect to their dashboard
        if (user.userType === 'owner') {
          res.redirect(`/owner-dashboard?token=${jwtToken}&auth=google`);
        } else if (user.userType === 'renter') {
          res.redirect(`/renter-dashboard?token=${jwtToken}&auth=google`);
        } else {
          res.redirect(`/dashboard?token=${jwtToken}&auth=google`);
        }
      }

    } catch (error) {
      console.error('Google OAuth error:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      res.redirect(`/login?error=oauth_error&details=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`);
    }
  });

  app.get('/auth/apple/callback', async (req, res) => {
    try {
      const { code, state } = req.query;
      
      if (!code) {
        return res.redirect('/login?error=oauth_error');
      }

      // Similar implementation for Apple
      res.redirect('/dashboard?auth=apple');
    } catch (error) {
      console.error('Apple OAuth error:', error);
      res.redirect('/login?error=oauth_error');
    }
  });

  app.get('/auth/microsoft/callback', async (req, res) => {
    try {
      const { code, state } = req.query;
      
      if (!code) {
        return res.redirect('/login?error=oauth_error');
      }

      // Similar implementation for Microsoft
      res.redirect('/dashboard?auth=microsoft');
    } catch (error) {
      console.error('Microsoft OAuth error:', error);
      res.redirect('/login?error=oauth_error');
    }
  });

  // ChatGPT conversation endpoint with specific rate limiting
  app.post('/api/chatgpt/conversation', chatLimiter, async (req, res) => {
    try {
      const { messages, context } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      const response = await OpenAIService.generateChatResponse(messages, context);
      
      res.json({ 
        response,
        isAI: OpenAIService.isAvailable()
      });
    } catch (error) {
      console.error('ChatGPT conversation error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

  app.put('/api/messages/:messageId/read', authMiddleware, async (req, res) => {
    try {
      const success = await storage.markMessageAsRead(req.params.messageId, req.user!.id);
      if (!success) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Mark message as read error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/notifications/:id/read', authMiddleware, async (req, res) => {
    try {
      const success = await storage.markNotificationAsRead(req.params.id, req.user!.id);
      if (!success) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      console.error('Mark notification as read error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/notifications/mark-all-read', authMiddleware, async (req, res) => {
    try {
      const success = await storage.markAllNotificationsAsRead(req.user!.id);
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get notifications for authenticated user
  app.get('/api/notifications', authMiddleware, async (req, res) => {
    try {
      const notifications = await storage.getNotifications(req.user!.id);
      res.json({ notifications });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Email leads capture endpoint
  app.post('/api/email-leads', async (req, res) => {
    try {
      const { email, source } = insertEmailLeadSchema.parse(req.body);
      
      // Generate unique discount code
      const discountCode = `WELCOME${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const lead = await storage.createEmailLead({ email, source, discountCode });
      
      res.status(201).json({
        message: 'Email captured successfully',
        discountCode: lead.discountCode
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      // Check for duplicate email
      if (error.message?.includes('UNIQUE constraint')) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      console.error('Email lead capture error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Apply optional auth to public routes, required auth to protected routes
  app.use('/api/cars', optionalAuthMiddleware);
  app.use('/api/bookings', authMiddleware);
  app.use('/api/reviews', optionalAuthMiddleware);
  
  // Car routes
  app.get("/api/cars", async (req, res) => {
    try {
      const filters = carSearchSchema.parse(req.query);
      const result = await storage.searchCars(filters);
      
      // Enrich cars with owner info and reviews
      const enrichedCars = await Promise.all(
        result.cars.map(async (car) => {
          try {
            const owner = await storage.getUser(car.ownerId);
            const reviews = await storage.getReviewsByCar(car.id);
            
            const averageRating = reviews.length > 0 
              ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
              : 0;

            return {
              ...car,
              owner: owner ? {
                id: owner.id,
                firstName: owner.firstName,
                lastName: owner.lastName,
                profileImage: owner.profileImage
              } : null,
              rating: Number(averageRating.toFixed(1)),
              reviewCount: reviews.length
            };
          } catch (enrichError) {
            // If enrichment fails, return car without enrichment
            return {
              ...car,
              owner: null,
              rating: 0,
              reviewCount: 0
            };
          }
        })
      );
      
      res.json({
        cars: enrichedCars,
        total: result.total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(result.total / filters.limit)
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid search parameters", details: error.errors });
      }
      // Car search error logged internally
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/cars/:id", async (req, res) => {
    try {
      const car = await storage.getCar(req.params.id);
      if (!car) {
        return res.status(404).json({ error: "Vehicle not found" });
      }

      // Get owner info and reviews with error handling
      let owner = null;
      let reviews = [];
      let enrichedReviews = [];

      try {
        owner = await storage.getUser(car.ownerId);
        reviews = await storage.getReviewsByCar(car.id);
        
        // Get enriched reviews with reviewer info
        enrichedReviews = await Promise.all(
          reviews.map(async (review) => {
            try {
              const reviewer = await storage.getUser(review.reviewerId);
              return {
                ...review,
                reviewer: reviewer ? {
                  id: reviewer.id,
                  firstName: reviewer.firstName,
                  lastName: reviewer.lastName,
                  profileImage: reviewer.profileImage
                } : null
              };
            } catch (reviewerError) {
              return {
                ...review,
                reviewer: null
              };
            }
          })
        );
      } catch (enrichError) {
        // If enrichment fails, continue with empty data
        enrichedReviews = reviews.map(review => ({ ...review, reviewer: null }));
      }
      
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

      res.json({
        ...car,
        owner: owner ? sanitizeUser(owner) : null,
        rating: Number(averageRating.toFixed(1)),
        reviewCount: reviews.length,
        reviews: enrichedReviews
      });
    } catch (error) {
      // Get car error logged internally
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get cars by owner
  app.get("/api/cars/owner/:ownerId", async (req, res) => {
    try {
      const cars = await storage.getCarsByOwner(req.params.ownerId);
      res.json({ cars });
    } catch (error) {
      // Get owner cars error logged internally
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/cars", authMiddleware, upload.array('images', 10), async (req, res) => {
    try {
      let carData: any = req.body;
      
      // Handle FormData with file uploads
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        carData = {};
        
        // FormData received for car creation
        
        // Parse form fields with proper type conversion
        Object.keys(req.body).forEach(key => {
          if (key === 'features') {
            try {
              carData[key] = JSON.parse(req.body[key]);
            } catch {
              carData[key] = req.body[key];
            }
          } else if (key === 'images') {
            // Skip images here - we'll handle them separately with uploaded files
            // Don't process blob URLs from form data, use actual uploaded files instead
          } else if (key === 'year' || key === 'seats' || key === 'mileage') {
                  carData[key] = parseInt(req.body[key]);
                } else if (key === 'latitude' || key === 'longitude') {
                  carData[key] = parseFloat(req.body[key]);
                } else if (key === 'pricePerDay') {
                  carData[key] = req.body[key]; // Keep as string for database
          } else if (key === 'isAvailable') {
            carData[key] = req.body[key] === 'true';
          } else {
            carData[key] = req.body[key];
          }
        });
        
        // Handle uploaded files
        const files = req.files as Express.Multer.File[];
        if (files && files.length > 0) {
          // Use the actual uploaded files - convert to data URLs for storage
          carData.images = files.map(file => {
            // Convert uploaded files to data URLs for local storage
            return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          });
        }
        
        // Validate that all images are local only
        if (carData.images) {
          carData.images = validateLocalImages(carData.images);
        }
      }
      
      // Add missing required fields
      const carDataWithDefaults = {
        ...carData,
        ownerId: req.user!.id,
        title: `${carData.make} ${carData.model}`,
        city: carData.location || 'Unknown',
        currency: 'GBP' // Set to GBP as requested by user
      };
      
      // Car data with defaults applied
      
      const validatedCarData = enhancedInsertCarSchema.parse(carDataWithDefaults);
      
      const car = await storage.createCar(validatedCarData);
      res.status(201).json({
        message: "Vehicle created successfully",
        car
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Validation error details logged internally
        return res.status(400).json({ error: "Invalid vehicle data", details: error.errors });
      }
      // Create car error logged internally
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/cars/:id", authMiddleware, requireCarOwnership, upload.array('images', 10), async (req, res) => {
    try {
      let updates: any = req.body;
      
      // Handle FormData with file uploads
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        updates = {};
        
        // FormData received for update
        
        // Parse form fields with proper type conversion
        Object.keys(req.body).forEach(key => {
          if (key === 'features') {
            try {
              updates[key] = JSON.parse(req.body[key]);
            } catch {
              updates[key] = req.body[key];
            }
          } else if (key === 'images') {
            // Skip images here - we'll handle them separately with uploaded files
          } else if (key === 'year' || key === 'seats' || key === 'mileage') {
            updates[key] = parseInt(req.body[key]);
          } else if (key === 'pricePerDay') {
            updates[key] = req.body[key]; // Keep as string for database
          } else if (key === 'isAvailable') {
            updates[key] = req.body[key] === 'true';
          } else {
            updates[key] = req.body[key];
          }
        });
        
        // Handle uploaded files
        const files = req.files as Express.Multer.File[];
        if (files && files.length > 0) {
          // Use the actual uploaded files - convert to data URLs for storage
          updates.images = files.map(file => {
            // Convert uploaded files to data URLs for local storage
            return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          });
        } else if (req.body.images) {
          // If no new files but images field exists, keep existing images
          try {
            updates.images = JSON.parse(req.body.images);
            // Validate that all images are local only
            updates.images = validateLocalImages(updates.images);
          } catch {
            updates.images = req.body.images;
          }
        }
      }
      
      // Add missing required fields if needed
      if (updates.make && updates.model) {
        updates.title = `${updates.make} ${updates.model}`;
      }
      if (updates.location) {
        updates.city = updates.location;
      }
      
      // Car updates applied
      
      const validatedUpdates = enhancedInsertCarSchema.partial().parse(updates);
      const car = await storage.updateCar(req.params.id, validatedUpdates);
      
      if (!car) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      
      res.json({
        message: "Véhicule mis à jour avec succès",
        car
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Validation error details logged internally
        return res.status(400).json({ error: "Invalid vehicle data", details: error.errors });
      }
      // Update car error logged internally
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/cars/:id", authMiddleware, requireCarOwnership, async (req, res) => {
    try {
      const success = await storage.deleteCar(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json({ message: "Véhicule supprimé avec succès" });
    } catch (error) {
      // Delete car error logged internally
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Booking routes
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      // Enrich booking with car and renter information
      const car = await storage.getCar(booking.carId);
      const renter = await storage.getUser(booking.renterId);
      
      const enrichedBooking = {
        ...booking,
        car: car || null,
        renter: renter || null
      };
      
      res.json(enrichedBooking);
    } catch (error) {
      // Get booking error logged internally
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/bookings/renter/:renterId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByRenter(req.params.renterId);
      
      // Enrich bookings with car and owner information
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const car = await storage.getCar(booking.carId);
          const owner = car ? await storage.getUser(car.ownerId) : null;
          
          return {
            ...booking,
            car: car ? {
              id: car.id,
              title: car.title,
              make: car.make,
              model: car.model,
              location: car.location,
              images: car.images
            } : null,
            owner: owner ? {
              id: owner.id,
              firstName: owner.firstName,
              lastName: owner.lastName,
              profileImage: owner.profileImage
            } : null
          };
        })
      );
      
      res.json({ bookings: enrichedBookings });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/bookings/owner/:ownerId", async (req, res) => {
    try {
      // Fetching bookings for owner
      const bookings = await storage.getBookingsByOwner(req.params.ownerId);
      // Found bookings count
      
      // Enrich bookings with car and renter information
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const car = await storage.getCar(booking.carId);
          const renter = await storage.getUser(booking.renterId);
          
          return {
            ...booking,
            car: car ? {
              id: car.id,
              title: car.title,
              make: car.make,
              model: car.model,
              location: car.location,
              images: car.images
            } : null,
            renter: renter ? {
              id: renter.id,
              firstName: renter.firstName,
              lastName: renter.lastName,
              profileImage: renter.profileImage
            } : null
          };
        })
      );
      
      // Enriched bookings count
      res.json({ bookings: enrichedBookings });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/bookings", requireAuth, async (req, res) => {
    try {
  // For SQLite, dates are stored as text strings
  const bookingData = insertBookingSchema.parse(req.body) as unknown;
  // Inline typed alias to satisfy TypeScript in this file (avoid coupling to shared types while schema types
  // may have upstream issues). booking fields are stored as strings in SQLite.
  const b = bookingData as {
    carId: string;
    renterId: string;
    startDate: string;
    endDate: string;
    totalAmount: string;
    status?: string;
  };
      
      // Check if car is available for the requested dates
  const car = await storage.getCar(b.carId);
      if (!car || !car.isAvailable) {
        return res.status(400).json({ error: "Car is not available" });
      }
      
      // Check for conflicting bookings
  const existingBookings = await storage.getBookingsByCar(b.carId);
      const conflictingBooking = existingBookings.find(booking => {
        if (booking.status === "cancelled") return false;
        
  const requestStart = new Date(b.startDate);
  const requestEnd = new Date(b.endDate);
        const existingStart = new Date(booking.startDate);
        const existingEnd = new Date(booking.endDate);
        
        return (requestStart <= existingEnd && requestEnd >= existingStart);
      });
      
      if (conflictingBooking) {
        return res.status(400).json({ error: "Car is already booked for these dates" });
      }
      
  const booking = await storage.createBooking(b as any);
      
      // Send booking confirmation email to renter
      try {
        const renter = await storage.getUser(b.renterId);
        const car = await storage.getCar(b.carId);
        if (renter && car) {
          await EmailService.sendBookingConfirmation({
            to: renter.email,
            firstName: renter.firstName,
            carTitle: car.title,
            startDate: b.startDate,
            endDate: b.endDate,
            totalAmount: parseFloat(String(b.totalAmount)),
            currency: car.currency,
            bookingId: booking.id
          });
        }
      } catch (emailError) {
        console.error('Failed to send booking confirmation email:', emailError);
        // Don't fail the booking if email fails
      }
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/bookings/:id", requireAuth, async (req, res) => {
    try {
      const updates: { status?: string; startDate?: string; endDate?: string; totalAmount?: string } = insertBookingSchema.partial().parse(req.body);
      const booking = await storage.updateBooking(req.params.id, updates);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      // Send confirmation email if booking status changed to confirmed
      if (updates.status === 'confirmed') {
        try {
          const renter = await storage.getUser(booking.renterId);
          const car = await storage.getCar(booking.carId);
          if (renter && car) {
            await EmailService.sendBookingConfirmation({
              to: renter.email,
              firstName: renter.firstName,
              carTitle: car.title,
              startDate: booking.startDate,
              endDate: booking.endDate,
              totalAmount: booking.totalAmount,
              currency: car.currency,
              bookingId: booking.id
            });
          }
        } catch (emailError) {
          console.error('Failed to send booking confirmation email:', emailError);
          // Don't fail the booking update if email fails
        }
      }
      
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/bookings/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.cancelBooking(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Review routes
  app.get("/api/reviews/car/:carId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByCar(req.params.carId);
      
      // Enrich reviews with reviewer information
      const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
          const reviewer = await storage.getUser(review.reviewerId);
          return {
            ...review,
            reviewer: reviewer ? {
              id: reviewer.id,
              firstName: reviewer.firstName,
              lastName: reviewer.lastName,
              profileImage: reviewer.profileImage
            } : null
          };
        })
      );
      
      res.json(enrichedReviews);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/reviews", requireAuth, async (req, res) => {
    try {
  const reviewData = insertReviewSchema.parse(req.body) as unknown;
  const r = reviewData as {
    bookingId: string;
    carId: string;
    reviewerId: string;
    rating: number;
    comment?: string;
  };
      
      // Verify the booking exists and is completed
  const booking = await storage.getBooking(r.bookingId);
      if (!booking || booking.status !== "completed") {
        return res.status(400).json({ error: "Can only review completed bookings" });
      }
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid review data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/reviews/user/:userId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByUser(req.params.userId);
      
      // Enrich reviews with car and reviewer information
      const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
          const car = await storage.getCar(review.carId);
          const reviewer = await storage.getUser(review.reviewerId);
          return {
            ...review,
            car: car ? {
              id: car.id,
              title: car.title,
              make: car.make,
              model: car.model,
              images: car.images
            } : null,
            reviewer: reviewer ? {
              id: reviewer.id,
              firstName: reviewer.firstName,
              lastName: reviewer.lastName,
              profileImage: reviewer.profileImage
            } : null
          };
        })
      );
      
      res.json({ reviews: enrichedReviews });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Owner stats route
  app.get("/api/owners/:ownerId/stats", async (req, res) => {
    try {
      const stats = await storage.getOwnerStats(req.params.ownerId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Payment routes (only if Stripe is configured)
  if (process.env.STRIPE_SECRET_KEY) {
    app.post("/api/payments/create-intent", authMiddleware, async (req, res) => {
      try {
        const { amount, currency, bookingId, customerEmail, customerName, carTitle, mockPayment } = req.body;
        
        if (!amount || !currency || !bookingId || !customerEmail || !customerName || !carTitle) {
          return res.status(400).json({ error: "Missing required payment data" });
        }

        // Use mock payment if requested or if in development mode
        if (mockPayment || process.env.NODE_ENV === 'development') {
          // Simulate successful payment for development
          res.json({
            clientSecret: "pi_mock_" + Date.now(),
            paymentIntentId: "pi_mock_" + Date.now(),
          });
          return;
        }

        const PaymentService = (await import("./services/payment")).default;
        const result = await PaymentService.createPaymentIntent({
          amount,
          currency,
          bookingId,
          customerEmail,
          customerName,
          carTitle,
        });

        if (!result.success) {
          return res.status(400).json({ error: result.error });
        }

        res.json({
          clientSecret: result.clientSecret,
          paymentIntentId: result.paymentIntentId,
        });
      } catch (error) {
        console.error("Payment intent creation failed:", error);
        res.status(500).json({ error: "Payment processing failed" });
      }
    });
  } else {
    // Mock payment endpoint for development
    app.post("/api/payments/create-intent", authMiddleware, async (req, res) => {
      try {
        const { amount, currency, bookingId } = req.body;
        
        if (!amount || !currency || !bookingId) {
          return res.status(400).json({ error: "Missing required payment data" });
        }

        // Simulate successful payment for development
        res.json({
          clientSecret: "pi_mock_" + Date.now(),
          paymentIntentId: "pi_mock_" + Date.now(),
        });
      } catch (error) {
        console.error("Mock payment creation failed:", error);
        res.status(500).json({ error: "Payment processing failed" });
      }
    });
  }

  app.get("/api/payments/status/:paymentIntentId", authMiddleware, async (req, res) => {
    try {
      // Check if this is a mock payment
      if (req.params.paymentIntentId.startsWith('pi_mock_')) {
        // Mock payment status for development
        res.json({ status: "succeeded", paymentIntentId: req.params.paymentIntentId });
        return;
      }

      if (process.env.STRIPE_SECRET_KEY) {
        const PaymentService = (await import("./services/payment")).default;
        const result = await PaymentService.confirmPaymentIntent(req.params.paymentIntentId);

        if (!result.success) {
          return res.status(400).json({ error: result.error });
        }

        res.json({ status: "succeeded", paymentIntentId: result.paymentIntentId });
      } else {
        // Mock payment status for development
        res.json({ status: "succeeded", paymentIntentId: req.params.paymentIntentId });
      }
    } catch (error) {
      console.error("Payment status check failed:", error);
      res.status(500).json({ error: "Failed to check payment status" });
    }
  });

  app.post("/api/payments/refund", authMiddleware, async (req, res) => {
    try {
      const { paymentIntentId, amount } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ error: "Payment intent ID is required" });
      }

      if (process.env.STRIPE_SECRET_KEY) {
        const PaymentService = (await import("./services/payment")).default;
        const result = await PaymentService.refundPayment(paymentIntentId, amount);

        if (!result.success) {
          return res.status(400).json({ error: result.error });
        }

        res.json({ success: true, paymentIntentId: result.paymentIntentId });
      } else {
        // Mock refund for development
        res.json({ success: true, paymentIntentId });
      }
    } catch (error) {
      console.error("Refund failed:", error);
      res.status(500).json({ error: "Refund processing failed" });
    }
  });

  // Register admin routes
  registerAdminRoutes(app);

  // Facebook OAuth callback route
  app.get('/auth/facebook/callback', async (req, res) => {
    console.log('Facebook callback route hit!', req.query);
    try {
      const { code, error } = req.query;
      
      if (error) {
        console.error('Facebook OAuth error:', error);
        return res.redirect('/login?error=facebook_auth_failed');
      }
      
      if (!code) {
        return res.redirect('/login?error=no_auth_code');
      }
      
      // Exchange code for access token
      const facebookAppId = process.env.FACEBOOK_APP_ID || '879130531438151';
      const facebookAppSecret = process.env.FACEBOOK_APP_SECRET || 'your-facebook-app-secret';
      const redirectUri = `${req.protocol}://${req.get('host')}/auth/facebook/callback`;
      
      if (!facebookAppId || !facebookAppSecret) {
        console.error('Facebook OAuth not configured');
        return res.redirect('/login?error=oauth_not_configured');
      }
      
      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: facebookAppId,
          client_secret: facebookAppSecret,
          redirect_uri: redirectUri,
          code: code as string,
        }),
      });
      
      const tokenData = await tokenResponse.json();
      
      if (!tokenData.access_token) {
        console.error('Failed to get Facebook access token:', tokenData);
        return res.redirect('/login?error=token_exchange_failed');
      }
      
      // Get user information from Facebook
      const userResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`);
      const userData = await userResponse.json();
      
      if (!userData.id) {
        console.error('Failed to get Facebook user data:', userData);
        return res.redirect('/login?error=user_data_failed');
      }
      
      // Process the OAuth login
      const response = await fetch(`${req.protocol}://${req.get('host')}/api/auth/oauth/facebook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: tokenData.access_token,
          userID: userData.id,
        }),
      });
      
      const authData = await response.json();
      
      if (response.ok) {
        // Redirect to frontend with token - AuthContext will handle user data fetching
        const redirectUrl = new URL('/', `${req.protocol}://${req.get('host')}`);
        redirectUrl.searchParams.set('token', authData.token);
        return res.redirect(redirectUrl.toString());
      } else {
        console.error('OAuth processing failed:', authData);
        return res.redirect('/login?error=oauth_processing_failed');
      }
      
    } catch (error) {
      console.error('Facebook callback error:', error);
      res.redirect('/login?error=callback_error');
    }
  });

  // Register OAuth routes
  app.use('/api/auth/oauth', oauthRoutes);

  // Health check (resilient in dev without DB helpers)
  app.get("/api/health", async (_req, res) => {
    try {
      let usersCount = 0;
      let carsCount = 0;
      let dbConnected = false;

      try {
        const users = await (storage as any).getAllUsers?.();
        if (Array.isArray(users)) {
          usersCount = users.length;
          dbConnected = true;
        }
      } catch {}

      try {
        const cars = await (storage as any).getAllCars?.();
        if (Array.isArray(cars)) {
          carsCount = cars.length;
        }
      } catch {}

      if (carsCount === 0) {
        try {
          const result = await storage.searchCars({ page: 1, limit: 1 } as any);
          carsCount = result?.total ?? 0;
        } catch {}
      }

      res.json({ 
        status: "ok", 
        message: "Tomobilto API is running",
        database: {
          users: usersCount,
          cars: carsCount,
          connected: dbConnected
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: "Database connection failed",
        database: {
          connected: false,
          error: (error as any).message
        },
        timestamp: new Date().toISOString()
      });
    }
  });

  // Database status check
  app.get("/api/debug/database", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const cars = await storage.getAllCars();
      
      res.json({
        status: "ok",
        users: users.length,
        cars: cars.length,
        sampleCars: cars.slice(0, 3).map(car => ({
          id: car.id,
          title: car.title,
          make: car.make,
          model: car.model,
          pricePerDay: car.pricePerDay,
          city: car.city,
          isAvailable: car.isAvailable
        }))
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: error.message,
        users: 0,
        cars: 0
      });
    }
  });



  // Routes registered successfully
  return app;
}