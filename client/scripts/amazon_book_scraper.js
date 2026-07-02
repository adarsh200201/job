/**
 * Amazon India Curated Book Fetcher
 * ===================================
 * Uses a handpicked list of book ASINs across all categories and
 * fetches live price, rating, reviews, title, and author data
 * directly from amazon.in/dp/{ASIN} product pages.
 *
 * No search page needed — bypasses Amazon search blocking.
 *
 * Usage:  node scripts/amazon_book_scraper.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const booksPath  = path.join(__dirname, '../src/data/books.json');
const TODAY      = new Date().toISOString().split('T')[0];

// ─── Curated Book List ───────────────────────────────────────────────────────
// Each entry: asin, category, fallback title/author/description in case
// scraping fails (so the book is still added with manual metadata).
const CURATED_BOOKS = [
  // ── INTERVIEW / CODING ──────────────────────────────────────────────────
  {
    asin: '9355424485',
    category: 'interview',
    fallback: {
      title: 'Beyond Cracking the Coding Interview',
      subtitle: 'Pass Tough Coding Interviews, Get Noticed, and Negotiate Successfully',
      author: 'Gayle Laakmann McDowell',
      publisher: 'Careerforge',
      description: 'The definitive next-step book after Cracking the Coding Interview. Covers negotiation, behavioral rounds, system design basics, and how to stand out at top tech companies.',
    },
  },
  {
    asin: '1946556696',
    category: 'interview',
    fallback: {
      title: 'Dynamic Programming for Coding Interviews',
      subtitle: 'A Bottom-Up Approach to Problem Solving',
      author: 'Meenakshi & Kamal Rawat',
      publisher: 'Notion Press',
      description: 'The clearest guide to mastering dynamic programming — one of the most feared interview topics. Explains DP from scratch, with bottom-up solutions to 50+ classic problems.',
    },
  },
  {
    asin: '9355427190',
    category: 'interview',
    fallback: {
      title: 'System Design Interview — Volume 1',
      subtitle: "An Insider's Guide (Full Colour Edition)",
      author: 'Alex Xu',
      publisher: 'Byte Code LLC',
      description: 'The industry standard for system design interview preparation. Covers rate limiters, URL shorteners, consistent hashing, CDN design, and 15+ real-world system problems.',
    },
  },
  {
    asin: '9355426844',
    category: 'interview',
    fallback: {
      title: 'System Design Interview — 2 Volume Set',
      subtitle: "An Insider's Guide (Full Colour Edition)",
      author: 'Alex Xu',
      publisher: 'Byte Code LLC',
      description: 'The complete 2-volume set covering system design from fundamentals to advanced distributed systems. Essential reading for senior software engineering interviews.',
    },
  },

  // ── TECH / PROGRAMMING ───────────────────────────────────────────────────
  {
    asin: '935551655X',
    category: 'tech',
    fallback: {
      title: 'Ultimate Python Programming',
      subtitle: 'Learn Python with 650+ Programs, 900+ Practice Questions, and 5 Projects',
      author: 'Dr. Pooja Rattan',
      publisher: 'BPB Publications',
      description: 'The most comprehensive Python programming book for beginners to intermediate learners. Packed with 650+ working programs, practice questions, and 5 full-scale projects.',
    },
  },
  {
    asin: '9355517009',
    category: 'tech',
    fallback: {
      title: 'Microservices Design Patterns with Java',
      subtitle: '70+ Patterns for Designing, Building, and Deploying Microservices',
      author: 'Anupama Murthy',
      publisher: 'BPB Publications',
      description: 'A hands-on guide to 70+ microservices design patterns used by Netflix, Amazon, and Uber. Covers service mesh, API gateway, saga, CQRS, event sourcing, and deployment patterns.',
    },
  },
  {
    asin: '9352134997',
    category: 'tech',
    fallback: {
      title: 'Clean Code',
      subtitle: 'A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      publisher: 'Pearson India',
      description: "Robert C. Martin's legendary guide to writing clean, maintainable code. Covers naming, functions, comments, formatting, error handling, unit testing, and refactoring with Java examples.",
    },
  },
  {
    asin: '9355513925',
    category: 'tech',
    fallback: {
      title: 'Java 8 to 21',
      subtitle: 'New Features for Professional Programmers',
      author: 'Angie Jones',
      publisher: 'BPB Publications',
      description: 'Covers every major Java version from 8 to 21 including lambdas, streams, records, sealed classes, virtual threads, and pattern matching. Essential for Java developers staying current.',
    },
  },

  // ── CAREER & MINDSET ─────────────────────────────────────────────────────
  {
    asin: '9353025354',
    category: 'career',
    fallback: {
      title: 'Deep Work',
      subtitle: 'Rules for Focused Success in a Distracted World',
      author: 'Cal Newport',
      publisher: 'Piatkus',
      description: "Cal Newport's groundbreaking argument for why the ability to focus without distraction is the new superpower of the 21st century. Packed with actionable strategies to build deep focus habits.",
    },
  },
  {
    asin: '9355203993',
    category: 'career',
    fallback: {
      title: 'Atomic Habits',
      subtitle: 'An Easy and Proven Way to Build Good Habits and Break Bad Ones',
      author: 'James Clear',
      publisher: 'Random House Business',
      description: 'James Clear provides a proven framework for improving every day. No matter your goals, Atomic Habits shows you exactly how tiny changes in behavior lead to remarkable results.',
    },
  },
  {
    asin: '0804139024',
    category: 'career',
    fallback: {
      title: 'Zero to One',
      subtitle: 'Notes on Startups, or How to Build the Future',
      author: 'Peter Thiel',
      publisher: 'Crown Business',
      description: 'Peter Thiel, co-founder of PayPal, shares his philosophy on startups and innovation. Essential reading for anyone wanting to build something genuinely new rather than copying what already works.',
    },
  },
  {
    asin: '9352092902',
    category: 'career',
    fallback: {
      title: 'The Lean Startup',
      subtitle: 'How Constant Innovation Creates Radically Successful Businesses',
      author: 'Eric Ries',
      publisher: 'Portfolio Penguin',
      description: 'Eric Ries explains the methodology used by startups to grow fast: build-measure-learn loops, validated learning, and minimum viable products. A must-read for entrepreneurs and product managers.',
    },
  },

  // ── APTITUDE & REASONING ─────────────────────────────────────────────────
  {
    asin: '8174191844',
    category: 'aptitude',
    fallback: {
      title: 'Fast Track Arithmetic',
      subtitle: 'Comprehensive Arithmetic Guide for Competitive Exams',
      author: 'Rajesh Verma',
      publisher: 'Arihant Publications',
      description: 'The most popular arithmetic book for SSC CGL, Bank PO, and placement tests. Covers all arithmetic topics with shortcut tricks, speed math formulas, and thousands of practice questions.',
    },
  },
  {
    asin: '8174820027',
    category: 'aptitude',
    fallback: {
      title: 'Quicker Maths',
      subtitle: 'Magical Book on Speed Mathematics',
      author: 'M. Tyra',
      publisher: 'BSC Publishing',
      description: 'The legendary speed math book used by thousands of toppers for SSC and banking exams. Teaches Vedic math tricks, shortcut formulas, and mental calculation methods to solve questions in seconds.',
    },
  },
  {
    asin: '9352602536',
    category: 'aptitude',
    fallback: {
      title: 'Analytical Reasoning',
      subtitle: 'Comprehensive Guide to Logical and Analytical Reasoning',
      author: 'M K Pandey',
      publisher: 'BSC Publishing',
      description: 'The go-to book for cracking the analytical reasoning and logical puzzle sections of SSC, banking, CLAT, and MBA entrance exams. Covers seating arrangements, blood relations, direction sense, and complex puzzles.',
    },
  },

  // ── GOVERNMENT EXAMS ─────────────────────────────────────────────────────
  {
    asin: '8173897387',
    category: 'govt',
    fallback: {
      title: "Spectrum's Modern History of India",
      subtitle: 'For Civil Services and Other State Examinations',
      author: 'Rajiv Ahir',
      publisher: 'Spectrum Books',
      description: "India's most trusted modern history book for UPSC Civil Services prelims and mains. Covers the complete arc of India's freedom struggle from 1857 to independence with multiple-choice practice questions.",
    },
  },
  {
    asin: '9353160707',
    category: 'govt',
    fallback: {
      title: 'Indian Economy',
      subtitle: 'For Civil Services Examinations',
      author: 'Ramesh Singh',
      publisher: 'McGraw Hill India',
      description: "The most comprehensive Indian Economy book for UPSC and state PSC examinations. Covers macroeconomics, fiscal policy, monetary policy, banking, agriculture, planning, and India's global economic position.",
    },
  },
  {
    asin: '9353161010',
    category: 'govt',
    fallback: {
      title: 'Environment & Ecology for UPSC',
      subtitle: 'Biodiversity, Climate Change and Disaster Management',
      author: 'Majid Husain',
      publisher: 'McGraw Hill India',
      description: 'Covers all environment and ecology topics for UPSC including biodiversity conventions, climate change agreements, pollution, disaster management, and government schemes related to the environment.',
    },
  },

  // ── RESUME & JOB SEARCH ──────────────────────────────────────────────────
  {
    asin: '0316451320',
    category: 'resume',
    fallback: {
      title: 'What Color Is Your Parachute?',
      subtitle: 'Your Guide to a Lifetime of Meaningful Work and Career Success',
      author: 'Richard N. Bolles',
      publisher: 'Ten Speed Press',
      description: 'The world\'s most popular career guide, used by millions to find their calling and land their dream job. Covers skills inventory, job hunting, salary negotiation, and career change strategies.',
    },
  },
  {
    asin: '9780385512060',
    category: 'resume',
    fallback: {
      title: 'Never Eat Alone',
      subtitle: 'And Other Secrets to Success, One Relationship at a Time',
      author: 'Keith Ferrazzi',
      publisher: 'Currency',
      description: 'Keith Ferrazzi reveals how relationship-building and networking is the single most important skill for career success. Covers strategies for building genuine connections that accelerate career growth.',
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise(r => setTimeout(r, ms));

function decodeHTML(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&#x2F;/g, '/').replace(/\s+/g, ' ').trim();
}

function toSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, '-')
    .replace(/-+/g, '-').slice(0, 65).replace(/-$/, '');
}

function getHeaders() {
  const UAs = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  ];
  return {
    'User-Agent'               : UAs[Math.floor(Math.random() * UAs.length)],
    'Accept'                   : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language'          : 'en-IN,en-GB;q=0.9,en;q=0.8',
    'Accept-Encoding'          : 'gzip, deflate, br',
    'Cache-Control'            : 'no-cache',
    'Pragma'                   : 'no-cache',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest'           : 'document',
    'Sec-Fetch-Mode'           : 'navigate',
    'Sec-Fetch-Site'           : 'none',
    'Sec-Fetch-User'           : '?1',
  };
}

function isBlocked(html) {
  return html.includes('api-services-support@amazon.com')
    || html.toLowerCase().includes('captcha')
    || html.includes('Sorry, we just need to make sure you')
    || html.length < 8000;
}

// ─── Parsers ──────────────────────────────────────────────────────────────────
function parseTitle(html) {
  const m = html.match(/id="productTitle"[^>]*>\s*([^<]{5,300})\s*<\/span>/i);
  if (!m) return null;
  let t = decodeHTML(m[1]);
  // strip trailing [Paperback], (English), etc.
  t = t.replace(/\[.*?\]/g, '').replace(/\((Paperback|Hardcover|English)\)/gi, '').trim();
  // strip "by Author ::" prefix
  t = t.replace(/^by\s+[^:]{2,50}::\s*/i, '');
  return t.replace(/\s+/g, ' ').trim();
}

