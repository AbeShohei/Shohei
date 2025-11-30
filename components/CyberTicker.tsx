import React from 'react';
import { TICKER_TEXTS } from '../constants';

const CyberTicker: React.FC = () => {
  // Combine texts with a separator
  const content = TICKER_TEXTS.join(' +++ ');

  return (
    <div className="fixed top-0 left-0 w-full h-8 bg-cyber-black border-b border-cyber-primary/30 z-[60] overflow-hidden flex items-center pointer-events-none select-none">
      {/* Background scanline effect specific to ticker */}
      <div className="absolute inset-0 bg-cyber-primary/5"></div>
      
      {/* Label */}
      <div className="absolute left-0 top-0 h-full bg-cyber-primary/20 backdrop-blur-sm px-3 flex items-center z-10 border-r border-cyber-primary/50">
        <span className="text-[10px] font-bold text-cyber-primary animate-pulse">LIVE_FEED</span>
      </div>

      {/* Scrolling Content Container */}
      <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] ml-24">
        <div className="flex items-center gap-8 pr-8">
          {TICKER_TEXTS.map((text, index) => (
             <span key={`1-${index}`} className="text-xs font-mono text-gray-400 flex items-center gap-2">
               <span className="text-cyber-secondary">»</span> {text}
             </span>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex items-center gap-8 pr-8">
          {TICKER_TEXTS.map((text, index) => (
             <span key={`2-${index}`} className="text-xs font-mono text-gray-400 flex items-center gap-2">
               <span className="text-cyber-secondary">»</span> {text}
             </span>
          ))}
        </div>
      </div>

      {/* CSS for marquee animation defined inline for simplicity or use tailwind config */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default CyberTicker;