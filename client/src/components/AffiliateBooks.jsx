/**
 * AffiliateBooks.jsx
 * Reusable Amazon Associates book recommendation component.
 *
 * SETUP:
 *   1. Sign up at https://affiliate-program.amazon.in
 *   2. Replace YOUR_ASSOCIATE_TAG below with your actual tag (e.g. "nextjobpost-21")
 *   3. The component automatically picks the right books based on the `category` prop
 *
 * Usage:
 *   <AffiliateBooks category="ssc" />
 *   <AffiliateBooks category="banking" />
 *   <AffiliateBooks category="railway" />
 *   <AffiliateBooks category="aptitude" />
 *   <AffiliateBooks category="resume" />
 *   <AffiliateBooks category="general" />   ← default
 */

import React, { useState } from 'react';

// ─────────────────────────────────────────
// 🔑 PUT YOUR AMAZON ASSOCIATE TAG HERE
// ─────────────────────────────────────────
const ASSOCIATE_TAG = 'nextjobpost-21'; // ✅ Amazon Associates ID — confirmed live

function buildLink(asin) {
  return `https://www.amazon.in/dp/${asin}?tag=${ASSOCIATE_TAG}`;
}

// ─────────────────────────────────────────
// 📚 BOOK DATABASE BY CATEGORY
// ─────────────────────────────────────────
const BOOKS = {
  ssc: [
    {
      title: 'Quantitative Aptitude — R.S. Aggarwal',
      subtitle: 'Best for SSC CGL, CHSL, MTS, Bank exams',
      price: '₹430',
      rating: '4.5',
      reviews: '28,000+',
      icon: '📐',
      asin: '8121908957',
      badge: 'Bestseller',
      badgeColor: '#f59e0b',
    },
    {
      title: "Lucent's General Knowledge",
      subtitle: 'Static GK for SSC, Railway, Banking exams',
      price: '₹320',
      rating: '4.6',
      reviews: '42,000+',
      icon: '🌍',
      asin: '8190086006',
      badge: 'Most Popular',
      badgeColor: '#10b981',
    },
    {
      title: 'A Modern Approach to Verbal & Non-Verbal Reasoning — R.S. Aggarwal',
      subtitle: 'Reasoning for SSC CGL, CHSL, Banking',
      price: '₹560',
      rating: '4.4',
      reviews: '18,500+',
      icon: '🧠',
      asin: '9352534034',
      badge: 'Top Pick',
      badgeColor: '#2563eb',
    },
    {
      title: 'SSC CGL Tier I & II — Kiran Prakashan',
      subtitle: '8700+ Chapterwise Solved Papers',
      price: '₹695',
      rating: '4.3',
      reviews: '9,200+',
      icon: '📋',
      asin: '9327468042',
      badge: 'Practice Book',
      badgeColor: '#8b5cf6',
    },
  ],
  banking: [
    {
      title: 'Quantitative Aptitude — R.S. Aggarwal',
      subtitle: 'IBPS PO/Clerk, SBI PO/Clerk, RBI',
      price: '₹430',
      rating: '4.5',
      reviews: '28,000+',
      icon: '📐',
      asin: '8121908957',
      badge: 'Bestseller',
      badgeColor: '#f59e0b',
    },
    {
      title: 'Objective English — S.P. Bakshi',
      subtitle: 'Comprehensive English for all bank exams',
      price: '₹390',
      rating: '4.4',
      reviews: '15,000+',
      icon: '📝',
      asin: '8174826718',
      badge: 'Top Pick',
      badgeColor: '#2563eb',
    },
    {
      title: 'Banking & Financial Awareness — Arihant',
      subtitle: 'Banking Awareness for IBPS PO, SBI, RBI',
      price: '₹350',
      rating: '4.2',
      reviews: '7,500+',
      icon: '🏦',
      asin: '9325295377',
      badge: 'Must Have',
      badgeColor: '#10b981',
    },
    {
      title: 'Data Interpretation & Analysis — Arun Sharma',
      subtitle: 'CAT / Bank PO level DI practice',
      price: '₹480',
      rating: '4.4',
      reviews: '11,200+',
      icon: '📊',
      asin: '0070678510',
      badge: 'Advanced',
      badgeColor: '#ef4444',
    },
  ],
  railway: [
    {
      title: 'RRB NTPC — Kiran Prakashan',
      subtitle: 'Chapterwise solved papers — Stage 1 & 2',
      price: '₹550',
      rating: '4.3',
      reviews: '12,000+',
      icon: '🚂',
      asin: '9327461832',
      badge: 'Top Pick',
      badgeColor: '#2563eb',
    },
    {
      title: "Lucent's General Knowledge",
      subtitle: 'Static GK for RRB NTPC & Group D',
      price: '₹320',
      rating: '4.6',
      reviews: '42,000+',
      icon: '🌍',
      asin: '8190086006',
      badge: 'Bestseller',
      badgeColor: '#f59e0b',
    },
    {
      title: 'Quantitative Aptitude — R.S. Aggarwal',
      subtitle: 'Mathematics for RRB CBT Stage 1 & 2',
      price: '₹430',
      rating: '4.5',
      reviews: '28,000+',
      icon: '📐',
      asin: '8121908957',
      badge: 'Essential',
      badgeColor: '#10b981',
    },
    {
      title: 'General Science for Competitive Exams — Arihant',
      subtitle: 'Physics, Chemistry, Biology for Railway',
      price: '₹295',
      rating: '4.2',
      reviews: '8,400+',
      icon: '🔬',
      asin: '9351766462',
      badge: 'Highly Rated',
      badgeColor: '#8b5cf6',
    },
  ],
  aptitude: [
    {
      title: 'Quantitative Aptitude — R.S. Aggarwal',
      subtitle: 'The definitive aptitude book for all exams',
      price: '₹430',
      rating: '4.5',
      reviews: '28,000+',
      icon: '📐',
      asin: '8121908957',
      badge: 'Bestseller',
      badgeColor: '#f59e0b',
    },
    {
      title: 'How to Prepare for Quantitative Aptitude — Arun Sharma',
      subtitle: 'CAT & placement level aptitude',
      price: '₹499',
      rating: '4.4',
      reviews: '19,000+',
      icon: '🧮',
      asin: '9352606337',
      badge: 'Top Pick',
      badgeColor: '#2563eb',
    },
    {
      title: 'Verbal & Non-Verbal Reasoning — R.S. Aggarwal',
      subtitle: 'Comprehensive reasoning for all exams',
      price: '₹560',
      rating: '4.4',
      reviews: '18,500+',
      icon: '🧠',
      asin: '9352534034',
      badge: 'Essential',
      badgeColor: '#10b981',
    },
    {
      title: 'Data Interpretation — Arun Sharma',
      subtitle: 'Complete DI preparation guide',
      price: '₹480',
      rating: '4.4',
      reviews: '11,200+',
      icon: '📊',
      asin: '0070678510',
      badge: 'Advanced',
      badgeColor: '#8b5cf6',
    },
  ],
  resume: [
    {
      title: 'Knock \'em Dead Resumes — Martin Yate',
      subtitle: 'Best-selling resume writing guide globally',
      price: '₹699',
      rating: '4.3',
      reviews: '4,200+',
      icon: '📄',
      asin: '1440566704',
      badge: 'Top Rated',
      badgeColor: '#2563eb',
    },
    {
      title: 'The Google Resume — Laakmann McDowell',
      subtitle: 'How to prepare for tech company interviews',
      price: '₹750',
      rating: '4.5',
      reviews: '8,700+',
      icon: '💼',
      asin: '0470927623',
      badge: 'Bestseller',
      badgeColor: '#f59e0b',
    },
    {
      title: 'Cracking the Coding Interview — G. McDowell',
      subtitle: '189 programming interview questions & solutions',
      price: '₹1,250',
      rating: '4.7',
      reviews: '22,000+',
      icon: '💻',
      asin: '0984782850',
      badge: 'Must Have',
      badgeColor: '#10b981',
    },
  ],
  general: [
    {
      title: 'Quantitative Aptitude — R.S. Aggarwal',
      subtitle: 'Best for all competitive exams in India',
      price: '₹430',
      rating: '4.5',
      reviews: '28,000+',
      icon: '📐',
      asin: '8121908957',
      badge: 'Bestseller',
      badgeColor: '#f59e0b',
    },
    {
      title: "Lucent's General Knowledge",
      subtitle: 'Static GK for SSC, Railway, Banking exams',
      price: '₹320',
      rating: '4.6',
      reviews: '42,000+',
      icon: '🌍',
      asin: '8190086006',
      badge: 'Most Popular',
      badgeColor: '#10b981',
    },
    {
      title: 'Verbal & Non-Verbal Reasoning — R.S. Aggarwal',
      subtitle: 'Reasoning for SSC, Banking, Railway',
      price: '₹560',
      rating: '4.4',
      reviews: '18,500+',
      icon: '🧠',
      asin: '9352534034',
      badge: 'Top Pick',
      badgeColor: '#2563eb',
    },
    {
      title: 'General English — S.P. Bakshi',
      subtitle: 'Comprehensive English for competitive exams',
      price: '₹390',
      rating: '4.4',
      reviews: '15,000+',
      icon: '📝',
      asin: '8174826718',
      badge: 'Highly Rated',
      badgeColor: '#8b5cf6',
    },
  ],
};

