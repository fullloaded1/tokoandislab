import { describe, it, expect, beforeEach, vi } from 'vitest';
import { trackEvent, GA_TRACKING_ID } from './gtag';

describe('Analytics Module', () => {
  beforeEach(() => {
    // Reset window.gtag mock before each test
    (global as any).window = {
      gtag: vi.fn(),
    };
  });

  it('should have a valid tracking ID', () => {
    expect(GA_TRACKING_ID).toBeDefined();
    expect(GA_TRACKING_ID).toMatch(/^G-[A-Z0-9]+$/);
  });

  it('should call window.gtag with correct event data', () => {
    const mockData = {
      lead_source: 'whatsapp_button' as const
    };
    
    trackEvent('generate_lead', mockData);
    
    expect((window as any).gtag).toHaveBeenCalledWith(
      'event',
      'generate_lead',
      mockData
    );
  });
});
