import React from 'react';

export default function AffiliateSchema({ products = [], listName = 'Recommended Products' }) {
  if (!products || products.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": listName,
    "numberOfItems": products.length,
    "itemListElement": products.map((prod, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Product",
        "name": prod.title,
        "image": prod.img,
        "description": prod.desc || prod.subtitle || "Highly recommended preparation resource for candidates.",
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": prod.price,
          "availability": "https://schema.org/InStock",
          "url": `https://www.amazon.in/dp/${prod.asin}?tag=nextjobpost-21`
        }
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
