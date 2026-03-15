/**
 * Script para encontrar strings hardcodeados en componentes React
 * Busca texto visible en JSX que no use t() ni sea una clave técnica
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC_DIR = 'src';
const EXTENSIONS = ['.tsx', '.ts'];

// Patrones que indican texto hardcodeado en JSX
const HARDCODED_PATTERNS = [
  // Texto entre tags JSX: >Some Text<
  { regex: />([A-Z][a-zA-Z\s,!?'.:()-]{3,})</g, label: 'JSX text content' },
  // aria-label con string literal
  { regex: /aria-label=["']([^"']{4,})["']/g, label: 'aria-label' },
  // title con string literal  
  { regex: /title=["']([^"']{4,})["']/g, label: 'title attr' },
  // placeholder con string literal (no variable)
  { regex: /placeholder=["']([^"']{4,})["']/g, label: 'placeholder' },
  // toast calls con strings literales
  { regex: /toast\.\w+\(['"]([^'"]{3,})['"],\s*['"]([^'"]{3,})['"]/g, label: 'toast call' },
];

// Patrones a ignorar (no son texto de UI)
const IGNORE_PATTERNS = [
  /^[a-z-_]+$/, // solo lowercase/guiones (clases CSS, keys)
  /^\d+$/, // solo números
  /^#[0-9a-fA-F]+$/, // colores hex
  /^rgb|^rgba|^hsl/, // colores
  /^\s*$/, // solo espacios
  /^[A-Z_]+$/, // constantes
  /^https?:\/\//, // URLs
  /^\//, // paths
  /^\{/, // expresiones JSX
  /^data-/, // data attributes
  /^aria-/, // aria attributes
  /^on[A-Z]/, // event handlers
  /^className/, // className
  /^style/, // style
  /^key=/, // key prop
  /^id=/, // id
  /^type=/, // type
  /^role=/, // role
  /^tabIndex/, // tabIndex
  /^ref=/, // ref
  /^src=/, // src
  /^alt=/, // alt (images)
  /^href=/, // href
  /^target=/, // target
  /^rel=/, // rel
  /^min=|^max=|^step=/, // input attrs
  /^disabled=|^checked=|^selected=/, // boolean attrs
  /^value=\{/, // dynamic value
  /^defaultValue=\{/, // dynamic defaultValue
  /^onChange=|^onClick=|^onSubmit=/, // handlers
  /^children=/, // children prop
  /^content=\{/, // dynamic content
  /^format=/, // format prop
  /^mode=/, // mode prop
  /^variant=/, // variant prop
  /^size=/, // size prop
  /^color=/, // color prop
  /^width=|^height=/, // dimensions
  /^duration=/, // duration
  /^delay=/, // delay
  /^easing=/, // easing
  /^animation=/, // animation
  /^transition=/, // transition
  /^transform=/, // transform
  /^opacity=/, // opacity
  /^zIndex=/, // zIndex
  /^overflow=/, // overflow
  /^position=/, // position
  /^display=/, // display
  /^flex=/, // flex
  /^grid=/, // grid
  /^gap=/, // gap
  /^padding=|^margin=/, // spacing
  /^border=/, // border
  /^background=/, // background
  /^font=/, // font
  /^text=/, // text
  /^line=/, // line
  /^letter=/, // letter
  /^word=/, // word
  /^white=/, // white-space
  /^cursor=/, // cursor
  /^pointer=/, // pointer
  /^user=/, // user-select
  /^box=/, // box-shadow
  /^outline=/, // outline
  /^list=/, // list-style
  /^table=/, // table
  /^vertical=/, // vertical-align
  /^horizontal=/, // horizontal-align
  /^align=/, // align
  /^justify=/, // justify
  /^wrap=/, // wrap
  /^direction=/, // direction
  /^order=/, // order
  /^grow=/, // grow
  /^shrink=/, // shrink
  /^basis=/, // basis
  /^columns=/, // columns
  /^rows=/, // rows
  /^areas=/, // areas
  /^template=/, // template
  /^auto=/, // auto
  /^repeat=/, // repeat
  /^minmax=/, // minmax
  /^span=/, // span
  /^start=|^end=/, // start/end
  /^left=|^right=|^top=|^bottom=/, // position
  /^inset=/, // inset
  /^clip=/, // clip
  /^mask=/, // mask
  /^filter=/, // filter
  /^backdrop=/, // backdrop
  /^mix=/, // mix-blend
  /^isolation=/, // isolation
  /^appearance=/, // appearance
  /^resize=/, // resize
  /^scroll=/, // scroll
  /^snap=/, // snap
  /^touch=/, // touch
  /^will=/, // will-change
  /^contain=/, // contain
  /^content=/, // content
  /^counter=/, // counter
  /^quotes=/, // quotes
  /^orphans=|^widows=/, // orphans/widows
  /^page=/, // page
  /^break=/, // break
  /^column=/, // column
  /^row=/, // row
  /^caption=/, // caption
  /^empty=/, // empty-cells
  /^border-collapse=/, // border-collapse
  /^border-spacing=/, // border-spacing
  /^table-layout=/, // table-layout
  /^visibility=/, // visibility
  /^backface=/, // backface-visibility
  /^perspective=/, // perspective
  /^transform-origin=/, // transform-origin
  /^transform-style=/, // transform-style
  /^animation-name=/, // animation-name
  /^animation-duration=/, // animation-duration
  /^animation-timing=/, // animation-timing
  /^animation-delay=/, // animation-delay
  /^animation-iteration=/, // animation-iteration
  /^animation-direction=/, // animation-direction
  /^animation-fill=/, // animation-fill
  /^animation-play=/, // animation-play
  /^transition-property=/, // transition-property
  /^transition-duration=/, // transition-duration
  /^transition-timing=/, // transition-timing
  /^transition-delay=/, // transition-delay
];

function shouldIgnore(text) {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 3) return true;
  return IGNORE_PATTERNS.some(p => p.test(trimmed));
}

function getAllFiles(dir, files = []) {
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      getAllFiles(fullPath, files);
    } else if (EXTENSIONS.includes(extname(item))) {
      files.push(fullPath);
    }
  }
  return files;
}

function analyzeFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const issues = [];

  // Skip files that don't have JSX
  if (!content.includes('return (') && !content.includes('return(')) return issues;

  const lines = content.split('\n');

  lines.forEach((line, lineNum) => {
    const trimmedLine = line.trim();

    // Skip comments
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) return;
    // Skip import lines
    if (trimmedLine.startsWith('import ')) return;
    // Skip lines that already use t()
    if (trimmedLine.includes("t('") || trimmedLine.includes('t("') || trimmedLine.includes('t(`')) return;
    // Skip translation file itself
    if (filePath.includes('i18n.ts')) return;

    // Check for JSX text content (text between > and <)
    const jsxTextRegex = />([^<>{}\n]+)</g;
    let match;
    while ((match = jsxTextRegex.exec(line)) !== null) {
      const text = match[1].trim();
      if (text.length >= 3 && /[A-Za-z]/.test(text) && !shouldIgnore(text)) {
        // Check it's not a variable/expression
        if (!text.startsWith('{') && !text.startsWith('$') && !/^\d+/.test(text)) {
          issues.push({
            line: lineNum + 1,
            type: 'JSX text',
            text: text.substring(0, 80),
            context: trimmedLine.substring(0, 100),
          });
        }
      }
    }

    // Check aria-label with hardcoded string
    const ariaLabelRegex = /aria-label=["']([^"']{4,})["']/g;
    while ((match = ariaLabelRegex.exec(line)) !== null) {
      issues.push({
        line: lineNum + 1,
        type: 'aria-label',
        text: match[1].substring(0, 80),
        context: trimmedLine.substring(0, 100),
      });
    }

    // Check title with hardcoded string (not className or similar)
    const titleRegex = /\btitle=["']([^"']{4,})["']/g;
    while ((match = titleRegex.exec(line)) !== null) {
      issues.push({
        line: lineNum + 1,
        type: 'title attr',
        text: match[1].substring(0, 80),
        context: trimmedLine.substring(0, 100),
      });
    }

    // Check placeholder with hardcoded string
    const placeholderRegex = /placeholder=["']([^"']{4,})["']/g;
    while ((match = placeholderRegex.exec(line)) !== null) {
      issues.push({
        line: lineNum + 1,
        type: 'placeholder',
        text: match[1].substring(0, 80),
        context: trimmedLine.substring(0, 100),
      });
    }

    // Check toast calls with hardcoded strings
    const toastRegex = /toast\.\w+\(['"]([^'"]{3,})['"],\s*['"]([^'"]{3,})['"]/g;
    while ((match = toastRegex.exec(line)) !== null) {
      issues.push({
        line: lineNum + 1,
        type: 'toast hardcoded',
        text: `"${match[1]}" / "${match[2]}"`,
        context: trimmedLine.substring(0, 100),
      });
    }
  });

  return issues;
}

const files = getAllFiles(SRC_DIR);
const allIssues = {};
let totalIssues = 0;

for (const file of files) {
  const issues = analyzeFile(file);
  if (issues.length > 0) {
    allIssues[file] = issues;
    totalIssues += issues.length;
  }
}

console.log(`\n=== HARDCODED STRINGS REPORT ===`);
console.log(`Total issues found: ${totalIssues}\n`);

for (const [file, issues] of Object.entries(allIssues)) {
  const shortPath = file.replace('src/', '');
  console.log(`\n📄 ${shortPath} (${issues.length} issues)`);
  console.log('─'.repeat(60));
  for (const issue of issues) {
    console.log(`  Line ${issue.line} [${issue.type}]: "${issue.text}"`);
  }
}
