import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const articleContent = `Centrifuge (sentrifuge) adalah instrumen laboratorium yang menggunakan gaya sentrifugal untuk memisahkan komponen campuran berdasarkan berat jenisnya. Dari memisahkan plasma darah hingga mengendapkan endapan kimia — centrifuge ada di hampir setiap laboratorium modern.

Namun memilih centrifuge yang salah bisa berarti hasil yang tidak optimal, bahkan kerusakan sampel berharga. Artikel ini membahas jenis-jenis centrifuge, cara membaca spesifikasi RPM dan RCF, serta panduan memilih yang tepat untuk kebutuhan lab Anda.

## Jenis Centrifuge Laboratorium

### 1. Microcentrifuge (Mini Centrifuge)

- **Kapasitas**: Tabung microcentrifuge 1,5 mL dan 2 mL
- **Kecepatan**: 6.000–15.000 RPM (hingga 21.000 × g)
- **Penggunaan**: Molekular biologi, PCR prep, presipitasi protein, spin column DNA/RNA
- **Ukuran**: Compact, bisa di meja lab biasa
- **Cocok untuk**: Lab biologi molekuler, farmasi riset, universitas

### 2. General Purpose Centrifuge

- **Kapasitas**: Tabung 15 mL, 50 mL, dan berbagai ukuran
- **Kecepatan**: 3.000–6.000 RPM (hingga 5.000 × g)
- **Penggunaan**: Pemisahan sel darah, pengendapan bakteri, separasi urin
- **Cocok untuk**: Laboratorium klinik, rumah sakit, QC umum

### 3. Refrigerated Centrifuge

- **Kapasitas**: Bervariasi (tabung kecil hingga 500 mL)
- **Kecepatan**: Hingga 25.000 RPM
- **Suhu**: Bisa diatur dari -20°C hingga +40°C
- **Penggunaan**: Sampel yang sensitif suhu — enzim, protein, sel hidup, plasmid
- **Cocok untuk**: Lab biokimia, farmasi, riset sel

### 4. High-Speed & Ultracentrifuge

- **Kecepatan**: 25.000–100.000+ RPM
- **Gaya sentrifugal**: Hingga 800.000 × g
- **Penggunaan**: Fraksinasi subseluler, pemurnian virus, isolasi lipoprotein
- **Cocok untuk**: Lembaga riset lanjutan, BRIN, universitas dengan program biokimia

---

## RPM vs RCF: Perbedaan yang Wajib Dipahami

Ini adalah sumber kebingungan paling umum di antara pengguna centrifuge.

| Satuan | Singkatan | Arti |
|---|---|---|
| **RPM** | Revolutions Per Minute | Kecepatan rotasi rotor (putaran per menit) |
| **RCF / × g** | Relative Centrifugal Force | Gaya sentrifugal aktual yang bekerja pada sampel |

**Mengapa penting?** Protokol laboratorium (metode standar, paper ilmiah) umumnya mencantumkan kecepatan dalam **× g (RCF)**, bukan RPM — karena gaya yang efektif bergantung pada jari-jari rotor, bukan hanya kecepatan putar.

### Rumus Konversi RPM ↔ RCF

    RCF (x g) = 1,118 x 10⁻⁵ x r x n²

Di mana:
- **r** = radius rotor (dalam mm), dari pusat rotor ke dasar tabung
- **n** = kecepatan dalam RPM

**Contoh**: Rotor dengan radius 75 mm pada 5.000 RPM
→ RCF = 1,118 × 10⁻⁵ × 75 × 5.000² = **2.093 × g**

> **Tips praktis**: Hampir semua centrifuge modern memiliki fitur konversi RPM ↔ RCF otomatis di panel kontrolnya. Masukkan nilai × g dari protokol, dan mesin akan menyesuaikan RPM berdasarkan rotor yang terpasang.

---

## 4 Faktor Kunci Memilih Centrifuge

### 1. Kecepatan Maksimum (RPM/RCF)

Sesuaikan dengan protokol yang paling sering Anda gunakan:
- **Pemisahan sel darah**: 1.500–2.000 × g cukup
- **Bakteri**: 6.000–10.000 × g
- **Spin column DNA/RNA**: 10.000–14.000 × g
- **Presipitasi protein**: 15.000–21.000 × g

### 2. Kapasitas dan Kompatibilitas Rotor

Periksa ukuran tabung yang didukung:
- Tabung 1,5/2 mL (microcentrifuge)
- Tabung konkal 15 mL dan 50 mL (Falcon tube)
- Botol besar 250–500 mL (refrigerated centrifuge)

Banyak centrifuge menawarkan rotor yang bisa diganti (interchangeable rotor) — pertimbangkan fleksibilitas ini untuk lab yang mengerjakan berbagai jenis sampel.

### 3. Kontrol Suhu

Jika Anda bekerja dengan:
- Enzim, kultur sel, atau sampel protein → **pilih refrigerated centrifuge**
- Sampel rutin (urin, sedimen, pemisahan serum) → **centrifuge suhu ruang sudah cukup**

### 4. Tingkat Kebisingan dan Keselamatan

Centrifuge modern dilengkapi:
- **Imbalance detection**: Otomatis berhenti jika rotor tidak seimbang (mencegah rotor lepas)
- **Lid lock**: Penutup tidak bisa dibuka saat rotor masih berputar
- **Motor brushless**: Lebih senyap, tidak menghasilkan percikan, tahan lebih lama

---

## Panduan Keselamatan yang Wajib Diikuti

- **Selalu imbangkan tabung**: Tempatkan tabung secara simetris dengan bobot yang setara. Tabung tunggal yang tidak diseimbangkan dapat merusak rotor dan bantalan.
- **Jangan buka tutup saat berputar**: Meskipun ada lock, kebiasaan ini berbahaya.
- **Periksa rotor sebelum digunakan**: Rotor yang retak atau berkarat harus segera diganti — rotor yang pecah saat berputar cepat adalah insiden serius.
- **Gunakan tabung yang sesuai**: Jangan gunakan tabung plastik biasa pada kecepatan tinggi — gunakan tabung khusus centrifuge yang tertera batas kecepatannya.
- **Centrifuge material infeksius**: Gunakan rotor berpenutup (sealed rotor) atau biosafety centrifuge cup untuk sampel berpotensi aerosol.

---

## Rekomendasi per Tipe Laboratorium

### Laboratorium Klinik & Rumah Sakit

General purpose centrifuge dengan kapasitas tabung 15–50 mL, kecepatan 3.000–5.000 RPM. Prioritaskan kemudahan operasi, timer otomatis, dan kemudahan pembersihan.

### Laboratorium Biologi Molekuler & Universitas

Paket ideal: **microcentrifuge** (untuk spin column dan reaksi PCR) + **refrigerated centrifuge** (untuk pemurnian protein dan sampel sensitif suhu).

### Laboratorium QC Industri (Makanan, Farmasi, Kimia)

General purpose centrifuge dengan berbagai adaptor rotor untuk tabung yang digunakan dalam metode pengujian standar (SNI, AOAC).

### Laboratorium Lingkungan & PDAM

Centrifuge untuk pengendapan padatan tersuspensi dari sampel air — general purpose dengan kapasitas botol besar, mudah dibersihkan.

---

## Kesalahan Umum yang Wajib Dihindari

- **Menggunakan RPM dari protokol tanpa konversi**: Protokol mencantumkan × g — harus dikonversi ke RPM sesuai rotor yang dipakai.
- **Centrifuge dengan tabung tidak penuh**: Tabung yang setengah isi mudah kolaps pada kecepatan tinggi — isi dengan cairan yang setara jika volume sampel kurang.
- **Mengabaikan rotor yang berkarat**: Korosi melemahkan struktur rotor secara signifikan.
- **Menempatkan centrifuge di atas permukaan tidak stabil**: Getaran dapat mempercepat keausan bantalan dan meningkatkan risiko imbalance.

---

## Kesimpulan

Centrifuge yang tepat ditentukan oleh tiga hal utama: **kecepatan yang dibutuhkan protokol, ukuran/jenis sampel, dan sensitivitas sampel terhadap suhu**. Jangan membeli centrifuge berdasarkan harga saja — centrifuge yang salah bisa merusak sampel berharga atau memberikan hasil yang tidak reproducible.

**Tim AndisLab** siap membantu Anda memilih centrifuge yang sesuai kebutuhan laboratorium — dari microcentrifuge hingga refrigerated high-speed, tersedia untuk pengadaan B2B, e-Katalog pemerintah, dan proyek swasta di seluruh Indonesia.`;

