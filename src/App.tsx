import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Types
import { Project } from './types';

// Constants
// (Constants are now initialized directly within the store)

// Hooks
import { useAppStore } from './store';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { StatBoard } from './components/StatBoard';
import { PortfolioGallery } from './components/PortfolioGallery';
import { ProjectDetail } from './components/ProjectDetail';
import { Resume } from './components/Resume';
import { Footer, BackToTop } from './components/Common';

const App = () => {
  // --- View State ---
  const [view, setView] = useState<'home' | 'all-projects' | 'portfolio' | 'project-detail' | 'resume'>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // --- Content State (Zustand Store) ---
  const {
    isEditing, setIsEditing, isLoading, fetchError,
    heroContent, aboutContent, portfolioData, skillTabs, tools, resumeData, userImage,
    aiSkills, toolCards,
    updateContent, fetchAll
  } = useAppStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // --- Handlers ---
  const changeView = useCallback((newView: any) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavClick = useCallback((id: string) => {
    if (id === 'portfolio-view') {
      setView('portfolio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (id === 'resume-section') {
      setView('resume');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (view !== 'home') {
      setView('home');
      // Give time for layout transition before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [view]);

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
    setView('project-detail');
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, []);

  const handleSaveProjectContent = useCallback((content: string) => {
    if (!selectedProject) return;
    const newProjects = portfolioData.map((p: Project) => 
      p.id === selectedProject.id ? { ...p, content } : p
    );
    updateContent('portfolio_data', newProjects);
    setSelectedProject({ ...selectedProject, content });
  }, [selectedProject, portfolioData, updateContent]);

  // Sync scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <div className="min-h-screen bg-[#F9F7F7] text-[#112D4E] font-sans selection:bg-[#3F72AF]/20 selection:text-[#112D4E]">
      {/* Network fallback banner — only shown when server was unreachable at startup */}
      {fetchError && !isLoading && (
        <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          서버에서 데이터를 가져오지 못했습니다. 기본 데이터로 표시 중입니다.&nbsp;
          <button
            onClick={() => fetchAll()}
            className="underline font-semibold hover:text-amber-900 transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}
      <Navbar 
        setView={changeView} 
        currentView={view} 
        onNavClick={handleNavClick} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing} 
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#3F72AF]/20 border-t-[#3F72AF] rounded-full animate-spin"></div>
            <p className="text-[#3F72AF] font-bold tracking-widest text-sm uppercase">Loading Content...</p>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div key="home">
              <Hero 
                onNavClick={handleNavClick} 
                onToggleAdmin={() => setIsEditing(!isEditing)} 
                isEditing={isEditing} 
                content={heroContent} 
                setContent={(v) => updateContent('hero_content', v)} 
              />
              <About 
                isEditing={isEditing} 
                content={aboutContent} 
                setContent={(v) => updateContent('about_content', v)} 
                onMoreMeClick={() => setView('resume')}
              />
              <StatBoard 
                isEditing={isEditing}
                projects={portfolioData}
                setProjects={(v) => updateContent('portfolio_data', v)}
                skillTabs={skillTabs}
                tools={tools}
                onProjectClick={handleProjectClick}
                userImage={userImage}
                onImageUpload={(v) => updateContent('stat_board_user_image', v)}
                aiSkills={aiSkills}
                setAiSkills={(v: any) => updateContent('ai_skills', v)}
                toolCards={toolCards}
                setToolCards={(v: any) => updateContent('tool_cards', v)}
              />
            </motion.div>
          )}

          {view === 'portfolio' && (
            <PortfolioGallery 
              key="portfolio"
              onProjectClick={handleProjectClick}
              isEditing={isEditing}
              projects={portfolioData}
              setProjects={(v) => updateContent('portfolio_data', v)}
              setView={changeView}
            />
          )}

          {view === 'all-projects' && (
            <PortfolioGallery 
              onProjectClick={handleProjectClick} 
              isEditing={isEditing} 
              projects={portfolioData} 
              setProjects={(v) => updateContent('portfolio_data', v)} 
              setView={setView}
            />
          )}

          {view === 'project-detail' && selectedProject && (
            <ProjectDetail 
              key="project-detail"
              project={selectedProject} 
              onBack={() => setView('home')} 
              isEditing={isEditing}
              onSaveContent={handleSaveProjectContent}
            />
          )}

          {view === 'resume' && (
            <Resume 
              key={`resume-${isEditing}`}
              isEditing={isEditing} 
              data={resumeData} 
              setData={(v) => updateContent('resume_data', v)} 
            />
          )}
        </AnimatePresence>
      )}

      <Footer />
      <BackToTop />
    </div>
  );
};

export default App;
