import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const articleContent = `Timbangan analitik adalah salah satu instrumen paling kritis di laboratorium — namun juga paling sering diabaikan perawatannya. Kesalahan pemilihan atau kalibrasi yang lalai dapat menghasilkan data yang tidak valid, gagal audit akreditasi, bahkan kerugian produksi di industri farmasi dan makanan.

Artikel ini membahas secara tuntas cara memilih timbangan analitik yang tepat, perbedaan teknis yang wajib dipahami, serta panduan kalibrasi sesuai standar yang berlaku di Indonesia.

## Apa Perbedaan Timbangan Analitik dan Timbangan Presisi?

Kedua jenis timbangan ini sering tertukar, padahal berbeda secara signifikan:

| Spesifikasi | Timbangan Analitik | Timbangan Presisi |
|---|---|---|
| **Readability** | 0,1 mg (0,0001 g) atau 0,01 mg | 1 mg – 10 mg (0,001 g – 0,01 g) |
| **Kapasitas maks.** | 120 g – 320 g | 200 g – 10 kg |
| **Draft shield** | Wajib (penutup kaca 3 sisi) | Opsional |
| **Penggunaan utama** | Farmasi, reagen, zat standar | QC industri, pengujian material |
| **Kalibrasi** | Internal otomatis atau eksternal berkala | Eksternal berkala |

> **Aturan praktis:** Jika Anda menimbang bahan kimia murni, standar kalibrasi, atau reagen dengan bobot di bawah 100 g — pilih timbangan analitik. Untuk aplikasi QC umum di atas 100 g, timbangan presisi sudah cukup.

---

## 4 Faktor Kunci Memilih Timbangan Analitik

### 1. Readability (Resolusi Pembacaan)

Readability adalah bobot terkecil yang dapat dibaca timbangan, bukan akurasi tertinggi. Dua level paling umum:

- **0,1 mg (d = 0,0001 g)**: Standar untuk mayoritas lab kimia, farmasi, dan universitas. Cukup untuk penimbangan reagen, zat standar, dan formulasi obat.
- **0,01 mg (d = 0,00001 g)**: Untuk analisis mikro — standar bahan referensi, penelitian isotop, dan pengujian residu. Harga dua kali lipat lebih mahal.

Jangan memilih readability lebih tinggi dari yang dibutuhkan — biaya perawatan dan sensitivitas terhadap gangguan lingkungan meningkat drastis.

### 2. Kapasitas Maksimum

Pilih kapasitas yang 20–30% di atas beban maksimum yang akan Anda timbang, termasuk berat wadah (beaker/krus):

- **120 g**: Untuk penimbangan murni tanpa wadah berat
- **220 g**: Paling umum — cukup untuk beaker glass 100 mL + sampel
- **320 g**: Untuk wadah lebih besar atau sistem penimbangan filtrasi

### 3. Kalibrasi Internal vs. Eksternal

- **Kalibrasi internal otomatis (FACT / AutoCal)**: Motor di dalam timbangan menurunkan anak timbang internal secara otomatis saat suhu berubah. Ideal untuk lingkungan lab dengan fluktuasi suhu. Lebih mahal namun mengurangi kebutuhan verifikasi harian.
- **Kalibrasi eksternal**: Memerlukan anak timbang E2/F1 bersertifikat BSNI untuk kalibrasi manual. Biaya awal lebih rendah namun memerlukan disiplin prosedur yang ketat.

Untuk lab yang sedang dalam proses akreditasi ISO/IEC 17025 atau SNI, timbangan dengan kalibrasi internal lebih mudah memenuhi persyaratan dokumentasi.

### 4. Draft Shield dan Stabilitas Lingkungan

Timbangan analitik sangat sensitif terhadap aliran udara, getaran, dan muatan elektrostatik. Perhatikan:

- **Draft shield 3 pintu**: Pintu atas + dua pintu samping memudahkan penempatan sampel tanpa mengganggu keseimbangan.
- **Anti-vibration**: Kaki leveling yang presisi dan internal dampener mengurangi gangguan dari meja lab yang tidak rata.
- **Anti-static**: Sampel bubuk halus atau bahan sintetis dapat termuati statik — timbangan dengan ionizer bawaan atau kemampuan grounding mencegah pembacaan yang tidak stabil.

---

## Panduan Kalibrasi Timbangan Analitik

Kalibrasi bukan sekadar formalitas — ini adalah syarat keabsahan data analitik Anda.

### Frekuensi yang Disarankan

| Kondisi | Frekuensi Kalibrasi |
|---|---|
| Lab akreditasi ISO 17025 | Setiap 6–12 bulan oleh laboratorium kalibrasi terakreditasi KAN |
| Lab QC industri farmasi | Setiap 6 bulan + verifikasi harian dengan anak timbang internal |
| Lab universitas / riset | Setiap 12 bulan + spot-check harian |
| Setelah dipindahkan | Selalu kalibrasi ulang sebelum digunakan |

### Prosedur Spot-Check Harian (Sederhana)

1. Nyalakan timbangan minimal **30 menit** sebelum digunakan — perlu waktu untuk stabil secara termal.
2. Lakukan **auto-zero** atau tara tanpa beban.
3. Letakkan anak timbang referensi F1/F2 yang sudah diketahui nilainya.
4. Catat pembacaan. Deviasi > 2× readability = timbangan perlu kalibrasi.
5. Dokumentasikan hasil di logbook kalibrasi.

---

## Rekomendasi Timbangan Analitik untuk Berbagai Kebutuhan

### Lab Farmasi & QC (GMP/CPOB)

Pilih timbangan dengan **kalibrasi internal otomatis**, kemampuan output data ke printer atau PC (RS-232/USB), dan antarmuka yang mendukung pencatatan data sesuai 21 CFR Part 11 (untuk lab ekspor). Model Aczet CY series memenuhi kebutuhan ini dengan harga yang kompetitif dibandingkan merek Eropa.

### Lab Kimia & Universitas

Model dengan kapasitas 220 g readability 0,1 mg sudah sangat memadai. Prioritaskan **draft shield yang mudah dibersihkan** dan **tampilan yang terbaca jelas** — karena frekuensi penggunaan oleh banyak pengguna berbeda.

### Lab Lingkungan & IPAL

Untuk penimbangan filter membran, endapan lumpur, dan residu padat, perhatikan kemudahan pembersihan ruang penimbangan dan daya tahan terhadap kelembapan tinggi.

---

## Kesalahan Umum yang Wajib Dihindari

- **Meletakkan timbangan di dekat jendela atau AC**: Aliran udara langsung merusak akurasi secara permanen.
- **Mengkalibrasi langsung setelah timbangan dipindahkan**: Tunggu minimal 30 menit setelah leveling.
- **Menggunakan anak timbang yang berkarat atau berdebu**: Kontaminasi permukaan anak timbang langsung mempengaruhi nilai kalibrasi.
- **Menimbang sampel basah di atas meja kaca**: Muatan elektrostatik dari wadah plastik atau sampel kering halus menyebabkan angka yang tidak stabil — gunakan grounding atau ionizer.

---

## Kesimpulan

Timbangan analitik yang tepat adalah investasi jangka panjang untuk validitas data laboratorium Anda. Prioritaskan **kesesuaian readability dengan aplikasi**, **kemampuan kalibrasi yang terdokumentasi**, dan **dukungan purna jual dari supplier** yang mampu menyediakan sertifikat kalibrasi KAN.

**Tim AndisLab** siap membantu Anda memilih timbangan analitik yang sesuai dengan kebutuhan dan anggaran — tersedia untuk pengadaan B2B, e-Katalog pemerintah, dan proyek swasta di seluruh Indonesia.`;

