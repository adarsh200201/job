/**
 * useSessionTracking — Session lifecycle management.
 * Mount ONCE in AppLayout. Handles:
 *  - Session init
 *  - beforeunload cleanup
 *  - Active user heartbeat
 */
import { useEffect } from 'react';
import { initSession, attachSessionEndListener } from '../services/analytics/session.js';
import { track, EVENTS } from '../services/analytics/index.js';

let _sessionInitialised = false;

export function useSessionTracking() {
  useEffect(() => {
    if (_sessionInitialised) return;
    _sessionInitialised = true;

    // Initialize session counters + fire Session Started
    initSession();

    // Fire Active User once per session
    track(EVENTS.ACTIVE_USER, {});

    // Attach before-unload handler for Session Ended
    const cleanup = attachSessionEndListener();
    return cleanup;
  }, []);
}
