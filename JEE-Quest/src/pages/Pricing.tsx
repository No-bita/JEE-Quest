import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, Package, Lock, Info } from 'lucide-react';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paperId = searchParams.get('paperId');
  const paperTitle = searchParams.get('title') || 'JEE Papers';

  const hasSubscription = localStorage.getItem('hasSubscription') === 'true';

  return (
    <>
      <NavBar />
      <div className="page-container pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Study Plan</h1>
            {!hasSubscription ? (
              <>
                {/* Subscription Prompt */}
                {paperId && (
                  <div className="mt-4 p-2 border border-red-200 bg-red-50 text-red-700 rounded-md inline-flex items-center gap-2">
                    <Lock size={16} />
                    You need a subscription to unlock: <b>{paperTitle}</b>.
                  </div>
                )}
                {/* Subscription Plan */}
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/paywall?paperId=${paperId}&title=${paperTitle}`)}
                >
                  Subscribe Now
                </Button>
              </>
            ) : (
              <>
                {/* Access Granted */}
                {paperId && (
                  <div className="mt-4 p-2 border border-green-200 bg-green-50 text-green-700 rounded-md inline-flex items-center gap-2">
                    You have access to: <b>{paperTitle}</b>.
                  </div>
                )}
                {/* Navigation */}
                {paperId && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/practice/${paperId}`)}
                  >
                    Go to Practice Page
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Back Button */}
          {!hasSubscription && (
            <div className="text-center mb-16">
              <Button 
                variant="outline" 
                onClick={() => navigate('/papers')}
              >
                Back to Papers
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Pricing;
