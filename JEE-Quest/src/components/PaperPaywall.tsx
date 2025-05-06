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

  const handlePurchaseSubscription = () => {
    setIsProcessing(true);

    // Simulate subscription purchase
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
      toast.success('Access granted successfully!');

      // Navigate to the practice page
      navigate(`/practice/${paperId}`);
    }, 2000);
  };

  const hasSubscription = localStorage.getItem('hasSubscription') === 'true';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="text-amber-500" size={18} />
            Unlock Premium Content
          </DialogTitle>
          <DialogDescription>
            Access to {paperTitle} requires a premium subscription.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Subscription Plan */}
          {!hasSubscription && (
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
          )}

          {/* Access Granted */}
          {hasSubscription && (
            <div className="glass-card p-4 rounded-lg bg-green-50 text-green-700">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Check size={16} className="text-green-500" /> Access Granted!
              </h3>
              <p>You have unlimited access to this paper and all other premium features.</p>
              <Button 
                variant="outline" 
                onClick={() => navigate(`/practice/${paperId}`)}
              >
                Go to Practice Page
              </Button>
            </div>
          )}
        </div>

        {!hasSubscription && (
          <DialogFooter className="sm:justify-start">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaperPaywall;
