import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

// Import existing pages first to test
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import Profile from "./pages/Profile";
import BookingConfirmation from "./pages/BookingConfirmation";
import HowItWorks from "./pages/HowItWorks";
import BecomeHost from "./pages/BecomeHost";
import About from "./pages/About";
import Settings from "./pages/Settings";
import NotFound from "./pages/not-found";

// Import components
import Header from "./components/Header";
import OwnerDashboard from "./components/OwnerDashboard";
import RenterDashboard from "./components/RenterDashboard";

// Import new pages
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import Dashboard from "./pages/Dashboard";
import CarManagement from "./pages/CarManagement";
import AddCar from "./pages/AddCar";
import EditCar from "./pages/EditCar";
import BookingManagement from "./pages/BookingManagement";
import BookingDetails from "./pages/BookingDetails";
import UserProfile from "./pages/UserProfile";
import PaymentMethods from "./pages/PaymentMethods";
import NotificationSettings from "./pages/NotificationSettings";
import Support from "./pages/Support";
import Reviews from "./pages/Reviews";
import Analytics from "./pages/Analytics";
import Earnings from "./pages/Earnings";
import Insurance from "./pages/Insurance";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import Legal from "./pages/Legal";
import Messages from "./pages/Messages";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Referrals from "./pages/Referrals";
import Promotions from "./pages/Promotions";
import Fleet from "./pages/Fleet";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/email-verification" component={EmailVerification} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/owner" component={OwnerDashboard} />
      <Route path="/dashboard/renter" component={RenterDashboard} />
      <Route path="/car-management" component={CarManagement} />
      <Route path="/add-car" component={AddCar} />
      <Route path="/edit-car/:id" component={EditCar} />
      <Route path="/booking-management" component={BookingManagement} />
      <Route path="/booking-details/:id" component={BookingDetails} />
      <Route path="/user-profile" component={UserProfile} />
      <Route path="/payment-methods" component={PaymentMethods} />
      <Route path="/notification-settings" component={NotificationSettings} />
      <Route path="/support" component={Support} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/earnings" component={Earnings} />
      <Route path="/insurance" component={Insurance} />
      <Route path="/maintenance" component={Maintenance} />
      <Route path="/reports" component={Reports} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/refund" component={Refund} />
      <Route path="/legal" component={Legal} />
      <Route path="/messages" component={Messages} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/history" component={History} />
      <Route path="/referrals" component={Referrals} />
      <Route path="/promotions" component={Promotions} />
      <Route path="/fleet" component={Fleet} />
      <Route path="/car/:id" component={CarDetails} />
      <Route path="/cars" component={Cars} />
      <Route path="/profile" component={Profile} />
      <Route path="/booking-confirmation/:id" component={BookingConfirmation} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/become-host" component={BecomeHost} />
      <Route path="/about" component={About} />
      <Route path="/settings" component={Settings} />
      <Route path="/owner-dashboard" component={OwnerDashboard} />
      <Route path="/renter-dashboard" component={RenterDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Header />
        <Router />
      </div>
    </QueryClientProvider>
  );
}

export default App;