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

export const PROMO_SUCCESS_DATA: PromoSuccessMetrics = {
  totalRevenue: 45_500_000_000,
  targetRevenue: 100_000_000_000,
  percentComplete: 45.5,
  totalOrders: 1_287,
  totalUnits: 6_150,
  averageRating: 4.8,
  daysRemaining: 3,
};

export const TOP_PRODUCTS: TopProduct[] = [
  {
    id: "1",
    name: "pH Meter Milwaukee MW102 PRO",
    unitsSold: 156,
    revenue: 712_340_000,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Turbidity Meter Lovibond TB 210 IR",
    unitsSold: 89,
    revenue: 2_363_840_000,
    rating: 4.7,
  },
  {
    id: "3",
    name: "Erlenmeyer Flask Pyrex 250 mL",
    unitsSold: 2_340,
    revenue: 359_397_000,
    rating: 4.8,
  },
  {
    id: "4",
    name: "Beaker Glass Pyrex 500 mL",
    unitsSold: 1_890,
    revenue: 259_186_500,
    rating: 4.6,
  },
  {
    id: "5",
    name: "Volumetric Flask Pyrex 100 mL Class A",
    unitsSold: 845,
    revenue: 315_308_500,
    rating: 4.9,
  },
];
