import React, { useState } from 'react';
import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Lightbulb, BarChart3, Linkedin } from 'lucide-react';
import { useNavigate, Routes, Route, Navigate, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';


// Home page component (the main content from the original Index component)
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Sample stats
  const stats = [
    { label: 'Past Papers', value: '25+' },
    { label: 'Questions', value: '1000+' },
    { label: 'Detailed Solutions', value: '100%' },
    { label: 'Students helped', value: '10k+' },
  ];

  const handleNavigate = (path: string) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (path === '/papers' && !isLoggedIn) {
      toast.info("Please sign in to browse papers");
      navigate('/signin');
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <Helmet>
        <title>JEE Quest | Crack JEE Mains with Past Papers & Smart Analytics</title>
        <meta name="description" content="Practice JEE Mains previous year questions (PYQs) with detailed solutions, analytics, and AI tools. Boost your exam preparation with JEE Quest." />
        <link rel="canonical" href="https://jee-quest.vercel.app/" />
        <meta property="og:title" content="JEE Quest | Crack JEE Mains with Past Papers & Smart Analytics" />
        <meta property="og:description" content="Practice JEE Mains previous year questions (PYQs) with detailed solutions, analytics, and AI tools. Boost your exam preparation with JEE Quest." />
        <meta property="og:url" content="https://jee-quest.vercel.app/" />
        <meta property="og:image" content="https://jee-quest.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JEE Quest | Crack JEE Mains with Past Papers & Smart Analytics" />
        <meta name="twitter:description" content="Practice JEE Mains previous year questions (PYQs) with detailed solutions, analytics, and AI tools. Boost your exam preparation with JEE Quest." />
        <meta name="twitter:image" content="https://jee-quest.vercel.app/og-image.png" />
      </Helmet>
      <main className="bg-[#FCFDF7] dark:bg-gray-900">
        <Hero />
        
        {/* Stats Section */}
        <section className="py-16 bg-[#FCFDF7] dark:bg-gray-900">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-6 w-full items-stretch">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-[#FCFDF7] dark:bg-gray-900 rounded-2xl border border-[#D1D5DB] flex flex-col items-center justify-center py-8 px-6 text-center flex-1"
                >
                  <div className="text-4xl text-[#26322C] dark:text-white mb-3">{stat.value}</div>
                  <div className="uppercase text-xs tracking-wider text-[#26322Cb3] dark:text-gray-300 mt-2">{stat.label}</div>
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
                The ultimate platform to ace JEE Mains with focused practice and in-depth analysis.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="rounded-3xl border border-[#FFD6C2] bg-[#FFF3EF] dark:bg-gray-800 shadow-lg px-10 py-10 flex flex-col items-center justify-center text-center min-h-[370px] transition-all duration-200 hover:shadow-2xl hover:-translate-y-1">
                <div className="flex justify-center mb-8">
                  <div className="bg-white dark:bg-gray-900 rounded-full shadow flex items-center justify-center w-16 h-16 mx-auto">
                    <BookOpen size={32} className="text-[#E86A33]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-6">Organized Library</h3>
                <p className="text-base text-[#5B4636] dark:text-gray-300 mb-6 leading-relaxed px-2">
                  Access the complete library of JEE Mains papers (2020-2025), sorted by year and shift for effortless navigation.
                </p>
                <button
                  onClick={() => handleNavigate('/papers')}
                  className="w-full rounded-full bg-[#FFD6C2] hover:bg-[#F3BFA7] text-[#E86A33] font-bold py-3 flex items-center justify-center gap-2 transition-colors duration-150 shadow-sm mt-2"
                >
                  View Papers <ArrowRight size={16} />
                </button>
              </div>
              
              <div className="rounded-3xl border border-[#FFD6C2] bg-[#FFF3EF] dark:bg-gray-800 shadow-lg px-10 py-10 flex flex-col items-center justify-center text-center min-h-[370px] transition-all duration-200 hover:shadow-2xl hover:-translate-y-1" style={{ animationDelay: '100ms' }}>
                <div className="flex justify-center mb-8">
                  <div className="bg-white dark:bg-gray-900 rounded-full shadow flex items-center justify-center w-16 h-16 mx-auto">
                    <Lightbulb size={32} className="text-[#E86A33]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-6">Smart Practice</h3>
                <p className="text-base text-[#5B4636] dark:text-gray-300 mb-6 leading-relaxed px-2">
                  Simulate real exam conditions with timed practice sessions, and question tracking to boost your readiness.
                </p>
                <button
                  onClick={() => handleNavigate('/practice')}
                  className="w-full rounded-full bg-[#FFD6C2] hover:bg-[#F3BFA7] text-[#E86A33] font-bold py-3 flex items-center justify-center gap-2 transition-colors duration-150 shadow-sm mt-2"
                >
                  Try Practice Mode <ArrowRight size={16} />
                </button>
              </div>
              
              <div className="rounded-3xl border border-[#FFD6C2] bg-[#FFF3EF] dark:bg-gray-800 shadow-lg px-10 py-10 flex flex-col items-center justify-center text-center min-h-[370px] transition-all duration-200 hover:shadow-2xl hover:-translate-y-1" style={{ animationDelay: '200ms' }}>
                <div className="flex justify-center mb-8">
                  <div className="bg-white dark:bg-gray-900 rounded-full shadow flex items-center justify-center w-16 h-16 mx-auto">
                    <BarChart3 size={32} className="text-[#E86A33]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-6">Detailed Analysis</h3>
                <p className="text-base text-[#5B4636] dark:text-gray-300 mb-6 leading-relaxed px-2">
                  Gain actionable insights with subject-wise performance reports for thorough exam preparation.
                </p>
                <button
                  onClick={() => handleNavigate('/analysis')}
                  className="w-full rounded-full bg-[#F5D0C5] hover:bg-[#F3BFA7] text-[#E86A33] font-bold py-2 flex items-center justify-center gap-2 transition-colors duration-150 shadow-sm mt-2"
                >
                  See Analysis <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/30 dark:from-gray-900 dark:to-gray-800">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">
              Ready to ace JEE Mains?
            </h2>
            <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Start your journey with PYQs and smart tools designed to elevate your preparation.
            </p>
            <div className="flex justify-center">
  <Button
    size="lg"
    className="gap-2 bg-[#BCF7BC] hover:bg-[#A8E6A3] text-black rounded-full shadow-md transition-colors duration-150 flex items-center justify-center font-normal"
    style={{ fontWeight: 400 }}
    onClick={() => handleNavigate('/practice')}
  >
    Get Started Now
    <ArrowRight size={20} />
  </Button>
</div>
          </div>
        </section>
        
        {/* Social Proof Section */}
        <section className="py-16 bg-secondary/20 dark:bg-gray-800">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-lg text-muted-foreground italic mb-4 dark:text-gray-300">
              "By IITians, for aspiring IITians"
            </p>
            <p className="text-sm text-muted-foreground mb-6 dark:text-gray-400">
              Need personalized guidance? Connect with us for expert advice on your JEE preparation.
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
      {/* Footer */}
      <footer className="w-full border-t bg-background dark:bg-gray-900 py-6 mt-8">
        <div className="container max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground dark:text-gray-300 gap-2">
          <span>&copy; {new Date().getFullYear()} JEEQuest. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

// Main Index component with routing setup
const Index: React.FC = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<Navigate to="/practice/jee2020-2" replace />} />
      </Routes>
    </>
  );
};

export default Index;