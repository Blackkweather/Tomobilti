import React from 'react';
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import SupportChat from "./components/SupportChat";

// Import essential pages only
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
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

// Import components
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  console.log('🚀 ShareWheelz App starting...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <Header />
          
          <main className="flex-1">
            <Switch>
              {/* Core Routes */}
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/cars" component={Cars} />
              <Route path="/cars/:id" component={CarDetails} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" component={DashboardSelector} />
              <Route path="/dashboard/owner" component={OwnerDashboard} />
              <Route path="/dashboard/renter" component={RenterDashboard} />
              
              {/* User Routes */}
              <Route path="/profile" component={Profile} />
              <Route path="/settings" component={Settings} />
              
              {/* Car Management */}
              <Route path="/add-car" component={AddCar} />
              
              {/* Business Routes */}
              <Route path="/become-member" component={BecomeMember} />
              <Route path="/about" component={About} />
              <Route path="/support" component={Support} />
              
              {/* Booking Routes */}
              <Route path="/payment" component={Payment} />
              <Route path="/booking-confirmation" component={BookingConfirmation} />
              
              {/* 404 Route */}
              <Route component={NotFound} />
            </Switch>
          </main>
          
          <Footer />
          <Toaster />
          <SupportChat />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;