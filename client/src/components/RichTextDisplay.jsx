import React from 'react';

export default function RichTextDisplay({ content }) {
  if (!content) return null;

  // HTML sanitization - remove scripts, event handlers, inline styles, and data attributes
  const sanitizeHTML = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;

    // Remove script tags and event handlers
    const scripts = div.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    // Clean up all elements
    const allElements = div.querySelectorAll('*');
    allElements.forEach(element => {
      // Remove all attributes that shouldn't be in the output
      Array.from(element.attributes).forEach(attr => {
        const attrName = attr.name;
        // Remove: event handlers, inline styles, and editor data attributes
        if (attrName.startsWith('on') ||
            attrName === 'style' ||
            attrName.startsWith('data-start') ||
            attrName.startsWith('data-end')) {
          element.removeAttribute(attrName);
        }
      });
    });

    return div.innerHTML;
  };

  const sanitizedHTML = sanitizeHTML(content);

  return (
    <div
      className="rich-text-display"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}
