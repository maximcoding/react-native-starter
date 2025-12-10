// generate-icons.js
const fs = require('fs');
const path = require('path');

const svgsDir = path.resolve(__dirname, '../assets/svgs');
const outputFile = path.resolve(__dirname, '../assets/icons.ts');

function toEnumName(file) {
  return file.replace('.svg', '').replace(/[- ]/g, '_').toUpperCase();
}

function toComponentName(file) {
  const name = file.replace('.svg', '');
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const files = fs.readdirSync(svgsDir).filter(f => f.endsWith('.svg')).sort();

let imports = '';
let enumEntries = '';
let registryEntries = '';

files.forEach(file => {
  const componentName = toComponentName(file);
  const enumName = toEnumName(file);
  // use alias-based import
  const importPath = `@assets/svgs/${file}`;

  imports += `import ${componentName} from '${importPath}';\n`;
  enumEntries += `  ${enumName} = '${enumName}',\n`;
  registryEntries += `  [IconName.${enumName}]: ${componentName},\n`;
});

const content = `
// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY
// Run: npm run gen:icons

${imports}

export enum IconName {
${enumEntries}
}

export const AppIcon = {
${registryEntries}
} as const;

export type IconNameType = keyof typeof AppIcon;
`;

fs.writeFileSync(outputFile, content, 'utf8');