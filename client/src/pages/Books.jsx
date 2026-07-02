import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import booksData from '../data/books.json';

// Fetch Amazon Affiliate Tag safely from Env
const AFFILIATE_TAG = import.meta.env.VITE_AMAZON_TAG || 
                      import.meta.env.NEXT_PUBLIC_AMAZON_TAG || 
                      'nextjobpost-21';

const CATEGORY_META = {
  career: { label: 'Career & Mindset', color: '#2563eb', icon: '🚀' },
  interview: { label: 'Interview Prep', color: '#b45309', icon: '🤝' },
  aptitude: { label: 'Aptitude & Reasoning', color: '#0f766e', icon: '📐' },
  resume: { label: 'Resume & Career', color: '#7c3aed', icon: '📄' },
  govt: { label: 'Govt Exams', color: '#be123c', icon: '🏛️' },
  tech: { label: 'Technical & Coding', color: '#0369a1', icon: '💻' }
};

const BADGE_META = {
  'must-buy': { label: 'Must-Buy', color: '#d97706', bg: '#fef3c7', text: '#92400e' },
  'editor-pick': { label: "Editor's Pick", color: '#2563eb', bg: '#dbeafe', text: '#1e40af' },
  'bestseller': { label: 'Bestseller', color: '#dc2626', bg: '#fee2e2', text: '#991b1b' }
};

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get active category from search params or default to 'all'
  const activeCategory = searchParams.get('category') || 'all';
  
  // Sidebar filters state
  const [priceFilter, setPriceFilter] = useState('any'); // 'any', 'under-300', '300-600', '600-plus'
  const [ratingFilter, setRatingFilter] = useState(0); // 0, 3.5, 4.0, 4.5
  const [mustBuyOnly, setMustBuyOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended', 'popularity', 'rating', 'price-low', 'price-high'
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  // Sync category state when URL change
  const handleCategoryChange = (catKey) => {
    if (catKey === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catKey);
    }
    setSearchParams(searchParams);
  };

  // Helper to build affiliate link
  const getAffiliateLink = (asin) => {
    return `https://www.amazon.in/dp/${asin}?tag=${AFFILIATE_TAG}`;
  };

  // Star rendering helper
  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <span className="text-warning fs-7 me-1">
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
      </span>
    );
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setPriceFilter('any');
    setRatingFilter(0);
    setMustBuyOnly(false);
    setSortBy('recommended');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  // Filter & Sort Logic
  const filteredBooks = booksData.filter(book => {
    // 1. Search filter
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Category filter
    const matchesCategory = activeCategory === 'all' || book.category === activeCategory;
    
    // 3. Price filter
    let matchesPrice = true;
    if (priceFilter === 'under-300') matchesPrice = book.price < 300;
    else if (priceFilter === '300-600') matchesPrice = book.price >= 300 && book.price <= 600;
    else if (priceFilter === '600-plus') matchesPrice = book.price > 600;

    // 4. Rating filter
    const matchesRating = book.rating >= ratingFilter;

    // 5. Must Buy / badge filter
    const matchesMustBuy = !mustBuyOnly || book.badge === 'must-buy';

    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesMustBuy;
  });

  // Sorting
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'recommended') {
      // badged books first, then fallback to popularity (reviews count)
      const aVal = a.badge ? 1 : 0;
      const bVal = b.badge ? 1 : 0;
      if (aVal !== bVal) return bVal - aVal;
      return b.reviews - a.reviews;
    }
    if (sortBy === 'popularity') {
      return b.reviews - a.reviews;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="pb-5" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Helmet>
        <title>Best Books for Career & Govt Exam Preparation 2026 | NextJobPost</title>
        <meta name="description" content="Explore toppers recommended books for SSC CGL, Banking PO, Logical Reasoning, Aptitude, Resume Writing, and IT interviews. Compare prices, ratings and buy on Amazon." />
        <link rel="canonical" href="https://nextjobpost.in/books" />
      </Helmet>

      {/* Minimal & Clean CSS Style Overrides */}
      <style>{`
        /* Minimal Header Section */
        .njp-books-banner {
          background: #ffffff;
          padding: 16px 0 24px 0;
          border-bottom: 1.5px solid #e2e8f0;
          margin-top: -1.5rem; /* Pull banner up to touch the site header directly */
        }

        /* Minimal Affiliate Disclosure */
        .njp-disclosure-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 16px;
          color: #475569;
          font-size: 0.78rem;
          line-height: 1.45;
        }

        /* Clean Categories Tab Scroller */
        .njp-cat-scroller {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .njp-cat-scroller::-webkit-scrollbar {
          display: none;
        }
        .njp-cat-tab {
          white-space: nowrap;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 150ms ease;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 6px;
          height: 36px;
        }
        .njp-cat-tab:hover {
          border-color: #94a3b8;
          color: #0f172a;
          background: #f8fafc;
        }
        .njp-cat-tab.active {
          border-color: #2563eb !important;
          background: #2563eb !important;
          color: #ffffff !important;
        }

        /* Minimal Sidebar Filters */
        .njp-filter-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
        }
        .njp-filter-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }
        .njp-filter-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 8px;
        }

        /* Custom minimal list items */
        .njp-option-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
          color: #475569;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          user-select: none;
        }
        .njp-option-item input[type="radio"] {
          accent-color: #2563eb;
          cursor: pointer;
        }
        .njp-option-item:hover {
          color: #0f172a;
        }
      `}</style>

      {/* Header section */}
      <div className="njp-books-banner mb-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div style={{ maxWidth: '650px' }}>
              <h1 className="fw-bold text-dark mb-2" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>
                📚 Recommended Study Books
              </h1>
              <p className="fs-6 mb-0 text-secondary" style={{ lineHeight: '1.5' }}>
                Topper-recommended study guides, test papers, and reference manuals to help you crack competitive exams and job interviews.
              </p>
            </div>
            <div className="njp-disclosure-box" style={{ maxWidth: '380px' }}>
              ℹ️ <strong>Affiliate Disclosure:</strong> As an Amazon Associate, NextJobPost earns a small commission from qualifying purchases at no extra cost to you.
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Category Selector Tab Pills */}
        <div className="njp-cat-scroller mb-4">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`njp-cat-tab ${activeCategory === 'all' ? 'active' : ''}`}
          >
            All Categories
          </button>
          {Object.entries(CATEGORY_META).map(([key, meta]) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`njp-cat-tab ${isActive ? 'active' : ''}`}
                style={{
                  backgroundColor: isActive ? '#2563eb' : undefined,
                  borderColor: isActive ? '#2563eb' : undefined,
                  color: isActive ? '#fff' : undefined,
                }}
              >
                <span>{meta.icon}</span> {meta.label}
              </button>
            );
          })}
        </div>

        {/* Search, Sort and Layout Section */}
        <div className="row g-4">
          
          {/* Desktop Left Sidebar Filters */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="njp-filter-section sticky-top" style={{ top: '20px', zIndex: 10 }}>
              <h4 className="njp-filter-title">Filters</h4>
              
              {/* Search bar */}
              <div className="mb-4">
                <span className="njp-filter-label">Search Books</span>
                <div className="input-group rounded-3 overflow-hidden border">
                  <span className="input-group-text bg-white border-0 text-muted">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Title or author..."
                    className="form-control border-0 fs-6 ps-0 shadow-none"
                    style={{ height: '36px' }}
                  />
                </div>
              </div>

              {/* Price Filter Options */}
              <div className="mb-4">
                <span className="njp-filter-label">Price Range</span>
                <div className="d-flex flex-column">
                  <label className="njp-option-item">
                    <input type="radio" name="price" checked={priceFilter === 'any'} onChange={() => setPriceFilter('any')} /> Any Price
                  </label>
                  <label className="njp-option-item">
                    <input type="radio" name="price" checked={priceFilter === 'under-300'} onChange={() => setPriceFilter('under-300')} /> Under ₹300
                  </label>
                  <label className="njp-option-item">
                    <input type="radio" name="price" checked={priceFilter === '300-600'} onChange={() => setPriceFilter('300-600')} /> ₹300 – ₹600
                  </label>
                  <label className="njp-option-item">
                    <input type="radio" name="price" checked={priceFilter === '600-plus'} onChange={() => setPriceFilter('600-plus')} /> ₹600+
                  </label>
                </div>
              </div>

              {/* Rating Filter Options */}
              <div className="mb-4">
                <span className="njp-filter-label">Minimum Rating</span>
                <div className="d-flex flex-column">
                  <label className="njp-option-item">
                    <input type="radio" name="rating" checked={ratingFilter === 0} onChange={() => setRatingFilter(0)} /> Any Rating
                  </label>
                  <label className="njp-option-item">
                    <input type="radio" name="rating" checked={ratingFilter === 4.5} onChange={() => setRatingFilter(4.5)} /> ★ 4.5 & Above
                  </label>
                  <label className="njp-option-item">
                    <input type="radio" name="rating" checked={ratingFilter === 4.0} onChange={() => setRatingFilter(4.0)} /> ★ 4.0 & Above
                  </label>
                  <label className="njp-option-item">
                    <input type="radio" name="rating" checked={ratingFilter === 3.5} onChange={() => setRatingFilter(3.5)} /> ★ 3.5 & Above
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="mb-4 border-top pt-3">
                <label className="form-check form-switch d-flex align-items-center justify-content-between cursor-pointer">
                  <span className="fw-semibold text-secondary fs-7">🏆 Must-Buy Only</span>
                  <input
                    className="form-check-input shadow-none"
                    type="checkbox"
                    checked={mustBuyOnly}
                    onChange={(e) => setMustBuyOnly(e.target.checked)}
                  />
                </label>
              </div>

              <button onClick={handleClearFilters} className="btn btn-outline-secondary w-100 btn-sm py-2 rounded-3 fw-bold">
                Clear All
              </button>
            </div>
          </div>

          {/* Right Main Books Grid Panel */}
          <div className="col-12 col-lg-9">
            
            {/* Top Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2 bg-white p-3 rounded shadow-sm border border-light">
              <span className="text-secondary fw-semibold">
                Showing {sortedBooks.length} {sortedBooks.length === 1 ? 'book' : 'books'}
              </span>
              
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-primary d-lg-none btn-sm"
                  onClick={() => setShowMobileDrawer(true)}
                >
                  ⚙️ Filters
                </button>
                <div className="d-flex align-items-center gap-1.5 fs-7">
                  <span className="text-muted text-nowrap fw-semibold">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="form-select form-select-sm border-light-subtle rounded-3 shadow-none fw-medium"
                    style={{ width: '150px' }}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="popularity">Popularity</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {sortedBooks.length === 0 && (
              <div className="text-center py-5 bg-white border rounded shadow-sm">
                <span className="fs-1 d-block mb-3">🔍</span>
                <h3 className="h5 fw-bold text-dark">No Books Found</h3>
                <p className="text-muted fs-6 mb-4">
                  We couldn't find any books matching your active search terms or filters.
                </p>
                <button onClick={handleClearFilters} className="btn btn-primary btn-sm px-4">
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Responsive Books Grid */}
            <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
              {sortedBooks.map((book) => {
                const meta = CATEGORY_META[book.category] || CATEGORY_META.career;
                const badge = book.badge ? BADGE_META[book.badge] : null;
                
                return (
                  <div key={book.slug} className="col d-flex">
                    <div className="card w-100 border-0 shadow-sm rounded-3 overflow-hidden d-flex flex-column"
                         style={{ 
                           transition: 'transform 0.2s, box-shadow 0.2s',
                           cursor: 'pointer'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.transform = 'translateY(-5px)';
                           e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.transform = 'none';
                           e.currentTarget.style.boxShadow = 'none';
                         }}>
                      {/* Top spine bar matching category */}
                      <div style={{ height: '5px', background: meta.color }} />
                      
                      {/* Book Cover Placeholder & Ribbons */}
                      <div className="position-relative d-flex align-items-center justify-content-center p-0 border-bottom overflow-hidden"
                           style={{ minHeight: '240px', background: `linear-gradient(135deg, ${meta.color}08, ${meta.color}18)` }}>
                        
                        {/* Editor/Best Badge Ribbon */}
                        {badge && (
                          <span className="position-absolute badge rounded shadow-sm"
                                style={{ top: '10px', left: '10px', backgroundColor: badge.color, color: '#fff', fontSize: '0.65rem', fontWeight: '700', padding: '4px 8px', zIndex: 5 }}>
                            {badge.label}
                          </span>
                        )}

                        {/* Save % Ribbon */}
                        {book.discountPercent > 0 && (
                          <span className="position-absolute badge rounded bg-success shadow-sm"
                                style={{ top: '10px', right: '10px', fontSize: '0.65rem', fontWeight: '700', padding: '4px 8px', zIndex: 5 }}>
                            ↓{book.discountPercent}% OFF
                          </span>
                        )}

                        <Link to={`/books/${book.slug}`} className="w-100 text-center">
                          <img
                            src={`https://images-eu.ssl-images-amazon.com/images/P/${book.asin}.01.LZZZZZZZ.jpg`}
                            alt={book.title}
                            loading="lazy"
                            onError={(e) => {
                              // Fallback: Google Books by verified ISBN
                              if (!e.target.dataset.fallback) {
                                e.target.dataset.fallback = '1';
                                e.target.src = `https://books.google.com/books/content?vid=ISBN${book.isbn || book.asin}&printsec=frontcover&img=1&zoom=1`;
                              }
                            }}
                            className="rounded shadow"
                            style={{
                              height: '230px',
                              width: '100%',
                              objectFit: 'contain',
                              objectPosition: 'center',
                              display: 'block',
                              background: 'transparent',
                              padding: '4px'
                            }}
                          />
                        </Link>
                      </div>

                      {/* Card Content Details */}
                      <div className="card-body p-3 d-flex flex-column flex-grow-1">
                        <span className="badge fs-8 align-self-start mb-2"
                              style={{ color: meta.color, background: `${meta.color}15` }}>
                          {meta.label}
                        </span>

                        <Link to={`/books/${book.slug}`} className="text-decoration-none text-dark">
                          <h3 className="card-title fw-bold fs-6 mb-1 text-truncate-2" style={{ minHeight: '2.5rem', lineHeight: '1.25' }}>
                            {book.title}
                          </h3>
                        </Link>

                        <p className="card-text text-muted fs-7 mb-2">by {book.author}</p>

                        <div className="d-flex align-items-center gap-1 mb-3">
                          {renderStars(book.rating)}
                          <span className="text-secondary fs-8 fw-semibold">
                            {book.rating} ({book.reviews.toLocaleString('en-IN')})
                          </span>
                        </div>

                        {/* Price Area */}
                        <div className="mt-auto pt-2 border-top">
                          <div className="d-flex align-items-baseline gap-2 mb-2">
                            <span className="text-danger fw-extrabold fs-5">
                              ₹{book.price.toLocaleString('en-IN')}
                            </span>
                            {book.oldPrice && (
                              <span className="text-muted fs-7 text-decoration-line-through">
                                ₹{book.oldPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          <div className="row g-2">
                            <div className="col-6">
                              <Link to={`/books/${book.slug}`} className="btn btn-outline-primary btn-sm w-100 fw-bold fs-8 py-2">
                                Details
                              </Link>
                            </div>
                            <div className="col-6">
                              <a
                                href={getAffiliateLink(book.asin)}
                                target="_blank"
                                rel="nofollow sponsored noopener"
                                className="btn btn-warning btn-sm w-100 fw-bold fs-8 py-2 d-flex align-items-center justify-content-center gap-1"
                                style={{ background: '#ff9900', border: '1px solid #e68a00' }}
                              >
                                Buy Amazon
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-muted text-center fs-8 mt-5">
              ⚠️ Note: Prices on Amazon may vary. Confirm the current price on the product page before purchasing.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Filters Drawer */}
      {showMobileDrawer && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1050 }}
            onClick={() => setShowMobileDrawer(false)}
          />
          <div
            className="position-fixed bottom-0 start-0 w-100 bg-white rounded-top-4 p-4 transition-all"
            style={{ zIndex: 1060, maxHeight: '80vh', overflowY: 'auto', borderTop: '2px solid var(--bs-primary)' }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0">Filter Books</h5>
              <button className="btn-close" onClick={() => setShowMobileDrawer(false)} />
            </div>

            {/* Mobile search */}
            <div className="mb-3">
              <label className="form-label fs-7 fw-bold text-uppercase text-muted">Search Books</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Title or author..."
                className="form-control"
              />
            </div>

            {/* Mobile price */}
            <div className="mb-3">
              <label className="form-label fs-7 fw-bold text-uppercase text-muted">Price Range</label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="form-select"
              >
                <option value="any">Any Price</option>
                <option value="under-300">Under ₹300</option>
                <option value="300-600">₹300 – ₹600</option>
                <option value="600-plus">₹600+</option>
              </select>
            </div>

            {/* Mobile rating */}
            <div className="mb-3">
              <label className="form-label fs-7 fw-bold text-uppercase text-muted">Minimum Rating</label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
                className="form-select"
              >
                <option value="0">Any Rating</option>
                <option value="4.5">4.5★ & Above</option>
                <option value="4.0">4.0★ & Above</option>
                <option value="3.5">3.5★ & Above</option>
              </select>
            </div>

            {/* Mobile Toggles */}
            <div className="mb-4 border-top pt-3">
              <label className="form-check form-switch d-flex align-items-center justify-content-between cursor-pointer">
                <span>🏆 Must-Buy Only</span>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={mustBuyOnly}
                  onChange={(e) => setMustBuyOnly(e.target.checked)}
                />
              </label>
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={() => {
                  handleClearFilters();
                  setShowMobileDrawer(false);
                }}
                className="btn btn-outline-danger flex-grow-1"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowMobileDrawer(false)}
                className="btn btn-primary flex-grow-1"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
