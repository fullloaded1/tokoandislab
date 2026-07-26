import { trackEvent } from './analytics';

export function trackWhatsApp(waUrl: string, source: string = 'whatsapp_button') {
  trackEvent('generate_lead', {
    lead_source: source as any,
  });
  
  // Minimal delay to ensure GA request is sent before navigation
  setTimeout(() => { 
    window.location.href = waUrl; 
  }, 150);
}