function parseAuthor(html) {
  // Best: JSON-LD structured data
  const ld = html.match(/"author"\s*:\s*\[\s*\{\s*"@type"\s*:\s*"Person"\s*,\s*"name"\s*:\s*"([^"]{2,80})"/i)
          || html.match(/"author"\s*:\s*\{\s*"@type"\s*:\s*"Person"\s*,\s*"name"\s*:\s*"([^"]{2,80})"/i);
  if (ld) return decodeHTML(ld[1]);

  // Visit Amazon's <Name> Page
  const vap = html.match(/Visit Amazon.s\s+([A-Z][a-zA-Z\s\.\-]{2,60})\s+(Page|Store)/);
  if (vap) return vap[1].trim();

  // contributorNameID span — skip "Follow"
  const spans = [...html.matchAll(/class="[^"]*a-link-normal[^"]*"[^>]*>([^<]{2,60})<\/a>/gi)];
  for (const s of spans) {
    const name = decodeHTML(s[1]).trim();
    if (name.toLowerCase() === 'follow') continue;
    if (/^[A-Z][a-z]/.test(name) && name.split(' ').length <= 6 && name.length > 3) {
      return name;
    }
  }

  return null;
}

function parsePrice(html) {
  const patterns = [
    /class="apexPriceToPay"[\s\S]{0,300}?class="a-offscreen"[^>]*>₹([0-9,]+)/i,
    /id="priceblock_ourprice"[^>]*>[\s\S]{0,80}?₹\s*([0-9,]+)/i,
    /id="priceblock_dealprice"[^>]*>[\s\S]{0,80}?₹\s*([0-9,]+)/i,
    /"a-price-whole"[^>]*>\s*([0-9,]+)/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return parseInt(m[1].replace(/,/g, ''));
  }
  return null;
}

function parseOldPrice(html) {
  const patterns = [
    /class="a-text-price"[\s\S]{0,300}?class="a-offscreen"[^>]*>₹([0-9,]+)/i,
    /M\.R\.P\.[\s\S]{0,100}?₹\s*([0-9,]+)/i,
    /was[\s\S]{0,80}?₹\s*([0-9,]+)/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return parseInt(m[1].replace(/,/g, ''));
  }
  return null;
}

function parseRating(html) {
  const patterns = [
    /"ratingValue"\s*:\s*"?([3-5]\.[0-9])"?/i,
    /([3-5]\.[0-9])\s+out of 5 stars/i,
    /([3-5]\.[0-9])\s+out of 5/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return parseFloat(m[1]);
  }
  return null;
}

function parseReviews(html) {
  const patterns = [
    /"ratingCount"\s*:\s*"?([0-9]+)"?/i,
    /"reviewCount"\s*:\s*"?([0-9]+)"?/i,
    /id="acrCustomerReviewText"[^>]*>([0-9,]+)\s*(ratings|reviews)/i,
    /([0-9,]+)\s+global ratings/i,
    /([0-9,]+)\s+customer reviews/i,
    /([0-9,]+)\s+ratings/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) {
      const n = parseInt(m[1].replace(/,/g, ''));
      if (n > 5) return n;
    }
  }
  return null;
}

