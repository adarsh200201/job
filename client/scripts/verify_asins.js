/**
 * ASIN Verifier — checks every book's Amazon India product page
 * and compares the real title to what we have in books.json.
 * Flags any mismatches so we can fix wrong ASINs.
 *
 * Usage: node scripts/verify_asins.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const booksPath  = path.join(__dirname, '../src/data/books.json');

const delay = (ms) => new Promise(r => setTimeout(r, ms));

function getHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-IN,en;q=0.9',
    'Cache-Control': 'no-cache',
  };
}

async function fetchTitle(asin) {
  try {
    const resp = await fetch(`https://www.amazon.in/dp/${asin}`, { headers: getHeaders() });
    if (!resp.ok) return `HTTP_${resp.status}`;
    const html = await resp.text();
    if (html.includes('api-services-support@amazon.com') || html.toLowerCase().includes('captcha') || html.length < 5000) {
      return 'BLOCKED';
    }
    const m = html.match(/id="productTitle"[^>]*>\s*([^<]{4,200})\s*<\/span>/i);
    if (m) return m[1].trim().replace(/\s+/g, ' ');
    return 'NO_TITLE_FOUND';
  } catch (e) {
    return `ERROR: ${e.message}`;
  }
}

function overlap(a, b) {
  // Check if the two titles share significant words
  const aWords = a.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 3);
  const bWords = b.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 3);
  const matches = aWords.filter(w => bWords.includes(w));
  return matches.length;
}

async function run() {
  const books = JSON.parse(fs.readFileSync(booksPath, 'utf-8'));
  console.log(`\n🔍 ASIN Verifier — checking ${books.length} books\n${'═'.repeat(70)}`);

  const wrong = [];
  const ok    = [];

  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    process.stdout.write(`[${String(i+1).padStart(2)}/${books.length}] ${b.title.slice(0,35).padEnd(36)} ASIN:${b.asin} → `);
    await delay(2000 + Math.random() * 1000);

    const realTitle = await fetchTitle(b.asin);

    if (realTitle.startsWith('HTTP_') || realTitle === 'BLOCKED' || realTitle === 'NO_TITLE_FOUND' || realTitle.startsWith('ERROR')) {
      console.log(`⚠️  ${realTitle}`);
      wrong.push({ book: b, realTitle, issue: 'FETCH_FAILED' });
      continue;
    }

    const score = overlap(b.title, realTitle);
    if (score >= 1) {
      console.log(`✅ "${realTitle.slice(0,45)}"`);
      ok.push(b.title);
    } else {
      console.log(`❌ GOT: "${realTitle.slice(0,50)}"`);
      wrong.push({ book: b, realTitle, issue: 'TITLE_MISMATCH' });
    }
  }

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`✅ OK: ${ok.length}  |  ❌ Problems: ${wrong.length}\n`);

  if (wrong.length > 0) {
    console.log('🚨 PROBLEM BOOKS (need ASIN correction):');
    wrong.forEach(({ book, realTitle, issue }) => {
      console.log(`\n  Book:     ${book.title}`);
      console.log(`  ASIN:     ${book.asin}`);
      console.log(`  Issue:    ${issue}`);
      console.log(`  Got:      ${realTitle.slice(0, 80)}`);
    });
  }
}

run().catch(console.error);
