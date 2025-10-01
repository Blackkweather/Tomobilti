import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

// Global WebSocket override to prevent undefined port connections
if (typeof window !== 'undefined') {
  const OriginalWebSocket = window.WebSocket;
  window.WebSocket = class extends OriginalWebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      const urlString = url.toString();
      
      // Check for undefined port in URL
      if (urlString.includes('undefined')) {
        console.warn('🚫 Global WebSocket override: Blocking connection with undefined port:', urlString);
        // Create a mock WebSocket that immediately closes
        super('ws://localhost:5000', protocols);
        setTimeout(() => this.close(), 0);
        return;
      }
      
      // Allow valid connections
      super(url, protocols);
    }
  };
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  bookingId: string;
  ownerId: string;
  renterId: string;
  lastMessageAt: string;
  createdAt: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  renter?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  booking?: {
    id: string;
    carId: string;
  };
  lastMessage?: Message;
  unreadCount: number;
}

interface MessagingContextType {
  socket: Socket | null;
  isConnected: boolean;
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  sendMessage: (conversationId: string, content: string) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  markMessageAsRead: (messageId: string) => void;
  typingUsers: string[];
  setTypingUsers: (users: string[]) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

interface MessagingProviderProps {
  children: ReactNode;
}

export const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Add cache busting to force fresh code load
  useEffect(() => {
    console.log('🔄 MessagingContext: Component mounted/updated - forcing fresh WebSocket connection');
    console.log('🔄 MessagingContext: Timestamp:', new Date().toISOString());
    console.log('🔄 MessagingContext: User Agent:', navigator.userAgent);
    
    // Override problematic WebSocket connections immediately
    if (typeof window !== 'undefined') {
      // Store original WebSocket constructor
      const OriginalWebSocket = window.WebSocket;
      
      // Override WebSocket to prevent undefined port connections
      window.WebSocket = class extends OriginalWebSocket {
        constructor(url: string | URL, protocols?: string | string[]) {
          const urlString = url.toString();
          
          console.log('🔌 WebSocket override: Attempting to connect to:', urlString);
          
          // Check for undefined port in URL
          if (urlString.includes('undefined')) {
            console.warn('🚫 WebSocket override: Blocking connection with undefined port:', urlString);
            // Create a mock WebSocket that immediately closes
            super('ws://localhost:5000', protocols);
            setTimeout(() => this.close(), 0);
            return;
          }
          
          // Allow valid connections
          console.log('✅ WebSocket override: Allowing valid connection:', urlString);
          super(url, protocols);
        }
      };
      
      // Also override any existing Socket.IO WebSocket connections
      if (window.io) {
        console.log('🔧 MessagingContext: Socket.IO found, ensuring proper configuration');
      }
      
      // Restore original WebSocket after component unmounts
      return () => {
        window.WebSocket = OriginalWebSocket;
      };
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Use explicit URL to avoid undefined port issues
        const socketUrl = process.env.NODE_ENV === 'production' 
          ? window.location.origin 
          : 'http://localhost:5000';
        
        console.log('🔌 MessagingContext: Connecting to WebSocket at:', socketUrl);
        console.log('🔌 MessagingContext: Current window.location.origin:', window.location.origin);
        
        // Disconnect any existing socket first
        if (socket) {
          console.log('🔌 MessagingContext: Disconnecting existing socket');
          socket.disconnect();
        }
        
        const newSocket = io(socketUrl, {
          auth: {
            token: token
          },
          transports: ['websocket', 'polling'],
          timeout: 20000,
          forceNew: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        newSocket.on('connect', () => {
          console.log('✅ MessagingContext: Connected to messaging server');
          setIsConnected(true);
        });

        newSocket.on('connect_error', (error) => {
          console.error('🔌 MessagingContext: Connection error:', error);
          console.error('🔌 MessagingContext: Error details:', {
            message: error.message,
            description: error.description,
            context: error.context,
            type: error.type
          });
          setIsConnected(false);
        });

        newSocket.on('disconnect', (reason) => {
          console.log('🔌 MessagingContext: Disconnected from messaging server. Reason:', reason);
          setIsConnected(false);
        });

        // Listen for new messages
        newSocket.on('new-message', (message: Message) => {
          console.log('New message received:', message);
          
          // Add message to current conversation if it matches
          if (currentConversation && message.conversationId === currentConversation.id) {
            setMessages(prev => [...prev, message]);
          }

          // Update conversations list with new message
          setConversations(prev => prev.map(conv => {
            if (conv.id === message.conversationId) {
              return {
                ...conv,
                lastMessage: message,
                lastMessageAt: message.createdAt,
                unreadCount: message.senderId !== user.id ? conv.unreadCount + 1 : conv.unreadCount
              };
            }
            return conv;
          }));
        });

        // Listen for typing indicators
        newSocket.on('user-typing', (data: { userId: string; isTyping: boolean }) => {
          if (data.isTyping) {
            setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
          } else {
            setTypingUsers(prev => prev.filter(id => id !== data.userId));
          }
        });

        // Listen for message read status
        newSocket.on('message-read', (data: { messageId: string; readBy: string }) => {
          setMessages(prev => prev.map(msg => 
            msg.id === data.messageId ? { ...msg, isRead: true } : msg
          ));
        });

        // Listen for user status updates
        newSocket.on('user-status', (data: { userId: string; status: string }) => {
          console.log(`User ${data.userId} is ${data.status}`);
        });

        setSocket(newSocket);

        return () => {
          newSocket.close();
        };
      }
    }
  }, [isAuthenticated, user, currentConversation]);

  const sendMessage = (conversationId: string, content: string) => {
    if (socket && content.trim()) {
      socket.emit('send-message', {
        conversationId,
        content: content.trim(),
        messageType: 'text'
      });
    }
  };

  const joinConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('join-conversation', conversationId);
    }
  };

  const leaveConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('leave-conversation', conversationId);
    }
  };

  const markMessageAsRead = (messageId: string) => {
    if (socket && currentConversation) {
      socket.emit('mark-message-read', {
        messageId,
        conversationId: currentConversation.id
      });
    }
  };

  const value: MessagingContextType = {
    socket,
    isConnected,
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    messages,
    setMessages,
    sendMessage,
    joinConversation,
    leaveConversation,
    markMessageAsRead,
    typingUsers,
    setTypingUsers
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

export default MessagingProvider;
