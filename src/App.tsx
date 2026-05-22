import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Types
import { Project } from './types';

// Hooks
import { useAppStore } from './store';
import { useSiteId } from './contexts/SiteContext';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { StatBoard } from './components/StatBoard';
import { PortfolioGallery } from './components/PortfolioGallery';
import { ProjectDetail } from './components/ProjectDetail';
import { Resume } from './components/Resume';
import { Footer, BackToTop } from './components/Common';
import { SiteManager } from './components/SiteManager';

const App = () => {
  // --- View State ---
  const [view, setView] = useState<'home' | 'all-projects' | 'portfolio' | 'project-detail' | 'resume'>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [prevView, setPrevView] = useState<string>('home');
  const [isSiteManagerOpen, setIsSiteManagerOpen] = useState(false);

  // --- Site ID from URL ---
  const initialSiteId = useSiteId();

  // --- Content State (Zustand Store) ---
  const {
    isEditing, setIsEditing, isLoading, fetchError,
    heroContent, aboutContent, portfolioData, resumeData, userImage,
    aiSkills, toolCards, portfolioDescription, portfolioCategories,
    updateContent, fetchAll
  } = useAppStore();

  useEffect(() => {
    fetchAll(initialSiteId);
  }, []);

  // --- Parse ?project= query string for direct landing ---
  useEffect(() => {
    if (isLoading || !portfolioData || portfolioData.length === 0) return;
    const searchParams = new URLSearchParams(window.location.search);
    const projectId = searchParams.get('project');
    const viewParam = searchParams.get('view');
    
    if (projectId) {
      const proj = portfolioData.find((p: Project) => p.id === projectId);
      if (proj) {
        setSelectedProject(proj);
        setPrevView('portfolio'); // Go back to portfolio gallery
        setView('project-detail');
        // Clear the parameter without reloading so it doesn't trigger again on refresh
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path: newUrl}, '', newUrl);
      }
    } else if (viewParam === 'portfolio') {
        setView('portfolio');
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path: newUrl}, '', newUrl);
    }
  }, [isLoading, portfolioData]);

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
      const checkAndScroll = (attempts = 0) => {
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100); // Allow browser a frame to paint
        } else if (attempts < 15) {
          setTimeout(() => checkAndScroll(attempts + 1), 100);
        }
      };
      setTimeout(() => checkAndScroll(0), 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [view]);

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
    setPrevView(view);
    setView('project-detail');
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [view]);

  const handleSaveProjectContent = useCallback((content: string) => {
    if (!selectedProject) return;
    const newProjects = portfolioData.map((p: Project) => 
      p.id === selectedProject.id ? { ...p, content } : p
    );
    updateContent('portfolio_data', newProjects);
    setSelectedProject({ ...selectedProject, content });
  }, [selectedProject, portfolioData, updateContent]);

  const handleUpdateProject = useCallback((updatedProject: Project) => {
    const newProjects = portfolioData.map((p: Project) => 
      p.id === updatedProject.id ? updatedProject : p
    );
    updateContent('portfolio_data', newProjects);
    setSelectedProject(updatedProject);
  }, [portfolioData, updateContent]);

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

      {/* Floating HTML Export Button for Portfolio Gallery */}
      {view === 'portfolio' && isEditing && (
        <button
          onClick={() => {
            import('./utils/html-generator').then(({ generatePortfolioHtml }) => {
              const activeProjects = (portfolioData || []).filter(p => (portfolioCategories || []).includes(p.category));
              const htmlContent = generatePortfolioHtml(activeProjects, portfolioCategories || [], portfolioDescription || '');
              const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'portfolio-slide.html';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            });
          }}
          className="fixed bottom-8 right-8 z-[9999] flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-[#3F72AF] to-[#112D4E] text-white text-base font-black rounded-full shadow-2xl hover:scale-105 transition-transform border-4 border-white print:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          포트폴리오 추출
        </button>
      )}
      <Navbar 
        setView={changeView} 
        currentView={view} 
        onNavClick={handleNavClick} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing}
        onOpenSiteManager={() => setIsSiteManagerOpen(true)}
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
              description={portfolioDescription}
              setDescription={(v) => updateContent('portfolio_description', v)}
              categories={portfolioCategories}
              setCategories={(v) => updateContent('portfolio_categories', v)}
              setView={changeView}
            />
          )}

          {view === 'all-projects' && (
            <PortfolioGallery 
              onProjectClick={handleProjectClick} 
              isEditing={isEditing} 
              projects={portfolioData} 
              setProjects={(v) => updateContent('portfolio_data', v)} 
              description={portfolioDescription}
              setDescription={(v) => updateContent('portfolio_description', v)}
              categories={portfolioCategories}
              setCategories={(v) => updateContent('portfolio_categories', v)}
              setView={setView}
            />
          )}

          {view === 'project-detail' && selectedProject && (
            <ProjectDetail 
              key="project-detail"
              project={selectedProject} 
              onBack={() => changeView(prevView)} 
              isEditing={isEditing}
              onSaveContent={handleSaveProjectContent}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {view === 'resume' && (
            <Resume 
              key={`resume-${isEditing}`}
              isEditing={isEditing} 
              data={resumeData} 
              setData={(v) => updateContent('resume_data', v)} 
              onNavClick={handleNavClick}
            />
          )}
        </AnimatePresence>
      )}

      <Footer />
      <BackToTop />

      {/* Site Manager Modal (admin only) */}
      {isEditing && (
        <SiteManager
          isOpen={isSiteManagerOpen}
          onClose={() => setIsSiteManagerOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
