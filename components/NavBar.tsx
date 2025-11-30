import React from 'react';
import { Section, NavItem } from '../types';
import { Terminal, User, Code, Mail } from 'lucide-react';

interface NavBarProps {
  activeSection: Section;
  onNavigate: (section: Section) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: Section.HERO, label: 'ホーム', icon: <Terminal size={18} /> },
  { id: Section.ABOUT, label: '情報', icon: <User size={18} /> },
  { id: Section.WORKS, label: '実績', icon: <Code size={18} /> },
  { id: Section.CONTACT, label: '通信', icon: <Mail size={18} /> },
];

const NavBar: React.FC<NavBarProps> = ({ activeSection, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 md:top-0 md:bottom-auto md:h-screen md:w-24 border-t md:border-t-0 md:border-r border-cyber-primary/30 bg-cyber-black/90 backdrop-blur-md">
      <div className="flex md:flex-col items-center justify-between md:justify-center h-full px-4 md:py-12 md:gap-12 w-full">
        
        {/* Logo / Brand (Mobile Hidden, Desktop Top) */}
        <div className="hidden md:flex flex-col items-center gap-2 mb-auto opacity-80">
          <div className="w-10 h-10 border border-cyber-secondary rotate-45 flex items-center justify-center">
            <div className="w-6 h-6 bg-cyber-secondary/20 rotate-45"></div>
          </div>
          <span className="text-[10px] tracking-widest text-cyber-secondary mt-2">SYS</span>
        </div>

        {/* Links */}
        <ul className="flex md:flex-col justify-around w-full gap-2 md:gap-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="relative group w-full md:w-auto">
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center gap-1 p-2 w-full md:w-16 md:h-16 transition-all duration-300 
                  ${activeSection === item.id 
                    ? 'text-cyber-primary bg-cyber-primary/10 border-t-2 md:border-t-0 md:border-l-2 border-cyber-primary' 
                    : 'text-gray-500 hover:text-gray-100 hover:bg-white/5'}`}
              >
                <span className={`transition-transform duration-300 ${activeSection === item.id ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-xs md:text-[10px] font-bold font-sans tracking-wider">{item.label}</span>
              </button>
              
              {/* Tooltip Decoration */}
              <div className={`absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-cyber-primary text-cyber-black text-xs font-bold px-2 py-1 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none`}>
                <span className="mr-1">&lt;</span>
                {item.label}_MODULE
                <span className="ml-1">/&gt;</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Status (Mobile Hidden) */}
        <div className="hidden md:flex flex-col items-center gap-1 mt-auto text-[9px] text-gray-500">
          <div className="w-1 h-12 bg-gray-800 rounded overflow-hidden relative">
            <div className="absolute bottom-0 w-full bg-green-500 animate-[pulse_3s_infinite]" style={{height: '70%'}}></div>
          </div>
          <span>MEM</span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;