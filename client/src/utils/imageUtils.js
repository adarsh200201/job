/**
 * Resolves a job image path to a full URL.
 * Handles relative paths by prefixing them with the backend server URL.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already an absolute URL (http:// or https://), return it
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  // Get the API base URL from environment variables
  const envBaseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  
  // Determine the server root (remove /api if present)
  let serverRoot = '';
  if (envBaseURL) {
    serverRoot = envBaseURL.replace(/\/api\/?$/, '');
  } else if (import.meta.env.DEV) {
    serverRoot = 'http://localhost:4000';
  } else {
    // If no base URL is defined in production, we assume backend is on the same host
    // but we still need to handle cases where frontend and backend are separate.
    // Based on .env.production, the backend is on Render.
    serverRoot = ''; 
  }

  // Ensure imagePath starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return serverRoot ? `${serverRoot}${normalizedPath}` : normalizedPath;
};

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800', // Laptop code
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800', // Office
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800', // Handshake
  'https://images.unsplash.com/photo-1504384308090-c564bd248a0d?auto=format&fit=crop&w=800', // Code
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800'  // Meeting
];

export const getFallbackImage = (title) => {
  if (!title) return FALLBACK_IMAGE;
  
  // Simple hash function to get consistent index for a title
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
};
