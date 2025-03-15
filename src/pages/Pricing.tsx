
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, Package, Lock } from 'lucide-react';
import { toast } from 'sonner';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paperId = searchParams.get('paperId');
  const paperTitle = searchParams.get('title') || 'JEE Papers';
  
  const [isProcessingPaper, setIsProcessingPaper] = useState(false);
  const [isProcessingSub, setIsProcessingSub] = useState(false);
  
  const handlePurchasePaper = () => {
    if (!paperId) {
      toast.error("No paper selected");
      return;
    }
    
    setIsProcessingPaper(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const purchasedPapers = JSON.parse(localStorage.getItem('purchasedPapers') || '[]');
      purchasedPapers.push(paperId);
      localStorage.setItem('purchasedPapers', JSON.stringify(purchasedPapers));
      
      setIsProcessingPaper(false);
      toast.success('Paper purchased successfully!');
      
      // Navigate to the practice page
      navigate(`/practice/${paperId}`);
    }, 1500);
  };
  
  const handlePurchaseSubscription = () => {
    setIsProcessingSub(true);
    
    // Simulate subscription processing
    setTimeout(() => {
      // Mark all papers as purchased
      const allPaperIds = [
        'jee2025-1', 'jee2025-2', 'jee2024-1', 'jee2024-2', 
        'jee2023-1', 'jee2023-2', 'jee2022-1', 'jee2022-2',
        'jee2021-1', 'jee2021-2', 'jee2020-1', 'jee2020-2'
      ];
      localStorage.setItem('purchasedPapers', JSON.stringify(allPaperIds));
      localStorage.setItem('hasSubscription', 'true');
      
      setIsProcessingSub(false);
      toast.success('Subscription purchased successfully!');
      
      // Navigate to the practice page if there was a specific paper
      if (paperId) {
        navigate(`/practice/${paperId}`);
      } else {
        navigate('/papers');
      }
    }, 2000);
  };
  
  return (
    <>
      <NavBar />
      <div className="page-container pt-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Study Plan</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access premium JEE practice materials to boost your preparation and ace your exams.
            </p>
            {paperId && (
              <div className="mt-4 p-2 border border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400 rounded-md inline-flex items-center gap-2">
                <Lock size={16} />
                <span>You're unlocking: <b>{paperTitle}</b></span>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Individual Paper Plan */}
            <div className="glass-card p-8 rounded-xl hover:shadow-lg transition-all">
              <div className="mb-4">
                <div className="bg-primary/10 text-primary inline-flex rounded-full p-3 mb-4">
                  <CreditCard size={26} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Single Paper Access</h2>
                <p className="text-muted-foreground">
                  Get access to individual papers of your choice.
                </p>
              </div>
              
              <div className="mb-6">
                <div className="text-3xl font-bold">
                  ₹99
                  <span className="text-sm font-normal text-muted-foreground ml-1">/ paper</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1" size={18} />
                  <span>Full access to the selected paper</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1" size={18} />
                  <span>Detailed solutions & explanations</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1" size={18} />
                  <span>Performance tracking for this paper</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handlePurchasePaper}
                disabled={isProcessingPaper || !paperId}
              >
                {isProcessingPaper ? 'Processing...' : paperId ? 'Purchase This Paper' : 'Select a Paper First'}
              </Button>
            </div>
            
            {/* Subscription Plan */}
            <div className="glass-card p-8 rounded-xl border-2 border-primary hover:shadow-lg transition-all relative">
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                RECOMMENDED
              </div>
              
              <div className="mb-4">
                <div className="bg-primary/10 text-primary inline-flex rounded-full p-3 mb-4">
                  <Package size={26} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Full Access Subscription</h2>
                <p className="text-muted-foreground">
                  Unlimited access to all papers and premium features.
                </p>
              </div>
              
              <div className="mb-6">
                <div className="text-3xl font-bold">
                  ₹499
                  <span className="text-sm font-normal text-muted-foreground ml-1">/ year</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1" size={18} />
                  <span><b>All JEE papers</b> from 2020-2025</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1" size={18} />
                  <span>Complete detailed solutions & explanations</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1" size={18} />
                  <span>Comprehensive performance analytics</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1" size={18} />
                  <span>Progress tracking across all papers</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="text-green-500 mt-1" size={18} />
                  <span>Access to all future papers as they're added</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handlePurchaseSubscription}
                disabled={isProcessingSub}
              >
                {isProcessingSub ? 'Processing...' : 'Get Full Access'}
              </Button>
            </div>
          </div>
          
          <div className="text-center mb-16">
            <Button 
              variant="outline" 
              onClick={() => navigate('/papers')}
            >
              Back to Papers
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
