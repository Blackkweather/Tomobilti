import { useState } from 'react';
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
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Search, Menu, Car, User, Settings, LogOut, Plus, Shield, Bell, Clock, Star, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function Header() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, loading, isAuthenticated } = useAuth();

  // Mock notification data
  const notifications = [
    {
      id: 1,
      title: 'Booking Confirmed',
      message: 'Your BMW 3 Series rental has been confirmed for Dec 20-23',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      title: 'Payment Received',
      message: 'Payment of £1,350 has been processed successfully',
      time: '1 day ago',
      unread: true
    },
    {
      id: 3,
      title: 'Reminder',
      message: 'Your rental starts tomorrow at 10:00 AM',
      time: '2 days ago',
      unread: false
    }
  ];


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
    { href: '/cars', label: 'Rent a car' },
    { href: '/become-member', label: 'Become a Member' },
    { href: '/services', label: 'Our Quality service' },
  ];

  const secondaryNavItems = [
    { href: '/security', label: 'Security', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg">
      <div className="container flex h-16 items-center px-4">
        {/* Brand Logo - Left Side */}
        <div className="flex-shrink-0 mr-4">
          <Link href="/" className="flex items-center">
            <img 
              src="/assets/MAIN LOGO.png" 
              alt="ShareWheelz" 
              className="h-20 w-auto hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Desktop Navigation - Left */}
        <nav className="hidden lg:flex items-center gap-2 mr-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <Button 
                variant={location === item.href ? 'default' : 'ghost'} 
                className={`hover:scale-105 transition-all duration-200 ${
                  location === item.href 
                    ? 'bg-mauve-600 text-white shadow-md' 
                    : 'hover:bg-mauve-50 text-gray-700 hover:text-mauve-600'
                }`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Search Bar - CENTERED */}
        <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              data-testid="input-search"
              placeholder="Search cars, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 bg-white border-gray-200 focus:border-mauve-500 focus:ring-2 focus:ring-mauve-200 transition-all duration-200 rounded-lg"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            data-testid="button-search" 
            className="bg-mauve-600 hover:bg-mauve-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* User Actions - Right Side */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-8">
          {/* Notifications */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.filter(n => n.unread).length}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <div className="px-2 py-1.5">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      Mark all read
                    </Button>
                  </DropdownMenuLabel>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50">
                        <div className="flex items-start w-full">
                          <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 truncate">
                              {notification.title}
                            </div>
                            <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center justify-center text-blue-600 hover:text-blue-700">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}


          {/* Secondary Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {isAuthenticated && secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200"
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-blue-50 transition-colors duration-200">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage || undefined} alt={user?.firstName || 'User'} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
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
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
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
                <Button variant="ghost" className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4">
                {/* Mobile Brand Logo */}
            <div className="flex items-center justify-center pb-4 border-b">
              <img 
                src="/assets/MAIN LOGO.png" 
                alt="ShareWheelz" 
                className="h-16 w-auto hover:scale-105 transition-transform duration-200"
              />
            </div>

                {/* Mobile Search */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search cars, locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button 
                        variant={location === item.href ? 'default' : 'ghost'} 
                        className={`w-full justify-start ${
                          location === item.href 
                            ? 'bg-blue-600 text-white' 
                            : 'hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </nav>

                {/* Mobile Secondary Actions */}
                {isAuthenticated && (
                  <div className="space-y-2 pt-4 border-t">
                    {secondaryNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href}>
                          <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:text-blue-600">
                            <Icon className="h-4 w-4 mr-2" />
                            {item.label}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                )}

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
                      <div>
                        <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:text-blue-600">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:text-blue-600">
                        <Settings className="h-4 w-4 mr-2" />
                        Profile
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