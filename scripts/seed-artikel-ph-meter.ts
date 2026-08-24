import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const articleContent = `pH meter adalah instrumen pengukur keasaman (tingkat pH) larutan yang paling banyak digunakan di laboratorium, PDAM, industri makanan & minuman, dan akuakultur. Namun banyak pengguna yang mengoperasikan pH meter tanpa prosedur kalibrasi yang benar — menghasilkan data yang tidak valid dan keputusan yang salah.

Artikel ini membahas cara memilih pH meter yang tepat, prosedur kalibrasi yang benar, dan tips merawat elektroda agar tahan lama.

## Jenis pH Meter: Portable vs Bench

| Fitur | pH Meter Portable | pH Meter Bench |
|---|---|---|
| **Bentuk** | Handheld, ringan | Desktop, lebih besar |
| **Akurasi** | ±0,1 pH (standar), ±0,01 pH (advanced) | ±0,001 pH – ±0,01 pH |
| **Penggunaan** | Lapangan, sampling on-site | Laboratorium tetap |
| **Harga** | Lebih terjangkau | Lebih mahal |
| **Contoh merek** | Milwaukee MW 102, MW 101 | Milwaukee MA 5740, Lovibond SD 50 |

> **Kapan pilih portable?** Untuk sampling lapangan (PDAM, tambak, IPAL), monitoring kolam, atau pengujian rutin dengan banyak titik sampling.
>
> **Kapan pilih bench?** Untuk pengujian presisi di laboratorium terakreditasi, QC farmasi, atau riset akademik yang membutuhkan akurasi tinggi.

---

## 3 Komponen Utama yang Wajib Dipahami

### 1. Elektroda pH (pH Electrode)

Elektroda adalah komponen paling kritis sekaligus paling sering rusak. Elektroda terdiri dari:

- **Membran kaca**: Sensitif terhadap ion H⁺ — jangan disentuh tangan, dibersihkan kasar, atau dibiarkan kering
- **Larutan referensi (KCl)**: Mengisi tabung elektroda — perlu diisi ulang secara berkala pada elektroda refillable
- **Junction**: Lubang kecil di bawah elektroda — wajib bersih agar tidak tersumbat

### 2. ATC (Automatic Temperature Compensation)

pH larutan berubah seiring suhu. ATC memastikan pembacaan terkoreksi secara otomatis. Tanpa ATC, pengukuran di lapangan (suhu bervariasi) bisa meleset hingga 0,2 pH per 10°C.

### 3. Buffer Solution Kalibrasi

Buffer adalah larutan referensi dengan pH yang sudah diketahui secara pasti. Yang paling umum:
- **pH 4,00** (larutan merah/oranye)
- **pH 7,00** (larutan kuning)
- **pH 10,01** (larutan biru)

Gunakan buffer dari merek yang sama dengan pH meter Anda untuk meminimalkan error antar-merek.

---

## Cara Kalibrasi pH Meter yang Benar

Kalibrasi adalah fondasi data pH yang valid. Jangan lewati langkah ini — pengukuran tanpa kalibrasi sama dengan tebak-tebakan.

### Prosedur Kalibrasi 2 Titik (Standar Umum)

1. **Nyalakan pH meter** minimal 5 menit sebelum kalibrasi agar stabil.
2. **Bilas elektroda** dengan akuades, lap dengan tisu lembut (jangan digosok memutar).
3. **Celupkan ke buffer pH 7,00.** Tunggu pembacaan stabil (15–30 detik), lalu tekan tombol kalibrasi/CAL.
4. **Bilas lagi dengan akuades**, celupkan ke buffer pH 4,00 (untuk sampel asam) atau pH 10,01 (untuk sampel basa).
5. **Konfirmasi nilai**, catat slope. Slope yang baik: **95%–105%**. Di luar rentang ini — elektroda sudah aus, perlu dicuci atau diganti.
6. **Simpan kalibrasi**, pH meter siap digunakan.

### Frekuensi Kalibrasi yang Disarankan

| Kondisi | Frekuensi |
|---|---|
| Penggunaan lapangan (PDAM, tambak) | Setiap hari sebelum sampling |
| Laboratorium QC industri | Setiap sesi pengujian (minimal 1×/hari) |
| Lab akreditasi ISO 17025 | Setiap hari + verifikasi dengan buffer kontrol |
| Penggunaan sesekali | Setiap kali akan digunakan |

---

## Tips Merawat Elektroda agar Tahan Lama

Elektroda yang dirawat dengan benar bisa bertahan 1–3 tahun. Yang tidak dirawat bisa rusak dalam 3 bulan.

- **Jangan biarkan kering**: Simpan elektroda dalam larutan penyimpan (storage solution KCl 3M) atau minimal buffer pH 7. Elektroda yang kering membran kacanya akan retak dan tidak bisa dikalibrasi dengan benar.
- **Bilas setelah penggunaan**: Gunakan akuades, bukan air keran (mengandung klorin yang merusak membran).
- **Hindari sampel berminyak dan protein tinggi**: Endapan protein menyumbat junction — cuci dengan larutan enzim atau pepsin encer jika terkontaminasi.
- **Jangan celup terlalu dalam**: Elektroda handheld biasanya hanya perlu dicelup 2–3 cm.
- **Cek larutan KCl**: Elektroda refillable perlu diisi ulang KCl jika kristal terlihat atau level larutan rendah.

---

## Rekomendasi pH Meter per Aplikasi

### PDAM & Pengolahan Air

Pilih pH meter **portable dengan ATC** dan **IP65 tahan air**. Butuh respons cepat di lapangan, bukan akurasi ultra-presisi. **Milwaukee MW 102** atau **MW 101** adalah pilihan populer untuk PDAM di Indonesia.

### Tambak Udang & Akuakultur

Prioritaskan **ketahanan terhadap air garam** dan kemudahan kalibrasi. pH air kolam berubah cepat sepanjang hari — gunakan pH meter dengan memori data atau logger.

### Laboratorium Farmasi & QC Industri

Pilih **pH meter bench** dengan akurasi ±0,01 pH, dilengkapi printer atau output data ke PC. Elektroda kombinasi dengan junction ganda (double junction) lebih tahan terhadap sampel yang mengandung protein atau pelarut organik.

### Laboratorium Riset & Universitas

pH meter bench dengan **ATC otomatis, kalibrasi 3 titik, dan koneksi USB/RS-232** untuk transfer data. Lovibond SD 50 atau Milwaukee MA seri bench memenuhi kebutuhan ini.

---

## Kesalahan Umum yang Wajib Dihindari

- **Menyimpan elektroda tanpa larutan**: Menyebabkan membran kering dan tidak bisa dikalibrasi ulang.
- **Kalibrasi dengan buffer kadaluarsa**: Buffer yang sudah terkontaminasi atau melewati tanggal kadaluarsa memberikan nilai kalibrasi yang salah.
- **Mengukur langsung setelah celup**: Tunggu 15–30 detik hingga pembacaan stabil sebelum mencatat hasil.
- **Tidak membersihkan elektroda antar sampel**: Residu sampel sebelumnya mengkontaminasi pembacaan berikutnya.
- **Menggunakan pH meter tanpa ATC di lapangan**: Suhu lapangan bisa 10–20°C lebih tinggi dari kondisi laboratorium — tanpa ATC, error bisa signifikan.

---

## Kesimpulan

pH meter yang tepat dan terkalibrasi dengan benar adalah investasi untuk validitas data dan keamanan proses. Untuk aplikasi lapangan pilih seri portable Milwaukee; untuk laboratorium tetap pilih bench meter dengan akurasi lebih tinggi.

**Tim AndisLab** siap membantu Anda memilih pH meter, menyediakan buffer solution, dan elektroda pengganti untuk Milwaukee dan Lovibond — tersedia untuk pengadaan B2B, e-Katalog pemerintah, dan proyek seluruh Indonesia.`;

