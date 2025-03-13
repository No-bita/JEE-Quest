
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import PracticeInterface from '@/components/PracticeInterface';
import { toast } from 'sonner';

const Practice: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!paperId) {
      toast.error("No paper selected");
      navigate('/papers');
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
      
      // For demo purposes, let's make 2023 and older papers free
      const year = parseInt(paperId.split('-')[0].replace('jee', ''));
      const isFree = year < 2024;
      
      if (isFree || purchasedPapers.includes(paperId)) {
        setHasAccess(true);
      } else {
        toast.error("You need to purchase this paper to access it");
        navigate('/papers');
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
