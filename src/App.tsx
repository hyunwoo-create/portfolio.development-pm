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
import { Footer, BackToTop, ImageModal } from './components/Common';

const App = () => {
  // --- View State ---
  const [view, setView] = useState<'home' | 'all-projects' | 'portfolio' | 'project-detail' | 'resume'>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // --- Content State (Zustand Store) ---
  const {
    isEditing, setIsEditing, isLoading,
    heroContent, aboutContent, portfolioData, skillTabs, tools, gameHistory, resumeData, userImage,
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
      <ImageModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />
    </div>
  );
};

export default App;
