
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import PaperCard from '@/components/PaperCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, CalendarRange, Plus, LogIn } from 'lucide-react';
import QuestionEditor from '@/components/QuestionEditor';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Mock papers data
const mockPapers = [
  {
    id: 'jee2025-1',
    year: 2025,
    shift: 'Shift 1',
    date: 'Jan 24, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2025-2',
    year: 2025,
    shift: 'Shift 2',
    date: 'Jan 25, 2025',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2024-1',
    year: 2024,
    shift: 'Shift 1',
    date: 'Apr 04, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2024-2',
    year: 2024,
    shift: 'Shift 1',
    date: 'Jan 27, 2024',
    questionCount: 90,
    duration: 180,
  },
  {
    id: 'jee2023-1',
    year: 2023,
    shift: 'Shift 1',
    date: 'Jan 24, 2023',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2023-2',
    year: 2023,
    shift: 'Shift 2',
    date: 'Jan 25, 2023',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2022-1',
    year: 2022,
    shift: 'Shift 1',
    date: 'Jan 24, 2022',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2022-2',
    year: 2022,
    shift: 'Shift 2',
    date: 'Jan 25, 2022',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2021-1',
    year: 2021,
    shift: 'Shift 1',
    date: 'Feb 24, 2021',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2021-2',
    year: 2021,
    shift: 'Shift 2',
    date: 'Feb 25, 2021',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2020-1',
    year: 2020,
    shift: 'Shift 1',
    date: 'Jan 24, 2020',
    questionCount: 75,
    duration: 180,
  },
  {
    id: 'jee2020-2',
    year: 2020,
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
    // Add more questions as needed
  ],
  // Add more papers with their questions
};

const Papers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentPaperId, setCurrentPaperId] = useState<string>('');
  const [showQuestionEditor, setShowQuestionEditor] = useState<boolean>(false);
  const [paperQuestions, setPaperQuestions] = useState<Question[]>([]);
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
  }, []);
  
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
    if (searchQuery && !`JEE Mains ${paper.year} ${paper.shift}`.toLowerCase().includes(searchQuery.toLowerCase())) {
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

  return (
    <>
      <NavBar />
      <div className="page-container pt-28">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">JEE Mains Past Papers</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our complete collection of JEE Mains past papers from 2020 to 2025, organized by year and shift.
          </p>
        </div>
        
        <div className="glass-card rounded-xl p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search for papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              <div className="min-w-40">
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
              </div>
              
              {!isLoggedIn && (
                <Button variant="outline" onClick={() => navigate('/signin')} className="gap-2">
                  <LogIn size={16} />
                  Sign In
                </Button>
              )}
            </div>
          </div>
          
          {isAdmin && (
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="gap-2" onClick={() => {
                // In a real app, this would create a new paper in the database
                toast.info("Create new paper functionality would go here");
              }}>
                <Plus size={16} />
                Create New Paper
              </Button>
            </div>
          )}
        </div>
        
        {searchQuery || yearFilter !== 'all' ? (
          // Show filtered results
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Filtered Results ({filteredPapers.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map(paper => (
                <PaperCard
                  key={paper.id}
                  id={paper.id}
                  year={paper.year}
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
              <div className="text-center py-12">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {papersByYear[Number(year)].map(paper => (
                    <PaperCard
                      key={paper.id}
                      id={paper.id}
                      year={paper.year}
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

export default Papers;
