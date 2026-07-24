// Satu sumber kebenaran untuk kontak WhatsApp — jangan hardcode nomor di komponen/route lain.
export const WA_NUMBER = "6281991575096";
export const WA_NUMBER_DISPLAY = "0819-9157-5096";

export const ETALASE_INAPROC_URL: string = "https://katalog.inaproc.id/andis-sentral-laboratorium";

export function waMeUrl(text?: string) {
  return `https://wa.me/${WA_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
