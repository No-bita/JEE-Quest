
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Import pages
import Index from "./pages/Index";
import Papers from "./pages/Papers";
import Practice from "./pages/Practice";
import Analysis from "./pages/Analysis";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Results from "./pages/Results";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // Add event listener for storage events (for login state changes in other tabs)
    const handleStorageChange = () => {
      const updatedLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(updatedLoggedIn);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect from landing page to papers if logged in */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/papers" /> : <Index />} />
            
            {/* Protected routes - redirect to landing if not logged in */}
            <Route path="/papers" element={isLoggedIn ? <Papers /> : <Navigate to="/" />} />
            <Route path="/practice/:paperId?" element={<Practice />} />
            <Route path="/analysis" element={isLoggedIn ? <Analysis /> : <Navigate to="/" />} />
            <Route path="/results/:paperId?" element={isLoggedIn ? <Results /> : <Navigate to="/" />} />
            
            {/* Auth routes - redirect to papers if already logged in */}
            <Route path="/signin" element={isLoggedIn ? <Navigate to="/papers" /> : <SignIn />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/papers" /> : <Register />} />
            
            {/* Public routes */}
            <Route path="/pricing" element={<Pricing />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
