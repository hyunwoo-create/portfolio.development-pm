import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Debug: show the exact bytes around line 3282-3284
const lines = content.split('\n');
for (let i = 3281; i <= 3285 && i < lines.length; i++) {
  const line = lines[i];
  const hex = Buffer.from(line).toString('hex');
  console.log(`Line ${i+1}: "${line}" | hex: ${hex}`);
}

// Direct line-based fix: remove line 3284 which is the `\t)}`
const targetLine = lines[3283]; // 0-indexed, so line 3284
console.log(`\nTarget line to remove (3284): "${targetLine}"`);

if (targetLine.trim() === ')}') {
  lines.splice(3283, 1);
  console.log('Removed line 3284 successfully!');
} else {
  console.log('Line 3284 does not match expected pattern. Trying alternate approach...');
  // Find and remove any line that is just `)}` between the Navbar closing tag and <main>
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === ')}' && i > 0 && i < lines.length - 1) {
      const prevLine = lines[i-1].trim();
      const nextLine = lines[i+1].trim();
      if (prevLine === '/>' && nextLine === '<main>') {
        console.log(`Found target at line ${i+1}, removing...`);
        lines.splice(i, 1);
        break;
      }
    }
  }
}

// Also remove the self-intro view rendering block
let inSelfIntroBlock = false;
let selfIntroStart = -1;
let braceCount = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("view === 'self-intro'")) {
    inSelfIntroBlock = true;
    selfIntroStart = i;
    braceCount = 0;
  }
  if (inSelfIntroBlock) {
    for (const ch of lines[i]) {
      if (ch === '(') braceCount++;
      if (ch === ')') braceCount--;
    }
    if (braceCount <= 0 && i > selfIntroStart) {
      console.log(`Removing self-intro block from lines ${selfIntroStart+1} to ${i+1}`);
      lines.splice(selfIntroStart, i - selfIntroStart + 1);
      break;
    }
  }
}

content = lines.join('\n');
fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('\nFix applied. Verifying...');

// Verify
const verify = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
for (let i = 3277; i < 3290 && i < verify.length; i++) {
  console.log(`${i+1}: ${verify[i]}`);
}
