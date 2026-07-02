import React from 'react';
import { cleanTextBranding } from '../utils/textUtils.js';

export default function RichTextDisplay({ content }) {
  if (!content) return null;

  // HTML sanitization - remove scripts, event handlers, inline styles, and data attributes
  const sanitizeHTML = (html) => {
    // Pre-scrub: strip <button>, <icon> tags (both raw and escaped) and all <a> href links as raw text before DOM parsing
    let cleaned = html
      .replace(/&lt;button[\s\S]*?&lt;\/button&gt;/gi, '')
      .replace(/&lt;icon[\s\S]*?&lt;\/icon&gt;/gi, '')
      .replace(/&lt;button[\s\S]*?&gt;[\s\S]*?&lt;\/button&gt;/gi, '')
      .replace(/&lt;icon[\s\S]*?&gt;[\s\S]*?&lt;\/icon&gt;/gi, '')
      .replace(/<button[\s\S]*?<\/button>/gi, '')
      .replace(/<icon[\s\S]*?<\/icon>/gi, '')
      .replace(/show-more-less-html__button-more/gi, '')
      .replace(/show-more-less-html__button-less/gi, '')
      .replace(/show-more-less-html__button/gi, '')
      .replace(/public_jobs_show-more-html-btn/gi, '')
      .replace(/public_jobs_show-less-html-btn/gi, '')
      .replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1')  // strip <a> tags but keep their text
      .replace(/https?:\/\/[^\s<"'>]+/gi, '')   // strip bare URLs entirely
      .replace(/\s{2,}/g, ' ')
      .trim();

    const div = document.createElement('div');
    div.innerHTML = cleaned;

    // Remove script, button, icon tags from DOM as well (belt-and-suspenders)
    div.querySelectorAll('script, button, icon').forEach(el => el.remove());

    // Remove all anchor tags — replace with their text content so no links are exposed
    div.querySelectorAll('a').forEach(a => {
      const text = document.createTextNode(a.textContent || '');
      a.parentNode && a.parentNode.replaceChild(text, a);
    });

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

    // 4. Replace any occurrences of "Apply Online" with "Apply Now" in text nodes

    const BLOCKED_URL_PATTERN = /https?:\/\/(?:\.in|\.com|\.org|\.net|\.co|\.info|\.us|\.xyz|[^\s]*\.(?:pdlink\.in|bit\.ly|tinyurl\.com|ow\.ly|goo\.gl|internshala\.com|internshals\.com|naukri\.com|shine\.com|monster\.com|timesjobs\.com|freshersworld\.com|govtjobsalert\.in|sarkariresult\.com|rojgarresult\.com|freejobalert\.com|freshershunt\.in|fresherslive\.com|freshersvoice\.com|offcampusjobs4u\.in|youth4work\.com|ambitionbox\.com|glassdoor\.com|glassdoor\.co.in|indeed\.com|indeed\.co.in|foundthejob\.com))[^\s]*/gi;
    const walk = document.createTreeWalker(div, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walk.nextNode()) {
      // Skip text inside anchor tags whose href is valid — don't strip the visible URL text there
      let parent = node.parentNode;
      let insideValidAnchor = false;
      while (parent && parent !== div) {
        if (parent.tagName === 'A' && parent.getAttribute('href')) {
          insideValidAnchor = true;
          break;
        }
        parent = parent.parentNode;
      }
      let val = cleanTextBranding(node.nodeValue).replace(/Apply Online/gi, 'Apply Now');
      if (!insideValidAnchor) {
        // Strip bare tracker/aggregator URLs from text nodes
        val = val.replace(BLOCKED_URL_PATTERN, '').replace(/\s{2,}/g, ' ');
      }
      
      // Auto-insert spacing at boundaries of inline tags if missing
      const inlineTags = ['STRONG', 'B', 'A', 'SPAN', 'EM', 'U', 'I'];
      const nextSib = node.nextSibling;
      if (nextSib && inlineTags.includes(nextSib.tagName)) {
        if (val && !/\s$/.test(val)) {
          val += ' ';
        }
      }
      const prevSib = node.previousSibling;
      if (prevSib && inlineTags.includes(prevSib.tagName)) {
        if (val && !/^\s/.test(val) && !/^[,\.!\?):;%\]]/.test(val)) {
          val = ' ' + val;
        }
      }
      
      node.nodeValue = val;
    }

    // Clean up empty elements or elements containing only dangling "Apply Now" labels
    const cleanDanglingLabels = () => {
      const elements = Array.from(div.querySelectorAll('p, li, span, strong, b, a, h1, h2, h3, h4, h5, h6'));
      const danglingPattern = /^\s*(?:apply\s*(?:now|online|link)?|registration\s*(?:link)?|click\s*here\s*to\s*apply|official\s*link|apply\s*here|link|join\s*here|job\s*link|careers?\s*link)[:\-\–\—\s]*$/i;
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        const text = el.textContent.trim();
        if (!text || danglingPattern.test(text)) {
          el.remove();
        }
      }
    };
    cleanDanglingLabels();

    return div.innerHTML;
  };

  // If content is plain text (no HTML tags), convert newlines to <br />
  const formatPlainText = (text) => {
    if (!text) return '';
    if (!/<\/?[a-z][\s\S]*>/i.test(text)) {
      return text.replace(/\r?\n/g, '<br />');
    }
    return text;
  };

  const cleanedContent = cleanTextBranding(content);
  const formattedContent = formatPlainText(cleanedContent);
  const sanitizedHTML = sanitizeHTML(formattedContent);


  return (
    <div
      className="rich-text-display"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}
