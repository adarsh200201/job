/**
 * NextJobPost — Deduplication Guard
 * Prevents duplicate events firing within a short time window.
 * Handles React StrictMode double-render and rapid click events.
 */

const _seen = new Map(); // eventKey → timestamp
const DEDUP_WINDOW_MS = 600; // ignore exact same event+props within 600ms

/**
 * Returns true if this event+props combo was already tracked within DEDUP_WINDOW_MS.
 * Automatically cleans up stale entries to avoid memory leaks.
 */
export function isDuplicate(eventName, properties = {}) {
  // Build a stable key: eventName + JSON of sorted props
  const key = eventName + '|' + JSON.stringify(
    Object.keys(properties).sort().reduce((acc, k) => {
      acc[k] = properties[k];
      return acc;
    }, {})
  );

  const now = Date.now();
  const lastSeen = _seen.get(key);

  if (lastSeen && now - lastSeen < DEDUP_WINDOW_MS) {
    return true; // duplicate — skip
  }

  _seen.set(key, now);

  // Cleanup: remove entries older than 5 seconds
  if (_seen.size > 100) {
    for (const [k, ts] of _seen.entries()) {
      if (now - ts > 5000) _seen.delete(k);
    }
  }

  return false;
}
