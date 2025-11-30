import React, { useState, useEffect } from 'react';
import { Zap, ZapOff, Cpu } from 'lucide-react';

const SYSTEM_LOGS = [
  "INITIALIZING KERNEL...",
  "LOADING NEURAL NETWORKS...",
  "BYPASSING SECURITY PROTOCOLS...",
  "OPTIMIZING RENDER ENGINE...",
  "CONNECTING TO MAIN FRAME...",
  "DECRYPTING USER DATA...",
  "ESTABLISHING SECURE CONNECTION...",
  "ACCESS GRANTED."
];

interface LoadingScreenProps {
  onComplete: () => void;
  onSelectMode: (mode: 'HIGH' | 'LITE') => void;
}

type LoadingPhase = 'SELECT' | 'LOADING' | 'EXIT';

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, onSelectMode }) => {
  const [phase, setPhase] = useState<LoadingPhase>('SELECT');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Handle Mode Selection
  const handleModeSelect = (mode: 'HIGH' | 'LITE') => {
    onSelectMode(mode);
    setPhase('LOADING');
  };

  useEffect(() => {
    if (phase !== 'LOADING') return;

    // Loading simulation
    const totalDuration = 2000; // 2 seconds
    const intervalTime = 40;
    const steps = totalDuration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      // Non-linear progress for realism
      const rawProgress = (currentStep / steps);
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3); // Ease out cubic
      const newProgress = Math.min(Math.round(easedProgress * 100), 100);
      
      setProgress(newProgress);

      // Randomly add logs
      if (Math.random() > 0.6) {
        const randomLog = SYSTEM_LOGS[Math.floor(Math.random() * SYSTEM_LOGS.length)];
        const hex = Math.random().toString(16).substr(2, 4).toUpperCase();
        setLogs(prev => [...prev, `[0x${hex}] ${randomLog}`].slice(-6));
      }

      if (currentStep >= steps) {
        clearInterval(timer);
        
        // Start exit sequence
        setTimeout(() => {
            setPhase('EXIT');
            // Wait for shutter animation to finish before unmounting
            setTimeout(onComplete, 800); 
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [phase, onComplete]);

  const isExit = phase === 'EXIT';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center font-mono pointer-events-auto select-none">
        
        {/* Top Shutter */}
        <div className={`absolute top-0 left-0 w-full h-1/2 bg-cyber-black border-b border-cyber-primary/30 transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] z-0 ${isExit ? '-translate-y-full' : 'translate-y-0'}`}>
            <div className="absolute bottom-0 right-4 text-cyber-primary/20 text-[10px] mb-2">SYSTEM_BOOT_SEQUENCE_V2.0</div>
        </div>
        
        {/* Bottom Shutter */}
        <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-cyber-black border-t border-cyber-primary/30 transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] z-0 ${isExit ? 'translate-y-full' : 'translate-y-0'}`}>
             <div className="absolute top-0 left-4 text-cyber-primary/20 text-[10px] mt-2">LOADING_MODULES...</div>
        </div>

        {/* Center Content */}
        <div className={`relative z-10 flex flex-col items-center w-full max-w-md p-6 transition-all duration-500 ${isExit ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 scale-100'}`}>
            
            {/* Logo / Title */}
            <div className="mb-8 relative text-center">
                <div className="text-4xl md:text-5xl font-black text-white tracking-tighter animate-pulse">
                    SYSTEM <span className="text-cyber-primary">ONLINE</span>
                </div>
                <div className="absolute -inset-1 text-cyber-secondary blur opacity-30 animate-pulse">
                    SYSTEM ONLINE
                </div>
            </div>

            {/* SELECTION PHASE */}
            {phase === 'SELECT' && (
              <div className="w-full flex flex-col gap-4 animate-[fadeIn_0.5s_ease-out]">
                <p className="text-center text-cyber-primary text-xs tracking-widest mb-2 border-b border-cyber-primary/30 pb-2">
                  SELECT GRAPHICS MODE
                </p>
                
                <button 
                  onClick={() => handleModeSelect('HIGH')}
                  className="group relative bg-black/50 border border-cyber-primary p-4 hover:bg-cyber-primary/10 transition-all duration-300 flex items-center gap-4 text-left"
                >
                  <div className="p-2 bg-cyber-primary/10 rounded-full group-hover:bg-cyber-primary/20 transition-colors">
                    <Zap className="text-cyber-primary w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-white font-bold tracking-wider group-hover:text-cyber-primary transition-colors">FULL DIVE</div>
                    <div className="text-[10px] text-gray-500">Enable 3D, Particles, Matrix Rain (High GPU)</div>
                  </div>
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyber-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <button 
                  onClick={() => handleModeSelect('LITE')}
                  className="group relative bg-black/50 border border-gray-700 p-4 hover:border-cyber-secondary hover:bg-cyber-secondary/5 transition-all duration-300 flex items-center gap-4 text-left"
                >
                  <div className="p-2 bg-gray-800 rounded-full group-hover:bg-cyber-secondary/20 transition-colors">
                    <ZapOff className="text-gray-400 group-hover:text-cyber-secondary w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-gray-300 font-bold tracking-wider group-hover:text-cyber-secondary transition-colors">LITE MODE</div>
                    <div className="text-[10px] text-gray-500">Static Background, Minimal Effects (Battery Saver)</div>
                  </div>
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyber-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            )}

            {/* LOADING PHASE */}
            {(phase === 'LOADING' || phase === 'EXIT') && (
              <div className="w-full animate-[fadeIn_0.5s_ease-out]">
                {/* Progress Bar Container */}
                <div className="w-full h-1.5 bg-gray-900 border border-gray-800 mb-2 relative overflow-hidden rounded-sm">
                    <div 
                        className="h-full bg-cyber-primary shadow-[0_0_15px_#00f3ff] relative" 
                        style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
                    >
                        <div className="absolute top-0 right-0 h-full w-1 bg-white animate-pulse"></div>
                    </div>
                </div>
                
                <div className="w-full flex justify-between text-xs mb-8 text-cyber-primary font-bold">
                    <span className="animate-pulse">PROCESSING DATA...</span>
                    <span>{progress}%</span>
                </div>

                {/* Logs Console */}
                <div className="w-full h-32 overflow-hidden text-[10px] md:text-xs text-left border-l-2 border-cyber-secondary/50 pl-3 bg-black/20 backdrop-blur-sm p-2 font-mono">
                    {logs.map((log, i) => (
                        <div key={i} className="mb-1 text-green-500/80 truncate animate-[fadeIn_0.2s_ease-out]">
                            <span className="text-gray-600 mr-2">&gt;</span>
                            {log}
                        </div>
                    ))}
                </div>
              </div>
            )}
        </div>
    </div>
  );
};

export default LoadingScreen;