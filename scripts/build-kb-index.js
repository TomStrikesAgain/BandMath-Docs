const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const I18N_DIR = path.join(ROOT, 'i18n');
const OUTPUT_DIR = path.join(ROOT, 'src', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'kb_search_index.json');
const LOCALES = ['en', 'fr', 'de', 'es', 'pl'];

function stripNumericPrefix(filenameNoExt) {
  return filenameNoExt.replace(/^\d+_/, '');
}

function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function parseFrontmatter(raw) {
  const fm = {};
  let body = raw;
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (match) {
    body = raw.slice(match[0].length);
    const lines = match[1].split(/\r?\n/);
    for (const line of lines) {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        let val = line.slice(idx + 1).trim();
        val = val.replace(/^['"]|['"]$/g, '');
        if (!isNaN(Number(val)) && val !== '') {
          fm[key] = Number(val);
        } else {
          fm[key] = val;
        }
      }
    }
  }
  return { frontmatter: fm, body };
}

function loadCategoryTranslations(locale) {
  if (locale === 'en') return {};
  const currentJsonPath = path.join(
    I18N_DIR,
    locale,
    'docusaurus-plugin-content-docs',
    'current.json'
  );
  if (!fs.existsSync(currentJsonPath)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(currentJsonPath, 'utf8'));
    const map = {};
    for (const [k, v] of Object.entries(data)) {
      const prefix = 'sidebar.tutorialSidebar.category.';
      if (k.startsWith(prefix) && v && v.message) {
        const enLabel = k.slice(prefix.length);
        map[enLabel] = v.message;
      }
    }
    return map;
  } catch {
    return {};
  }
}

function resolveInternalMarkdownHref(href, locale, currentCategory) {
  if (!href) return href;
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('/doc-assets/') ||
    href.includes('/doc-assets/')
  ) {
    return href;
  }

  let [pathPart, hashPart] = href.split('#');
  const hashSuffix = hashPart ? `#${hashPart}` : '';

  if (pathPart.startsWith('/docs/') || pathPart.startsWith(`/${locale}/docs/`)) {
    return href;
  }

  // Resolve relative path from virtual directory /<currentCategory> (or / for root docs)
  const baseDir = currentCategory ? `/${currentCategory}` : '/';
  const resolved = path.posix.resolve(baseDir, pathPart);
  const segments = resolved.split('/').filter(Boolean);

  if (segments.length === 0) return href;
  const lastIdx = segments.length - 1;
  segments[lastIdx] = stripNumericPrefix(segments[lastIdx].replace(/\.mdx?$/i, ''));

  const localePrefix = locale === 'en' ? '' : `/${locale}`;
  return `${localePrefix}/docs/${segments.join('/')}${hashSuffix}`;
}

function rewriteImageSrc(src, locale, categoryId) {
  if (!src) return src;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
    return src;
  }
  const cleanRel = src.replace(/^\.\//, '');
  if (categoryId) {
    return `/doc-assets/${locale}/${categoryId}/${cleanRel}`;
  }
  return `/doc-assets/${locale}/${cleanRel}`;
}

