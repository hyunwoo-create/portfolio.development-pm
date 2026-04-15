import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

// Fix 1: Remove the '자기소개서' navTab line that references undefined onSelfIntroClick
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("onSelfIntroClick") && lines[i].includes("자기소개서")) {
    console.log(`Removing line ${i+1}: ${lines[i].trim()}`);
    lines.splice(i, 1);
    i--;
  }
}

// Fix 2: Check Hero props - ensure onAboutClick and onToolsClick are in the signature
// Find the Hero component definition line
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const Hero = ({') && lines[i].includes('onPortfolioClick')) {
    console.log(`Found Hero definition at line ${i+1}`);
    // Check if the calling code passes onAboutClick/onToolsClick
    break;
  }
}

// Fix 3: Remove self-intro view rendering if still present
let selfIntroStart = -1;
let depth = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("view === 'self-intro'") && lines[i].includes('&&')) {
    selfIntroStart = i;
    depth = 0;
    console.log(`Found self-intro view block at line ${i+1}`);
  }
  if (selfIntroStart >= 0) {
    for (const ch of lines[i]) {
      if (ch === '{' || ch === '(') depth++;
      if (ch === '}' || ch === ')') depth--;
    }
    if (depth <= 0 && i > selfIntroStart) {
      console.log(`Removing self-intro view block: lines ${selfIntroStart+1} to ${i+1}`);
      lines.splice(selfIntroStart, i - selfIntroStart + 1);
      break;
    }
  }
}

// Fix 4: Also verify the SelfIntroInResume component exists
let hasSelfIntroInResume = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const SelfIntroInResume')) {
    hasSelfIntroInResume = true;
    console.log(`SelfIntroInResume component found at line ${i+1}`);
    break;
  }
}
if (!hasSelfIntroInResume) {
  console.log('WARNING: SelfIntroInResume component not found!');
}

// Fix 5: Check if SelfIntroInResume is used in Resume
let hasSelfIntroUsage = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<SelfIntroInResume')) {
    hasSelfIntroUsage = true;
    console.log(`SelfIntroInResume usage found at line ${i+1}`);
    break;
  }
}
if (!hasSelfIntroUsage) {
  console.log('WARNING: SelfIntroInResume is not used in Resume!');
}

content = lines.join('\n');
fs.writeFileSync('src/App.tsx', content, 'utf8');

console.log('\nFix complete! Running build test...');
