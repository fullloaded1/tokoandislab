import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout Pembelian — AndisLab",
  description: "Selesaikan pembelian produk ready stock Anda.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
