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
    // FALLBACK: Hardcode the production backend URL for reliability
    serverRoot = 'https://job-tdg8.onrender.com';
  }

  // Ensure imagePath starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return serverRoot ? `${serverRoot}${normalizedPath}` : normalizedPath;
};

export const FALLBACK_IMAGE = 'https://cdn.builder.io/api/v1/image/assets%2F0652c10db86741bd95f51605c9719073%2F196590e2e83d4a159a955d16c0e8ebde?format=webp&width=800';