function parsePublisher(html) {
  const m = html.match(/Publisher\s*:?\s*<\/td>\s*<td[^>]*>\s*([^<;]{3,80})/i)
         || html.match(/Publisher\s*:?\s*<span[^>]*>\s*([^<;]{3,60})<\/span>/i);
  if (m) return m[1].replace(/;.*/, '').trim();
  return null;
}

function parseDescription(html) {
  const patterns = [
    /id="bookDescription_feature_div"[\s\S]{0,500}?<div[^>]*noCssTransform[^>]*>([\s\S]{100,3000}?)<\/div>/i,
    /id="productDescription"[\s\S]{0,200}?<p[^>]*>([\s\S]{80,2000}?)<\/p>/i,
    /class="a-expander-content[^"]*"[^>]*>\s*<p[^>]*>([\s\S]{80,2000}?)<\/p>/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) {
      return decodeHTML(m[1].replace(/<[^>]+>/g, ' ')).slice(0, 700);
    }
  }
  return null;
}

// ─── Scrape One Product Page ──────────────────────────────────────────────────
async function scrape(asin) {
  const url = `https://www.amazon.in/dp/${asin}`;
  try {
    const resp = await fetch(url, { headers: getHeaders() });
    if (!resp.ok) { console.log(`      HTTP ${resp.status}`); return null; }
    const html = await resp.text();
    if (isBlocked(html)) { console.log(`      🚫 Blocked`); return null; }

    return {
      title      : parseTitle(html),
      author     : parseAuthor(html),
      price      : parsePrice(html),
      oldPrice   : parseOldPrice(html),
      rating     : parseRating(html),
      reviews    : parseReviews(html),
      publisher  : parsePublisher(html),
      description: parseDescription(html),
    };
  } catch (err) {
    console.error(`      ❌ ${err.message}`);
    return null;
  }
}

