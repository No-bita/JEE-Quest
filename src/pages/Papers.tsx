
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import PaperCard from '@/components/PaperCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, CalendarRange } from 'lucide-react';

// Mock papers data
const mockPapers = [
  {
    id: 'jee2025-1',
    year: 2025,
    shift: 'Shift 1',
    date: 'Jan 24, 2025',
    questionCount: 75,
    duration: 180,
    difficulty: 'medium' as const,
  },
  {
    id: 'jee2025-2',
    year: 2025,
    shift: 'Shift 2',
    date: 'Jan 25, 2025',
    questionCount: 75,
    duration: 180,
    difficulty: 'hard' as const,
  },
  {
    id: 'jee2024-1',
    year: 2024,
    shift: 'Shift 1',
    date: 'Jan 24, 2024',
    questionCount: 75,
    duration: 180,
    difficulty: 'medium' as const,
  },
  {
    id: 'jee2024-2',
    year: 2024,
    shift: 'Shift 2',
    date: 'Jan 25, 2024',
    questionCount: 75,
    duration: 180,
    difficulty: 'easy' as const,
  },
  {
    id: 'jee2023-1',
    year: 2023,
    shift: 'Shift 1',
    date: 'Jan 24, 2023',
    questionCount: 75,
    duration: 180,
    difficulty: 'hard' as const,
  },
  {
    id: 'jee2023-2',
    year: 2023,
    shift: 'Shift 2',
    date: 'Jan 25, 2023',
    questionCount: 75,
    duration: 180,
    difficulty: 'medium' as const,
  },
  {
    id: 'jee2022-1',
    year: 2022,
    shift: 'Shift 1',
    date: 'Jan 24, 2022',
    questionCount: 75,
    duration: 180,
    difficulty: 'medium' as const,
  },
  {
    id: 'jee2022-2',
    year: 2022,
    shift: 'Shift 2',
    date: 'Jan 25, 2022',
    questionCount: 75,
    duration: 180,
    difficulty: 'easy' as const,
  },
  {
    id: 'jee2021-1',
    year: 2021,
    shift: 'Shift 1',
    date: 'Feb 24, 2021',
    questionCount: 75,
    duration: 180,
    difficulty: 'hard' as const,
  },
  {
    id: 'jee2021-2',
    year: 2021,
    shift: 'Shift 2',
    date: 'Feb 25, 2021',
    questionCount: 75,
    duration: 180,
    difficulty: 'medium' as const,
  },
  {
    id: 'jee2020-1',
    year: 2020,
    shift: 'Shift 1',
    date: 'Jan 24, 2020',
    questionCount: 75,
    duration: 180,
    difficulty: 'medium' as const,
  },
  {
    id: 'jee2020-2',
    year: 2020,
    shift: 'Shift 2',
    date: 'Jan 25, 2020',
    questionCount: 75,
    duration: 180,
    difficulty: 'easy' as const,
  },
];

const Papers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  
  // Filter papers based on search query and filters
  const filteredPapers = mockPapers.filter(paper => {
    // Apply year filter
    if (yearFilter !== 'all' && paper.year.toString() !== yearFilter) return false;
    
    // Apply difficulty filter
    if (difficultyFilter !== 'all' && paper.difficulty !== difficultyFilter) return false;
    
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search for papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-4">
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
              
              <div className="min-w-40">
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger>
                    <Filter size={16} className="mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter by difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {searchQuery || yearFilter !== 'all' || difficultyFilter !== 'all' ? (
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
                  difficulty={paper.difficulty}
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
                    setDifficultyFilter('all');
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
                      difficulty={paper.difficulty}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </>
  );
};

export default Papers;
