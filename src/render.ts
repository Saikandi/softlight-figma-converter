import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { NormalizedNode, Tokens, StyleMap } from './types.js';

export function renderHTML(root: NormalizedNode, outDir: string) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="./styles.css" />
<title>Figma Export</title>
</head>
<body>
  <div class="figma-container">
${renderNode(root, 2)}
  </div>
</body>
</html>`;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
}

function renderNode(n: NormalizedNode, depth: number = 0): string {
  const indent = '  '.repeat(depth);
  const children = (n.children || []).map(child => renderNode(child, depth + 1)).join('\n');
  const content = n.html || '';
  
  if (children) {
    return `${indent}<div class="${n.className}">${content ? content : ''}\n${children}\n${indent}</div>`;
  } else {
    return `${indent}<div class="${n.className}">${content}</div>`;
  }
}

export function renderCSS(tokens: Tokens, styles: StyleMap, outDir: string) {
  const css = [
    ':root {',
    ...Object.entries(tokens.colors).map(([k, v]) => `  --color-${k}: ${v};`),
    ...Object.entries(tokens.fonts).map(([k, v]) => `  --font-${k}: ${v};`),
    '}',
    '* { margin: 0; padding: 0; }',
    'body { margin: 0; padding: 0; background-color: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }',
    '.figma-container { position: relative; display: inline-block; }',
    ...Object.entries(styles).map(([cls, rules]) => `.${cls} { ${rules.join(' ')} }`)
  ].join('\n');
  writeFileSync(join(outDir, 'styles.css'), css);
}
