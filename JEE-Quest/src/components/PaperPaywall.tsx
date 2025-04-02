
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock, Check, Package } from 'lucide-react';
import { toast } from 'sonner';

interface PaperPaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paperId: string;
  paperTitle: string;
}

const PaperPaywall: React.FC<PaperPaywallProps> = ({
  open,
  onOpenChange,
  paperId,
  paperTitle
}) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePurchasePaper = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // In a real app, this would call a payment API
      // For demo purposes, we'll just save to localStorage
      const purchasedPapers = JSON.parse(localStorage.getItem('purchasedPapers') || '[]');
      purchasedPapers.push(paperId);
      localStorage.setItem('purchasedPapers', JSON.stringify(purchasedPapers));
      
      setIsProcessing(false);
      onOpenChange(false);
      toast.success('Paper purchased successfully!');
      
      // Navigate to the practice page
      navigate(`/practice/${paperId}`);
    }, 1500);
  };
  
  const handlePurchaseSubscription = () => {
    setIsProcessing(true);
    
    // Simulate subscription processing
    setTimeout(() => {
      // Mark all papers as purchased
      const allPaperIds = [
        'jee2025-1', 'jee2025-2', 'jee2024-1', 'jee2024-2', 'jee2024-3', 'jee2024-4', 
        'jee2023-1', 'jee2023-2', 'jee2022-1', 'jee2022-2',
        'jee2021-1', 'jee2021-2', 'jee2020-1', 'jee2020-2'
      ];
      localStorage.setItem('purchasedPapers', JSON.stringify(allPaperIds));
      localStorage.setItem('hasSubscription', 'true');
      
      setIsProcessing(false);
      onOpenChange(false);
      toast.success('Subscription purchased successfully!');
      
      // Navigate to the practice page
      navigate(`/practice/${paperId}`);
    }, 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="text-amber-500" size={18} />
            Unlock Premium Content
          </DialogTitle>
          <DialogDescription>
            Access to {paperTitle} requires a premium subscription or individual purchase.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="glass-card p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <CreditCard size={16} className="text-primary" /> Individual Paper
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get access to {paperTitle} only.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">₹99</span>
              <Button 
                onClick={handlePurchasePaper} 
                disabled={isProcessing}
                size="sm"
              >
                {isProcessing ? 'Processing...' : 'Purchase Paper'}
              </Button>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-lg border-2 border-primary">
            <div className="absolute -mt-7 -ml-2 bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-bold">
              BEST VALUE
            </div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Package size={16} className="text-primary" /> Full Access Subscription
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get unlimited access to all papers and future updates.
            </p>
            <ul className="text-sm space-y-1 mb-3">
              <li className="flex items-center gap-1">
                <Check size={14} className="text-green-500" /> All practice papers
              </li>
              <li className="flex items-center gap-1">
                <Check size={14} className="text-green-500" /> Detailed solutions
              </li>
              <li className="flex items-center gap-1">
                <Check size={14} className="text-green-500" /> Performance analytics
              </li>
            </ul>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold">₹499</span>
                <span className="text-xs text-muted-foreground ml-1">/year</span>
              </div>
              <Button 
                onClick={handlePurchaseSubscription} 
                disabled={isProcessing}
                size="sm"
              >
                {isProcessing ? 'Processing...' : 'Get Subscription'}
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaperPaywall;
