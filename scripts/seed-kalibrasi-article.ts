/**
 * Seed script: Artikel baru minggu ini
 * Topik: Kalibrasi & Perawatan Alat Laboratorium
 * Jalankan: npx tsx scripts/seed-kalibrasi-article.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ARTICLE = {
  slug: "panduan-kalibrasi-perawatan-alat-laboratorium",
  title: "5 Kesalahan Fatal dalam Perawatan Alat Laboratorium yang Bikin Rugi Jutaan Rupiah",
  excerpt:
    "Jangan biarkan investasi miliaran rupiah rusak karena kelalaian kecil. Pelajari 5 kesalahan umum perawatan alat lab—autoclave, spektrofotometer, centrifuge—dan cara mencegahnya agar data Anda tetap valid.",
  image: "/images/articles/kalibrasi-perawatan-alat-lab.jpg",
  category: "edukasi-lab",
  published: true,
  content: `Investasi untuk pengadaan alat laboratorium—mulai dari *Biosafety Cabinet*, *Autoclave*, hingga *Spektrofotometer*—bukanlah hal yang murah. Angkanya bisa mencapai ratusan juta hingga miliaran rupiah. Sayangnya, banyak instansi, universitas, maupun industri manufaktur yang harus mengeluarkan biaya perbaikan sangat besar hanya karena kelalaian kecil dalam perawatan sehari-hari.

Untuk membantu Anda menjaga umur pakai instrumen laboratorium, tim **AndisLab** telah merangkum 5 kesalahan paling umum yang sering terjadi di lapangan dan bagaimana cara mencegahnya.

## 1. Mengabaikan Jadwal Kalibrasi Rutin

Banyak pengelola laboratorium beranggapan bahwa selama alat masih menyala, berarti alat tersebut berfungsi normal. Padahal, instrumen presisi seperti *micropipette*, timbangan analitik, dan *pH meter* dapat mengalami pergeseran akurasi (*drift*) seiring waktu.

- **Dampak:** Data analitik menjadi tidak valid, berpotensi merusak hasil riset atau kualitas produk (*Quality Control* gagal).
- **Solusi:** Buatlah jadwal kalibrasi tahunan yang ketat dan gunakan alat ukur standar yang telah tersertifikasi (KAN/ISO). Beberapa alat, seperti timbangan analitik, bahkan direkomendasikan untuk dikalibrasi setiap 6 bulan sekali pada lingkungan lab yang intensitas penggunaannya tinggi.

## 2. Menggunakan Bahan Pembersih yang Tidak Sesuai

Membersihkan alat lab tidak bisa disamakan dengan membersihkan perabotan biasa. Penggunaan detergen yang terlalu keras, atau pembersih berbasis klorin pada permukaan *stainless steel* (seperti bagian dalam *water bath* atau *autoclave*), bisa memicu reaksi korosi dan karat.

- **Dampak:** Karat yang menumpuk akan merusak sensor, menyumbat saluran pembuangan, dan mengontaminasi sampel.
- **Solusi:** Selalu baca manual instruksi (*User Manual*). Gunakan cairan pembersih khusus instrumen laboratorium atau etanol 70% sesuai rekomendasi pabrik.

## 3. "Overload" dan Kesalahan Operasional Sederhana

Pernahkah Anda melihat *centrifuge* yang bergetar hebat saat dinyalakan? Hal ini biasanya terjadi karena operator tidak menyeimbangkan beban (*balancing*) sampel dengan benar. Contoh lain adalah menjejalkan terlalu banyak media ke dalam *autoclave* sehingga sirkulasi uap panas tidak maksimal.

- **Dampak:** Kerusakan motor penggerak pada *centrifuge*, atau kegagalan sterilisasi pada *autoclave* yang bisa memicu kontaminasi biohazard.
- **Solusi:** Pastikan semua laboran atau asisten peneliti mendapatkan *training* kelayakan sebelum mengoperasikan alat. Cetak SOP singkat dan tempelkan di dekat alat terkait.

## 4. Sistem Kelistrikan dan Suhu Ruangan yang Buruk

Alat laboratorium modern sangat sensitif terhadap fluktuasi tegangan listrik dan suhu ekstrem. Menempatkan *spektrofotometer UV-Vis* atau *Ultra-Low Temperature (ULT) Freezer* di ruangan tanpa AC yang memadai—atau terpapar sinar matahari langsung—adalah resep untuk memperpendek umur kompresor dan sensor optik.

- **Dampak:** *Motherboard* alat terbakar karena lonjakan listrik, atau alat cepat rusak karena *overheating*.
- **Solusi:** Gunakan UPS (Uninterruptible Power Supply) atau *stabilizer* berkualitas untuk alat-alat krusial. Jaga suhu ruangan ideal (umumnya 20–25°C) dengan sirkulasi udara yang baik.

## 5. Tidak Ada Penanggung Jawab (*Person in Charge*) Spesifik

Kesalahan organisasional yang paling sering terjadi adalah prinsip *"milik bersama"*. Ketika sebuah instrumen mahal digunakan oleh banyak orang tanpa ada satu pun PIC yang memantau, tidak akan ada yang merasa bertanggung jawab untuk membersihkan, mengecek *log book*, atau melaporkan kerusakan minor sebelum menjadi mayor.

- **Dampak:** Kerusakan dibiarkan menumpuk. Alat tiba-tiba mati total di saat sedang sangat dibutuhkan.
- **Solusi:** Tunjuk satu laboran atau teknisi sebagai "Pemilik Alat" (PIC). Hanya PIC ini yang berhak memegang kunci log kalibrasi, mengatur jadwal *maintenance*, dan mengawasi penggunaannya.

---

### Kesimpulan

Perawatan alat laboratorium bukan hanya tentang menjaga kebersihan, tetapi tentang **melindungi investasi dan memastikan validitas data analitik Anda**. Dengan menerapkan *preventive maintenance* yang disiplin, Anda bisa menghemat ratusan juta rupiah dari biaya perbaikan tak terduga.

Sedang mencari peralatan laboratorium baru atau ingin berkonsultasi mengenai spesifikasi instrumen yang tahan banting untuk lab Anda?

**AndisLab** menyediakan berbagai instrumen laboratorium terkemuka dengan **Garansi Resmi, Instalasi Profesional, dan Dukungan Purna Jual Terbaik**. Hubungi tim *sales engineer* kami hari ini untuk mendapatkan penawaran (Quotation) e-Katalog atau B2B yang sesuai dengan anggaran instansi Anda!`,
};

async function main() {
  console.log(`Seeding article: "${ARTICLE.title}"...`);

  const result = await (prisma as any).article.upsert({
    where: { slug: ARTICLE.slug },
    update: {
      title: ARTICLE.title,
      excerpt: ARTICLE.excerpt,
      image: ARTICLE.image,
      category: ARTICLE.category,
      content: ARTICLE.content,
      published: ARTICLE.published,
    },
    create: {
      slug: ARTICLE.slug,
      title: ARTICLE.title,
      excerpt: ARTICLE.excerpt,
      image: ARTICLE.image,
      category: ARTICLE.category,
      content: ARTICLE.content,
      published: ARTICLE.published,
    },
  });

  console.log(`✅ Done: ${result.title}`);
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
