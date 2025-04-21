import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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

  // --- Aggregate analytics ---
  // Per-subject stats
  const subjectStats: Record<string, { correct: number; total: number; totalTime: number; count: number }> = {};
  // Question status distribution
  const statusDist: Record<string, number> = {};
  // Time tracking
  let totalQuestions = 0;
  let totalTimeSpent = 0;

  analyticsResults.forEach(result => {
    const { answers, correctOptions, questionStatus, questionTimes, questions } = result;
    questions.forEach(q => {
      const qid = q.id;
      const subject = q.subject || 'Unknown';
      if (!subjectStats[subject]) subjectStats[subject] = { correct: 0, total: 0, totalTime: 0, count: 0 };
      subjectStats[subject].total++;
      subjectStats[subject].count++;
      if (answers && String(qid) in answers && correctOptions && String(qid) in correctOptions) {
        if (answers[String(qid)] == String(correctOptions[String(qid)])) {
          subjectStats[subject].correct++;
        }
      }
      if (questionTimes && String(qid) in questionTimes) {
        subjectStats[subject].totalTime += questionTimes[String(qid)];
        totalTimeSpent += questionTimes[String(qid)];
      }
      // Status distribution
      if (questionStatus && String(qid) in questionStatus) {
        const status = questionStatus[String(qid)];
        statusDist[status] = (statusDist[status] || 0) + 1;
      }
      totalQuestions++;
    });
  });

  const avgTimePerQuestion = totalQuestions > 0 ? (totalTimeSpent / totalQuestions).toFixed(1) : '0';
  const subjectAccData = Object.entries(subjectStats).map(([subject, stat]) => ({
    subject,
    accuracy: stat.total ? ((stat.correct / stat.total) * 100).toFixed(1) : '0',
    avgTime: stat.count ? (stat.totalTime / stat.count).toFixed(1) : '0',
  }));
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
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Analytics</h1>
        {loading ? (
          <div className="text-center py-8 text-lg">Loading analytics...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-semibold">{error}</div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Total Papers Attempted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPapers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Average Score per Paper</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgScore}</div>
                </CardContent>
              </Card>
            </div>
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Score Progression Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  {lineChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={lineChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={70} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Score" stroke="#2563eb" strokeWidth={2} />
                        <Line type="monotone" dataKey="MaxScore" stroke="#94a3b8" strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-500">No data yet. Attempt some papers to see your progress!</div>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* --- New Analytics Cards --- */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Average Time per Question</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgTimePerQuestion} s</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Accuracy by Subject</CardTitle>
                </CardHeader>
                <CardContent>
                  {subjectAccData.length > 0 ? (
                    <ul>
                      {subjectAccData.map((s) => (
                        <li key={s.subject} className="mb-1">
                          <span className="font-semibold">{s.subject}:</span> {s.accuracy}%
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No subject data yet.</span>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Avg Time by Subject</CardTitle>
                </CardHeader>
                <CardContent>
                  {subjectAccData.length > 0 ? (
                    <ul>
                      {subjectAccData.map((s) => (
                        <li key={s.subject} className="mb-1">
                          <span className="font-semibold">{s.subject}:</span> {s.avgTime} s
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No subject data yet.</span>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* --- Status Distribution Chart --- */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Question Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {statusDistData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={statusDistData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} />
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
