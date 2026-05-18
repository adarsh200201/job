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


