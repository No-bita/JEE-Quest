import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import PracticeInterface from '@/components/PracticeInterface';
import { toast } from 'sonner';
import { FREE_TEST_LIMIT } from '@/utils/types';
import { papersApi } from '@/utils/api';

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
    const checkAccess = async () => {
      try {
        const paperResponse = await papersApi.getPaperQuestions(paperId);
        
        if (!paperResponse.success) {
          toast.error("Failed to load paper information");
          navigate('/papers');
          return;
        }
        
        setHasAccess(true);
        // const userResponse = await userApi.getUserProfile();
        
        // if (!userResponse.success) {
        //   toast.error("Failed to load user information");
        //   navigate('/signin');
        //   return;
        // }
        
        // // TypeScript narrowing: We know response is successful at this point
        // // so we can safely access the data property
        // const paperData = paperResponse.success ? paperResponse.data : null;
        
        // if (!paperData) {
        //   toast.error("Failed to load paper data");
        //   navigate('/papers');
        //   return;
        // }
        
        // const userProfile = userResponse.success ? userResponse.data : null;
        
        // if (!userProfile) {
        //   toast.error("Failed to load user profile");
        //   navigate('/signin');
        //   return;
        // }
        
        // const { subscription, purchasedPapers, freeTestsRemaining } = userProfile;
        
        // if (
        //   subscription?.active || 
        //   paperData.isFree || 
        //   freeTestsRemaining > 0
        // ) {
        //   setHasAccess(true);
        // } else {
        //   if (freeTestsRemaining <= 0) {
        //     toast.error("You've used your free test. Please purchase to continue.");
        //   } else {
        //     toast.error("You need to purchase this paper to access it");
        //   }
        //   navigate(`/pricing?paperId=${paperId}&title=${paperData.title}`);
        // }
      } catch (error) {
        console.error("Error checking access:", error);
        toast.error("Failed to check access permissions");
        navigate('/papers');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Simulate a small delay to check access
    setTimeout(() => {
      checkAccess();
    }, 500);
  }, [paperId, navigate ]);
  
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