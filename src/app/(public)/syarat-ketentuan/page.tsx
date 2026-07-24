/* Hallmark · page: SyaratKetentuan · genre: modern-minimal · macrostructure: Long Document · design-system: design.md */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — AndisLab",
  description: "Baca syarat dan ketentuan penggunaan website, proses pemesanan, garansi, pengiriman, dan layanan purna jual dari PT Andis Sentral Laboratorium (AndisLab).",
  alternates: { canonical: "/syarat-ketentuan" },
};

export default function SyaratKetentuanPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="prose prose-slate prose-lg max-w-none">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
          Syarat &amp; Ketentuan
        </h1>
        <p>
          Selamat datang di website AndisLab. Dengan mengakses dan menggunakan layanan di website kami,
          Anda menyetujui syarat dan ketentuan berikut ini. Harap membacanya dengan seksama.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800">1. Layanan Kami</h2>
        <p>
          AndisLab adalah penyedia dan distributor peralatan laboratorium, bahan kimia, instrumen analitik,
          dan furnitur laboratorium untuk pelanggan B2B, lembaga pendidikan, dan institusi penelitian di Indonesia.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800">2. Proses Pemesanan</h2>
        <p>
          Website ini difungsikan sebagai katalog digital. Proses pembelian, negosiasi, dan pembayaran tidak
          dilakukan secara langsung di website ini melainkan akan diarahkan kepada tim sales kami melalui WhatsApp
          atau Email (RFQ). Harga yang tertera pada produk bersifat informatif dan dapat berubah sewaktu-waktu.
          Harga final akan disertakan pada Surat Penawaran Harga (Quotation) resmi.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800">3. Ketersediaan Produk</h2>
        <p>
          Ketersediaan produk (stok) yang tertera dapat berubah tanpa pemberitahuan sebelumnya. Pesanan Anda
          baru dianggap final setelah ketersediaan stok dikonfirmasi ulang oleh tim sales kami dan Anda menyetujui
          penawaran.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800">4. Pembayaran dan Pengiriman</h2>
        <p>
          Detail mengenai syarat pembayaran (seperti DP, Tempo, atau Lunas) dan ketentuan pengiriman (ekspedisi,
          asuransi, dan estimasi waktu) akan disepakati dan dicantumkan di dalam Invoice atau Surat Penawaran resmi.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800">5. Garansi dan Dukungan</h2>
        <p>
          Setiap produk instrumen yang kami distribusikan disertai dengan garansi resmi. Periode garansi
          dan layanan purna jual bergantung pada kebijakan setiap merek atau pabrikan. Klaim garansi dapat
          diajukan dengan menyertakan bukti pembelian yang sah.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800">6. Hubungi Kami</h2>
        <p>
          Jika Anda memiliki pertanyaan mengenai Syarat dan Ketentuan ini, Anda dapat menghubungi kami melalui
          email di <a href="mailto:cs@andislab.com">cs@andislab.com</a> atau telepon yang tertera pada halaman kontak.
        </p>
      </div>
    </main>
  );
}
