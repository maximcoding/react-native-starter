const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');
const namespaces = {};
const languages = fs.readdirSync(localesDir);

for (const lang of languages) {
  const nsPath = path.join(localesDir, lang);
  const files = fs.readdirSync(nsPath);

  for (const file of files) {
    const ns = file.replace('.json', '');
    const json = require(path.join(nsPath, file));

    namespaces[ns] = namespaces[ns] || {};
    namespaces[ns] = { ...namespaces[ns], ...json };
  }
}

function toTS(obj, indent = 2) {
  const spacing = ' '.repeat(indent);
  return Object.entries(obj)
    .map(([k, v]) => {
      if (typeof v === 'string') return `${spacing}${JSON.stringify(k)}: string;`;
      return `${spacing}${JSON.stringify(k)}: {\n${toTS(v, indent + 2)}\n${spacing}};`
    })
    .join('\n');
}

let dts = `// AUTO-GENERATED — DO NOT EDIT

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
`;

for (const [ns, obj] of Object.entries(namespaces)) {
  dts += `      '${ns}': {\n${toTS(obj, 8)}\n      };\n`;
}

dts += `
    };
  }
}
`;

fs.writeFileSync(path.join(__dirname, 'i18n-types.d.ts'), dts);
console.log('i18n types generated.');
