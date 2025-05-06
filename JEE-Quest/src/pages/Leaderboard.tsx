import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  userName: string;
  score: number;
  paperTitle: string;
  rank: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { userName: 'Alice', score: 98, paperTitle: 'JEE Mains 2024 - Morning', rank: 1 },
  { userName: 'Bob', score: 94, paperTitle: 'JEE Mains 2024 - Morning', rank: 2 },
  { userName: 'Charlie', score: 91, paperTitle: 'JEE Mains 2024 - Morning', rank: 3 },
  { userName: 'You', score: 88, paperTitle: 'JEE Mains 2024 - Morning', rank: 4 },
];

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace with API call
    setEntries(mockLeaderboard);
  }, []);

  return (
    <div className="flex min-h-0">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <div className="page-container pt-8 md:pt-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paper</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.map(entry => (
                    <tr key={entry.rank} className={entry.userName === 'You' ? 'bg-violet-50 font-semibold' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.rank}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.userName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.paperTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center mt-8">
                <Button onClick={() => navigate(-1)}>Back to Papers</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
