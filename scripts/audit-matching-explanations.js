import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const modules = JSON.parse(readFileSync(join(ROOT, 'public/data/learningModules.json'), 'utf-8'));

const mtModules = modules.filter(m => m.learningMode === 'matching');
let totalMissing = 0;

for (const mod of mtModules) {
  const level = (Array.isArray(mod.level) ? mod.level[0] : mod.level).toUpperCase();
  try {
    const data = JSON.parse(readFileSync(join(ROOT, 'public', mod.dataPath), 'utf-8'));
    const missing = data.filter(item => !item.explanation);
    if (missing.length > 0) {
      totalMissing += missing.length;
      console.log(`${level} | ${mod.id} — ${missing.length}/${data.length} sin explicación`);
      for (const item of missing) {
        console.log(`   "${item.left}" → "${item.right}"`);
      }
      console.log();
    }
  } catch {}
}

console.log(`Total sin explicación: ${totalMissing}`);
