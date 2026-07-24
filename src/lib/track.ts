export function trackWhatsApp(waUrl: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'whatsapp_click');
  }
  setTimeout(() => { window.location.href = waUrl; }, 300);
}
