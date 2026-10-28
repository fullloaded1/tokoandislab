export type MarginZone = "target" | "win_mode" | "attention" | "overcost" | "missing_cost";

export type DiscountTier = 0 | 5 | 10 | 15;

export interface PromoCalculatorProduct {
  code: string; // e.g. "A-01", "B-03", "C-05"
  tier: "A" | "B" | "C";
  name: string;
  brand: string;
  model: string;
  price: number; // Selling price in Rupiah
  cost: number;  // Modal price in Rupiah (default 80% of selling price -> 25% markup)
  stock: number; // Ready stock unit count
  unit: string;
  category: string;
}

export interface SelectedItem {
  product: PromoCalculatorProduct;
  qty: number;
}

export interface MarginZoneMeta {
  zone: MarginZone;
  label: string;
  shortLabel: string;
  badgeClass: string;
  borderClass: string;
  textClass: string;
  bgLightClass: string;
  icon: string;
  description: string;
}

export interface BidSimulationResult {
  catalogTotal: string; // Decimal string
  totalCost: string;    // Decimal string
  customerBid: string;  // Decimal string
  discountAmount: string; // Decimal string
  discountPercent: number;
  projectProfit: string; // Decimal string
  projectMarginPercent: number;
  zone: MarginZone;
  zoneMeta: MarginZoneMeta;
  statusHeadline: string;
  recommendation: string;
  suggestedCounterBid?: string; // Decimal string for recommended counter-offer to keep target margin
  suggestedTerms: string;
  eligibleBonuses: string[];
}

export interface BudgetPreset {
  label: string;
  amount: number;
  description: string;
  targetTier: "A" | "B" | "C" | "All";
}
