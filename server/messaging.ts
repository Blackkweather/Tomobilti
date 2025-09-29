import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export class MessagingSocketServer {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:5000", "http://127.0.0.1:5000"],
        methods: ["GET", "POST"]
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        (socket as AuthenticatedSocket).userId = decoded.userId;
        next();
      } catch (err) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User ${socket.userId} connected with socket ${socket.id}`);
      
      // Store user connection
      if (socket.userId) {
        this.connectedUsers.set(socket.userId, socket.id);
      }

      // Join user to their personal room
      socket.join(`user:${socket.userId}`);

      // Handle joining conversation rooms
      socket.on('join-conversation', (conversationId: string) => {
        socket.join(`conversation:${conversationId}`);
        console.log(`User ${socket.userId} joined conversation ${conversationId}`);
      });

      // Handle leaving conversation rooms
      socket.on('leave-conversation', (conversationId: string) => {
        socket.leave(`conversation:${conversationId}`);
        console.log(`User ${socket.userId} left conversation ${conversationId}`);
      });

      // Handle sending messages
      socket.on('send-message', async (data: {
        conversationId: string;
        content: string;
        messageType?: string;
      }) => {
        try {
          console.log(`User ${socket.userId} sending message to conversation ${data.conversationId}`);
          
          // Emit to all users in the conversation
          this.io.to(`conversation:${data.conversationId}`).emit('new-message', {
            id: crypto.randomUUID(),
            conversationId: data.conversationId,
            senderId: socket.userId,
            content: data.content,
            messageType: data.messageType || 'text',
            createdAt: new Date().toISOString(),
            isRead: false
          });

          // Emit typing indicator
          socket.to(`conversation:${data.conversationId}`).emit('user-typing', {
            userId: socket.userId,
            isTyping: false
          });

        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle typing indicators
      socket.on('typing', (data: { conversationId: string; isTyping: boolean }) => {
        socket.to(`conversation:${data.conversationId}`).emit('user-typing', {
          userId: socket.userId,
          isTyping: data.isTyping
        });
      });

      // Handle message read status
      socket.on('mark-message-read', (data: { messageId: string; conversationId: string }) => {
        socket.to(`conversation:${data.conversationId}`).emit('message-read', {
          messageId: data.messageId,
          readBy: socket.userId
        });
      });

      // Handle user online status
      socket.on('user-online', () => {
        socket.broadcast.emit('user-status', {
          userId: socket.userId,
          status: 'online'
        });
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User ${socket.userId} disconnected`);
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          socket.broadcast.emit('user-status', {
            userId: socket.userId,
            status: 'offline'
          });
        }
      });
    });
  }

  // Method to send notification to specific user
  public sendNotificationToUser(userId: string, notification: any) {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }

  // Method to send message to conversation
  public sendMessageToConversation(conversationId: string, message: any) {
    this.io.to(`conversation:${conversationId}`).emit('new-message', message);
  }

  // Method to check if user is online
  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Method to get online users
  public getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}

export default MessagingSocketServer;
