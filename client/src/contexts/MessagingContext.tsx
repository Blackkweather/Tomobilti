import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

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

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const newSocket = io('http://localhost:5000', {
          auth: {
            token: token
          }
        });

        newSocket.on('connect', () => {
          console.log('Connected to messaging server');
          setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from messaging server');
          setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Connection error:', error);
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
