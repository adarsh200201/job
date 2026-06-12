/**
 * NextJobPost — Global Property Builder
 * Builds the standard property block attached to EVERY event.
 * Reads device/browser/OS/UTM/session from environment — no duplicated logic.
 */

/** Derive page_type from current pathname */
export function getPageType(path = window.location.pathname) {
  if (path === '/') return 'home';
  if (path.startsWith('/govt-jobs') || path.startsWith('/upsc-jobs') ||
      path.startsWith('/ssc-jobs')  || path.startsWith('/railway-jobs') ||
      path.startsWith('/banking-jobs') || path.startsWith('/defence-jobs') ||
      path.startsWith('/teaching-jobs') || path.startsWith('/psu-jobs') ||
      path.startsWith('/other-govt-jobs')) return 'govt_jobs_listing';
  if (path.startsWith('/results'))     return 'results_listing';
  if (path.startsWith('/admit-cards')) return 'admit_cards_listing';
  if (path.startsWith('/answer-keys')) return 'answer_keys_listing';
  if (path === '/student-career-center') return 'exam_prep';
  if (path === '/salaries')  return 'salary_search';
  if (path === '/about')     return 'about';
  if (path === '/contact')   return 'contact';
  if (path === '/faq')       return 'faq';
  if (path === '/blog')      return 'blog';
  if (path === '/dashboard') return 'user_dashboard';
  if (path === '/admin')     return 'admin';
  if (path === '/login' || path === '/signup') return 'auth';
  // Any other path is a job/content detail
  return 'job_detail';
}

/** Detect device type from screen width */
function getDeviceType() {
  const w = window.innerWidth;
  if (w <= 480) return 'mobile';
  if (w <= 1024) return 'tablet';
  return 'desktop';
}

/** Parse browser name from userAgent */
function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg'))  return 'Chrome';
  if (ua.includes('Firefox'))  return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg'))      return 'Edge';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  return 'Other';
}

/** Parse OS name from userAgent/platform */
function getOS() {
  const ua = navigator.userAgent;
  if (ua.includes('Win'))   return 'Windows';
  if (ua.includes('Mac'))   return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Other';
}

/** Get or create persistent session_id for this browser session */
export function getSessionId() {
  let sid = sessionStorage.getItem('_njp_session_id');
  if (!sid) {
    sid = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem('_njp_session_id', sid);
  }
  return sid;
}

/** Parse UTM params from URL or sessionStorage (persist across navigation) */
function getUTMProps() {
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(k => {
    const val = params.get(k) || sessionStorage.getItem(k) || '';
    if (val) {
      utm[k] = val;
      sessionStorage.setItem(k, val); // persist for the session
    }
  });
  return utm;
}

/**
 * Build the complete global property block.
 * Merges into every event automatically via mixpanel.register() super-props,
 * but also returned here for explicit attachment when needed.
 */
export function buildGlobalProps() {
  const referrer = document.referrer || 'Direct';
  const initialReferrer = localStorage.getItem('_njp_initial_referrer') || referrer;
  if (referrer !== 'Direct' && !localStorage.getItem('_njp_initial_referrer')) {
    localStorage.setItem('_njp_initial_referrer', referrer);
  }

  return {
    current_url:      window.location.href,
    current_path:     window.location.pathname,
    page_title:       document.title,
    timestamp:        new Date().toISOString(),
    device_type:      getDeviceType(),
    browser:          getBrowser(),
    os:               getOS(),
    screen_width:     window.innerWidth,
    screen_height:    window.innerHeight,
    session_id:       getSessionId(),
    initial_referrer: initialReferrer,
    current_referrer: referrer,
    ...getUTMProps(),
  };
}

/** Check if referrer is a search engine (for SEO events) */
export function isSearchEngineReferrer(referrer = document.referrer) {
  return /google\.|bing\.|yahoo\.|duckduckgo\.|baidu\.|yandex\./i.test(referrer);
}
