import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// ============================================================
// 1. Add MarkdownRenderer and EditableMarkdown components right before EditableText
// ============================================================
const editableTextStart = `const EditableText = ({`;
const markdownComponents = `const MarkdownRenderer = ({ content, className = "" }: { content: string, className?: string }) => (
  <div className={\`markdown-body \${className}\`}>
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    h1: ({children}) => <h1>{children}</h1>,
    h2: ({children}) => <h2>{children}</h2>,
    h3: ({children}) => <h3>{children}</h3>,
    p: ({children}) => <p>{children}</p>,
    ul: ({children}) => <ul>{children}</ul>,
    ol: ({children}) => <ol>{children}</ol>,
    li: ({children}) => <li>{children}</li>,
    strong: ({children}) => <strong>{children}</strong>,
    em: ({children}) => <em>{children}</em>,
    blockquote: ({children}) => <blockquote>{children}</blockquote>,
    code: ({className: codeClassName, children, ...props}: any) => {
      const isInline = !codeClassName;
      return isInline ? <code>{children}</code> : <pre><code className={codeClassName}>{children}</code></pre>;
    },
    a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#3F72AF] underline hover:text-[#112D4E]">{children}</a>,
    hr: () => <hr />,
  }}>{content}</ReactMarkdown>
  </div>
);

const EditableMarkdown = ({
  value,
  onSave,
  isEditing,
  className = "",
  rows = 6,
  style = {}
}: {
  value: string,
  onSave: (v: string) => void,
  isEditing: boolean,
  className?: string,
  rows?: number,
  style?: React.CSSProperties
}) => {
  if (!isEditing) return <MarkdownRenderer content={value} className={className} />;
  return (
    <div>
      <div className="text-[10px] text-[#112D4E] font-bold mb-1 flex items-center gap-1 opacity-70">\u{1F4DD} 마크다운 문법을 지원합니다 (# 제목, **굵게**, *기울임*, - 목록 등)</div>
      <textarea
        className={\`w-full bg-[#DBE2EF]/40 border border-[#3F72AF]/20 rounded-xl p-4 text-[#1A59A7] text-sm font-mono leading-relaxed focus:outline-none focus:border-[#112D4E] resize-y \${className}\`}
        value={value}
        onChange={(e) => onSave(e.target.value)}
        rows={rows}
        style={style}
      />
    </div>
  );
};

`;

content = content.replace(editableTextStart, markdownComponents + editableTextStart);
console.log('1. Added MarkdownRenderer and EditableMarkdown components');

// ============================================================
// 2. Update Navbar - add navigation links and fix portfolio button behavior
// ============================================================
// Update Navbar signature to accept prevView
content = content.replace(
  /const Navbar = \(\{ setView, currentView, onNavClick, isEditing, setIsEditing \}: \{ setView: \(v: 'home' \| 'resume' \| 'self-intro' \| 'project-detail' \| 'portfolio' \| 'all-projects'\) => void/,
  `const Navbar = ({ setView, currentView, onNavClick, isEditing, setIsEditing, prevView }: { setView: (v: 'home' | 'resume' | 'project-detail' | 'portfolio' | 'all-projects') => void`
);
console.log('2a. Updated Navbar signature');

// Remove self-intro from onNavClick parameter type
content = content.replace(
  /onNavClick: \(id: string\) => void, isEditing: boolean, setIsEditing: \(v: boolean\) => void \}\)/,
  `onNavClick: (id: string) => void, isEditing: boolean, setIsEditing: (v: boolean) => void, prevView?: string })`
);
console.log('2b. Updated Navbar parameter types');

// Remove handleSelfIntroClick from Navbar
content = content.replace(
  /const handleSelfIntroClick = \(\) => \{\s*setView\('self-intro'\);\s*setIsMenuOpen\(false\);\s*window\.scrollTo\(0, 0\);\s*\};/,
  ''
);
console.log('2c. Removed handleSelfIntroClick');

