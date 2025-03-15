
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, ArrowRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PaperCardProps {
  id: string;
  year: number;
  shift: string;
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
  date,
  questionCount,
  duration,
  isPremium = true, // Most papers will be premium by default
  isAdmin = false,
  onEditPaper
}) => {
  const navigate = useNavigate();
  
  // Function to determine if user has access to this paper
  const hasPaperAccess = () => {
    // In a real app, this would check if the user has purchased this paper
    // For now, we'll use localStorage as a simple way to track purchases
    const purchasedPapers = JSON.parse(localStorage.getItem('purchasedPapers') || '[]');
    return !isPremium || purchasedPapers.includes(id);
  };
  
  const handlePracticeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPremium && !hasPaperAccess()) {
      navigate(`/pricing?paperId=${id}&title=JEE Mains ${year} - ${shift}`);
    } else {
      navigate(`/practice/${id}`);
    }
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
          {isPremium && !hasPaperAccess() && (
            <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50 flex items-center gap-1">
              <Lock size={12} />
              Premium
            </Badge>
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
            variant={isPremium && !hasPaperAccess() ? "outline" : "default"}
            onClick={handlePracticeClick}
          >
            {isPremium && !hasPaperAccess() ? (
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
