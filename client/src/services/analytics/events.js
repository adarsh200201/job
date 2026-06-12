/**
 * NextJobPost — Mixpanel Event Constants
 * Single source of truth for ALL event names.
 * Import EVENTS from this file everywhere — never hardcode strings.
 */
export const EVENTS = Object.freeze({
  // ── SECTION 2: CORE EVENTS ──────────────────────────────
  PAGE_VIEWED:               'Page Viewed',
  LANDING_PAGE_ENTERED:      'Landing Page Entered',
  LANDING_PAGE_EXITED:       'Landing Page Exited',
  CATEGORY_VIEWED:           'Category Viewed',
  SEARCH_STARTED:            'Search Started',
  JOB_SEARCH:                'Job Search',
  SEARCH_FILTER_APPLIED:     'Search Filter Applied',
  SEARCH_SUGGESTION_CLICKED: 'Search Suggestion Clicked',
  SEARCH_NO_RESULTS:         'Search No Results',

  // ── SECTION 3: JOB DISCOVERY ────────────────────────────
  JOB_IMPRESSION:            'Job Impression',
  JOB_CARD_CLICKED:          'Job Card Clicked',
  JOB_DETAIL_VIEWED:         'Job Detail Viewed',
  SALARY_VIEWED:             'Salary Viewed',
  ELIGIBILITY_VIEWED:        'Eligibility Viewed',
  IMPORTANT_DATES_VIEWED:    'Important Dates Viewed',
  NOTIFICATION_PDF_OPENED:   'Notification PDF Opened',
  OFFICIAL_WEBSITE_CLICKED:  'Official Website Clicked',
  APPLY_JOB_CLICKED:         'Apply Job Clicked',
  JOB_SAVED:                 'Job Saved',
  JOB_UNSAVED:               'Job Unsaved',
  RELATED_JOB_CLICKED:       'Related Job Clicked',
  RECOMMENDED_JOB_CLICKED:   'Recommended Job Clicked',
  JOB_SHARED:                'Job Shared',

  // ── SECTION 4: GOVERNMENT JOB EVENTS ────────────────────
  GOVERNMENT_JOB_VIEWED:         'Government Job Viewed',
  RESULT_VIEWED:                  'Result Viewed',
  RESULT_DOWNLOAD_CLICKED:        'Result Download Clicked',
  ADMIT_CARD_VIEWED:              'Admit Card Viewed',
  ADMIT_CARD_DOWNLOAD_CLICKED:    'Admit Card Download Clicked',
  ANSWER_KEY_VIEWED:              'Answer Key Viewed',
  ANSWER_KEY_DOWNLOAD_CLICKED:    'Answer Key Download Clicked',
  SYLLABUS_VIEWED:                'Syllabus Viewed',
  SYLLABUS_DOWNLOAD_CLICKED:      'Syllabus Download Clicked',
  EXAM_CALENDAR_VIEWED:           'Exam Calendar Viewed',
  PREVIOUS_PAPER_VIEWED:          'Previous Paper Viewed',
  PREVIOUS_PAPER_DOWNLOADED:      'Previous Paper Downloaded',

  // ── SECTION 5: CONTENT EVENTS ────────────────────────────
  FAQ_VIEWED:                'FAQ Viewed',
  FAQ_EXPANDED:              'FAQ Expanded',
  AI_SUMMARY_VIEWED:         'AI Summary Viewed',
  AI_SUMMARY_EXPANDED:       'AI Summary Expanded',
  CONTENT_FULLY_READ:        'Content Fully Read',
  SCROLL_DEPTH:              'Scroll Depth',

  // ── SECTION 6: USER ENGAGEMENT ──────────────────────────
  SESSION_STARTED:           'Session Started',
  SESSION_ENDED:             'Session Ended',
  USER_ENGAGEMENT:           'User Engagement',
  TIME_ON_PAGE:              'Time On Page',
  ACTIVE_USER:               'Active User',
  BOUNCE_CANDIDATE:          'Bounce Candidate',
  RETURNING_USER:            'Returning User',
  RETURNED_TO_JOB:           'Returned To Job',
  HIGH_INTENT_CANDIDATE:     'High Intent Candidate',
  TIME_TO_APPLY:             'Time To Apply',

  // ── SECTION 7: EXAM PREPARATION ──────────────────────────
  QUESTION_VIEWED:           'Question Viewed',
  ANSWER_SUBMITTED:          'Answer Submitted',
  CORRECT_ANSWER:            'Correct Answer',
  WRONG_ANSWER:              'Wrong Answer',
  QUIZ_STARTED:              'Quiz Started',
  QUIZ_COMPLETED:            'Quiz Completed',
  MOCK_TEST_STARTED:         'Mock Test Started',
  MOCK_TEST_COMPLETED:       'Mock Test Completed',
  CURRENT_AFFAIRS_VIEWED:    'Current Affairs Viewed',
  CURRENT_AFFAIRS_PDF_DOWNLOADED: 'Current Affairs PDF Downloaded',
  REVISION_NOTES_VIEWED:     'Revision Notes Viewed',

  // ── SECTION 8: REVENUE EVENTS ────────────────────────────
  AD_IMPRESSION:             'Ad Impression',
  AD_CLICKED:                'Ad Clicked',
  FEATURED_JOB_VIEWED:       'Featured Job Viewed',
  FEATURED_JOB_CLICKED:      'Featured Job Clicked',
  SPONSORED_JOB_VIEWED:      'Sponsored Job Viewed',
  SPONSORED_JOB_CLICKED:     'Sponsored Job Clicked',
  RESUME_BUILDER_VIEWED:     'Resume Builder Viewed',
  RESUME_BUILDER_STARTED:    'Resume Builder Started',
  RESUME_DOWNLOADED:         'Resume Downloaded',
  PREMIUM_FEATURE_VIEWED:    'Premium Feature Viewed',
  PREMIUM_FEATURE_PURCHASED: 'Premium Feature Purchased',

  // ── SECTION 9: NOTIFICATION EVENTS ──────────────────────
  TELEGRAM_CHANNEL_CLICKED:       'Telegram Channel Clicked',
  WHATSAPP_CHANNEL_CLICKED:       'WhatsApp Channel Clicked',
  EMAIL_SUBSCRIPTION_STARTED:     'Email Subscription Started',
  EMAIL_SUBSCRIPTION_CONFIRMED:   'Email Subscription Confirmed',
  NOTIFICATION_SENT:              'Notification Sent',
  NOTIFICATION_OPENED:            'Notification Opened',
  NOTIFICATION_CLICKED:           'Notification Clicked',
  NOTIFICATION_CONVERTED:         'Notification Converted',

  // ── SECTION 11: AI ANALYTICS ────────────────────────────
  AI_CONTENT_GENERATED:         'AI Content Generated',
  AI_FAQ_EXPANDED:              'AI FAQ Expanded',
  AI_RECOMMENDATION_SHOWN:      'AI Recommendation Shown',
  AI_RECOMMENDATION_CLICKED:    'AI Recommendation Clicked',
  AI_RECOMMENDATION_IGNORED:    'AI Recommendation Ignored',
  AI_SEARCH_USED:               'AI Search Used',

  // ── SECTION 12: SEO ANALYTICS ────────────────────────────
  SEO_LANDING_PAGE_ENTERED:  'SEO Landing Page Entered',
  SEO_LANDING_PAGE_EXITED:   'SEO Landing Page Exited',
  ORGANIC_VISITOR:           'Organic Visitor',
  ORGANIC_APPLY_CLICK:       'Organic Apply Click',
  INTERNAL_LINK_CLICKED:     'Internal Link Clicked',
  EXTERNAL_LINK_CLICKED:     'External Link Clicked',
});
