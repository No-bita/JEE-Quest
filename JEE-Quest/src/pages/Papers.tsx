import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import PaperCard from '@/components/PaperCard';
import Banner from '@/components/Banner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, CalendarRange, LogIn, BarChart2, BookOpen, History, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';



// Mock papers data
const mockPapers = [
  {
    id: 'jee2025-1',
    year: 2025,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 22, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-2',
    year: 2025,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 22, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-3',
    year: 2025,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 23, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-4',
    year: 2025,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 23, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-5',
    year: 2025,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 24, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-6',
    year: 2025,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 24, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-7',
    year: 2025,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 28, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-8',
    year: 2025,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 28, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-9',
    year: 2025,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 29, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-10',
    year: 2025,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 29, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2024-1',
    year: 2024,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 27, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-2',
    year: 2024,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 27, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-3',
    year: 2024,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 29, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-4',
    year: 2024,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 29, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-5',
    year: 2024,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 30, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-6',
    year: 2024,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 30, 2024',
    questionCount: 90,
    duration: 180,
  },  {
    id: 'jee2024-7',
    year: 2024,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Jan 31, 2024',
    questionCount: 90,
    duration: 180,
  },  {
    id: 'jee2024-8',
    year: 2024,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Jan 31, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-9',
    year: 2024,
    session: 'Session 1',
    shift: 'Morning Shift',
    date: 'Feb 01, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-10',
    year: 2024,
    session: 'Session 1',
    shift: 'Evening Shift',
    date: 'Feb 01, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-11',
    year: 2024,
    session: 'Session 2',
    shift: 'Morning Shift',
    date: 'Apr 04, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-12',
    year: 2024,
    session: 'Session 2',
    shift: 'Evening Shift',
    date: 'Apr 04, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-13',
    year: 2024,
    session: 'Session 2',
    shift: 'Morning Shift',
    date: 'Apr 05, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-14',
    year: 2024,
    session: 'Session 2',
    shift: 'Evening Shift',
    date: 'Apr 05, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-15',
    year: 2024,
    session: 'Session 2',
    shift: 'Morning Shift',
    date: 'Apr 06, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-16',
    year: 2024,
    session: 'Session 2',
    shift: 'Evening Shift',
    date: 'Apr 06, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-17',
    year: 2024,
    session: 'Session 2',
    shift: 'Morning Shift',
    date: 'Apr 08, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-18',
    year: 2024,
    session: 'Session 2',
    shift: 'Evening Shift',
    date: 'Apr 08, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-19',
    year: 2024,
    session: 'Session 2',
    shift: 'Morning Shift',
    date: 'Apr 09, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-20',
    year: 2024,
    session: 'Session 2',
    shift: 'Evening Shift',
    date: 'Apr 09, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-1',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 24, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-2',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 24, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-3',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 25, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-4',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 25, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-5',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 29, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-6',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 29, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-7',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 30, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-8',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 30, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-9',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Jan 31, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-10',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Jan 31, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-11',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'Feb 01, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-12',
    year: 2023,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Feb 01, 2023',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2022-1',
    year: 2022,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'To be added',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2022-2',
    year: 2022,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'To be added',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2021-1',
    year: 2021,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'To be added',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2021-2',
    year: 2021,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'Feb 25, 2021',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2020-1',
    year: 2020,
    session: 'Session 1',
    shift: 'Shift 1',
    date: 'To be added',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2020-2',
    year: 2020,
    session: 'Session 1',
    shift: 'Shift 2',
    date: 'To be added',
    questionCount: 90,
    duration: 180,
  },
];

interface Question {
  id: number;
  text: string;
  imageUrl: string;
  options: { id: string; text: string; }[];
  correctOption: string;
  subject: string;
}


const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionFilter, setSessionFilter] = useState<string>('all');  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('User');
  const navigate = useNavigate();
  
  // // Check if user has a subscription
  // const hasSubscription = () => {
  //   return localStorage.getItem('hasSubscription') === 'true';
  // };

  const [userStats, setUserStats] = useState({
    testsCompleted: 0,
    averageScore: 0,
    topSubject: 'None',
    studyHours: 0
  });
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchUserStats = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/userstats/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }

      const stats = await response.json();
      setUserStats(stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error('Failed to load your stats');
    }
  }

  useEffect(() => {
    // Check login status from localStorage
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // Get user name from localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
    
    // Redirect to signin if not logged in
    if (!loggedIn) {
      navigate('/signin');
    } else {
      const userId = localStorage.getItem('userId');

      fetchUserStats(userId);
    }
  }, [navigate]);
  

  // Filter papers based on search query and filters
  const filteredPapers = mockPapers.filter(paper => {
    // Apply year filter
    if (sessionFilter !== 'all' && paper.session !== sessionFilter) return false;
    
    // Apply search query
    if (searchQuery) {
      const paperTitle = `${paper.date} - Shift ${paper.shift}`;
      const searchString = `${paperTitle} ${paper.session} ${paper.year}`.toLowerCase();
      if (!searchString.includes(searchQuery.toLowerCase())) {
        return false;
      }
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
  
  
  const isPaperPremium = (paperId: string) => {
    // For demo purposes, let's make 2025 and 2024 papers premium, others free
    const year = parseInt(paperId.split('-')[0].replace('jee', ''));
    return year >= 2021;
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
        
        {/* Main Content - Practice Papers with integrated filters */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl">Practice Papers</CardTitle>
              <CardDescription>Browse JEE test papers by year</CardDescription>
            </div>
            
            {/* Filters moved into the card header */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search papers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={sessionFilter} onValueChange={setSessionFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <CalendarRange size={16} className="mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  {[...new Set(mockPapers.map(paper => paper.session))].map(session => (
                    <SelectItem key={session} value={session}>{session}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="pt-4">
            {searchQuery || sessionFilter !== 'all' ? (
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
                        setSessionFilter('all');
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
      <div className="page-container pt-24">
        {/* Other dashboard components */}
      </div>
      
      {/* Add the Banner component */}
      <Banner 
        text="🚀 We’re Hiring a Growth Intern! Click to Apply 🚀" 
        linkUrl="https://forms.gle/your-google-form-link"
      />
    </>
  );
};

export default Dashboard;