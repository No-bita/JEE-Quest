import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Flag, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LegendCard from './LegendCard';

export type QuestionStatus = 'unattempted' | 'attempted' | 'marked-unattempted' | 'marked-attempted';

interface QuestionNavigationProps {
  questions: Array<{
    id: number;
    status: QuestionStatus;
    idx: number;
    visited: boolean;
  }>;
  currentQuestionIndex: number;
  onSelectQuestion: (questionIdx: number) => void;
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
const getStatusClass = (status: QuestionStatus, visited: boolean, isActive: boolean) => {
  const base = 'question-btn rounded-full font-semibold transition-all duration-150 relative';
  if (isActive) return cn(base, 'ring-2 ring-primary ring-offset-2 ring-offset-background');
  if (!visited) return cn(base, 'bg-gray-200 border-gray-400 text-gray-700'); // Not visited
  if (status === 'attempted') return cn(base, 'bg-green-400 border-green-600 text-white');
  if (status === 'marked-unattempted') return cn(base, 'bg-purple-500 border-purple-700 text-white');
  if (status === 'marked-attempted') return cn(base, 'bg-purple-500 border-purple-700 text-white');
  // Visited but not attempted
  return cn(base, 'bg-orange-400 border-orange-600 text-white');
};

// Named handler to avoid inline function
function handleSelectQuestion(onSelectQuestion: (idx: number) => void, idx: number) {
  return () => onSelectQuestion(idx);
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = React.memo(({ questions, currentQuestionIndex, onSelectQuestion }) => {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Question Navigator</h3>
        <span className="text-sm text-muted-foreground">{questions.length} Questions</span>
      </div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {questions.map((question, idx) => (
          <Button
            key={question.id}
            onClick={handleSelectQuestion(onSelectQuestion, idx)}
            className={getStatusClass(question.status, question.visited, currentQuestionIndex === idx)}
            aria-label={`Question ${idx + 1}`}
            aria-current={currentQuestionIndex === idx ? 'true' : undefined}
            variant="outline"
            size="sm"
          >
            <span className="relative flex items-center justify-center w-full h-full">
              {idx + 1}
              {question.status === 'marked-attempted' && (
                <svg
                  className="absolute -top-1 right-1 w-3 h-3 text-green-400 drop-shadow"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 16 16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8l3 3 5-5"
                  />
                </svg>
              )}
            </span>
          </Button>
        ))}
      </div>
      <LegendCard questions={questions} />
    </div>
  );
});

export default QuestionNavigation;