async function main() {
  console.log("Seeding artikel timbangan analitik (minggu 4 Agustus 2026)...");

  const article = await prisma.article.upsert({
    where: { slug: "panduan-timbangan-analitik-laboratorium" },
    update: {
      title: "Timbangan Analitik Laboratorium: Panduan Memilih, Kalibrasi & Harga 2026",
      excerpt:
        "Panduan memilih timbangan analitik laboratorium — dari perbedaan resolusi 0,1 mg vs 0,01 mg, cara kalibrasi berkala sesuai standar BSNI, hingga rekomendasi merek Aczet yang sudah dipercaya lab farmasi dan riset di Indonesia.",
      content: articleContent,
      image: "/images/articles/timbangan-analitik-aczet.png",
      category: "panduan-alat",
      published: true,
      authorName: "Tim Redaksi AndisLab",
    },
    create: {
      slug: "panduan-timbangan-analitik-laboratorium",
      title: "Timbangan Analitik Laboratorium: Panduan Memilih, Kalibrasi & Harga 2026",
      excerpt:
        "Panduan memilih timbangan analitik laboratorium — dari perbedaan resolusi 0,1 mg vs 0,01 mg, cara kalibrasi berkala sesuai standar BSNI, hingga rekomendasi merek Aczet yang sudah dipercaya lab farmasi dan riset di Indonesia.",
      content: articleContent,
      image: "/images/articles/timbangan-analitik-aczet.png",
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
