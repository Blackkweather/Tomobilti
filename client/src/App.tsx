import React, { useEffect } from 'react';
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import SupportChat from "./components/SupportChat";
import { initGA, trackPageView } from "./lib/analytics";

// Import essential pages only
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SelectRole from "./pages/SelectRole";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import DashboardSelector from "./components/DashboardSelector";
import OwnerDashboard from "./pages/OwnerDashboard";
import RenterDashboard from "./pages/RenterDashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AddCar from "./pages/AddCar";
import BecomeMember from "./pages/BecomeMember";
import About from "./pages/About";
import Support from "./pages/Support";
import Payment from "./pages/Payment";
import BookingConfirmation from "./pages/BookingConfirmation";
import NotFound from "./pages/not-found";
import OAuthTest from './pages/OAuthTest';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import TermsPolicies from './pages/TermsPolicies';
import Privacy from './pages/Privacy';
import Legal from './pages/Legal';
import FAQ from './pages/FAQ';
import Help from './pages/Help';
import Favorites from './pages/Favorites';
import HowItWorks from './pages/HowItWorks';
import Careers from './pages/Careers';
import Press from './pages/Press';
import GoogleCallback from './pages/GoogleCallback';
import FacebookCallback from './pages/FacebookCallback';
import MicrosoftCallback from './pages/MicrosoftCallback';
import GitHubCallback from './pages/GitHubCallback';
import Fleet from './pages/Fleet';
import Business from './pages/Business';
import Contact from './pages/Contact';
import Safety from './pages/Safety';
import Guidelines from './pages/Guidelines';
import Cookies from './pages/Cookies';
import Insurance from './pages/Insurance';
import Accessibility from './pages/Accessibility';
import GDPRCompliance from './pages/GDPRCompliance';
import Report from './pages/Report';
import AddCarDynamic from './pages/AddCarDynamic';
import BecomeHost from './pages/BecomeHost';
import CarManagement from './pages/CarManagement';
import EarningsCalculator from './pages/EarningsCalculator';
import MembershipBenefits from './pages/MembershipBenefits';
import LoyaltyProgram from './pages/LoyaltyProgram';
import LiveChat from './pages/LiveChat';

// Import components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import EmailCaptureModal from "./components/EmailCaptureModal";

function App() {
  console.log('🚀 ShareWheelz App starting...');
  const [location] = useLocation();

  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  // Track page views
  useEffect(() => {
    trackPageView(location);
  }, [location]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-white">
          <Header />
          
          <main className="flex-1">
            <Switch>
              {/* Core Routes */}
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/select-role" component={SelectRole} />
              <Route path="/cars" component={Cars} />
              <Route path="/cars/:id" component={CarDetails} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" component={DashboardSelector} />
              <Route path="/owner-dashboard" component={OwnerDashboard} />
              <Route path="/renter-dashboard" component={RenterDashboard} />
              
              {/* Profile & Settings */}
              <Route path="/profile" component={Profile} />
              <Route path="/settings" component={Settings} />
              
              {/* Car Management */}
              <Route path="/add-car" component={AddCar} />
              <Route path="/add-car-dynamic" component={AddCarDynamic} />
              <Route path="/car-management" component={CarManagement} />
              <Route path="/earnings-calculator" component={EarningsCalculator} />
              
              {/* Membership */}
              <Route path="/become-member" component={BecomeMember} />
              <Route path="/membership-benefits" component={MembershipBenefits} />
              <Route path="/loyalty-program" component={LoyaltyProgram} />
              <Route path="/live-chat" component={LiveChat} />
              <Route path="/become-host" component={BecomeHost} />

              {/* Static Pages */}
              <Route path="/about" component={About} />
              <Route path="/support" component={Support} />
              <Route path="/payment" component={Payment} />
              <Route path="/booking-confirmation" component={BookingConfirmation} />
              <Route path="/favorites" component={Favorites} />
              
              {/* Legal Pages */}
              <Route path="/privacy" component={Privacy} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/terms" component={TermsOfService} />
              <Route path="/terms-of-service" component={TermsOfService} />
              <Route path="/terms-policies" component={TermsPolicies} />
              <Route path="/legal" component={Legal} />
              <Route path="/faq" component={FAQ} />
              <Route path="/help" component={Help} />
              
              {/* Footer-linked informational routes */}
              <Route path="/how-it-works" component={HowItWorks} />
              <Route path="/careers" component={Careers} />
              <Route path="/press" component={Press} />
              <Route path="/fleet" component={Fleet} />
              <Route path="/business" component={Business} />
              <Route path="/contact" component={Contact} />
              <Route path="/safety" component={Safety} />
              <Route path="/guidelines" component={Guidelines} />
              <Route path="/cookies" component={Cookies} />
              <Route path="/insurance" component={Insurance} />
              <Route path="/accessibility" component={Accessibility} />
              <Route path="/gdpr-compliance" component={GDPRCompliance} />
              <Route path="/report" component={Report} />
              
              {/* OAuth Test Route */}
              <Route path="/oauth-test" component={OAuthTest} />
              
              {/* OAuth callback routes */}
              <Route path="/auth/google/callback" component={GoogleCallback} />
              <Route path="/auth/facebook/callback" component={FacebookCallback} />
              <Route path="/auth/microsoft/callback" component={MicrosoftCallback} />
              <Route path="/auth/github/callback" component={GitHubCallback} />
              <Route component={NotFound} />
            </Switch>
          </main>
          
          <Footer />
          <SupportChat />
          <EmailCaptureModal />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;