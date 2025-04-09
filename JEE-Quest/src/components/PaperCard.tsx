import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PaperCardProps {
  id: string;
  year: number;
  shift: string;
  session?: string; // Add session as an optional prop
  date: string;
  questionCount: number;
  duration: number;
  isPremium?: boolean;
  isAdmin?: boolean;
  onEditPaper?: (paperId: string) => void;
}

const PaperCard: React.FC<PaperCardProps> = ({
  id,
  year,
  shift,
  session,
  date,
  questionCount,
  duration,
  isPremium = true, // All papers are premium by default
  isAdmin = false,
  onEditPaper
}) => {
  const navigate = useNavigate();

  // Function to determine if user has a subscription
  const hasSubscription = () => {
    return localStorage.getItem('hasSubscription') === 'true';
  };

  const handlePracticeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPremium && !hasSubscription()) {
      // Redirect to pricing page if user doesn't have a subscription
      navigate(`/pricing?paperId=${id}&title=JEE Mains ${year} - ${shift}`);
    } else {
      // Navigate to practice page if user has access
      navigate(`/practice/${id}`);
    }
  };

  // Determine title display based on whether session is provided
  const titleDisplay = `${date} - ${shift}`;

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl animate-scale-in">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {titleDisplay}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar size={14} className="mr-1" /> {session}
            </div>
          </div>
          {/* Badge for Premium Papers */}
          {isPremium && !hasSubscription() ? (
            <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50 flex items-center gap-1">
              <Lock size={12} />
              Premium
            </Badge>
          ) : (
            isPremium && (
              <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50 flex items-center gap-1">
                <CheckCircle size={12} />
              </Badge>
            )
          )}
        </div>

        <div className="flex space-x-4 mb-6">
          <div className="flex items-center text-sm">
            <FileText size={14} className="mr-1.5 text-muted-foreground" />
            <span>{questionCount} Questions</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock size={14} className="mr-1.5 text-muted-foreground" />
            <span>{duration} Minutes</span>
          </div>
        </div>

        <div className="flex gap-2">
          {isAdmin && (
            <Button variant="outline" className="flex-1" onClick={() => onEditPaper?.(id)}>
              Edit Questions
            </Button>
          )}
          
          <Button 
            className="w-full flex items-center justify-center"
            variant={isPremium && !hasSubscription() ? "outline" : "default"}
            onClick={handlePracticeClick}
          >
            {isPremium && !hasSubscription() ? (
              <>Unlock Practice <Lock size={14} className="ml-2" /></>
            ) : (
              <>Practice <ArrowRight size={16} className="ml-2" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaperCard;
