
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import PracticeInterface from '@/components/PracticeInterface';
import { toast } from 'sonner';
import { FREE_TEST_LIMIT } from '@/utils/types';

const Practice: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    if (!loggedIn) {
      toast.error("Please sign in to access practice papers");
      navigate('/signin');
      return;
    }
    
    // If no paperId is provided, redirect to sample paper
    if (!paperId) {
      navigate('/practice/jee2022-1');
      return;
    }
    
    // Check if user has access to this paper
    const checkAccess = () => {
      // Check for subscription
      if (localStorage.getItem('hasSubscription') === 'true') {
        setHasAccess(true);
        setIsLoading(false);
        return;
      }
      
      // Check for individual paper purchase
      const purchasedPapers = JSON.parse(localStorage.getItem('purchasedPapers') || '[]');
      
      // Get completed free tests
      const completedTests = JSON.parse(localStorage.getItem('testResults') || '[]');
      const hasCompletedFreeTest = completedTests.length >= FREE_TEST_LIMIT;
      
      // For demo purposes, let's make 2023 and older papers free
      const year = parseInt(paperId.split('-')[0].replace('jee', ''));
      const isFree = year < 2024;
      
      // Allow access if:
      // 1. Paper is free (2023 or older), or
      // 2. Paper has been purchased, or
      // 3. User hasn't used their free test yet
      if (isFree || purchasedPapers.includes(paperId) || !hasCompletedFreeTest) {
        setHasAccess(true);
      } else {
        if (hasCompletedFreeTest) {
          toast.error("You've used your free test. Please purchase to continue.");
        } else {
          toast.error("You need to purchase this paper to access it");
        }
        navigate(`/pricing?paperId=${paperId}&title=JEE Mains ${year}`);
      }
      
      setIsLoading(false);
    };
    
    // Simulate a small delay to check access
    setTimeout(checkAccess, 500);
  }, [paperId, navigate]);
  
  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <NavBar />
      {hasAccess && paperId && <PracticeInterface paperId={paperId} />}
    </>
  );
};

export default Practice;
