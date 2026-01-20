import cron from 'node-cron';
import api from '../api/index';

let keepAliveTask = null;

/**
 * Start the keep-alive mechanism
 * Pings the backend every 10 seconds to keep Render server awake
 */
export const startKeepAlive = () => {
  if (keepAliveTask) {
    console.log('Keep-alive is already running');
    return;
  }

  // Run every 10 seconds
  keepAliveTask = cron.schedule('*/10 * * * * *', async () => {
    try {
      await api.get('/health');
      console.log('Keep-alive ping sent at', new Date().toISOString());
    } catch (error) {
      console.error('Keep-alive ping failed:', error.message);
    }
  });

  console.log('Keep-alive mechanism started - pinging every 10 seconds');
};

/**
 * Stop the keep-alive mechanism
 */
export const stopKeepAlive = () => {
  if (keepAliveTask) {
    keepAliveTask.stop();
    keepAliveTask.destroy();
    keepAliveTask = null;
    console.log('Keep-alive mechanism stopped');
  }
};
