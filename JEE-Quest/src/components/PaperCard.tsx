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
  freeTrialPaperIds?: string[]; // Configurable list of free trial paper ids
  hasAccess?: boolean; // Whether the user has access to this paper
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
  onEditPaper,
  freeTrialPaperIds = ['jee2020-1'],
  hasAccess,
}) => {
  const navigate = useNavigate();

  // Determine if this paper is a free trial paper
  const isFreeTrialPaper = freeTrialPaperIds.includes(id);

  const handlePracticeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFreeTrialPaper) {
      // Directly navigate to practice for the free trial paper
      navigate(`/practice/${id}`);
    } else if (isPremium && !hasAccess) {
      // Redirect to pricing for premium papers without access
      navigate(`/pricing?paperId=${id}&title=JEE Mains ${year} - ${shift}`);
    } else {
      // Navigate to practice for accessible papers
      navigate(`/practice/${id}`);
    }
  };

  // Determine title display based on whether session is provided
  const titleDisplay = `${date} - ${shift}`;

  return (
    <div className="rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl animate-scale-in bg-[#FAFBF6] dark:bg-[#181A20] border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">
              {titleDisplay}
            </h3>
            {session && (
              <div className="flex items-center text-sm text-muted-foreground dark:text-gray-400">
                <Calendar size={14} className="mr-1" /> {session}
              </div>
            )}
          </div>
          {/* Badge for Premium Papers */}
          {isPremium && !hasAccess ? (
            <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50 dark:bg-[#2D2320] dark:border-amber-900 dark:text-amber-300 flex items-center gap-1">
              <Lock size={12} />
              Premium
            </Badge>
          ) : (
            isPremium && hasAccess && (
              <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50 dark:bg-[#1A2D1A] dark:border-green-900 dark:text-green-300 flex items-center gap-1">
                <CheckCircle size={12} />
              </Badge>
            )
          )}
        </div>

        <div className="flex space-x-4 mb-6">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <FileText size={14} className="mr-1.5 text-muted-foreground dark:text-gray-400" />
            <span>{questionCount} Questions</span>
          </div>
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Clock size={14} className="mr-1.5 text-muted-foreground dark:text-gray-400" />
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
            className={`w-full flex items-center justify-center ${isPremium && !hasAccess ? '' : 'bg-primary text-white hover:bg-primary/90 dark:bg-green-600 dark:hover:bg-green-500 dark:text-gray-900'}`}
            variant={isPremium && !hasAccess ? "outline" : "default"}
            onClick={handlePracticeClick}
          >
            {isPremium && !hasAccess ? (
              <>
                Unlock Practice <Lock size={14} className="ml-2" />
              </>
            ) : (
              <>
                Start Practice <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaperCard;
