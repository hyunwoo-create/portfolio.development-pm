import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

// ============ FIX 1: Add navLinks to Navbar ============
// Find the empty lines between isPasswordModalOpen and handleAdminClick
// and insert navLinks definition there
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const [isPasswordModalOpen, setIsPasswordModalOpen]') && 
      lines[i].includes('Navbar')) {
    // This is inside Navbar. But it's tricky to match. Let me find by context.
  }
}

// Better approach: find the blank lines between isMenuOpen state and handleAdminClick
// Lines 714-720 are empty, replace them with navLinks
let navbarFound = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);') && !navbarFound) {
    // Check if next lines are mostly blank
    if (lines[i+2] && lines[i+2].trim() === '' && lines[i+4] && lines[i+4].trim() === '') {
      // Replace blank lines with navLinks
      const navLinksCode = `
  const navLinks = [
    { label: '소개', action: () => { onNavClick('about'); setIsMenuOpen(false); } },
    { label: '이력서', action: () => { setView('resume'); setIsMenuOpen(false); } },
    { label: '포트폴리오', action: () => { onNavClick('portfolio-section'); setIsMenuOpen(false); } },
    { label: '핵심역량', action: () => { onNavClick('skills'); setIsMenuOpen(false); } },
    { label: '사용 TOOL', action: () => { onNavClick('my-tools'); setIsMenuOpen(false); } },
  ];
`;
      // Remove blank lines and insert navLinks
      let blankStart = i + 1;
      let blankEnd = i + 1;
      while (blankEnd < lines.length && lines[blankEnd].trim() === '') blankEnd++;
      lines.splice(blankStart, blankEnd - blankStart, navLinksCode);
      navbarFound = true;
      console.log(`Inserted navLinks at line ${blankStart + 1}`);
      break;
    }
  }
}

// Now add desktop nav links and mobile menu to the Navbar JSX
// Find the content between </div> (logo end) and Admin Button, add nav links there
content = lines.join('\n');

// Replace the admin button section to include nav links before it
const oldAdminSection = `  </div>

\n\t{/* Admin Button */}\n\t<div className="flex items-center gap-2">\n\t<button \n\tonClick={handleAdminClick}\n\tclassName="p-2 hover:bg-[#112D4E]/5 rounded-lg transition-colors group"\n\ttitle="관리자 모드"\n\t>\n\t<Lock className={\`w-4 h-4 transition-colors \${isEditing ? 'text-[#3F72AF]' : 'text-[#112D4E] group-hover:text-[#112D4E]'}\`} />\n\t</button>\n\t</div>\n  </nav>`;

const newAdminSection = `  </div>

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

  <div className="flex items-center gap-2">
  {/* Mobile Menu Toggle */}
  <button
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  className="md:hidden p-2 hover:bg-[#112D4E]/5 rounded-lg transition-colors"
  >
  {isMenuOpen ? <X className="w-5 h-5 text-[#112D4E]" /> : <Menu className="w-5 h-5 text-[#112D4E]" />}
  </button>
  {/* Admin Button */}
  <button 
  onClick={handleAdminClick}
  className="p-2 hover:bg-[#112D4E]/5 rounded-lg transition-colors group"
  title="관리자 모드"
  >
  <Lock className={\`w-4 h-4 transition-colors \${isEditing ? 'text-[#3F72AF]' : 'text-[#112D4E] group-hover:text-[#112D4E]'}\`} />
  </button>
  </div>
  </nav>
  {/* Mobile Menu Dropdown */}
  <AnimatePresence>
  {isMenuOpen && (
  <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 glass rounded-2xl p-4 md:hidden print:hidden"
  >
  <div className="flex flex-col gap-1">
  {navLinks.map((link) => (
  <button
  key={link.label}
  onClick={link.action}
  className="px-4 py-3 text-sm font-medium text-[#112D4E] hover:bg-[#112D4E]/5 rounded-xl transition-all text-left"
  >
  {link.label}
  </button>
  ))}
  </div>
  </motion.div>
  )}
  </AnimatePresence>`;

if (content.includes(oldAdminSection)) {
  content = content.replace(oldAdminSection, newAdminSection);
  console.log('Added desktop nav links, mobile menu toggle, and mobile dropdown');
} else {
  console.log('WARNING: Could not find admin section pattern to replace');
  // Try alternate approach - just check what we have
}

