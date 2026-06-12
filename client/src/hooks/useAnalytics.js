/**
 * useAnalytics — General-purpose analytics hook.
 * Returns the full analytics API so components get tracking
 * without importing from multiple files.
 *
 * Usage:
 *   const { track, EVENTS, trackJobShared } = useAnalytics();
 *   track(EVENTS.FAQ_EXPANDED, { faq_title: 'How to apply?' });
 */
import {
  track,
  EVENTS,
  trackJobDetailViewed,
  trackApplyJobClicked,
  trackJobCardClicked,
  trackJobImpression,
  trackJobShared,
  trackJobSaved,
  trackJobUnsaved,
  trackPDFOpened,
  trackJobSearch,
  trackSearchFilterApplied,
  trackSearchStarted,
  trackCategoryViewed,
  trackFAQExpanded,
  trackTelegramClicked,
  trackWhatsAppClicked,
  trackAdClicked,
  trackAdImpression,
  identifyUser,
  resetUser,
} from '../services/analytics/index.js';

export function useAnalytics() {
  return {
    track,
    EVENTS,
    trackJobDetailViewed,
    trackApplyJobClicked,
    trackJobCardClicked,
    trackJobImpression,
    trackJobShared,
    trackJobSaved,
    trackJobUnsaved,
    trackPDFOpened,
    trackJobSearch,
    trackSearchFilterApplied,
    trackSearchStarted,
    trackCategoryViewed,
    trackFAQExpanded,
    trackTelegramClicked,
    trackWhatsAppClicked,
    trackAdClicked,
    trackAdImpression,
    identifyUser,
    resetUser,
  };
}
