const fs = require('fs');
const lines = fs.readFileSync('src/components/Resume.tsx', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('<motion.button'));
if (idx !== -1) {
  const insert = `            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#DBE2EF] shadow-sm mb-2">
              <span className="text-[11px] font-black text-[#3F72AF] uppercase tracking-wider">PDF 연결 링크</span>
              <input 
                type="text" 
                value={data.portfolioUrl || ''} 
                onChange={(e) => setData({ ...data, portfolioUrl: e.target.value })}
                placeholder="https://..."
                className="text-[12px] font-medium text-[#112D4E] w-[200px] focus:outline-none placeholder:text-[#DBE2EF]"
              />
            </div>`;
  lines.splice(idx, 0, insert);
  fs.writeFileSync('src/components/Resume.tsx', lines.join('\n'));
  console.log('Fixed Resume.tsx');
} else {
  console.log('Could not find motion.button in Resume.tsx');
}
