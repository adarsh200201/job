/**
 * AffiliateBooks.jsx — Premium Book Store Module
 * Amazon Associates ID: nextjobpost-21
 *
 * Usage:
 *   <AffiliateBooks category="ssc" />
 *   <AffiliateBooks category="banking" />
 *   <AffiliateBooks category="railway" />
 *   <AffiliateBooks category="aptitude" />
 *   <AffiliateBooks category="english" />
 *   <AffiliateBooks category="gk" />
 *   <AffiliateBooks category="reasoning" />
 *   <AffiliateBooks category="upsc" />
 *   <AffiliateBooks category="resume" />
 *   <AffiliateBooks category="general" />
 */

import React, { useState, useRef } from 'react';

const ASSOCIATE_TAG = 'nextjobpost-21'; // ✅ Amazon Associates ID — confirmed live

function amzLink(asin, title, author) {
  return `https://www.amazon.in/s?k=${encodeURIComponent(title + ' ' + (author || ''))}&tag=${ASSOCIATE_TAG}`;
}

// ─────────────────────────────────────────────────────────────
// 📚 FULL BOOK DATABASE — All Categories
// ─────────────────────────────────────────────────────────────
const BOOKS = {
  ssc: [
    { title: 'Quantitative Aptitude', author: 'R.S. Aggarwal', price: '₹430', mrp: '₹695', img: 'https://images-eu.ssl-images-amazon.com/images/P/8121908957.01.LZZZZZZZ.jpg', asin: '8121908957', badge: '🏆 Bestseller', color: '#f59e0b' },
    { title: "Lucent's General Knowledge", author: 'Lucent Publication', price: '₹320', mrp: '₹495', img: 'https://images-eu.ssl-images-amazon.com/images/P/8190086006.01.LZZZZZZZ.jpg', asin: '8190086006', badge: '🔥 Most Popular', color: '#ef4444' },
    { title: 'SSC CGL Tier I & II — 8700+ Papers', author: 'Kiran Prakashan', price: '₹695', mrp: '₹995', img: 'https://images-eu.ssl-images-amazon.com/images/P/9327468042.01.LZZZZZZZ.jpg', asin: '9327468042', badge: '📋 Practice Book', color: '#8b5cf6' },
    { title: 'Verbal & Non-Verbal Reasoning', author: 'R.S. Aggarwal', price: '₹560', mrp: '₹895', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352534034.01.LZZZZZZZ.jpg', asin: '9352534034', badge: '⭐ Top Pick', color: '#2563eb' },
    { title: 'SSC CHSL 10+2 Level Exam Guide', author: 'RPH Editorial Board', price: '₹395', mrp: '₹595', img: 'https://images-eu.ssl-images-amazon.com/images/P/9386845261.01.LZZZZZZZ.jpg', asin: '9386845261', badge: '✅ Recommended', color: '#10b981' },
    { title: 'SSC Mathematics — Rakesh Yadav', author: 'Rakesh Yadav', price: '₹480', mrp: '₹720', img: 'https://images-eu.ssl-images-amazon.com/images/P/9386845163.01.LZZZZZZZ.jpg', asin: '9386845163', badge: '📐 Maths Expert', color: '#0ea5e9' },
    { title: 'SSC CGL Previous Year Papers', author: 'Arihant Experts', price: '₹350', mrp: '₹550', img: 'https://images-eu.ssl-images-amazon.com/images/P/9325298821.01.LZZZZZZZ.jpg', asin: '9325298821', badge: '📝 PYQ Book', color: '#d97706' },
    { title: 'General English — SP Bakshi', author: 'S.P. Bakshi', price: '₹390', mrp: '₹595', img: 'https://images-eu.ssl-images-amazon.com/images/P/8174826718.01.LZZZZZZZ.jpg', asin: '8174826718', badge: '🔤 English', color: '#6366f1' },
  ],
  banking: [
    { title: 'Quantitative Aptitude', author: 'R.S. Aggarwal', price: '₹430', mrp: '₹695', img: 'https://images-eu.ssl-images-amazon.com/images/P/8121908957.01.LZZZZZZZ.jpg', asin: '8121908957', badge: '🏆 Bestseller', color: '#f59e0b' },
    { title: 'Objective English', author: 'S.P. Bakshi', price: '₹390', mrp: '₹595', img: 'https://images-eu.ssl-images-amazon.com/images/P/8174826718.01.LZZZZZZZ.jpg', asin: '8174826718', badge: '🔤 English', color: '#2563eb' },
    { title: 'Banking & Financial Awareness', author: 'Arihant Experts', price: '₹350', mrp: '₹550', img: 'https://images-eu.ssl-images-amazon.com/images/P/9325295377.01.LZZZZZZZ.jpg', asin: '9325295377', badge: '🏦 Banking GK', color: '#10b981' },
    { title: 'Data Interpretation & Analysis', author: 'Arun Sharma', price: '₹480', mrp: '₹750', img: 'https://images-eu.ssl-images-amazon.com/images/P/0070678510.01.LZZZZZZZ.jpg', asin: '0070678510', badge: '📊 Data Analysis', color: '#8b5cf6' },
    { title: 'IBPS PO/MT 20 Practice Sets', author: 'Arihant Experts', price: '₹320', mrp: '₹495', img: 'https://images-eu.ssl-images-amazon.com/images/P/9325794056.01.LZZZZZZZ.jpg', asin: '9325794056', badge: '🎯 Mock Tests', color: '#ef4444' },
    { title: 'SBI PO Previous Year Papers', author: 'Kiran Prakashan', price: '₹440', mrp: '₹695', img: 'https://images-eu.ssl-images-amazon.com/images/P/9327469316.01.LZZZZZZZ.jpg', asin: '9327469316', badge: '📋 PYQ Book', color: '#d97706' },
    { title: 'Verbal & Non-Verbal Reasoning', author: 'R.S. Aggarwal', price: '₹560', mrp: '₹895', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352534034.01.LZZZZZZZ.jpg', asin: '9352534034', badge: '🧠 Reasoning', color: '#0ea5e9' },
    { title: "Lucent's General Knowledge", author: 'Lucent Publication', price: '₹320', mrp: '₹495', img: 'https://images-eu.ssl-images-amazon.com/images/P/8190086006.01.LZZZZZZZ.jpg', asin: '8190086006', badge: '🌍 GK', color: '#6366f1' },
  ],
  railway: [
    { title: 'RRB NTPC — Kiran Prakashan', author: 'Kiran Prakashan', price: '₹550', mrp: '₹850', img: 'https://images-eu.ssl-images-amazon.com/images/P/9327461832.01.LZZZZZZZ.jpg', asin: '9327461832', badge: '🚂 RRB NTPC', color: '#2563eb' },
    { title: "Lucent's General Knowledge", author: 'Lucent Publication', price: '₹320', mrp: '₹495', img: 'https://images-eu.ssl-images-amazon.com/images/P/8190086006.01.LZZZZZZZ.jpg', asin: '8190086006', badge: '🔥 Bestseller', color: '#ef4444' },
    { title: 'Quantitative Aptitude', author: 'R.S. Aggarwal', price: '₹430', mrp: '₹695', img: 'https://images-eu.ssl-images-amazon.com/images/P/8121908957.01.LZZZZZZZ.jpg', asin: '8121908957', badge: '🏆 Essential', color: '#f59e0b' },
    { title: 'General Science for Competitive Exams', author: 'Arihant Experts', price: '₹295', mrp: '₹450', img: 'https://images-eu.ssl-images-amazon.com/images/P/9351766462.01.LZZZZZZZ.jpg', asin: '9351766462', badge: '🔬 Science', color: '#10b981' },
    { title: 'RRB Group D Previous Papers', author: 'Kiran Prakashan', price: '₹420', mrp: '₹650', img: 'https://images-eu.ssl-images-amazon.com/images/P/9327462854.01.LZZZZZZZ.jpg', asin: '9327462854', badge: '📋 PYQ', color: '#8b5cf6' },
    { title: 'Verbal & Non-Verbal Reasoning', author: 'R.S. Aggarwal', price: '₹560', mrp: '₹895', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352534034.01.LZZZZZZZ.jpg', asin: '9352534034', badge: '🧠 Reasoning', color: '#6366f1' },
    { title: 'RRB ALP Stage I & II Guide', author: 'Arihant Experts', price: '₹480', mrp: '₹750', img: 'https://images-eu.ssl-images-amazon.com/images/P/9325298432.01.LZZZZZZZ.jpg', asin: '9325298432', badge: '🚆 ALP Guide', color: '#0ea5e9' },
    { title: 'General English', author: 'S.P. Bakshi', price: '₹390', mrp: '₹595', img: 'https://images-eu.ssl-images-amazon.com/images/P/8174826718.01.LZZZZZZZ.jpg', asin: '8174826718', badge: '🔤 English', color: '#d97706' },
  ],
  aptitude: [
    { title: 'Quantitative Aptitude', author: 'R.S. Aggarwal', price: '₹430', mrp: '₹695', img: 'https://images-eu.ssl-images-amazon.com/images/P/8121908957.01.LZZZZZZZ.jpg', asin: '8121908957', badge: '🏆 Bestseller', color: '#f59e0b' },
    { title: 'How to Prepare for Quantitative Aptitude', author: 'Arun Sharma', price: '₹499', mrp: '₹799', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352606337.01.LZZZZZZZ.jpg', asin: '9352606337', badge: '⭐ Top Pick', color: '#2563eb' },
    { title: 'Magical Book on Quicker Maths', author: 'M. Tyra', price: '₹385', mrp: '₹595', img: 'https://images-eu.ssl-images-amazon.com/images/P/8190458825.01.LZZZZZZZ.jpg', asin: '8190458825', badge: '⚡ Tricks & Shortcuts', color: '#10b981' },
    { title: 'Verbal & Non-Verbal Reasoning', author: 'R.S. Aggarwal', price: '₹560', mrp: '₹895', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352534034.01.LZZZZZZZ.jpg', asin: '9352534034', badge: '🧠 Reasoning', color: '#8b5cf6' },
    { title: 'Data Interpretation & Analysis', author: 'Arun Sharma', price: '₹480', mrp: '₹750', img: 'https://images-eu.ssl-images-amazon.com/images/P/0070678510.01.LZZZZZZZ.jpg', asin: '0070678510', badge: '📊 DI', color: '#ef4444' },
    { title: 'Fast Track Objective Arithmetic', author: 'Rajesh Verma', price: '₹310', mrp: '₹480', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352037294.01.LZZZZZZZ.jpg', asin: '9352037294', badge: '⚡ Fast Track', color: '#0ea5e9' },
    { title: 'Analytical Reasoning', author: 'M.K. Pandey', price: '₹340', mrp: '₹525', img: 'https://images-eu.ssl-images-amazon.com/images/P/8190458884.01.LZZZZZZZ.jpg', asin: '8190458884', badge: '💡 Logical', color: '#d97706' },
    { title: 'SSC Mathematics 7300+', author: 'Rakesh Yadav', price: '₹480', mrp: '₹720', img: 'https://images-eu.ssl-images-amazon.com/images/P/9386845163.01.LZZZZZZZ.jpg', asin: '9386845163', badge: '📐 7300+ Qs', color: '#6366f1' },
  ],
  upsc: [
    { title: 'Indian Polity', author: 'M. Laxmikanth', price: '₹750', mrp: '₹1,195', img: 'https://images-eu.ssl-images-amazon.com/images/P/9339221443.01.LZZZZZZZ.jpg', asin: '9339221443', badge: '🏛️ Must Read', color: '#2563eb' },
    { title: 'Certificate Physical & Human Geography', author: 'GC Leong', price: '₹380', mrp: '₹595', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352535669.01.LZZZZZZZ.jpg', asin: '9352535669', badge: '🌍 Geography', color: '#10b981' },
    { title: 'Indian Economy', author: 'Ramesh Singh', price: '₹680', mrp: '₹1,095', img: 'https://images-eu.ssl-images-amazon.com/images/P/9353167175.01.LZZZZZZZ.jpg', asin: '9353167175', badge: '💹 Economy', color: '#f59e0b' },
    { title: 'Ancient India', author: 'R.S. Sharma', price: '₹295', mrp: '₹450', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352602412.01.LZZZZZZZ.jpg', asin: '9352602412', badge: '📜 History', color: '#8b5cf6' },
    { title: 'Introduction to the Constitution of India', author: 'D.D. Basu', price: '₹420', mrp: '₹650', img: 'https://images-eu.ssl-images-amazon.com/images/P/9388684486.01.LZZZZZZZ.jpg', asin: '9388684486', badge: '⚖️ Constitution', color: '#ef4444' },
    { title: 'Environment & Ecology', author: 'Majid Husain', price: '₹360', mrp: '₹565', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352604482.01.LZZZZZZZ.jpg', asin: '9352604482', badge: '🌱 Environment', color: '#0ea5e9' },
    { title: 'UPSC Prelims 25 Years Papers', author: 'Disha Experts', price: '₹445', mrp: '₹695', img: 'https://images-eu.ssl-images-amazon.com/images/P/9390711991.01.LZZZZZZZ.jpg', asin: '9390711991', badge: '📋 PYQ', color: '#d97706' },
    { title: 'Ethics, Integrity & Aptitude', author: 'G. Subba Rao', price: '₹520', mrp: '₹820', img: 'https://images-eu.ssl-images-amazon.com/images/P/9353160579.01.LZZZZZZZ.jpg', asin: '9353160579', badge: '📝 GS Paper 4', color: '#6366f1' },
  ],
  english: [
    { title: 'Objective English', author: 'S.P. Bakshi', price: '₹390', mrp: '₹595', img: 'https://images-eu.ssl-images-amazon.com/images/P/8174826718.01.LZZZZZZZ.jpg', asin: '8174826718', badge: '🏆 Bestseller', color: '#2563eb' },
    { title: 'High School English Grammar & Composition', author: 'Wren & Martin', price: '₹350', mrp: '₹550', img: 'https://images-eu.ssl-images-amazon.com/images/P/8121900093.01.LZZZZZZZ.jpg', asin: '8121900093', badge: '📚 Classic', color: '#f59e0b' },
    { title: 'Word Power Made Easy', author: 'Norman Lewis', price: '₹280', mrp: '₹430', img: 'https://images-eu.ssl-images-amazon.com/images/P/0143424524.01.LZZZZZZZ.jpg', asin: '0143424524', badge: '💬 Vocabulary', color: '#10b981' },
    { title: 'Objective General English', author: 'R.S. Aggarwal', price: '₹310', mrp: '₹480', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352534069.01.LZZZZZZZ.jpg', asin: '9352534069', badge: '⭐ Top Rated', color: '#8b5cf6' },
    { title: 'How to Prepare for Verbal Ability', author: 'Arun Sharma', price: '₹440', mrp: '₹695', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352606329.01.LZZZZZZZ.jpg', asin: '9352606329', badge: '📖 Verbal', color: '#ef4444' },
    { title: 'Competitive English Grammar', author: 'S.C. Gupta', price: '₹245', mrp: '₹380', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352037618.01.LZZZZZZZ.jpg', asin: '9352037618', badge: '📝 Grammar', color: '#0ea5e9' },
  ],
  gk: [
    { title: "Lucent's General Knowledge", author: 'Lucent Publication', price: '₹320', mrp: '₹495', img: 'https://images-eu.ssl-images-amazon.com/images/P/8190086006.01.LZZZZZZZ.jpg', asin: '8190086006', badge: '🔥 #1 GK Book', color: '#ef4444' },
    { title: 'Manorama Year Book 2026', author: 'Mammen Mathew', price: '₹220', mrp: '₹340', img: 'https://images-eu.ssl-images-amazon.com/images/P/9390387698.01.LZZZZZZZ.jpg', asin: '9390387698', badge: '📰 Current Affairs', color: '#2563eb' },
    { title: 'General Knowledge 2026', author: 'Arihant Experts', price: '₹195', mrp: '₹295', img: 'https://images-eu.ssl-images-amazon.com/images/P/9325298562.01.LZZZZZZZ.jpg', asin: '9325298562', badge: '🌟 Annual', color: '#f59e0b' },
    { title: 'Static General Knowledge', author: 'Disha Experts', price: '₹260', mrp: '₹400', img: 'https://images-eu.ssl-images-amazon.com/images/P/9390711373.01.LZZZZZZZ.jpg', asin: '9390711373', badge: '📚 Static GK', color: '#10b981' },
    { title: 'Concise GK 2026', author: 'S. Chand', price: '₹175', mrp: '₹270', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352535871.01.LZZZZZZZ.jpg', asin: '9352535871', badge: '💡 Concise', color: '#8b5cf6' },
    { title: 'India Year Book 2026', author: 'Publication Division', price: '₹350', mrp: '₹540', img: 'https://images-eu.ssl-images-amazon.com/images/P/9390387456.01.LZZZZZZZ.jpg', asin: '9390387456', badge: '🇮🇳 Official', color: '#6366f1' },
  ],
  reasoning: [
    { title: 'Verbal & Non-Verbal Reasoning', author: 'R.S. Aggarwal', price: '₹560', mrp: '₹895', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352534034.01.LZZZZZZZ.jpg', asin: '9352534034', badge: '🏆 Bestseller', color: '#f59e0b' },
    { title: 'Analytical Reasoning', author: 'M.K. Pandey', price: '₹340', mrp: '₹525', img: 'https://images-eu.ssl-images-amazon.com/images/P/8190458884.01.LZZZZZZZ.jpg', asin: '8190458884', badge: '💡 Analytical', color: '#2563eb' },
    { title: 'How to Prepare for Logical Reasoning', author: 'Arun Sharma', price: '₹420', mrp: '₹650', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352606434.01.LZZZZZZZ.jpg', asin: '9352606434', badge: '⭐ Top Pick', color: '#10b981' },
    { title: 'A Modern Approach to Verbal Reasoning', author: 'R.S. Aggarwal', price: '₹340', mrp: '₹525', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352534018.01.LZZZZZZZ.jpg', asin: '9352534018', badge: '📖 Verbal', color: '#8b5cf6' },
    { title: 'Non-Verbal Reasoning', author: 'B.S. Sijwali', price: '₹295', mrp: '₹450', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352035933.01.LZZZZZZZ.jpg', asin: '9352035933', badge: '🔷 Non-Verbal', color: '#ef4444' },
    { title: 'Logical and Analytical Reasoning', author: 'A.K. Gupta', price: '₹280', mrp: '₹430', img: 'https://images-eu.ssl-images-amazon.com/images/P/9386845323.01.LZZZZZZZ.jpg', asin: '9386845323', badge: '🧩 Puzzles', color: '#0ea5e9' },
  ],
  resume: [
    { title: 'Cracking the Coding Interview', author: 'Gayle McDowell', price: '₹1,250', mrp: '₹1,995', img: 'https://images-eu.ssl-images-amazon.com/images/P/0984782850.01.LZZZZZZZ.jpg', asin: '0984782850', badge: '💻 Must Have', color: '#2563eb' },
    { title: 'The Google Resume', author: 'Gayle McDowell', price: '₹750', mrp: '₹1,195', img: 'https://images-eu.ssl-images-amazon.com/images/P/0470927623.01.LZZZZZZZ.jpg', asin: '0470927623', badge: '🏆 Bestseller', color: '#f59e0b' },
    { title: 'Knock \'em Dead Resumes', author: 'Martin Yate', price: '₹499', mrp: '₹799', img: 'https://images-eu.ssl-images-amazon.com/images/P/9351031381.01.LZZZZZZZ.jpg', asin: '9351031381', badge: '📄 Resume Pro', color: '#10b981' },
    { title: 'What Color Is Your Parachute?', author: 'Richard N. Bolles', price: '₹680', mrp: '₹1,050', img: 'https://images-eu.ssl-images-amazon.com/images/P/1984857886.01.LZZZZZZZ.jpg', asin: '1984857886', badge: '🎯 Career Guide', color: '#8b5cf6' },
    { title: 'Never Eat Alone', author: 'Keith Ferrazzi', price: '₹580', mrp: '₹895', img: 'https://images-eu.ssl-images-amazon.com/images/P/0385346654.01.LZZZZZZZ.jpg', asin: '0385346654', badge: '🤝 Networking', color: '#ef4444' },
  ],
  general: [
    { title: 'Quantitative Aptitude', author: 'R.S. Aggarwal', price: '₹430', mrp: '₹695', img: 'https://images-eu.ssl-images-amazon.com/images/P/8121908957.01.LZZZZZZZ.jpg', asin: '8121908957', badge: '🏆 Bestseller', color: '#f59e0b' },
    { title: "Lucent's General Knowledge", author: 'Lucent Publication', price: '₹320', mrp: '₹495', img: 'https://images-eu.ssl-images-amazon.com/images/P/8190086006.01.LZZZZZZZ.jpg', asin: '8190086006', badge: '🔥 Most Popular', color: '#ef4444' },
    { title: 'Verbal & Non-Verbal Reasoning', author: 'R.S. Aggarwal', price: '₹560', mrp: '₹895', img: 'https://images-eu.ssl-images-amazon.com/images/P/9352534034.01.LZZZZZZZ.jpg', asin: '9352534034', badge: '🧠 Reasoning', color: '#2563eb' },
    { title: 'Objective English', author: 'S.P. Bakshi', price: '₹390', mrp: '₹595', img: 'https://images-eu.ssl-images-amazon.com/images/P/8174826718.01.LZZZZZZZ.jpg', asin: '8174826718', badge: '🔤 English', color: '#8b5cf6' },
    { title: 'Magical Book on Quicker Maths', author: 'M. Tyra', price: '₹385', mrp: '₹595', img: 'https://images-eu.ssl-images-amazon.com/images/P/8190458825.01.LZZZZZZZ.jpg', asin: '8190458825', badge: '⚡ Shortcuts', color: '#10b981' },
    { title: 'Data Interpretation', author: 'Arun Sharma', price: '₹480', mrp: '₹750', img: 'https://images-eu.ssl-images-amazon.com/images/P/0070678510.01.LZZZZZZZ.jpg', asin: '0070678510', badge: '📊 DI', color: '#6366f1' },
  ],
};

// Fallback book image on error — uses Google Books directly (free, no hotlink block)
function BookCover({ src, title, color, asin }) {
  const [stage, setStage] = useState(0);
  // stage 0: Google Books thumbnail, stage 1: emoji fallback
  const googleBooksUrl = `https://books.google.com/books/content?vid=ISBN${asin}&printsec=frontcover&img=1&zoom=1`;

  const srcs = [googleBooksUrl];

  if (stage >= 1) {
    return (
      <div style={{
        width: '100%', height: '160px',
        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2.5rem', borderRadius: '8px 8px 0 0',
        border: `2px solid ${color}33`
      }}>📚</div>
    );
  }
  return (
    <img
      src={srcs[stage]}
      alt={title}
      onError={() => setStage(s => s + 1)}
      style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px 8px 0 0', display: 'block' }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// 🏪 MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function AffiliateBooks({ category = 'general' }) {
  const books = BOOKS[category] || BOOKS.general;
  const [activeTab, setActiveTab] = useState(category);
  const scrollRef = useRef(null);

  // Tab categories to switch between
  const TABS = [
    { key: 'ssc',       label: 'SSC',       icon: '📋' },
    { key: 'banking',   label: 'Banking',   icon: '🏦' },
    { key: 'railway',   label: 'Railway',   icon: '🚂' },
    { key: 'upsc',      label: 'UPSC',      icon: '🏛️' },
    { key: 'aptitude',  label: 'Aptitude',  icon: '📐' },
    { key: 'reasoning', label: 'Reasoning', icon: '🧠' },
    { key: 'gk',        label: 'GK',        icon: '🌍' },
    { key: 'english',   label: 'English',   icon: '🔤' },
  ];

  const activeBooks = BOOKS[activeTab] || books;

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        .njp-books-wrap { background: linear-gradient(135deg, #0f172a, #1e1b4b); border-radius: 20px; padding: 24px; margin-bottom: 28px; }
        .njp-books-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
        .njp-books-title { color: #fff; font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
        .njp-books-title span { background: linear-gradient(90deg,#fbbf24,#f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .njp-amz-badge { display: flex; align-items: center; gap: 6px; background: rgba(255,153,0,0.15); border: 1px solid rgba(255,153,0,0.4); border-radius: 8px; padding: 4px 10px; }
        .njp-amz-badge span { color: #fbbf24; font-size: 0.75rem; font-weight: 700; }
        .njp-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 16px; scrollbar-width: none; }
        .njp-tabs::-webkit-scrollbar { display: none; }
        .njp-tab { white-space: nowrap; padding: 6px 14px; border-radius: 20px; border: 1.5px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.7); font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 160ms ease; }
        .njp-tab:hover { background: rgba(255,255,255,0.14); color: #fff; }
        .njp-tab.active { background: #f59e0b; border-color: #f59e0b; color: #000; font-weight: 800; }
        .njp-scroll-row-wrap { position: relative; }
        .njp-scroll-row { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 8px; scroll-snap-type: x mandatory; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent; }
        .njp-scroll-row::-webkit-scrollbar { height: 4px; }
        .njp-scroll-row::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        .njp-book-card { flex: 0 0 170px; scroll-snap-align: start; background: #fff; border-radius: 12px; overflow: hidden; text-decoration: none; transition: all 200ms ease; display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
        .njp-book-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.4); }
        .njp-book-body { padding: 10px; flex: 1; display: flex; flex-direction: column; }
        .njp-book-badge { display: inline-block; font-size: 0.62rem; font-weight: 700; padding: 2px 7px; border-radius: 10px; color: #fff; margin-bottom: 5px; }
        .njp-book-name { font-size: 0.8rem; font-weight: 800; color: #0f172a; line-height: 1.35; margin-bottom: 3px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .njp-book-author { font-size: 0.7rem; color: #64748b; margin-bottom: 8px; }
        .njp-book-price-row { margin-top: auto; display: flex; align-items: baseline; gap: 5px; flex-wrap: wrap; }
        .njp-book-price { font-size: 0.9rem; font-weight: 800; color: #b45309; }
        .njp-book-mrp { font-size: 0.7rem; color: #94a3b8; text-decoration: line-through; }
        .njp-book-cta { display: block; text-align: center; background: #ff9900; color: #000; font-size: 0.7rem; font-weight: 800; padding: 7px; border-top: 1px solid #fde68a; letter-spacing: 0.02em; transition: background 150ms; }
        .njp-book-card:hover .njp-book-cta { background: #e68a00; }
        .njp-scroll-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.25); color: #fff; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2; transition: all 160ms; backdrop-filter: blur(4px); }
        .njp-scroll-btn:hover { background: rgba(255,255,255,0.25); }
        .njp-scroll-btn.left { left: -14px; }
        .njp-scroll-btn.right { right: -14px; }
        .njp-disclosure { font-size: 0.67rem; color: rgba(255,255,255,0.35); margin-top: 12px; text-align: center; font-style: italic; }
        @media (max-width: 600px) { .njp-scroll-btn { display: none; } .njp-books-wrap { padding: 16px; border-radius: 14px; } }
      `}</style>

      <div className="njp-books-wrap">
        {/* Header */}
        <div className="njp-books-header">
          <h3 className="njp-books-title">
            📚 <span>Book Store</span> — Recommended for Exam Prep
          </h3>
          <div className="njp-amz-badge">
            <span>🛒 Buy on Amazon.in</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="njp-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`njp-tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Book Cards Scroll Row */}
        <div className="njp-scroll-row-wrap">
          <button className="njp-scroll-btn left" onClick={() => scroll(-1)}>‹</button>

          <div className="njp-scroll-row" ref={scrollRef}>
            {activeBooks.map((book, idx) => (
              <a
                key={idx}
                href={amzLink(book.asin, book.title, book.author)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="njp-book-card"
              >
                <BookCover src={book.img} title={book.title} color={book.color} asin={book.asin} />
                <div className="njp-book-body">
                  <span className="njp-book-badge" style={{ background: book.color }}>
                    {book.badge}
                  </span>
                  <div className="njp-book-name">{book.title}</div>
                  <div className="njp-book-author">by {book.author}</div>
                  <div className="njp-book-price-row">
                    <span className="njp-book-price">{book.price}</span>
                    <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: '500', marginLeft: '2px' }}>(approx.)</span>
                    <span className="njp-book-mrp">{book.mrp}</span>
                  </div>
                </div>
                <span className="njp-book-cta">🛒 Buy on Amazon →</span>
              </a>
            ))}
          </div>

          <button className="njp-scroll-btn right" onClick={() => scroll(1)}>›</button>
        </div>

        <p className="njp-disclosure">
          📢 Affiliate Disclosure: NextJobPost earns a small commission from Amazon purchases at no extra cost to you.
        </p>
      </div>
    </>
  );
}
