import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const sourceImagePath = "C:\\Users\\Ancimmm\\.gemini\\antigravity-ide\\brain\\baf5f1e5-5400-44f5-ade5-6cc1da47cb1c\\water_bath_lab_1788144538801.jpg";
const targetImagePath = path.join(process.cwd(), "public", "images", "articles", "water-bath-laboratorium.jpg");

if (fs.existsSync(sourceImagePath)) {
  fs.copyFileSync(sourceImagePath, targetImagePath);
  console.log(`[OK] Image copied to: ${targetImagePath}`);
} else {
  console.warn(`[WARN] Source image not found at ${sourceImagePath}`);
}

const articleContent = `Dalam rutinitas laboratorium pengujian kimia, biologi, maupun Quality Control (QC) industri, proses pemanasan sampel memerlukan kestabilan dan kehati-hatian tinggi. Banyak sampel biologi—seperti enzim, serum, kultur sel, serta reagen tertentu—sangat rentan terhadap fluktuasi panas berlebih (*hot spot*). Jika menggunakan pemanas langsung seperti *hotplate*, risiko denaturasi protein atau dekomposisi bahan aktif sangat besar.

Di sinilah **Water Bath Laboratorium** (penangas air laboratorium) memegang peranan krusial. Alat ini memanfaatkan media air untuk mendistribusikan panas secara merata dan konstan pada rentang suhu terkontrol.

Bagi Anda yang sedang merencanakan pengadaan atau peremajaan instrumen laboratorium, simak panduan komprehensif berikut mengenai jenis-jenis water bath, faktor pemilihan, tips perawatan, serta rekomendasi pengadaannya.

---

## Mengapa Water Bath Menjadi Instrumen Wajib di Laboratorium?

Water bath bekerja dengan prinsip pemanasan tidak langsung (*indirect heating*). Elemen pemanas (*heating element*) yang terletak di dasar atau dinding wadah memanaskan cairan (umumnya air deionisasi atau aquadest), yang kemudian menyalurkan panas ke bejana sampel (tabung reaksi, labu Erlenmeyer, atau botol kultur).

### Keuntungan Utama Water Bath:
1. **Distribusi Suhu Sangat Homogen:** Menghilangkan gradien suhu lokal yang tajam sehingga sampel tidak mudah rusak.
2. **Aman untuk Sampel yang Mudah Terbakar:** Mengurangi risiko percikan api saat memanaskan senyawa kimia yang memerlukan temperatur di bawah titik didih air.
3. **Pengujian Replikasi Massal:** Memungkinkan pemanasan puluhan tabung reaksi secara simultan dengan kondisi termal yang identik.

---

## 4 Jenis Water Bath Laboratorium Berdasarkan Fungsinya

Sebelum membeli, penting untuk memahami tipe water bath yang sesuai dengan alur kerja laboratorium Anda:

| Tipe Water Bath | Karakteristik Utama | Aplikasi Terbaik |
|---|---|---|
| **Standard (General Purpose / Non-Circulating)** | Mengandalkan konveksi alami air, kapasitas 5L hingga 30L | Inkubasi rutin, reaktivasi reagen, pencairan sampel (*thawing*), pengujian mikrobiologi umum |
| **Circulating Water Bath** | Dilengkapi pompa sirkulasi internal aktif untuk keseragaman suhu presisi tinggi (±0.05°C) | Uji viskositas, pengujian enzim sensitif, serologi, refraktometri, dan kalibrasi termometer |
| **Shaking Water Bath** | Menggabungkan pemanasan air dengan goyangan (*shaking motion*) orbital atau linear | Kultur bakteri/mikroba, ekstraksi biomolekul, pelarutan senyawa sukar larut, fermentasi |
| **Refrigerated / Heating Circulator (Bath Dingin-Panas)** | Memiliki kompresor pendingin terintegrasi dengan rentang suhu luas (-20°C s.d. +150°C) | Pengujian stabilitas termal, bioproses suhu rendah, pendinginan reaktor jaket lab |

---

## 5 Faktor Kunci Memilih Water Bath yang Tepat

### 1. Rentang Suhu & Presisi Kontrol PID
Sebagian besar aplikasi water bath standar beroperasi pada rentang **Suhu Ruang +5°C hingga 99°C** dengan resolusi 0,1°C. Pastikan alat dilengkapi kontrol mikroprosesor **Digital PID** yang mampu melakukan kompensasi suhu secara cepat ketika tutup dibuka atau sampel baru dimasukkan.

### 2. Material Konstruksi Ruang Dalam (*Chamber*)
Pilihlah water bath dengan tangki berbahan **Stainless Steel SUS304 atau SUS316 seamless** (tanpa sambungan las bersudut tajam). Tangki *seamless pressed* mencegah akumulasi kerak dan kebocoran dalam jangka panjang serta mempermudah dekontaminasi.

### 3. Sistem Keamanan & Proteksi Dry-Run
Kekeringan air saat alat sedang beroperasi (*dry running*) dapat membakar elemen pemanas dan memicu korsleting. Water bath berkualitas wajib memiliki:
- **Proteksi Over-Temperature**: Memutus daya secara otomatis jika suhu melebihi batas batas aman.
- **Sensor Level Air (Low Water Level Alarm)**: Memberikan peringatan bunyi atau mematikan pemanas saat air menipis.

### 4. Jenis Penutup (Lid) & Rak Tabung
- **Gabled Lid (Tutup Berbentuk Pelana/Segitiga):** Mencegah tetesan uap air kondensasi jatuh kembali langsung ke atas mulut tabung atau media sampel.
- **Concentric Ring Lid:** Ideal jika Anda ingin meletakkan wadah dengan berbagai diameter bukaan (seperti cawan penguap atau Erlenmeyer).
- **Test Tube Racks:** Pastikan ketersediaan rak tabung stainless steel dengan berbagai diameter (13mm, 16mm, 20mm, 25mm).

### 5. Fitur Pengurasan Air (Drain Valve)
Untuk tangki bervolume lebih dari 10 liter, fitur saluran kuras (*drain port/valve*) dengan selang pembuangan sangat memudahkan penggantian air harian tanpa perlu mengangkat alat yang berat.

---

## Aplikasi Water Bath di Berbagai Sektor Industri

- 🏥 **Laboratorium Medis & Rumah Sakit:** Pemanasan kantong darah (*blood warming*), uji koagulasi, aglutinasi serologi, dan reaksi aglutinasi antibodi.
- 💊 **Industri Farmasi & Kosmetik:** Uji disolusi tablet, formulasi emulsi krim, dan inkubasi uji mikrobiologi sediaan steril.
- 🍔 **Industri Makanan & Minuman (F&B):** Pengujian angka lempeng total (ALT), inaktivasi enzim pada sampel jus/susu, dan analisis kestabilan shelf-life.
- 🔬 **Universitas & Pusat Riset:** Ekstraksi DNA/RNA, digesti enzim restriksi, dan sintesis senyawa kimia basah.
- 🏭 **Laboratorium QC Lingkungan & PDAM:** Analisis BOD/COD pelengkap, pencernaan sampel air limbah, dan determinasi Total Coliform.

---

## Panduan Perawatan Agar Water Bath Awet & Tahan Puluhan Tahun

1. **Selalu Gunakan Air Deionisasi (DI Water) atau Aquadest:** Jangan pernah mengisi water bath dengan air keran (PAM/sumur). Kandungan mineral seperti kalsium dan magnesium akan membentuk kerak keras (*limescale*) yang melapisi elemen pemanas dan merusak akurasi sensor.
2. **Kuras dan Ganti Air Secara Rutin:** Ganti air minimal seminggu sekali (atau segera jika terdapat tumpahan reagen kimia).
3. **Bersihkan Menggunakan Deterjen Lembut:** Hindari penggunaan asam klorida pekat, pemutih berbasis klorin (*bleach*), atau kawat abrasif pada permukaan stainless steel.
4. **Lakukan Kalibrasi Suhu Berkala:** Kalibrasikan ketepatan pembacaan suhu minimal 1 kali per tahun menggunakan termometer standar terakreditasi ISO/IEC 17025.

---

## Kesimpulan & Pengadaan Water Bath di AndisLab

Memilih water bath yang handal dengan presisi suhu terjamin adalah investasi fundamental untuk menjaga reliabilitas data riset dan hasil QC harian pabrik Anda.

**AndisLab** menyediakan berbagai pilihan water bath, circulating bath, dan shaking bath dari merek-merek ternama dunia seperti **Daihan Labtech** dan mitra produsen terpercaya lainnya. Kami siap melayani:
- Penawaran harga resmi (Quotation / RFQ) dengan respon cepat.
- Dukungan Faktur Pajak (PPN) dan administrasi lengkap.
- Pengadaan melalui **e-Katalog LKPP / LPSE** untuk universitas, rumah sakit pemerintah, dan BUMN.
- Jaminan ketersediaan suku cadang (*spare part*), sertifikat kalibrasi, dan layanan purna jual profesional.

Konsultasikan spesifikasi water bath yang tepat untuk kebutuhan laboratorium Anda bersama tim ahli AndisLab sekarang juga!`;

