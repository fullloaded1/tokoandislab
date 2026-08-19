// Satu sumber kebenaran untuk kontak WhatsApp — jangan hardcode nomor di komponen/route lain.
export const WA_NUMBER = "6285973211176";
export const WA_NUMBER_DISPLAY = "0859-7321-1176";

export const ETALASE_INAPROC_URL: string = "https://katalog.inaproc.id/andis-sentral-laboratorium";

export function waMeUrl(text?: string) {
  return `https://wa.me/${WA_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
