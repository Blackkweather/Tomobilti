import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Search, Menu, Car, User, Settings, LogOut, Plus, Shield, Bell, Clock, Star, MapPin, ChevronDown, Crown, MessageCircle, HelpCircle, Headphones, PoundSterling, Phone, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { notificationApi } from '../lib/api';
import LoadingSpinner from './LoadingSpinner';
import CarFilterDropdown from './CarFilterDropdown';
import { LocationPicker } from './LocationPicker';

export default function Header() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, loading, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [showCarFilter, setShowCarFilter] = useState(false);

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const response = await notificationApi.getNotifications();
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
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

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };


  const handleSearch = () => {
    if (searchQuery.trim()) {
      const params = new URLSearchParams({ location: searchQuery.trim() });
      setLocation(`/cars?${params.toString()}`);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container flex h-16 items-center justify-center px-4">
          <LoadingSpinner size="sm" />
        </div>
      </header>
    );
  }

  const navItems = [
    // Company Section
    { 
      href: '/about', 
      label: 'About Us',
      description: 'Learn about ShareWheelz and our mission.',
      icon: User,
      subItems: [
        { href: '/about', label: 'Our Story', description: 'Learn about ShareWheelz' },
        { href: '/how-it-works', label: 'How It Works', description: 'See how our platform works' }
      ]
    },
    { 
      href: '/how-it-works', 
      label: 'How It Works',
      description: 'Understand how ShareWheelz works for you.',
      icon: HelpCircle,
      subItems: [
        { href: '/how-it-works', label: 'For Renters', description: 'How to rent a car' },
        { href: '/how-it-works', label: 'For Owners', description: 'How to list your car' }
      ]
    },
    
    // Services Section
    { 
      href: '/cars', 
      label: 'Rent a Car',
      description: 'Find and book a car easily near you.',
      icon: Car,
      subItems: [
        { href: '/cars', label: 'Browse Cars', description: 'Search our wide selection', isFilterable: true },
        { href: '/favorites', label: 'My Favorites', description: 'Saved vehicles' }
      ]
    },
    { 
      href: '/become-member', 
      label: 'Become a Member',
      description: 'Get access to exclusive benefits and a secure community.',
      icon: Crown,
      subItems: [
        { href: '/become-member', label: 'Join Now', description: 'Start your membership' },
        { href: '/membership-benefits', label: 'Benefits', description: 'See all perks' },
        { href: '/loyalty-program', label: 'Loyalty Program', description: 'Earn points' }
      ]
    },
    { 
      href: '/add-car-dynamic', 
      label: 'Fleet Management',
      description: 'Manage your vehicle fleet and maximize earnings.',
      icon: PoundSterling,
      subItems: [
        { href: '/add-car-dynamic', label: 'List Your Car', description: 'Start earning today' },
        { href: '/become-host', label: 'Become a Host', description: 'Learn how to earn' },
        { href: '/earnings-calculator', label: 'Earnings Calculator', description: 'Calculate your potential' },
        { href: '/car-management', label: 'Manage Cars', description: 'Track your listings' }
      ]
    },
    { 
      href: '/business', 
      label: 'Business Solutions',
      description: 'Enterprise solutions for businesses.',
      icon: Shield,
      subItems: [
        { href: '/business', label: 'Corporate Accounts', description: 'Business solutions' },
        { href: '/business', label: 'Fleet Services', description: 'Fleet management' }
      ]
    },
    
    // Support Section
    { 
      href: '/support', 
      label: 'Help Center',
      description: 'Find answers to common questions.',
      icon: HelpCircle,
      subItems: [
        { href: '/support', label: 'Help Center', description: 'Find answers to common questions' },
        { href: '/faq', label: 'FAQ', description: 'Frequently asked questions' }
      ]
    },
    { 
      href: '/contact', 
      label: 'Contact Us',
      description: 'Get in touch with our team.',
      icon: Phone,
      subItems: [
        { href: '/contact', label: 'Contact Us', description: 'Get in touch with our team' },
        { href: '/live-chat', label: 'Live Chat', description: 'Chat with our support team' }
      ]
    },
    { 
      href: '/safety', 
      label: 'Safety Center',
      description: 'Safety guidelines and emergency assistance.',
      icon: Shield,
      subItems: [
        { href: '/safety', label: 'Safety Guidelines', description: 'Safety best practices' },
        { href: '/roadside-assistance', label: 'Roadside Assistance', description: '24/7 emergency help' }
      ]
    },
    { 
      href: '/guidelines', 
      label: 'Community Guidelines',
      description: 'Community rules and guidelines.',
      icon: Users,
      subItems: [
        { href: '/guidelines', label: 'Community Guidelines', description: 'Community rules' },
        { href: '/terms', label: 'Terms of Service', description: 'Terms and conditions' }
      ]
    },
    { 
      href: '/report', 
      label: 'Report a Problem',
      description: 'Report issues or concerns.',
      icon: AlertTriangle,
      subItems: [
        { href: '/report', label: 'Report a Problem', description: 'Report issues or concerns' },
        { href: '/support', label: 'Get Help', description: 'Additional support options' }
      ]
    }
  ];

  const secondaryNavItems: never[] = [];

  const ownerNavItems = [
    { href: '/add-car', label: 'Add Car', icon: Plus },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 max-w-7xl w-full">
        {/* Left Section - Logo + Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/assets/MAIN LOGO.png?v=5" 
                alt="ShareWheelz" 
                className="h-8 sm:h-10 lg:h-12 w-auto hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            // Special handling for "Rent a Car" with filter dropdown
            if (item.label === 'Rent a Car') {
              return (
                <div key={item.href} className="relative">
                  <DropdownMenu open={showCarFilter} onOpenChange={setShowCarFilter}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant={location === item.href ? 'default' : 'ghost'} 
                        className={`hover:scale-105 transition-all duration-200 flex items-center gap-1 text-sm px-2 ${
                          location === item.href 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-0 border-0 shadow-none bg-transparent" align="start" sideOffset={8}>
                      <CarFilterDropdown onClose={() => setShowCarFilter(false)} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            }
            
            // Regular dropdown for other items
            return (
              <DropdownMenu key={item.href}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={location === item.href ? 'default' : 'ghost'} 
                    className={`hover:scale-105 transition-all duration-200 flex items-center gap-1 text-sm px-2 ${
                      location === item.href 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="start" sideOffset={8} avoidCollisions={true}>
                  <div className="p-3">
                    <DropdownMenuLabel className="flex items-center gap-2 text-base font-semibold">
                      <Icon className="h-5 w-5 text-blue-600" />
                      {item.label}
                    </DropdownMenuLabel>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    {item.subItems.map((subItem) => (
                      <DropdownMenuItem key={subItem.href} asChild>
                        <Link href={subItem.href} className="flex flex-col items-start p-3 cursor-pointer hover:bg-blue-50 rounded-md">
                          <div className="font-medium text-gray-900">{subItem.label}</div>
                          <div className="text-sm text-gray-600">{subItem.description}</div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </nav>

        </div>

        {/* Center Section - Search Bar */}
        <div className="hidden lg:flex items-center gap-2 max-w-md mx-4">
          <div className="w-full">
            <LocationPicker
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Enter city or location..."
              className="h-10 py-0"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            data-testid="button-search" 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-3 h-10 flex items-center justify-center"
            size="sm"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Search Bar - Show on mobile */}
        <div className="flex lg:hidden items-center gap-2 mx-2">
          <div className="w-full max-w-xs">
            <LocationPicker
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Enter city..."
              className="h-8 sm:h-10 py-0 text-xs sm:text-sm"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-md px-2 sm:px-3 h-8 sm:h-10"
            size="sm"
          >
            <Search className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notifications */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 h-8 w-8 sm:h-10 sm:w-10">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" sideOffset={8} avoidCollisions={true}>
                <div className="px-2 py-1.5">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleMarkAllAsRead}>
                      Mark all read
                    </Button>
                  </DropdownMenuLabel>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <div className="flex items-start w-full">
                          <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${!notification.isRead ? 'bg-blue-500' : 'bg-gray-300'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 truncate">
                              {notification.title}
                            </div>
                            <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {formatTimeAgo(notification.createdAt)}
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      {notificationsLoading ? 'Loading notifications...' : 'No notifications'}
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-center justify-center text-blue-600 hover:text-blue-700 cursor-pointer"
                  onClick={() => setLocation('/notifications')}
                >
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}



          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-blue-50 transition-colors duration-200">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarImage src={user?.profileImage || undefined} alt={user?.firstName || 'User'} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xs sm:text-sm">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56" 
                align="end" 
                side="bottom"
                sideOffset={8} 
                avoidCollisions={true} 
                forceMount
                alignOffset={-20}
              >
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/become-member" className="flex items-center cursor-pointer">
                    <Crown className="mr-2 h-4 w-4" />
                    <span>Membership</span>
                    {user?.membershipTier && (
                      <Badge className="ml-auto bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs">
                        {user.membershipTier === 'purple' ? 'Starter' : 
                         user.membershipTier === 'black' ? 'Elite' : 'Gold'}
                      </Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/security" className="flex items-center cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Security</span>
                  </Link>
                </DropdownMenuItem>
                {user?.userType === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center cursor-pointer">
                      <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                      <span>Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {(user?.userType === 'owner' || user?.userType === 'both') && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/car-management" className="flex items-center cursor-pointer">
                        <Car className="mr-2 h-4 w-4" />
                        <span>My Cars</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/add-car" className="flex items-center cursor-pointer">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Add Car</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-sm px-3 h-9 flex items-center justify-center">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-md text-sm px-4 h-9 flex items-center justify-center">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="xl:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 h-8 w-8 sm:h-10 sm:w-10">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col space-y-4">
                {/* Mobile Brand Logo */}
            <div className="flex items-center justify-center pb-4 border-b">
              <img 
                src="/assets/MAIN LOGO.png?v=5" 
                alt="ShareWheelz" 
                className="h-16 w-auto hover:scale-105 transition-transform duration-200"
              />
            </div>

                {/* Mobile Search */}
                <div className="space-y-2">
                  <LocationPicker
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Enter city or location..."
                    className="w-full"
                  />
                  <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.href} className="space-y-1">
                        <Link href={item.href}>
                          <Button 
                            variant={location === item.href ? 'default' : 'ghost'} 
                            className={`w-full justify-start ${
                              location === item.href 
                                ? 'bg-blue-600 text-white' 
                                : 'hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {item.label}
                          </Button>
                        </Link>
                        {/* Mobile Sub-items */}
                        <div className="ml-6 space-y-1">
                          {item.subItems.slice(0, 2).map((subItem) => (
                            <Link key={subItem.href} href={subItem.href}>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="w-full justify-start text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                              >
                                {subItem.label}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </nav>


                {/* Mobile User Actions */}
                {isAuthenticated ? (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center space-x-3 p-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profileImage || undefined} alt={user?.firstName || 'User'} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        {user?.membershipTier && (
                          <Badge className="mt-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs">
                            <Crown className="h-2 w-2 mr-1" />
                            {user.membershipTier === 'purple' ? 'Starter' : 
                             user.membershipTier === 'black' ? 'Elite' : 'Gold'} Member
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:text-blue-600">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:text-blue-600">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </Link>
                    <Link href="/security">
                      <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:text-blue-600">
                        <Shield className="h-4 w-4 mr-2" />
                        Security
                      </Button>
                    </Link>
                    {(user?.userType === 'owner' || user?.userType === 'both') && (
                      <Link href="/add-car">
                        <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:text-green-600">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Car
                        </Button>
                      </Link>
                    )}
                    <Link href="/become-member">
                      <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:text-blue-600">
                        <Crown className="h-4 w-4 mr-2" />
                        Membership
                      </Button>
                    </Link>
                    <Button 
                      onClick={handleLogout} 
                      variant="outline" 
                      className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-4 border-t">
                    <Link href="/login">
                      <Button variant="outline" className="w-full hover:bg-blue-50 hover:text-blue-600">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
