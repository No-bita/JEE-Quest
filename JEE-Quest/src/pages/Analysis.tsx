
import React from 'react';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart, LineChart, PieArcDatum } from '@/components/ui/recharts';
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, BookOpen } from 'lucide-react';


const difficultyDistributionData = [
  { name: 'Easy', value: 40, color: 'hsl(140, 70%, 60%)' },
  { name: 'Medium', value: 35, color: 'hsl(40, 70%, 60%)' },
  { name: 'Hard', value: 25, color: 'hsl(10, 70%, 60%)' },
];

const progressData = [
  { name: 'Jan', score: 45 },
  { name: 'Feb', score: 52 },
  { name: 'Mar', score: 60 },
  { name: 'Apr', score: 68 },
  { name: 'May', score: 75 },
];

const topicWiseData = [
  { name: 'Kinematics', score: 85, color: 'hsl(10, 70%, 60%)' },
  { name: 'Thermodynamics', score: 70, color: 'hsl(20, 70%, 60%)' },
  { name: 'Electrostatics', score: 60, color: 'hsl(30, 70%, 60%)' },
  { name: 'Optics', score: 75, color: 'hsl(40, 70%, 60%)' },
  { name: 'Modern Physics', score: 90, color: 'hsl(50, 70%, 60%)' },
];

const recentPracticeData = [
  { name: 'JEE 2025 Shift 1', date: '3 days ago', score: 420, total: 600, percentage: 70 },
  { name: 'JEE 2024 Shift 2', date: '1 week ago', score: 390, total: 600, percentage: 65 },
  { name: 'JEE 2024 Shift 1', date: '2 weeks ago', score: 360, total: 600, percentage: 60 },
];

const Analysis: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="page-container pt-28">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Performance Analysis</h1>
            <p className="text-muted-foreground">Track your progress and identify areas for improvement</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <BookOpen size={18} className="mr-2" />
              View Recommendations
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Average Score</CardTitle>
              <CardDescription>Across all practice tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">67%</div>
              <p className="text-sm text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Practice Sessions</CardTitle>
              <CardDescription>Total tests completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">24</div>
              <p className="text-sm text-muted-foreground">8 sessions this month</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Time Management</CardTitle>
              <CardDescription>Average time per question</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">1.8m</div>
              <p className="text-sm text-muted-foreground">-0.3m from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="performance" className="mb-8">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-6">
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span>Subject Performance</span>
            </TabsTrigger>
            <TabsTrigger value="difficulty" className="flex items-center gap-2">
              <PieChartIcon size={16} />
              <span>Difficulty Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <LineChartIcon size={16} />
              <span>Progress Tracking</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
                <CardDescription>How you perform across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    data={subjectPerformanceData}
                    index="name"
                    categories={['score']}
                    colors={['hsl(var(--primary))']}
                    valueFormatter={(value) => `${value}%`}
                    yAxisWidth={40}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Topic-wise Analysis (Physics)</CardTitle>
                  <CardDescription>Performance by topic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <BarChart
                      data={topicWiseData}
                      index="name"
                      categories={['score']}
                      colors={['hsl(var(--primary))']}
                      valueFormatter={(value) => `${value}%`}
                      layout="horizontal"
                      yAxisWidth={140}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Recent Practice Tests</CardTitle>
                  <CardDescription>Your latest performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPracticeData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{item.percentage}%</div>
                            <div className="text-sm text-muted-foreground">{item.score}/{item.total}</div>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="difficulty">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Question Difficulty Distribution</CardTitle>
                  <CardDescription>Breakdown of questions by difficulty level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <PieChart
                      data={difficultyDistributionData}
                      index="name"
                      valueFormatter={(value) => `${value}%`}
                      category="value"
                      colors={['hsl(140, 70%, 60%)', 'hsl(40, 70%, 60%)', 'hsl(10, 70%, 60%)']}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Performance by Difficulty</CardTitle>
                  <CardDescription>How well you handle different difficulty levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>Easy Questions</span>
                        </div>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '85%' }} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                          <span>Medium Questions</span>
                        </div>
                        <span className="font-medium">68%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '68%' }} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span>Hard Questions</span>
                        </div>
                        <span className="font-medium">42%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: '42%' }} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-4">
                    <p>You perform best on easy questions. Focus on improving your performance on harder questions to boost your overall score.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
                <CardDescription>Your score improvement over months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart
                    data={progressData}
                    index="name"
                    categories={['score']}
                    colors={['hsl(var(--primary))']}
                    valueFormatter={(value) => `${value}%`}
                    yAxisWidth={40}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
            <CardDescription>Based on your performance analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
              <h3 className="font-semibold text-green-700 mb-1">Physics: Modern Physics</h3>
              <p className="text-sm text-green-700">You're doing excellent in this area. Keep up the good work!</p>
            </div>
            
            <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
              <h3 className="font-semibold text-amber-700 mb-1">Chemistry: Organic Reactions</h3>
              <p className="text-sm text-amber-700">You're performing moderately well. Try more practice questions on this topic.</p>
            </div>
            
            <div className="p-4 border rounded-lg bg-red-50 border-red-200">
              <h3 className="font-semibold text-red-700 mb-1">Mathematics: Calculus</h3>
              <p className="text-sm text-red-700">This is an area that needs improvement. Focus on understanding the concepts better.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Analysis;