// Fix handlePortfolioClick to handle project-detail correctly
content = content.replace(
  /const handlePortfolioClick = \(\) => \{\s*setView\('portfolio'\);\s*setIsMenuOpen\(false\);\s*\};/,
  `const handlePortfolioClick = () => {
    // If coming from project-detail, go back to where we came from instead of home
    if (currentView === 'project-detail') {
      setView(prevView === 'portfolio' || prevView === 'all-projects' ? (prevView as any) : 'portfolio');
    } else {
      setView('portfolio');
    }
    setIsMenuOpen(false);
  };`
);
console.log('2d. Fixed handlePortfolioClick');

// Replace the empty nav section with full nav items
const adminButtonBlock = `\t{/* Admin Button */}
\t<div className="flex items-center gap-2">
\t<button 
\tonClick={handleAdminClick}
\tclassName="p-2 hover:bg-[#112D4E]/5 rounded-lg transition-colors group"
\ttitle="관리자 모드"
\t>
\t<Lock className={\`w-4 h-4 transition-colors \${isEditing ? 'text-[#3F72AF]' : 'text-[#112D4E] group-hover:text-[#112D4E]'}\`} />
\t</button>
\t</div>`;

const newNavContent = `\t{/* Desktop Nav Links */}
\t<div className="hidden md:flex items-center gap-1">
\t  <button onClick={(e) => handleLinkClick(e, 'about')} className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#112D4E] hover:bg-[#112D4E]/10 transition-all flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#3F72AF]" />소개</button>
\t  <button onClick={() => handleResumeClick()} className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#112D4E] hover:bg-[#112D4E]/10 transition-all flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[#3F72AF]" />이력서</button>
\t  <button onClick={() => handlePortfolioClick()} className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#112D4E] hover:bg-[#112D4E]/10 transition-all flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5 text-[#3F72AF]" />포트폴리오</button>
\t  <button onClick={(e) => handleLinkClick(e, 'skills')} className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#112D4E] hover:bg-[#112D4E]/10 transition-all flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[#3F72AF]" />핵심역량</button>
\t  <button onClick={(e) => handleLinkClick(e, 'my-tools')} className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#112D4E] hover:bg-[#112D4E]/10 transition-all flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5 text-[#3F72AF]" />사용 Tool</button>
\t</div>

\t{/* Mobile Menu + Admin */}
\t<div className="flex items-center gap-2">
\t<button className="md:hidden p-2 hover:bg-[#112D4E]/5 rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
\t  {isMenuOpen ? <X className="w-5 h-5 text-[#112D4E]" /> : <Menu className="w-5 h-5 text-[#112D4E]" />}
\t</button>
\t<button 
\tonClick={handleAdminClick}
\tclassName="p-2 hover:bg-[#112D4E]/5 rounded-lg transition-colors group"
\ttitle="관리자 모드"
\t>
\t<Lock className={\`w-4 h-4 transition-colors \${isEditing ? 'text-[#3F72AF]' : 'text-[#112D4E] group-hover:text-[#112D4E]'}\`} />
\t</button>
\t</div>`;

content = content.replace(adminButtonBlock, newNavContent);
console.log('2e. Replaced admin button with full nav');

