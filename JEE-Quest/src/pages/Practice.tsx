import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import PracticeInterface from '@/components/PracticeInterface';
import InstructionsModal from '@/components/InstructionsModal';
import { toast } from 'sonner';
import { papersApi } from '@/utils/api';
import Lottie from 'lottie-react';
import loadAnimationData from '../load.json';

const Practice: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [waitingForData, setWaitingForData] = useState(false);
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    let cancelled = false;
    if (paperId && paperId.startsWith('jee2020')) {
      setHasAccess(true);
      setIsLoading(false);
      setIsLoggedIn(true);
      return;
    }
    
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
        
        if (!cancelled) setHasAccess(true);
        
      } catch (error) {
        console.error("[DEBUG] Error checking access:", error);
        toast.error("Failed to check access permissions");
        navigate('/papers');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    
    checkAccess();
    return () => { cancelled = true; };
  }, [paperId, navigate ]);
  
  // Handler for when user clicks "Start Test"
  const handleProceed = () => {
    if (!isLoading && hasAccess) {
      setShowInstructions(false);
    } else {
      setWaitingForData(true); // Show spinner until data is ready
    }
  };

  // When data is ready and user is waiting, proceed
  useEffect(() => {
    if (waitingForData && !isLoading && hasAccess) {
      setShowInstructions(false);
      setWaitingForData(false);
    }
  }, [waitingForData, isLoading, hasAccess]);
  
  if (showInstructions) {
    return (
      <>
        <NavBar />
        <InstructionsModal open={showInstructions} onProceed={handleProceed} />
        {waitingForData && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="w-32 h-32">
              <Lottie animationData={loadAnimationData} loop={true} />
            </div>
            <span className="mt-4 text-[#1D9A6C] font-medium">Setting up your practice session…</span>
          </div>
        )}
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