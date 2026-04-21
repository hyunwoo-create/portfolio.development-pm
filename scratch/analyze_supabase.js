const fs = require('fs');
const d = JSON.parse(fs.readFileSync('./supabase_data.json', 'utf-8'));

console.log('=== Supabase Data Keys ===');
console.log('Total keys:', Object.keys(d).length);
console.log('Keys:', Object.keys(d));
console.log();

for (const k of Object.keys(d)) {
  const v = d[k];
  if (typeof v === 'string' && v.length > 200) {
    console.log(`${k}: [string, ${v.length} chars]`);
  } else if (Array.isArray(v)) {
    console.log(`${k}: [array, ${v.length} items]`);
    if (v.length > 0 && v.length <= 3) {
      console.log('  sample:', JSON.stringify(v[0]).substring(0, 300));
    }
  } else if (typeof v === 'object' && v !== null) {
    const keys = Object.keys(v);
    console.log(`${k}: {object, keys: [${keys.join(', ')}]}`);
    // Show non-empty values
    for (const subK of keys) {
      const subV = v[subK];
      if (Array.isArray(subV)) {
        console.log(`  ${subK}: [array, ${subV.length} items]`);
      } else if (typeof subV === 'string' && subV.length > 0) {
        console.log(`  ${subK}: "${subV.substring(0, 100)}${subV.length > 100 ? '...' : ''}"`);
      } else if (typeof subV === 'object' && subV !== null) {
        console.log(`  ${subK}: ${JSON.stringify(subV).substring(0, 150)}`);
      } else if (subV) {
        console.log(`  ${subK}:`, subV);
      }
    }
  } else {
    console.log(`${k}:`, v);
  }
  console.log();
}