// Add mobile menu after </nav> but before <PasswordModal
const navCloseTag = `  </nav>\r\n  <PasswordModal`;
const mobileMenu = `  </nav>
  {/* Mobile Menu */}
  <AnimatePresence>
  {isMenuOpen && (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 glass rounded-2xl p-4 md:hidden print:hidden">
      <div className="flex flex-col gap-1">
        <button onClick={(e) => { handleLinkClick(e, 'about'); setIsMenuOpen(false); }} className="px-4 py-3 rounded-xl text-sm font-bold text-[#112D4E] hover:bg-[#112D4E]/10 transition-all flex items-center gap-2"><User className="w-4 h-4 text-[#3F72AF]" />소개</button>
        <button onClick={() => { handleResumeClick(); setIsMenuOpen(false); }} className="px-4 py-3 rounded-xl text-sm font-bold text-[#112D4E] hover:bg-[#112D4E]/10 transition-all flex items-center gap-2"><FileText className="w-4 h-4 text-[#3F72AF]" />이력서</button>
        <button onClick={() => { handlePortfolioClick(); setIsMenuOpen(false); }} className="px-4 py-3 rounded-xl text-sm font-bold text-[#112D4E] hover:bg-[#112D4E]/10 transition-all flex items-center gap-2"><FolderOpen className="w-4 h-4 text-[#3F72AF]" />포트폴리오</button>
        <button onClick={(e) => { handleLinkClick(e, 'skills'); setIsMenuOpen(false); }} className="px-4 py-3 rounded-xl text-sm font-bold text-[#112D4E] hover:bg-[#112D4E]/10 transition-all flex items-center gap-2"><Zap className="w-4 h-4 text-[#3F72AF]" />핵심역량</button>
        <button onClick={(e) => { handleLinkClick(e, 'my-tools'); setIsMenuOpen(false); }} className="px-4 py-3 rounded-xl text-sm font-bold text-[#112D4E] hover:bg-[#112D4E]/10 transition-all flex items-center gap-2"><Wrench className="w-4 h-4 text-[#3F72AF]" />사용 Tool</button>
      </div>
    </motion.div>
  )}
  </AnimatePresence>
  <PasswordModal`;

content = content.replace(navCloseTag, mobileMenu);
console.log('2f. Added mobile menu');

// ============================================================
// 3. Update Hero props - remove onSelfIntroClick, add onAboutClick and onToolsClick
// ============================================================
// Already changed the component signature. Now update navTabs in Hero
content = content.replace(
  `const navTabs = [
     { label: '이력서', onClick: onResumeClick, icon: FileText },
     { label: '자기소개서', onClick: onSelfIntroClick, icon: ScrollText },
     { label: '핵심역량', onClick: onSkillsClick, icon: Zap },
     { label: '포트폴리오', onClick: onPortfolioClick, icon: FolderOpen },
   ];`,
  `const navTabs = [
     { label: '소개', onClick: onAboutClick, icon: User },
     { label: '이력서', onClick: onResumeClick, icon: FileText },
     { label: '포트폴리오', onClick: onPortfolioClick, icon: FolderOpen },
     { label: '핵심역량', onClick: onSkillsClick, icon: Zap },
     { label: '사용 Tool', onClick: onToolsClick, icon: Wrench },
   ];`
);
console.log('3. Updated Hero navTabs');

// ============================================================
// 4. Replace Hero text section with markdown
// ============================================================
const heroTextOld = `        <h1 className="flex flex-col gap-3 mb-8">
           <EditableText
             value={content.titleLine1 || "기획의도를 알고"}
             onSave={(v) => setContent({...content, titleLine1: v})}
             isEditing={isEditing}
             className="text-[#112D4E] uppercase opacity-90"
             style={{
               fontSize: content.titleLine1Style?.fontSize || '2.2rem',
               letterSpacing: content.titleLine1Style?.letterSpacing || '0.3em',
               fontWeight: content.titleLine1Style?.fontWeight || '700',
               fontFamily: content.titleLine1Style?.fontFamily || undefined,
               lineHeight: '1.2',
             }}
           />
           {isEditing && <TextStyleEditor style={content.titleLine1Style || {fontSize:'2.2rem',letterSpacing:'0.3em',fontWeight:'700'}} onStyleChange={(s) => setContent({...content, titleLine1Style: s})} />}
           <EditableText
             value={content.titleLine2 || "목차를 쓸줄 아는 기획자"}
             onSave={(v) => setContent({...content, titleLine2: v})}
             isEditing={isEditing}
             className="text-[#1A59A7] drop-shadow-2xl"
             style={{
               fontSize: content.titleLine2Style?.fontSize || '3.5rem',
               letterSpacing: content.titleLine2Style?.letterSpacing || '-0.05em',
               fontWeight: content.titleLine2Style?.fontWeight || '900',
               fontFamily: content.titleLine2Style?.fontFamily || undefined,
               lineHeight: '1.05',
             }}
           />
           {isEditing && <TextStyleEditor style={content.titleLine2Style || {fontSize:'3.5rem',letterSpacing:'-0.05em',fontWeight:'900'}} onStyleChange={(s) => setContent({...content, titleLine2Style: s})} />}
         </h1>
         <div className="max-w-xl mb-10">
           <EditableText
             value={content.description}
             onSave={(v) => setContent({...content, description: v})}
             isEditing={isEditing}
             multiline
             className="text-[#112D4E]"
             style={{
               fontSize: content.descStyle?.fontSize || '1.1rem',
               letterSpacing: content.descStyle?.letterSpacing || 'normal',
               fontWeight: content.descStyle?.fontWeight || '500',
               fontFamily: content.descStyle?.fontFamily || undefined,
               lineHeight: '1.7',
             }}
           />
           {isEditing && <TextStyleEditor style={content.descStyle || {fontSize:'1.1rem',letterSpacing:'normal',fontWeight:'500'}} onStyleChange={(s) => setContent({...content, descStyle: s})} />}
         </div>`;

