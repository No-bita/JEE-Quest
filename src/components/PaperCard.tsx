
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, FileText, ArrowRight, Star } from 'lucide-react';
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
  difficulty: 'easy' | 'medium' | 'hard';
}

const PaperCard: React.FC<PaperCardProps> = ({
  id,
  year,
  shift,
  date,
  questionCount,
  duration,
  difficulty,
}) => {
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
        </div>

        <div className="flex gap-2">
          <Link to={`/papers/${id}`} className="flex-1">
            <Button variant="outline" className="w-full">View Paper</Button>
          </Link>
          <Link to={`/practice/${id}`} className="flex-1">
            <Button className="w-full flex items-center justify-center">
              Practice <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaperCard;
