import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  ArrowLeft, 
  Trash2, 
  Settings, 
  Filter, 
  Search, 
  RefreshCw,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Calendar,
  DollarSign,
  Car,
  User,
  Clock,
  MoreHorizontal,
  Archive,
  Pin,
  Eye,
  EyeOff
} from 'lucide-react';
import { useLocation, Link } from 'wouter';


const Notifications: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());
  const [pinnedNotifications, setPinnedNotifications] = useState<Set<string>>(new Set());
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { data: notificationsData, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => notificationApi.getNotifications(),
    enabled: !!user,
  });

  // Real-time WebSocket connection
  useEffect(() => {
    if (!user || !isAuthenticated) return;

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`ws://localhost:5000/notifications/${user.id}`);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected for notifications');
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'notification') {
              // Add new notification to the list
              setNotifications(prev => [data.notification, ...prev]);
              
              // Show browser notification if permission granted
              if (Notification.permission === 'granted') {
                new Notification(data.notification.title, {
                  body: data.notification.message,
                  icon: '/assets/MAIN LOGO.png'
                });
              }
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          // Reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user, isAuthenticated]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData.notifications || []);
      setLoading(false);
    }
  }, [notificationsData]);

  // Enhanced filtering and search
  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'unread' && !notification.isRead) ||
      (activeTab === 'pinned' && pinnedNotifications.has(notification.id));
    
    const matchesType = filterType === 'all' || notification.type === filterType;
    
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesType && matchesSearch;
  });

  // Calculate notification statistics
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    pinned: pinnedNotifications.size,
    byType: {
      booking: notifications.filter(n => n.type === 'booking').length,
      payment: notifications.filter(n => n.type === 'payment').length,
      system: notifications.filter(n => n.type === 'system').length,
      message: notifications.filter(n => n.type === 'message').length,
    }
  };

  const toggleNotificationExpansion = (notificationId: string) => {
    const newExpanded = new Set(expandedNotifications);
    if (newExpanded.has(notificationId)) {
      newExpanded.delete(notificationId);
    } else {
      newExpanded.add(notificationId);
    }
    setExpandedNotifications(newExpanded);
  };

  const togglePinNotification = (notificationId: string) => {
    const newPinned = new Set(pinnedNotifications);
    if (newPinned.has(notificationId)) {
      newPinned.delete(notificationId);
    } else {
      newPinned.add(notificationId);
    }
    setPinnedNotifications(newPinned);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'payment': return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'system': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'message': return <MessageSquare className="h-5 w-5 text-purple-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking': return 'border-l-blue-500 bg-blue-50';
      case 'payment': return 'border-l-green-500 bg-green-50';
      case 'system': return 'border-l-orange-500 bg-orange-50';
      case 'message': return 'border-l-purple-500 bg-purple-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // For now, just remove from local state since API method doesn't exist
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      // For now, just clear local state since API method doesn't exist
      setNotifications([]);
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You need to be logged in to view notifications.
            </p>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">Stay updated with real-time notifications</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Bell className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Unread</p>
                    <p className="text-2xl font-bold">{stats.unread}</p>
                  </div>
                  <Eye className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Pinned</p>
                    <p className="text-2xl font-bold">{stats.pinned}</p>
                  </div>
                  <Pin className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Today</p>
                    <p className="text-2xl font-bold">
                      {notifications.filter(n => {
                        const today = new Date();
                        const notificationDate = new Date(n.createdAt);
                        return notificationDate.toDateString() === today.toDateString();
                      }).length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Controls */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="booking">Booking</option>
                    <option value="payment">Payment</option>
                    <option value="system">System</option>
                    <option value="message">Message</option>
                  </select>
                  
                  <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                  
                  <Button onClick={handleDeleteAllNotifications} variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({stats.unread})
              </TabsTrigger>
              <TabsTrigger value="pinned">
                Pinned ({stats.pinned})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No notifications found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm || filterType !== "all" || activeTab !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "You're all caught up! No new notifications."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredNotifications.map((notification) => (
                      <Card 
                        key={notification.id} 
                        className={`hover:shadow-lg transition-all duration-200 ${
                          !notification.isRead ? 'ring-2 ring-blue-200' : ''
                        } ${getNotificationColor(notification.type)}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className={`text-lg font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                      {notification.title}
                                    </h3>
                                    {pinnedNotifications.has(notification.id) && (
                                      <Pin className="h-4 w-4 text-yellow-500" />
                                    )}
                                    {!notification.isRead && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                  </div>
                                  
                                  <p className="text-gray-600 mb-3 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{formatTimeAgo(notification.createdAt)}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {notification.type}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => togglePinNotification(notification.id)}
                                  >
                                    <Pin className={`h-4 w-4 ${pinnedNotifications.has(notification.id) ? 'text-yellow-500' : 'text-gray-400'}`} />
                                  </Button>
                                  
                                  {!notification.isRead && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                      <Eye className="h-4 w-4 text-gray-400" />
                                    </Button>
                                  )}
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleNotificationExpansion(notification.id)}
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteNotification(notification.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-400" />
                                  </Button>
                                </div>
                              </div>
                              
                              {expandedNotifications.has(notification.id) && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <div className="space-y-3">
                                    <div>
                                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Full Message:</h4>
                                      <p className="text-gray-600 text-sm leading-relaxed">
                                        {notification.message}
                                      </p>
                                    </div>
                                    
                                    {notification.data && (
                                      <div>
                                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Additional Data:</h4>
                                        <pre className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                                          {JSON.stringify(notification.data, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                    
                                    <div className="flex gap-2">
                                      {!notification.isRead && (
                                        <Button
                                          size="sm"
                                          onClick={() => handleMarkAsRead(notification.id)}
                                        >
                                          <Check className="h-4 w-4 mr-1" />
                                          Mark as Read
                                        </Button>
                                      )}
                                      
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => togglePinNotification(notification.id)}
                                      >
                                        <Pin className="h-4 w-4 mr-1" />
                                        {pinnedNotifications.has(notification.id) ? 'Unpin' : 'Pin'}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Notifications;