const heroTextNew = `        {/* Hero Markdown Content */}
         <div className="mb-8">
           <EditableMarkdown
             value={content.heroMarkdown || "# 기획의도를 알고\\n## 목차를 쓸줄 아는 기획자\\n\\n사용자의 경험을 논리적으로 설계하고, 명확한 문서화를 통해 팀의 비전을 구체화합니다.\\n\\n데이터와 심리학을 기반으로 한 깊이 있는 기획을 지향합니다."}
             onSave={(v) => setContent({...content, heroMarkdown: v})}
             isEditing={isEditing}
             className="hero-markdown"
             rows={10}
           />
         </div>`;

content = content.replace(heroTextOld, heroTextNew);
console.log('4. Replaced Hero text with markdown');

// ============================================================
// 5. Replace About text with markdown
// ============================================================
const aboutTextOld = `  <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight leading-tight">\r
  <EditableText \r
  value={content.title} \r
  onSave={(v) => setContent({...content, title: v})} \r
  isEditing={isEditing} \r
  className="block text-[#1A59A7]"\r
  />\r
  <EditableText \r
  value={content.subtitle} \r
  onSave={(v) => setContent({...content, subtitle: v})} \r
  isEditing={isEditing} \r
  className="block text-[#1A59A7]"\r
  />\r
  </h2>\r
  <div className="space-y-6 text-[#112D4E] text-lg leading-relaxed font-medium">\r
  <p>\r
  <EditableText \r
  value={content.p1} \r
  onSave={(v) => setContent({...content, p1: v})} \r
  isEditing={isEditing} \r
  multiline\r
  />\r
  </p>\r
  <p>\r
  <EditableText \r
  value={content.p2} \r
  onSave={(v) => setContent({...content, p2: v})} \r
  isEditing={isEditing} \r
  multiline\r
  />\r
  </p>\r
  </div>`;

const aboutTextNew = `  {/* About Markdown Content */}\r
  <EditableMarkdown\r
    value={content.aboutMarkdown || "# 논리와 감성의 균형으로\\n## 최고의 재미를 설계합니다.\\n\\n게임이 '작동'하는 원리를 깊이 있게 학습했습니다. 단순한 아이디어를 넘어, 수치로 증명되는 밸런싱과 플레이어의 심리를 관통하는 내러티브 설계를 지향합니다.\\n\\n훌륭한 게임 디자인은 보이지 않아야 한다고 믿습니다. 플레이어가 자연스럽게 몰입하고, 성취감을 느끼며, 그 세계의 일부가 된 듯한 경험을 제공하는 것이 저의 목표입니다."}\r
    onSave={(v) => setContent({...content, aboutMarkdown: v})}\r
    isEditing={isEditing}\r
    className="about-markdown"\r
    rows={10}\r
  />`;

