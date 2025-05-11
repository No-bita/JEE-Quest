import React, { useState, useEffect, useCallback } from 'react';
import InstructionsModal from './InstructionsModal';
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
import Lottie from 'lottie-react';
import loadAnimationData from '../load.json';

const CORRECT_MARKS = 4;
const INCORRECT_MARKS = -1;
const UNATTEMPTED_MARKS = 0;

interface PracticeInterfaceProps {
  paperId: string;
}

interface ScoreReport {
  totalScore: number;
  maxPossibleScore: number;
  correctQuestions: number;
  incorrectQuestions: number;
  unattemptedQuestions: number;
}

const PracticeInterface: React.FC<PracticeInterfaceProps> = ({ paperId }) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0])); // Start with first question visited

  const [questionStatus, setQuestionStatus] = useState<Record<number, QuestionStatus>>({});
  const [timeLeft, setTimeLeft] = useState(10800);
  const [isActive, setIsActive] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  // Track per-question timing and answeredAt
  const [questionTimingMeta, setQuestionTimingMeta] = useState<{
    [questionId: number]: { timeSpent: number; answeredAt?: string }
  }>({});
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      } else if (Number(userAnswer) === Number(q.correctOption)) {
        report.totalScore += CORRECT_MARKS;
        report.correctQuestions++;
      } else {
        report.totalScore += INCORRECT_MARKS;
        report.incorrectQuestions++;
      }
    });

    return report;
  }, [questions, answers]);

  // Build questionTimings array for backend
  const buildQuestionTimings = () => {
    return questions.map(q => {
      const meta = questionTimingMeta[q.id] || { timeSpent: 0 };
      return {
        questionId: q.id,
        timeSpent: meta.timeSpent,
        answeredAt: meta.answeredAt || null
      };
    });
  };

  const handleSubmit = useCallback(() => {
    setIsActive(false);
    const scoreReport = calculateScore();
    
    const results = {
      ...scoreReport,
      paperId,
      answers,
      questionStatus,
      questionTimes,
      timeSpent: 10800 - timeLeft,
      date: new Date().toISOString(),
      questionTimings: buildQuestionTimings(),
    };
    
    localStorage.setItem('testResults', JSON.stringify(results));
    toast.success("Your responses have been submitted successfully!");
    
    setTimeout(() => navigate(`/results/${paperId}`), 1000);
  }, [paperId, answers, questionStatus, timeLeft, questions, navigate, calculateScore, questionTimes]);

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {        
        const token = localStorage.getItem('authToken');
const response = await fetch(`${API_BASE_URL}/papers/${paperId}/questions`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
        if (!response.ok) throw new Error(`Failed to fetch questions: ${response.status}`);
        
        const result = await response.json();
        if (!result.success || !result.data) throw new Error('Invalid response format');
        
        const paperQuestions = result.data.questions.map(q => ({
          id: q.id,
          text: q.text || '',
          imageUrl: q.imageUrl,
          options: q.type.toUpperCase() === 'MCQ' ? q.options.map(opt => ({
            id: Number(opt.id),
            text: opt.text || '',
          })) : [],
          correctOption: Number(q.correctOption), 
          subject: q.subject || 'Unknown',
          type: q.type.toUpperCase() || 'MCQ',
        }));

        setQuestions(paperQuestions);
        
        const initialStatus: Record<number, QuestionStatus> = {};
        paperQuestions.forEach(q => initialStatus[q.id] = 'unattempted');
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

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setQuestionTimes(prev => {
          const qid = questions[currentQuestionIndex]?.id;
          return qid ? { ...prev, [qid]: (prev[qid] || 0) + 1 } : prev;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      toast.warning("Time's up! Your answers will be submitted automatically.");
      handleSubmit();
    }
    
    return () => interval && clearInterval(interval);
  }, [isActive, timeLeft, handleSubmit, currentQuestionIndex, questions]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handles both MCQ (string) and Numeric (number) answers robustly
  const handleAnswerChange = (questionId: number, answer: string) => {
    // Record answeredAt and add to timing meta
    setQuestionTimingMeta(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || { timeSpent: 0 }),
        answeredAt: new Date().toISOString(),
      }
    }));
    // For MCQ, answer is option.id as string; for Numeric, it's the input value
    const isNumeric = currentQuestion?.type === 'NUMERIC';
    const value = isNumeric ? Number(answer) : Number(answer); // Always store as number
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setQuestionStatus(prev => {
      const currentStatus = prev[questionId];
      if (currentStatus === 'unattempted') return { ...prev, [questionId]: 'attempted' };
      if (currentStatus === 'marked-unattempted') return { ...prev, [questionId]: 'marked-attempted' };
      return prev;
    });
  };


  const handleMarkForReview = (questionId: number) => {
    setQuestionStatus(prev => {
      const currentStatus = prev[questionId];
      const statusMap: Record<string, QuestionStatus> = {
        'marked-unattempted': 'unattempted',
        'marked-attempted': 'attempted',
        'attempted': 'marked-attempted',
        'unattempted': 'marked-unattempted'
      };
      const newStatus = statusMap[currentStatus] || 'unattempted';
      toast.info(
        newStatus.includes('marked') ? 'Question marked for review' : 'Question unmarked from review'
      );
      return { ...prev, [questionId]: newStatus };
    });
  };

  // Defensive: handle out-of-bounds index
  const currentQuestion = questions[currentQuestionIndex] || null;

  // Track time spent on each question when navigating
  useEffect(() => {
    if (!questions.length) return;
    const prevQuestionId = questions[currentQuestionIndex]?.id;
    const prevStart = questionStartTime;
    return () => {
      if (prevQuestionId != null) {
        const now = Date.now();
        const delta = Math.floor((now - prevStart) / 1000);
        setQuestionTimingMeta(prev => ({
          ...prev,
          [prevQuestionId]: {
            ...(prev[prevQuestionId] || { timeSpent: 0 }),
            timeSpent: (prev[prevQuestionId]?.timeSpent || 0) + delta,
          }
        }));
      }
    };
    // eslint-disable-next-line
  }, [currentQuestionIndex]);

  // Update questionStartTime whenever currentQuestionIndex changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  // Mark question as visited on index change
  React.useEffect(() => {
    setVisitedQuestions(prev => {
      if (questions[currentQuestionIndex]) {
        const newSet = new Set(prev);
        newSet.add(currentQuestionIndex);
        return newSet;
      }
      return prev;
    });
  }, [currentQuestionIndex, questions]);

  // Pass index and visited info for navigation
  const navigatorQuestions = questions.map((q, idx) => ({
    id: q.id,
    status: questionStatus[q.id] || 'unattempted',
    idx,
    visited: visitedQuestions.has(idx)
  }));
  const attemptedCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (attemptedCount / questions.length) * 100 : 0;

  const renderQuestionContent = () => {
    if (!currentQuestion) return null;
    if (currentQuestion.imageUrl) {
      return (
        <img 
          src={currentQuestion.imageUrl} 
          alt={`Question ${currentQuestionIndex + 1}`} 
          className="mt-4 w-full max-w-4xl h-auto object-contain mx-auto rounded-lg shadow"
        />
      );
    }
    if (currentQuestion.text && (currentQuestion.text.includes('$') || currentQuestion.text.includes('\\'))) {
      return <MathRenderer math={currentQuestion.text} />;
    }
    return currentQuestion.text;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-32 h-32">
          <Lottie animationData={loadAnimationData} loop={true} />
        </div>
        <span className="mt-4 text-[#1D9A6C] font-medium">Loading questions…</span>
      </div>
    );
  }

  if (!questions.length || !currentQuestion) {
    return (
      <div className="page-container pt-24 flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No Questions Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Unable to load questions for this paper.</p>
          <Button onClick={() => navigate('/papers')}>Back to Papers</Button>
        </div>
      </div>
    );
  }

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
          </div>
          
          <div className="text-lg font-medium mb-6">
            <span className="mr-2 inline-block bg-primary/10 text-primary rounded px-2 py-0.5">
              {currentQuestionIndex + 1}.
            </span>
            {renderQuestionContent()}
          </div>

          {currentQuestion.type === 'MCQ' ? (
            <RadioGroup
              value={answers[currentQuestion.id]?.toString() ?? ''}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              className="space-y-4"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 glass-card rounded-lg p-4 transition-all hover:shadow">
                  <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                    <span className="font-medium mr-2">({option.id})</span>
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Input
              type="number"
              value={answers[currentQuestion.id]?.toString() ?? ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className="w-full p-3 rounded-lg border"
              placeholder="Enter your answer"
              min={0}
            />
          )}
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col gap-6 mt-6">
          {/* Top row: Action buttons */}
          <div className="flex flex-wrap justify-center gap-4 w-full">
            <Button
              variant="default"
              className="font-bold min-w-[140px] h-12 bg-green-500 hover:bg-green-600 text-white border-green-600"
              onClick={() => {
                // Save answer (if any) and go to next
                if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
              }}
            >
              SAVE & NEXT
            </Button>
            <Button
              variant="outline"
              className="font-bold min-w-[110px] h-12 border-gray-400 text-black"
              onClick={() => {
                // Clear answer for this question
                setAnswers(prev => {
                  const newAnswers = { ...prev };
                  delete newAnswers[currentQuestion.id];
                  return newAnswers;
                });
                setQuestionStatus(prev => ({ ...prev, [currentQuestion.id]: 'unattempted' }));
              }}
            >
              CLEAR
            </Button>
            <Button
              className="font-bold min-w-[220px] h-12 bg-orange-400 hover:bg-orange-500 text-white border-orange-600"
              onClick={() => {
                // Save answer (if any), mark for review, stay on current
                setQuestionStatus(prev => {
                  const currentStatus = prev[currentQuestion.id];
                  return {
                    ...prev,
                    [currentQuestion.id]: currentStatus === 'attempted' ? 'marked-attempted' : 'marked-unattempted',
                  };
                });
              }}
            >
              SAVE & MARK FOR REVIEW
            </Button>
            <Button
              className="font-bold min-w-[260px] h-12 bg-blue-600 hover:bg-blue-700 text-white border-blue-800"
              onClick={() => {
                // Mark for review: set to marked-attempted if answered, else marked-unattempted
                setQuestionStatus(prev => {
                  const isAnswered = answers.hasOwnProperty(currentQuestion.id) && answers[currentQuestion.id] != null;
                  return {
                    ...prev,
                    [currentQuestion.id]: isAnswered ? 'marked-attempted' : 'marked-unattempted',
                  };
                });
                if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
              }}
            >
              MARK FOR REVIEW & NEXT
            </Button>
          </div>
          {/* Bottom row: Navigation and Submit */}
          <div className="flex flex-row w-full justify-between items-center gap-4">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="font-bold min-w-[120px] h-12"
              >
                {'<< BACK'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="font-bold min-w-[120px] h-12"
              >
                {'NEXT >>'}
              </Button>
            </div>
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
              <AlertDialogTrigger asChild>
                <Button className="font-bold min-w-[140px] h-12 bg-green-500 hover:bg-green-600 text-white border-green-600" aria-label="Submit Test">
                  SUBMIT
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
                        <div className="text-sm mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <p className="font-medium mb-1">Marking Scheme:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Correct Answer: <span className="font-medium text-green-600">+{CORRECT_MARKS} marks</span></li>
                            <li>Incorrect Answer: <span className="font-medium text-red-600">{INCORRECT_MARKS} mark</span></li>
                            <li>Unattempted Answer: <span className="font-medium text-gray-600">{UNATTEMPTED_MARKS} marks</span></li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <span>You've answered all questions. Your test will be submitted and you'll see your results.</span>
                        <div className="text-sm mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <p className="font-medium mb-1">Marking Scheme:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Correct Answer: <span className="font-medium text-green-600">+{CORRECT_MARKS} marks</span></li>
                            <li>Incorrect Answer: <span className="font-medium text-red-600">{INCORRECT_MARKS} mark</span></li>
                            <li>Unattempted Answer: <span className="font-medium text-gray-600">{UNATTEMPTED_MARKS} marks</span></li>
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
          </div>
        </div>
      </div>
      
      <div className="col-span-1">
        <QuestionNavigation
          questions={navigatorQuestions}
          currentQuestionIndex={currentQuestionIndex}
          onSelectQuestion={(idx: number) => setCurrentQuestionIndex(Math.max(0, Math.min(questions.length - 1, idx)))}        />
      </div>
    </div>
  );
};

export default PracticeInterface;
