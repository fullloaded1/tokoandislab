import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — AndisLab",
  description: "Kebijakan Privasi untuk pengguna dan pelanggan AndisLab.",
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="prose prose-slate prose-lg max-w-none">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
          Kebijakan Privasi
        </h1>
        <p>
          Kebijakan privasi ini menjelaskan bagaimana AndisLab ("kami") mengumpulkan, menggunakan,
          dan melindungi informasi pribadi Anda saat Anda menggunakan layanan kami, termasuk
          mengakses website kami dan menghubungi tim sales kami.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800">1. Informasi yang Kami Kumpulkan</h2>
        <p>
          Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti saat
          Anda mengisi formulir untuk meminta penawaran, mendaftar akun, atau berkomunikasi dengan
          kami melalui WhatsApp dan Email. Informasi ini mungkin termasuk nama, alamat email, nomor telepon,
          nama perusahaan, dan alamat perusahaan Anda.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800">2. Penggunaan Informasi</h2>
        <p>
          Kami menggunakan informasi yang dikumpulkan untuk:
        </p>
        <ul>
          <li>Memproses permintaan penawaran dan pesanan Anda.</li>
          <li>Berkomunikasi dengan Anda terkait produk, layanan, dan dukungan teknis.</li>
          <li>Memperbaiki dan meningkatkan layanan serta pengalaman pengguna di website kami.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800">3. Perlindungan Data</h2>
        <p>
          Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda
          dari akses, penggunaan, atau pengungkapan yang tidak sah. Kami tidak menjual, menyewakan,
          atau membagikan informasi pribadi Anda kepada pihak ketiga untuk tujuan pemasaran mereka.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800">4. Perubahan Kebijakan</h2>
        <p>
          Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Setiap perubahan akan dipublikasikan
          di halaman ini dengan tanggal pembaruan terakhir di bagian atas halaman.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800">5. Hubungi Kami</h2>
        <p>
          Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:
          <br />
          Email: <a href="mailto:cs@andislab.com">cs@andislab.com</a>
        </p>
      </div>
    </main>
  );
}