async function main() {
  console.log("Seeding artikel centrifuge laboratorium (Agustus 2026)...");

  const article = await prisma.article.upsert({
    where: { slug: "panduan-centrifuge-laboratorium" },
    update: {
      title: "Centrifuge Laboratorium: Jenis, RPM vs RCF & Panduan Memilih 2026",
      excerpt:
        "Panduan lengkap memilih centrifuge laboratorium — perbedaan microcentrifuge, refrigerated centrifuge, dan high-speed centrifuge, cara menghitung RCF dari RPM, dan rekomendasi per tipe laboratorium.",
      content: articleContent,
      image: "/images/articles/centrifuge-laboratorium.png",
      category: "panduan-alat",
      published: true,
      authorName: "Tim Redaksi AndisLab",
    },
    create: {
      slug: "panduan-centrifuge-laboratorium",
      title: "Centrifuge Laboratorium: Jenis, RPM vs RCF & Panduan Memilih 2026",
      excerpt:
        "Panduan lengkap memilih centrifuge laboratorium — perbedaan microcentrifuge, refrigerated centrifuge, dan high-speed centrifuge, cara menghitung RCF dari RPM, dan rekomendasi per tipe laboratorium.",
      content: articleContent,
      image: "/images/articles/centrifuge-laboratorium.png",
      category: "panduan-alat",
      published: true,
      authorName: "Tim Redaksi AndisLab",
    },
  });

  console.log("Artikel berhasil dibuat:", article.title);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
