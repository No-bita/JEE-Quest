
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Flag, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export type QuestionStatus = 'unattempted' | 'attempted' | 'marked-unattempted' | 'marked-attempted';

interface QuestionNavigationProps {
  questions: Array<{
    id: number;
    status: QuestionStatus;
  }>;
  currentQuestion: number;
  onSelectQuestion: (questionId: number) => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  currentQuestion,
  onSelectQuestion,
}) => {
  const getStatusIcon = (status: QuestionStatus) => {
    switch (status) {
      case 'attempted':
        return <CheckCircle size={16} />;
      case 'marked-unattempted':
        return <Flag size={16} />;
      case 'marked-attempted':
        return (
          <div className="relative">
            <Flag size={16} />
            <CheckCircle size={10} className="absolute -bottom-1 -right-1 text-status-attempted" />
          </div>
        );
      case 'unattempted':
      default:
        return <HelpCircle size={16} />;
    }
  };

  const getStatusClass = (status: QuestionStatus, isActive: boolean) => {
    const baseClasses = 'question-btn';
    
    if (isActive) {
      return cn(baseClasses, 'ring-2 ring-primary ring-offset-2 ring-offset-background');
    }
    
    switch (status) {
      case 'attempted':
        return cn(baseClasses, 'question-btn-attempted');
      case 'marked-unattempted':
        return cn(baseClasses, 'question-btn-marked-unattempted');
      case 'marked-attempted':
        return cn(baseClasses, 'question-btn-marked-attempted');
      case 'unattempted':
      default:
        return cn(baseClasses, 'question-btn-unattempted');
    }
  };

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Question Navigator</h3>
        <span className="text-sm text-muted-foreground">{questions.length} Questions</span>
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {questions.map((question) => (
          <button
            key={question.id}
            onClick={() => onSelectQuestion(question.id)}
            className={getStatusClass(question.status, currentQuestion === question.id)}
            aria-label={`Question ${question.id}`}
          >
            {question.id}
          </button>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <div className="text-sm font-medium mb-2">Legend</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="question-btn question-btn-unattempted flex-shrink-0 w-6 h-6">
              <HelpCircle size={14} />
            </div>
            <span className="text-sm">Unattempted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="question-btn question-btn-attempted flex-shrink-0 w-6 h-6">
              <CheckCircle size={14} />
            </div>
            <span className="text-sm">Attempted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="question-btn question-btn-marked-unattempted flex-shrink-0 w-6 h-6">
              <Flag size={14} />
            </div>
            <span className="text-sm">Unattempted & Marked for Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="question-btn question-btn-marked-attempted flex-shrink-0 w-6 h-6">
              <div className="relative">
                <Flag size={14} />
                <CheckCircle size={8} className="absolute -bottom-1 -right-1 text-status-attempted" />
              </div>
            </div>
            <span className="text-sm">Attempted & Marked for Review</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation;
