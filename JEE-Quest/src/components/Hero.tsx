
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
import { AnimatedPastPapers } from './HeroAnimations';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  const handlePracticeClick = () => {
    navigate('/practice/jee2020-2');
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
          
          <h1 className="text-4xl md:text-6xl tracking-tight mb-6 animate-fade-in font-inter font-semibold">
  Master JEE Mains with
  <br />
  <AnimatedPastPapers>Past Papers</AnimatedPastPapers>
</h1>

          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in delay-75">
            Access JEE Mains PYQs with detailed solutions and smart AI tools for effective exam preparation.
          </p>
          
          <p className="text-sm text-primary italic mb-8 animate-fade-in delay-75">
            Crafted by IITians, for future IITians
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in delay-100">
            <Button
  size="lg"
  className="w-full sm:w-auto gap-2 bg-[#B8F5B1] text-[#222] hover:bg-[#A7EBA0] hover:shadow-md flex items-center justify-center rounded-full"
  onClick={handleBrowsePapers}
>
  <BookOpen size={18} className="text-[#222]" />
  Browse Papers
  <ArrowRight size={18} className="ml-1 text-[#222]" />
</Button>
            <Button 
  size="lg"
  variant="outline"
  className="w-full sm:w-auto gap-2 flex items-center justify-center rounded-full"
  onClick={handlePracticeClick}
>
  <Clock size={18} />
  Practice Mode
</Button>
          </div>
        </div>
      </div>
      {/* New Feature Row - Minimal, Icon+Heading+Description style
      <div className="w-full bg-[#FAFBF6] py-10 px-2">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div className="rounded-2xl border border-[#C7D1C6] bg-[#FAFBF6] px-7 py-10 flex flex-col items-center text-center min-h-[200px] shadow-sm transition-transform hover:-translate-y-1">
            <BookOpen size={40} className="mb-4 text-[#22332B]" />
            <div className="font-semibold text-xl text-[#22332B] mb-2">Complete Library</div>
            <div className="text-sm md:text-base text-[#384B47] opacity-80 leading-tight">Access JEE Mains papers <span className="whitespace-nowrap">(2020-2025)</span>, sorted by year and shift for easy navigation.</div>
          </div>
          <div className="rounded-2xl border border-[#C7D1C6] bg-[#FAFBF6] px-7 py-10 flex flex-col items-center text-center min-h-[200px] shadow-sm transition-transform hover:-translate-y-1">
            <FileText size={40} className="mb-4 text-[#22332B]" />
            <div className="font-semibold text-xl text-[#22332B] mb-2">Detailed Solutions</div>
            <div className="text-base text-[#384B47] opacity-80 leading-tight">Step-by-step answers to every question for better understanding and exam readiness.</div>
          </div>
          <div className="rounded-2xl border border-[#C7D1C6] bg-[#FAFBF6] px-7 py-10 flex flex-col items-center text-center min-h-[200px] shadow-sm transition-transform hover:-translate-y-1">
            <Clock size={40} className="mb-4 text-[#22332B]" />
            <div className="font-semibold text-xl text-[#22332B] mb-2">Timed Practice</div>
            <div className="text-base text-[#384B47] opacity-80 leading-tight">Simulate real exam conditions with timed practice and performance analytics.</div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Hero;
