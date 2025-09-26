import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Logo from './Logo';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Search, Menu, Car, User, Settings, LogOut, Plus, Shield, Bell, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function Header() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, loading, isAuthenticated } = useAuth();

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
    { href: '/become-host', label: 'Make your car work for you' },
    { href: '/services', label: 'Our Quality service' },
    { href: '/about', label: 'About' },
    { href: '/terms-policies', label: 'Legals' },
  ];

  const secondaryNavItems = [
    { href: '/become-host', label: 'Become Host', icon: Plus },
    { href: '/security', label: 'Security', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg">
      <div className="container flex h-16 items-center gap-4 px-4">
        {/* Brand Logo */}
        <Logo size="md" href="/" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <Button 
                variant={location === item.href ? 'default' : 'ghost'} 
                className={`hover:scale-105 transition-all duration-200 ${
                  location === item.href 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Enhanced Search Bar */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              data-testid="input-search"
              placeholder="Search cars, locations, or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            data-testid="button-search" 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          {isAuthenticated && (
            <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>
          )}

          {/* Favorites */}
          {isAuthenticated && (
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {/* Secondary Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {secondaryNavItems.map((item) => {
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

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4">
                {/* Mobile Brand Logo */}
                <div className="flex items-center space-x-2 pb-4 border-b">
                  <img 
                    src="/assets/Share Wheelz.png" 
                    alt="Share Wheelz" 
                    className="h-8 w-auto"
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