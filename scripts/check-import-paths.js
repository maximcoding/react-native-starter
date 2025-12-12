// check-import-paths.js — fails on deep relatives and raw assets paths
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (exts.has(path.extname(entry.name))) yield p;
  }
}

const BAD = [];
for (const file of walk(SRC)) {
  const src = fs.readFileSync(file, 'utf8');
  // deep-relative (3+ levels up)
  const deepRel = /from\s+['"](\.{2}\/){3,}[^'"]+['"]/g;
  // raw asset path (../../assets or @/../assets)
  const rawAssets = /from\s+['"](\.{1,2}\/)+assets\/[^'"]+['"]/g;

  if (deepRel.test(src)) BAD.push({ file, rule: 'deep-relative' });
  else if (rawAssets.test(src)) BAD.push({ file, rule: 'raw-assets-path' });
}

if (BAD.length) {
  console.error('[FAIL] Import path policy violated:');
  for (const b of BAD) console.error(` - ${b.rule}: ${path.relative(ROOT, b.file)}`);
  console.error('\nUse aliases: @assets/* and @/*');
  process.exit(3);
}

console.log('[OK] import path policy passed.');
