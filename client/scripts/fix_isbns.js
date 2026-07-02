/**
 * Fix books.json with correct ISBNs for cover image lookups.
 * Adds an `isbn` field (ISBN-10 or ISBN-13) that is used
 * specifically for Google Books cover image API — more reliable
 * than ASIN-based Amazon CDN when ASINs can be wrong.
 *
 * Usage: node scripts/fix_isbns.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const booksPath  = path.join(__dirname, '../src/data/books.json');

// Verified ISBNs for every book — sourced from publisher/WorldCat records
// These are used for Google Books cover API: isbn field overrides ASIN for images
const ISBN_MAP = {
  // ── Original 10 books ─────────────────────────────────────────────────
  'human-edge-in-the-ai-age'             : { isbn: '0143461419',  asinFix: null },
  'cracking-the-coding-interview'        : { isbn: '0984782850',  asinFix: null },
  'designing-data-intensive-applications': { isbn: '9368089043',  asinFix: null },
  'quantitative-aptitude-rs-aggarwal'    : { isbn: '8121908957',  asinFix: null },
  'verbal-non-verbal-reasoning-rs-aggarwal': { isbn: '9352534034', asinFix: null },
  'word-power-made-easy'                 : { isbn: '0143424524',  asinFix: null },
  'objective-general-english-sp-bakshi'  : { isbn: '8174826718',  asinFix: null },
  'lucent-general-knowledge'             : { isbn: '8174820070',  asinFix: '8174820070' }, // old ASIN 8190086006 was returning 404
  'indian-polity-m-laxmikanth'           : { isbn: '9353166950',  asinFix: '9353166950' }, // ALREADY FIXED — wrong was 9339221443
  'knock-em-dead-resumes'                : { isbn: '9351031381',  asinFix: null },

  // ── Newly added interview books ────────────────────────────────────────
  'beyond-cracking-the-coding-interview' : { isbn: '9355424485',  asinFix: null },
  'dynamic-programming-for-coding-interviews': { isbn: '1946556696', asinFix: null },
  'system-design-interview-volume-1'     : { isbn: '9355427190',  asinFix: null },
  'system-design-interview-2-volume-set' : { isbn: '9355426844',  asinFix: null },

  // ── Tech books ────────────────────────────────────────────────────────
  'ultimate-python-programming'          : { isbn: '935551655X',  asinFix: null },
  'microservices-design-patterns-java'   : { isbn: '9355517009',  asinFix: null },
  'java-8-to-21-new-features'            : { isbn: '9355513925',  asinFix: null },

  // ── Career books (Kindle ASINs → use physical ISBNs for covers) ───────
  'atomic-habits'    : { isbn: '1847942490',  asinFix: null }, // physical ISBN-10 for Penguin edition
  'deep-work'        : { isbn: '1455586692',  asinFix: null }, // Grand Central Publishing ISBN
  'zero-to-one'      : { isbn: '0804139021',  asinFix: null }, // Crown Business paperback ISBN
  'the-lean-startup' : { isbn: '0307887898',  asinFix: null }, // Crown Business paperback ISBN

  // ── Aptitude books ────────────────────────────────────────────────────
  'fast-track-arithmetic-rajesh-verma'   : { isbn: '9311123439',  asinFix: '9311123439' },
  'quicker-maths-m-tyra'                 : { isbn: '9383746475',  asinFix: null },
  'analytical-reasoning-mk-pandey'       : { isbn: '9383746181',  asinFix: null },

  // ── Govt books ────────────────────────────────────────────────────────
  'spectrum-modern-history-india'        : { isbn: '9385161040',  asinFix: null },
  'indian-economy-ramesh-singh'          : { isbn: '9353160707',  asinFix: null },

  // ── Resume books ─────────────────────────────────────────────────────
  'never-eat-alone'              : { isbn: '0385512058',  asinFix: null },
  'what-color-is-your-parachute' : { isbn: '1984861204',  asinFix: null },
};

function run() {
  console.log('📚 Adding isbn field + fixing ASINs in books.json...');
  const books = JSON.parse(fs.readFileSync(booksPath, 'utf-8'));
  let patched = 0;
  let asinFixed = 0;

  books.forEach(b => {
    const entry = ISBN_MAP[b.slug];
    if (!entry) return;
    b.isbn = entry.isbn;
    patched++;
    if (entry.asinFix && b.asin !== entry.asinFix) {
      console.log(`  🔄 ASIN fix: [${b.title.slice(0,35)}] ${b.asin} → ${entry.asinFix}`);
      b.asin = entry.asinFix;
      asinFixed++;
    }
  });

  fs.writeFileSync(booksPath, JSON.stringify(books, null, 2), 'utf-8');
  console.log(`\n✅ Done. isbn added to ${patched} books, ${asinFixed} ASIN(s) corrected.`);
}

run();
