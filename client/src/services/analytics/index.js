/**
 * NextJobPost — Central Analytics Service
 * Single public API for all tracking. Wraps mixpanel-browser with:
 *  - Global property injection on every event
 *  - Deduplication guard
 *  - People profile management
 *  - User identity
 *
 * IMPORTANT: All existing imports from utils/analytics.js still work.
 * This file is the NEW service layer — import from here in new code.
 */
import mixpanel from './mixpanel.js';
import { buildGlobalProps, isSearchEngineReferrer, getPageType } from './globalProps.js';
import { isDuplicate } from './deduplication.js';
import { EVENTS } from './events.js';
import { getLifecycleStage, incrementApplyCount } from './session.js';

const MIXPANEL_TOKEN = '99f55a1e0ff42d36dbf679a878e375fa';

// ─── Init ──────────────────────────────────────────────────────────────────

export function initAnalytics() {
  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: import.meta.env.DEV,
      track_pageview: false,
      persistence: 'localStorage',
      ignore_dnt: true,
    });

    // Register global super-properties (on every event)
    const g = buildGlobalProps();
    mixpanel.register({
      device_type:      g.device_type,
      browser:          g.browser,
      os:               g.os,
      screen_width:     g.screen_width,
      screen_height:    g.screen_height,
      initial_referrer: g.initial_referrer,
      session_id:       g.session_id,
      ...Object.fromEntries(
        Object.entries(g).filter(([k]) => k.startsWith('utm_'))
      ),
    });
  } catch (e) {
    if (import.meta.env.DEV) console.error('[Analytics] Init failed:', e);
  }
}

// ─── Core Track ────────────────────────────────────────────────────────────

/**
 * Track any event with merged global props.
 * @param {string} eventName  - Use EVENTS.* constants
 * @param {object} properties - Event-specific properties
 */
export function track(eventName, properties = {}) {
  if (!eventName) return;

  // Build final props: global base + event-specific
  const props = {
    current_url:  window.location.href,
    current_path: window.location.pathname,
    page_title:   document.title,
    timestamp:    new Date().toISOString(),
    ...properties,
  };

  // Skip exact duplicate events within 600ms
  if (isDuplicate(eventName, props)) return;

  try {
    mixpanel.track(eventName, props);
  } catch (e) {
    if (import.meta.env.DEV) console.error(`[Analytics] Failed to track "${eventName}":`, e);
  }
}

// ─── Page Tracking ─────────────────────────────────────────────────────────

/**
 * Track a page view with full context.
 * @param {string} path       - Route pathname
 * @param {object} extra      - Additional page-specific properties
 * @param {number} [delay=150] - ms delay (for React Helmet title update)
 */
export function trackPage(path, extra = {}, delay = 150) {
  setTimeout(() => {
    const pageType = getPageType(path);
    const referrer = document.referrer;

    track(EVENTS.PAGE_VIEWED, {
      page_type:    pageType,
      current_path: path,
      page_title:   document.title,
      ...extra,
    });

    // SEO Events
    if (isSearchEngineReferrer(referrer)) {
      track(EVENTS.SEO_LANDING_PAGE_ENTERED, {
        landing_page:  path,
        page_type:     pageType,
        referrer_domain: new URL(referrer).hostname,
        ...extra,
      });
      track(EVENTS.ORGANIC_VISITOR, { landing_page: path, page_type: pageType });
    }

    // Landing Page Enter (first page of session)
    const pagesViewed = parseInt(sessionStorage.getItem('pages_viewed_count') || '0', 10);
    if (pagesViewed <= 1) {
      track(EVENTS.LANDING_PAGE_ENTERED, { landing_page: path, page_type: pageType });
    }

    // Increment page counter
    const next = pagesViewed + 1;
    sessionStorage.setItem('pages_viewed_count', String(next));
  }, delay);
}

// ─── Job Events ────────────────────────────────────────────────────────────

/** Build a consistent job property block */
function jobProps(job) {
  if (!job) return {};
  return {
    jobId:    job._id || job.id || '',
    jobTitle: job.title || '',
    company:  job.company || '',
    location: job.location || '',
    salary:   job.salary || '',
    category: job.type || '',
    postType: job.postType || '',
    isGovernment: !!job.isGovernment,
    isFeatured:   !!job.isFeatured,
  };
}

export function trackJobDetailViewed(job) {
  if (!job) return;
  const pt = (job.postType || '').toLowerCase();

  track(EVENTS.JOB_DETAIL_VIEWED, jobProps(job));

  // Specific government content events
  if (job.isGovernment) {
    if (pt.includes('result'))     track(EVENTS.RESULT_VIEWED,      jobProps(job));
    else if (pt.includes('admit')) track(EVENTS.ADMIT_CARD_VIEWED,   jobProps(job));
    else if (pt.includes('answer'))track(EVENTS.ANSWER_KEY_VIEWED,  jobProps(job));
    else if (pt.includes('syllabus')) track(EVENTS.SYLLABUS_VIEWED, jobProps(job));
    else                           track(EVENTS.GOVERNMENT_JOB_VIEWED, jobProps(job));
  }
}

export function trackApplyJobClicked(job) {
  if (!job) return;
  const applyCount = incrementApplyCount();
  track(EVENTS.APPLY_JOB_CLICKED, {
    ...jobProps(job),
    total_apply_clicks: applyCount,
    referrer: document.referrer || 'Direct',
  });

  // Also track organic apply if from search engine
  if (isSearchEngineReferrer()) {
    track(EVENTS.ORGANIC_APPLY_CLICK, jobProps(job));
  }

  // High intent if applied 3+ times in session
  if (applyCount >= 3) {
    track(EVENTS.HIGH_INTENT_CANDIDATE, { total_apply_clicks: applyCount });
  }

  // Update People profile
  try {
    mixpanel.people.increment('total_apply_clicks');
    mixpanel.people.set({ lifecycle_stage: getLifecycleStage(), last_active_date: new Date().toISOString() });
  } catch (_) {}
}

