import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, as = 'span', className = '' }) => {
  const [displayClass, setDisplayClass] = useState('');
  
  // Random glitch effect trigger
  useEffect(() => {
    const triggerGlitch = () => {
      setDisplayClass('skew-x-12 translate-x-1');
      setTimeout(() => setDisplayClass('-skew-x-12 -translate-x-1 text-cyber-secondary'), 50);
      setTimeout(() => setDisplayClass('skew-x-6 translate-x-0.5'), 100);
      setTimeout(() => setDisplayClass(''), 150);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        triggerGlitch();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const Component = as as any;

  return (
    <Component className={`relative inline-block transition-transform duration-75 ${displayClass} ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0.5 -z-10 w-full h-full text-cyber-secondary opacity-70 animate-pulse mix-blend-screen" style={{clipPath: 'inset(10% 0 80% 0)'}}>
        {text}
      </span>
      <span className="absolute top-0 -left-0.5 -z-10 w-full h-full text-cyber-primary opacity-70 animate-pulse mix-blend-screen" style={{clipPath: 'inset(80% 0 10% 0)'}}>
        {text}
      </span>
    </Component>
  );
};

export default GlitchText;