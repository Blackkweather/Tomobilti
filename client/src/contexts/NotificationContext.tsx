import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import PushNotificationService from '../utils/pushNotifications';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  priority?: 'low' | 'medium' | 'high';
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  socket: Socket | null;
  isConnected: boolean;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  subscribeToPush: () => Promise<void>;
  unsubscribeFromPush: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Initialize service worker and push notifications
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      PushNotificationService.register();
    }
  }, []);

  // Connect to notification WebSocket
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const socketUrl = process.env.NODE_ENV === 'production' 
          ? window.location.origin 
          : 'http://localhost:5000';
        
        const newSocket = io(`${socketUrl}/notifications-socket`, {
          auth: {
            token: token
          },
          transports: ['websocket', 'polling'],
          reconnection: true
        });

        newSocket.on('connect', () => {
          console.log('✅ Connected to notification server');
          setIsConnected(true);
          // Authenticate with user ID
          newSocket.emit('authenticate', user.id);
        });

        newSocket.on('connect_error', (error) => {
          console.error('❌ Notification connection error:', error);
          setIsConnected(false);
        });

        newSocket.on('disconnect', () => {
          console.log('📱 Disconnected from notification server');
          setIsConnected(false);
        });

        // Listen for new notifications
        newSocket.on('notification', (notification: Notification) => {
          console.log('📱 New notification received:', notification);
          setNotifications((prev) => [notification, ...prev]);

          // Show browser notification if permission granted
          if ('Notification' in window && Notification.permission === 'granted') {
            PushNotificationService.showNotification(notification.title, {
              body: notification.message,
              data: notification.data,
              tag: notification.id
            });
          }
        });

        setSocket(newSocket);

        return () => {
          newSocket.disconnect();
        };
      }
    }
  }, [isAuthenticated, user]);

  // Fetch existing notifications from API
  useEffect(() => {
    if (isAuthenticated && user) {
      fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.notifications) {
            setNotifications(data.notifications);
          }
        })
        .catch(error => {
          console.error('Failed to fetch notifications:', error);
        });
    }
  }, [isAuthenticated, user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );

      if (socket) {
        socket.emit('notification_read', notificationId);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const subscribeToPush = async () => {
    await PushNotificationService.subscribe();
  };

  const unsubscribeFromPush = async () => {
    await PushNotificationService.unsubscribe();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        socket,
        isConnected,
        markAsRead,
        markAllAsRead,
        subscribeToPush,
        unsubscribeFromPush
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

