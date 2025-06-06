import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Discussions from './pages/Discussions';
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react"
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';

// Import pages
import Index from "./pages/Index";
import Dashboard from "./pages/Papers";
import Practice from "./pages/Practice";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import Results from "./pages/Results";
import PracticeInterface from "./components/PracticeInterface";
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import AnalyticsPage from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';

const queryClient = new QueryClient();

import { GoogleOAuthProvider } from '@react-oauth/google';

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  useEffect(() => {
    // Check login status from localStorage
    const checkLoginStatus = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    
    // Check on initial load
    checkLoginStatus();
    
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Always show landing page at root URL */}
            <Route path="/" element={<Index />} />

            {/* Protected routes - redirect to signin if not logged in */}
            <Route path="/papers" element={isLoggedIn ? <Dashboard /> : <Navigate to="/signin" />} />
            <Route path="/results/:paperId?" element={isLoggedIn ? <Results /> : <Navigate to="/signin" />} />
            <Route path="/discussions" element={isLoggedIn ? <Discussions /> : <Navigate to="/signin" />} />

            {/* Public routes */}
            <Route path="/practice" element={<Navigate to="/practice/jee2020-2" replace />} />
            <Route path="/practice/:paperId" element={<Practice />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path='/about' element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />

            {/* Auth routes - redirect to dashboard if already logged in */}
            <Route path="/signin" element={isLoggedIn ? <Navigate to="/papers" /> : <SignIn setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/papers" /> : <Register />} />

            {/* Catch-all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App = () => (
  <HelmetProvider>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </HelmetProvider>
);

export default App;