import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const articles = [
  {
    slug: "panduan-memilih-timbangan-analitis-presisi-2026",
    title: "Panduan Memilih Timbangan Analitis Presisi untuk Laboratorium Industri & Farmasi (2026)",
    category: "panduan-alat",
    excerpt: "Panduan praktis memilih timbangan analitis presisi tinggi, memahami daya baca (readability), fitur internal calibration, dan kepatuhan standar ISO/GLP.",
    image: "/images/articles/smart-lab-2026.jpg",
    authorName: "Tim Redaksi AndisLab",
    content: `![Panduan Timbangan Analitis Presisi](/images/articles/smart-lab-2026.jpg)

Laboratorium industri, farmasi, dan lembaga penelitian sangat mengandalkan akurasi penimbangan sampel. Kesalahan kecil dalam pengukuran massa dapat berdampak besar pada formulasi kimia, mutu produk, dan validitas hasil pengujian.

---

## 1. Memahami Daya Baca (*Readability*) & Kapasitas Timbangan

Timbangan analitis umumnya memiliki daya baca mulai dari **0.1 mg (0.0001 g)** hingga **0.01 mg (microbalance)**.
- **Timbangan Analitis (0.1 mg):** Standar utama untuk persiapan sampel preparatif, pembuatan larutan standar, dan kontrol kualitas farmasi.
- **Timbangan Presisi (1 mg - 10 mg):** Cocok untuk penimbangan bahan baku skala besar, penimbangan umum, dan industri pengolahan makanan.

---

## 2. Fitur Kalibrasi Internal (*Internal Calibration / ISO-CAL*)

Dalam lingkungan teregulasi (GLP/GMP/ISO 17025), timbangan yang dilengkapi kalibrasi internal otomatis (*Internal Motorized Calibration*) memberikan keuntungan besar:
- Melakukan kalibrasi ulang secara otomatis saat terjadi perubahan suhu ruangan.
- Meminimalkan ketergantungan pada anak timbang eksternal yang rentan aus atau terkontaminasi.

---

## 3. Rekomendasi Brand Timbangan Presisi Terbaik

**[Aczet (India/Germany Technology)](/aczet):** Dikenal dengan ketahanan sensor elektromagnetik tinggi, waktu respon cepat, dan harga yang sangat kompetitif untuk pasar Indonesia.

Untuk informasi ketersediaan unit ready stock dan penawaran resmi, Anda dapat langsung melakukan [Permintaan Penawaran Harga (Inquiry)](/inquiry) melalui Toko Andi S.`,
  },
  {
    slug: "daftar-alat-laboratorium-wajib-standar-sekolah-dan-perguruan-tinggi",
    title: "Daftar Alat Laboratorium Wajib Standar Sekolah & Perguruan Tinggi",
    category: "edukasi-lab",
    excerpt: "Panduan pengadaan peralatan laboratorium dasar untuk SMA, SMK, dan universitas sesuai standar kurikulum dan keselamatan kerja.",
    image: "/images/articles/water-bath-lab.jpg",
    authorName: "Tim Spesialis Lab Pendidikan",
    content: `![Alat Lab Pendidikan](/images/articles/water-bath-lab.jpg)

Pengadaan instrumen laboratorium pendidikan memerlukan perhatian khusus pada aspek keandalan instrumen, kemudahan operasional bagi siswa/mahasiswa, serta efisiensi anggaran pengadaan (SPJ/Pemerintah).

---

## Instrumen Laboratorium Esensial

### 1. Water Bath & Incubation Chamber
Digunakan pada praktikum mikrobiologi dan biokimia untuk inkubasi kultur sel serta pemanasan sampel dengan suhu konstan. Brand unggulan seperti **[Daihan Labtech](/daihan-labtech)** menyediakan kontrol digital PID yang sangat stabil.

### 2. Spectrophotometer & Meter Pengukur Kualitas Air
Untuk laboratorium kimia dan lingkungan, instrumen dari **[Lovibond](/lovibond)** dan **[Milwaukee Instruments](/milwaukee)** menjadi standar utama pengukuran pH, Conductivity, DO, dan Turbiditas.

### 3. Sterilisator & Ovens
Peralatan pemanas dari **[Yamato Scientific](/yamato)** menawarkan standar keselamatan tinggi untuk sterilisasi glassware dan pengeringan bahan uji.

---

## Kemudahan Pengadaan di Toko Andi S

Toko Andi S memfasilitasi pengadaan instrumen lab pendidikan dengan dokumen legalitas lengkap, dukungan garansi resmi, serta harga transparan hingga 48% di bawah harga katalog standar. Hubungi sales kami melalui [Halaman Solusi Pendidikan](/solusi/pendidikan) atau ajukan [Inquiry Online](/inquiry).`,
  },
  {
    slug: "perbandingan-brand-alat-lab-aczet-daihan-lovibond-milwaukee-yamato",
    title: "Perbandingan Brand Alat Lab Terkemuka: Aczet, Daihan, Lovibond, Milwaukee, & Yamato",
    category: "analisis-produk",
    excerpt: "Ulasan perbandingan spesialisasi brand alat lab internasional untuk membantu menentukan instrumen yang paling pas sesuai budget dan aplikasi.",
    image: "/images/articles/smart-lab-2026.jpg",
    authorName: "Tim Konsultan Lab AndisLab",
    content: `![Perbandingan Brand Alat Lab](/images/articles/smart-lab-2026.jpg)

Memilih instrumen laboratorium sering kali membingungkan karena banyaknya pilihan brand di pasaran. Berikut adalah ringkasan keunggulan spesifik dari masing-masing merek terkemuka yang didistribusikan oleh **Toko Andi S**:

---

## Ringkasan Spesialisasi Brand

1. **[Aczet](/aczet):** Spesialis Timbangan Analitis, Microbalance, Moisture Analyzer, dan Timbangan Industri Presisi.
2. **[Daihan Labtech](/daihan-labtech):** Spesialis General Heating & Cooling Equipment (Water Bath, Oven, Incubator, Autoclave, Shaker).
3. **[Lovibond](/lovibond):** Spesialis Analisis Air, Colorimetry, Spectrophotometry, dan Water Testing Kit.
4. **[Milwaukee](/milwaukee):** Spesialis Digital Electrodes (pH Meter, EC/TDS Meter, Refractometer) yang simpel dan ekonomis.
5. **[Yamato](/yamato):** Spesialis Premium Laboratory Equipment buatan Jepang dengan keandalan jangka panjang.

---

## Konsultasi & Penawaran Harga Cepat

Tim teknis **Toko Andi S** siap membantu merekomendasikan unit yang cocok sesuai kebutuhan metode pengujian Anda. Ajukan [Penawaran Harga Resmi](/inquiry) dalam 1 hari kerja.`,
  }
];

async function main() {
  console.log("Seeding weekly articles...");
  for (const art of articles) {
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: art,
      create: art,
    });
    console.log(`- Upserted article: ${art.title}`);
  }
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
