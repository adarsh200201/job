import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const TAG = 'nextjobpost-21';
const amz = (asin) => `https://www.amazon.in/dp/${asin}?tag=${TAG}`;

// ─────────────────────────────────────────────────────────────────────────────
// FULL BOOK DATABASE with real Amazon ASINs + cover images
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    key: 'ssc',
    label: 'SSC CGL / CHSL',
    icon: '📋',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg,#ef4444,#dc2626)',
    seoTitle: 'Best Books for SSC CGL & CHSL 2026',
    seoDesc: 'Top-rated books recommended by SSC toppers. Covers Quantitative Aptitude, Reasoning, English, and GK for CGL, CHSL, MTS.',
    books: [
      { title: 'Quantitative Aptitude for Competitive Examinations', author: 'R.S. Aggarwal', asin: '8121908957', price: 430, mrp: 695, img: 'https://images-eu.ssl-images-amazon.com/images/P/8121908957.01.LZZZZZZZ.jpg', rating: 4.5, reviews: 28400, badge: 'Bestseller', tag: 'Most Recommended' },
      { title: "Lucent's General Knowledge", author: 'Lucent Publication', asin: '8190086006', price: 320, mrp: 495, img: 'https://images-eu.ssl-images-amazon.com/images/P/8190086006.01.LZZZZZZZ.jpg', rating: 4.6, reviews: 42100, badge: '#1 GK Book', tag: 'Must Buy' },
      { title: 'A Modern Approach to Verbal & Non-Verbal Reasoning', author: 'R.S. Aggarwal', asin: '9352534034', price: 560, mrp: 895, img: 'https://images-eu.ssl-images-amazon.com/images/P/9352534034.01.LZZZZZZZ.jpg', rating: 4.4, reviews: 18500, badge: 'Top Pick', tag: 'Reasoning Bible' },
      { title: 'SSC Mathematics — 7300+ Objective Questions', author: 'Rakesh Yadav', asin: '9386845163', price: 480, mrp: 720, img: 'https://images-eu.ssl-images-amazon.com/images/P/9386845163.01.LZZZZZZZ.jpg', rating: 4.5, reviews: 9800, badge: 'SSC Specific', tag: 'Practice' },
      { title: 'SSC CGL Tier I & II — 8700+ Chapterwise Papers', author: 'Kiran Prakashan', asin: '9327468042', price: 695, mrp: 995, img: 'https://images-eu.ssl-images-amazon.com/images/P/9327468042.01.LZZZZZZZ.jpg', rating: 4.3, reviews: 9200, badge: 'PYQ Master', tag: 'Previous Papers' },
      { title: 'Objective General English', author: 'S.P. Bakshi', asin: '8174826718', price: 390, mrp: 595, img: 'https://images-eu.ssl-images-amazon.com/images/P/8174826718.01.LZZZZZZZ.jpg', rating: 4.4, reviews: 15200, badge: 'English Expert', tag: 'Language' },
      { title: 'Magical Book on Quicker Maths', author: 'M. Tyra', asin: '8190458825', price: 385, mrp: 595, img: 'https://images-eu.ssl-images-amazon.com/images/P/8190458825.01.LZZZZZZZ.jpg', rating: 4.3, reviews: 7400, badge: 'Shortcuts', tag: 'Speed Maths' },
      { title: 'Fast Track Objective Arithmetic', author: 'Rajesh Verma', asin: '9352037294', price: 310, mrp: 480, img: 'https://images-eu.ssl-images-amazon.com/images/P/9352037294.01.LZZZZZZZ.jpg', rating: 4.2, reviews: 6100, badge: 'Fast Track', tag: 'Arithmetic' },
    ],
  },
  {
    key: 'banking',
    label: 'Banking (IBPS / SBI)',
    icon: '🏦',
    color: '#2563eb',
    gradient: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
    seoTitle: 'Best Books for IBPS PO, SBI PO & Bank Clerk 2026',
    seoDesc: 'Expert-selected books for banking exams. Covers Quant, DI, Reasoning, English and Banking Awareness for IBPS PO, SBI PO, Clerk.',
    books: [
      { title: 'Quantitative Aptitude for Competitive Examinations', author: 'R.S. Aggarwal', asin: '8121908957', price: 430, mrp: 695, img: 'https://images-eu.ssl-images-amazon.com/images/P/8121908957.01.LZZZZZZZ.jpg', rating: 4.5, reviews: 28400, badge: 'Bestseller', tag: 'Essential' },
      { title: 'Data Interpretation & Analysis', author: 'Arun Sharma', asin: '0070678510', price: 480, mrp: 750, img: 'https://images-eu.ssl-images-amazon.com/images/P/0070678510.01.LZZZZZZZ.jpg', rating: 4.4, reviews: 11200, badge: 'DI Master', tag: 'High Weightage' },
      { title: 'Objective General English', author: 'S.P. Bakshi', asin: '8174826718', price: 390, mrp: 595, img: 'https://images-eu.ssl-images-amazon.com/images/P/8174826718.01.LZZZZZZZ.jpg', rating: 4.4, reviews: 15200, badge: 'English', tag: 'Language' },
      { title: 'Banking & Financial Awareness', author: 'Arihant Experts', asin: '9325295377', price: 350, mrp: 550, img: 'https://images-eu.ssl-images-amazon.com/images/P/9325295377.01.LZZZZZZZ.jpg', rating: 4.2, reviews: 7500, badge: 'Banking GK', tag: 'Awareness' },
      { title: 'A Modern Approach to Verbal & Non-Verbal Reasoning', author: 'R.S. Aggarwal', asin: '9352534034', price: 560, mrp: 895, img: 'https://images-eu.ssl-images-amazon.com/images/P/9352534034.01.LZZZZZZZ.jpg', rating: 4.4, reviews: 18500, badge: 'Reasoning', tag: 'Core Subject' },
      { title: 'IBPS PO/MT 20 Practice Sets', author: 'Arihant Experts', asin: '9325794056', price: 320, mrp: 495, img: 'https://images-eu.ssl-images-amazon.com/images/P/9325794056.01.LZZZZZZZ.jpg', rating: 4.1, reviews: 5300, badge: 'Mock Tests', tag: 'Practice' },
      { title: 'How to Prepare for Quantitative Aptitude', author: 'Arun Sharma', asin: '9352606337', price: 499, mrp: 799, img: 'https://images-eu.ssl-images-amazon.com/images/P/9352606337.01.LZZZZZZZ.jpg', rating: 4.4, reviews: 19100, badge: 'Advanced', tag: 'High Level' },
      { title: "Lucent's General Knowledge", author: 'Lucent Publication', asin: '8190086006', price: 320, mrp: 495, img: 'https://images-eu.ssl-images-amazon.com/images/P/8190086006.01.LZZZZZZZ.jpg', rating: 4.6, reviews: 42100, badge: 'Static GK', tag: 'GK Prep' },
    ],
  },
  {
    key: 'railway',
    label: 'Railway (RRB NTPC / Group D)',
    icon: '🚂',
    color: '#10b981',
    gradient: 'linear-gradient(135deg,#10b981,#059669)',
    seoTitle: 'Best Books for RRB NTPC, Group D & ALP 2026',
    seoDesc: 'Best books for Railway recruitment exams. Covers Maths, GK, General Science, and Reasoning for RRB NTPC, Group D, and ALP.',
    books: [
      { title: "Lucent's General Knowledge", author: 'Lucent Publication', asin: '8190086006', price: 320, mrp: 495, img: 'https://images-eu.ssl-images-amazon.com/images/P/8190086006.01.LZZZZZZZ.jpg', rating: 4.6, reviews: 42100, badge: '#1 For Railway', tag: 'Must Buy' },
      { title: 'Quantitative Aptitude for Competitive Examinations', author: 'R.S. Aggarwal', asin: '8121908957', price: 430, mrp: 695, img: 'https://images-eu.ssl-images-amazon.com/images/P/8121908957.01.LZZZZZZZ.jpg', rating: 4.5, reviews: 28400, badge: 'Bestseller', tag: 'Maths' },
      { title: 'RRB NTPC Previous Year Papers', author: 'Kiran Prakashan', asin: '9327461832', price: 550, mrp: 850, img: 'https://images-eu.ssl-images-amazon.com/images/P/9327461832.01.LZZZZZZZ.jpg', rating: 4.3, reviews: 12100, badge: 'PYQ', tag: 'Previous Papers' },
      { title: 'General Science for Competitive Exams', author: 'Arihant Experts', asin: '9351766462', price: 295, mrp: 450, img: 'https://images-eu.ssl-images-amazon.com/images/P/9351766462.01.LZZZZZZZ.jpg', rating: 4.2, reviews: 8400, badge: 'Science', tag: 'High Weightage' },
      { title: 'A Modern Approach to Verbal & Non-Verbal Reasoning', author: 'R.S. Aggarwal', asin: '9352534034', price: 560, mrp: 895, img: 'https://images-eu.ssl-images-amazon.com/images/P/9352534034.01.LZZZZZZZ.jpg', rating: 4.4, reviews: 18500, badge: 'Reasoning', tag: 'Core' },
      { title: 'RRB Group D Previous Year Papers', author: 'Kiran Prakashan', asin: '9327462854', price: 420, mrp: 650, img: 'https://images-eu.ssl-images-amazon.com/images/P/9327462854.01.LZZZZZZZ.jpg', rating: 4.2, reviews: 7200, badge: 'Group D', tag: 'PYQ Book' },
      { title: 'Magical Book on Quicker Maths', author: 'M. Tyra', asin: '8190458825', price: 385, mrp: 595, img: 'https://images-eu.ssl-images-amazon.com/images/P/8190458825.01.LZZZZZZZ.jpg', rating: 4.3, reviews: 7400, badge: 'Shortcuts', tag: 'Speed Maths' },
      { title: 'General English', author: 'S.P. Bakshi', asin: '8174826718', price: 390, mrp: 595, img: 'https://images-eu.ssl-images-amazon.com/images/P/8174826718.01.LZZZZZZZ.jpg', rating: 4.4, reviews: 15200, badge: 'English', tag: 'Language' },
    ],
  },
  {
    key: 'upsc',
    label: 'UPSC Civil Services',
    icon: '🏛️',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
    seoTitle: 'Best Books for UPSC CSE Prelims & Mains 2026',
    seoDesc: 'UPSC toppers recommended books for IAS preparation. Covers Polity, Geography, Economy, History, and Environment for Prelims and Mains.',
    books: [
      { title: 'Indian Polity', author: 'M. Laxmikanth', asin: '9339221443', price: 750, mrp: 1195, img: 'https://images-eu.ssl-images-amazon.com/images/P/9339221443.01.LZZZZZZZ.jpg', rating: 4.8, reviews: 34200, badge: '#1 Polity Book', tag: 'Must Read' },
      { title: 'Certificate Physical & Human Geography', author: 'GC Leong', asin: '9352535669', price: 380, mrp: 595, img: 'https://images-eu.ssl-images-amazon.com/images/P/9352535669.01.LZZZZZZZ.jpg', rating: 4.6, reviews: 21500, badge: 'Geography Bible', tag: 'Classic' },
      { title: 'Indian Economy', author: 'Ramesh Singh', asin: '9353167175', price: 680, mrp: 1095, img: 'https://images-eu.ssl-images-amazon.com/images/P/9353167175.01.LZZZZZZZ.jpg', rating: 4.5, reviews: 18700, badge: 'Economy', tag: 'GS Paper 3' },
      { title: 'Ancient India', author: 'R.S. Sharma', asin: '9352602412', price: 295, mrp: 450, img: 'https://images-eu.ssl-images-amazon.com/images/P/9352602412.01.LZZZZZZZ.jpg', rating: 4.5, reviews: 12400, badge: 'History', tag: 'NCERT Level' },
      { title: 'Environment & Ecology', author: 'Majid Husain', asin: '9352604482', price: 360, mrp: 565, img: 'https://images-eu.ssl-images-amazon.com/images/P/9352604482.01.LZZZZZZZ.jpg', rating: 4.3, reviews: 8900, badge: 'Environment', tag: 'GS Paper 3' },
      { title: 'UPSC 25 Years Prelims Papers', author: 'Disha Experts', asin: '9390711991', price: 445, mrp: 695, img: 'https://images-eu.ssl-images-amazon.com/images/P/9390711991.01.LZZZZZZZ.jpg', rating: 4.4, reviews: 11200, badge: 'PYQ', tag: '25 Years' },
      { title: 'Ethics, Integrity & Aptitude', author: 'G. Subba Rao', asin: '9353160579', price: 520, mrp: 820, img: 'https://images-eu.ssl-images-amazon.com/images/P/9353160579.01.LZZZZZZZ.jpg', rating: 4.4, reviews: 7600, badge: 'Ethics', tag: 'GS Paper 4' },
      { title: 'Introduction to Constitution of India', author: 'D.D. Basu', asin: '9388684486', price: 420, mrp: 650, img: 'https://images-eu.ssl-images-amazon.com/images/P/9388684486.01.LZZZZZZZ.jpg', rating: 4.5, reviews: 14300, badge: 'Constitution', tag: 'Reference' },
    ],
  },
  {
    key: 'aptitude',
    label: 'Aptitude & Reasoning',
    icon: '🧠',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
    seoTitle: 'Best Aptitude & Reasoning Books for All Competitive Exams 2026',
    seoDesc: 'Top books for Quantitative Aptitude, Logical Reasoning, and Data Interpretation for SSC, Banking, CAT, and Placements.',
    books: [
      { title: 'Quantitative Aptitude for Competitive Examinations', author: 'R.S. Aggarwal', asin: '8121908957', price: 430, mrp: 695, img: 'https://images-eu.ssl-images-amazon.com/images/P/8121908957.01.LZZZZZZZ.jpg', rating: 4.5, reviews: 28400, badge: 'Bestseller', tag: 'Universal' },
      { title: 'How to Prepare for Quantitative Aptitude', author: 'Arun Sharma', asin: '9352606337', price: 499, mrp: 799, img: 'https://images-eu.ssl-images-amazon.com/images/P/9352606337.01.LZZZZZZZ.jpg', rating: 4.4, reviews: 19100, badge: 'CAT Level', tag: 'Advanced' },
      { title: 'A Modern Approach to Verbal & Non-Verbal Reasoning', author: 'R.S. Aggarwal', asin: '9352534034', price: 560, mrp: 895, img: 'https://images-eu.ssl-images-amazon.com/images/P/9352534034.01.LZZZZZZZ.jpg', rating: 4.4, reviews: 18500, badge: 'Complete', tag: 'Reasoning' },
      { title: 'Magical Book on Quicker Maths', author: 'M. Tyra', asin: '8190458825', price: 385, mrp: 595, img: 'https://images-eu.ssl-images-amazon.com/images/P/8190458825.01.LZZZZZZZ.jpg', rating: 4.3, reviews: 7400, badge: 'Tricks', tag: 'Speed Maths' },
      { title: 'Analytical Reasoning', author: 'M.K. Pandey', asin: '8190458884', price: 340, mrp: 525, img: 'https://images-eu.ssl-images-amazon.com/images/P/8190458884.01.LZZZZZZZ.jpg', rating: 4.3, reviews: 9800, badge: 'Analytical', tag: 'Logic' },
      { title: 'Data Interpretation & Analysis', author: 'Arun Sharma', asin: '0070678510', price: 480, mrp: 750, img: 'https://images-eu.ssl-images-amazon.com/images/P/0070678510.01.LZZZZZZZ.jpg', rating: 4.4, reviews: 11200, badge: 'DI Expert', tag: 'Data Analysis' },
      { title: 'Fast Track Objective Arithmetic', author: 'Rajesh Verma', asin: '9352037294', price: 310, mrp: 480, img: 'https://images-eu.ssl-images-amazon.com/images/P/9352037294.01.LZZZZZZZ.jpg', rating: 4.2, reviews: 6100, badge: 'Fast Track', tag: 'Quick Revision' },
      { title: 'Logical and Analytical Reasoning', author: 'A.K. Gupta', asin: '9386845323', price: 280, mrp: 430, img: 'https://images-eu.ssl-images-amazon.com/images/P/9386845323.01.LZZZZZZZ.jpg', rating: 4.1, reviews: 4200, badge: 'Logical', tag: 'Puzzles' },
    ],
  },
];

