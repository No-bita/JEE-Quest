import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import PaperCard from '@/components/PaperCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, CalendarRange, Plus, LogIn, BarChart2, BookOpen, History, Trophy, User } from 'lucide-react';
import QuestionEditor from '@/components/QuestionEditor';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';

// Mock papers data
const mockPapers = [
  {
    id: 'jee2025-1',
    year: 2025,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 24, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-2',
    year: 2025,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 25, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2024-1',
    year: 2024,
    session: 'Session 2',
    shift: 'Shift Morning',
    date: 'Apr 04, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-2',
    year: 2024,
    session: 'Session 1',
    shift: 'Shift Morning',
    date: 'Jan 27, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-3',
    year: 2024,
    session: 'Session 1',
    shift: 'Shift Evening',
    date: 'Jan 27, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-1',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 24, 2023',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2023-2',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 25, 2023',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2022-1',
    year: 2022,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 24, 2022',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2022-2',
    year: 2022,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 25, 2022',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2021-1',
    year: 2021,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Feb 24, 2021',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2021-2',
    year: 2021,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Feb 25, 2021',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2020-1',
    year: 2020,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 24, 2020',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2020-2',
    year: 2020,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 25, 2020',
    questionCount: 75,
    duration: 180,
  },
];

interface Question {
  id: number;
  text: string;
  options: { id: string; text: string }[];
  correctOption: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  topic: string;
}

// Mock questions by paper ID
const mockQuestionsByPaperId: Record<string, Question[]> = {
  'jee2025-1': [
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
  ],
};

// Mock recent activity data
const recentActivity = [
  { id: 1, type: 'Test Completed', paper: 'JEE 2023 Session 1', score: '78/100', date: '2 days ago' },
  { id: 2, type: 'Test Started', paper: 'JEE 2024 Session 1', progress: '45%', date: '1 week ago' },
  { id: 3, type: 'Test Purchased', paper: 'JEE 2025 Session 1', date: '2 weeks ago' },
];

