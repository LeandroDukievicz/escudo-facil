import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourceRoot = join(root, 'packages/core/src');
const outputRoot = join(root, 'apps/landing/site/js/core');

// Only ship the shared rules used by the browser demo. The mobile app keeps
// using the original TypeScript package; the static page receives plain ESM.
const modules = [
  'copy',
  'result',
  'url/lists',
  'url/parse',
  'url/analyzeUrl',
  'text/patterns',
  'text/analyzeText',
];

for (const name of modules) {
  const source = await readFile(join(sourceRoot, `${name}.ts`), 'utf8');
  const javascript = stripTypeScriptTypes(source, { mode: 'strip' })
    .replace(/\b(from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g, '$1$2.js$3')
    .replace(/[ \t]+$/gm, '')
    .replace(/^\s*\n/gm, '');
  const target = join(outputRoot, `${name}.js`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `// Generated from packages/core/src/${name}.ts. Run npm run build:landing to update.\n${javascript}`);
}

console.log(`Generated ${modules.length} browser modules from @escudo/core.`);
