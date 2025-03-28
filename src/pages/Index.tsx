
import React from 'react';
import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Lightbulb, BarChart3, Linkedin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  // Sample stats
  const stats = [
    { label: 'Past Papers', value: '25+' },
    { label: 'Questions', value: '1000+' },
    { label: 'Detailed Solutions', value: '100%' },
    { label: 'Students Helped', value: '10k+' },
  ];
  
  const handleNavigate = (path: string) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (path === '/papers' && !isLoggedIn) {
      toast.info("Please sign in to browse papers");
      navigate('/signin');
    } else if (path === '/practice') {
      // Navigate to sample paper
      navigate('/practice/jee2022-1');
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <NavBar />
      <main>
        <Hero />
        
        {/* Stats Section */}
        <section className="py-20 bg-secondary/50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-20">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why JEE Quest?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We've designed the most comprehensive platform to help you ace your JEE Mains with focused practice and analysis.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="glass-card rounded-xl p-8 text-center animate-fade-in">
                <div className="flex justify-center mb-6">
                  <div className="bg-primary/10 text-primary rounded-full p-4">
                    <BookOpen size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Organized Library</h3>
                <p className="text-muted-foreground mb-4">
                  Every paper is carefully organized by year and shift, making it easy to find exactly what you need.
                </p>
                <Button 
                  variant="link" 
                  className="text-primary gap-1" 
                  onClick={() => handleNavigate('/papers')}
                >
                  View Papers <ArrowRight size={14} />
                </Button>
              </div>
              
              <div className="glass-card rounded-xl p-8 text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex justify-center mb-6">
                  <div className="bg-primary/10 text-primary rounded-full p-4">
                    <Lightbulb size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Practice</h3>
                <p className="text-muted-foreground mb-4">
                  Our practice mode lets you simulate real exam conditions with timed sessions and question tracking.
                </p>
                <Button 
                  variant="link" 
                  className="text-primary gap-1" 
                  onClick={() => handleNavigate('/practice')}
                >
                  Try Practice Mode <ArrowRight size={14} />
                </Button>
              </div>
              
              <div className="glass-card rounded-xl p-8 text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="flex justify-center mb-6">
                  <div className="bg-primary/10 text-primary rounded-full p-4">
                    <BarChart3 size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Detailed Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Get insights into your performance with subject-wise and topic-wise analysis to focus your preparation.
                </p>
                <Button 
                  variant="link" 
                  className="text-primary gap-1" 
                  onClick={() => handleNavigate('/analysis')}
                >
                  See Analysis <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to ace your JEE Mains?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Start practicing with our comprehensive collection of past papers and take your preparation to the next level.
            </p>
            <Button size="lg" className="gap-2" onClick={() => handleNavigate('/papers')}>
              Get Started Now
              <ArrowRight size={16} />
            </Button>
          </div>
        </section>
        
        {/* Social Proof Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-lg text-muted-foreground italic mb-4">
              "Created by IITians for today's JEE aspirants and tomorrow's IITians"
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Need guidance? Reach out for personalized advice on your JEE preparation journey.
            </p>
            <a 
              href="https://www.linkedin.com/in/your-linkedin-profile" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Linkedin size={20} />
              Connect on LinkedIn
            </a>
          </div>
        </section>
      </main>
    </>
  );
};

export default Index;
