import React from 'react';
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import SupportChat from "./components/SupportChat";

// Import pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardSelector from "./components/DashboardSelector";
import OwnerDashboard from "./pages/OwnerDashboard";
import RenterDashboard from "./pages/RenterDashboard";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Security from "./pages/Security";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import AddCar from "./pages/AddCar";
import EditCar from "./pages/EditCar";
import BecomeHost from "./pages/BecomeHost";
import BecomeMember from "./pages/BecomeMember";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Support from "./pages/Support";
import Services from "./pages/Services";
import TermsPolicies from "./pages/TermsPolicies";
import Payment from "./pages/Payment";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingDetails from "./pages/BookingDetails";
import TestCars from "./pages/TestCars";
import CarsSimple from "./pages/CarsSimple";
import CarsDebug from "./pages/CarsDebug";
import CarsDebugSimple from "./pages/CarsDebugSimple";
import Favorites from "./pages/Favorites";
import Fleet from "./pages/Fleet";
import Business from "./pages/Business";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Safety from "./pages/Safety";
import Guidelines from "./pages/Guidelines";
import Report from "./pages/Report";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Accessibility from "./pages/Accessibility";
import EarningsCalculator from "./pages/EarningsCalculator";
import RoadsideAssistance from "./pages/RoadsideAssistance";
import QualityGuarantee from "./pages/QualityGuarantee";
import FAQ from "./pages/FAQ";
import LiveChat from "./pages/LiveChat";
import HostGuide from "./pages/HostGuide";
import MembershipBenefits from "./pages/MembershipBenefits";
import LoyaltyProgram from "./pages/LoyaltyProgram";
import MemberEvents from "./pages/MemberEvents";
import Privacy from "./pages/Privacy";
import Insurance from "./pages/Insurance";
import NotFound from "./pages/not-found";

// Import components
import Header from "./components/Header";
import Notifications from "./pages/Notifications";
import MessagingApp from "./components/MessagingApp";
import MessagingProvider from "./contexts/MessagingContext";

function App() {
  console.log('App component rendering...');
  
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MessagingProvider>
            <div className="min-h-screen bg-white">
            <Header />
            
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/dashboard" component={DashboardSelector} />
              <Route path="/dashboard/owner" component={OwnerDashboard} />
              <Route path="/dashboard/renter" component={RenterDashboard} />
              <Route path="/analytics" component={Analytics} />
              <Route path="/profile" component={Profile} />
              <Route path="/settings" component={Settings} />
              <Route path="/security" component={Security} />
              <Route path="/payment/:bookingId" component={Payment} />
              <Route path="/booking-confirmation/:bookingId" component={BookingConfirmation} />
              <Route path="/booking/:bookingId" component={BookingDetails} />
              <Route path="/notifications" component={Notifications} />
              <Route path="/messages" component={MessagingApp} />
              <Route path="/cars" component={Cars} />
              <Route path="/cars/:id" component={CarDetails} />
              <Route path="/favorites" component={Favorites} />
              <Route path="/test-cars" component={TestCars} />
              <Route path="/cars-simple" component={CarsSimple} />
              <Route path="/cars-debug" component={CarsDebug} />
              <Route path="/cars-debug-simple" component={CarsDebugSimple} />
              <Route path="/add-car" component={AddCar} />
              <Route path="/edit-car/:id" component={EditCar} />
              <Route path="/become-host" component={BecomeHost} />
              <Route path="/become-member" component={BecomeMember} />
              <Route path="/fleet" component={Fleet} />
              <Route path="/business" component={Business} />
              <Route path="/help" component={Help} />
              <Route path="/contact" component={Contact} />
              <Route path="/safety" component={Safety} />
              <Route path="/guidelines" component={Guidelines} />
              <Route path="/report" component={Report} />
              <Route path="/terms" component={Terms} />
              <Route path="/cookies" component={Cookies} />
              <Route path="/accessibility" component={Accessibility} />
              <Route path="/about" component={About} />
              <Route path="/how-it-works" component={HowItWorks} />
              <Route path="/services" component={Services} />
              <Route path="/terms-policies" component={TermsPolicies} />
              <Route path="/support" component={Support} />
              <Route path="/earnings-calculator" component={EarningsCalculator} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/insurance" component={Insurance} />
              <Route path="/roadside-assistance" component={RoadsideAssistance} />
              <Route path="/quality-guarantee" component={QualityGuarantee} />
              <Route path="/faq" component={FAQ} />
              <Route path="/live-chat" component={LiveChat} />
              <Route path="/host-guide" component={HostGuide} />
              <Route path="/membership-benefits" component={MembershipBenefits} />
              <Route path="/loyalty-program" component={LoyaltyProgram} />
              <Route path="/member-events" component={MemberEvents} />
              <Route component={NotFound} />
            </Switch>
            
            <Toaster />
            <SupportChat />
          </div>
          </MessagingProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div style={{ padding: '20px', backgroundColor: '#ffebee', minHeight: '100vh' }}>
        <h1 style={{ color: 'red' }}>❌ Error in App Component</h1>
        <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}

export default App;
