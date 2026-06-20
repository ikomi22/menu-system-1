#!/usr/bin/env node
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const restaurantsDir = join(ROOT, 'restaurants');

const slugs = readdirSync(restaurantsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

function extractItems(src) {
  const items = [];
  let current = null;
  for (const line of src.split('\n')) {
    const m_id = line.match(/^\s+id:\s*'([^']+)'/);
    if (m_id) {
      if (current?.id && current?.imageUrl) items.push(current);
      current = { id: m_id[1] };
      continue;
    }
    if (!current) continue;
    const m_name = line.match(/^\s+name:\s*'([^']+)'/);
    const m_cat = line.match(/^\s+category:\s*["'`]([^"'`]+)["'`]/);
    const m_img = line.match(/^\s+imageUrl:\s*'([^']+)'/);
    if (m_name) current.name = m_name[1];
    if (m_cat) current.category = m_cat[1];
    if (m_img) current.imageUrl = m_img[1];
  }
  if (current?.id && current?.imageUrl) items.push(current);
  return items;
}

function shortId(url) {
  const m = url.match(/photo-[\w-]+/);
  return m ? m[0] : url.split('/').at(-1).replace(/\?.*/, '');
}

for (const slug of slugs) {
  const menuPath = join(restaurantsDir, slug, 'menu.ts');
  let src;
  try { src = readFileSync(menuPath, 'utf8'); } catch { continue; }

  const items = extractItems(src);
  if (!items.length) continue;

  const total = items.length;
  const local = items.filter(i => !i.imageUrl.startsWith('http')).length;
  const remote = total - local;

  const urlMap = new Map();
  for (const item of items) {
    if (!urlMap.has(item.imageUrl)) urlMap.set(item.imageUrl, []);
    urlMap.get(item.imageUrl).push(item);
  }

  const highUsage = [...urlMap.entries()].filter(([, v]) => v.length >= 3);
  const crossCat = [...urlMap.entries()].filter(([, v]) => {
    const cats = new Set(v.map(i => i.category));
    return cats.size >= 2;
  });

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${slug.toUpperCase()}`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`  Total: ${total}  |  Local: ${local}  |  Remote: ${remote}`);

  if (highUsage.length) {
    console.log(`\n  URLs used 3+ times:`);
    for (const [url, its] of highUsage) {
      console.log(`    [${its.length}×] ${shortId(url)}`);
      for (const i of its) console.log(`         ${i.id.padEnd(5)} ${i.name} (${i.category})`);
    }
  } else {
    console.log(`\n  No URLs used 3+ times.`);
  }

  if (crossCat.length) {
    console.log(`\n  URLs shared across 2+ categories:`);
    for (const [url, its] of crossCat) {
      const cats = [...new Set(its.map(i => i.category))];
      console.log(`    ${shortId(url)} → [${cats.join('] + [')}]`);
      for (const i of its) console.log(`         ${i.id.padEnd(5)} ${i.name} (${i.category})`);
    }
  } else {
    console.log(`\n  No cross-category URL reuse.`);
  }
}

console.log('\n');
