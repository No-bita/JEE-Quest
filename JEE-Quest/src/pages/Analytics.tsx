import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Trophy, BarChart2, Clock, Target, TrendingUp, Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import NavBar from '@/components/NavBar';
import { resultsApi, papersApi } from '@/utils/api';

import { ResultsData, Question } from '@/utils/types';

interface ScoreEntry {
  paperId: string;
  date: string;
  totalScore: number;
  maxPossibleScore: number;
}

interface AnalyticsResult extends ResultsData {
  questions: Question[];
}

const Analytics: React.FC = () => {
  const [analyticsResults, setAnalyticsResults] = useState<AnalyticsResult[]>([]);
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      // Show mock data for demo on landing page (detailed)
      const mockQuestions = [
        { id: 1, text: 'Physics Q1', options: [{id:1,text:'A'},{id:2,text:'B'}], correctOption: 1, subject: 'Physics', type: 'MCQ' },
        { id: 2, text: 'Physics Q2', options: [{id:1,text:'A'},{id:2,text:'B'}], correctOption: 2, subject: 'Physics', type: 'MCQ' },
        { id: 3, text: 'Chemistry Q1', options: [{id:1,text:'A'},{id:2,text:'B'}], correctOption: 1, subject: 'Chemistry', type: 'MCQ' },
        { id: 4, text: 'Math Q1', options: [{id:1,text:'A'},{id:2,text:'B'}], correctOption: 2, subject: 'Math', type: 'MCQ' },
        { id: 5, text: 'Math Q2', options: [{id:1,text:'A'},{id:2,text:'B'}], correctOption: 1, subject: 'Math', type: 'MCQ' },
        { id: 6, text: 'Chemistry Q2', options: [{id:1,text:'A'},{id:2,text:'B'}], correctOption: 2, subject: 'Chemistry', type: 'MCQ' },
      ];
      const mockAnalyticsResults: AnalyticsResult[] = [
        {
          paperId: 'JEE2024-01',
          date: '2025-01-10',
          timeSpent: 3600,
          answers: { '1': '1', '2': '2', '3': '1', '4': '2', '5': '2', '6': '1' },
          questionStatus: { '1': 'Answered', '2': 'Answered', '3': 'Answered', '4': 'Answered', '5': 'Marked for Review', '6': 'Not Answered' },
          correctOptions: { '1': 1, '2': 2, '3': 1, '4': 2, '5': 1, '6': 2 },
          totalScore: 220,
          maxPossibleScore: 300,
          questionTimes: { '1': 60, '2': 90, '3': 70, '4': 100, '5': 80, '6': 50 },
          questions: mockQuestions,
        },
        {
          paperId: 'JEE2024-02',
          date: '2025-01-17',
          timeSpent: 3700,
          answers: { '1': '2', '2': '2', '3': '1', '4': '1', '5': '1', '6': '2' },
          questionStatus: { '1': 'Answered', '2': 'Answered', '3': 'Answered', '4': 'Answered', '5': 'Not Visited', '6': 'Answered' },
          correctOptions: { '1': 1, '2': 2, '3': 1, '4': 2, '5': 1, '6': 2 },
          totalScore: 235,
          maxPossibleScore: 300,
          questionTimes: { '1': 65, '2': 85, '3': 60, '4': 120, '5': 0, '6': 70 },
          questions: mockQuestions,
        },
        {
          paperId: 'JEE2024-03',
          date: '2025-01-24',
          timeSpent: 3550,
          answers: { '1': '1', '2': '1', '3': '2', '4': '2', '5': '1', '6': '2' },
          questionStatus: { '1': 'Answered', '2': 'Answered', '3': 'Answered', '4': 'Answered', '5': 'Answered', '6': 'Answered' },
          correctOptions: { '1': 1, '2': 2, '3': 1, '4': 2, '5': 1, '6': 2 },
          totalScore: 250,
          maxPossibleScore: 300,
          questionTimes: { '1': 70, '2': 80, '3': 75, '4': 95, '5': 85, '6': 60 },
          questions: mockQuestions,
        },
      ];
      setAnalyticsResults(mockAnalyticsResults);
      setScoreHistory(mockAnalyticsResults.map(r => ({
        paperId: r.paperId,
        date: r.date,
        totalScore: r.totalScore || 0,
        maxPossibleScore: r.maxPossibleScore || 0,
      })));
      setLoading(false);
      setError(null);
    } else {
      // Fetch analytics results and questions for each paper
      const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);
        const response = await resultsApi.getResultsAnalytics();
        if (response.success && Array.isArray(response.data)) {
          // response.data is an array of ResultsData
          const results: ResultsData[] = response.data;
          // For each result, fetch its questions
          const analyticsResults: AnalyticsResult[] = [];
          for (const result of results) {
            const qRes = await papersApi.getPaperQuestions?.(result.paperId) || { success: false };
            if (qRes.success && Array.isArray(qRes.data)) {
              analyticsResults.push({ ...result, questions: qRes.data });
            } else {
              analyticsResults.push({ ...result, questions: [] });
            }
          }
          setAnalyticsResults(analyticsResults);
          setScoreHistory(results.map(r => ({
            paperId: r.paperId,
            date: r.date,
            totalScore: r.totalScore || 0,
            maxPossibleScore: r.maxPossibleScore || 0,
          })));
        } else {
          setError(response.error || 'Failed to fetch analytics');
        }
        setLoading(false);
      };
      fetchAnalytics();
    }
  }, []);

  // Calculate analytics
  const totalPapers = analyticsResults.length;
  const avgScore = totalPapers > 0 ? (analyticsResults.reduce((acc, r) => acc + (r.totalScore || 0), 0) / totalPapers).toFixed(2) : '0';

  // --- Advanced Analytics Calculations ---
  // 1. Best/Worst Attempt
  const bestAttempt = analyticsResults.reduce((best, curr) => (!best || (curr.totalScore || 0) > (best.totalScore || 0)) ? curr : best, null as AnalyticsResult | null);
  const worstAttempt = analyticsResults.reduce((worst, curr) => (!worst || (curr.totalScore || 0) < (worst.totalScore || 0)) ? curr : worst, null as AnalyticsResult | null);

  // 2. Score Consistency (Standard Deviation)
  const scoreArr = analyticsResults.map(r => r.totalScore || 0);
  const scoreMean = scoreArr.length ? scoreArr.reduce((a, b) => a + b, 0) / scoreArr.length : 0;
  const scoreStd = scoreArr.length ? Math.sqrt(scoreArr.reduce((acc, score) => acc + Math.pow(score - scoreMean, 2), 0) / scoreArr.length).toFixed(2) : '0';

  // 3. Subject-wise Score Progression
  const subjectProgression: Record<string, { name: string; score: number; idx: number }[]> = {};
  analyticsResults.forEach((result, idx) => {
    const subjScores: Record<string, number> = {};
    (result.questions || []).forEach(q => {
      const qid = q.id;
      const subject = q.subject || 'Unknown';
      if (!subjScores[subject]) subjScores[subject] = 0;
      if (result.answers && String(qid) in result.answers && result.correctOptions && String(qid) in result.correctOptions) {
        if (result.answers[String(qid)] == String(result.correctOptions[String(qid)])) {
          subjScores[subject] += 1;
        }
      }
    });
    Object.entries(subjScores).forEach(([subject, score]) => {
      if (!subjectProgression[subject]) subjectProgression[subject] = [];
      subjectProgression[subject].push({ name: result.paperId, score, idx });
    });
  });

  // 4. Strongest/Weakest Subject (by avg accuracy)
  const subjectStats: Record<string, { correct: number; total: number; totalTime: number; count: number }> = {};
  const statusDist: Record<string, number> = {};
  let totalQuestions = 0;
  let totalTimeSpent = 0;
  analyticsResults.forEach(result => {
    (result.questions || []).forEach(q => {
      const qid = q.id;
      const subject = q.subject || 'Unknown';
      if (!subjectStats[subject]) subjectStats[subject] = { correct: 0, total: 0, totalTime: 0, count: 0 };
      if (result.answers && String(qid) in result.answers && result.correctOptions && String(qid) in result.correctOptions) {
        subjectStats[subject].total++;
        if (result.answers[String(qid)] == String(result.correctOptions[String(qid)])) {
          subjectStats[subject].correct++;
        }
      } else if (result.answers && String(qid) in result.answers) {
        subjectStats[subject].total++;
      }
      if (result.questionTimes && String(qid) in result.questionTimes) {
        subjectStats[subject].totalTime += result.questionTimes[String(qid)] || 0;
        subjectStats[subject].count++;
      }
      // Status distribution
      if (result.questionStatus && String(qid) in result.questionStatus) {
        const status = result.questionStatus[String(qid)];
        statusDist[status] = (statusDist[status] || 0) + 1;
      }
      totalQuestions++;
      if (result.questionTimes && String(qid) in result.questionTimes) {
        totalTimeSpent += result.questionTimes[String(qid)] || 0;
      }
    });
  });
  const subjectAccData = Object.entries(subjectStats).map(([subject, stats]) => ({
    subject,
    accuracy: stats.total ? ((stats.correct / stats.total) * 100).toFixed(1) : '0',
    avgTime: stats.count ? (stats.totalTime / stats.count).toFixed(1) : '0',
  }));
  const bestSubject = subjectAccData.length > 0 ? subjectAccData.reduce((prev, curr) => Number(curr.accuracy) > Number(prev.accuracy) ? curr : prev) : null;
  const weakestSubject = subjectAccData.length > 0 ? subjectAccData.reduce((prev, curr) => Number(curr.accuracy) < Number(prev.accuracy) ? curr : prev) : null;

  const avgTimePerQuestion = totalQuestions > 0 ? (totalTimeSpent / totalQuestions).toFixed(1) : '0';

  // 5. Questions Answered in Last X Minutes (e.g., 10 min = 600s)
  const X_MINUTES = 10 * 60;
  const rushStats = analyticsResults.map(result => {
    const { questionTimes, timeSpent } = result;
    if (!questionTimes || !timeSpent) return 0;
    return Object.values(questionTimes).filter((t: any) => typeof t === 'number' && t >= (timeSpent - X_MINUTES)).length;
  });

  // 6. Accuracy for Marked for Review vs. Directly Answered
  let markedCorrect = 0, markedTotal = 0, directCorrect = 0, directTotal = 0;
  analyticsResults.forEach(result => {
    const { answers, correctOptions, questionStatus, questions } = result;
    (questions || []).forEach(q => {
      const qid = q.id;
      const status = questionStatus && String(qid) in questionStatus ? questionStatus[String(qid)] : '';
      const answered = answers && String(qid) in answers;
      const correct = answered && correctOptions && String(qid) in correctOptions && answers[String(qid)] == String(correctOptions[String(qid)]);
      if (status === 'Marked for Review') {
        markedTotal++;
        if (correct) markedCorrect++;
      } else if (status === 'Answered') {
        directTotal++;
        if (correct) directCorrect++;
      }
    });
  });
  const markedAccuracy = markedTotal > 0 ? ((markedCorrect / markedTotal) * 100).toFixed(1) : '0';
  const directAccuracy = directTotal > 0 ? ((directCorrect / directTotal) * 100).toFixed(1) : '0';

  // 7. Unattempted Questions Trend
  const unattemptedTrend = analyticsResults.map(result => {
    const { questions, answers } = result;
    let unattempted = 0;
    (questions || []).forEach(q => {
      const qid = q.id;
      if (!answers || !(String(qid) in answers)) unattempted++;
    });
    return { name: result.paperId, unattempted };
  });

  // 8. Silly Mistake Tracker (Placeholder)
  // For future: expect a sillyMistake flag per answer, here we just show a placeholder

  const statusDistData = Object.entries(statusDist).map(([status, count]) => ({ status, count }));

  // Prepare data for line chart (score progression)
  const lineChartData = scoreHistory.map((entry, idx) => ({
    name: entry.paperId + (entry.date ? ` (${entry.date.slice(0,10)})` : ''),
    Score: entry.totalScore,
    MaxScore: entry.maxPossibleScore,
    idx
  }));

  return (
    <>
      <NavBar />
      <div className="container max-w-5xl mx-auto px-2 py-10 mt-24 md:px-8">
  {/* Page Heading */}
        <h1 className="text-4xl font-extrabold mb-3 text-primary flex items-center gap-4">
    <BarChart2 className="inline-block text-primary" size={36} />
    Analytics Dashboard
  </h1>
  <p className="mb-10 text-muted-foreground text-lg max-w-2xl">
    Visualize your JEE progress, spot trends, and discover where you can improve. All stats update automatically as you attempt more papers!
  </p>
        {loading ? (
    <div className="text-center py-12 text-lg">Loading analytics...</div>
  ) : error ? (
    <div className="text-center py-12 text-red-500 font-semibold">{error}</div>
  ) : (
    <>
      {/* Top Summary Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <Card className="shadow-lg border-2 border-yellow-100 bg-yellow-50/50">
          <CardHeader className="flex flex-row items-center gap-3 pb-2 justify-between">
  <div className="flex items-center gap-2">
    <Trophy className="text-yellow-500" size={26} />
    <CardTitle className="text-lg font-semibold">Papers Attempted</CardTitle>
  </div>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        The more papers you attempt, the better your exam practice and time management!
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-yellow-700">{totalPapers}</span>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-700">Total</Badge>
            </div>
            <span className="text-xs text-muted-foreground">Keep practicing to unlock more insights!</span>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-2 border-blue-100 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center gap-3 pb-2 justify-between">
  <div className="flex items-center gap-2">
    <TrendingUp className="text-blue-500" size={26} />
    <CardTitle className="text-lg font-semibold">Avg. Score</CardTitle>
  </div>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Track your average score to see if your overall performance is improving over time.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-blue-700">{avgScore}</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">per Paper</Badge>
            </div>
            <span className="text-xs text-muted-foreground">Aim for steady improvement!</span>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-2 border-green-100 bg-green-50/50">
          <CardHeader className="flex flex-row items-center gap-3 pb-2 justify-between">
  <div className="flex items-center gap-2">
    <Clock className="text-green-500" size={26} />
    <CardTitle className="text-lg font-semibold">Avg. Time/Q</CardTitle>
  </div>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Shows if you’re working at the right pace. Balance speed and accuracy for best results.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-green-700">{avgTimePerQuestion}</span>
              <span className="text-muted-foreground text-lg">s</span>
            </div>
            <span className="text-xs text-muted-foreground">Lower is better, but don’t rush!</span>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-2 border-pink-100 bg-pink-50/50">
          <CardHeader className="flex flex-row items-center gap-3 pb-2 justify-between">
  <div className="flex items-center gap-2">
    <Target className="text-pink-500" size={26} />
    <CardTitle className="text-lg font-semibold">Best Subject</CardTitle>
  </div>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Your strongest subject—maintain it for confidence and maximize your score!
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {subjectAccData.length > 0 ? (
                <span className="text-xl font-bold text-pink-700 flex items-center gap-2">
                  {/* Add subject icon here if desired */}
                  {subjectAccData.reduce((prev, curr) => Number(curr.accuracy) > Number(prev.accuracy) ? curr : prev).subject}
                </span>
              ) : (
                <span className="text-muted-foreground">N/A</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">Celebrate your strengths!</span>
          </CardContent>
        </Card>
      </div>

            {/* --- Advanced Analytics Section --- */}
            <div className="grid gap-6 md:grid-cols-3 mb-10">
              {/* Best Attempt */}
              <Card className="shadow border-green-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-base">🏆 Best Attempt</CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Review your best paper to see what worked well—repeat those strategies!
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                </CardHeader>
                <CardContent>
                  {bestAttempt ? (
                    <div>
                      <span className="font-bold">{bestAttempt.paperId}</span> <br />
                      Score: <span className="text-primary font-bold">{bestAttempt.totalScore}</span> / {bestAttempt.maxPossibleScore}
                    </div>
                  ) : 'N/A'}
                </CardContent>
              </Card>
              {/* Worst Attempt */}
              <Card className="shadow border-red-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-base">😬 Worst Attempt</CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Analyze your lowest score to learn from mistakes and avoid repeating them.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                </CardHeader>
                <CardContent>
                  {worstAttempt ? (
                    <div>
                      <span className="font-bold">{worstAttempt.paperId}</span> <br />
                      Score: <span className="text-primary font-bold">{worstAttempt.totalScore}</span> / {worstAttempt.maxPossibleScore}
                    </div>
                  ) : 'N/A'}
                </CardContent>
              </Card>
              {/* Score Consistency */}
              <Card className="shadow border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-base">📈 Score Consistency</CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        A lower standard deviation means your performance is stable. High fluctuation? Aim for more consistency.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="text-2xl font-bold text-primary">{scoreStd}</span> <span className="text-muted-foreground">(Std Dev)</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strongest/Weakest Subject, Rush Stats, Marked vs Direct Accuracy */}
            <div className="grid gap-6 md:grid-cols-3 mb-10">
              {/* Strongest Subject */}
              <Card className="shadow border-green-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-base">💪 Strongest Subject</CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Your highest accuracy subject—keep it strong and use it to boost your total score.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                </CardHeader>
                <CardContent>
                  {bestSubject ? (
                    <div>
                      <span className="font-bold">{bestSubject.subject}</span> <br />
                      Accuracy: <span className="text-primary font-bold">{bestSubject.accuracy}%</span>
                    </div>
                  ) : 'N/A'}
                </CardContent>
              </Card>
              {/* Weakest Subject */}
              <Card className="shadow border-red-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-base">💤 Weakest Subject</CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Focus extra practice here for the biggest improvement in your overall score.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                </CardHeader>
                <CardContent>
                  {weakestSubject ? (
                    <div>
                      <span className="font-bold">{weakestSubject.subject}</span> <br />
                      Accuracy: <span className="text-primary font-bold">{weakestSubject.accuracy}%</span>
                    </div>
                  ) : 'N/A'}
                </CardContent>
              </Card>
              {/* Rush Stats */}
              <Card className="shadow border-yellow-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-base">⏩ Rushing (Last 10 min)</CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Too many rushed answers at the end? Work on pacing to avoid last-minute mistakes.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="font-bold text-primary">{rushStats.reduce((a, b) => a + b, 0)}</span> questions answered in last 10 min (all attempts)
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Marked vs Direct Accuracy & Unattempted Trend */}
            <div className="grid gap-6 md:grid-cols-2 mb-10">
              {/* Marked vs Direct Accuracy */}
              <Card className="shadow border-purple-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-base">🟣 Marked vs Direct Accuracy</CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Compare accuracy for reviewed vs. directly answered questions. Low review accuracy? Rethink your review strategy.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="font-bold">Marked for Review:</span> <span className="text-primary font-bold">{markedAccuracy}%</span><br/>
                    <span className="font-bold">Directly Answered:</span> <span className="text-primary font-bold">{directAccuracy}%</span>
                  </div>
                </CardContent>
              </Card>
              {/* Unattempted Questions Trend */}
              <Card className="shadow border-orange-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-base">🟠 Unattempted Questions Trend</CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Track how many questions you leave blank—fewer unattempted means better time management.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={unattemptedTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="unattempted" stroke="#FF9900" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Subject-wise Score Progression */}
            <div className="mb-10">
              <Card className="shadow border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-lg">📚 Subject-wise Score Progression</CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        See how your scores in each subject are evolving over time.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      {Object.keys(subjectProgression).map((subject, idx) => (
                        <Line
                          key={subject}
                          type="monotone"
                          dataKey="score"
                          data={subjectProgression[subject]}
                          name={subject}
                          stroke={['#8884d8', '#82ca9d', '#ffc658'][idx % 3]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Silly Mistake Tracker Placeholder */}
            <div className="mb-10">
              <Card className="shadow border-gray-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-base">🤦 Silly Mistake Tracker <span className="text-xs text-muted-foreground">(Coming Soon)</span></CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Flag and track careless mistakes to reduce them in future attempts.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                </CardHeader>
                <CardContent>
                  <span className="text-muted-foreground">You'll soon be able to flag silly mistakes and track them here for deeper insights!</span>
                </CardContent>
              </Card>
            </div>

            {/* Score Progression Chart */}
            <div className="mb-10">
              <Card className="shadow border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-lg">
    <TrendingUp className="text-blue-500" size={20} /> Score Progression
  </CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Visualize your improvement or spot plateaus in your overall scores.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                  <p className="text-muted-foreground text-sm mt-1">See how your scores have changed over time.</p>
                </CardHeader>
                <CardContent>
                  {lineChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={lineChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={70} tick={{ fill: '#2563eb', fontWeight: 600 }} />
                        <YAxis tick={{ fill: '#64748b' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Score" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb' }} />
                        <Line type="monotone" dataKey="MaxScore" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-500">No data yet. Attempt some papers to see your progress!</div>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Subject Accuracy & Time */}
            <div className="grid gap-6 md:grid-cols-2 mb-10">
              <Card className="shadow border-green-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-lg">
    <Target className="text-green-500" size={20} /> Accuracy by Subject
  </CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Check which subjects are your strengths and which need more work.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                  <p className="text-muted-foreground text-sm mt-1">Your accuracy rate for each subject.</p>
                </CardHeader>
                <CardContent>
                  {subjectAccData.length > 0 ? (
                    <ul className="space-y-3">
                      {subjectAccData.map((s) => (
                        <li key={s.subject} className="flex items-center gap-3">
                          <span className="w-20 font-semibold text-primary">{s.subject}</span>
                          <Progress value={Number(s.accuracy)} className="flex-1 h-3 bg-secondary" />
                          <span className="ml-2 font-bold text-green-600">{s.accuracy}%</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No subject data yet.</span>
                  )}
                </CardContent>
              </Card>
              <Card className="shadow border-purple-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-lg">
    <Clock className="text-purple-500" size={20} /> Avg. Time by Subject
  </CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        Optimize time spent per subject to maximize your total score.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                  <p className="text-muted-foreground text-sm mt-1">How much time you spend per question in each subject.</p>
                </CardHeader>
                <CardContent>
                  {subjectAccData.length > 0 ? (
                    <ul className="space-y-3">
                      {subjectAccData.map((s) => (
                        <li key={s.subject} className="flex items-center gap-3">
                          <span className="w-20 font-semibold text-primary">{s.subject}</span>
                          <Progress value={Math.min(Number(s.avgTime) * 1.5, 100)} className="flex-1 h-3 bg-secondary" />
                          <span className="ml-2 font-bold text-purple-600">{s.avgTime} s</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No subject data yet.</span>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Status Distribution Chart */}
            <div className="mb-8">
              <Card className="shadow border-green-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
  <CardTitle className="flex items-center gap-2 text-lg">
    <BarChart2 className="text-green-500" size={20} /> Question Status Distribution
  </CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="text-muted-foreground cursor-pointer" size={18} />
      </TooltipTrigger>
      <TooltipContent side="top">
        See how you interact with questions—aim for fewer unvisited or unattempted questions.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
                  <p className="text-muted-foreground text-sm mt-1">How you interact with questions (answered, reviewed, etc).</p>
                </CardHeader>
                <CardContent>
                  {statusDistData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={statusDistData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" tick={{ fill: '#22c55e', fontWeight: 600 }} />
                        <YAxis allowDecimals={false} tick={{ fill: '#64748b' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={3} dot={{ r: 5, fill: '#22c55e' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <span>No status data available.</span>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Analytics;
