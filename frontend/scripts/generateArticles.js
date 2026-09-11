import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fullNotesDir = '/home/murilo/Documents/main-obsidian/6 - FullNotes';
const outputFile = path.join(__dirname, '../src/modules/articles/data/articlesData.json');

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function scanDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(scanDir(fullPath));
    } else if (item.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = scanDir(fullNotesDir);
console.log(`Encontradas ${files.length} notas em ${fullNotesDir}`);

const parsedArticles = [];
const usedSlugs = new Set();

for (const filePath of files) {
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const baseName = path.basename(filePath, '.md');
  const relPath = path.relative(fullNotesDir, filePath);
  const category = path.dirname(relPath).replace(/[\/\\]/g, ' · ');

  // Hide / exclude Português and Biologia studies
  const catLower = category.toLowerCase();
  if (
    catLower === 'biologia' ||
    catLower.startsWith('biologia ·') ||
    catLower === 'português' ||
    catLower === 'portugues' ||
    catLower.startsWith('português ·') ||
    catLower.startsWith('portugues ·')
  ) {
    continue;
  }

  let slug = slugify(baseName);
  if (usedSlugs.has(slug)) {
    slug = slug + '-' + slugify(path.dirname(relPath).split('/').pop() || 'note');
  }
  usedSlugs.add(slug);

  const lines = rawContent.split('\n');
  let dateStr = '';
  let tags = [];
  let status = '';
  const headers = [];

  // Parse first line for date
  const firstLine = (lines[0] || '').trim();
  const dateMatch = firstLine.match(/^(\d{4})[-/.](\d{2})[-/.](\d{2})/);
  if (dateMatch) {
    let y = parseInt(dateMatch[1], 10);
    let m = parseInt(dateMatch[2], 10);
    let d = parseInt(dateMatch[3], 10);

    // Swap if month was typed as day (e.g. 2026-13-03)
    if (m > 12 && d <= 12) {
      const temp = m;
      m = d;
      d = temp;
    }
    dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  } else {
    const mtime = fs.statSync(filePath).mtime;
    const y = mtime.getFullYear();
    const m = String(mtime.getMonth() + 1).padStart(2, '0');
    const d = String(mtime.getDate()).padStart(2, '0');
    dateStr = `${y}-${m}-${d}`;
  }

  const [yearStr, monthNumStr, dayStr] = dateStr.split('-');
  const monthIndex = Math.max(0, Math.min(11, parseInt(monthNumStr, 10) - 1));
  const monthName = monthNames[monthIndex] || 'Geral';
  const period = `${yearStr} - ${monthName}`;
  const displayDate = `${parseInt(dayStr, 10)} de ${monthName.toLowerCase()} de ${yearStr}`;

  // Extract tags, status, headers
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Status: [[developing]]
    const statusMatch = line.match(/Status:\s*\[\[(.*?)\]\]/i);
    if (statusMatch) {
      status = statusMatch[1].trim();
    }

    // Tags: [[cpu]] | [[clock]]
    if (line.includes('Tags:')) {
      const tagMatches = line.matchAll(/\[\[(.*?)\]\]/g);
      for (const tm of tagMatches) {
        const cleanTag = tm[1].trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
        if (cleanTag && !tags.includes('#' + cleanTag)) {
          tags.push('#' + cleanTag);
        }
      }
    }

    // Headers (# , ## , ### )
    const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const headerTitle = headerMatch[2].replace(/\[\[(.*?)\]\]/g, '$1').trim();
      const headerId = slugify(headerTitle) || `secao-${headers.length + 1}`;
      if (!headers.some(h => h.id === headerId)) {
        headers.push({ id: headerId, title: headerTitle, level });
      }
    }
  }

  // Convert Obsidian image syntax: ![[image.png]] or ![[image.png|width]]
  // pointing to /media/image.png (our symlink in public/media)
  const processedMarkdown = rawContent
    .replace(/!\[\[(.*?)(\|.*?)?\]\]/g, (match, filename) => {
      const cleanFilename = filename.trim();
      return `\n\n![${cleanFilename}](/media/${encodeURIComponent(cleanFilename)})\n\n`;
    })
    // Remove Obsidian wiki links brackets [[Note]] -> Note
    .replace(/\[\[(.*?)\]\]/g, '$1');

  // Extract excerpt: first descriptive line after metadata
  let excerpt = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('Status:') &&
      !trimmed.startsWith('Tags:') &&
      !trimmed.startsWith('----') &&
      !trimmed.startsWith('---') &&
      !/^\d{4}[-/.]\d{2}[-/.]\d{2}/.test(trimmed) &&
      !trimmed.startsWith('![[')
    ) {
      excerpt = trimmed.replace(/\[\[(.*?)\]\]/g, '$1').replace(/[*_`]/g, '');
      if (excerpt.length > 220) {
        excerpt = excerpt.slice(0, 217) + '...';
      }
      break;
    }
  }
  if (!excerpt) {
    excerpt = `Notas de estudo sobre ${baseName}. Organizado em ${category}.`;
  }

  // Word count & read time
  const wordCount = rawContent.split(/\s+/).filter(Boolean).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 180));
  const readTime = `${readTimeMin} min de leitura`;

  // Strip duplicate raw date and obsidian metadata block from contentRaw
  const cleanedMarkdown = processedMarkdown
    .replace(/^\s*\d{4}[-/.]\d{2}[-/.]\d{2}(\s+\d{1,2}:\d{2})?\s*\n+/, '')
    .replace(/^(Status:\s*[^\n]*\n+)?(Tags:\s*[^\n]*\n+)?(----*\n+)?/, '')
    .trimStart();

  // Clean empty references from markdown and remove from headers
  let finalMarkdown = cleanedMarkdown;
  let finalHeaders = [...headers];

  const refRegex = /(?:^|\n)(?:----\s*\n+)?(#+\s*(?:Referências|Referencias|References)\s*\n*)([\s\S]*)$/i;
  const refMatch = finalMarkdown.match(refRegex);
  if (refMatch) {
    const refContent = refMatch[2].trim();
    if (!refContent || refContent.replace(/^---+$/gm, '').trim().length === 0) {
      finalMarkdown = finalMarkdown.replace(refRegex, '').trimEnd();
      finalHeaders = finalHeaders.filter(h => 
        !['referencias', 'referencia', 'references', 'reference'].includes(h.id.toLowerCase())
      );
    }
  }

  // Check if article has real content
  const contentWithoutHeadings = finalMarkdown
    .replace(/^#+.*$/gm, '')
    .replace(/^---+$/gm, '')
    .trim();

  // If there is no real content, hide it
  if (!contentWithoutHeadings) {
    continue;
  }

  parsedArticles.push({
    id: slug,
    slug,
    title: baseName,
    category,
    date: dateStr,
    displayDate,
    period,
    tags: tags.length ? tags : ['#' + slugify(category.split(' · ').pop() || 'estudo')],
    status,
    headers: finalHeaders,
    excerpt,
    readTime,
    contentRaw: finalMarkdown
  });
}

// Sort newest first
parsedArticles.sort((a, b) => b.date.localeCompare(a.date));

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(parsedArticles, null, 2), 'utf8');

console.log(`Gerado com sucesso: ${parsedArticles.length} artigos em ${outputFile}`);
