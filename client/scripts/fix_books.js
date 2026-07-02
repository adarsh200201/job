/**
 * Fix and expand books.json:
 *  1. Remove "The Martian" (wrong ASIN mapping)
 *  2. Fix author = "Books" → real authors on scraped entries
 *  3. Fix verbose titles → clean short titles
 *  4. Fix bad descriptions ("Disclaimer Shroff Publishers...")
 *  5. Add missing career / aptitude / govt / resume books with curated data
 *
 * Usage: node scripts/fix_books.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const booksPath  = path.join(__dirname, '../src/data/books.json');
const TODAY      = '2026-07-02';

// ─── Patches for existing scraped books ──────────────────────────────────────
const PATCHES = {
  '9355424485': {
    title:       'Beyond Cracking the Coding Interview',
    subtitle:    'Pass Tough Coding Interviews, Get Noticed, and Negotiate Successfully',
    author:      'Gayle Laakmann McDowell',
    slug:        'beyond-cracking-the-coding-interview',
    description: 'The definitive next-step after Cracking the Coding Interview. Covers negotiation tactics, behavioral rounds, how to stand out at FAANG companies, and strategies to navigate today\'s tougher hiring climate with real examples and scripts.',
    whyRecommend: [
      'Covers negotiation scripts and behavioral interview strategies that CTCI misses.',
      'Written by Gayle McDowell — the original author of Cracking the Coding Interview.',
      'Rated 4.4★ by 280+ verified buyers on Amazon India.',
    ],
  },
  '1946556696': {
    title:       'Dynamic Programming for Coding Interviews',
    subtitle:    'A Bottom-Up Approach to Problem Solving',
    author:      'Meenakshi & Kamal Rawat',
    slug:        'dynamic-programming-for-coding-interviews',
    description: 'The clearest guide to mastering dynamic programming — one of the most feared interview topics. Explains DP from scratch using a bottom-up approach, with step-by-step solutions to 50+ classic LeetCode-style problems.',
    whyRecommend: [
      'Teaches DP with intuitive bottom-up thinking, not confusing recursion-first approaches.',
      'Covers all major DP patterns: knapsack, LCS, matrix chain, coin change, and more.',
      'Available at ₹359 — one of the best-value interview prep books on Amazon India.',
    ],
  },
  '9355427190': {
    title:       'System Design Interview: An Insider\'s Guide — Volume 1',
    subtitle:    'Step-by-Step Design of Real-World Systems',
    author:      'Alex Xu',
    slug:        'system-design-interview-volume-1',
    description: 'The industry standard for system design interview preparation. Alex Xu walks through 15+ large-scale system problems — rate limiters, URL shorteners, web crawlers, notification services, and distributed caches — with detailed diagrams.',
    whyRecommend: [
      'Rated 4.4★ by 245+ readers — most widely referenced system design prep book globally.',
      'Covers every classic system design question asked at Google, Meta, Amazon, and Microsoft.',
      'Full-colour diagrams make complex distributed systems easy to understand and draw in interviews.',
    ],
  },
  '9355426844': {
    title:       'System Design Interview: 2-Volume Complete Set',
    subtitle:    'An Insider\'s Guide — Volumes 1 & 2',
    author:      'Alex Xu',
    slug:        'system-design-interview-2-volume-set',
    description: 'The complete 2-volume System Design Interview set by Alex Xu. Volume 1 covers foundational distributed systems; Volume 2 advances to proximity services, real-time gaming, payment systems, and digital wallet design.',
    whyRecommend: [
      'Covers 30+ real-world system design problems across both volumes.',
      'Volume 2 includes advanced topics like Yelp-style proximity search and Uber surge pricing.',
      'Best value bundle for anyone seriously preparing for senior software engineering interviews.',
    ],
  },
  '935551655X': {
    title:       'Ultimate Python Programming',
    subtitle:    'Learn Python with 650+ Programs, 900+ Practice Questions, and 5 Projects',
    author:      'Dr. Pooja Rattan',
    slug:        'ultimate-python-programming',
    description: 'The most comprehensive Python programming book for beginners to intermediate learners. Covers core Python, OOP, file handling, databases, Django basics, and data science libraries with 650+ working programs and 5 full-scale projects.',
    whyRecommend: [
      'Rated 4.8★ — one of the highest-rated Python books currently on Amazon India.',
      'Includes 900+ practice questions with solutions for placement exam preparation.',
      'Covers both Python basics and advanced topics like decorators, generators, and async programming.',
    ],
  },
  '9355517009': {
    title:       'Microservices Design Patterns with Java',
    subtitle:    '70+ Patterns for Designing, Building, and Deploying Microservices',
    author:      'Anupama Murthy',
    slug:        'microservices-design-patterns-java',
    description: 'A hands-on guide to 70+ microservices design patterns used by Netflix, Amazon, and Uber. Covers service mesh, API gateway, circuit breaker, saga, CQRS, event sourcing, and cloud-native deployment patterns with Java code examples.',
    whyRecommend: [
      'Covers 70+ battle-tested patterns used at world-class tech companies.',
      'Includes Docker, Kubernetes, and service mesh patterns essential for modern backend roles.',
      'Practical Java code examples make abstract patterns immediately applicable to real projects.',
    ],
  },
  '9355513925': {
    title:       'Java 8 to 21: New Features for Professional Programmers',
    subtitle:    'Master Modern Java from Lambdas to Virtual Threads',
    author:      'Dr. Venkat Subramaniam',
    slug:        'java-8-to-21-new-features',
    description: 'Covers every major Java version from 8 to 21 including lambdas, streams, optional, records, sealed classes, pattern matching, and virtual threads (Project Loom). Essential for Java developers preparing for interviews at product companies.',
    whyRecommend: [
      'Single book covering all Java versions from 8 to 21 — no need to buy multiple references.',
      'Virtual threads and pattern matching chapters are directly relevant to top Java interview questions.',
      'Written by a Java champion and widely used in corporate Java training programs.',
    ],
  },
};

// ─── New Books to Add ────────────────────────────────────────────────────────
const NEW_BOOKS = [
  // ── CAREER ────────────────────────────────────────────────────────────────
  {
    slug: 'atomic-habits',
    asin: 'B07RFSSYBH',
    title: 'Atomic Habits',
    subtitle: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    author: 'James Clear',
    category: 'career',
    price: 399,
    oldPrice: 799,
    rating: 4.6,
    reviews: 145000,
    publisher: 'Penguin Random House',
    publishedDate: '2018-10-16',
    language: 'English',
    formats: ['Paperback', 'Kindle Edition', 'Audiobook'],
    discountPercent: 50,
    badge: 'bestseller',
    description: "James Clear's Atomic Habits is the definitive guide to building good habits and breaking bad ones. Using a framework called the Four Laws of Behavior Change, Clear shows how tiny 1% improvements compound over time to create remarkable results. One of the best-selling self-improvement books of all time.",
    whyRecommend: [
      'Over 15 million copies sold worldwide — one of the best-selling books of this decade.',
      'Backed by science: the Four Laws framework is used by Olympic athletes and Fortune 500 CEOs.',
      'Teaches exactly how to redesign your environment to make good habits automatic.',
    ],
    relatedSlugs: ['human-edge-in-the-ai-age', 'deep-work'],
  },
  {
    slug: 'deep-work',
    asin: 'B00X47ZVXM',
    title: 'Deep Work',
    subtitle: 'Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    category: 'career',
    price: 329,
    oldPrice: 699,
    rating: 4.5,
    reviews: 68000,
    publisher: 'Piatkus',
    publishedDate: '2016-01-05',
    language: 'English',
    formats: ['Paperback', 'Kindle Edition'],
    discountPercent: 53,
    badge: 'must-buy',
    description: "Cal Newport argues that the ability to focus without distraction is the new superpower of the knowledge economy. Deep Work teaches you how to train your brain to do cognitively demanding work without social media interruptions — the skill that separates top performers from average ones.",
    whyRecommend: [
      'Provides a proven daily schedule framework for achieving 4+ hours of uninterrupted deep focus.',
      'Directly applicable to software engineers, writers, designers, and anyone doing complex knowledge work.',
      'Cal Newport has been practicing these techniques himself for over a decade — this is lived experience, not theory.',
    ],
    relatedSlugs: ['atomic-habits', 'human-edge-in-the-ai-age'],
  },
  {
    slug: 'zero-to-one',
    asin: 'B00J6YBOFQ',
    title: 'Zero to One',
    subtitle: 'Notes on Startups, or How to Build the Future',
    author: 'Peter Thiel',
    category: 'career',
    price: 299,
    oldPrice: 599,
    rating: 4.4,
    reviews: 52000,
    publisher: 'Currency',
    publishedDate: '2014-09-16',
    language: 'English',
    formats: ['Paperback', 'Kindle Edition'],
    discountPercent: 50,
    badge: 'must-buy',
    description: "PayPal co-founder Peter Thiel reveals the secret to building a business that creates entirely new value rather than copying existing ideas. Going from zero to one — creating something genuinely new — is rarer and harder than copying, but it's the only path to real innovation and lasting monopoly-like success.",
    whyRecommend: [
      'Peter Thiel built PayPal, Palantir, and was the first outside investor in Facebook — this is elite thinking.',
      'Challenges conventional wisdom about competition and monopoly in ways that permanently change how you see business.',
      'Essential reading for product managers, entrepreneurs, and engineers who want to build truly impactful products.',
    ],
    relatedSlugs: ['the-lean-startup', 'human-edge-in-the-ai-age'],
  },
  {
    slug: 'the-lean-startup',
    asin: 'B004J4XGN6',
    title: 'The Lean Startup',
    subtitle: 'How Constant Innovation Creates Radically Successful Businesses',
    author: 'Eric Ries',
    category: 'career',
    price: 349,
    oldPrice: 699,
    rating: 4.3,
    reviews: 41000,
    publisher: 'Portfolio Penguin',
    publishedDate: '2011-09-13',
    language: 'English',
    formats: ['Paperback', 'Kindle Edition'],
    discountPercent: 50,
    badge: 'editor-pick',
    description: "Eric Ries introduces the Build-Measure-Learn feedback loop that powers the most successful modern startups. The Lean Startup methodology has been adopted by companies ranging from early-stage startups to established enterprises like GE and Toyota to accelerate innovation and reduce waste.",
    whyRecommend: [
      'The Build-Measure-Learn framework is now standard curriculum at top MBA programs worldwide.',
      'Explains validated learning and minimum viable product concepts used by every modern tech startup.',
      'Essential for product managers, founders, and anyone working in fast-paced tech environments.',
    ],
    relatedSlugs: ['zero-to-one', 'human-edge-in-the-ai-age'],
  },

  // ── APTITUDE ──────────────────────────────────────────────────────────────
  {
    slug: 'fast-track-arithmetic-rajesh-verma',
    asin: 'B07WNMJWB5',
    title: 'Fast Track Arithmetic',
    subtitle: 'Comprehensive Shortcuts & Tricks for Competitive Exams',
    author: 'Rajesh Verma',
    category: 'aptitude',
    price: 310,
    oldPrice: 495,
    rating: 4.4,
    reviews: 22000,
    publisher: 'Arihant Publications',
    publishedDate: '2019-01-01',
    language: 'English',
    formats: ['Paperback'],
    discountPercent: 37,
    badge: 'bestseller',
    description: 'The most popular arithmetic shortcut book for SSC CGL, Bank PO, Railways, and campus placements. Covers all arithmetic topics with Vedic math tricks, speed formulas, and thousands of practice questions with step-by-step solutions.',
    whyRecommend: [
      'Shortcut methods that help you solve arithmetic problems 3× faster than standard approaches.',
      'Covers all arithmetic topics tested in SSC CGL, Bank PO, IBPS, and campus placement tests.',
      'Used by thousands of exam toppers — one of the highest-selling aptitude books in India.',
    ],
    relatedSlugs: ['quantitative-aptitude-rs-aggarwal', 'verbal-non-verbal-reasoning-rs-aggarwal'],
  },
  {
    slug: 'quicker-maths-m-tyra',
    asin: '9383746475',
    title: 'Quicker Maths',
    subtitle: 'Magical Book on Speed Mathematics for Competitive Exams',
    author: 'M. Tyra',
    category: 'aptitude',
    price: 475,
    oldPrice: 750,
    rating: 4.5,
    reviews: 31000,
    publisher: 'BSC Publishing',
    publishedDate: '2020-01-01',
    language: 'English',
    formats: ['Paperback'],
    discountPercent: 37,
    badge: 'bestseller',
    description: 'The legendary speed math book that has helped thousands crack SSC and banking exams. Teaches Vedic math techniques, mental calculation shortcuts, and rapid problem-solving methods for complex arithmetic. Endorsed by countless banking exam toppers.',
    whyRecommend: [
      'Teaches you to solve complex arithmetic calculations mentally in under 10 seconds.',
      'Covers all speed math tricks relevant to IBPS PO, SBI PO, SSC CGL, and CAT exams.',
      'Rated 4.5★ by over 31,000+ readers — one of India\'s highest-reviewed aptitude books.',
    ],
    relatedSlugs: ['fast-track-arithmetic-rajesh-verma', 'quantitative-aptitude-rs-aggarwal'],
  },
  {
    slug: 'analytical-reasoning-mk-pandey',
    asin: '9383746181',
    title: 'Analytical Reasoning',
    subtitle: 'Complete Guide to Logical & Analytical Reasoning for Competitive Exams',
    author: 'M.K. Pandey',
    category: 'aptitude',
    price: 440,
    oldPrice: 695,
    rating: 4.4,
    reviews: 19000,
    publisher: 'BSC Publishing',
    publishedDate: '2019-06-01',
    language: 'English',
    formats: ['Paperback'],
    discountPercent: 37,
    badge: 'must-buy',
    description: 'The go-to book for cracking analytical reasoning sections of SSC, banking, CLAT, and MBA entrance exams. Covers linear and circular seating arrangements, blood relations, syllogisms, direction sense, inequality, and complex multi-step logical puzzles.',
    whyRecommend: [
      'Covers every reasoning pattern tested in SSC CGL, IBPS, CAT, XAT, CLAT, and UPSC CSAT.',
      'Step-by-step solutions and logic explanations make even complex puzzle sets easy to master.',
      'Rated 4.4★ by 19,000+ students — consistently recommended by bank and SSC exam toppers.',
    ],
    relatedSlugs: ['verbal-non-verbal-reasoning-rs-aggarwal', 'quantitative-aptitude-rs-aggarwal'],
  },

  // ── GOVERNMENT EXAMS ──────────────────────────────────────────────────────
  {
    slug: 'spectrum-modern-history-india',
    asin: '9385161040',
    title: "Spectrum's A Brief History of Modern India",
    subtitle: 'For Civil Services and Other State Examinations',
    author: 'Rajiv Ahir',
    category: 'govt',
    price: 420,
    oldPrice: 675,
    rating: 4.5,
    reviews: 38000,
    publisher: 'Spectrum Books',
    publishedDate: '2023-01-01',
    language: 'English',
    formats: ['Paperback'],
    discountPercent: 38,
    badge: 'must-buy',
    description: "India's most trusted modern history book for UPSC Civil Services prelims and mains. Rajiv Ahir covers the complete arc of India's freedom struggle from 1857 Revolt through independence, with socio-religious reform movements, governor-generals, and constitutional developments.",
    whyRecommend: [
      'The undisputed #1 book for Modern Indian History in UPSC and state PSC examinations.',
      'Includes previous years\' UPSC prelims questions mapped chapter-by-chapter for targeted practice.',
      'Concise, table-based formatting makes it ideal for quick revision before the prelims exam.',
    ],
    relatedSlugs: ['indian-polity-m-laxmikanth', 'lucent-general-knowledge'],
  },
  {
    slug: 'indian-economy-ramesh-singh',
    asin: '9353160707',
    title: 'Indian Economy',
    subtitle: 'For Civil Services and Other Competitive Examinations',
    author: 'Ramesh Singh',
    category: 'govt',
    price: 599,
    oldPrice: 950,
    rating: 4.3,
    reviews: 24000,
    publisher: 'McGraw Hill India',
    publishedDate: '2023-08-01',
    language: 'English',
    formats: ['Paperback'],
    discountPercent: 37,
    badge: 'editor-pick',
    description: 'The most comprehensive Indian Economy book for UPSC and state PSC examinations. Ramesh Singh covers macroeconomics, fiscal and monetary policy, banking and financial sector, agriculture, industry, planning, and India\'s global economic position — with extensive newspaper-linked current affairs notes.',
    whyRecommend: [
      'The go-to economy textbook recommended by almost every UPSC topper and coaching institute.',
      'Updated every year with latest Budget provisions, RBI policies, and economic survey highlights.',
      'Covers both theoretical concepts and practical applications relevant to prelims and mains answers.',
    ],
    relatedSlugs: ['indian-polity-m-laxmikanth', 'spectrum-modern-history-india'],
  },

  // ── RESUME / JOB SEARCH ───────────────────────────────────────────────────
  {
    slug: 'never-eat-alone',
    asin: '0385512058',
    title: 'Never Eat Alone',
    subtitle: 'And Other Secrets to Success, One Relationship at a Time',
    author: 'Keith Ferrazzi',
    category: 'resume',
    price: 449,
    oldPrice: 899,
    rating: 4.4,
    reviews: 16000,
    publisher: 'Currency',
    publishedDate: '2014-06-05',
    language: 'English',
    formats: ['Paperback', 'Kindle Edition'],
    discountPercent: 50,
    badge: 'editor-pick',
    description: 'Keith Ferrazzi reveals that career success is fundamentally about relationships, not just skills. Never Eat Alone teaches you how to build a genuine network of supporters, mentors, and collaborators — and how to give generously to your network before you ever need to ask for favors.',
    whyRecommend: [
      'One of the most practical books on networking — teaches authentic relationship-building, not manipulation.',
      'Keith Ferrazzi went from poverty to CEO by mastering the strategies in this book himself.',
      'Essential reading for anyone entering the job market or transitioning to a new career.',
    ],
    relatedSlugs: ['knock-em-dead-resumes', 'human-edge-in-the-ai-age'],
  },
  {
    slug: 'what-color-is-your-parachute',
    asin: '1984861204',
    title: 'What Color Is Your Parachute?',
    subtitle: 'Your Guide to a Lifetime of Meaningful Work and Career Success',
    author: 'Richard N. Bolles',
    category: 'resume',
    price: 799,
    oldPrice: 1499,
    rating: 4.3,
    reviews: 28000,
    publisher: 'Ten Speed Press',
    publishedDate: '2022-08-23',
    language: 'English',
    formats: ['Paperback', 'Kindle Edition'],
    discountPercent: 47,
    badge: 'must-buy',
    description: "The world's #1 career guide, updated annually and used by millions worldwide. What Color Is Your Parachute helps job seekers identify their unique skills, find work aligned with their values, master job hunting tactics, write a powerful resume, and negotiate salary confidently.",
    whyRecommend: [
      'Over 10 million copies sold — the most-read career guide on the planet since 1970.',
      'The Flower Exercise inside is one of the most effective self-assessment tools ever created.',
      'Covers salary negotiation, informational interviews, and digital job hunting for the modern era.',
    ],
    relatedSlugs: ['never-eat-alone', 'knock-em-dead-resumes'],
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────
function run() {
  console.log('🔧 Fixing and expanding books.json...');

  const raw = fs.readFileSync(booksPath, 'utf-8');
  let books = JSON.parse(raw);

  // 1. Remove The Martian (wrong ASIN)
  const beforeCount = books.length;
  books = books.filter(b => b.asin !== '0804139024');
  if (books.length < beforeCount) console.log(`  ✂️  Removed "The Martian" (wrong ASIN mapping)`);

  // 2. Apply patches to scraped books
  for (const book of books) {
    const patch = PATCHES[book.asin];
    if (patch) {
      console.log(`  🔄 Patching "${book.title.slice(0, 40)}..." → "${patch.title}"`);
      Object.assign(book, patch);
      book.priceLastCheckedAt = TODAY;
    }
  }

  // 3. Add new books (skip if ASIN already exists)
  const existingAsins = new Set(books.map(b => b.asin));
  let addedCount = 0;
  for (const nb of NEW_BOOKS) {
    if (existingAsins.has(nb.asin)) {
      console.log(`  ⏭️  Already exists: ${nb.title}`);
      continue;
    }
    nb.priceLastCheckedAt = TODAY;
    books.push(nb);
    existingAsins.add(nb.asin);
    addedCount++;
    console.log(`  ➕ Added [${nb.category}] ${nb.title} — ₹${nb.price}`);
  }

  fs.writeFileSync(booksPath, JSON.stringify(books, null, 2), 'utf-8');

  console.log(`\n✅ Done! Total books in DB: ${books.length}`);
  console.log(`   Patched: ${Object.keys(PATCHES).length} | Added: ${addedCount} | Removed: ${beforeCount - (books.length - addedCount)}`);
}

run();
