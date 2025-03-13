
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Flag, AlertCircle, ChevronLeft, ChevronRight, Timer, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import QuestionNavigation, { QuestionStatus } from './QuestionNavigation';

// Mock data for practice interface
const mockQuestions = [
  {
    id: 1,
    text: "A particle of mass m is projected with velocity v at an angle θ with the horizontal. The magnitude of angular momentum of the particle about the point of projection when the particle is at its highest point is:",
    options: [
      { id: 'A', text: "mv² sin θ cos θ / g" },
      { id: 'B', text: "mv² sin² θ / g" },
      { id: 'C', text: "mv² cos² θ / g" },
      { id: 'D', text: "zero" }
    ],
    correctOption: 'A',
    difficulty: 'medium',
    subject: 'Physics',
    topic: 'Kinematics'
  },
  {
    id: 2,
    text: "The value of lim(x→0) (sin³x + tan³x) / (sin x + tan x)³ is:",
    options: [
      { id: 'A', text: "1/27" },
      { id: 'B', text: "1/3" },
      { id: 'C', text: "1" },
      { id: 'D', text: "1/9" }
    ],
    correctOption: 'D',
    difficulty: 'hard',
    subject: 'Mathematics',
    topic: 'Limits'
  },
  {
    id: 3,
    text: "In the reaction, 2A + B → C + D, when 3 mol of A reacts with 2 mol of B, the limiting reagent is:",
    options: [
      { id: 'A', text: "A" },
      { id: 'B', text: "B" },
      { id: 'C', text: "Both A and B" },
      { id: 'D', text: "Neither A nor B" }
    ],
    correctOption: 'A',
    difficulty: 'easy',
    subject: 'Chemistry',
    topic: 'Stoichiometry'
  },
  {
    id: 4,
    text: "The sum of first 20 terms of an arithmetic progression is 50. If the first term is -10, then the 20th term is:",
    options: [
      { id: 'A', text: "15" },
      { id: 'B', text: "5" },
      { id: 'C', text: "10" },
      { id: 'D', text: "20" }
    ],
    correctOption: 'A',
    difficulty: 'medium',
    subject: 'Mathematics',
    topic: 'Sequences and Series'
  },
  {
    id: 5,
    text: "Which of the following compounds will show optical isomerism?",
    options: [
      { id: 'A', text: "2-butanol" },
      { id: 'B', text: "2-propanol" },
      { id: 'C', text: "2,2-dimethylbutane" },
      { id: 'D', text: "1-propanol" }
    ],
    correctOption: 'A',
    difficulty: 'medium',
    subject: 'Chemistry',
    topic: 'Stereochemistry'
  }
];

const PracticeInterface: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [questionStatus, setQuestionStatus] = useState<Record<number, QuestionStatus>>({});
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
  const [isActive, setIsActive] = useState(true);

  // Initialize question status
  useEffect(() => {
    const initialStatus: Record<number, QuestionStatus> = {};
    mockQuestions.forEach(q => {
      initialStatus[q.id] = 'unattempted';
    });
    setQuestionStatus(initialStatus);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      toast.warning("Time's up! Your answers will be submitted automatically.");
      handleSubmit();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // If question was unattempted, mark it as attempted
    if (questionStatus[questionId] === 'unattempted') {
      setQuestionStatus(prev => ({
        ...prev,
        [questionId]: 'attempted'
      }));
    }
  };

  const handleMarkForReview = (questionId: number) => {
    setQuestionStatus(prev => ({
      ...prev,
      [questionId]: prev[questionId] === 'marked' ? 
        (answers[questionId] ? 'attempted' : 'unattempted') : 'marked'
    }));
    
    toast.info(questionStatus[questionId] === 'marked' 
      ? "Question unmarked from review" 
      : "Question marked for review");
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSelectQuestion = (questionId: number) => {
    const index = mockQuestions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleSubmit = () => {
    setIsActive(false);
    toast.success("Your responses have been submitted successfully!");
    // Here you would typically send the answers to a server
  };

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const navigatorQuestions = mockQuestions.map(q => ({
    id: q.id,
    status: questionStatus[q.id] || 'unattempted'
  }));

  // Calculate progress
  const attemptedCount = Object.values(questionStatus).filter(
    status => status === 'attempted' || status === 'marked'
  ).length;
  const progress = (attemptedCount / mockQuestions.length) * 100;

  return (
    <div className="page-container grid grid-cols-1 lg:grid-cols-4 gap-6 pt-24">
      {/* Main content - 3/4 width on desktop */}
      <div className="col-span-1 lg:col-span-3 glass-card rounded-xl p-6">
        {/* Timer and progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <Timer size={18} className="text-primary" />
              <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
            </div>
            <Badge variant="outline" className="px-2 py-0.5">
              Question {currentQuestionIndex + 1} of {mockQuestions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge 
              variant="outline" 
              className={`${
                currentQuestion.difficulty === 'easy' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : currentQuestion.difficulty === 'medium' 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
            </Badge>
            <Badge variant="secondary">{currentQuestion.subject}</Badge>
            <Badge variant="secondary">{currentQuestion.topic}</Badge>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto"
              onClick={() => handleMarkForReview(currentQuestion.id)}
            >
              <Flag 
                size={18} 
                className={questionStatus[currentQuestion.id] === 'marked' ? 'text-status-marked fill-status-marked' : ''} 
              />
            </Button>
          </div>
          
          <div className="text-lg font-medium mb-6">
            <span className="mr-2 inline-block bg-primary/10 text-primary rounded px-2 py-0.5">{currentQuestionIndex + 1}.</span>
            {currentQuestion.text}
          </div>
          
          <RadioGroup 
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            className="space-y-4"
          >
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 glass-card rounded-lg p-4 transition-all hover:shadow">
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                  <span className="font-medium mr-2">{option.id}.</span>
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <Separator className="my-6" />
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="gap-2"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>
          
          <Button
            variant="default"
            onClick={handleSubmit}
            className="gap-2"
          >
            <Save size={16} />
            Submit
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === mockQuestions.length - 1}
            className="gap-2"
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
      {/* Sidebar - 1/4 width on desktop */}
      <div className="col-span-1">
        <QuestionNavigation
          questions={navigatorQuestions}
          currentQuestion={currentQuestion.id}
          onSelectQuestion={handleSelectQuestion}
        />
      </div>
    </div>
  );
};

export default PracticeInterface;
