import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react"

// Import pages
import Dashboard from "./pages/Papers";
import Practice from "./pages/Practice";
import Analysis from "./pages/Analysis";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Results from "./pages/Results";
import PracticeInterface from "./components/PracticeInterface";
import AboutUs from './pages/AboutUs';

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
            {/* Redirect from landing page to dashboard if logged in */}
            <Route path="*" element={isLoggedIn ? <Navigate to="/papers" /> : <Navigate to="/signin" />} />

            {/* Protected routes - redirect to landing if not logged in */}
            <Route path="/papers" element={isLoggedIn ? <Dashboard /> : <Navigate to="/signin" />} />
            <Route path="/analysis" element={isLoggedIn ? <Analysis /> : <Navigate to="/signin" />} />
            <Route path="/results/:paperId?" element={isLoggedIn ? <Results /> : <Navigate to="/signin" />} />

            {/* Public routes */}
            <Route path="/practice/:paperId" element={<Practice />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path='/about' element={<AboutUs />} />

            {/* Auth routes - redirect to dashboard if already logged in */}
            <Route path="/signin" element={isLoggedIn ? <Navigate to="/papers" /> : <SignIn setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/papers" /> : <Register />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AppContent />
  </GoogleOAuthProvider>
);

export default App;