import React from 'react';
import { cleanTextBranding } from '../utils/textUtils.js';

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

      // Helper: check if a URL is structurally valid (has a real domain with TLD)
      const isValidUrl = (url) => {
        if (!url) return false;
        // Reject HTML-contaminated hrefs (URL-encoded tags)
        if (url.includes('%3C') || url.includes('%3E') || url.includes('%22')) return false;
        try {
          const parsed = new URL(url);
          // Must have a real hostname with at least one dot and a TLD segment
          // e.g. "https://.in/..." has hostname ".in" which is invalid
          const host = parsed.hostname;
          const parts = host.split('.');
          // Reject if hostname starts with dot, has no real domain, or is too short
          if (!host || host.startsWith('.') || parts.length < 2 || parts[0] === '') return false;
          // Reject known tracker/shortlink/aggregator domains
          const blockedDomains = [
            'pdlink.in', 'bit.ly', 'tinyurl.com', 'ow.ly', 'goo.gl', 'short.ly',
            'rebrand.ly', 'cutt.ly', 't.co', 'buff.ly', 'dlvr.it',
            'internshala.com', 'internshals.com', 'naukri.com', 'shine.com',
            'monster.com', 'timesjobs.com', 'freshersworld.com', 'placementindia.com',
            'govtjobsalert.in', 'sarkariresult.com', 'rojgarresult.com', 'freejobalert.com',
            'freshershunt.in', 'fresherslive.com', 'freshersvoice.com', 'offcampusjobs4u.in',
            'youth4work.com', 'ambitionbox.com', 'glassdoor.com', 'glassdoor.co.in',
            'indeed.com', 'indeed.co.in', 'foundthejob.com',
          ];
          if (blockedDomains.some(d => host === d || host.endsWith('.' + d))) return false;
          return true;
        } catch {
          return false;
        }
      };

      // Redirect WhatsApp and Telegram links to official channels
      if (href.includes('whatsapp.com') || href.includes('wa.me')) {
        a.setAttribute('href', 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ');
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      } else if (href.includes('t.me') || href.includes('telegram.me') || href.includes('telegram.dog')) {
        a.setAttribute('href', 'https://t.me/nextjobpost');
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      } else if ((href.includes('govtjobsalert.in') || href.includes('sarkariresult.com')) && !href.toLowerCase().endsWith('.pdf')) {
        // Strip competitor domain non-PDF links entirely
        a.remove();
      } else if (!href || !isValidUrl(href)) {
        // Remove broken/empty/invalid hrefs entirely
        a.remove();
      } else {
        // All valid external links: open in new tab safely
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer nofollow');
      }

      if (a.parentNode) {
        if (a.textContent.trim().toLowerCase() === 'apply online') {
          a.textContent = 'Apply Now';
        }
        
        // Do not disclose raw URLs in visible anchor text (AdSense/copyright safety)
        const textContent = a.textContent.trim();
        const isRawUrl = /^(?:https?:\/\/|www\.)[^\s]+$|^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?$/i.test(textContent);
        if (isRawUrl) {
          if (href.includes('whatsapp.com') || href.includes('wa.me')) {
            a.textContent = 'Join WhatsApp Channel';
          } else if (href.includes('t.me') || href.includes('telegram.me')) {
            a.textContent = 'Join Telegram Channel';
          } else if (href.includes('youtube.com') || href.includes('youtu.be')) {
            a.textContent = 'Watch Video Guide';
          } else {
            a.textContent = 'Apply Now';
          }
        }
      }
    });

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
        val = val.replace(BLOCKED_URL_PATTERN, '').replace(/\s{2,}/g, ' ').trim();
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