function discount(price, mrp) {
  return Math.round(((mrp - price) / mrp) * 100);
}

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: '#f59e0b', fontSize: '0.75rem', letterSpacing: '1px' }}>
      {'★'.repeat(full)}{half ? '⭐' : ''}
    </span>
  );
}

function BookCard({ book, accentColor }) {
  const [imgErr, setImgErr] = useState(false);
  const disc = discount(book.price, book.mrp);
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={amz(book.asin)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRadius: '14px',
        overflow: 'hidden',
        border: hovered ? `2px solid ${accentColor}` : '2px solid #f1f5f9',
        boxShadow: hovered ? `0 12px 36px ${accentColor}25` : '0 2px 12px rgba(0,0,0,0.06)',
        textDecoration: 'none',
        transition: 'all 200ms ease',
        transform: hovered ? 'translateY(-6px)' : 'none',
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Discount Badge */}
      <div style={{
        position: 'absolute', top: 10, left: 10, zIndex: 2,
        background: '#16a34a', color: '#fff',
        fontWeight: '800', fontSize: '0.72rem',
        padding: '3px 8px', borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
      }}>
        ↓{disc}%
      </div>

      {/* Tag badge */}
      <div style={{
        position: 'absolute', top: 10, right: 10, zIndex: 2,
        background: accentColor, color: '#fff',
        fontWeight: '700', fontSize: '0.65rem',
        padding: '3px 8px', borderRadius: '8px',
      }}>
        {book.badge}
      </div>

      {/* Book Cover Image */}
      <div style={{
        background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}22)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '200px', padding: '16px',
      }}>
        {imgErr ? (
          <div style={{ fontSize: '4rem', textAlign: 'center' }}>📚</div>
        ) : (
          <img
            src={book.img}
            alt={book.title}
            onError={() => setImgErr(true)}
            style={{
              maxHeight: '180px',
              maxWidth: '130px',
              width: 'auto',
              objectFit: 'contain',
              borderRadius: '6px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              transition: 'transform 200ms ease',
              transform: hovered ? 'scale(1.05) rotate(1deg)' : 'none',
            }}
          />
        )}
      </div>

      {/* Book Details */}
      <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Tag */}
        <span style={{
          display: 'inline-block', fontSize: '0.65rem', fontWeight: '700',
          color: accentColor, background: `${accentColor}15`,
          padding: '2px 8px', borderRadius: '6px', marginBottom: '6px',
        }}>
          {book.tag}
        </span>

        {/* Title */}
        <div style={{
          fontWeight: '800', fontSize: '0.88rem', color: '#0f172a',
          lineHeight: '1.35', marginBottom: '4px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {book.title}
        </div>

        {/* Author */}
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
          by {book.author}
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
          <Stars rating={book.rating} />
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            {book.rating} ({book.reviews.toLocaleString('en-IN')})
          </span>
        </div>

        {/* Price */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#b45309' }}>
              ₹{book.price.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>
              ₹{book.mrp.toLocaleString('en-IN')}
            </span>
          </div>

          {/* CTA */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#ff9900',
            color: '#000', fontWeight: '800', fontSize: '0.78rem',
            padding: '9px 0', borderRadius: '10px',
            transition: 'all 150ms',
            boxShadow: hovered ? '0 4px 14px rgba(255,153,0,0.4)' : 'none',
            gap: '6px',
          }}>
            <span>🛒</span> Buy on Amazon
          </div>
        </div>
      </div>
    </a>
  );
}

export default function BestBooks() {
  const [activeCategory, setActiveCategory] = useState('ssc');
  const activeCat = CATEGORIES.find(c => c.key === activeCategory);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Helmet>
        <title>Best Books for SSC, Banking, Railway & UPSC 2026 | NextJobPost</title>
        <meta name="description" content="Buy the best books for SSC CGL, IBPS PO, SBI PO, RRB NTPC, UPSC and all government competitive exams. Recommended by toppers with prices, ratings and direct Amazon links." />
        <meta name="keywords" content="best books for SSC CGL 2026, best books for IBPS PO, best books for RRB NTPC, UPSC books, competitive exam books India" />
        <link rel="canonical" href="https://nextjobpost.in/best-books" />
      </Helmet>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        padding: '3rem 1.5rem 2.5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '5%', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(37,99,235,0.1)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '20px', padding: '6px 16px', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: '700' }}>🛒 Powered by Amazon.in</span>
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '900', margin: '0 0 1rem', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
            📚 Best Books for{' '}
            <span style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Govt Exam Prep
            </span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '620px', margin: '0 auto 2rem', lineHeight: '1.7' }}>
            Handpicked by our editorial team. Verified reviews, real Amazon prices, and genuine discounts — all in one place.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Books Listed', value: '40+' },
              { label: 'Exam Categories', value: '5' },
              { label: 'Avg Discount', value: '35–55%' },
              { label: 'Verified Reviews', value: '1L+' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ color: '#fbbf24', fontWeight: '900', fontSize: '1.4rem', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  padding: '14px 18px',
                  whiteSpace: 'nowrap',
                  border: 'none',
                  borderBottom: isActive ? `3px solid ${cat.color}` : '3px solid transparent',
                  background: 'none',
                  color: isActive ? cat.color : '#64748b',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                {cat.icon} {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* Section Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '5px', height: '28px', background: activeCat.gradient, borderRadius: '4px' }} />
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '900', color: '#0f172a' }}>
              {activeCat.seoTitle}
            </h2>
          </div>
          <p style={{ margin: '0 0 0 15px', color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6' }}>
            {activeCat.seoDesc}
          </p>
        </div>

        {/* Books Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '18px',
        }}>
          {activeCat.books.map((book, idx) => (
            <BookCard key={idx} book={book} accentColor={activeCat.color} />
          ))}
        </div>

        {/* Affiliate Disclosure */}
        <div style={{
          marginTop: '2.5rem', padding: '1rem 1.25rem',
          background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px',
          fontSize: '0.78rem', color: '#92400e', lineHeight: '1.6',
        }}>
          <strong>📢 Affiliate Disclosure:</strong> NextJobPost participates in the Amazon Associates Programme. When you click a book link and make a purchase, we earn a small commission at no extra cost to you. This helps us keep our job portal and preparation tools 100% free for all users.
        </div>

        {/* SEO Content Block */}
        <div style={{ marginTop: '3rem', padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#0f172a', fontWeight: '800', marginBottom: '1rem', fontSize: '1.1rem' }}>
            📖 How to Choose the Right Books for {activeCat.label}
          </h3>
          <div style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.8' }}>
            <p>Choosing the right books is one of the most critical decisions in your competitive exam preparation journey. Many aspirants make the mistake of buying too many books and studying none of them thoroughly. The golden rule is: <strong>master 2–3 books per subject rather than reading 10 superficially.</strong></p>
            <p>For <strong>{activeCat.label}</strong> exams, the books listed above are selected based on three criteria: (1) consistent recommendation by previous year toppers, (2) alignment with the current official syllabus and exam pattern, and (3) authentic user reviews from candidates who cleared the exam using these resources.</p>
            <p>Our editorial team reviews and updates this book list every 3 months to reflect changes in exam patterns, new editions, and updated syllabi. All prices are current Amazon India prices and are subject to change during sale events.</p>
          </div>
        </div>

        {/* Other Exam Categories CTA */}
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ color: '#0f172a', fontWeight: '800', marginBottom: '1rem', fontSize: '1rem' }}>
            📚 Books for Other Exams
          </h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {CATEGORIES.filter(c => c.key !== activeCategory).map(cat => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{
                  padding: '8px 18px', borderRadius: '20px',
                  border: `2px solid ${cat.color}40`,
                  background: `${cat.color}10`, color: cat.color,
                  fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer',
                  transition: 'all 150ms', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${cat.color}20`; e.currentTarget.style.borderColor = cat.color; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${cat.color}10`; e.currentTarget.style.borderColor = `${cat.color}40`; }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: '3rem', background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
          <h3 style={{ color: '#fff', fontWeight: '800', marginBottom: '0.75rem', fontSize: '1.2rem' }}>
            🚀 Also Practice with Free Mock Tests
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Combine your book study with our free online practice questions, previous year papers, and aptitude tests.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/preparation/gov" style={{ background: '#f59e0b', color: '#000', fontWeight: '800', padding: '10px 24px', borderRadius: '10px', textDecoration: 'none', fontSize: '0.88rem' }}>
              🏛️ Govt Exam Practice
            </Link>
            <Link to="/preparation/aptitude" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: '700', padding: '10px 24px', borderRadius: '10px', textDecoration: 'none', fontSize: '0.88rem', border: '1.5px solid rgba(255,255,255,0.2)' }}>
              📐 Aptitude Practice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