if (content.includes(aboutTextOld)) {
  content = content.replace(aboutTextOld, aboutTextNew);
  console.log('5. Replaced About text with markdown');
} else {
  // Try without \r
  const aboutOldNoR = aboutTextOld.replace(/\r/g, '');
  const aboutNewNoR = aboutTextNew.replace(/\r/g, '');
  
  // Find and replace using line-by-line approach
  const lines = content.split('\n');
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight leading-tight">') && 
        i > 1070 && i < 1100) {
      startIdx = i;
      break;
    }
  }
  
  if (startIdx >= 0) {
    let endIdx = -1;
    for (let i = startIdx; i < lines.length; i++) {
      if (lines[i].includes('</div>') && lines[i-1] && lines[i-1].includes('</p>')) {
        endIdx = i;
        break;
      }
    }
    
    if (endIdx >= 0) {
      const newLines = [
        '  {/* About Markdown Content */}',
        '  <EditableMarkdown',
        '    value={content.aboutMarkdown || "# 논리와 감성의 균형으로\\n## 최고의 재미를 설계합니다.\\n\\n게임이 \'작동\'하는 원리를 깊이 있게 학습했습니다. 단순한 아이디어를 넘어, 수치로 증명되는 밸런싱과 플레이어의 심리를 관통하는 내러티브 설계를 지향합니다.\\n\\n훌륭한 게임 디자인은 보이지 않아야 한다고 믿습니다. 플레이어가 자연스럽게 몰입하고, 성취감을 느끼며, 그 세계의 일부가 된 듯한 경험을 제공하는 것이 저의 목표입니다."}',
        '    onSave={(v) => setContent({...content, aboutMarkdown: v})}',
        '    isEditing={isEditing}',
        '    className="about-markdown"',
        '    rows={10}',
        '  />'
      ];
      lines.splice(startIdx, endIdx - startIdx + 1, ...newLines);
      content = lines.join('\n');
      console.log('5. Replaced About text with markdown (line-by-line)');
    } else {
      console.log('5. WARNING: Could not find About text end');
    }
  } else {
    console.log('5. WARNING: Could not find About text start');
  }
}

// ============================================================
// 6. Remove self-intro view type from state declarations
// ============================================================
content = content.replace(
  /useState<'home' \| 'resume' \| 'self-intro' \| 'project-detail' \| 'portfolio' \| 'all-projects'>/g,
  `useState<'home' | 'resume' | 'project-detail' | 'portfolio' | 'all-projects'>`
);
console.log('6. Removed self-intro from state types');

// ============================================================
// 7. Remove changeView for self-intro in Hero
// ============================================================
content = content.replace(
  `onSelfIntroClick={() => { changeView('self-intro'); window.scrollTo(0, 0); }}`,
  `onAboutClick={() => handleNavClick('about')}
  onToolsClick={() => handleNavClick('my-tools')}`
);
console.log('7. Updated Hero onSelfIntroClick -> onAboutClick + onToolsClick');

// ============================================================
// 8. Remove SelfIntro standalone view from render
// ============================================================
// Find the self-intro view block and remove it
content = content.replace(
  /\{view === 'self-intro' && \(\s*<SelfIntro[\s\S]*?\)\s*\}/,
  `{/* self-intro view removed - now embedded in Resume */}`
);
console.log('8. Removed self-intro standalone view');

// ============================================================
// 9. Add SelfIntroSection into Resume (before closing tags)
// ============================================================
// Find the end of awards section in Resume and add self-intro there
const awardsEndPattern = `  </section>\r\n\r\n  \r\n  </div>`;
const awardsEndPattern2 = `  </section>\n\n  \n  </div>`;

const selfIntroInResume = `  </section>

  {/* === Self Introduction (자기소개서) - Embedded in Resume === */}
  <SelfIntroSection isEditing={isEditing} data={data} setData={setData} />
  
  </div>`;

