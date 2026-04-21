import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Types
import { Project } from './types';

// Constants
import { 
  HERO_CONTENT_DEFAULT, 
  ABOUT_CONTENT_DEFAULT, 
  GAME_HISTORY, 
  RESUME_DATA, 
  PORTFOLIO_PROJECTS, 
  INITIAL_SKILL_TABS, 
  INITIAL_TOOLS 
} from './data/constants';

// Hooks
import { useEditableContent } from './hooks';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { StatBoard } from './components/StatBoard';
import { Projects } from './components/Projects';
import { PortfolioGallery } from './components/PortfolioGallery';
import { ProjectDetail } from './components/ProjectDetail';
import { Resume } from './components/Resume';
import { Footer, BackToTop, ImageModal } from './components/Common';

const App = () => {
  // --- View State ---
  const [view, setView] = useState<'home' | 'all-projects' | 'portfolio' | 'project-detail' | 'resume'>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // --- Content State (Supabase / LocalStorage) ---
  const [heroContent, setHeroContent] = useEditableContent(HERO_CONTENT_DEFAULT, 'hero_content');
  const [aboutContent, setAboutContent] = useEditableContent(ABOUT_CONTENT_DEFAULT, 'about_content');
  const [portfolioData, setPortfolioData] = useEditableContent(Array.isArray(PORTFOLIO_PROJECTS) ? PORTFOLIO_PROJECTS : [], 'portfolio_data');
  const [skillTabs, setSkillTabs] = useEditableContent(Array.isArray(INITIAL_SKILL_TABS) ? INITIAL_SKILL_TABS : [], 'skill_tabs');
  const [tools, setTools] = useEditableContent(Array.isArray(INITIAL_TOOLS) ? INITIAL_TOOLS : [], 'tools');
  const [gameHistory, setGameHistory] = useEditableContent(GAME_HISTORY, 'game_history');
  const [resumeData, setResumeData] = useEditableContent(RESUME_DATA, 'resume_data');
  const [userImage, setUserImage] = useEditableContent('', 'stat_board_user_image');

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
    setPortfolioData(newProjects);
    setSelectedProject({ ...selectedProject, content });
  }, [selectedProject, portfolioData, setPortfolioData]);

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

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div key="home">
            <Hero 
              onNavClick={handleNavClick} 
              onToggleAdmin={() => setIsEditing(!isEditing)} 
              isEditing={isEditing} 
              content={heroContent} 
              setContent={setHeroContent} 
            />
            <About 
              isEditing={isEditing} 
              content={aboutContent} 
              setContent={setAboutContent} 
              onMoreMeClick={() => setIsImageModalOpen(true)}
            />
            <StatBoard 
              isEditing={isEditing}
              projects={portfolioData}
              setProjects={setPortfolioData}
              skillTabs={skillTabs}
              tools={tools}
              onProjectClick={handleProjectClick}
              userImage={userImage}
              onImageUpload={setUserImage}
            />
          </motion.div>
        )}

        {view === 'portfolio' && (
          <PortfolioGallery 
            key="portfolio"
            onProjectClick={handleProjectClick}
            isEditing={isEditing}
            projects={portfolioData}
            setProjects={setPortfolioData}
            setView={changeView}
          />
        )}

        {view === 'all-projects' && (
          <div key="all-projects" className="pt-20">
            <Projects 
              onProjectClick={handleProjectClick} 
              isEditing={isEditing} 
              projects={portfolioData} 
              setProjects={setPortfolioData} 
            />
          </div>
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
            key="resume"
            isEditing={isEditing} 
            data={resumeData} 
            setData={setResumeData} 
          />
        )}
      </AnimatePresence>

      <Footer />
      <BackToTop />
      <ImageModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />
    </div>
  );
};

export default App;
