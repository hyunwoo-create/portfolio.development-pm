import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

// Line 2895 (0-indexed: 2894) is a blank line between </section> and </div>
// Replace it with SelfIntroInResume usage
lines[2894] = '  {/* Self Introduction - merged into resume */}\r\n  <SelfIntroInResume isEditing={isEditing} data={data} setData={setData} />\r';

console.log('Inserted SelfIntroInResume at line 2895');
console.log('Context:');
for (let i = 2892; i < 2900 && i < lines.length; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}

content = lines.join('\n');
fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('\nDone! Now building...');