async function main() {
  console.log("Seeding artikel Water Bath Laboratorium...");

  const article = await prisma.article.upsert({
    where: { slug: "panduan-memilih-water-bath-laboratorium" },
    update: {
      title: "Panduan Memilih Water Bath Laboratorium: Jenis, Presisi Suhu & Tips Perawatan 2026",
      excerpt: "Panduan lengkap memilih water bath laboratorium — perbedaan water bath sirkulasi vs non-sirkulasi, shaking bath, sistem kontrol PID, proteksi dry-run, hingga tips perawatan rutin dari tim AndisLab.",
      content: articleContent,
      image: "/images/articles/water-bath-laboratorium.jpg",
      category: "panduan-alat",
      published: true,
      authorName: "Tim Redaksi AndisLab",
    },
    create: {
      slug: "panduan-memilih-water-bath-laboratorium",
      title: "Panduan Memilih Water Bath Laboratorium: Jenis, Presisi Suhu & Tips Perawatan 2026",
      excerpt: "Panduan lengkap memilih water bath laboratorium — perbedaan water bath sirkulasi vs non-sirkulasi, shaking bath, sistem kontrol PID, proteksi dry-run, hingga tips perawatan rutin dari tim AndisLab.",
      content: articleContent,
      image: "/images/articles/water-bath-laboratorium.jpg",
      category: "panduan-alat",
      published: true,
      authorName: "Tim Redaksi AndisLab",
    },
  });

  console.log("Artikel berhasil dibuat/diupdate:", article.title);
}

main()
  .catch((e) => {
    console.error("Gagal seeding artikel:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
