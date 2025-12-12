// check-icons-stale.js — fails if assets/icons.ts is stale vs assets/svgs/*
const fs = require('fs');
const path = require('path');

const svgsDir = path.resolve(process.cwd(), 'assets/svgs');
const iconsFile = path.resolve(process.cwd(), 'assets/icons.ts');

function listSvgs() {
  return fs.readdirSync(svgsDir)
    .filter(f => f.endsWith('.svg'))
    .map(f => f.trim())
    .sort();
}

function parseIconsTsNames(src) {
  // ищем строки импорта из @assets/svgs/*.svg
  const importRe = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]@assets\/svgs\/([^'"]+\.svg)['"];?/g;
  const names = [];
  let m;
  while ((m = importRe.exec(src))) {
    names.push(m[2].trim());
  }
  return names.sort();
}

if (!fs.existsSync(svgsDir)) {
  console.error(`[ERR] Not found: ${svgsDir}`);
  process.exit(1);
}
if (!fs.existsSync(iconsFile)) {
  console.error(`[ERR] Not found: ${iconsFile}. Run: npm run gen:icons`);
  process.exit(1);
}

const svgs = listSvgs();
const iconsSrc = fs.readFileSync(iconsFile, 'utf8');
const imports = parseIconsTsNames(iconsSrc);

// сравниваем
const missingInIcons = svgs.filter(x => !imports.includes(x));
const extraInIcons = imports.filter(x => !svgs.includes(x));

if (missingInIcons.length || extraInIcons.length) {
  console.error('[FAIL] assets/icons.ts is stale vs assets/svgs');
  if (missingInIcons.length) {
    console.error('  Not imported:\n   - ' + missingInIcons.join('\n   - '));
  }
  if (extraInIcons.length) {
    console.error('  Import exists but file missing:\n   - ' + extraInIcons.join('\n   - '));
  }
  console.error('\nRun: npm run gen:icons');
  process.exit(2);
}

console.log('[OK] icons.ts is up-to-date.');