if (content.includes(awardsEndPattern)) {
  content = content.replace(awardsEndPattern, selfIntroInResume);
  console.log('9a. Added SelfIntroSection to Resume');
} else if (content.includes(awardsEndPattern2)) {
  content = content.replace(awardsEndPattern2, selfIntroInResume);
  console.log('9b. Added SelfIntroSection to Resume');
} else {
  // Try another approach
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '</section>' && 
        i > 2800 && i < 2870 &&
        lines[i+2] && lines[i+2].trim() === '</div>') {
      lines.splice(i + 1, 1, 
        '',
        '  {/* === Self Introduction (자기소개서) - Embedded in Resume === */}',
        '  <SelfIntroSection isEditing={isEditing} data={data} setData={setData} />',
        ''
      );
      content = lines.join('\n');
      console.log('9c. Added SelfIntroSection to Resume (line-by-line)');
      break;
    }
  }
}

// ============================================================
// 10. Add SelfIntroSection component after Resume component
// ============================================================
const selfIntroSectionComponent = `

// Self-intro as an inline section component for embedding in Resume
const SelfIntroSection = ({ isEditing, data, setData }: { isEditing: boolean, data: ResumeData, setData: (d: ResumeData) => void }) => {
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
    <section className="pt-8 border-t border-[#3F72AF]/8">
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
                    ? 'bg-[#0a1e36] text-[#1A59A7] shadow-lg shadow-[#112D4E]/25'
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
            <EditableMarkdown
              value={tab.content}
              onSave={(v) => {
                const newTabs = selfIntroTabs.map(t => t.id === tab.id ? { ...t, content: v } : t);
                setData({...data, selfIntroTabs: newTabs});
              }}
              isEditing={isEditing}
              rows={12}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
`;

// Add SelfIntroSection component after Contact component
const contactComponent = `const Contact = () => (`;
content = content.replace(contactComponent, selfIntroSectionComponent + contactComponent);
console.log('10. Added SelfIntroSection component');

// ============================================================
// 11. Pass prevView to Navbar in App render
// ============================================================
content = content.replace(
  `<Navbar \r\n  setView={changeView} \r\n  currentView={view} \r\n  onNavClick={handleNavClick} \r\n  isEditing={isEditing} \r\n  setIsEditing={setIsEditing}\r\n  />`,
  `<Navbar \r\n  setView={changeView} \r\n  currentView={view} \r\n  onNavClick={handleNavClick} \r\n  isEditing={isEditing} \r\n  setIsEditing={setIsEditing}\r\n  prevView={prevView}\r\n  />`
);
console.log('11. Passed prevView to Navbar');

// ============================================================
// 12. Also replace project detail markdown rendering to use MarkdownRenderer
// ============================================================
content = content.replace(
  `<ReactMarkdown remarkPlugins={[remarkGfm]}>\r\n  {project.content}\r\n  </ReactMarkdown>`,
  `<MarkdownRenderer content={project.content} />`
);
// In case there's no \r
content = content.replace(
  `<ReactMarkdown remarkPlugins={[remarkGfm]}>\n  {project.content}\n  </ReactMarkdown>`,
  `<MarkdownRenderer content={project.content} />`
);
console.log('12. Updated project detail to use MarkdownRenderer');

// ============================================================
// 13. Self-intro tab content also use markdown in the old SelfIntro component
//     (keep it for backward compat but we've already added SelfIntroSection)
// ============================================================
// Find the old SelfIntro whitespace-pre-wrap display and replace with EditableMarkdown
content = content.replace(
  `<div className="text-[#112D4E] leading-relaxed whitespace-pre-wrap font-medium">\r\n  {tab.content}\r\n  </div>`,
  `<MarkdownRenderer content={tab.content} />`
);
content = content.replace(
  `<div className="text-[#112D4E] leading-relaxed whitespace-pre-wrap font-medium">\n  {tab.content}\n  </div>`,
  `<MarkdownRenderer content={tab.content} />`
);
console.log('13. Updated SelfIntro to use MarkdownRenderer');

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('\nAll changes applied successfully!');