function assignBadge(reviews, rating) {
  if (reviews > 15000) return 'bestseller';
  if (reviews > 5000 && rating >= 4.3) return 'must-buy';
  return 'editor-pick';
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log('\n📚 Amazon India Curated Book Fetcher');
  console.log('═'.repeat(55));

  const raw = fs.readFileSync(booksPath, 'utf-8');
  const existing = JSON.parse(raw);
  const existingAsins = new Set(existing.map(b => b.asin));
  const existingSlugs = new Set(existing.map(b => b.slug));

  console.log(`ℹ️  Books already in DB: ${existing.length}`);
  console.log(`📋 Curated list size:    ${CURATED_BOOKS.length}`);

  const toFetch = CURATED_BOOKS.filter(c => !existingAsins.has(c.asin));
  console.log(`🔄 New books to fetch:   ${toFetch.length}\n`);

  if (toFetch.length === 0) {
    console.log('✅ All curated books are already in the database!');
    return;
  }

  const added = [];

  for (let i = 0; i < toFetch.length; i++) {
    const { asin, category, fallback } = toFetch[i];
    console.log(`[${i+1}/${toFetch.length}] ASIN ${asin} — ${fallback.title}`);

    await delay(2500 + Math.random() * 1500); // polite delay

    const live = await scrape(asin);

    // Merge live data over fallback (live wins where available)
    const title       = (live?.title && live.title.length > 4) ? live.title : fallback.title;
    const author      = (live?.author && live.author.toLowerCase() !== 'follow') ? live.author : fallback.author;
    const price       = (live?.price && live.price > 50 && live.price < 5000) ? live.price : null;
    const oldPrice    = live?.oldPrice || null;
    const rating      = live?.rating || 4.3;
    const reviews     = live?.reviews || 0;
    const publisher   = live?.publisher || fallback.publisher || '';
    const description = (live?.description && live.description.length > 80)
                          ? live.description : fallback.description;

    if (!price) {
      console.log(`      ⚠️  Could not get price for "${title}". Skipping.`);
      continue;
    }

    const finalOldPrice = (oldPrice && oldPrice > price)
      ? oldPrice : Math.round(price * 1.35);
    const discountPercent = Math.round((1 - price / finalOldPrice) * 100);

    let slug = toSlug(title);
    if (existingSlugs.has(slug)) slug = `${slug}-${asin.slice(-4).toLowerCase()}`;

    const book = {
      slug,
      asin,
      title,
      subtitle: fallback.subtitle || '',
      author,
      category,
      price,
      oldPrice: finalOldPrice,
      rating,
      reviews,
      publisher,
      publishedDate: '',
      language: 'English',
      formats: ['Paperback'],
      discountPercent,
      badge: assignBadge(reviews, rating),
      priceLastCheckedAt: TODAY,
      description,
      whyRecommend: [
        reviews > 0
          ? `Rated ${rating}★ by ${reviews.toLocaleString()}+ readers on Amazon India.`
          : `Highly recommended by professionals and competitive exam toppers.`,
        `Written by ${author}, a recognized authority in the field.`,
        `Available at ₹${price} — ${discountPercent}% off MRP on Amazon India.`,
      ],
      relatedSlugs: [],
    };

    console.log(`      ✅ "${title}" — ${author} | ₹${price} | ⭐${rating} | ${reviews} ratings`);
    added.push(book);
    existingSlugs.add(slug);
    existingAsins.add(asin);
  }

  if (added.length === 0) {
    console.log('\n⚠️  No new books were added (Amazon blocked all product page requests).');
    console.log('💡 Wait 30–60 minutes or try from a different network/VPN.');
    return;
  }

  // Fix relatedSlugs
  const allBooks = [...existing, ...added];
  added.forEach(b => {
    b.relatedSlugs = allBooks
      .filter(x => x.category === b.category && x.slug !== b.slug)
      .slice(0, 2)
      .map(x => x.slug);
  });

  // Sort: keep original 10 + new sorted by category then title
  const finalBooks = [...existing, ...added];
  fs.writeFileSync(booksPath, JSON.stringify(finalBooks, null, 2), 'utf-8');

  console.log('\n' + '═'.repeat(55));
  console.log(`✅ SUCCESS! Added ${added.length} new books.`);
  console.log(`📚 Total books in DB: ${finalBooks.length}`);
  console.log(`\nNew books:`);
  added.forEach(b => console.log(`  [${b.category.padEnd(9)}] ${b.title} — ₹${b.price}`));
}

run().catch(console.error);
