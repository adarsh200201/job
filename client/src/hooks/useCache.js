import { useCallback, useRef } from 'react';

const globalCache = new Map();
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Helper to add timeout to a promise
function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

export function useCache() {
  const requestMap = useRef(new Map());

  const getCacheKey = useCallback((url, config = {}) => {
    return JSON.stringify({ url, params: config.params });
  }, []);

  const get = useCallback(async (apiCall, url, config = {}) => {
    const cacheKey = getCacheKey(url, config);

    // Return cached data if available
    if (globalCache.has(cacheKey)) {
      return globalCache.get(cacheKey);
    }

    // Return ongoing request if it exists (deduplication)
    if (requestMap.current.has(cacheKey)) {
      return requestMap.current.get(cacheKey);
    }

    // Make new request with timeout
    const startTime = performance.now();
    const promise = withTimeout(apiCall(url, config), REQUEST_TIMEOUT)
      .then((response) => {
        globalCache.set(cacheKey, response);
        requestMap.current.delete(cacheKey);
        return response;
      })
      .catch((error) => {
        requestMap.current.delete(cacheKey);
        throw error;
      });

    requestMap.current.set(cacheKey, promise);
    return promise;
  }, [getCacheKey]);

  const invalidate = useCallback((url, config = {}) => {
    const cacheKey = getCacheKey(url, config);
    globalCache.delete(cacheKey);
  }, [getCacheKey]);

  const clear = useCallback(() => {
    globalCache.clear();
    requestMap.current.clear();
  }, []);

  return { get, invalidate, clear, getCacheKey };
}
