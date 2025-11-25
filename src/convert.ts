import { getFile } from './figma.js';
import { normalizeNode } from './normalize.js';
import { renderHTML, renderCSS } from './render.js';
import { Tokens, StyleMap } from './types.js';

export async function convertFile({ fileKey, pageName, outDir, token }: {
  fileKey: string, pageName?: string, outDir: string, token: string
}) {
  console.log('Fetching Figma file:', fileKey);
  const file = await getFile(token, fileKey);
  console.log('File fetched successfully');
  const page = (file.document.children as any[]).find(p => !pageName || p.name === pageName) || file.document.children[0];
  console.log('Processing page:', page?.name || 'unnamed');
  const root = normalizeNode(page);
  if (!root) throw new Error('Failed to normalize root page');

  console.log('Extracting styles...');
  const tokens: Tokens = { colors: {}, fonts: {} };
  const { computeStyles } = await import('./styles.js');
  const styles = computeStyles(root, tokens);

  console.log('Rendering HTML and CSS...');
  renderCSS(tokens, styles, outDir);
  renderHTML(root, outDir);
  console.log(`✓ Conversion complete! Files written to ${outDir}/`);
}
