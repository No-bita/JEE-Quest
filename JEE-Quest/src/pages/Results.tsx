import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend 
} from 'recharts';
import CountUp from 'react-countup';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { CORRECT_MARKS, INCORRECT_MARKS, UNATTEMPTED_MARKS, ResultsData, Question } from '@/utils/types';
import { toast } from '@/components/ui/use-toast';
import Confetti from 'react-confetti';
import { Clock as ClockIcon } from 'lucide-react';
import Lottie from 'lottie-react';
import loadAnimationData from '../load.json';

const Results: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<ResultsData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [paperNote, setPaperNote] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [scoreData, setScoreData] = useState<{
    totalScore: number;
    maxPossibleScore: number;
    correctQuestions: number;
    incorrectQuestions: number;
    unattemptedQuestions: number;
  } | null>(null);
  const [pieData, setPieData] = useState([
    { name: 'Correct', value: 0, color: '#22c55e' },
    { name: 'Incorrect', value: 0, color: '#ef4444' },
    { name: 'Unattempted', value: 0, color: '#94a3b8' }
  ]);
  const [subjectChartData, setSubjectChartData] = useState<Array<{
    subject: string;
    correct: number;
    incorrect: number;
    unattempted: number;
    total: number;
  }>>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Helper: Format seconds as mm:ss
  const formatTimeMMSS = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // Helper function to format time as h m s
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${remainingSeconds}s`;
  };

  // Load results and questions
  useEffect(() => {
    if (!paperId) {
      navigate('/papers');
      return;
    }
    // BYPASS: Allow open access for specific practice papers
    if (paperId === 'jee2020-2' || paperId === 'jee2020-1') {
      // Do not check login or restrict access
      // (rest of the logic continues as normal)
    } else {
      // If you have login/access checks elsewhere, keep them here
      // e.g., check if user is logged in, else navigate('/signin')
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        navigate('/signin');
        return;
      }
    }

    const testResult = JSON.parse(localStorage.getItem('testResults') || 'null');
    if (!testResult) {
      console.error('No test result found in local storage.');
      navigate('/practice/' + paperId);
      return;
    }
    setResults(testResult);

    const fetchPaperData = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const token = localStorage.getItem('authToken');
const response = await fetch(`${API_BASE_URL}/papers/${paperId}/questions`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        if (!data?.data) throw new Error('Invalid questions data received from API');
        let questionsArr: Question[] = [];
        let note: string | null = null;
        if (Array.isArray(data.data)) {
  questionsArr = data.data;
  note = data.note || null;
} else {
  questionsArr = data.data.questions || [];
  note = data.data.note || null;
}
        setQuestions(questionsArr);
        setPaperNote(note);

        setScoreData({
          totalScore: testResult.totalScore || 0,
          maxPossibleScore: testResult.maxPossibleScore || (questionsArr.length * CORRECT_MARKS),
          correctQuestions: testResult.correctQuestions || 0,
          incorrectQuestions: testResult.incorrectQuestions || 0,
          unattemptedQuestions: testResult.unattemptedQuestions || 0
        });

        setPieData([
          { name: 'Correct', value: testResult.correctQuestions || 0, color: '#22c55e' },
          { name: 'Incorrect', value: testResult.incorrectQuestions || 0, color: '#ef4444' },
          { name: 'Unattempted', value: testResult.unattemptedQuestions || 0, color: '#94a3b8' }
        ]);

        if (questionsArr.length > 0) {
          const subjectPerformance = calculateSubjectPerformance(questionsArr, testResult.answers || {});
          setSubjectChartData(subjectPerformance);
          // Do not save results for open practice papers
          if (paperId !== 'jee2020-2' && paperId !== 'jee2020-1') {
            saveResultsToDatabase(testResult, questionsArr);
          }
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaperData();
  }, [paperId, navigate]);

  useEffect(() => {
    if (scoreData?.totalScore > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [scoreData?.totalScore]);

  // Helper: Subject performance
  const calculateSubjectPerformance = (questions: Question[], answers: Record<number, number>) => {
    if (!questions || !answers) return [];
    const subjectData = questions.reduce((acc: Record<string, {correct: number; incorrect: number; unattempted: number}>, q) => {
      if (!q || !q.subject || !q.id) return acc;
      const subjectKey = q.subject.trim();
      if (!acc[subjectKey]) acc[subjectKey] = { correct: 0, incorrect: 0, unattempted: 0 };
      const userAnswer = answers[q.id];
      if (!userAnswer) acc[subjectKey].unattempted += 1;
      else if (userAnswer === q.correctOption) acc[subjectKey].correct += 1;
      else acc[subjectKey].incorrect += 1;
      return acc;
    }, {});
    return Object.entries(subjectData).map(([subject, data]) => ({
      subject,
      correct: data.correct,
      incorrect: data.incorrect,
      unattempted: data.unattempted,
      total: data.correct + data.incorrect + data.unattempted
    })).filter(item => item.total > 0);
  };

  // Save results to database
  const saveResultsToDatabase = async (resultData: ResultsData, questionData: Question[]) => {
    if (resultData.paperId === 'jee2020-2' || resultData.paperId === 'jee2020-1') return;
    if (!resultData || !questionData?.length) {
      console.error('Invalid data for saving to database');
      return;
    }
    setIsSaving(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const resultPayload = {
        paperId: resultData.paperId,
        userId: localStorage.getItem('userId') || 'anonymous',
        date: resultData.date,
        timeSpent: resultData.timeSpent,
        answers: resultData.answers,
        score: resultData.totalScore,
        maxPossibleScore: resultData.maxPossibleScore
      };
      const response = await fetch(`${API_BASE_URL}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(resultPayload)
      });
      if (!response.ok) throw new Error('Failed to save results');
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(searchValue, 10);
    if (!isNaN(num) && questionRefs.current[num]) {
      questionRefs.current[num]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlighted(num);
      setTimeout(() => setHighlighted(null), 1500);
    }
  };

  if (isLoading || !scoreData) {
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: '#FAFBF6' }}>
        <Sidebar />
        <div className="flex-1 flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-32 h-32">
              <Lottie animationData={loadAnimationData} loop={true} />
            </div>
            <span className="mt-4 text-[#1D9A6C] font-medium">Loading your results…</span>
          </div>
        </div>
      </div>
    );
  }

  const { 
    totalScore, 
    maxPossibleScore, 
    correctQuestions, 
    incorrectQuestions, 
    unattemptedQuestions 
  } = scoreData;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#FAFBF6' }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <Sidebar />
      <div className="flex-1 page-container pt-24 max-w-5xl mx-auto px-2 md:px-6">
        {/* Score Highlight */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white shadow-lg rounded-2xl px-8 py-6 mb-2">
            <div className="text-4xl font-extrabold text-primary">
              <CountUp end={totalScore} duration={3} />/{maxPossibleScore}
            </div>
            <div className="text-base text-muted-foreground text-center">Your Score</div>
          </div>
        </div>
        {/* Stat Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="flex flex-col items-center rounded-xl shadow p-4" style={{ backgroundColor: '#D6CCFF' }}>
            <CheckCircle size={28} className="mb-2" color="#7C3AED" />
            <div className="text-sm text-gray-700">Correct</div>
            <div className="text-2xl font-bold text-black">{correctQuestions}</div>
          </div>
          <div className="flex flex-col items-center rounded-xl shadow p-4" style={{ backgroundColor: '#FFCFC7' }}>
            <XCircle size={28} className="mb-2" color="#FF6B6B" />
            <div className="text-sm text-gray-700">Incorrect</div>
            <div className="text-2xl font-bold text-black">{incorrectQuestions}</div>
          </div>
          <div className="flex flex-col items-center rounded-xl shadow p-4" style={{ backgroundColor: '#FFE3AC' }}>
            <svg className="mb-2" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFB300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="12" x2="12" y2="12"></line></svg>
            <div className="text-sm text-gray-700">Unattempted</div>
            <div className="text-2xl font-bold text-black">{unattemptedQuestions}</div>
          </div>
          <div className="flex flex-col items-center rounded-xl shadow p-4" style={{ backgroundColor: '#B6F7B0' }}>
            <Clock size={28} className="mb-2" color="#22C55E" />
            <div className="text-sm text-gray-700">Time Taken</div>
            <div className="text-2xl font-bold text-black">{formatTime(results?.timeSpent || 0)}</div>
          </div>
        </div>
        {/* Move the note here, keep original UI */}
        {paperNote && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-300 text-blue-900 text-center text-base font-medium">
            <span className="font-semibold">Note:</span> {paperNote}
          </div>
        )}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="w-full bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow mb-4 md:mb-0 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/3 w-full">
              <h3 className="font-semibold mb-2">Marking Scheme:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Correct Answer: <span className="font-medium text-green-600">+{CORRECT_MARKS} marks</span></li>
                <li>Incorrect Answer: <span className="font-medium text-red-600">{INCORRECT_MARKS} mark</span></li>
                <li>Unattempted Answer: <span className="font-medium text-gray-600">{UNATTEMPTED_MARKS} marks</span></li>
              </ul>
            </div>
            <div className="md:w-2/3 w-full h-72 flex items-center justify-center">
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
        <Link to={`/papers`}>
          <Button
            onClick={() => {
              localStorage.removeItem('testResults');
            }}>
            Practice Again
          </Button>
        </Link>
        <div className="glass-card rounded-xl p-6 mt-8 mb-6">
          <h3 className="text-lg font-semibold mb-4">Subject-wise Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectChartData.map((subject) => (
              <div key={subject.subject} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg w-full">
                <h4 className="font-medium mb-2">{subject.subject}</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>Correct: <span className="font-semibold text-green-600">{subject.correct}</span></div>
                  <div>Incorrect: <span className="font-semibold text-red-600">{subject.incorrect}</span></div>
                  <div>Unattempted: <span className="font-semibold text-gray-500">{subject.unattempted}</span></div>
                  <div>Subject Score: 
                    <span className="font-semibold">
                      {subject.correct * CORRECT_MARKS + subject.incorrect * INCORRECT_MARKS + subject.unattempted * UNATTEMPTED_MARKS}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold mb-0">Question Analysis</h2>
            <form onSubmit={handleSearch} className="flex gap-2 items-center mb-0">
              <input
                type="number"
                min={1}
                max={questions.length}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Jump to question..."
                className="border rounded px-3 py-2 w-40 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Go</button>
            </form>
          </div>
          {questions.length > 0 ? (
            <div className="space-y-6">
              {questions.map((question, index) => {
                if (!question?.id) return null;
                const answers = results?.answers || {};
                const userAnswer = Number(answers[question.id]);
                const isCorrect = Number(userAnswer) === Number(question.correctOption);
                const answerStatus = !userAnswer ? 'Not Attempted' : isCorrect ? 'Correct' : 'Incorrect';
                const questionMarks = !userAnswer ? 
                  UNATTEMPTED_MARKS : 
                  isCorrect ? 
                    CORRECT_MARKS : 
                    INCORRECT_MARKS;
                return (
                  <div
                    key={question.id}
                    ref={el => (questionRefs.current[index + 1] = el)}
                    className={`p-4 rounded-lg border transition-shadow duration-300 ${highlighted === index + 1 ? 'ring-2 ring-primary shadow-lg' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-medium flex items-center gap-2">
                        <span className="bg-primary/10 text-primary rounded px-2 py-0.5">{index + 1}</span>
                        <span className="ml-2 flex items-center">
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full flex items-center text-xs font-mono">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {userAnswer ? (results?.questionTimes?.[question.id] ? formatTimeMMSS(results.questionTimes[question.id]) : '0:00') : '0:00'}
                          </span>
                        </span>
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
                                Number(option.id) === Number(question.correctOption) 
                                  ? 'bg-green-50 border border-green-200' 
                                  : Number(option.id) === Number(userAnswer) && Number(option.id) !== Number(question.correctOption) 
                                  ? 'bg-red-50 border border-red-200'
                                  : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <span className="font-medium mr-2">{option.id}.</span>
                              {/* Show (Your answer) if this is the user's incorrect answer */}
                              {Number(option.id) === Number(userAnswer) && Number(option.id) !== Number(question.correctOption) && (
                                <span className="text-xs text-red-600 ml-2">(Your answer)</span>
                              )}
                              {option.text}
                              {Number(option.id) === Number(question.correctOption) && (
                                <span className="text-green-600 text-xs ml-2">
                                  (Correct answer)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground mb-3 flex flex-col gap-2">
                        {/* Integer type answer display */}
                        {userAnswer ? (
                          <span className={`font-medium ${Number(userAnswer) === Number(question.correctOption) ? 'text-green-600' : 'text-red-600'}`}>
                            Your answer: {userAnswer}
                          </span>
                        ) : (
                          <span className="font-medium text-gray-500">Not attempted</span>
                        )}
                        <span className="font-medium text-green-600">Correct answer: {question.correctOption}</span>
                      </div>
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
    </div>
  );
}

export default Results;
