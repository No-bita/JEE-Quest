import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BannerProps {
  text: string;
  linkUrl: string;
  className?: string;
}

const Banner: React.FC<BannerProps> = ({ text, linkUrl, className }) => {
  const handleClick = () => {
    window.open(linkUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={handleClick}
      className={cn(
        "fixed bottom-0 left-0 right-0 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white cursor-pointer z-50 overflow-hidden",
        className
      )}
    >
      <div className="animate-marquee whitespace-nowrap flex items-center justify-center">
        {Array(5) // Dynamically repeat the content 5 times
            .fill(null)
            .map((_, index) => (
                <React.Fragment key={index}>
                <span className="mx-4 text-sm sm:text-base font-medium">{text}</span>
                <ExternalLink size={16} className="mr-4" />
                </React.Fragment>
            ))}
      </div>
    </div>
  );
};

export default Banner;