import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = '99f55a1e0ff42d36dbf679a878e375fa';

export const initMixpanel = () => {
  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: false, // Set to true if you want to see logs in console
      track_pageview: false, // Manually track to ensure precise router-based tracking
      persistence: 'localstorage',
    });
  } catch (error) {
    console.error('Failed to initialize Mixpanel:', error);
  }
};

export const trackEvent = (eventName, properties = {}) => {
  try {
    mixpanel.track(eventName, properties);
  } catch (error) {
    console.error(`Mixpanel failed to track event "${eventName}":`, error);
  }
};

export const trackPageView = (pageName, properties = {}) => {
  try {
    mixpanel.track('Page View', {
      page: pageName,
      path: window.location.pathname,
      ...properties
    });
  } catch (error) {
    console.error(`Mixpanel failed to track page view for "${pageName}":`, error);
  }
};

export const identifyUser = (userId, traits = {}) => {
  try {
    mixpanel.identify(userId);
    if (Object.keys(traits).length > 0) {
      mixpanel.people.set(traits);
    }
  } catch (error) {
    console.error('Mixpanel failed to identify user:', error);
  }
};

export const resetUser = () => {
  try {
    mixpanel.reset();
  } catch (error) {
    console.error('Mixpanel failed to reset user:', error);
  }
};
