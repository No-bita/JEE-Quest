import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import NavBar from '@/components/NavBar';
import { resultsApi } from '@/utils/api';

interface ScoreEntry {
  paperId: string;
  date: string;
  totalScore: number;
  maxPossibleScore: number;
}

const Analytics: React.FC = () => {
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      // Show mock data for demo on landing page
      setScoreHistory([
        { paperId: 'JEE2024-01', date: '2025-01-10', totalScore: 220, maxPossibleScore: 300 },
        { paperId: 'JEE2024-02', date: '2025-01-17', totalScore: 235, maxPossibleScore: 300 },
        { paperId: 'JEE2024-03', date: '2025-01-24', totalScore: 250, maxPossibleScore: 300 },
        { paperId: 'JEE2024-04', date: '2025-02-01', totalScore: 260, maxPossibleScore: 300 },
        { paperId: 'JEE2024-05', date: '2025-02-08', totalScore: 270, maxPossibleScore: 300 },
        { paperId: 'JEE2024-06', date: '2025-02-15', totalScore: 280, maxPossibleScore: 300 },
        { paperId: 'JEE2024-07', date: '2025-02-22', totalScore: 290, maxPossibleScore: 300 },
      ]);
      setLoading(false);
      setError(null);
    } else {
      const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);
        const response = await resultsApi.getResultsAnalytics();
        if (response.success) {
          setScoreHistory(response.data || []);
        } else {
          setError(response.error || 'Failed to fetch analytics');
        }
        setLoading(false);
      };
      fetchAnalytics();
    }
  }, []);

  // Calculate analytics
  const totalPapers = scoreHistory.length;
  const avgScore = totalPapers > 0 ? (scoreHistory.reduce((acc, s) => acc + s.totalScore, 0) / totalPapers).toFixed(2) : '0';

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
          </>
        )}
      </div>
    </>
  );
};

export default Analytics;
