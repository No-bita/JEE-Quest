
import React, { useEffect } from 'react';

// We need to declare the global MathJax object
declare global {
  interface Window {
    MathJax: any;
  }
}

interface MathRendererProps {
  math: string;
  display?: boolean;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ 
  math, 
  display = false,
  className = ""
}) => {
  useEffect(() => {
    // Load MathJax if it's not already loaded
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        window.MathJax = {
          tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true
          },
          options: {
            enableMenu: false
          }
        };
        
        // Initialize MathJax
        window.MathJax.typesetPromise?.();
      };
    } else if (window.MathJax.typesetPromise) {
      // If MathJax is already loaded, just render the current math
      window.MathJax.typesetPromise();
    }
  }, [math]);

  return display ? (
    <div className={`math-display ${className}`}>{`$$${math}$$`}</div>
  ) : (
    <span className={`math-inline ${className}`}>{`$${math}$`}</span>
  );
};

export default MathRenderer;
