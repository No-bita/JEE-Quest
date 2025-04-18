import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import PracticeInterface from '@/components/PracticeInterface';
import { toast } from 'sonner';
import { papersApi } from '@/utils/api';

const Practice: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    if (paperId === 'jee2020-2') {
      // Open access: skip login and access check
      setHasAccess(true);
      setIsLoading(false);
      setIsLoggedIn(true);
      return;
    }
    // Existing logic for other paperIds
    // Check if user is logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (!loggedIn) {
      toast.error("Please sign in to access practice papers");
      navigate('/signin');
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
        
      } catch (error) {
        console.error("[DEBUG] Error checking access:", error);
        toast.error("Failed to check access permissions");
        navigate('/papers');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAccess();
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