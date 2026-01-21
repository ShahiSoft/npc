const fs = require('fs');
const p = 'openapi/spec2.json';
const s = fs.readFileSync(p,'utf8');
console.log('len', s.length);
try{
  const o = JSON.parse(s);
  console.log('parsed ok');
  console.log('paths keys', Object.keys(o.paths || {}).length);
} catch(e){
  console.error('parse error', e && e.message);
  // dump last 200 chars for inspection
  console.error('tail:', JSON.stringify(s.slice(-200)));
  process.exit(1);
}