export function trackJobCardClicked(job, position) {
  if (!job) return;
  track(EVENTS.JOB_CARD_CLICKED, { ...jobProps(job), position: position ?? -1 });
}

export function trackJobImpression(job, position) {
  if (!job) return;
  track(EVENTS.JOB_IMPRESSION, { ...jobProps(job), position: position ?? -1 });
}

export function trackJobShared(platform, job) {
  if (!job) return;
  track(EVENTS.JOB_SHARED, { ...jobProps(job), platform: platform || 'Copy Link' });
}

export function trackJobSaved(job) {
  if (!job) return;
  track(EVENTS.JOB_SAVED, jobProps(job));
  try { mixpanel.people.increment('total_job_views'); } catch (_) {}
}

export function trackJobUnsaved(job) {
  if (!job) return;
  track(EVENTS.JOB_UNSAVED, jobProps(job));
}

// ─── Download/PDF Events ───────────────────────────────────────────────────

export function trackPDFOpened(job, pdfType = 'notification') {
  if (!job) return;
  const eventMap = {
    notification: EVENTS.NOTIFICATION_PDF_OPENED,
    result:       EVENTS.RESULT_DOWNLOAD_CLICKED,
    'admit-card': EVENTS.ADMIT_CARD_DOWNLOAD_CLICKED,
    'answer-key': EVENTS.ANSWER_KEY_DOWNLOAD_CLICKED,
    syllabus:     EVENTS.SYLLABUS_DOWNLOAD_CLICKED,
  };
  const ev = eventMap[pdfType] || EVENTS.NOTIFICATION_PDF_OPENED;
  track(ev, { ...jobProps(job), pdf_type: pdfType });
}

// ─── Search Events ─────────────────────────────────────────────────────────

export function trackJobSearch(keyword, resultsCount) {
  track(EVENTS.JOB_SEARCH, {
    keyword:       keyword || '',
    results_count: resultsCount ?? 0,
    has_results:   (resultsCount ?? 0) > 0,
  });
  if ((resultsCount ?? 0) === 0 && keyword) {
    track(EVENTS.SEARCH_NO_RESULTS, { keyword, current_path: window.location.pathname });
  }
}

export function trackSearchFilterApplied(filterName, filterValue) {
  track(EVENTS.SEARCH_FILTER_APPLIED, { filter_name: filterName, filter_value: filterValue });
}

export function trackSearchStarted(context = 'hero') {
  track(EVENTS.SEARCH_STARTED, { search_context: context });
}

// ─── Category Events ───────────────────────────────────────────────────────

export function trackCategoryViewed(category) {
  track(EVENTS.CATEGORY_VIEWED, { category: category || 'General' });
}

// ─── Content Events ────────────────────────────────────────────────────────

export function trackFAQExpanded(faqTitle, jobId) {
  track(EVENTS.FAQ_EXPANDED, { faq_title: faqTitle, jobId: jobId || '' });
}

export function trackScrollDepth(depth, path, pageType) {
  track(EVENTS.SCROLL_DEPTH, {
    scroll_depth:  `${depth}%`,
    current_path:  path || window.location.pathname,
    page_type:     pageType || getPageType(),
  });
  if (depth === 100) {
    track(EVENTS.CONTENT_FULLY_READ, {
      read_percentage: 100,
      page_type: pageType || getPageType(),
    });
  }
}

// ─── Notification/Channel Events ───────────────────────────────────────────

export function trackTelegramClicked(source = '') {
  track(EVENTS.TELEGRAM_CHANNEL_CLICKED, { source });
}

export function trackWhatsAppClicked(source = '') {
  track(EVENTS.WHATSAPP_CHANNEL_CLICKED, { source });
}

// ─── Revenue Events ────────────────────────────────────────────────────────

export function trackAdClicked(adPosition) {
  track(EVENTS.AD_CLICKED, { ad_position: adPosition || 'sidebar_banner' });
}

export function trackAdImpression(adPosition) {
  track(EVENTS.AD_IMPRESSION, { ad_position: adPosition || 'sidebar_banner' });
}

// ─── Identity ──────────────────────────────────────────────────────────────

/**
 * Identify a logged-in user and set People profile.
 * @param {string} userId
 * @param {object} traits  - { $name, $email, role, ... }
 */
export function identifyUser(userId, traits = {}) {
  if (!userId) return;
  try {
    mixpanel.identify(userId);
    const profile = {
      $name:            traits.$name || traits.name || '',
      $email:           traits.$email || traits.email || '',
      user_type:        traits.role === 'admin' ? 'admin' : 'registered',
      lifecycle_stage:  getLifecycleStage(),
      last_active_date: new Date().toISOString(),
      ...traits,
    };

    // Set (only updates non-existing) + set_once for first-visit
    mixpanel.people.set(profile);
    mixpanel.people.set_once({ first_visit_date: new Date().toISOString() });
  } catch (e) {
    if (import.meta.env.DEV) console.error('[Analytics] identify failed:', e);
  }
}

export function resetUser() {
  try { mixpanel.reset(); } catch (_) {}
}

// ─── Re-exports for backwards compat ───────────────────────────────────────
export { EVENTS };