// ============ FIX 2: About section text styling ============
// Add style and TextStyleEditor to About title, subtitle, p1, p2

// About title
content = content.replace(
  `value={content.title} 
  onSave={(v) => setContent({...content, title: v})} 
  isEditing={isEditing} 
  className="block text-[#1A59A7]"
  />`,
  `value={content.title} 
  onSave={(v) => setContent({...content, title: v})} 
  isEditing={isEditing} 
  className="block text-[#1A59A7]"
  style={{
  fontSize: content.titleStyle?.fontSize || undefined,
  fontFamily: content.titleStyle?.fontFamily || undefined,
  fontWeight: content.titleStyle?.fontWeight || undefined,
  letterSpacing: content.titleStyle?.letterSpacing || undefined,
  color: content.titleStyle?.color || undefined,
  backgroundColor: content.titleStyle?.backgroundColor || undefined,
  }}
  />`
);

// Add TextStyleEditor after the subtitle EditableText closing
content = content.replace(
  `value={content.subtitle} 
  onSave={(v) => setContent({...content, subtitle: v})} 
  isEditing={isEditing} 
  className="block text-[#1A59A7]"
  />
  </h2>`,
  `value={content.subtitle} 
  onSave={(v) => setContent({...content, subtitle: v})} 
  isEditing={isEditing} 
  className="block text-[#1A59A7]"
  style={{
  fontSize: content.subtitleStyle?.fontSize || undefined,
  fontFamily: content.subtitleStyle?.fontFamily || undefined,
  fontWeight: content.subtitleStyle?.fontWeight || undefined,
  letterSpacing: content.subtitleStyle?.letterSpacing || undefined,
  color: content.subtitleStyle?.color || undefined,
  backgroundColor: content.subtitleStyle?.backgroundColor || undefined,
  }}
  />
  </h2>
  {isEditing && <TextStyleEditor style={content.titleStyle || {}} onStyleChange={(s) => setContent({...content, titleStyle: s})} />}
  {isEditing && <TextStyleEditor style={content.subtitleStyle || {}} onStyleChange={(s) => setContent({...content, subtitleStyle: s})} />}`
);

// About p1
content = content.replace(
  `value={content.p1} 
  onSave={(v) => setContent({...content, p1: v})} 
  isEditing={isEditing} 
  multiline
  />`,
  `value={content.p1} 
  onSave={(v) => setContent({...content, p1: v})} 
  isEditing={isEditing} 
  multiline
  style={{
  fontSize: content.p1Style?.fontSize || undefined,
  fontFamily: content.p1Style?.fontFamily || undefined,
  color: content.p1Style?.color || undefined,
  backgroundColor: content.p1Style?.backgroundColor || undefined,
  whiteSpace: 'pre-wrap',
  }}
  />`
);

// About p2
content = content.replace(
  `value={content.p2} 
  onSave={(v) => setContent({...content, p2: v})} 
  isEditing={isEditing} 
  multiline
  />`,
  `value={content.p2} 
  onSave={(v) => setContent({...content, p2: v})} 
  isEditing={isEditing} 
  multiline
  style={{
  fontSize: content.p2Style?.fontSize || undefined,
  fontFamily: content.p2Style?.fontFamily || undefined,
  color: content.p2Style?.color || undefined,
  backgroundColor: content.p2Style?.backgroundColor || undefined,
  whiteSpace: 'pre-wrap',
  }}
  />`
);

// Add TextStyleEditor after About p2 closing
content = content.replace(
  `</p>
  </div>
  
  <div className="mt-12">`,
  `</p>
  {isEditing && <TextStyleEditor style={content.p1Style || {}} onStyleChange={(s) => setContent({...content, p1Style: s})} />}
  </div>
  
  <div className="mt-12">`
);

// ============ FIX 3: Top spacing - Hero section needs pt for navbar ============
// The hero section currently starts without accounting for navbar height
// Change Hero section padding to leave room for navbar
content = content.replace(
  'className="relative min-h-screen flex flex-col justify-center overflow-hidden"',
  'className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20"'
);

// Also ensure About section has proper spacing
content = content.replace(
  '<section id="about" className="py-32 px-6 max-w-7xl mx-auto">',
  '<section id="about" className="py-24 px-6 max-w-7xl mx-auto">'
);

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('\nAll 3 fixes applied!');