function extractSectionsAndScreens(body, locale, categoryId, docTitle) {
  const lines = body.split(/\r?\n/);
  const sections = [];
  const screens = [];

  let currentHeading = docTitle || 'Overview';
  let currentId = 'overview';
  let currentLines = [];
  let inCodeFence = false;

  function flushSection() {
    if (currentLines.length === 0 && sections.length === 0) return;
    const content = currentLines.join('\n').trim();
    if (!content && currentId === 'overview') return;

    const sectionScreens = [];
    const mdImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const htmlImgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;

    for (const m of content.matchAll(mdImgRegex)) {
      const alt = m[1] || currentHeading;
      const src = rewriteImageSrc(m[2], locale, categoryId);
      const screenObj = {
        id: `screen-${screens.length + 1}`,
        sectionId: currentId,
        sectionTitle: currentHeading,
        alt,
        src,
      };
      sectionScreens.push(screenObj);
      screens.push(screenObj);
    }

    for (const m of content.matchAll(htmlImgRegex)) {
      const fullTag = m[0];
      const rawSrc = m[1];
      const altMatch = fullTag.match(/alt=["']([^"']*)["']/);
      const alt = altMatch ? altMatch[1] : currentHeading;
      const src = rewriteImageSrc(rawSrc, locale, categoryId);
      const screenObj = {
        id: `screen-${screens.length + 1}`,
        sectionId: currentId,
        sectionTitle: currentHeading,
        alt,
        src,
      };
      sectionScreens.push(screenObj);
      screens.push(screenObj);
    }

    sections.push({
      id: currentId,
      heading: currentHeading,
      content,
      screenshots: sectionScreens,
    });
  }

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeFence = !inCodeFence;
    }
    if (!inCodeFence) {
      const hMatch = line.match(/^(#{2,3})\s+(.+)$/);
      if (hMatch) {
        flushSection();
        currentHeading = hMatch[2].trim();
        currentId = slugifyHeading(currentHeading) || `section-${sections.length + 1}`;
        currentLines = [];
        continue;
      }
    }
    currentLines.push(line);
  }
  flushSection();

  return { sections, screens };
}

