
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  const handlePracticeClick = () => {
    // Navigate to a sample paper to show how the exam interface looks
    navigate('/practice/jee2022-1');
  };
  
  const handleBrowsePapers = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      toast.info("Please sign in to browse papers");
      navigate('/signin');
    } else {
      navigate('/papers');
    }
  };
  
  return (
    <div className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-gray-200/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]" />
      
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-24 page-container">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 py-1.5 px-4 text-sm animate-fade-in">
            JEE Mains 2020-2025
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            Master JEE Mains with 
            <span className="text-primary ml-2">Past Papers</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in delay-75">
            Comprehensive collection of JEE Mains past year papers with detailed solutions and 
            advanced practice tools to help you excel in your exams.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in delay-100">
            <Button size="lg" className="w-full sm:w-auto gap-2" onClick={handleBrowsePapers}>
              <BookOpen size={18} />
              Browse Papers
              <ArrowRight size={16} className="ml-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto gap-2"
              onClick={handlePracticeClick}
            >
              <Clock size={18} />
              Practice Mode
            </Button>
          </div>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-5xl mx-auto animate-slide-up delay-200">
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 text-primary rounded-full p-3">
                <BookOpen size={24} />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Complete Library</h3>
            <p className="text-sm text-muted-foreground">
              Access all JEE Mains papers from 2020-2025, organized by year and shift.
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 text-primary rounded-full p-3">
                <FileText size={24} />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Detailed Solutions</h3>
            <p className="text-sm text-muted-foreground">
              Step-by-step explanations for every question to build deep understanding.
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 text-primary rounded-full p-3">
                <Clock size={24} />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Timed Practice</h3>
            <p className="text-sm text-muted-foreground">
              Simulate real exam conditions with our timed practice mode and analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
