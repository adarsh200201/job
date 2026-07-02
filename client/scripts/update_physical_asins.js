/**
 * Update Kindle ASINs in books.json to their physical ISBN-10 values.
 * This ensures the Amazon Product Image CDN (which looks up by physical ASIN/ISBN-10)
 * successfully retrieves high-resolution cover images.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const booksPath  = path.join(__dirname, '../src/data/books.json');

const PHYSICAL_ASIN_MAP = {
  'human-edge-in-the-ai-age': '0143461419',
  'atomic-habits': '1847942490',
  'deep-work': '0349411905',
  'zero-to-one': '0753555190',
  'the-lean-startup': '0307887898',
};

function run() {
  console.log('Reading books.json...');
  const books = JSON.parse(fs.readFileSync(booksPath, 'utf-8'));
  let updatedCount = 0;

  books.forEach(b => {
    const physicalAsin = PHYSICAL_ASIN_MAP[b.slug];
    if (physicalAsin && b.asin !== physicalAsin) {
      console.log(`  Updating ASIN for "${b.title}": ${b.asin} -> ${physicalAsin}`);
      b.asin = physicalAsin;
      updatedCount++;
    }
  });

  fs.writeFileSync(booksPath, JSON.stringify(books, null, 2), 'utf-8');
  console.log(`\nSuccessfully updated ${updatedCount} ASINs to their physical editions.`);
}

run();
