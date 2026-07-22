export const AD_URL = 'https://www.effectivecpmnetwork.com/rfd86qtx9?key=c415dfd97ffc3035b4a3fdd03ba9385d';

/**
 * Triggers opening the ad in a new tab alongside the user's intended navigation.
 */
export const triggerAd = () => {
  try {
    window.open(AD_URL, '_blank');
  } catch (err) {
    console.error('Ad trigger error:', err);
  }
};

/**
 * Opens TWO tabs on click:
 * Tab 1: The target destination page (targetUrl)
 * Tab 2: The CPM ad URL (AD_URL)
 */
export const openDualTabs = (targetUrl, e) => {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
  if (!targetUrl) {
    triggerAd();
    return;
  }
  try {
    // Open target destination in 1st tab
    window.open(targetUrl, '_blank');
    // Open CPM ad in 2nd tab
    window.open(AD_URL, '_blank');
  } catch (err) {
    console.error('Error in openDualTabs:', err);
    window.open(targetUrl, '_blank');
  }
};

let hasTriggeredFirstInteraction = false;

/**
 * Automatically triggers the CPM ad on the very first tap/click anywhere on the page.
 * Ensures candidates arriving from Telegram, LinkedIn, or Google see the ad open in a second tab.
 */
export const initPopunderOnFirstInteraction = () => {
  if (hasTriggeredFirstInteraction) return;

  const handleFirstInteraction = (e) => {
    if (hasTriggeredFirstInteraction) return;
    hasTriggeredFirstInteraction = true;
    
    // Clean up event listeners
    window.removeEventListener('click', handleFirstInteraction, true);
    window.removeEventListener('touchstart', handleFirstInteraction, true);

    // Trigger ad in a new tab
    triggerAd();
  };

  window.addEventListener('click', handleFirstInteraction, { capture: true, once: true });
  window.addEventListener('touchstart', handleFirstInteraction, { capture: true, once: true });
};
