import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Use refs for smooth animation of the trailing circle
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const previousPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' ||
        target.closest('a') || 
        target.closest('button');
      
      setIsHovering(!!isClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Animation loop for the trailing effect (Outer Circle)
  useEffect(() => {
    const animateTrailer = () => {
      if (trailerRef.current) {
        // Linear interpolation (Lerp) for smooth delay
        const lerpFactor = 0.15;
        previousPosition.current.x += (position.x - previousPosition.current.x) * lerpFactor;
        previousPosition.current.y += (position.y - previousPosition.current.y) * lerpFactor;

        trailerRef.current.style.transform = `translate(${previousPosition.current.x}px, ${previousPosition.current.y}px)`;
      }
      requestRef.current = requestAnimationFrame(animateTrailer);
    };

    requestRef.current = requestAnimationFrame(animateTrailer);
    return () => cancelAnimationFrame(requestRef.current);
  }, [position]);

  return (
    <>
      {/* Main Cursor (Exact Position) */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {/* Crosshair Center */}
        <div className={`relative -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out
          ${isHovering ? 'scale-150' : 'scale-100'}
          ${isClicking ? 'scale-75' : ''}
        `}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <circle cx="12" cy="12" r="2" fill="#00f3ff" />
             <line x1="12" y1="4" x2="12" y2="8" stroke="#00f3ff" strokeWidth="2" />
             <line x1="12" y1="16" x2="12" y2="20" stroke="#00f3ff" strokeWidth="2" />
             <line x1="4" y1="12" x2="8" y2="12" stroke="#00f3ff" strokeWidth="2" />
             <line x1="16" y1="12" x2="20" y2="12" stroke="#00f3ff" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Trailing Cursor (Outer Ring) */}
      <div 
        ref={trailerRef}
        className="fixed top-0 left-0 pointer-events-none z-[99] mix-blend-screen"
        style={{
          willChange: 'transform'
        }}
      >
        <div className={`relative -translate-x-1/2 -translate-y-1/2 border border-cyber-secondary rounded-full transition-all duration-300
          ${isHovering ? 'w-12 h-12 border-dashed border-2 opacity-80 rotate-90' : 'w-8 h-8 opacity-50'}
          ${isClicking ? 'w-6 h-6 bg-cyber-secondary/30' : ''}
        `}></div>
        
        {/* Connecting Line (Optional decorator) */}
        {isHovering && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-cyber-secondary animate-spin"></div>
        )}
      </div>
    </>
  );
};

export default CustomCursor;
