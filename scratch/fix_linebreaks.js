import fs from 'fs';
const path = 'c:/Users/c/Desktop/portfolio/portfolio.basic/src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix EditableText p component
content = content.replace(
  'p: ({node, ...props}) => <span className={multiline ? "block mb-2 last:mb-0" : "inline"} {...props} />,',
  'p: ({node, ...props}) => <span className={multiline ? "block last:mb-0" : "inline"} {...props} />,'
);

// 2. Fix ProjectDetail p component
content = content.replace(
  'p: ({node, ...props}) => <p className="whitespace-pre-wrap mb-4 last:mb-0" {...props} />,',
  'p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,'
);

fs.writeFileSync(path, content);
console.log("Global double break fix applied");