// Mock statistics data
const userStats = {
  testsCompleted: 12,
  averageScore: 76,
  topSubject: 'Physics',
  studyHours: 48
};

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentPaperId, setCurrentPaperId] = useState<string>('');
  const [showQuestionEditor, setShowQuestionEditor] = useState<boolean>(false);
  const [paperQuestions, setPaperQuestions] = useState<Question[]>([]);
  const [userName, setUserName] = useState<string>('User');
  const navigate = useNavigate();
  
  // Check if user has a subscription
  const hasSubscription = () => {
    return localStorage.getItem('hasSubscription') === 'true';
  };
  
  // Get purchased papers
  const getPurchasedPapers = () => {
    return JSON.parse(localStorage.getItem('purchasedPapers') || '[]');
  };
  
  useEffect(() => {
    // Check login status from localStorage
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // Only admins should have admin mode
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    
    // Get user name from localStorage (would come from API in real implementation)
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
    
    // Redirect to signin if not logged in
    if (!loggedIn) {
      navigate('/signin');
    }
  }, [navigate]);
  
  const handleEditPaper = (paperId: string) => {
    // Check if user is logged in and is admin
    if (!isLoggedIn) {
      toast.error("Please log in to continue");
      navigate('/signin');
      return;
    }
    
    if (!isAdmin) {
      toast.error("You don't have permission to edit papers");
      return;
    }
    
    setCurrentPaperId(paperId);
    // Load questions for this paper
    const questions = mockQuestionsByPaperId[paperId] || [];
    setPaperQuestions(questions);
    setShowQuestionEditor(true);
  };
  
  const handleSaveQuestions = (questions: Question[]) => {
    // In a real app, this would save to a database
    // For demo, we'll just update our local mock data
    mockQuestionsByPaperId[currentPaperId] = questions;
    setPaperQuestions(questions);
  };
  
  // Filter papers based on search query and filters
  const filteredPapers = mockPapers.filter(paper => {
    // Apply year filter
    if (yearFilter !== 'all' && paper.year.toString() !== yearFilter) return false;
    
    // Apply search query
    if (searchQuery && !`${paper.year} ${paper.session}`.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Group papers by year for the tabs
  const papersByYear: Record<number, typeof mockPapers> = {};
  mockPapers.forEach(paper => {
    if (!papersByYear[paper.year]) {
      papersByYear[paper.year] = [];
    }
    papersByYear[paper.year].push(paper);
  });
  
  const years = Object.keys(papersByYear).sort((a, b) => Number(b) - Number(a));
  
  // Determine if a paper is premium (In a real app, this would come from your backend)
  const isPaperPremium = (paperId: string) => {
    // For demo purposes, let's make 2025 and 2024 papers premium, others free
    const year = parseInt(paperId.split('-')[0].replace('jee', ''));
    return year >= 2024;
  };
  
  // Get recommended papers based on user history (mock implementation)
  const getRecommendedPapers = () => {
    return mockPapers.slice(0, 3);
  };

  return (
    <>
      <NavBar />
      <div className="page-container pt-24">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Welcome back, {userName}</h1>
          <p className="text-muted-foreground mt-2">Your JEE preparation dashboard</p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tests Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{userStats.testsCompleted}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-2xl font-bold">{userStats.averageScore}%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{userStats.topSubject}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Study Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <History className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">{userStats.studyHours}h</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Column */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableBody>
                    {recentActivity.map(activity => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <div className="font-medium">{activity.type}</div>
                          <div className="text-sm text-muted-foreground">{activity.paper}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>{activity.score || activity.progress || ''}</div>
                          <div className="text-sm text-muted-foreground">{activity.date}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="px-6 py-3 border-t">
                <Button variant="ghost" className="w-full" onClick={() => navigate('/analysis')}>
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
            
            {/* Search & Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Find Test Papers</CardTitle>
                <CardDescription>Search for practice papers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    placeholder="Search for papers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger>
                    <CalendarRange size={16} className="mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter by year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            {/* Admin Tools (if admin) */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Admin Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full gap-2" onClick={() => {
                    toast.info("Create new paper functionality would go here");
                  }}>
                    <Plus size={16} />
                    Create New Paper
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Papers Column */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Recommended for You</CardTitle>
                <CardDescription>Based on your recent activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getRecommendedPapers().map(paper => (
                    <PaperCard
                      key={paper.id}
                      id={paper.id}
                      year={paper.year}
                      session={paper.session}
                      shift={paper.shift}
                      date={paper.date}
                      questionCount={paper.questionCount}
                      duration={paper.duration}
                      isPremium={isPaperPremium(paper.id)}
                      isAdmin={isAdmin}
                      onEditPaper={handleEditPaper}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Papers List (filtered or by year) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Practice Papers</CardTitle>
                <CardDescription>Browse JEE test papers by year</CardDescription>
              </CardHeader>
              <CardContent>
                {searchQuery || yearFilter !== 'all' ? (
                  // Show filtered results
                  <div>
                    <h3 className="text-sm font-medium mb-4">
                      Filtered Results ({filteredPapers.length})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredPapers.map(paper => (
                        <PaperCard
                          key={paper.id}
                          id={paper.id}
                          year={paper.year}
                          session={paper.session}
                          shift={paper.shift}
                          date={paper.date}
                          questionCount={paper.questionCount}
                          duration={paper.duration}
                          isPremium={isPaperPremium(paper.id)}
                          isAdmin={isAdmin}
                          onEditPaper={handleEditPaper}
                        />
                      ))}
                    </div>
                    
                    {filteredPapers.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No papers match your search criteria.</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setSearchQuery('');
                            setYearFilter('all');
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Show papers organized by year in tabs
                  <Tabs defaultValue={years[0]} className="w-full">
                    <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
                      {years.map(year => (
                        <TabsTrigger key={year} value={year}>
                          {year}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {years.map(year => (
                      <TabsContent key={year} value={year}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {papersByYear[Number(year)].map(paper => (
                            <PaperCard
                              key={paper.id}
                              id={paper.id}
                              year={paper.year}
                              session={paper.session}
                              shift={paper.shift}
                              date={paper.date}
                              questionCount={paper.questionCount}
                              duration={paper.duration}
                              isPremium={isPaperPremium(paper.id)}
                              isAdmin={isAdmin}
                              onEditPaper={handleEditPaper}
                            />
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Question Editor for Admin */}
      {isAdmin && (
        <QuestionEditor
          open={showQuestionEditor}
          onOpenChange={setShowQuestionEditor}
          paperId={currentPaperId}
          initialQuestions={paperQuestions}
          onSave={handleSaveQuestions}
        />
      )}
    </>
  );
};

export default Dashboard;
