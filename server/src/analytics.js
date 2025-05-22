import { PostHog } from 'posthog-node';
import getLogger from './getLogger.js';

const logger = getLogger('analytics');

// Initialize PostHog with environment variables or default to disabled
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;
const POSTHOG_HOST = process.env.POSTHOG_HOST || 'https://app.posthog.com';

let posthogClient;

if (POSTHOG_API_KEY) {
  posthogClient = new PostHog(POSTHOG_API_KEY, {
    host: POSTHOG_HOST,
    flushAt: 20, // Batch size for events
    flushInterval: 10000 // Flush interval in milliseconds
  });
  logger.info('PostHog analytics initialized');
} else {
  logger.info('PostHog analytics disabled (no API key provided)');
}

export function trackEvent(event, properties = {}, userId = null) {
  if (!posthogClient) {return;}
  
  try {
    posthogClient.capture({
      distinctId: userId || 'anonymous',
      event,
      properties
    });
  } catch (error) {
    logger.error('Failed to track event', { error: error.message, event });
  }
}

export function shutdownAnalytics() {
  if (posthogClient) {
    return new Promise((resolve) => {
      posthogClient.flush((error) => {
        if (error) {
          logger.error('Error flushing PostHog events', { error: error.message });
        }
        resolve();
      });
    });
  }
  return Promise.resolve();
} 