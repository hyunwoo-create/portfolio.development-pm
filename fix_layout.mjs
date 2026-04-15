import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Use full width - remove max-w-7xl from text container
const oldText = 'className="relative z-20 w-full max-w-7xl mx-auto px-8 lg:px-12 pt-24 lg:pt-28 pointer-events-none"';
const newText = 'className="relative z-20 w-full px-10 lg:px-20 pt-24 lg:pt-28 pointer-events-none"';

if (content.includes(oldText)) {
  content = content.replace(oldText, newText);
  console.log('✓ Full width text container');
} else {
  console.log('✗ Could not find text container');
}

// 2. Make image bigger
const oldImg = 'className="relative w-[320px] h-[420px] md:w-[400px] md:h-[520px] lg:w-[480px] lg:h-[620px] pointer-events-auto"';
const newImg = 'className="relative w-[360px] h-[480px] md:w-[440px] md:h-[580px] lg:w-[540px] lg:h-[700px] pointer-events-auto"';

if (content.includes(oldImg)) {
  content = content.replace(oldImg, newImg);
  console.log('✓ Image size increased');
} else {
  console.log('✗ Could not find image size');
}

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('\n✅ Done!');
