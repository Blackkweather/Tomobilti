import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export interface NotificationData {
  userId: string;
  type: 'booking_confirmed' | 'booking_cancelled' | 'payment_received' | 'car_available' | 'review_received' | 'message_received';
  title: string;
  message: string;
  data?: any;
  priority?: 'low' | 'medium' | 'high';
}

export class NotificationService {
  private static io: SocketIOServer;
  private static connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  /**
   * Initialize Socket.IO server
   */
  static initialize(httpServer: HTTPServer): SocketIOServer {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5000",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`📱 User connected: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', (userId: string) => {
        this.connectedUsers.set(userId, socket.id);
        socket.join(`user_${userId}`);
        console.log(`✅ User ${userId} authenticated for notifications`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        // Remove user from connected users
        for (const [userId, socketId] of this.connectedUsers.entries()) {
          if (socketId === socket.id) {
            this.connectedUsers.delete(userId);
            console.log(`📱 User ${userId} disconnected from notifications`);
            break;
          }
        }
      });

      // Handle notification acknowledgment
      socket.on('notification_read', (notificationId: string) => {
        console.log(`📱 Notification ${notificationId} marked as read`);
      });
    });

    return this.io;
  }

  /**
   * Send notification to a specific user
   */
  static async sendToUser(notification: NotificationData): Promise<boolean> {
    try {
      if (!this.io) {
        console.error('Notification service not initialized');
        return false;
      }

      const notificationPayload = {
        id: this.generateNotificationId(),
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        priority: notification.priority || 'medium',
        timestamp: new Date().toISOString(),
        read: false
      };

      // Send to user's room
      this.io.to(`user_${notification.userId}`).emit('notification', notificationPayload);

      // Also send to specific socket if user is connected
      const socketId = this.connectedUsers.get(notification.userId);
      if (socketId) {
        this.io.to(socketId).emit('notification', notificationPayload);
      }

      console.log(`📱 Notification sent to user ${notification.userId}: ${notification.title}`);
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  /**
   * Send notification to multiple users
   */
  static async sendToUsers(userIds: string[], notification: Omit<NotificationData, 'userId'>): Promise<boolean> {
    try {
      const promises = userIds.map(userId => 
        this.sendToUser({ ...notification, userId })
      );
      
      const results = await Promise.all(promises);
      return results.every(result => result);
    } catch (error) {
      console.error('Failed to send notifications to multiple users:', error);
      return false;
    }
  }

  /**
   * Send notification to all connected users
   */
  static async sendToAll(notification: Omit<NotificationData, 'userId'>): Promise<boolean> {
    try {
      if (!this.io) {
        console.error('Notification service not initialized');
        return false;
      }

      const notificationPayload = {
        id: this.generateNotificationId(),
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        priority: notification.priority || 'medium',
        timestamp: new Date().toISOString(),
        read: false
      };

      this.io.emit('notification', notificationPayload);
      console.log(`📱 Broadcast notification sent: ${notification.title}`);
      return true;
    } catch (error) {
      console.error('Failed to send broadcast notification:', error);
      return false;
    }
  }

  /**
   * Get connected users count
   */
  static getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Check if user is connected
   */
  static isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  /**
   * Generate unique notification ID
   */
  private static generateNotificationId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Predefined notification templates
   */
  static templates = {
    bookingConfirmed: (carTitle: string, startDate: string): Omit<NotificationData, 'userId'> => ({
      type: 'booking_confirmed',
      title: 'Booking Confirmed! 🎉',
      message: `Your booking for ${carTitle} starting ${startDate} has been confirmed.`,
      priority: 'high'
    }),

    bookingCancelled: (carTitle: string, reason?: string): Omit<NotificationData, 'userId'> => ({
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `Your booking for ${carTitle} has been cancelled.${reason ? ` Reason: ${reason}` : ''}`,
      priority: 'high'
    }),

    paymentReceived: (amount: number, currency: string): Omit<NotificationData, 'userId'> => ({
      type: 'payment_received',
      title: 'Payment Received 💰',
      message: `Payment of ${amount} ${currency} has been successfully processed.`,
      priority: 'medium'
    }),

    carAvailable: (carTitle: string): Omit<NotificationData, 'userId'> => ({
      type: 'car_available',
      title: 'Car Available! 🚗',
      message: `${carTitle} is now available for booking.`,
      priority: 'medium'
    }),

    reviewReceived: (carTitle: string, rating: number): Omit<NotificationData, 'userId'> => ({
      type: 'review_received',
      title: 'New Review Received ⭐',
      message: `You received a ${rating}-star review for ${carTitle}.`,
      priority: 'low'
    }),

    messageReceived: (senderName: string): Omit<NotificationData, 'userId'> => ({
      type: 'message_received',
      title: 'New Message 💬',
      message: `You have a new message from ${senderName}.`,
      priority: 'medium'
    })
  };
}

export default NotificationService;



