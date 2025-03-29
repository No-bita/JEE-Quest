import React, { useState, useEffect, useCallback } from 'react';
import { Flag, ChevronLeft, ChevronRight, Timer, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

// Scoring constants
const CORRECT_MARKS = 4;
const INCORRECT_MARKS = -1;
const UNATTEMPTED_MARKS = 0;

interface PracticeInterfaceProps {
  paperId: string;
}

const PracticeInterface: React.FC<PracticeInterfaceProps> = ({ paperId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [questionStatus, setQuestionStatus] = useState<Record<number, QuestionStatus>>({});
  const [timeLeft, setTimeLeft] = useState(10800); // 3 hours in seconds
  const [isActive, setIsActive] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  

  interface ScoreReport {
    totalScore: number;
    maxPossibleScore: number;
    correctQuestions: number;
    incorrectQuestions: number;
    unattemptedQuestions: number;
  }

  // Calculate score based on current answers
  const calculateScore = useCallback((): ScoreReport => {
    const report: ScoreReport = {
      totalScore: 0,
      maxPossibleScore: questions.length * CORRECT_MARKS,
      correctQuestions: 0,
      incorrectQuestions: 0,
      unattemptedQuestions: 0
    };

    questions.forEach(q => {
      const userAnswer = answers[q.id];
      if (!userAnswer) {
        report.unattemptedQuestions++;
        report.totalScore += UNATTEMPTED_MARKS;
      } else if (userAnswer === q.correctOption) {
        report.totalScore += CORRECT_MARKS;
        report.correctQuestions++;
      } else {
        report.totalScore += INCORRECT_MARKS;
        report.incorrectQuestions++;
      }
    });

    return report;
  }, [questions, answers]);
  
  // Handle submission with useCallback to avoid dependency issues
  const handleSubmit = useCallback(() => {
    setIsActive(false);
    
    const scoreReport = calculateScore();
    
    const results = {
      ...scoreReport,
      paperId,
      answers,
      questionStatus,
      timeSpent: 10800 - timeLeft,
      date: new Date().toISOString(),
    };
    
    localStorage.setItem('testResults', JSON.stringify(results));
    
    toast.success("Your responses have been submitted successfully!");
    
    setTimeout(() => {
      navigate(`/results/${paperId}`);
    }, 1000);
  }, [paperId, answers, questionStatus, timeLeft, questions, navigate, calculateScore]);

  // Load questions effect
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        console.log(`Loading questions for paper: ${paperId}`);
        
        const response = await fetch(`${API_BASE_URL}/papers/${paperId}/questions`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.status}`);
        }
        
        const result = await response.json();
      
        if (!result.success || !result.data) {
          throw new Error('Invalid response format from API');
        }
        
        // Map the API response to match our component's expected format
        const paperQuestions = result.data.map(q => ({
          id: q.id,
          text: '', // No text, using imageUrl instead
          imageUrl: q.imageUrl,
          options: q.type.toUpperCase() === 'MCQ' ? q.options.map(opt => ({
            id: opt.id.toString(),
            text: opt.text || '',
          })) : [],
          correctOption: q.correctOption.toString(), 
          subject: q.subject || 'Unknown',
          type: q.type.toUpperCase() || 'MCQ',
        }));

        setQuestions(paperQuestions);
        
        // Initialize question status
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
  }, [paperId, API_BASE_URL]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      toast.warning("Time's up! Your answers will be submitted automatically.");
      handleSubmit();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleSubmit]); // Added handleSubmit to dependencies

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
    
    setQuestionStatus(prev => {
      const currentStatus = prev[questionId];
      
      if (currentStatus === 'unattempted') {
        return { ...prev, [questionId]: 'attempted' };
      } else if (currentStatus === 'marked-unattempted') {
        return { ...prev, [questionId]: 'marked-attempted' };
      }
      
      return prev;
    });
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
  
  const renderQuestionContent = () => {
    if (currentQuestion.imageUrl) {
      return (
        <img 
          src={currentQuestion.imageUrl} 
          alt={`Question ${currentQuestionIndex + 1}`} 
          className="mt-4 w-full max-w-lg mx-auto rounded-lg shadow"
        />
      );
    } else if (currentQuestion.text.includes('$') || currentQuestion.text.includes('\\')) {
      return <MathRenderer math={currentQuestion.text} />;
    } else {
      return currentQuestion.text;
    }
  };
  
  return (
    <div className="page-container grid grid-cols-1 lg:grid-cols-4 gap-6 pt-24">
      <div className="col-span-1 lg:col-span-3 glass-card rounded-xl p-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <Timer size={18} className="text-primary" />
            <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
          </div>
          <Badge variant="outline" className="px-2 py-0.5">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2 mb-6" />

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{currentQuestion.subject}</Badge>
            
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
            <span className="mr-2 inline-block bg-primary/10 text-primary rounded px-2 py-0.5">
              {currentQuestionIndex + 1}.
            </span>
            {renderQuestionContent()}
          </div>

          {currentQuestion.type === 'MCQ' ? (
            <RadioGroup 
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              className="space-y-4"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 glass-card rounded-lg p-4 transition-all hover:shadow">
                  <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                    <span className="font-medium mr-2">({option.id})</span>
                    {option.text ? (
                      option.text.includes('$') || option.text.includes('\\') ? 
                        <MathRenderer math={option.text} /> : 
                        option.text
                    ) : null}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Input 
              type="number" 
              value={answers[currentQuestion.id] || ''} 
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className="w-full p-3 rounded-lg border"
              placeholder="Enter your answer"
            />
          )}
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
              <Button variant="default" className="gap-2">
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