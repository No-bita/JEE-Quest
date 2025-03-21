import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, Brain } from 'lucide-react';
import { CORRECT_MARKS, INCORRECT_MARKS, UNATTEMPTED_MARKS, ResultsData, Question } from '@/utils/types';
import { toast } from '@/components/ui/use-toast';

const Results: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<ResultsData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [scoreData, setScoreData] = useState({
    totalScore: 0,
    maxPossibleScore: 0,
    scorePercentage: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    unattemptedQuestions: 0
  });
  const [pieData, setPieData] = useState([
    { name: 'Correct', value: 0, color: '#22c55e' },
    { name: 'Incorrect', value: 0, color: '#ef4444' },
    { name: 'Unattempted', value: 0, color: '#94a3b8' }
  ]);
  const [subjectChartData, setSubjectChartData] = useState<Array<{
    subject: string;
    correct: number;
    incorrect: number;
    score: number;
  }>>([]);
  
  // Load results and questions
  useEffect(() => {
    if (!paperId) {
      navigate('/papers');
      return;
    }
    
    const allResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    const paperResult = allResults.find((result: ResultsData) => result.paperId === paperId);
    
    console.log("Fetched results:", paperResult);
    
    if (!paperResult) {
      navigate('/practice/' + paperId);
      return;
    }
    
    setResults(paperResult);
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
    // Fetch questions from API
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/papers/${paperId}/questions`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        
        if (!data?.data || !Array.isArray(data.data)) {
          throw new Error('Invalid questions data received from API');
        }
        
        setQuestions(data.data);
        setIsLoading(false);
        
        // Save results to database only if we have valid questions
        if (data.data.length > 0) {
          saveResultsToDatabase(paperResult, data.data);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchQuestions();
  }, [paperId, navigate]);
  
  // Calculate scores whenever questions or results change
  useEffect(() => {
    if (!results || !questions.length || !results?.correctOptions) return;
    
    console.log("Calculating score with results:", results);
    console.log("Questions array:", questions);
    
    try {
      const correctOptions = results.correctOptions || {};
      
      // Calculate score metrics
      const correctAnswers = questions.filter(q => 
        q?.id && correctOptions[q.id] === q.correctOption
      ).length;
      
      const incorrectAnswers = questions.filter(q => 
        q?.id && correctOptions[q.id] && 
        correctOptions[q.id] !== q.correctOption
      ).length;
      
      const unattemptedQuestions = questions.length - correctAnswers - incorrectAnswers;
      
      const totalScore = calculateTotalScore(questions, correctOptions);
      const maxPossibleScore = questions.length * CORRECT_MARKS;
      const scorePercentage = maxPossibleScore > 0 
        ? Math.round((totalScore / maxPossibleScore) * 100) 
        : 0;
      
      // Update state with calculated values
      setScoreData({
        totalScore,
        maxPossibleScore,
        scorePercentage,
        correctAnswers,
        incorrectAnswers,
        unattemptedQuestions
      });
      
      // Update pie chart data
      setPieData([
        { name: 'Correct', value: correctAnswers, color: '#22c55e' },
        { name: 'Incorrect', value: incorrectAnswers, color: '#ef4444' },
        { name: 'Unattempted', value: unattemptedQuestions, color: '#94a3b8' }
      ]);
      
      // Calculate subject performance
      const subjectData = calculateSubjectPerformance(questions, correctOptions);
      setSubjectChartData(subjectData);
      
    } catch (error) {
      console.error('Error calculating scores:', error);
    }
  }, [questions, results]);
  
  // Helper function to calculate total score
  const calculateTotalScore = (questions: Question[], correctOptions: Record<string, string>) => {
    return questions.reduce((score, question) => {
      if (!question?.id) return score;
      
      const userAnswer = correctOptions[question.id];
      
      if (!userAnswer) {
        return score + UNATTEMPTED_MARKS;
      }
      
      return score + (userAnswer === question.correctOption ? CORRECT_MARKS : INCORRECT_MARKS);
    }, 0);
  };
  
  // Helper function to calculate subject performance
  const calculateSubjectPerformance = (questions: Question[], correctOptions: Record<string, string>) => {
    const subjectData = questions.reduce((acc: Record<string, {correct: number, total: number}>, q) => {
      if (!q?.subject || !q.id) return acc;
      
      if (!acc[q.subject]) {
        acc[q.subject] = { correct: 0, total: 0 };
      }
      
      acc[q.subject].total += 1;
      
      if (correctOptions[q.id] === q.correctOption) {
        acc[q.subject].correct += 1;
      }
      
      return acc;
    }, {});
    
    return Object.entries(subjectData).map(([subject, data]) => ({
      subject,
      correct: data.correct,
      incorrect: data.total - data.correct,
      score: Math.round((data.correct / data.total) * 100)
    }));
  };
  
  // Save results to database
  const saveResultsToDatabase = async (resultData: ResultsData, questionData: Question[]) => {
    if (!resultData || !questionData?.length) {
      console.error('Invalid data for saving to database');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const correctOptions = resultData.correctOptions || {};
      
      // Calculate metrics for API payload
      const correctAnswers = questionData.filter(q => 
        q?.id && correctOptions[q.id] === q.correctOption
      ).length;
      
      const incorrectAnswers = questionData.filter(q => 
        q?.id && correctOptions[q.id] && 
        correctOptions[q.id] !== q.correctOption
      ).length;
      
      const unattempted = questionData.length - correctAnswers - incorrectAnswers;
      
      const calculatedTotalScore = calculateTotalScore(questionData, correctOptions);
      console.log("Score Calculation:", calculateTotalScore(questions, results.correctOptions));
      const maxScore = questionData.length * CORRECT_MARKS;
      const scorePercentage = maxScore > 0 ? Math.round((calculatedTotalScore / maxScore) * 100) : 0;
      
      // Prepare data for API
      const resultPayload = {
        paperId: resultData.paperId,
        userId: localStorage.getItem('userId') || 'anonymous',
        date: resultData.date,
        timeSpent: resultData.timeSpent,
        answers: correctOptions,
        score: {
          total: calculatedTotalScore,
          maxPossible: maxScore,
          percentage: scorePercentage,
          correct: correctAnswers,
          incorrect: incorrectAnswers,
          unattempted
        }
      };
      
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(resultPayload)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save results');
      }
      
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: "Warning",
        description: "Your results were saved locally but could not be synced to the server.",
        variant: "default"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Helper function to format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${remainingSeconds}s`;
  };
  
  // Loading state
  if (isLoading || !results) {
    return (
      <>
        <NavBar />
        <div className="page-container pt-24 flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }
  
  const { 
    totalScore, 
    maxPossibleScore, 
    scorePercentage, 
    correctAnswers, 
    incorrectAnswers, 
    unattemptedQuestions 
  } = scoreData;
  
  const isPassed = scorePercentage >= 60;
  
  return (
    <>
      <NavBar />
      <div className="page-container pt-24 pb-16">
        {isSaving && (
          <div className="mb-4 p-2 bg-blue-50 text-blue-600 rounded flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            <span>Syncing your results to the server...</span>
          </div>
        )}
      
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="text-primary" />
            Test Results
          </h1>
          <Button variant="outline" size="sm" onClick={() => {
            localStorage.removeItem('testResults');
            navigate('/papers');
          }}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Papers
          </Button>
        </div>
        
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">JEE Mains {paperId?.replace('jee', '')}</h2>
              <p className="text-muted-foreground">
                Completed on {new Date(results.date || '').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-center mt-4 md:mt-0 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">{scorePercentage}%</div>
              <div className="text-2xl font-semibold mb-1">{totalScore}/{maxPossibleScore}</div>
              <div className={`text-lg font-medium ${isPassed ? 'text-green-600' : 'text-red-500'}`}>
                {isPassed ? 'Passed' : 'Needs Improvement'}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-600 rounded-full p-3">
                <CheckCircle size={24} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Correct</div>
                <div className="text-xl font-semibold">{correctAnswers} × +{CORRECT_MARKS}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-red-100 text-red-600 rounded-full p-3">
                <XCircle size={24} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
                <div className="text-xl font-semibold">{incorrectAnswers} × {INCORRECT_MARKS}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 text-gray-600 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="12" x2="12" y2="12"></line>
                </svg>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Unattempted</div>
                <div className="text-xl font-semibold">{unattemptedQuestions} × {UNATTEMPTED_MARKS}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-full p-3">
                <Clock size={24} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
                <div className="text-xl font-semibold">{formatTime(results.timeSpent || 0)}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Marking Scheme:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Correct answer: <span className="font-medium text-green-600">+{CORRECT_MARKS} marks</span></li>
              <li>Incorrect answer: <span className="font-medium text-red-600">{INCORRECT_MARKS} mark</span></li>
              <li>Unattempted Question: <span className="font-medium text-gray-600">{UNATTEMPTED_MARKS} marks</span></li>
            </ul>
          </div>
          
          <Link to={`/practice/${paperId}`}>
            <Button
            onClick={() => {
              localStorage.removeItem('testResults');
            }}>
              Practice Again
            </Button>
          </Link>
        </div>
        
        <div className="glass-card rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Brain className="text-primary" size={20} />
            Performance by Subject
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-72">
              {subjectChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={subjectChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                    <Legend />
                    <Bar dataKey="score" name="Score (%)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No subject data available
                </div>
              )}
            </div>
            
            <div className="h-72 flex items-center justify-center">
              {pieData.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Questions']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-muted-foreground">
                  No question data available
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Question Analysis</h2>
          
          {questions.length > 0 ? (
            <div className="space-y-6">
              {questions.map((question, index) => {
                if (!question?.id) return null;
                
                const correctOptions = results.correctOptions || {};
                const userAnswer = correctOptions[question.id] || '';
                const isCorrect = userAnswer === question.correctOption;
                const answerStatus = !userAnswer ? 'Not Attempted' : isCorrect ? 'Correct' : 'Incorrect';
                
                const questionMarks = !userAnswer ? 
                  UNATTEMPTED_MARKS : 
                  isCorrect ? 
                    CORRECT_MARKS : 
                    INCORRECT_MARKS;
                
                return (
                  <div key={question.id} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-medium flex items-center gap-2">
                        <span className="bg-primary/10 text-primary rounded px-2 py-0.5">{index + 1}</span>
                        {question.text}
                      </div>
                      <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded ${
                        !userAnswer 
                          ? 'bg-gray-50 text-gray-600' 
                          : isCorrect 
                          ? 'bg-green-50 text-green-600' 
                          : 'bg-red-50 text-red-600'
                      }`}>
                        <span>{answerStatus}</span>
                        <span className="font-bold">{questionMarks > 0 ? '+' : ''}{questionMarks}</span>
                      </div>
                    </div>
                    
                    {/* Render question image if available */}
                    {question.imageUrl && (
                      <div className="mb-3">
                        <img 
                          src={question.imageUrl} 
                          alt={`Question ${index + 1}`} 
                          className="w-full max-w-lg mx-auto rounded-lg shadow"
                        />
                      </div>
                    )}
                    
                    {question.options?.length ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                        {question.options.map(option => {
                          if (!option?.id) return null;
                          
                          return (
                            <div 
                              key={option.id} 
                              className={`p-2 rounded ${
                                option.id === question.correctOption 
                                  ? 'bg-green-50 border border-green-200' 
                                  : option.id === userAnswer && option.id !== question.correctOption 
                                  ? 'bg-red-50 border border-red-200' 
                                  : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <span className="font-medium mr-2">{option.id}.</span>
                              {option.text}
                              {option.id === question.correctOption && (
                                <span className="text-green-600 text-xs ml-2">
                                  (Correct answer)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground mb-3">Options not available</div>
                    )}
                    
                    <div className="text-sm text-muted-foreground flex gap-4">
                      <span>Subject: {question.subject}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No question data available
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Results;