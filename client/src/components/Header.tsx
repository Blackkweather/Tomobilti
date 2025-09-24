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
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Search, Menu, Car, User, Settings, LogOut, Plus, Shield } from 'lucide-react';
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-center px-4">
          <LoadingSpinner size="sm" />
        </div>
      </header>
    );
  }

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/cars', label: 'Vehicles' },
    { href: '/about', label: 'About' },
  ];

  const secondaryNavItems = [
    { href: '/become-host', label: 'Become Host', icon: Plus },
    { href: '/security', label: 'Security', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" data-testid="link-home">
          <div className="flex items-center hover-elevate rounded-md px-3 py-2">
            <img src="/assets/logo clean jdid 7nin.png" alt="Tomobilto" className="h-10 w-12" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <Button 
                variant={location === item.href ? 'secondary' : 'ghost'} 
                className="hover-elevate"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Enhanced Search Bar */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              data-testid="input-search"
              placeholder="Search cars, locations, or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:bg-white transition-all duration-200"
            />
          </div>
          <Button onClick={handleSearch} data-testid="button-search" className="hover-elevate active-elevate-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <Link href="/become-host">
                  <Button variant="outline" size="sm" className="hover-elevate active-elevate-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Become Host
                  </Button>
                </Link>
                <Link href="/security">
                  <Button variant="outline" size="sm" className="hover-elevate active-elevate-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </Button>
                </Link>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild data-testid="button-user-menu">
                  <Button variant="ghost" size="icon" className="hover-elevate active-elevate-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage || ''} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem data-testid="menu-profile">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                  </Link>
                  {(user.userType === 'owner' || user.userType === 'both') && (
                    <Link href="/dashboard/owner">
                      <DropdownMenuItem data-testid="menu-owner-dashboard">
                        <Car className="mr-2 h-4 w-4" />
                        Owner Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <Link href="/dashboard/renter">
                    <DropdownMenuItem data-testid="menu-renter-dashboard">
                      <User className="mr-2 h-4 w-4" />
                      My Bookings
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings">
                    <DropdownMenuItem data-testid="menu-settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/security">
                    <DropdownMenuItem data-testid="menu-security">
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" data-testid="button-login" className="hover-elevate active-elevate-2">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button data-testid="button-signup" className="hover-elevate active-elevate-2">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu" className="hover-elevate active-elevate-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    data-testid="input-mobile-search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start hover-elevate active-elevate-2"
                        data-testid={`mobile-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}