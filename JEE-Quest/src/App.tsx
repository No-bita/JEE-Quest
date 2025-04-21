import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Import pages
import Index from "./pages/Index";
import Dashboard from "./pages/Papers";
import Practice from "./pages/Practice";
import Analysis from "./pages/Analysis";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import Results from "./pages/Results";
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';

const queryClient = new QueryClient();

import { GoogleOAuthProvider } from '@react-oauth/google';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect from landing page to dashboard if logged in */}
            <Route path="*" element={isAuthenticated ? <Navigate to="/papers" /> : <Index />} />

            {/* Protected routes - redirect to landing if not logged in */}
            <Route path="/papers" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
            <Route path="/analysis" element={isAuthenticated ? <Analysis /> : <Navigate to="/signin" />} />
            <Route path="/results/:paperId?" element={isAuthenticated ? <Results /> : <Navigate to="/signin" />} />

            {/* Public routes */}
            <Route path="/practice/:paperId" element={<Practice />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path='/about' element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />

            {/* Auth routes - redirect to dashboard if already logged in */}
            <Route path="/signin" element={isAuthenticated ? <Navigate to="/papers" /> : <SignIn />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/papers" /> : <Register />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppContent />
        <Analytics />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};
export default App;