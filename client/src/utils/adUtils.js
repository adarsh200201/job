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