async function main() {
  console.log("Seeding artikel pH meter laboratorium (Agustus 2026)...");

  const article = await prisma.article.upsert({
    where: { slug: "panduan-ph-meter-laboratorium" },
    update: {
      title: "pH Meter Laboratorium: Panduan Memilih, Kalibrasi & Harga 2026",
      excerpt:
        "Panduan memilih pH meter laboratorium — perbedaan portable vs bench, cara kalibrasi buffer 3 titik, perawatan elektroda, dan rekomendasi merek Milwaukee & Lovibond untuk PDAM, farmasi, dan riset.",
      content: articleContent,
      image: "/images/articles/ph-meter-milwaukee.png",
      category: "panduan-alat",
      published: true,
      authorName: "Tim Redaksi AndisLab",
    },
    create: {
      slug: "panduan-ph-meter-laboratorium",
      title: "pH Meter Laboratorium: Panduan Memilih, Kalibrasi & Harga 2026",
      excerpt:
        "Panduan memilih pH meter laboratorium — perbedaan portable vs bench, cara kalibrasi buffer 3 titik, perawatan elektroda, dan rekomendasi merek Milwaukee & Lovibond untuk PDAM, farmasi, dan riset.",
      content: articleContent,
      image: "/images/articles/ph-meter-milwaukee.png",
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
