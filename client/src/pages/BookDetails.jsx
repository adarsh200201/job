import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import booksData from '../data/books.json';

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

export default function BookDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find book in local database (must be declared before hooks that use it)
  const book = booksData.find(b => b.slug.toLowerCase() === slug.toLowerCase());

  const [imgErr, setImgErr] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [imgFallbackStage, setImgFallbackStage] = useState(0);

  useEffect(() => {
    if (book) {
      // Start with Amazon Product Image CDN (high-res, designed for affiliates)
      setImgSrc(`https://images-eu.ssl-images-amazon.com/images/P/${book.asin}.01.LZZZZZZZ.jpg`);
      setImgFallbackStage(1);
    }
  }, [book]);

  const handleImageError = () => {
    const isbn = book?.isbn || book?.asin;
    if (imgFallbackStage === 1) {
      // Fallback: Google Books zoom=1 (smaller but usually available)
      setImgSrc(`https://books.google.com/books/content?vid=ISBN${isbn}&printsec=frontcover&img=1&zoom=1`);
      setImgFallbackStage(2);
    } else {
      setImgErr(true);
    }
  };

  // Redirect to /books if book is not found
  useEffect(() => {
    if (!book) {
      navigate('/books', { replace: true });
    }
  }, [book, navigate]);

  if (!book) return null;

  const meta = CATEGORY_META[book.category] || CATEGORY_META.career;
  const badge = book.badge ? BADGE_META[book.badge] : null;

  const getAffiliateLink = (asin) => {
    return `https://www.amazon.in/dp/${asin}?tag=${AFFILIATE_TAG}`;
  };

  const getFormatAffiliateLink = (asin, format) => {
    // If Kindle edition, we can link directly, or default to general link
    return `https://www.amazon.in/dp/${asin}?tag=${AFFILIATE_TAG}`;
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <span className="text-warning fs-6 me-1">
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
      </span>
    );
  };

  // Get related books
  const relatedBooks = booksData.filter(b => book.relatedSlugs?.includes(b.slug));

  // JSON-LD structured data for SEO rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title,
    "author": {
      "@type": "Person",
      "name": book.author
    },
    "isbn": book.asin, // ASIN serves as ISBN-10 in Amazon
    "publisher": {
      "@type": "Organization",
      "name": book.publisher
    },
    "image": `https://covers.openlibrary.org/b/isbn/${book.asin}-L.jpg`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": book.rating.toString(),
      "reviewCount": book.reviews.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "price": book.price.toString(),
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": getAffiliateLink(book.asin)
    }
  };

  return (
    <div className="pb-5" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Helmet>
        <title>{`${book.title} by ${book.author} | Best Exam Prep Books`}</title>
        <meta name="description" content={`${book.title} - ${book.subtitle}. Read details, pricing, aggregate ratings, and direct Amazon buy links.`} />
        <link rel="canonical" href={`https://nextjobpost.in/books/${book.slug}`} />
        
        {/* Inject schema markup */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="container" style={{ marginTop: '-1.5rem' }}>
        <div className="row g-4">
          
          {/* Main Hero & Description Section */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-3 p-4 mb-4">
              
              {/* Top Hero Box */}
              <div className="row g-4 mb-4">
                
                {/* Left: Book Cover Image & Formats */}
                <div className="col-md-5 text-center">
                  <div className="p-0 rounded-3 overflow-hidden d-flex align-items-center justify-content-center mb-3"
                       style={{ minHeight: '380px', background: `linear-gradient(135deg, ${meta.color}06, ${meta.color}14)`, border: '1px solid #f1f5f9' }}>
                    {imgErr ? (
                      <div className="fs-1">📚</div>
                    ) : (
                      <img
                        src={imgSrc}
                        alt={book.title}
                        onError={handleImageError}
                        style={{
                          height: '380px',
                          width: '100%',
                          objectFit: 'contain',
                          objectPosition: 'center',
                          padding: '8px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          background: 'transparent'
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Format chips */}
                  <div className="d-flex flex-wrap gap-1.5 justify-content-center">
                    {(book.formats || ["Paperback", "Kindle Edition"]).map((fmt, i) => (
                      <span key={i} className="badge bg-secondary-subtle text-secondary-emphasis fs-8 px-2.5 py-1.5">
                        💾 {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Book Meta & CTA */}
                <div className="col-md-7 d-flex flex-column">
                  
                  {/* Category and Badges */}
                  <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                    <span className="badge fs-8" style={{ color: meta.color, background: `${meta.color}15` }}>
                      {meta.icon} {meta.label}
                    </span>
                    {badge && (
                      <span className="badge" style={{ backgroundColor: badge.color, color: '#fff', fontSize: '0.7rem', padding: '3px 8px' }}>
                        🏆 {badge.label}
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h1 className="fw-black text-dark mb-1 lh-sm" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 3vw, 1.95rem)' }}>
                    {book.title}
                  </h1>
                  {book.subtitle && (
                    <p className="text-secondary fs-6 mb-2 fw-medium">{book.subtitle}</p>
                  )}

                  <p className="text-muted fs-7 mb-3">
                    by <span className="fw-bold text-dark">{book.author}</span>{book.publishedDate ? ` • Published: ${book.publishedDate}` : ''}
                  </p>

                  {/* Star Ratings */}
                  <div className="d-flex align-items-center gap-2 mb-3 bg-light-subtle p-2 rounded border border-light">
                    {renderStars(book.rating)}
                    <span className="text-secondary fs-7 fw-bold">
                      {book.rating} / 5.0
                    </span>
                    <span className="text-muted fs-8">
                      ({book.reviews.toLocaleString('en-IN')} global ratings)
                    </span>
                  </div>

                  {/* Price Block */}
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div>
                      <span className="text-danger fw-black fs-3">
                        ₹{book.price.toLocaleString('en-IN')}
                      </span>
                      {book.oldPrice && (
                        <span className="text-muted fs-6 text-decoration-line-through ms-2">
                          ₹{book.oldPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {(book.discountPercent || book.discount || 0) > 0 && (
                      <span className="badge bg-success shadow-sm fs-8 py-2 px-3">
                        Save {book.discountPercent || book.discount}%
                      </span>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-auto d-flex flex-column gap-2">
                    <a
                      href={getAffiliateLink(book.asin)}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                      className="btn btn-warning fw-bold py-2.5 fs-6 shadow-sm d-flex align-items-center justify-content-center gap-2 text-dark"
                      style={{ background: '#ff9900', border: '1px solid #e68a00' }}
                    >
                      🛒 Buy Print Edition on Amazon
                    </a>
                    
                    {(book.formats || []).includes("Kindle Edition") && (
                      <a
                        href={getFormatAffiliateLink(book.asin, "Kindle")}
                        target="_blank"
                        rel="nofollow sponsored noopener"
                        className="btn btn-outline-secondary fw-semibold py-2 fs-7"
                      >
                        📖 Read Kindle Edition on Amazon
                      </a>
                    )}
                  </div>
                </div>
              </div>


              {/* Book Details Fact Grid */}
              <div className="border-top pt-4">
                <h3 className="h6 fw-bold text-uppercase text-muted mb-3">Book Details</h3>
                <div className="row g-3 row-cols-2 row-cols-md-3">
                  <div className="col">
                    <div className="p-3 bg-light rounded-3">
                      <span className="d-block fs-8 text-muted fw-semibold">Publisher</span>
                      <span className="fw-bold fs-7 text-dark">{book.publisher || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="p-3 bg-light rounded-3">
                      <span className="d-block fs-8 text-muted fw-semibold">Language</span>
                      <span className="fw-bold fs-7 text-dark">{book.language || 'English'}</span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="p-3 bg-light rounded-3">
                      <span className="d-block fs-8 text-muted fw-semibold">Published Date</span>
                      <span className="fw-bold fs-7 text-dark">{book.publishedDate || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="p-3 bg-light rounded-3">
                      <span className="d-block fs-8 text-muted fw-semibold">ASIN / ISBN</span>
                      <span className="fw-bold fs-7 text-dark">{book.asin}</span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="p-3 bg-light rounded-3">
                      <span className="d-block fs-8 text-muted fw-semibold">Available Formats</span>
                      <span className="fw-bold fs-7 text-dark">{(book.formats || ["Paperback", "Kindle Edition"]).join(', ')}</span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="p-3 bg-light rounded-3">
                      <span className="d-block fs-8 text-muted fw-semibold">Best For</span>
                      <span className="fw-bold fs-7 text-dark">{meta.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card border-0 shadow-sm rounded-3 p-4 mb-4">
              <h2 className="h5 fw-bold mb-3 border-bottom pb-2">What this book is about</h2>
              <p className="fs-6 text-secondary lh-lg mb-0" style={{ whiteSpace: 'pre-line' }}>
                {book.description}
              </p>
            </div>
          </div>

          {/* Editorial whyRecommend & relatedBooks Sidebar */}
          <div className="col-lg-4">
            
            {/* Why We Recommend Section */}
            <div className="card border-0 shadow-sm rounded-3 p-4 mb-4 bg-white">
              <h3 className="h6 fw-bold text-uppercase text-muted mb-3 d-flex align-items-center gap-2">
                <span>⭐</span> Why we recommend it
              </h3>
              <div className="d-flex flex-column gap-3">
                {(book.whyRecommend || []).map((rec, i) => (
                  <div key={i} className="d-flex align-items-start gap-2.5">
                    <span className="text-success fs-5">✓</span>
                    <span className="fs-7.5 fw-medium text-dark-emphasis">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pairs Well With Related Books */}
            {relatedBooks.length > 0 && (
              <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                <h3 className="h6 fw-bold text-uppercase text-muted mb-3">Pairs well with</h3>
                <div className="d-flex flex-column gap-3">
                  {relatedBooks.map((rel) => {
                    const relMeta = CATEGORY_META[rel.category] || CATEGORY_META.career;
                    return (
                      <Link key={rel.slug} to={`/books/${rel.slug}`} className="text-decoration-none text-dark d-flex gap-3 p-2 rounded hover-bg-light border border-transparent hover-border-light-subtle"
                            style={{ transition: 'all 0.15s' }}>
                        <div className="bg-light p-2 rounded d-flex align-items-center justify-content-center"
                             style={{ width: '60px', height: '80px', flexShrink: 0 }}>
                          <img
                            src={`https://books.google.com/books/content?vid=ISBN${rel.asin}&printsec=frontcover&img=1&zoom=1`}
                            alt={rel.title}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                            className="img-fluid rounded shadow-sm"
                            style={{ maxHeight: '70px', objectFit: 'contain' }}
                          />
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                          <h4 className="fs-7 fw-bold mb-1 text-truncate-2" style={{ lineHeight: '1.25' }}>{rel.title}</h4>
                          <span className="text-muted fs-8 mb-1">by {rel.author}</span>
                          <span className="text-danger fw-extrabold fs-7">₹{rel.price}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