function cleanTextForRag(markdown) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/<img[^>]*>/g, '')
    .replace(/<span[^>]*>([\s\S]*?)<\/span>/g, '$1')
    .replace(/<\/?(details|summary)[^>]*>/g, '\n')
    .replace(/:::(note|tip|info|warning|danger|caution)/g, '')
    .replace(/:::/g, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[`*_>#]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function tokenizeForBm25(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s€$£%-]/gu, ' ')
    .split(/\s+/)
    .map(w => w.replace(/^[-]+|[-]+$/g, ''))
    .filter(w => w.length >= 2);
}

function extractFaqPairs(faqBody, locale) {
  const pairs = [];
  const detailRegex = /<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi;
  let idx = 0;
  for (const match of faqBody.matchAll(detailRegex)) {
    const question = match[1].replace(/<[^>]+>/g, '').trim();
    const answerMarkdown = match[2].trim();
    const linkedUrls = [];
    const linkRegex = /(?<!\!)\[([^\]]+)\]\(([^)]+)\)/g;
    for (const lm of answerMarkdown.matchAll(linkRegex)) {
      const href = lm[2];
      if (href.startsWith('/docs/') || href.startsWith(`/${locale}/docs/`)) {
        linkedUrls.push(href.split('#')[0]);
      }
    }
    pairs.push({
      id: `${locale}:faq-${++idx}`,
      question,
      answerMarkdown,
      plainText: cleanTextForRag(`${question}\n${answerMarkdown}`),
      linkedUrls: Array.from(new Set(linkedUrls)),
    });
  }
  return pairs;
}

function computeBm25Idf(articles, faqPairs) {
  const docs = [
    ...articles.map(a => `${a.title} ${a.categoryLabel} ${a.plainText}`),
    ...faqPairs.map(f => f.plainText),
  ];
  const N = docs.length || 1;
  const df = {};
  let totalLen = 0;

  for (const docText of docs) {
    const tokens = tokenizeForBm25(docText);
    totalLen += tokens.length;
    const unique = new Set(tokens);
    for (const tok of unique) {
      df[tok] = (df[tok] || 0) + 1;
    }
  }

  const idf = {};
  for (const [tok, freq] of Object.entries(df)) {
    // Standard Robertson-Spärck Jones BM25 IDF formula
    const val = Math.log(1 + (N - freq + 0.5) / (freq + 0.5));
    idf[tok] = Number(val.toFixed(4));
  }

  return {
    avgDocLength: Math.round(totalLen / N) || 250,
    docCount: N,
    idf,
  };
}

function parseLocaleDocs(locale) {
  const baseDir =
    locale === 'en'
      ? DOCS_DIR
      : path.join(I18N_DIR, locale, 'docusaurus-plugin-content-docs', 'current');

  const effectiveBaseDir = fs.existsSync(baseDir) ? baseDir : DOCS_DIR;
  const catTranslations = loadCategoryTranslations(locale);

  const categories = [];
  const articles = [];

  const entries = fs.readdirSync(effectiveBaseDir, { withFileTypes: true });

  // 1. Read Category folders
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const categoryId = entry.name;
    const catDir = path.join(effectiveBaseDir, categoryId);
    const enCatDir = path.join(DOCS_DIR, categoryId);

    let catMeta = { label: categoryId.replace(/_/g, ' '), position: 50 };
    const catJsonPath = fs.existsSync(path.join(catDir, '_category_.json'))
      ? path.join(catDir, '_category_.json')
      : path.join(enCatDir, '_category_.json');

    if (fs.existsSync(catJsonPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(catJsonPath, 'utf8'));
        catMeta = { ...catMeta, ...parsed };
      } catch {}
    }

    const translatedLabel = catTranslations[catMeta.label] || catMeta.label;
    const catArticles = [];

    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const fullPath = path.join(catDir, file);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const { frontmatter, body } = parseFrontmatter(raw);

      const fileNoExt = file.replace(/\.md$/, '');
      const cleanSlug = stripNumericPrefix(fileNoExt);
      const numPrefixMatch = fileNoExt.match(/^(\d+)_/);
      const inferredPos = numPrefixMatch ? Number(numPrefixMatch[1]) : 50;
      const position =
        frontmatter.sidebar_position !== undefined
          ? Number(frontmatter.sidebar_position)
          : inferredPos;

      // Extract H1 title
      let bodyWithoutH1 = body;
      let title = frontmatter.title || frontmatter.sidebar_label || cleanSlug.replace(/_/g, ' ');
      const h1Match = body.match(/^\s*#\s+(.+?)\r?\n/);
      if (h1Match) {
        title = h1Match[1].trim();
        bodyWithoutH1 = body.slice(h1Match[0].length);
      }

      const sidebarLabel = frontmatter.sidebar_label || title;

      // Rewrite relative markdown links & image paths in bodyWithoutH1
      const processedBody = bodyWithoutH1
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
          return `![${alt}](${rewriteImageSrc(src, locale, categoryId)})`;
        })
        .replace(/(?<!\!)\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
          return `[${text}](${resolveInternalMarkdownHref(href, locale, categoryId)})`;
        });

      const { sections, screens } = extractSectionsAndScreens(
        processedBody,
        locale,
        categoryId,
        title
      );

      const localePrefix = locale === 'en' ? '' : `/${locale}`;
      const canonicalUrl = `${localePrefix}/docs/${categoryId}/${cleanSlug}`;

      const articleObj = {
        id: `${locale}:${categoryId}/${cleanSlug}`,
        locale,
        categoryId,
        categoryLabel: translatedLabel,
        categoryPosition: catMeta.position || 50,
        slug: cleanSlug,
        rawFileSlug: fileNoExt,
        routeSegments: [categoryId, cleanSlug],
        url: canonicalUrl,
        title,
        sidebarLabel,
        position,
        body: processedBody,
        plainText: cleanTextForRag(`${title}\n${processedBody}`),
        sections,
        screenshots: screens,
      };

      catArticles.push(articleObj);
      articles.push(articleObj);
    }

    catArticles.sort((a, b) => a.position - b.position || a.title.localeCompare(b.title));

    categories.push({
      id: categoryId,
      label: translatedLabel,
      position: catMeta.position || 50,
      articles: catArticles.map(a => ({
        id: a.id,
        slug: a.slug,
        rawFileSlug: a.rawFileSlug,
        url: a.url,
        title: a.title,
        sidebarLabel: a.sidebarLabel,
        position: a.position,
        screenshotCount: a.screenshots.length,
      })),
    });
  }

  // 2. Read root-level docs (FAQ.md, 97_Support.md, 98_Terms_of_Service.md, Privacy_Policy.md)
  const rootFiles = entries.filter(e => e.isFile() && e.name.endsWith('.md')).map(e => e.name);
  const rootArticles = [];
  for (const file of rootFiles) {
    const fullPath = path.join(effectiveBaseDir, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { frontmatter, body } = parseFrontmatter(raw);

    const fileNoExt = file.replace(/\.md$/, '');
    const cleanSlug = stripNumericPrefix(fileNoExt);
    const numPrefixMatch = fileNoExt.match(/^(\d+)_/);
    const inferredPos = numPrefixMatch ? Number(numPrefixMatch[1]) : 99;
    const position =
      frontmatter.sidebar_position !== undefined
        ? Number(frontmatter.sidebar_position)
        : inferredPos;

    let bodyWithoutH1 = body;
    let title = frontmatter.title || frontmatter.sidebar_label || cleanSlug.replace(/_/g, ' ');
    const h1Match = body.match(/^\s*#\s+(.+?)\r?\n/);
    if (h1Match) {
      title = h1Match[1].trim();
      bodyWithoutH1 = body.slice(h1Match[0].length);
    }

    const sidebarLabel = frontmatter.sidebar_label || title;

    const processedBody = bodyWithoutH1
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
        return `![${alt}](${rewriteImageSrc(src, locale, null)})`;
      })
      .replace(/(?<!\!)\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
        return `[${text}](${resolveInternalMarkdownHref(href, locale, null)})`;
      });

    const { sections, screens } = extractSectionsAndScreens(
      processedBody,
      locale,
      null,
      title
    );

    const localePrefix = locale === 'en' ? '' : `/${locale}`;
    const canonicalUrl = `${localePrefix}/docs/${cleanSlug}`;

    const articleObj = {
      id: `${locale}:${cleanSlug}`,
      locale,
      categoryId: null,
      categoryLabel: 'Resources & Legal',
      categoryPosition: 99,
      slug: cleanSlug,
      rawFileSlug: fileNoExt,
      routeSegments: [cleanSlug],
      url: canonicalUrl,
      title,
      sidebarLabel,
      position,
      body: processedBody,
      plainText: cleanTextForRag(`${title}\n${processedBody}`),
      sections,
      screenshots: screens,
    };

    rootArticles.push(articleObj);
    articles.push(articleObj);
  }

  categories.sort((a, b) => a.position - b.position);
  rootArticles.sort((a, b) => a.position - b.position);

  const faqArticle = articles.find(a => a.slug === 'FAQ');
  const faqPairs = faqArticle ? extractFaqPairs(faqArticle.body, locale) : [];
  const bm25 = computeBm25Idf(articles, faqPairs);

  return {
    categories,
    rootArticles: rootArticles.map(a => ({
      id: a.id,
      slug: a.slug,
      rawFileSlug: a.rawFileSlug,
      url: a.url,
      title: a.title,
      sidebarLabel: a.sidebarLabel,
      position: a.position,
      screenshotCount: a.screenshots.length,
    })),
    articles,
    faqPairs,
    bm25,
  };
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const index = {
    generatedAt: new Date().toISOString(),
    locales: {},
  };

  let totalArticles = 0;
  let totalScreenshots = 0;

  for (const locale of LOCALES) {
    const parsed = parseLocaleDocs(locale);
    index.locales[locale] = parsed;
    totalArticles += parsed.articles.length;
    for (const art of parsed.articles) {
      totalScreenshots += art.screenshots.length;
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2), 'utf8');
  console.log(
    `[build-kb-index] Built src/data/kb_search_index.json across ${LOCALES.length} locales (${totalArticles} total articles, ${totalScreenshots} mapped section screenshots).`
  );
}

main();
