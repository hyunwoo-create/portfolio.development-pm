import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix 1: Hero navTabs - remove '자기소개서' tab (it's moved into resume), keep 이력서 at top
const oldNavTabs = `const navTabs = [
     { label: '이력서', onClick: onResumeClick, icon: FileText },
     { label: '자기소개서', onClick: onSelfIntroClick, icon: ScrollText },
     { label: '핵심역량', onClick: onSkillsClick, icon: Zap },
     { label: '포트폴리오', onClick: onPortfolioClick, icon: FolderOpen },
   ];`;
const newNavTabs = `const navTabs = [
     { label: '이력서', onClick: onResumeClick, icon: FileText },
     { label: '핵심역량', onClick: onSkillsClick, icon: Zap },
     { label: '포트폴리오', onClick: onPortfolioClick, icon: FolderOpen },
   ];`;

content = content.replace(oldNavTabs, newNavTabs);

// Fix 2: Hero title lines - add multiline + whitespace-pre-wrap + color + highlight support
// titleLine1
content = content.replace(
  /value=\{content\.titleLine1 \|\| "[^"]*"\}/,
  'value={content.titleLine1 || "10년의 조율 감각으로 협업을 완성하고"}'
);
content = content.replace(
  /onSave=\{\(v\) => setContent\(\{\.\.\.content, titleLine1: v\}\)\}\s*\n\s*isEditing=\{isEditing\}\s*\n\s*className="text-\[#112D4E\] uppercase opacity-90"/,
  `onSave={(v) => setContent({...content, titleLine1: v})}
             isEditing={isEditing}
             multiline
             className="text-[#112D4E] uppercase opacity-90"`
);
content = content.replace(
  /fontSize: content\.titleLine1Style\?\.fontSize \|\| '2\.2rem',\s*\n\s*letterSpacing: content\.titleLine1Style\?\.letterSpacing \|\| '0\.3em',\s*\n\s*fontWeight: content\.titleLine1Style\?\.fontWeight \|\| '700',\s*\n\s*fontFamily: content\.titleLine1Style\?\.fontFamily \|\| undefined,\s*\n\s*lineHeight: '1\.2',/,
  `fontSize: content.titleLine1Style?.fontSize || '2.2rem',
               letterSpacing: content.titleLine1Style?.letterSpacing || '0.3em',
               fontWeight: content.titleLine1Style?.fontWeight || '700',
               fontFamily: content.titleLine1Style?.fontFamily || undefined,
               lineHeight: content.titleLine1Style?.lineHeight || '1.2',
               color: content.titleLine1Style?.color || undefined,
               backgroundColor: content.titleLine1Style?.backgroundColor || undefined,
               whiteSpace: 'pre-wrap',`
);

// titleLine2
content = content.replace(
  /value=\{content\.titleLine2 \|\| "[^"]*"\}/,
  'value={content.titleLine2 || "결과로 증명하는 PM"}'
);
content = content.replace(
  /onSave=\{\(v\) => setContent\(\{\.\.\.content, titleLine2: v\}\)\}\s*\n\s*isEditing=\{isEditing\}\s*\n\s*className="text-\[#1A59A7\] drop-shadow-2xl"/,
  `onSave={(v) => setContent({...content, titleLine2: v})}
             isEditing={isEditing}
             multiline
             className="text-[#1A59A7] drop-shadow-2xl"`
);
content = content.replace(
  /fontSize: content\.titleLine2Style\?\.fontSize \|\| '3\.5rem',\s*\n\s*letterSpacing: content\.titleLine2Style\?\.letterSpacing \|\| '-0\.05em',\s*\n\s*fontWeight: content\.titleLine2Style\?\.fontWeight \|\| '900',\s*\n\s*fontFamily: content\.titleLine2Style\?\.fontFamily \|\| undefined,\s*\n\s*lineHeight: '1\.05',/,
  `fontSize: content.titleLine2Style?.fontSize || '3.5rem',
               letterSpacing: content.titleLine2Style?.letterSpacing || '-0.05em',
               fontWeight: content.titleLine2Style?.fontWeight || '900',
               fontFamily: content.titleLine2Style?.fontFamily || undefined,
               lineHeight: content.titleLine2Style?.lineHeight || '1.05',
               color: content.titleLine2Style?.color || undefined,
               backgroundColor: content.titleLine2Style?.backgroundColor || undefined,
               whiteSpace: 'pre-wrap',`
);

// description style
content = content.replace(
  /fontSize: content\.descStyle\?\.fontSize \|\| '1\.1rem',\s*\n\s*letterSpacing: content\.descStyle\?\.letterSpacing \|\| 'normal',\s*\n\s*fontWeight: content\.descStyle\?\.fontWeight \|\| '500',\s*\n\s*fontFamily: content\.descStyle\?\.fontFamily \|\| undefined,\s*\n\s*lineHeight: '1\.7',/,
  `fontSize: content.descStyle?.fontSize || '1.1rem',
               letterSpacing: content.descStyle?.letterSpacing || 'normal',
               fontWeight: content.descStyle?.fontWeight || '500',
               fontFamily: content.descStyle?.fontFamily || undefined,
               lineHeight: content.descStyle?.lineHeight || '1.7',
               color: content.descStyle?.color || undefined,
               backgroundColor: content.descStyle?.backgroundColor || undefined,
               whiteSpace: 'pre-wrap',`
);

// Fix 3: Navbar - full navigation links, always show, with proper routing
const oldNavbar = `const Navbar = ({ setView, currentView, onNavClick, isEditing, setIsEditing }: { setView: (v: 'home' | 'resume' | 'self-intro' | 'project-detail' | 'portfolio' | 'all-projects') => void, currentView: string, onNavClick: (id: string) => void, isEditing: boolean, setIsEditing: (v: boolean) => void }) => {`;
const newNavbarStart = `const Navbar = ({ setView, currentView, onNavClick, isEditing, setIsEditing }: { setView: (v: any) => void, currentView: string, onNavClick: (id: string) => void, isEditing: boolean, setIsEditing: (v: boolean) => void }) => {`;
content = content.replace(oldNavbar, newNavbarStart);

// Replace the entire Navbar body to add nav links
// Find the full Navbar between its start signature and its closing `};`
// We'll replace the inner part by looking for the specific pattern

// Remove old unused handlers
content = content.replace(
  /const handleLinkClick = \(e: React\.MouseEvent, id: string\) => \{[\s\S]*?setIsMenuOpen\(false\);\s*\};/,
  ''
);
content = content.replace(
  /const handleResumeClick = \(\) => \{[\s\S]*?setIsMenuOpen\(false\);\s*\};/,
  ''
);
content = content.replace(
  /const handlePortfolioClick = \(\) => \{[\s\S]*?setIsMenuOpen\(false\);\s*\};/,
  ''
);
content = content.replace(
  /const handleSelfIntroClick = \(\) => \{[\s\S]*?window\.scrollTo\(0, 0\);\s*\};/,
  ''
);

// Add navLinks definition before handleAdminClick in Navbar  
const navLinksCode = `
  const navLinks = [
    { label: '소개', action: () => { onNavClick('about'); } },
    { label: '이력서', action: () => { setView('resume'); } },
    { label: '포트폴리오', action: () => { onNavClick('portfolio-section'); } },
    { label: '핵심역량', action: () => { onNavClick('skills'); } },
    { label: '사용 TOOL', action: () => { onNavClick('my-tools'); } },
  ];

`;
content = content.replace(
  '  const handleAdminClick = () => {\r\n  if (isEditing) {\r\n  setIsEditing(false);\r\n  alert("관리자 모드가 비활성화되었습니다.");',
  navLinksCode + '  const handleAdminClick = () => {\r\n  if (isEditing) {\r\n  setIsEditing(false);\r\n  alert("관리자 모드가 비활성화되었습니다.");'
);

// Replace the nav JSX to include links
// Old nav area between logo and admin button
const oldNavMiddle = `  </div>

\n\t{/* Admin Button */}\n\t<div className="flex items-center gap-2">\n\t<button \n\tonClick={handleAdminClick}\n\tclassName="p-2 hover:bg-[#112D4E]/5 rounded-lg transition-colors group"\n\ttitle="관리자 모드"\n\t>\n\t<Lock className={\`w-4 h-4 transition-colors \${isEditing ? 'text-[#3F72AF]' : 'text-[#112D4E] group-hover:text-[#112D4E]'}\`} />\n\t</button>\n\t</div>`;
const newNavMiddle = `  </div>

  {/* Desktop Nav Links */}
  <div className="hidden md:flex items-center gap-1">
  {navLinks.map((link) => (
  <button
  key={link.label}
  onClick={link.action}
  className="px-3 py-1.5 text-sm font-medium text-[#112D4E] hover:text-[#1A59A7] hover:bg-[#112D4E]/5 rounded-lg transition-all"
  >
  {link.label}
  </button>
  ))}
  </div>

\t{/* Admin Button */}\n\t<div className="flex items-center gap-2">\n\t<button \n\tonClick={handleAdminClick}\n\tclassName="p-2 hover:bg-[#112D4E]/5 rounded-lg transition-colors group"\n\ttitle="관리자 모드"\n\t>\n\t<Lock className={\`w-4 h-4 transition-colors \${isEditing ? 'text-[#3F72AF]' : 'text-[#112D4E] group-hover:text-[#112D4E]'}\`} />\n\t</button>\n\t</div>`;
content = content.replace(oldNavMiddle, newNavMiddle);

// Fix 4: Always show Navbar (remove conditional rendering)
content = content.replace(
  `{view !== 'home' && (\n\t<Navbar`,
  `<Navbar`
);
content = content.replace(
  `  />\n\t)}`,
  `  />`
);

// Fix 5: Self-intro uses ReactMarkdown
content = content.replace(
  `<div className="text-[#112D4E] leading-relaxed whitespace-pre-wrap font-medium">
  {tab.content}
  </div>`,
  `<div className="text-[#112D4E] leading-relaxed font-medium markdown-body">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>{tab.content}</ReactMarkdown>
  </div>`
);

// Fix 6: ResumeProps type - make setView accept any view
content = content.replace(
  `setView: (v: 'home' | 'resume' | 'project-detail') => void;`,
  `setView: (v: any) => void;`
);

// Fix 7: Add self-intro section to resume (before last </div></div></div>)
// Find the awards section close in Resume, and add SelfIntroInResume after it
const awardsCloseInResume = `  </section>\r\n\r\n  \r\n  </div>\r\n  </div>\r\n  </div>\r\n  </motion.section>`;
const awardsCloseReplacement = `  </section>\r\n\r\n  {/* Self Introduction - Tabbed (merged from standalone page) */}\r\n  <SelfIntroInResume isEditing={isEditing} data={data} setData={setData} />\r\n  \r\n  </div>\r\n  </div>\r\n  </div>\r\n  </motion.section>`;
content = content.replace(awardsCloseInResume, awardsCloseReplacement);

// Fix 8: Add SelfIntroInResume component before Contact
const selfIntroInResumeComponent = `
// Self Introduction embedded inside Resume
const SelfIntroInResume = ({ isEditing, data, setData }: { isEditing: boolean, data: ResumeData, setData: (d: ResumeData) => void }) => {
  const [activeIntroTab, setActiveIntroTab] = useState<string>(
  data.selfIntroTabs?.[0]?.id || 'intro-1'
  );
  const [editingIntroTabId, setEditingIntroTabId] = useState<string | null>(null);

  useEffect(() => {
  const tabs = data.selfIntroTabs || [];
  if (tabs.length > 0 && !tabs.find(t => t.id === activeIntroTab)) {
  setActiveIntroTab(tabs[0].id);
  }
  }, [data.selfIntroTabs, activeIntroTab]);

  const selfIntroTabs: SelfIntroTab[] = data.selfIntroTabs || [
  { id: 'intro-1', title: '성장 과정 및 가치관', content: data.selfIntroduction || '' }
  ];

  return (
  <section className="pt-12 mt-12 border-t border-[#3F72AF]/8">
  <div className="flex items-center justify-between mb-8 pdf-no-break">
  <h3 className="text-xl font-bold flex items-center gap-3">
  <ScrollText className="text-[#112D4E] w-6 h-6" /> 자기소개서
  </h3>
  </div>

  {/* Tab Bar */}
  <div className="flex items-center gap-2 mb-6 flex-wrap pdf-no-break">
  {selfIntroTabs.map((tab) => (
  <div key={tab.id} className="relative flex items-center">
  {isEditing && editingIntroTabId === tab.id ? (
  <input
  type="text"
  className="px-4 py-2 bg-[#DBE2EF]/60 border border-[#112D4E] rounded-xl text-sm font-bold text-[#1A59A7] focus:outline-none min-w-[80px]"
  value={tab.title}
  autoFocus
  onChange={(e) => {
  const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, title: e.target.value } : t);
  setData({...data, selfIntroTabs: newTabs});
  }}
  onBlur={() => setEditingIntroTabId(null)}
  onKeyDown={(e) => { if (e.key === 'Enter') setEditingIntroTabId(null); }}
  />
  ) : (
  <button
  onClick={() => setActiveIntroTab(tab.id)}
  onDoubleClick={() => isEditing && setEditingIntroTabId(tab.id)}
  className={\`px-4 py-2 rounded-xl text-sm font-bold transition-all \${
  activeIntroTab === tab.id
  ? 'bg-[#0a1e36] text-[#F9F7F7] shadow-lg shadow-[#112D4E]/25'
  : 'glass text-[#112D4E] hover:text-[#112D4E] hover:bg-[#112D4E]/5'
  }\`}
  >
  {tab.title}
  </button>
  )}
  {isEditing && selfIntroTabs.length > 1 && (
  <button
  onClick={(e) => {
  e.stopPropagation();
  const newTabs = selfIntroTabs.filter(t => t.id !== tab.id);
  setData({...data, selfIntroTabs: newTabs});
  if (activeIntroTab === tab.id && newTabs.length > 0) {
  setActiveIntroTab(newTabs[0].id);
  }
  }}
  className="ml-1 p-1 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
  title="탭 삭제"
  >
  <X className="w-3 h-3" />
  </button>
  )}
  </div>
  ))}
  {isEditing && (
  <button
  onClick={() => {
  const newTab: SelfIntroTab = {
  id: \`intro-\${Date.now()}\`,
  title: '새 항목',
  content: '내용을 입력하세요.'
  };
  const newTabs = [...selfIntroTabs, newTab];
  setData({...data, selfIntroTabs: newTabs});
  setActiveIntroTab(newTab.id);
  }}
  className="px-3 py-2 border-2 border-dashed border-[#3F72AF]/20 rounded-xl text-sm font-bold text-[#0a1e36] hover:text-[#112D4E] hover:border-[#112D4E]/50 transition-all flex items-center gap-1.5"
  >
  <Plus className="w-3.5 h-3.5" /> 탭 추가
  </button>
  )}
  </div>

  {/* Tab Content */}
  <div className="glass rounded-[2rem] p-8 md:p-12 pdf-no-break">
  {selfIntroTabs.map((tab) => (
  <div key={tab.id} style={{ display: activeIntroTab === tab.id ? 'block' : 'none' }}>
  {isEditing ? (
  <textarea
  className="w-full h-[300px] bg-[#DBE2EF]/40 border border-[#3F72AF]/20 rounded-2xl p-6 text-[#1A59A7] text-sm leading-relaxed focus:outline-none focus:border-[#112D4E] resize-y"
  value={tab.content}
  onChange={(e) => {
  const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, content: e.target.value } : t);
  setData({...data, selfIntroTabs: newTabs});
  }}
  placeholder="자기소개 내용을 입력하세요... (마크다운 문법 지원)"
  />
  ) : (
  <div className="text-[#112D4E] leading-relaxed font-medium markdown-body">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>{tab.content}</ReactMarkdown>
  </div>
  )}
  </div>
  ))}
  </div>
  </section>
  );
};

`;

content = content.replace(
  `const Contact = () => (`,
  selfIntroInResumeComponent + `const Contact = () => (`
);

// Fix 9: Fix project-detail back button to remember previous view correctly
// Add prevViewForDetail state
content = content.replace(
  `const [prevView, setPrevView] = useState`,
  `const [prevViewForDetail, setPrevViewForDetail] = useState<string>('home');
  const [prevView, setPrevView] = useState`
);

// Update handleProjectClick to save the view we came from
content = content.replace(
  `const handleProjectClick = (project: Project) => {
  setSelectedProject(project);
  changeView('project-detail');
  };`,
  `const handleProjectClick = (project: Project) => {
  setSelectedProject(project);
  setPrevViewForDetail(view);
  changeView('project-detail');
  };`
);

// Fix onBack to use prevViewForDetail  
content = content.replace(
  `onBack={() => changeView(prevView === 'project-detail' ? 'home' : prevView)}`,
  `onBack={() => changeView(prevViewForDetail === 'project-detail' ? 'home' : prevViewForDetail)}`
);

// Fix 10: Hero - remove onSelfIntroClick from props since it's no longer a tab
content = content.replace(
  `onSelfIntroClick={() => { changeView('self-intro'); window.scrollTo(0, 0); }}`,
  `onAboutClick={() => handleNavClick('about')}
  onToolsClick={() => handleNavClick('my-tools')}`
);

// Fix 11: Hero onPortfolioClick should scroll to portfolio section on home
content = content.replace(
  `onPortfolioClick={() => changeView('portfolio')}`,
  `onPortfolioClick={() => handleNavClick('portfolio-section')}`
);

// Fix 12: Remove self-intro view rendering (we merged it into resume)
content = content.replace(
  /\{view === 'self-intro' && \(\s*<SelfIntro[\s\S]*?<\/SelfIntro>\s*\)\s*\)/,
  ''  
);
// Try alternate pattern
content = content.replace(
  /\{view === 'self-intro' && \([\s\S]*?\)\}\s*\n/,
  '\n'
);

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('All fixes applied successfully!');
