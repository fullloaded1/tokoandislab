import { PrismaClient, ContentPillar, FunnelStage } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding weekly article: Strategi Penyerapan Sisa Anggaran Alat Laboratorium Akhir Tahun 2026...");

  const slug = "strategi-penyerapan-anggaran-alat-laboratorium-akhir-tahun";
  const title = "Strategi Penyerapan Sisa Anggaran Alat Laboratorium Akhir Tahun: Solusi Bebas SiLPA, SPJ Cepat & Bebas Risiko Keterlambatan";
  const excerpt = "Memasuki kuartal IV (November-Desember), Pejabat Pengadaan dan Pengelola Laboratorium berkejaran dengan batas penutupan anggaran. Pelajari strategi memilih instrumen lab ready stock, pengelompokan plafon non-tender, kelengkapan administrasi SPJ siap audit, serta mitigasi risiko keterlambatan pengiriman.";

  const content = `Memasuki bulan November dan Desember, laboratorium di instansi pemerintah, perguruan tinggi negeri/swasta, rumah sakit, maupun divisi R&D/QC industri menghadapi satu tantangan administratif tahunan yang sama: **penyerapan sisa anggaran belanja modal (Capex) sebelum tutup buku akhir tahun**.

Bagi Pejabat Pembuat Komitmen (PPK), Pejabat Pengadaan (PP), Bendahara Pengeluaran, maupun Kepala Laboratorium, situasi akhir tahun kerap memicu dilema besar:
1. **Risiko SiLPA (Sisa Lebih Pembiayaan Anggaran):** Jika anggaran tidak terserap, sisa dana harus dikembalikan ke kas negara/daerah, yang sering kali berdampak pada **pemotongan pagu alokasi anggaran laboratorium pada tahun anggaran berikutnya**.
2. **Risiko Keterlambatan Serah Terima:** Memaksakan belanja alat yang berstatus *inden* (impor 6–12 minggu) di bulan November sangat berisiko gagal terkirim sebelum batas akhir penerbitan SPM (Surat Perintah Membayar) KPPN / Kas Daerah. Dampaknya fatal: wanprestasi, denda keterlambatan 1‰ per hari, pemutusan kontrak, hingga temuan audit BPK/Inspektorat.

Bagaimana cara menyerap sisa anggaran pengadaan alat laboratorium secara tepat sasaran, patuh regulasi pengadaan, bebas SiLPA, dan barang pasti diterima sebelum tutup tahun? Simak panduan taktis berikut ini.

---

## 1. Jebakan Belanja Alat Lab di Akhir Tahun: Hindari Barang Inden!

Banyak instansi terjebak memesan instrumen canggih dari distributor tanpa memastikan ketersediaan unit fisik di Indonesia. Di bulan November–Desember, jalur logistik global, bea cukai pelabuhan, dan ekspedisi antar pulau mengalami *peak season congestion* (kepadatan puncak).

### Mengapa Barang Inden Berbahaya di Kuartal IV?
* **Batas Waktu Pengajuan SPM/SP2D:** KPPN dan Badan Pengelola Keuangan Daerah umumnya menetapkan batas akhir penerbitan Surat Perintah Membayar (SPM) pada **minggu kedua hingga ketiga bulan Desember**.
* **Syarat Mutlak BAST:** Pembayaran hanya dapat dicairkan jika sudah ada Berita Acara Serah Terima (BAST) fisik dan Berita Acara Pemeriksaan Hasil Pekerjaan (BAPHP). Jika barang belum tiba di laboratorium dan belum diuji fungsi (*commissioning*), BAST tidak dapat ditandatangani.
* **Sanksi Administratif:** Keterlambatan melewati 31 Desember mengakibatkan kontrak macet, anggaran hangus, dan penyedia maupun PPK terkena audit kepatuhan.

> **Rekomendasi Utama:** Pada kuartal IV, prioritaskan 100% pada **distributor alat laboratorium yang menjamin ketersediaan unit fisik di gudang (*Ready Stock Warehouse Indonesia*)**, bukan sekadar janji pengiriman.

---

## 2. Pengelompokan Belanja Berdasarkan Plafon Anggaran (Jalur Pengadaan Langsung)

Salah satu strategi mempercepat penyerapan sisa dana tanpa perlu proses tender/lelang umum yang memakan waktu berminggu-minggu adalah memanfaatkan mekanisme **Pengadaan Langsung (PL)** sesuai Perpres Pengadaan Barang/Jasa Pemerintah (batas nilai sampai dengan Rp 200 Juta).

AndisLab membagi rekomendasi instrumen laboratorium ready stock akhir tahun ke dalam 3 tier plafon anggaran:

### Tier 1: Plafon di Bawah Rp 30 Juta (Smart Budget Clearance)
Cocok untuk menyerap sisa dana operasional lab, sisa dana hibah penelitian dosen, atau anggaran sisa pengadaan mikro.
* **pH Meter Benchtop Presisi:** Dilengkapi elektroda kombinasi kaca dan kompensasi suhu otomatis (ATC) untuk analisis rutin mutu air, larutan kimia, dan sampel farmasi.
* **Mikroskop Biologi Edukasi & Riset:** Seri Opto-Edu / XSZ dengan optik *achromatic* jernih, iluminasi LED dingin tahan lama, dan binokuler ergonomis.
* **Orbital / Linear Shaker Laboratorium:** Daihan Labtech Seri SHK untuk homogenisasi sampel, ekstraksi, dan kultur suspensi mikroorganisme.

### Tier 2: Plafon Rp 30 Juta – Rp 70 Juta (Core Analytical & Sterilization)
Pilihan utama untuk peremajaan instrumen inti yang langsung mendongkrak produktivitas pengujian laboratorium.
* **Autoclave Vertikal Digital (Daihan Labtech Seri LAC-1011SV / LAC-1021SV):** Kapasitas 45 Liter & 60 Liter. Fitur *one-touch automatic operation*, proteksi overheat, dan sertifikasi bejana tekan resmi. Wajib untuk sterilisasi media mikrobiologi dan limbah infeksius.
* **Timbangan Analitik 4 Desimal (Aczet Seri BA-N503 / CY Series):** Resolusi 0.0001 gram (0.1 mg) dengan teknologi *Internal Calibration*. Memenuhi standar audit ISO 17025 dan farmakope untuk penimbangan bahan baku obat presisi.
* **Inkubator Bakteriologi Standar (Yamato Scientific IC413C):** Kapasitas 97 Liter dengan sirkulasi konveksi alami (*natural convection*) yang mencegah sampel media cawan petri mengering selama masa inkubasi 24–48 jam.

### Tier 3: Plafon Rp 70 Juta – Rp 200 Juta (Biosafety & Cold Storage Premium)
Dirancang untuk instansi yang memiliki alokasi anggaran penyerapan bernilai menengah sebelum tender tahunan ditutup.
* **Laminar Air Flow (LAF) Vertikal 1000 mm:** Perlindungan produk steril dari kontaminasi partikel debu dan mikroba dengan filter HEPA efisiensi 99.995%.
* **Biosafety Cabinet (BSC) Kelas II Tipe A2 (Daihan Labtech LCB-0123-A2):** Perlindungan 3 arah (operator, lingkungan, dan sampel) untuk manipulasi patogen BSL-1 dan BSL-2 sesuai standar EN 12469 / NSF 49.
* **Ultra-Low Temperature (ULT) Freezer -86°C (Daihan Labtech LDF-9010U):** Kapasitas 100 Liter, kompresor ganda ramah lingkungan, ideal untuk penyimpanan jangka panjang plasma darah, enzim, strain mikroba, dan materi genetik (DNA/RNA).

---

## 3. Checklist Dokumen SPJ Wajib: Syarat Bebas Temuan BPK & Inspektorat

Kelancaran administrasi SPJ akhir tahun sangat ditentukan oleh kelengkapan berkas legalitas dari distributor. Pastikan rekanan penyedia Anda mampu menerbitkan dokumen berikut:

| No | Dokumen Pengadaan | Fungsi & Relevansi Audit |
|:---|:---|:---|
| 1 | **Surat Penawaran Harga (SPH) Resmi** | Mencantumkan masa berlaku penawaran, spesifikasi teknis mendalam, rincian PPN 11%, dan waktu penyerahan barang (terbit 1x24 jam). |
| 2 | **Surat Penunjukan Distributor (LOA)** | Bukti legalitas bahwa penyedia merupakan distributor/agen resmi yang diakui oleh prinsipal pabrikan (Daihan, Yamato, Aczet, dll). |
| 3 | **Certificate of Origin (COO)** | Menjamin keaslian negara asal manufaktur unit instrumen laboratorium. |
| 4 | **Faktur Pajak Elektronik (e-Faktur)** | Validasi ketaatan pajak transaksi instansi pemerintah/BUMN/perusahaan. |
| 5 | **Berita Acara Serah Terima (BAST & BAPHP)** | Bukti fisik barang telah diperiksa, diuji fungsi, dan diterima dalam kondisi 100% sempurna oleh Panitia Pemeriksa. |
| 6 | **Sertifikat Garansi Resmi 1 Tahun** | Jaminan ketersediaan teknisi tersertifikasi dan suku cadang (*spareparts*) pengganti. |

---

## 4. Skema Diskon Berdasarkan Cara Pembayaran: Maksimalkan Efisiensi Anggaran

Untuk membantu instansi memaksimalkan daya serap anggaran, AndisLab memberlakukan sistem diskon transparan berbasis skema pembayaran pada program **Promo Akhir Tahun 2026**:

* **Pembayaran Tunai / Cash (Diskon 8%):** Sangat menguntungkan bagi laboratorium yang ingin mendapatkan volume unit lebih banyak atau menghemat sisa kas operasional.
* **Uang Muka DP 50% (Diskon 5%):** Opsi populer untuk institusi swasta dan universitas dengan termin terminasi serah terima.
* **Uang Muka DP 30% (Diskon 3%):** Kemudahan penguncian stok barang ready stock saat PO diterbitkan, pelunasan saat uji fungsi selesai.
* **Tempo 30 Hari Pasca BAST (Diskon 0% / Harga Resmi SPH):** Solusi aman khusus bagi instansi pemerintah dan perguruan tinggi negeri yang pencairan kasnya terikat siklus termin KPPN/Kas Daerah setelah BAST lengkap.

---

## 5. Perhatikan Batas Waktu (*Cut-Off*) Ekspedisi Pengiriman 2026

Pengiriman instrumen laboratorium presisi (terutama instrumen kaca, sensor analitik, dan bejana tekan) memerlukan penanganan khusus (*packing* kayu bersertifikat dan asuransi penuh). Mengingat kepadatan kargo ekspedisi akhir tahun, perhatikan batas aman pemesanan berikut:

* **Tujuan Luar Pulau Jawa (Sumatera, Kalimantan, Sulawesi, Bali, Papua):**  
  Batas akhir pemesanan: **15 Desember 2026** *(untuk memastikan barang tiba dan BAST terbit sebelum tanggal 28 Desember)*.
* **Tujuan Pulau Jawa & DI Yogyakarta:**  
  Batas akhir pemesanan: **22 Desember 2026**.
* **Area Khusus Jabodetabek, Cikarang, Karawang, dan Jawa Barat:**  
  Pengiriman langsung menggunakan armada teknisi internal PT Andis Sentral Laboratorium, melayani instalasi cepat hingga minggu terakhir Desember.

---

## 6. Amankan Anggaran Anda Sekarang: SPH Resmi Terbit 1x24 Jam

Jangan biarkan sisa anggaran laboratorium Anda hangus atau menjadi SiLPA yang merugikan perencanaan tahun depan. 

Kunjungi landing page khusus **[Promo Akhir Tahun 2026 AndisLab](/promo-akhir-tahun)** untuk melihat daftar lengkap instrumen ready stock, simulasi harga diskon, serta mengunduh **[Lembar Katalog Cetak A4 Siap Audit](/downloads/Katalog-Promo-Akhir-Tahun-AndisLab-2026.pdf)** sebagai lampiran nota dinas pengajuan pengadaan Anda.

Tim konsultan teknis pengadaan PT Andis Sentral Laboratorium siap menerbitkan SPH resmi, memvalidasi ketersediaan stok fisik gudang, dan mendampingi kelengkapan administrasi SPJ Anda hingga tuntas. Hubungi kami sekarang melalui layanan respons cepat WhatsApp 1x24 jam.`;

  const article = await prisma.article.upsert({
    where: { slug },
    update: {
      title,
      excerpt,
      content,
      image: "/images/articles/penyerapan-anggaran-alat-lab-akhir-tahun.png",
      published: true,
      category: "pengadaan-ekatalog",
      authorName: "Tim Redaksi AndisLab",
      pillar: ContentPillar.SEARCH,
      funnelStage: FunnelStage.SELECTION,
      products: {
        set: [
          { slug: "daihan-lac-1011sv-autoclave" },
          { slug: "daihan-lac-1021sv-autoclave" },
          { slug: "yamato-incubator-ic413c" },
        ],
      },
    },
    create: {
      slug,
      title,
      excerpt,
      content,
      image: "/images/articles/penyerapan-anggaran-alat-lab-akhir-tahun.png",
      published: true,
      category: "pengadaan-ekatalog",
      authorName: "Tim Redaksi AndisLab",
      pillar: ContentPillar.SEARCH,
      funnelStage: FunnelStage.SELECTION,
      products: {
        connect: [
          { slug: "daihan-lac-1011sv-autoclave" },
          { slug: "daihan-lac-1021sv-autoclave" },
          { slug: "yamato-incubator-ic413c" },
        ],
      },
    },
  });

  console.log("Article created/updated successfully with ID:", article.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
