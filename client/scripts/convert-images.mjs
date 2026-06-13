/**
 * convert-images.mjs
 * Run once: node scripts/convert-images.mjs
 *
 * Converts PNG/JPG in public/ to WebP format at 85% quality using sharp.
 * Original files are kept (for PWA manifest / favicon compatibility).
 * Also generates optimized WebP for use in <picture> or direct <img src>.
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '../public');

const CONVERT_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// Files to skip conversion (PWA icons must stay PNG for browser/OS compat)
const SKIP_FILES = ['favicon.png', 'logo-192.png', 'logo-512.png'];

async function convertToWebP(inputPath, outputPath) {
  const inputStat = await stat(inputPath);
  const inputKB = Math.round(inputStat.size / 1024);

  await sharp(inputPath)
    .webp({ quality: 85, effort: 6 })
    .toFile(outputPath);

  const outputStat = await stat(outputPath);
  const outputKB = Math.round(outputStat.size / 1024);
  const saving = Math.round(((inputStat.size - outputStat.size) / inputStat.size) * 100);

  console.log(`✅ ${basename(inputPath)} → ${basename(outputPath)}   ${inputKB}KB → ${outputKB}KB  (−${saving}%)`);
}

async function main() {
  console.log('🖼️  Converting images in public/ to WebP...\n');

  const files = await readdir(PUBLIC_DIR);
  let converted = 0;
  let skipped = 0;

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!CONVERT_EXTENSIONS.includes(ext)) continue;

    if (SKIP_FILES.includes(file)) {
      console.log(`⏭️  Skipped (PWA icon): ${file}`);
      skipped++;
      continue;
    }

    const inputPath = join(PUBLIC_DIR, file);
    const webpName = file.replace(/\.[^.]+$/, '.webp');
    const outputPath = join(PUBLIC_DIR, webpName);

    try {
      await convertToWebP(inputPath, outputPath);
      converted++;
    } catch (err) {
      console.error(`❌ Failed: ${file} — ${err.message}`);
    }
  }

  console.log(`\n✨ Done! Converted: ${converted}, Skipped: ${skipped}`);
  console.log('\nNext: Update your JSX/HTML to use .webp files where available.');
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
