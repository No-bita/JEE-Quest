
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  const handlePracticeClick = () => {
    navigate('/papers/jee2020-2/questions');
  };
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleBrowsePapers = () => {
    if (!isLoggedIn) {
      toast.info("Please sign in to browse papers");
      navigate('/signin');
    } else {
      navigate('/papers');
    }
  };
  
  return (
    <div className="relative overflow-hidden">
      <Helmet>
        <title>JEE Quest - Master JEE Mains with Past Papers</title>
        <meta name="description" content="Practice JEE Mains previous year questions (PYQs) with detailed solutions and smart AI tools for effective exam preparation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://jee-quest.vercel.app" />
        <meta property="og:title" content="JEE Quest - Master JEE Mains with Past Papers" />
        <meta property="og:description" content="Practice JEE Mains PYQs with detailed solutions and smart AI tools for effective exam preparation." />
        <meta property="og:url" content="https://jee-quest.vercel.app" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JEE Quest - Master JEE Mains with Past Papers" />
        <meta name="twitter:description" content="Practice JEE Mains PYQs with detailed solutions and smart AI tools for effective exam preparation." />
      </Helmet>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-gray-200/50 [mask-imageUrl:radial-gradient(ellipse_at_center,transparent_20%,white)]" />
      
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-24 page-container">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 py-1.5 px-4 text-sm animate-fade-in min-h-[32px]">
            JEE Mains 2020-2025
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            Master JEE Mains with 
            <br />
            <span className="text-primary">Past Papers</span>
          </h1>

          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in delay-75">
            Access JEE Mains PYQs with detailed solutions and smart AI tools for effective exam preparation.
          </p>
          
          <p className="text-sm text-primary italic mb-8 animate-fade-in delay-75">
            Crafted by IITians, for future IITians
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
              <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center">
                <BookOpen size={24} className="w-6 h-6" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Complete Library</h3>
            <p className="text-sm text-muted-foreground">
              Access JEE Mains papers (2020-2025), sorted by year and shift for easy navigation.
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
              Step-by-step answers to every question for better understanding and exam readiness.
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
              Simulate real exam conditions with timed practice and performance analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
