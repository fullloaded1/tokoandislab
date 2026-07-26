import { AnalyticsEvent, AnalyticsPayload } from './types';

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-57LWKFHVYZ';

// Log the pageview with their URL
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log specific events
export function trackEvent<K extends AnalyticsEvent>(
  action: K,
  params: AnalyticsPayload[K]
) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, params);
  } else {
    console.debug(`[Analytics Event Queued]: ${action}`, params);
  }
}
