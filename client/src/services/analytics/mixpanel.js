import mixpanel from 'mixpanel-browser';

let isInitialized = false;
const eventQueue = [];

function executeOrQueue(fn) {
  if (isInitialized) {
    try {
      fn();
    } catch (e) {
      if (import.meta.env.DEV) console.error('[Analytics] Error executing mixpanel call:', e);
    }
  } else {
    eventQueue.push(fn);
  }
}

export const safeMixpanel = {
  init: (token, config) => {
    try {
      mixpanel.init(token, config);
      isInitialized = true;
      // Flush queued events
      while (eventQueue.length > 0) {
        const fn = eventQueue.shift();
        try {
          fn();
        } catch (e) {
          if (import.meta.env.DEV) console.error('[Analytics] Failed to flush queued action:', e);
        }
      }
    } catch (e) {
      if (import.meta.env.DEV) console.error('[Analytics] Init failed:', e);
    }
  },
  register: (props) => {
    executeOrQueue(() => mixpanel.register(props));
  },
  track: (eventName, props) => {
    executeOrQueue(() => mixpanel.track(eventName, props));
  },
  identify: (userId) => {
    executeOrQueue(() => mixpanel.identify(userId));
  },
  reset: () => {
    executeOrQueue(() => mixpanel.reset());
  },
  people: {
    set: (props) => {
      executeOrQueue(() => mixpanel.people.set(props));
    },
    set_once: (props) => {
      executeOrQueue(() => mixpanel.people.set_once(props));
    },
    increment: (propName) => {
      executeOrQueue(() => mixpanel.people.increment(propName));
    }
  }
};

export default safeMixpanel;
