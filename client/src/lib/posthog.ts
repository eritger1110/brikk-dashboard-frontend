import posthog from 'posthog-js';

// Initialize PostHog
export function initPostHog() {
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: 'identified_only', // Only create profiles for identified users
      capture_pageview: true, // Automatically capture pageviews
      capture_pageleave: true, // Track when users leave pages
      autocapture: true, // Automatically capture clicks, form submissions, etc.
      session_recording: {
        enabled: true, // Enable session replay
        recordCrossOriginIframes: false,
      },
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          console.log('[PostHog] Initialized successfully');
        }
      },
    });
  } else {
    console.warn('[PostHog] API key not found. Analytics disabled.');
  }
}

// Track custom events
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (posthog.__loaded) {
    posthog.capture(eventName, properties);
  }
}

// Identify user
export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (posthog.__loaded) {
    posthog.identify(userId, traits);
  }
}

// Reset user (on logout)
export function resetUser() {
  if (posthog.__loaded) {
    posthog.reset();
  }
}

// Track page views manually (if needed)
export function trackPageView(pageName?: string) {
  if (posthog.__loaded) {
    posthog.capture('$pageview', { page: pageName || window.location.pathname });
  }
}

export default posthog;
