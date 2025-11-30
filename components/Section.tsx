import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionProps> = ({ id, title, className = '', children }) => {
  return (
    <section 
      id={id} 
      className={`relative min-h-screen w-full flex flex-col justify-center py-20 px-4 md:px-12 snap-start snap-always ${className}`}
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Decorative Header */}
        <div className="mb-8 md:mb-12 relative">
          <div className="flex items-center gap-4 text-cyber-primary opacity-80 mb-2">
             <span className="text-xs">SYSTEM://{id.toUpperCase()}</span>
             <div className="h-px bg-cyber-primary flex-grow opacity-30"></div>
             <span className="text-xs">V.1.0.4</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-mono uppercase tracking-tighter text-white">
            <span className="text-cyber-primary mr-2">&gt;</span>
            {title}
            <span className="animate-pulse">_</span>
          </h2>
        </div>

        {/* Content Window */}
        <div className="relative border border-cyber-dim bg-cyber-dark/80 backdrop-blur-sm p-6 md:p-10 shadow-2xl">
          {/* Decorative corner markers */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyber-primary"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyber-primary"></div>
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyber-primary"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyber-primary"></div>

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>

      {/* Background decoration elements */}
      <div className="absolute top-1/2 -right-20 w-40 h-40 border border-cyber-primary/10 rounded-full animate-spin-slow pointer-events-none hidden md:block"></div>
    </section>
  );
};

export default SectionWrapper;