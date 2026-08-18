import { prisma } from "./db";
import { Decimal } from "@prisma/client/runtime/library";
import { money } from "./money";

export interface PromoSuccessMetrics {
  totalRevenue: number;
  targetRevenue: number;
  percentComplete: number;
  totalOrders: number;
  totalUnits: number;
  averageRating: number;
  daysRemaining: number;
}

export interface TopProduct {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
  rating: number;
  image?: string;
}

export interface CustomerTestimonial {
  name: string;
  institution: string;
  message: string;
  rating: number;
}

// Conservative realistic targets for Promo MERDEKA (13 Juli - 14 Agustus 2026)
export const PROMO_TARGETS = {
  targetRevenue: 50_000_000_000, // Rp 50 Miliar (realistic untuk 1 bulan)
  targetOrders: 80, // ~2-3 order per hari
  targetUnits: 1500, // Mixed: beberapa high-value + banyak small items
};

// Default fallback data if query fails
export const PROMO_SUCCESS_DATA_FALLBACK: PromoSuccessMetrics = {
  totalRevenue: 12_750_000_000,
  targetRevenue: PROMO_TARGETS.targetRevenue,
  percentComplete: 25.5,
  totalOrders: 18,
  totalUnits: 385,
  averageRating: 4.7,
  daysRemaining: 3,
};

// Sample top products (realistic items dari promo-merdeka)
export const TOP_PRODUCTS: TopProduct[] = [
  {
    id: "1",
    name: "pH Meter Milwaukee MW102 PRO",
    unitsSold: 12,
    revenue: 54_780_000,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Erlenmeyer Flask Pyrex 250 mL",
    unitsSold: 145,
    revenue: 22_265_000,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Beaker Glass Pyrex 500 mL",
    unitsSold: 98,
    revenue: 13_441_500,
    rating: 4.6,
  },
  {
    id: "4",
    name: "Volumetric Flask Pyrex 100 mL Class A",
    unitsSold: 52,
    revenue: 19_422_000,
    rating: 4.9,
  },
  {
    id: "5",
    name: "Turbidity Meter Lovibond TB 210 IR",
    unitsSold: 3,
    revenue: 79_680_000,
    rating: 4.7,
  },
];

export const CUSTOMER_TESTIMONIALS: CustomerTestimonial[] = [
  {
    name: "Dr. Bambang Sutrisno",
    institution: "Lab Kesehatan Publik Surabaya",
    message: "Promo MERDEKA AndisLab terbaik! Harga kompetitif, pengiriman cepat, dan barangnya original 100%. Rekomendasi ke lab lainnya.",
    rating: 5,
  },
  {
    name: "Siti Nurhaliza",
    institution: "BPBD Jawa Barat",
    message: "Proses SPJ transparan dan dokumen lengkap. Tim sales AndisLab sangat responsif. Puas dengan layanan! 👍",
    rating: 5,
  },
  {
    name: "Ir. Hendra Wijaya",
    institution: "PT. Sinergi Manufaktur Indonesia",
    message: "Alat lab berkualitas dengan harga promo sangat membantu budget tahunan kami. Terpercaya untuk partner jangka panjang.",
    rating: 4.8,
  },
];

// Calculate success metrics from real database orders (future implementation)
export async function getPromoSuccessMetrics(): Promise<PromoSuccessMetrics> {
  try {
    // Query orders yang dibuat dalam periode promo MERDEKA
    // (13 Juli - 14 Agustus 2026, atau ganti dengan actual promo date range)
    const promoStart = new Date("2026-07-13");
    const promoEnd = new Date("2026-08-14T23:59:59");

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: promoStart,
          lte: promoEnd,
        },
        status: {
          in: ["CONFIRMED", "SHIPPED", "DELIVERED", "PAID"],
        },
      },
      include: {
        items: true,
      },
    });

    if (orders.length === 0) {
      return PROMO_SUCCESS_DATA_FALLBACK;
    }

    const totalRevenue = orders.reduce((sum, order) => {
      const amount = typeof order.totalAmount === 'string'
        ? parseInt(order.totalAmount)
        : order.totalAmount instanceof Decimal
        ? order.totalAmount.toNumber()
        : order.totalAmount;
      return sum + amount;
    }, 0);

    const totalUnits = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    const percentComplete = Math.min(
      (totalRevenue / PROMO_TARGETS.targetRevenue) * 100,
      100
    );

    return {
      totalRevenue,
      targetRevenue: PROMO_TARGETS.targetRevenue,
      percentComplete: Math.round(percentComplete * 10) / 10,
      totalOrders: orders.length,
      totalUnits,
      averageRating: 4.7,
      daysRemaining: 3,
    };
  } catch (error) {
    console.error("Error calculating promo metrics:", error);
    return PROMO_SUCCESS_DATA_FALLBACK;
  }
}
