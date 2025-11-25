import 'dotenv/config';
import { Command } from 'commander';
import { convertFile } from './convert.js';

const program = new Command();
program
  .requiredOption('--file <key>', 'Figma file key')
  .option('--page <name>', 'Page name to export')
  .option('--out <dir>', 'Output directory', 'dist');

program.parse(process.argv);
const opts = program.opts();

console.log('CLI Arguments:', { fileKey: opts.file, pageName: opts.page, outDir: opts.out });
console.log('Token available:', !!process.env.FIGMA_TOKEN);

convertFile({
  fileKey: opts.file,
  pageName: opts.page,
  outDir: opts.out,
  token: process.env.FIGMA_TOKEN!,
}).catch(err => {
  console.error(err);
  process.exit(1);
});
