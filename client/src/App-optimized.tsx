import React, { Suspense } from 'react';
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import SupportChat from "./components/SupportChat";
import LoadingSpinner from "./components/LoadingSpinner";

// Core pages - loaded immediately (most frequently used)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import DashboardSelector from "./components/DashboardSelector";

// Lazy loaded pages - loaded on demand
const PasswordReset = React.lazy(() => import("./pages/PasswordReset"));
const OwnerDashboard = React.lazy(() => import("./pages/OwnerDashboard"));
const RenterDashboard = React.lazy(() => import("./pages/RenterDashboard"));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Security = React.lazy(() => import("./pages/Security"));
const AddCar = React.lazy(() => import("./pages/AddCar"));
const AddCarDynamic = React.lazy(() => import("./pages/AddCarDynamic"));
const EditCar = React.lazy(() => import("./pages/EditCar"));
const CarManagement = React.lazy(() => import("./pages/CarManagement"));
const BecomeHost = React.lazy(() => import("./pages/BecomeHost"));
const BecomeMember = React.lazy(() => import("./pages/BecomeMember"));
const About = React.lazy(() => import("./pages/About"));
const HowItWorks = React.lazy(() => import("./pages/HowItWorks"));
const Support = React.lazy(() => import("./pages/Support"));
const Services = React.lazy(() => import("./pages/Services"));
const TermsPolicies = React.lazy(() => import("./pages/TermsPolicies"));
const Payment = React.lazy(() => import("./pages/Payment"));
const PaymentManagement = React.lazy(() => import("./pages/PaymentManagement"));
const BookingManagement = React.lazy(() => import("./pages/BookingManagement"));
const NotificationSettings = React.lazy(() => import("./pages/NotificationSettings"));
const PaymentMethods = React.lazy(() => import("./pages/PaymentMethods"));
const BookingConfirmation = React.lazy(() => import("./pages/BookingConfirmation"));
const BookingDetails = React.lazy(() => import("./pages/BookingDetails"));
const AdminPanel = React.lazy(() => import("./pages/AdminPanel"));
const TestCars = React.lazy(() => import("./pages/TestCars"));
const CarsSimple = React.lazy(() => import("./pages/CarsSimple"));
const CarsDebug = React.lazy(() => import("./pages/CarsDebug"));
const CarsDebugSimple = React.lazy(() => import("./pages/CarsDebugSimple"));
const Favorites = React.lazy(() => import("./pages/Favorites"));
const Fleet = React.lazy(() => import("./pages/Fleet"));
const Business = React.lazy(() => import("./pages/Business"));
const Help = React.lazy(() => import("./pages/Help"));
const Contact = React.lazy(() => import("./pages/Contact"));

// Loading wrapper component
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner size="lg" />}>
    {children}
  </Suspense>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Switch>
            {/* Core routes - no lazy loading */}
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/cars" component={Cars} />
            <Route path="/cars/:id" component={CarDetails} />
            <Route path="/dashboard" component={DashboardSelector} />
            
            {/* Lazy loaded routes */}
            <Route path="/password-reset">
              <LazyWrapper><PasswordReset /></LazyWrapper>
            </Route>
            <Route path="/owner-dashboard">
              <LazyWrapper><OwnerDashboard /></LazyWrapper>
            </Route>
            <Route path="/renter-dashboard">
              <LazyWrapper><RenterDashboard /></LazyWrapper>
            </Route>
            <Route path="/analytics">
              <LazyWrapper><Analytics /></LazyWrapper>
            </Route>
            <Route path="/profile">
              <LazyWrapper><Profile /></LazyWrapper>
            </Route>
            <Route path="/settings">
              <LazyWrapper><Settings /></LazyWrapper>
            </Route>
            <Route path="/security">
              <LazyWrapper><Security /></LazyWrapper>
            </Route>
            <Route path="/add-car">
              <LazyWrapper><AddCar /></LazyWrapper>
            </Route>
            <Route path="/add-car-dynamic">
              <LazyWrapper><AddCarDynamic /></LazyWrapper>
            </Route>
            <Route path="/edit-car/:id">
              <LazyWrapper><EditCar /></LazyWrapper>
            </Route>
            <Route path="/car-management">
              <LazyWrapper><CarManagement /></LazyWrapper>
            </Route>
            <Route path="/become-host">
              <LazyWrapper><BecomeHost /></LazyWrapper>
            </Route>
            <Route path="/become-member">
              <LazyWrapper><BecomeMember /></LazyWrapper>
            </Route>
            <Route path="/about">
              <LazyWrapper><About /></LazyWrapper>
            </Route>
            <Route path="/how-it-works">
              <LazyWrapper><HowItWorks /></LazyWrapper>
            </Route>
            <Route path="/support">
              <LazyWrapper><Support /></LazyWrapper>
            </Route>
            <Route path="/services">
              <LazyWrapper><Services /></LazyWrapper>
            </Route>
            <Route path="/terms-policies">
              <LazyWrapper><TermsPolicies /></LazyWrapper>
            </Route>
            <Route path="/payment">
              <LazyWrapper><Payment /></LazyWrapper>
            </Route>
            <Route path="/payment-management">
              <LazyWrapper><PaymentManagement /></LazyWrapper>
            </Route>
            <Route path="/booking-management">
              <LazyWrapper><BookingManagement /></LazyWrapper>
            </Route>
            <Route path="/notification-settings">
              <LazyWrapper><NotificationSettings /></LazyWrapper>
            </Route>
            <Route path="/payment-methods">
              <LazyWrapper><PaymentMethods /></LazyWrapper>
            </Route>
            <Route path="/booking-confirmation">
              <LazyWrapper><BookingConfirmation /></LazyWrapper>
            </Route>
            <Route path="/booking-details/:id">
              <LazyWrapper><BookingDetails /></LazyWrapper>
            </Route>
            <Route path="/admin-panel">
              <LazyWrapper><AdminPanel /></LazyWrapper>
            </Route>
            <Route path="/test-cars">
              <LazyWrapper><TestCars /></LazyWrapper>
            </Route>
            <Route path="/cars-simple">
              <LazyWrapper><CarsSimple /></LazyWrapper>
            </Route>
            <Route path="/cars-debug">
              <LazyWrapper><CarsDebug /></LazyWrapper>
            </Route>
            <Route path="/cars-debug-simple">
              <LazyWrapper><CarsDebugSimple /></LazyWrapper>
            </Route>
            <Route path="/favorites">
              <LazyWrapper><Favorites /></LazyWrapper>
            </Route>
            <Route path="/fleet">
              <LazyWrapper><Fleet /></LazyWrapper>
            </Route>
            <Route path="/business">
              <LazyWrapper><Business /></LazyWrapper>
            </Route>
            <Route path="/help">
              <LazyWrapper><Help /></LazyWrapper>
            </Route>
            <Route path="/contact">
              <LazyWrapper><Contact /></LazyWrapper>
            </Route>
            
            {/* 404 route */}
            <Route>
              <LazyWrapper><div className="text-center py-20"><h1 className="text-4xl font-bold text-gray-900">404 - Page Not Found</h1></div></LazyWrapper>
            </Route>
          </Switch>
          
          <Toaster />
          <SupportChat />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}




