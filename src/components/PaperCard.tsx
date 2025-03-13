
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, FileText, ArrowRight, Star, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import PaperPaywall from './PaperPaywall';

interface PaperCardProps {
  id: string;
  year: number;
  shift: string;
  date: string;
  questionCount: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isPremium?: boolean;
  isAdmin?: boolean;
  onEditPaper?: (paperId: string) => void;
}

const PaperCard: React.FC<PaperCardProps> = ({
  id,
  year,
  shift,
  date,
  questionCount,
  duration,
  difficulty,
  isPremium = true, // Most papers will be premium by default
  isAdmin = false,
  onEditPaper
}) => {
  const { toast } = useToast();
  const [showPaywall, setShowPaywall] = React.useState(false);
  
  // Function to determine if user has access to this paper
  const hasPaperAccess = () => {
    // In a real app, this would check if the user has purchased this paper
    // For now, we'll use localStorage as a simple way to track purchases
    const purchasedPapers = JSON.parse(localStorage.getItem('purchasedPapers') || '[]');
    return !isPremium || purchasedPapers.includes(id);
  };
  
  const handlePracticeClick = (e: React.MouseEvent) => {
    if (isPremium && !hasPaperAccess()) {
      e.preventDefault();
      setShowPaywall(true);
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      case 'medium':
        return 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800';
      case 'hard':
        return 'text-red-500 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
      default:
        return '';
    }
  };

  const difficultyStars = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl animate-scale-in">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">
              JEE Mains {year} - {shift}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar size={14} className="mr-1" /> {date}
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn('font-medium', getDifficultyColor(difficulty))}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            {Array(difficultyStars[difficulty])
              .fill(0)
              .map((_, i) => (
                <Star key={i} size={12} className="ml-0.5 inline-block" fill="currentColor" />
              ))}
          </Badge>
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
          {isPremium && !hasPaperAccess() && (
            <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50 flex items-center gap-1">
              <Lock size={12} />
              Premium
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          {isAdmin && (
            <Button variant="outline" className="flex-1" onClick={() => onEditPaper?.(id)}>
              Edit Questions
            </Button>
          )}
          
          <Link 
            to={`/practice/${id}`} 
            className={cn("flex-1", isPremium && !hasPaperAccess() && "pointer-events-none")}
            onClick={handlePracticeClick}
          >
            <Button 
              className="w-full flex items-center justify-center"
              variant={isPremium && !hasPaperAccess() ? "outline" : "default"}
            >
              {isPremium && !hasPaperAccess() ? (
                <>Unlock Practice <Lock size={14} className="ml-2" /></>
              ) : (
                <>Practice <ArrowRight size={16} className="ml-2" /></>
              )}
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Paywall Dialog */}
      <PaperPaywall 
        open={showPaywall} 
        onOpenChange={setShowPaywall}
        paperId={id}
        paperTitle={`JEE Mains ${year} - ${shift}`}
      />
    </div>
  );
};

export default PaperCard;
