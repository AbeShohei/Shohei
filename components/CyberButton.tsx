import React from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

const CyberButton: React.FC<CyberButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = "relative px-6 py-3 font-mono font-bold uppercase tracking-widest transition-all duration-300 group overflow-hidden border";
  
  const variants = {
    primary: "border-cyber-primary text-cyber-primary hover:bg-cyber-primary hover:text-cyber-black hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]",
    secondary: "border-cyber-secondary text-cyber-secondary hover:bg-cyber-secondary hover:text-white hover:shadow-[0_0_20px_rgba(255,0,255,0.5)]",
    danger: "border-red-500 text-red-500 hover:bg-red-500 hover:text-black hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Corner accents */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-100 transition-all duration-300 group-hover:w-full group-hover:h-full"></span>
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-100 transition-all duration-300 group-hover:w-full group-hover:h-full"></span>
      
      {/* Scanline background on hover */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 animate-[pulse_2s_infinite]"></div>
    </button>
  );
};

export default CyberButton;