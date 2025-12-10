const fs = require('fs');
const path = require('path');

const svgsDir = path.resolve(__dirname, '../src/app/assets/svgs');
const outputFile = path.resolve(__dirname, '../src/app/assets/icons.ts');

function toEnumName(file) {
  return file.replace('.svg', '').replace(/[- ]/g, '_').toUpperCase();
}

function toComponentName(file) {
  const name = file.replace('.svg', '');
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const files = fs.readdirSync(svgsDir).filter(f => f.endsWith('.svg'));

let imports = '';
let enumEntries = '';
let registryEntries = '';

files.forEach(file => {
  const componentName = toComponentName(file);
  const enumName = toEnumName(file);
  const importPath = `./svgs/${file}`;

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

fs.writeFileSync(outputFile, content);

console.log(`Generated ${outputFile} with ${files.length} icons.`);
