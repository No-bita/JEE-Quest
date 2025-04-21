
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

// Helper: Get status icon
const getStatusIcon = (status: QuestionStatus) => {
  switch (status) {
    case 'attempted':
      return <CheckCircle size={16} />;
    case 'marked-unattempted':
      return <Flag size={16} className="text-purple-600" />;
    case 'marked-attempted':
      return (
        <span className="relative inline-block">
          <Flag size={16} className="text-purple-600" />
          <CheckCircle size={10} className="absolute -top-1 -right-1 text-green-600 bg-white rounded-full" />
        </span>
      );
    case 'unattempted':
    default:
      return <HelpCircle size={16} />;
  }
};

// Helper: Get status class
const getStatusClass = (status: QuestionStatus, isActive: boolean) => {
  const base = 'question-btn';
  if (isActive) return cn(base, 'ring-2 ring-primary ring-offset-2 ring-offset-background');
  if (status === 'attempted') return cn(base, 'question-btn-attempted');
  if (status === 'marked-unattempted' || status === 'marked-attempted') return cn(base, 'bg-purple-100 border-purple-400 text-purple-700');
  return cn(base, 'question-btn-unattempted');
};

// Named handler to avoid inline function
function handleSelectQuestion(onSelectQuestion: (id: number) => void, id: number) {
  return () => onSelectQuestion(id);
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = React.memo(({ questions, currentQuestion, onSelectQuestion }) => {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Question Navigator</h3>
        <span className="text-sm text-muted-foreground">{questions.length} Questions</span>
      </div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {questions.map((question) => (
          <Button
            key={question.id}
            onClick={handleSelectQuestion(onSelectQuestion, question.id)}
            className={getStatusClass(question.status, currentQuestion === question.id)}
            aria-label={`Question ${question.id}`}
            aria-current={currentQuestion === question.id ? 'true' : undefined}
            variant="outline"
            size="sm"
          >
            <span className="flex items-center gap-1">
              {getStatusIcon(question.status)}
              {question.id}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
});

export default QuestionNavigation;

