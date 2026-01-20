import api from '../api/index';

let keepAliveInterval = null;

/**
 * Start the keep-alive mechanism
 * Pings the backend every 10 seconds to keep Render server awake
 */
export const startKeepAlive = () => {
  if (keepAliveInterval) {
    console.log('Keep-alive is already running');
    return;
  }

  // Ping every 10 seconds (10000 milliseconds)
  keepAliveInterval = setInterval(async () => {
    try {
      await api.get('/health');
      console.log('Keep-alive ping sent at', new Date().toISOString());
    } catch (error) {
      console.error('Keep-alive ping failed:', error.message);
    }
  }, 10000);

  console.log('Keep-alive mechanism started - pinging every 10 seconds');
};

/**
 * Stop the keep-alive mechanism
 */
export const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('Keep-alive mechanism stopped');
  }
};
