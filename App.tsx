import React, { useState, useEffect, useRef } from 'react';
import MatrixBackground from './components/MatrixBackground';
import ThreeBackground from './components/ThreeBackground';
import NavBar from './components/NavBar';
import SectionWrapper from './components/Section';
import GlitchText from './components/GlitchText';
import CyberButton from './components/CyberButton';
import CyberTicker from './components/CyberTicker';
import CustomCursor from './components/CustomCursor';
import CyberBoids from './components/CyberBoids';
import LoadingScreen from './components/LoadingScreen';
import { Section, Project } from './types';
import { PROJECTS, SKILLS, CAREER_HISTORY, MY_NAME, TAGLINE } from './constants';
import { ExternalLink, Github, Linkedin, X, Mail, Briefcase, Send, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.HERO);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [perfMode, setPerfMode] = useState<'HIGH' | 'LITE'>('HIGH');
  
  // Contact Form State
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');
  
  // Use a ref to the scroll container (main element)
  const mainRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setMounted(true);

    // Force scroll to top on initial load (Manual Scroll Restoration)
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Effect to handle scroll reset when mounted becomes true (Initial Load)
  useEffect(() => {
    if (mounted && mainRef.current) {
      // Force reset scroll immediately after mount
      mainRef.current.scrollTop = 0;
      window.scrollTo(0, 0);
    }
  }, [mounted]);

  // Intersection Observer Effect
  useEffect(() => {
    // Small delay to allow DOM to settle before observing
    const timeoutId = setTimeout(() => {
        const options = {
          // Set root to main element for correct scroll intersection inside the container
          root: mainRef.current,
          // Adjust rootMargin to trigger when the section is near the center of the view
          rootMargin: '-40% 0px -40% 0px', 
          threshold: 0
        };
    
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id as Section);
            }
          });
        }, options);
    
        // Observe all sections
        Object.values(Section).forEach((sectionId) => {
          const element = document.getElementById(sectionId);
          if (element && observerRef.current) {
            observerRef.current.observe(element);
          }
        });
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [mounted]);

  // Handle navigation to sections (scrolling)
  const handleNavigate = (section: Section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTogglePerfMode = () => {
    setPerfMode(prev => prev === 'HIGH' ? 'LITE' : 'HIGH');
  };

  // Handle Link Click for Projects
  const handleProjectClick = (e: React.MouseEvent, link: string) => {
    if (link.startsWith('http')) {
      // External links open in new tab via window.open to be explicit, or let default <a> tag handle it
      // Default behavior is allowed by wrapping in <a> tag
    } else {
      // Internal links (placeholders) do nothing to avoid 404
      e.preventDefault();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('SENDING');
    
    // Construct mailto link
    const subject = `[Portfolio Contact] Message from ${formState.name}`;
    const body = `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`;
    const mailtoUrl = `mailto:cgej0002@mail3.doshisha.ac.jp?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Simulate processing time for effect, then open email client
    setTimeout(() => {
      window.location.href = mailtoUrl;

      setFormStatus('SENT');
      setFormState({ name: '', email: '', message: '' });
      
      // Reset status after a delay
      setTimeout(() => {
        setFormStatus('IDLE');
      }, 3000);
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <div className="relative h-screen w-full bg-cyber-black text-gray-300 font-mono selection:bg-cyber-secondary selection:text-white overflow-hidden">
      
      {/* Loading Screen Overlay */}
      {isLoading && (
        <LoadingScreen 
          onSelectMode={(mode) => setPerfMode(mode)}
          onComplete={() => setIsLoading(false)} 
        />
      )}

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Background Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Base dark layer */}
         <div className="absolute inset-0 bg-cyber-black"></div>
         
         {perfMode === 'HIGH' && (
           <>
             {/* 3D Cyber World Background (Middle Layer) */}
             <div className="absolute inset-0 z-0">
                <ThreeBackground />
             </div>

             {/* Cyber Boids (Fish) Layer */}
             <div className="absolute inset-0 z-10">
                <CyberBoids />
             </div>

             {/* The Matrix Digital Rain (Overlay) */}
             {/* mix-blend-screen ensures black background of canvas is transparent */}
             <div className="absolute inset-0 z-10 opacity-40 mix-blend-screen">
                <MatrixBackground />
             </div>
           </>
         )}
         
         {perfMode === 'LITE' && (
           <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,#050505,#0a0a12)]">
             {/* Simple grid for Lite mode */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
           </div>
         )}
         
         {/* Vignette & Color Grading (Top Layer) */}
         <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.8)_100%)]"></div>
      </div>

      <div className="scanline z-50 pointer-events-none"></div>

      {/* Top Ticker */}
      <CyberTicker />
      
      {/* Navigation */}
      <NavBar 
        activeSection={activeSection} 
        onNavigate={handleNavigate} 
        currentMode={perfMode}
        onToggleMode={handleTogglePerfMode}
      />

      {/* Main Scroll Container */}
      <main ref={mainRef} className="relative z-10 h-full w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth md:pl-24 scrollbar-hide pt-8">
        
        {/* HERO SECTION */}
        <section id={Section.HERO} className="min-h-screen w-full flex items-center justify-center p-6 snap-start snap-always">
            <div className="max-w-4xl w-full">
              <div className="border-l-2 border-cyber-primary pl-6 md:pl-10 relative">
                 <div className="absolute -left-[9px] top-0 w-4 h-4 bg-cyber-black border-2 border-cyber-primary"></div>
                 <div className="absolute -left-[9px] bottom-0 w-4 h-4 bg-cyber-black border-2 border-cyber-primary"></div>
                 
                 <p className="text-cyber-primary font-bold tracking-[0.2em] mb-4 animate-pulse text-sm md:text-base">
                   システム初期化完了... ようこそ
                 </p>
                 
                 <div className="mb-6">
                   <GlitchText text={MY_NAME} as="h1" className="text-6xl md:text-8xl font-black text-white tracking-tighter" />
                 </div>
                 
                 <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl font-sans font-medium">
                   {TAGLINE}
                 </p>

                 <div className="flex flex-wrap gap-4 mb-8">
                   <CyberButton onClick={() => handleNavigate(Section.WORKS)}>
                     システム探索
                   </CyberButton>
                   <CyberButton variant="secondary" onClick={() => handleNavigate(Section.CONTACT)}>
                     コンタクト
                   </CyberButton>
                 </div>

                 {/* Social Links (Hero) */}
                 <div className="flex items-center gap-6">
                    <a 
                      href="https://github.com/AbeShohei/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-gray-500 hover:text-cyber-primary transition-all group"
                      aria-label="GitHub"
                    >
                      <Github size={28} />
                      <span className="text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">GITHUB</span>
                    </a>
                    <a 
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="flex items-center gap-2 text-gray-500 hover:text-cyber-primary transition-all group"
                      aria-label="X (Twitter)"
                    >
                      <X size={28} />
                      <span className="text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">X / TWITTER</span>
                    </a>
                 </div>
              </div>

              {/* Decorative Stats - Simplified */}
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 text-xs font-sans">
                 <div>
                   <p className="text-cyber-primary mb-1 font-mono">LOCATION</p>
                   <p>京都 // JP</p>
                 </div>
                 <div>
                   <p className="text-cyber-primary mb-1 font-mono">STATUS</p>
                   <p className="text-green-400">オンライン // 就活中</p>
                 </div>
              </div>
            </div>
        </section>

        {/* ABOUT SECTION */}
        <SectionWrapper id={Section.ABOUT} title="Data_Logs">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-10">
                {/* Profile Section */}
                <div>
                  <h3 className="text-2xl text-white mb-6 border-b border-gray-700 pb-2 font-sans font-bold">
                    <span className="text-cyber-secondary mr-2">#</span>
                    プロフィール概要
                  </h3>
                  <p className="leading-relaxed text-gray-400 mb-6 font-sans">
                    就活に悪戦苦闘中。いろんなWEB技術やセキュリティ分野に興味を持っています。
                    新しい技術スタックへの挑戦と、強固なシステム設計に関心があります。
                  </p>
                  
                  <div className="bg-black/50 p-4 border border-gray-800 font-mono text-sm mb-6 shadow-inner">
                    <div className="flex gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <p className="text-green-500">$ cat current_focus.txt</p>
                    <p className="text-gray-300 mt-2">
                      &gt; 経済学、情報学<br/>
                      &gt; セキュリティ分野<br/>
                      &gt; 簿記2級に挑戦中
                    </p>
                  </div>
                </div>

                {/* Skills Section */}
                <div>
                  <h3 className="text-2xl text-white mb-6 border-b border-gray-700 pb-2 font-sans font-bold">
                    <span className="text-cyber-secondary mr-2">#</span>
                    スキルマトリクス
                  </h3>
                  <div className="space-y-6">
                    {SKILLS.map((skillGroup, idx) => (
                      <div key={idx}>
                        <h4 className="text-cyber-primary text-sm tracking-widest mb-2 uppercase font-bold flex items-center gap-2">
                          <span className="w-2 h-2 bg-cyber-primary"></span>
                          {skillGroup.category}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {skillGroup.items.map((skill, sIdx) => (
                            <span key={sIdx} className="px-3 py-1 bg-cyber-primary/5 border border-cyber-primary/30 text-xs text-cyber-primary hover:bg-cyber-primary hover:text-black transition-colors cursor-crosshair">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* History / Timeline Section */}
              <div>
                 <h3 className="text-2xl text-white mb-6 border-b border-gray-700 pb-2 font-sans font-bold flex items-center gap-2">
                  <Briefcase size={20} className="text-cyber-secondary" />
                  <span className="text-cyber-secondary mr-2">#</span>
                  経歴ログ
                </h3>
                
                <div className="relative border-l border-cyber-dim ml-3 space-y-8 py-2">
                   {CAREER_HISTORY.map((item, idx) => (
                     <div key={idx} className="relative pl-8 group">
                       {/* Timeline Dot */}
                       <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-cyber-black border border-cyber-secondary rounded-full group-hover:bg-cyber-secondary transition-colors shadow-[0_0_5px_rgba(255,0,255,0.5)]"></div>
                       
                       {/* Content Card */}
                       <div className="relative bg-cyber-black/40 border border-gray-800 p-4 hover:border-cyber-secondary/50 transition-colors">
                          <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-cyber-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                             <h4 className="text-white font-bold tracking-wide">{item.title}</h4>
                             <span className="text-xs text-cyber-primary font-mono bg-cyber-primary/10 px-2 py-0.5 rounded">{item.year}</span>
                          </div>
                          <p className="text-sm text-gray-400 font-mono mb-2">{item.company}</p>
                          <p className="text-sm text-gray-500 font-sans leading-relaxed">
                            {item.description}
                          </p>
                       </div>
                     </div>
                   ))}
                   
                   {/* Bottom fade connector */}
                   <div className="absolute left-[-1px] bottom-0 w-[1px] h-10 bg-gradient-to-t from-transparent to-cyber-dim"></div>
                </div>
              </div>
            </div>
        </SectionWrapper>

        {/* WORKS SECTION */}
        <SectionWrapper id={Section.WORKS} title="Project_Index">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PROJECTS.map((project: Project) => (
                <a 
                  key={project.id}
                  href={project.link}
                  onClick={(e) => handleProjectClick(e, project.link || '#')}
                  target={project.link?.startsWith('http') ? '_blank' : undefined}
                  rel={project.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group relative bg-black border border-gray-800 hover:border-cyber-primary transition-colors duration-300 flex flex-col h-full cursor-pointer block"
                >
                  {/* Image Container with Scanline Overlay */}
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-cyber-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay"></div>
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 bg-cyber-black/80 px-2 py-1 text-[10px] text-cyber-primary border-t border-r border-cyber-primary z-20">
                      IMG_REF_{project.id}
                    </div>
                    {/* Status Indicator */}
                    <div className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold border z-20 ${
                      project.status === 'ONLINE' ? 'border-green-500 text-green-500 bg-green-500/10' :
                      project.status === 'OFFLINE' ? 'border-red-500 text-red-500 bg-red-500/10' :
                      'border-yellow-500 text-yellow-500 bg-yellow-500/10'
                    }`}>
                      {project.status}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 relative flex flex-col grow">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 font-sans grow">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] text-gray-400 border border-gray-800 px-1.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span 
                      className="inline-flex items-center gap-2 text-sm text-cyber-secondary group-hover:text-white transition-colors uppercase tracking-wider font-bold mt-auto"
                    >
                      EXECUTE <ExternalLink size={14} />
                    </span>
                    
                    {/* Decorative Corner lines */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gray-600 group-hover:border-cyber-primary transition-colors"></span>
                  </div>
                </a>
              ))}
            </div>
        </SectionWrapper>

        {/* CONTACT SECTION */}
        <SectionWrapper id={Section.CONTACT} title="Contact_Form">
             <div className="max-w-2xl mx-auto">
               <div className="mb-10 text-center">
                 <div className="w-16 h-16 mx-auto rounded-full bg-cyber-dim border border-cyber-secondary flex items-center justify-center mb-4 shadow-[0_0_10px_rgba(255,0,255,0.3)]">
                   <Mail size={32} className="text-cyber-secondary" />
                 </div>
                 <p className="text-xl text-gray-300 font-sans">
                   ご連絡お待ちしております。
                 </p>
                 <a href="mailto:cgej0002@mail3.doshisha.ac.jp" className="text-cyber-primary hover:text-white transition-colors mt-2 block font-mono text-sm">
                   cgej0002@mail3.doshisha.ac.jp
                 </a>
               </div>

               {/* Contact Form */}
               <form onSubmit={handleFormSubmit} className="bg-cyber-dark/30 p-6 md:p-8 border border-gray-800 relative group backdrop-blur-sm mb-12">
                  {/* Decorators */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-primary"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-primary"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-primary"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-primary"></div>

                  <div className="mb-6">
                      <label className="block text-xs font-mono text-cyber-primary mb-2 uppercase tracking-wider">お名前 (Name)</label>
                      <input 
                          type="text" 
                          value={formState.name}
                          onChange={(e) => setFormState({...formState, name: e.target.value})}
                          required
                          disabled={formStatus !== 'IDLE'}
                          className="w-full bg-black/50 border border-gray-700 p-3 text-gray-200 focus:border-cyber-primary focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] focus:outline-none transition-all placeholder-gray-700"
                          placeholder="お名前を入力"
                      />
                  </div>
                  
                  <div className="mb-6">
                      <label className="block text-xs font-mono text-cyber-primary mb-2 uppercase tracking-wider">メールアドレス (Email)</label>
                      <input 
                          type="email" 
                          value={formState.email}
                          onChange={(e) => setFormState({...formState, email: e.target.value})}
                          required
                          disabled={formStatus !== 'IDLE'}
                          className="w-full bg-black/50 border border-gray-700 p-3 text-gray-200 focus:border-cyber-primary focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] focus:outline-none transition-all placeholder-gray-700"
                          placeholder="example@email.com"
                      />
                  </div>

                  <div className="mb-8">
                      <label className="block text-xs font-mono text-cyber-primary mb-2 uppercase tracking-wider">お問い合わせ内容 (Message)</label>
                      <textarea 
                          value={formState.message}
                          onChange={(e) => setFormState({...formState, message: e.target.value})}
                          required
                          disabled={formStatus !== 'IDLE'}
                          rows={5}
                          className="w-full bg-black/50 border border-gray-700 p-3 text-gray-200 focus:border-cyber-primary focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] focus:outline-none transition-all resize-none placeholder-gray-700"
                          placeholder="メッセージを入力してください..."
                      />
                  </div>

                  <div className="flex justify-center">
                      <CyberButton type="submit" disabled={formStatus === 'SENDING' || formStatus === 'SENT'}>
                          {formStatus === 'IDLE' && <span className="flex items-center gap-2">メーラーを起動 <Send size={16} /></span>}
                          {formStatus === 'SENDING' && <span className="animate-pulse">起動中...</span>}
                          {formStatus === 'SENT' && <span className="flex items-center gap-2 text-green-400">起動完了 <CheckCircle size={16} /></span>}
                      </CyberButton>
                  </div>
               </form>

               <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                 <a href="https://github.com/AbeShohei/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 border border-transparent hover:border-gray-800 hover:bg-white/5 rounded transition-all group">
                   <Github className="text-gray-500 group-hover:text-white transition-colors" />
                   <span className="text-[10px] text-gray-600 group-hover:text-cyber-primary">GITHUB</span>
                 </a>
                 <a 
                   href="#" 
                   onClick={(e) => e.preventDefault()}
                   className="flex flex-col items-center gap-2 p-4 border border-transparent hover:border-gray-800 hover:bg-white/5 rounded transition-all group"
                 >
                   <Linkedin className="text-gray-500 group-hover:text-white transition-colors" />
                   <span className="text-[10px] text-gray-600 group-hover:text-cyber-primary">LINKEDIN</span>
                 </a>
                 <a 
                   href="#"
                   onClick={(e) => e.preventDefault()}
                   className="flex flex-col items-center gap-2 p-4 border border-transparent hover:border-gray-800 hover:bg-white/5 rounded transition-all group"
                 >
                   <X className="text-gray-500 group-hover:text-white transition-colors" />
                   <span className="text-[10px] text-gray-600 group-hover:text-cyber-primary">X (TWITTER)</span>
                 </a>
               </div>
             </div>
        </SectionWrapper>

        {/* Global Footer Elements */}
        <footer className="w-full flex justify-center pb-8 opacity-50 text-[10px] font-mono md:hidden">
          <div className="flex flex-col items-center gap-1">
             <span>SYS.VER.2.4.0_JP</span>
          </div>
        </footer>
        
      </main>

      {/* Desktop Footer (Fixed) */}
      <footer className="fixed bottom-4 right-4 text-[10px] text-gray-600 z-40 hidden md:block">
        <div className="flex flex-col items-end gap-1">
           <span>SYS.VER.2.4.0_JP</span>
           <span>SECURE_CONNECTION</span>
        </div>
      </footer>
    </div>
  );
};

export default App;