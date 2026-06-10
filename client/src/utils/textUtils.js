/**
 * Clean up competitor website names and replace them with nextjobpost.in
 */
export const cleanTextBranding = (text) => {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/GovtJobsAlert\.in/gi, 'nextjobpost.in')
    .replace(/govtjobsalert\.in/gi, 'nextjobpost.in')
    .replace(/GovtJobsAlert/gi, 'NextJobPost')
    .replace(/govtjobsalert/gi, 'nextjobpost')
    .replace(/SarkariResult\.com/gi, 'nextjobpost.in')
    .replace(/sarkariresult\.com/gi, 'nextjobpost.in')
    .replace(/SarkariResult/gi, 'NextJobPost')
    .replace(/sarkariresult/gi, 'nextjobpost');
};

/**
 * Clean all string properties and string arrays inside a job object
 */
export const cleanJobBranding = (jobObj) => {
  if (!jobObj) return jobObj;
  const copy = { ...jobObj };
  for (const key in copy) {
    if (typeof copy[key] === 'string') {
      copy[key] = cleanTextBranding(copy[key]);
    } else if (Array.isArray(copy[key])) {
      copy[key] = copy[key].map(item => 
        typeof item === 'string' ? cleanTextBranding(item) : item
      );
    }
  }
  return copy;
};
