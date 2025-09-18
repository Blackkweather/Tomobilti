import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Search, Menu, Car, User, Settings, LogOut, Plus } from 'lucide-react';

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // todo: remove mock functionality

  const handleSearch = () => {
    console.log('Search triggered:', searchQuery);
  };

  const handleLogin = () => {
    console.log('Login triggered');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log('Logout triggered');
    setIsLoggedIn(false);
  };

  const navItems = [
    { href: '/', label: 'Accueil', icon: Car },
    { href: '/cars', label: 'Véhicules' },
    { href: '/become-host', label: 'Devenir hôte' },
    { href: '/about', label: 'À propos' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">RentMa</span>
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
                {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              data-testid="input-search"
              placeholder="Rechercher à Casablanca, Rabat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} data-testid="button-search" className="hover-elevate active-elevate-2">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button variant="outline" size="sm" data-testid="button-add-car" className="hidden md:flex hover-elevate active-elevate-2">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter véhicule
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild data-testid="button-user-menu">
                  <Button variant="ghost" size="icon" className="hover-elevate active-elevate-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        AM
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem data-testid="menu-profile">
                    <User className="mr-2 h-4 w-4" />
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-my-cars">
                    <Car className="mr-2 h-4 w-4" />
                    Mes véhicules
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleLogin} data-testid="button-login" className="hover-elevate active-elevate-2">
                Se connecter
              </Button>
              <Button onClick={handleLogin} data-testid="button-signup" className="hover-elevate active-elevate-2">
                S'inscrire
              </Button>
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
                    placeholder="Rechercher..."
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
                        {item.icon && <item.icon className="h-4 w-4 mr-2" />}
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