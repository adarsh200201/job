/**
 * urlHelper.js
 * Centralized utility for constructing and parsing SEO-optimized job URLs.
 */

/**
 * Returns the correct SEO prefix and URL for a job listing based on its type.
 * Government jobs: /government-jobs/:slug
 * Private sector / tech jobs: /careers/:slug
 */
export function getJobUrl(job) {
  if (!job || !job.slug) return '#';
  const prefix = job.isGovernment ? '/government-jobs' : '/careers';
  return `${prefix}/${job.slug}`;
}
