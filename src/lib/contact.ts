export const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || "6281991575096";
export const WA_NUMBER_DISPLAY = process.env.NEXT_PUBLIC_WA_NUMBER_DISPLAY || "0819-9157-5096";

export const OFFICE_PHONE = process.env.NEXT_PUBLIC_OFFICE_PHONE || "021-38740154";
export const OFFICE_PHONE_INT = "+622138740154";

export const ETALASE_INAPROC_URL: string = "https://katalog.inaproc.id/andis-sentral-laboratorium";

export function waMeUrl(text?: string) {
  const cleanNumber = WA_NUMBER.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

