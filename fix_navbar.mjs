import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

// Find the admin button section (lines 756-767) and replace with nav links + admin button + mobile menu  
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{/* Admin Button */}') && lines[i-1] && lines[i-1].trim() === '') {
    // Find the closing </nav> after this
    let navEnd = -1;
    for (let j = i; j < lines.length; j++) {
      if (lines[j].includes('</nav>')) {
        navEnd = j;
        break;
      }
    }
    if (navEnd === -1) continue;

    console.log(`Replacing lines ${i} to ${navEnd} with new nav content`);

    const newContent = [
      '',
      '  {/* Desktop Nav Links */}',
      '  <div className="hidden md:flex items-center gap-1">',
      '  {navLinks.map((link) => (',
      '  <button',
      '  key={link.label}',
      '  onClick={link.action}',
      '  className="px-3 py-1.5 text-sm font-medium text-[#112D4E] hover:text-[#1A59A7] hover:bg-[#112D4E]/5 rounded-lg transition-all"',
      '  >',
      '  {link.label}',
      '  </button>',
      '  ))}',
      '  </div>',
      '',
      '  <div className="flex items-center gap-2">',
      '  {/* Mobile Menu Toggle */}',
      '  <button',
      '  onClick={() => setIsMenuOpen(!isMenuOpen)}',
      '  className="md:hidden p-2 hover:bg-[#112D4E]/5 rounded-lg transition-colors"',
      '  >',
      '  {isMenuOpen ? <X className="w-5 h-5 text-[#112D4E]" /> : <Menu className="w-5 h-5 text-[#112D4E]" />}',
      '  </button>',
      '  {/* Admin Button */}',
      '  <button',
      '  onClick={handleAdminClick}',
      '  className="p-2 hover:bg-[#112D4E]/5 rounded-lg transition-colors group"',
      '  title="관리자 모드"',
      '  >',
      '  <Lock className={`w-4 h-4 transition-colors ${isEditing ? \'text-[#3F72AF]\' : \'text-[#112D4E] group-hover:text-[#112D4E]\'}`} />',
      '  </button>',
      '  </div>',
      '  </nav>\r',
      '',
      '  {/* Mobile Menu Dropdown */}',
      '  <AnimatePresence>',
      '  {isMenuOpen && (',
      '  <motion.div',
      '  initial={{ opacity: 0, y: -10 }}',
      '  animate={{ opacity: 1, y: 0 }}',
      '  exit={{ opacity: 0, y: -10 }}',
      '  className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 glass rounded-2xl p-4 md:hidden print:hidden"',
      '  >',
      '  <div className="flex flex-col gap-1">',
      '  {navLinks.map((link) => (',
      '  <button',
      '  key={link.label}',
      '  onClick={link.action}',
      '  className="px-4 py-3 text-sm font-medium text-[#112D4E] hover:bg-[#112D4E]/5 rounded-xl transition-all text-left"',
      '  >',
      '  {link.label}',
      '  </button>',
      '  ))}',
      '  </div>',
      '  </motion.div>',
      '  )}',
      '  </AnimatePresence>',
    ];

    // Remove old lines (from the blank line before {/* Admin Button */} to </nav>)
    lines.splice(i - 1, navEnd - i + 2, ...newContent);
    console.log('New nav content inserted successfully!');
    break;
  }
}

content = lines.join('\n');
fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('Navbar fix complete!');
