import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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

interface ResultsData {
  paperId: string;
  answers: Record<number, string>;
  questionStatus: Record<number, string>;
  timeSpent: number;
  date: string;
}

interface Question {
  id: number;
  text: string;
  options: Array<{id: string, text: string}>;
  correctOption: string;
  subject: string;
  topic: string;
}

// Scoring algorithm constants
const CORRECT_MARKS = 4;
const INCORRECT_MARKS = -1;
const UNATTEMPTED_MARKS = 0;

const Results: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<ResultsData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState(0);
  
  useEffect(() => {
    if (!paperId) {
      navigate('/papers');
      return;
    }
    
    // Load test results for this paper
    const allResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    const paperResult = allResults.find((result: ResultsData) => result.paperId === paperId);
    
    if (!paperResult) {
      navigate('/practice/' + paperId);
      return;
    }
    
    setResults(paperResult);
    
    // Load questions for this paper (this would normally be an API call)
    // For now, we'll simulate with our mock data
    const loadQuestions = () => {
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
      
      // Simulate a different set of questions for different papers
      const paperId2DigitYear = parseInt(paperId.split('-')[0].slice(-2));
      const questionCount = 5 + (paperId2DigitYear % 3); // 5-7 questions based on year
      
      // Use our existing mock questions, but vary them slightly based on paperId
      const paperQuestions = mockQuestions.slice(0, questionCount).map(q => ({
        ...q,
        id: q.id + (paperId2DigitYear * 10), // Make IDs unique per paper
        text: q.text + (paperId.includes('shift-2') ? ' (Shift 2 variant)' : '')
      }));
      
      setQuestions(paperQuestions);
      setIsLoading(false);
    };
    
    loadQuestions();
  }, [paperId, navigate]);
  
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
  
  // Calculate results
  const totalQuestions = questions.length;
  const attemptedQuestions = Object.keys(results.answers).length;
  
  // Calculate correct answers
  const correctAnswers = questions.filter(q => 
    results.answers[q.id] === q.correctOption
  ).length;
  
  // Calculate incorrect answers (attempted but wrong)
  const incorrectAnswers = questions.filter(q => 
    results?.answers[q.id] && results?.answers[q.id] !== q.correctOption
  ).length;
  
  // Calculate unattempted questions
  const unattemptedQuestions = questions.length - correctAnswers - incorrectAnswers;
  
  // Calculate score percentage based on actual score vs max possible score
  const scorePercentage = maxPossibleScore > 0 
    ? Math.round((totalScore / maxPossibleScore) * 100) 
    : 0;
  
  // Format time spent
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${remainingSeconds}s`;
  };
  
  // Group questions by subject for statistics
  const subjectData = questions.reduce((acc: Record<string, {correct: number, total: number}>, q) => {
    if (!acc[q.subject]) {
      acc[q.subject] = { correct: 0, total: 0 };
    }
    
    acc[q.subject].total += 1;
    
    if (results.answers[q.id] === q.correctOption) {
      acc[q.subject].correct += 1;
    }
    
    return acc;
  }, {});
  
  // Prepare chart data
  const subjectChartData = Object.entries(subjectData).map(([subject, data]) => ({
    subject,
    correct: data.correct,
    incorrect: data.total - data.correct,
    score: Math.round((data.correct / data.total) * 100)
  }));
  
  // Calculate total score based on marking scheme
  const calculatedTotalScore = questions.reduce((score, question) => {
    const userAnswer = results.answers[question.id];
    
    // If question was not attempted
    if (!userAnswer) {
      return score + UNATTEMPTED_MARKS;
    }
    
    // If answer is correct
    if (userAnswer === question.correctOption) {
      return score + CORRECT_MARKS;
    }
    
    // If answer is incorrect
    return score + INCORRECT_MARKS;
  }, 0);
  
  setTotalScore(calculatedTotalScore);
  
  // Calculate maximum possible score (if all answers were correct)
  setMaxPossibleScore(questions.length * CORRECT_MARKS);
  
  // Determine pass status (60% of max possible score)
  const isPassed = scorePercentage >= 60;
  
  return (
    <>
      <NavBar />
      <div className="page-container pt-24 pb-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="text-primary" />
            Test Results
          </h1>
          <Button variant="outline" size="sm" onClick={() => navigate('/papers')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Papers
          </Button>
        </div>
        
        {/* Result summary */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">JEE Mains {paperId?.replace('jee', '')}</h2>
              <p className="text-muted-foreground">
                Completed on {new Date(results?.date || '').toLocaleDateString('en-US', {
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
                <div className="text-xl font-semibold">{formatTime(results?.timeSpent || 0)}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Marking Scheme:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Correct Answer: <span className="font-medium text-green-600">+{CORRECT_MARKS} marks</span></li>
              <li>Incorrect Answer: <span className="font-medium text-red-600">{INCORRECT_MARKS} mark</span></li>
              <li>Unattempted Question: <span className="font-medium text-gray-600">{UNATTEMPTED_MARKS} marks</span></li>
            </ul>
          </div>
          
          <Link to={`/practice/${paperId}`}>
            <Button>
              Practice Again
            </Button>
          </Link>
        </div>
        
        {/* Performance by Subject */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Brain className="text-primary" size={20} />
            Performance by Subject
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="h-72">
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
            </div>
            
            {/* Pie Chart */}
            <div className="h-72 flex items-center justify-center">
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
            </div>
          </div>
        </div>
        
        {/* Detailed Question Analysis */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Question Analysis</h2>
          
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = results?.answers[question.id] || '';
              const isCorrect = userAnswer === question.correctOption;
              const answerStatus = !userAnswer ? 'Not Attempted' : isCorrect ? 'Correct' : 'Incorrect';
              
              // Calculate marks for this question
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                    {question.options.map(option => (
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
                            (Correct Answer)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-sm text-muted-foreground flex gap-4">
                    <span>Subject: {question.subject}</span>
                    <span>Topic: {question.topic}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Results;
