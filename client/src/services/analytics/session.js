/**
 * NextJobPost — Session Tracker
 * Manages session lifecycle: session_id, started/ended, time-on-page,
 * returning user detection, and lifecycle stage.
 */
import mixpanel from './mixpanel.js';
import { getSessionId } from './globalProps.js';
import { EVENTS } from './events.js';

const SESSION_START_KEY = '_njp_session_start';
const VISIT_COUNT_KEY   = '_njp_visit_count';
const LAST_ACTIVE_KEY   = '_njp_last_active';
const PAGE_ENTER_KEY    = '_njp_page_enter';

/** Initialise session on app boot — call once from main.jsx/App.jsx */
export function initSession() {
  const now = Date.now();

  // Ensure session_id exists
  getSessionId();

  // Track session start time (within this browser session)
  if (!sessionStorage.getItem(SESSION_START_KEY)) {
    sessionStorage.setItem(SESSION_START_KEY, String(now));

    // Increment total visit count
    const visits = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10) + 1;
    localStorage.setItem(VISIT_COUNT_KEY, String(visits));

    // Track returning user
    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    if (lastActive) {
      try {
        mixpanel.track(EVENTS.RETURNING_USER, {
          days_since_last_visit: Math.floor((now - parseInt(lastActive, 10)) / 86400000),
          total_visits: visits,
        });
      } catch (_) {}
    }

    // Track session started
    try {
      mixpanel.track(EVENTS.SESSION_STARTED, {
        session_id:   getSessionId(),
        visit_number: visits,
        is_returning: !!lastActive,
      });
    } catch (_) {}
  }

  // Update last active timestamp on every app load
  localStorage.setItem(LAST_ACTIVE_KEY, String(now));
}

/** Record page entry time — call on every route change */
export function recordPageEnter() {
  sessionStorage.setItem(PAGE_ENTER_KEY, String(Date.now()));
}

/** 
 * Fire Time On Page + Session Ended events — call on route exit.
 * Returns duration in seconds.
 */
export function recordPageExit(path, pageTitle) {
  const enterTime = parseInt(sessionStorage.getItem(PAGE_ENTER_KEY) || '0', 10);
  if (!enterTime) return 0;

  const duration = Math.round((Date.now() - enterTime) / 1000);

  try {
    mixpanel.track(EVENTS.TIME_ON_PAGE, {
      current_path:   path,
      page_title:     pageTitle,
      duration_secs:  duration,
    });
  } catch (_) {}

  // Bounce detection: under 10 seconds + no meaningful interaction
  if (duration < 10) {
    try {
      mixpanel.track(EVENTS.BOUNCE_CANDIDATE, {
        current_path:  path,
        duration_secs: duration,
      });
    } catch (_) {}
  }

  return duration;
}

/** Fire Session Ended on browser close/tab close */
export function attachSessionEndListener() {
  const handler = () => {
    const start = parseInt(sessionStorage.getItem(SESSION_START_KEY) || '0', 10);
    const duration = start ? Math.round((Date.now() - start) / 1000) : 0;
    try {
      mixpanel.track(EVENTS.SESSION_ENDED, {
        session_duration: duration,
        pages_viewed: parseInt(sessionStorage.getItem('pages_viewed_count') || '0', 10),
      });
    } catch (_) {}
  };
  window.addEventListener('beforeunload', handler);
  return () => window.removeEventListener('beforeunload', handler);
}

/** Derive lifecycle stage from visit count and apply clicks */
export function getLifecycleStage() {
  const visits     = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
  const applyCount = parseInt(localStorage.getItem('_njp_apply_clicks') || '0', 10);
  if (applyCount >= 3)  return 'Applicant';
  if (visits >= 10)     return 'Power User';
  if (visits >= 5)      return 'Job Seeker';
  if (visits >= 2)      return 'Explorer';
  return 'Visitor';
}

/** Increment and get total apply clicks count */
export function incrementApplyCount() {
  const count = parseInt(localStorage.getItem('_njp_apply_clicks') || '0', 10) + 1;
  localStorage.setItem('_njp_apply_clicks', String(count));
  return count;
}
