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

    // 1. Wrap tables in responsive div wrappers
    const tables = Array.from(div.querySelectorAll('table'));
    tables.forEach(table => {
      const wrapper = document.createElement('div');
      wrapper.className = 'rich-table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // 2. Identify and style FAQ Headers (like "Frequently Asked Questions (FAQs)")
    const headings = Array.from(div.querySelectorAll('p, h2, h3, h4, h5'));
    headings.forEach(el => {
      const text = el.textContent.trim();
      if (text.includes('Frequently Asked Questions') || text.includes('FAQs') || text.includes('📋 Frequently')) {
        el.className = 'faq-main-header';
      }
    });

    // 3. Group FAQ items dynamically into cards
    const paragraphs = Array.from(div.querySelectorAll('p, h3, h4, h5'));
    paragraphs.forEach(el => {
      if (el.parentNode && el.parentNode.className === 'faq-card') return;
      
      const text = el.textContent.trim();
      // Detect a question (starts with '❓' or contains '❓')
      if (text.includes('❓')) {
        const card = document.createElement('div');
        card.className = 'faq-card';
        
        const answer = el.nextElementSibling;
        
        el.parentNode.insertBefore(card, el);
        card.appendChild(el);
        el.className = 'faq-question';
        
        if (answer && !answer.textContent.trim().includes('❓')) {
          answer.className = 'faq-answer';
          card.appendChild(answer);
        }
      }
    });

    // 4. Replace any occurrences of "Apply Online" with "Apply Now" in text nodes and anchors
    const anchors = Array.from(div.querySelectorAll('a'));
    anchors.forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes('govtjobsalert.in') || href.includes('sarkariresult.com')) {
        a.removeAttribute('href');
        a.style.cursor = 'default';
        a.style.textDecoration = 'none';
        a.style.color = 'inherit';
      }
      if (a.textContent.trim().toLowerCase() === 'apply online') {
        a.textContent = 'Apply Now';
      }
    });

    const walk = document.createTreeWalker(div, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walk.nextNode()) {
      node.nodeValue = node.nodeValue.replace(/Apply Online/gi, 'Apply Now');
    }

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
