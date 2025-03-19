
import React, { useState, useEffect } from 'react';
import { Flag, ChevronLeft, ChevronRight, Timer, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import QuestionNavigation, { QuestionStatus } from './QuestionNavigation';
import MathRenderer from './MathRenderer';
import { Question } from '@/utils/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

interface PracticeInterfaceProps {
  paperId: string;
}

const PracticeInterface: React.FC<PracticeInterfaceProps> = ({ paperId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [questionStatus, setQuestionStatus] = useState<Record<number, QuestionStatus>>({});
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
  const [isActive, setIsActive] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const CORRECT_MARKS = 4;
  const INCORRECT_MARKS = -1;
  const UNATTEMPTED_MARKS = 0;

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        console.log(`Loading questions for paper: ${paperId}`);
        
        // In a real implementation, you would fetch this from your API
        // For now, we're using mock data with some variation based on the paperId
        const paperId2DigitYear = parseInt(paperId.split('-')[0].slice(-2));
        const questionCount = 5 + (paperId2DigitYear % 3);
        
        // Create a copy of mockQuestions with adjustments based on paperId
        const paperQuestions = mockQuestions.slice(0, questionCount).map(q => ({
          ...q,
          id: q.id + (paperId2DigitYear * 10),
          text: paperId.includes('shift-2') 
            ? q.text + ' (Shift 2 variant)' 
            : q.text
        }));
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setQuestions(paperQuestions);
        
        // Initialize question status based on loaded questions
        const initialStatus: Record<number, QuestionStatus> = {};
        paperQuestions.forEach(q => {
          initialStatus[q.id] = 'unattempted';
        });
        setQuestionStatus(initialStatus);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading questions:', error);
        toast.error('Failed to load questions. Please try again.');
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [paperId]);

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
    
    if (questionStatus[questionId] === 'unattempted') {
      setQuestionStatus(prev => ({
        ...prev,
        [questionId]: 'attempted'
      }));
    } else if (questionStatus[questionId] === 'marked-unattempted') {
      setQuestionStatus(prev => ({
        ...prev,
        [questionId]: 'marked-attempted'
      }));
    }
  };

  const handleMarkForReview = (questionId: number) => {
    setQuestionStatus(prev => {
      const currentStatus = prev[questionId];
      let newStatus: QuestionStatus;
      
      if (currentStatus === 'marked-unattempted') {
        newStatus = 'unattempted';
      } else if (currentStatus === 'marked-attempted') {
        newStatus = 'attempted';
      } else if (currentStatus === 'attempted') {
        newStatus = 'marked-attempted';
      } else {
        newStatus = 'marked-unattempted';
      }
      
      return {
        ...prev,
        [questionId]: newStatus
      };
    });
    
    toast.info(
      questionStatus[questionId]?.includes('marked') 
        ? "Question unmarked from review" 
        : "Question marked for review"
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSelectQuestion = (questionId: number) => {
    const index = questions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleSubmit = () => {
    setIsActive(false);
    
    const score = questions.reduce((total, q) => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return total + UNATTEMPTED_MARKS;
      return userAnswer === q.correctOption ? total + CORRECT_MARKS : total + INCORRECT_MARKS;
    }, 0);
    
    const results = {
      paperId,
      answers,
      questionStatus,
      timeSpent: 7200 - timeLeft,
      date: new Date().toISOString(),
      score: score,
      maxPossibleScore: questions.length * CORRECT_MARKS
    };
    
    const allResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    
    localStorage.setItem('testResults', JSON.stringify([...allResults, results]));
    
    toast.success("Your responses have been submitted successfully!");
    
    setTimeout(() => {
      navigate(`/results/${paperId}`);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="page-container pt-24 flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="page-container pt-24 flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No Questions Found</h2>
          <p className="text-gray-600 mb-4">Unable to load questions for this paper.</p>
          <Button onClick={() => navigate('/papers')}>Back to Papers</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const navigatorQuestions = questions.map(q => ({
    id: q.id,
    status: questionStatus[q.id] || 'unattempted'
  }));

  const attemptedCount = Object.keys(answers).length;
  const progress = (attemptedCount / questions.length) * 100;
  
  const potentialScore = questions.reduce((total, q) => {
    const userAnswer = answers[q.id];
    if (!userAnswer) return total + UNATTEMPTED_MARKS;
    return userAnswer === q.correctOption ? total + CORRECT_MARKS : total + INCORRECT_MARKS;
  }, 0);
  
  const maxPossibleScore = questions.length * CORRECT_MARKS;
  
  return (
    <div className="page-container grid grid-cols-1 lg:grid-cols-4 gap-6 pt-24">
      <div className="col-span-1 lg:col-span-3 glass-card rounded-xl p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <Timer size={18} className="text-primary" />
              <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
            </div>
            <Badge variant="outline" className="px-2 py-0.5">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

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
                className={questionStatus[currentQuestion.id]?.includes('marked') ? 'text-purple-500 fill-purple-200' : ''} 
              />
            </Button>
          </div>
          
          <div className="text-lg font-medium mb-6">
            <span className="mr-2 inline-block bg-primary/10 text-primary rounded px-2 py-0.5">{currentQuestionIndex + 1}.</span>
            {/* Use MathRenderer for question text if it contains math notation */}
            {currentQuestion.text.includes('$') || 
             currentQuestion.text.includes('\\') ? 
              <MathRenderer math={currentQuestion.text} /> : 
              currentQuestion.text
            }
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
                  {/* Use MathRenderer for option text if it contains math notation */}
                  {option.text.includes('$') || 
                   option.text.includes('\\') ? 
                    <MathRenderer math={option.text} /> : 
                    option.text
                  }
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <Separator className="my-6" />
        
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
          
          <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="default"
                className="gap-2"
              >
                <Save size={16} />
                Submit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                <AlertDialogDescription>
                  {attemptedCount < questions.length ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center text-amber-600 gap-2">
                        <AlertTriangle size={16} />
                        <span>You have only attempted {attemptedCount} out of {questions.length} questions.</span>
                      </div>
                      <div className="text-sm mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="font-medium mb-1">Marking Scheme:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Correct Answer: <span className="font-medium text-green-600">+{CORRECT_MARKS} marks</span></li>
                          <li>Incorrect Answer: <span className="font-medium text-red-600">{INCORRECT_MARKS} mark</span></li>
                          <li>Unattempted Question: <span className="font-medium text-gray-600">{UNATTEMPTED_MARKS} marks</span></li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span>You've answered all questions. Your test will be submitted and you'll see your results.</span>
                      <div className="text-sm mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="font-medium mb-1">Marking Scheme:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Correct Answer: <span className="font-medium text-green-600">+{CORRECT_MARKS} marks</span></li>
                          <li>Incorrect Answer: <span className="font-medium text-red-600">{INCORRECT_MARKS} mark</span></li>
                          <li>Unattempted Question: <span className="font-medium text-gray-600">{UNATTEMPTED_MARKS} marks</span></li>
                        </ul>
                      </div>
                    </div>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Submit Test</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button
            variant="outline"
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className="gap-2"
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
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
