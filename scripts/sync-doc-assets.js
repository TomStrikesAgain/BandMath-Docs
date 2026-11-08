const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const I18N_DIR = path.join(ROOT, 'i18n');
const PUBLIC_DIR = path.join(ROOT, 'public');
const STATIC_DIR = path.join(ROOT, 'static');
const LOCALES = ['fr', 'de', 'es', 'pl'];

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function syncAssetsForTree(sourceRoot, targetRoot) {
  if (!fs.existsSync(sourceRoot)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const categoryName = entry.name;
    const assetsDir = path.join(sourceRoot, categoryName, 'assets');
    if (fs.existsSync(assetsDir)) {
      const destAssetsDir = path.join(targetRoot, categoryName, 'assets');
      fs.mkdirSync(destAssetsDir, { recursive: true });
      for (const file of fs.readdirSync(assetsDir)) {
        if (file === '.DS_Store') continue;
        const srcFile = path.join(assetsDir, file);
        const destFile = path.join(destAssetsDir, file);
        if (fs.statSync(srcFile).isFile()) {
          fs.copyFileSync(srcFile, destFile);
          count++;
        }
      }
    }
  }
  return count;
}

function verifyMarkdownAssetIntegrity(baseDir) {
  if (!fs.existsSync(baseDir)) return;
  const mdFiles = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.md')) mdFiles.push(full);
    }
  }
  walk(baseDir);

  const mdImgRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
  const htmlImgRegex = /<img[^>]+src=["']([^"']+)["']/g;

  for (const mdFile of mdFiles) {
    const content = fs.readFileSync(mdFile, 'utf8');
    if (content.includes('https://itsbandmath.com/automated-assets/')) {
      console.error(`[ASSET ERROR] Legacy automated-assets URL found in ${mdFile}`);
      process.exit(1);
    }
    const matches = [
      ...Array.from(content.matchAll(mdImgRegex), m => m[1]),
      ...Array.from(content.matchAll(htmlImgRegex), m => m[1]),
    ];
    for (const rawSrc of matches) {
      if (rawSrc.startsWith('http://') || rawSrc.startsWith('https://') || rawSrc.startsWith('/')) continue;
      const resolved = path.resolve(path.dirname(mdFile), rawSrc);
      if (!fs.existsSync(resolved)) {
        console.error(`[ASSET ERROR] Missing local image ${rawSrc} referenced in ${mdFile} (expected at ${resolved})`);
        process.exit(1);
      }
    }
  }
}

function main() {
  // 1. Copy static/img -> public/img
  copyDirRecursive(path.join(STATIC_DIR, 'img'), path.join(PUBLIC_DIR, 'img'));

  // 2. Sync docs/<Category>/assets/* -> public/doc-assets/en/<Category>/assets/*
  let total = syncAssetsForTree(DOCS_DIR, path.join(PUBLIC_DIR, 'doc-assets', 'en'));

  // 3. Sync i18n/<locale>/.../assets/* -> public/doc-assets/<locale>/<Category>/assets/*
  for (const loc of LOCALES) {
    const locDocsDir = path.join(I18N_DIR, loc, 'docusaurus-plugin-content-docs', 'current');
    total += syncAssetsForTree(locDocsDir, path.join(PUBLIC_DIR, 'doc-assets', loc));
  }

  // 4. Verify zero automated-assets leaks and zero missing image files
  verifyMarkdownAssetIntegrity(DOCS_DIR);
  verifyMarkdownAssetIntegrity(I18N_DIR);

  console.log(`[sync-doc-assets] Synced ${total} documentation screenshots to public/doc-assets/ (0 broken image links).`);
}

main();
