import fs from 'fs';
const path = 'c:/Users/c/Desktop/portfolio/portfolio.basic/src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "{String(value || '').split('\\n').map(line => line + '  ').join('\\n')}",
  "{String(value || '').replace(/\\r\\n|\\n/g, '  \\n')}"
);

fs.writeFileSync(path, content);
console.log("Robust newline fix applied");