// ─────────────────────────────────────────
// ⭐ STAR RATING HELPER
// ─────────────────────────────────────────
function StarRating({ rating }) {
  const full = Math.floor(parseFloat(rating));
  const half = parseFloat(rating) % 1 >= 0.5;
  return (
    <span style={{ color: '#f59e0b', fontSize: '0.8rem', letterSpacing: '1px' }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

// ─────────────────────────────────────────
// 🏪 MAIN COMPONENT
// ─────────────────────────────────────────
export default function AffiliateBooks({ category = 'general', title = null }) {
  const books = BOOKS[category] || BOOKS.general;
  const [hovered, setHovered] = useState(null);

  const sectionTitle = title || '📚 Recommended Books for This Exam';

  return (
    <div style={{
      margin: '2.5rem 0',
      background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
      border: '1px solid #fde68a',
      borderRadius: '16px',
      padding: '1.5rem',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{
          margin: '0 0 4px 0',
          fontSize: '1.1rem',
          fontWeight: '800',
          color: '#92400e',
          letterSpacing: '-0.01em',
        }}>
          {sectionTitle}
        </h3>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#a16207' }}>
          Carefully selected by our editorial team · Purchased via Amazon India · 
          <span style={{ fontStyle: 'italic' }}> We earn a small commission that helps keep NextJobPost free ❤️</span>
        </p>
      </div>

      {/* Books Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '12px',
      }}>
        {books.map((book, idx) => (
          <a
            key={idx}
            href={buildLink(book.asin)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: hovered === idx ? '#fff' : '#fffef8',
              border: `1.5px solid ${hovered === idx ? book.badgeColor : '#fde68a'}`,
              borderRadius: '12px',
              padding: '14px',
              textDecoration: 'none',
              transition: 'all 180ms ease',
              transform: hovered === idx ? 'translateY(-3px)' : 'none',
              boxShadow: hovered === idx ? `0 8px 24px ${book.badgeColor}25` : '0 2px 6px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Badge */}
            <span style={{
              position: 'absolute', top: '10px', right: '10px',
              background: book.badgeColor, color: '#fff',
              fontSize: '0.65rem', fontWeight: '700',
              padding: '2px 8px', borderRadius: '10px',
              letterSpacing: '0.03em',
            }}>
              {book.badge}
            </span>

            {/* Icon */}
            <span style={{ fontSize: '2rem', marginBottom: '8px', display: 'block' }}>
              {book.icon}
            </span>

            {/* Title */}
            <div style={{
              fontWeight: '700',
              fontSize: '0.85rem',
              color: '#1e293b',
              lineHeight: '1.4',
              marginBottom: '4px',
              paddingRight: '40px',
            }}>
              {book.title}
            </div>

            {/* Subtitle */}
            <div style={{
              fontSize: '0.75rem',
              color: '#64748b',
              lineHeight: '1.4',
              marginBottom: '10px',
              flex: 1,
            }}>
              {book.subtitle}
            </div>

            {/* Rating */}
            <div style={{ marginBottom: '8px' }}>
              <StarRating rating={book.rating} />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: '4px' }}>
                {book.rating} ({book.reviews} reviews)
              </span>
            </div>

            {/* Price + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '800', color: '#b45309', fontSize: '0.95rem' }}>
                {book.price}
              </span>
              <span style={{
                background: book.badgeColor,
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '8px',
              }}>
                Buy on Amazon →
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Disclosure */}
      <p style={{
        margin: '12px 0 0 0',
        fontSize: '0.7rem',
        color: '#a16207',
        textAlign: 'center',
        fontStyle: 'italic',
      }}>
        📢 Affiliate Disclosure: NextJobPost earns a small commission from Amazon purchases made through these links, at no extra cost to you.
      </p>
    </div>
  );
}
