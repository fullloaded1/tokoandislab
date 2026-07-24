import { PrismaClient } from '@prisma/client';
import { waMeUrl } from '../src/lib/contact';

const prisma = new PrismaClient();

const slug = 'panduan-pengadaan-alat-laboratorium-e-katalog';

// Tombol WA penutup (wa.me/6285973211176 + prefill) — dirender sebagai link Markdown.
const WA_CTA =
  waMeUrl('Halo AndisLab, saya sedang menyusun pengadaan alat lab untuk instansi. Daftar kebutuhan: ');

// Catatan: judul (title) dirender sebagai H1 oleh template, jadi konten mulai dari paragraf pembuka & H2.
// SEO title pendek + FAQPage schema diatur di src/app/(public)/artikel/[slug]/page.tsx (ARTICLE_SEO & ARTICLE_FAQ).
const content = `
Pengadaan alat laboratorium untuk instansi pemerintah di Indonesia umumnya dilakukan melalui e-purchasing di Katalog Elektronik (e-Katalog/INAPROC) atau melalui penawaran langsung dari penyedia terdaftar. Panduan ini menjelaskan langkah-langkahnya dari sisi praktis — mulai dari menyusun spesifikasi, membandingkan harga antar penyedia, sampai memastikan dokumen SPJ lengkap — berdasarkan pengalaman AndisLab melayani pengadaan dinas lingkungan, PDAM, rumah sakit daerah, dan kampus.

## Dua Jalur Pengadaan yang Perlu Anda Tahu

**1. E-purchasing via Katalog Elektronik (INAPROC).** Instansi memilih produk yang sudah tayang di katalog, lalu bertransaksi langsung tanpa tender. Cepat secara administrasi, tapi harga tayang antar penyedia bisa berbeda jauh untuk model yang sama — membandingkan beberapa penyedia sebelum klik beli adalah langkah yang paling sering dilewatkan dan paling mahal akibatnya.

**2. Penawaran langsung dari penyedia.** Untuk kebutuhan yang nilainya sesuai ketentuan pengadaan langsung, atau sebagai pembanding harga sebelum e-purchasing. Kelebihannya: harga sering lebih rendah dari harga tayang e-Katalog karena penyedia tidak membebankan biaya kanal, dan spesifikasi bisa dikonsultasikan dulu.

Praktik terbaik yang kami lihat dari PPK berpengalaman: **gunakan keduanya** — minta penawaran langsung sebagai pembanding, lalu putuskan jalur mana yang paling menguntungkan anggaran.

## 5 Langkah Pengadaan yang Rapi

**Langkah 1 — Kunci spesifikasi berdasarkan kebutuhan, bukan merek.** Tentukan parameter teknis (kapasitas, rentang suhu, akurasi, daya listrik) lebih dulu. Spesifikasi yang terlalu mengarah ke satu merek berisiko dipermasalahkan; spesifikasi berbasis parameter memudahkan evaluasi.

**Langkah 2 — Riset harga di minimal 2–3 sumber.** Cek harga tayang di e-Katalog untuk model yang dituju, lalu minta penawaran langsung dari penyedia untuk model persis yang sama. Selisihnya sering signifikan. [Lihat contoh perbandingan model-persis Daihan vs harga e-Katalog](/pemerintah#bukti-harga).

**Langkah 3 — Pastikan status ready stock sebelum komitmen.** Alat lab impor yang indent bisa 8–16 minggu. Kalau anggaran harus terserap dalam tahun berjalan, prioritaskan penyedia dengan unit ready stock — minta foto unit + surat ketersediaan barang. [Cek daftar alat lab ready stock](/ready-stock).

**Langkah 4 — Minta kelengkapan dokumen sejak penawaran.** Penawaran resmi ber-kop, legalitas penyedia (NPWP, NIB), brosur/spesifikasi teknis, dan kejelasan garansi. Dokumen yang rapi di awal = SPJ yang tidak bermasalah di akhir.

**Langkah 5 — Hitung total biaya, bukan hanya harga unit.** Ongkos kirim, instalasi, training penggunaan, dan garansi purna jual. Harga unit termurah dengan ongkos kirim mahal bisa lebih boros dari penawaran terintegrasi.

## Studi Kasus Angka: Selisih Harga Model-Persis

Contoh nyata dari riset harga Juli 2026 — model identik, penyedia berbeda:

| Alat (Model) | Harga e-Katalog | Penawaran AndisLab | Selisih |
| --- | --- | --- | --- |
| Universal Drying Oven Daihan LDO-060E | Rp 29.970.000 | Rp 15.686.800 | 48% |
| Analog Water Bath Daihan LWB-211A | Rp 9.990.000 | Rp 6.014.700 | 40% |
| CO2 Incubator Daihan LCO-165AI | Rp 149.850.000 | Rp 95.036.800 | 37% |

Untuk satu paket pengadaan berisi beberapa unit, selisih seperti ini bisa berarti puluhan hingga ratusan juta rupiah anggaran yang bisa dialihkan ke kebutuhan lain. [Lihat daftar lengkap produk Daihan Labtech dan perbandingannya](/daihan-labtech).

## FAQ Pengadaan Alat Lab

**Apakah pembelian via e-Katalog wajib untuk instansi pemerintah?**
E-purchasing melalui Katalog Elektronik adalah metode yang diprioritaskan untuk produk yang sudah tayang di katalog, namun instansi tetap berkewajiban memastikan harga terbaik — membandingkan penyedia di dalam katalog maupun penawaran pembanding adalah bagian dari kewajaran harga.

**Bagaimana cara memastikan harga di e-Katalog wajar?**
Bandingkan harga tayang beberapa penyedia untuk model persis yang sama, dan minta penawaran langsung dari penyedia di luar katalog sebagai pembanding. Dokumentasikan perbandingan ini sebagai bagian dari berkas pengadaan.

**Apakah AndisLab terdaftar di e-Katalog / INAPROC?**
Ya, AndisLab (PT Andis Sentral Laboratorium) terdaftar di Katalog Elektronik INAPROC: katalog.inaproc.id/andis-sentral-laboratorium. Kami juga melayani penawaran langsung yang untuk banyak model Daihan lebih rendah dari harga tayang e-Katalog.

**Dokumen apa saja yang disiapkan AndisLab untuk SPJ?**
Penawaran resmi ber-kop, invoice, surat jalan, legalitas perusahaan (NPWP, NIB), spesifikasi teknis, dan dokumen pendukung lain sesuai kebutuhan berkas pengadaan instansi Anda.

**Berapa lama proses dari penawaran sampai barang tiba?**
Penawaran resmi terbit dalam 1 hari kerja. Unit ready stock dikirim 1–3 hari kerja setelah PO/pembayaran dari gudang Cibinong ke seluruh Indonesia.

## Sedang Menyusun Pengadaan?

Kirim daftar kebutuhan Anda — kami buatkan penawaran resmi lengkap dengan dokumen pembanding harga dalam 1 hari kerja.

[**Kirim Daftar Kebutuhan via WhatsApp →**](${WA_CTA})
`.trim();

async function main() {
  const data = {
    title: 'Pengadaan Alat Lab e-Katalog & Penawaran Resmi 2026',
    excerpt:
      'Langkah pengadaan alat laboratorium via e-Katalog/INAPROC untuk dinas, PDAM, dan instansi — plus cara membandingkan harga agar anggaran efisien dan SPJ aman.',
    image: '/images/products/meja-laboratorium-island-bench.png',
    category: 'panduan-alat',
    published: true,
    content,
  };

  const article = await prisma.article.upsert({
    where: { slug },
    update: data,
    create: { slug, ...data },
  });
  console.log('Upserted article:', article.slug, '—', article.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
