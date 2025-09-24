import React from 'react';
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";

// Import pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import RenterDashboard from "./pages/RenterDashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import AddCar from "./pages/AddCar";
import BecomeHost from "./pages/BecomeHost";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Support from "./pages/Support";
import NotFound from "./pages/not-found";

// Import components
import Header from "./components/Header";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Header />
          
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/dashboard/owner" component={OwnerDashboard} />
            <Route path="/dashboard/renter" component={RenterDashboard} />
            <Route path="/profile" component={Profile} />
            <Route path="/settings" component={Settings} />
            <Route path="/cars" component={Cars} />
            <Route path="/cars/:id" component={CarDetails} />
            <Route path="/add-car" component={AddCar} />
            <Route path="/become-host" component={BecomeHost} />
            <Route path="/about" component={About} />
            <Route path="/how-it-works" component={HowItWorks} />
            <Route path="/support" component={Support} />
            <Route component={NotFound} />
          </Switch>
          
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;