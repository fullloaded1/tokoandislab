import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ArticleUpdateSpec {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
}

const SEO_ARTICLES_MAPPING: ArticleUpdateSpec[] = [
  {
    slug: 'panduan-pengadaan-alat-laboratorium-e-katalog',
    title: 'Pengadaan Alat Lab e-Katalog & Penawaran Resmi 2026',
    excerpt: 'Panduan lengkap pengadaan alat laboratorium via e-Katalog LKPP untuk instansi pemerintah dan BUMN. Dapatkan tips perbandingan harga, spesifikasi teknis, dan kelengkapan dokumen SPJ bersama AndisLab.',
    image: '/images/articles/panduan-pengadaan-ekatalog.png',
    category: 'panduan-alat',
  },
  {
    slug: 'panduan-alat-uji-kualitas-air-laboratorium-industri',
    title: 'Alat Uji Kualitas Air: Photometer & pH Meter Lab 2026',
    excerpt: 'Pelajari spesifikasi alat uji kualitas air untuk PDAM dan industri. Panduan memilih photometer, turbidimeter, dan pH meter Lovibond original dengan garansi resmi dan sertifikat.',
    image: '/images/articles/alat-uji-kualitas-air.png',
    category: 'panduan-alat',
  },
  {
    slug: 'panduan-autoclave-sterilisasi-laboratorium',
    title: 'Autoclave Laboratorium: Spesifikasi, Jenis & Harga 2026',
    excerpt: 'Pelajari prinsip kerja autoclave, perbedaan gravity vs pre-vacuum, prosedur validasi sterilisasi, dan panduan memilih autoclave terbaik dari Daihan Labtech.',
    image: '/images/articles/autoclave-sterilisasi.png',
    category: 'panduan-alat',
  },
  {
    slug: 'panduan-desain-furniture-laboratorium-modern',
    title: 'Furniture Laboratorium: Meja Lab, Fume Hood & Scrubber',
    excerpt: 'Bangun laboratorium yang aman dan memenuhi standar internasional. Pelajari cara mendesain layout lab, memilih meja laboratorium, fume hood, dan sistem ventilasi wet scrubber.',
    image: '/images/articles/desain-furniture-lab.png',
    category: 'edukasi-lab',
  },
  {
    slug: 'panduan-cold-chain-penyimpanan-sampel-laboratorium',
    title: 'Kulkas Vaksin & ULT Freezer -86°C: Panduan & Harga 2026',
    excerpt: 'Sistem cold chain laboratorium komprehensif — dari ultra low freezer -86°C untuk penyimpanan sampel biologis hingga kulkas farmasi untuk vaksin sesuai standar WHO & BPOM.',
    image: '/images/articles/cold-chain-ult-freezer.png',
    category: 'edukasi-lab',
  },
  {
    slug: 'panduan-lengkap-micropipette-laboratorium',
    title: 'Micropipette Laboratorium: Panduan Memilih & Kalibrasi',
    excerpt: 'Alat pengukur volume cairan presisi tinggi mikro-liter. Pelajari perbedaan micropipette single dan multi channel, teknik pipetting, serta jadwal kalibrasi.',
    image: '/images/articles/micropipette-presisi.png',
    category: 'panduan-alat',
  },
  {
    slug: 'panduan-lengkap-titrator-otomatis-laboratorium',
    title: 'Titrator Otomatis Lab: Panduan Lengkap & Harga 2026',
    excerpt: 'Jenis titrator otomatis potensiometri & Karl Fischer, spesifikasi yang wajib dicek, dan kisaran harga 2026 untuk laboratorium QC, PDAM, dan riset universitas.',
    image: '/images/articles/titrator-otomatis.png',
    category: 'panduan-alat',
  },
  {
    slug: 'panduan-peralatan-dasar-laboratorium-lengkap',
    title: 'Peralatan Dasar Laboratorium: Daftar Lengkap & Harga',
    excerpt: 'Checklist peralatan dasar laboratorium untuk kampus, puskesmas, dan industri — dari glassware borosilikat Pyrex hingga timbangan analitik, dengan estimasi harga 2026.',
    image: '/images/articles/peralatan-dasar-lab.png',
    category: 'edukasi-lab',
  },
  {
    slug: 'panduan-lengkap-biosafety-cabinet-laboratorium',
    title: 'Biosafety Cabinet (BSC): Spesifikasi & Panduan Memilih',
    excerpt: 'Peralatan wajib laboratorium mikrobiologi dan kultur sel. Pelajari perbedaan BSC Kelas I, II Tipe A2/B2, Kelas III, dan cara memverifikasi sertifikasi aliran udara HEPA.',
    image: '/images/articles/biosafety-cabinet.png',
    category: 'edukasi-lab',
  },
  {
    slug: 'perbedaan-inkubator-dan-oven-laboratorium',
    title: 'Inkubator vs Oven Laboratorium: Perbedaan & Fungsi Alat',
    excerpt: 'Sering bingung membedakan inkubator dan oven laboratorium? Pelajari perbedaan fungsi, suhu, sistem pemanasan, dan kegunaannya untuk riset mikrobiologi maupun pengeringan.',
    image: '/images/articles/inkubator-vs-oven.png',
    category: 'edukasi-lab',
  },
  {
    slug: 'panduan-memilih-spektrofotometer-laboratorium',
    title: 'Spektrofotometer Lab: Panduan Memilih & Spesifikasi',
    excerpt: 'Panduan memilih spektrofotometer UV-Vis single beam vs double beam. Pelajari spesifikasi rentang panjang gelombang, bandwidth, dan rekomendasi alat akurasi tinggi.',
    image: '/images/articles/spektrofotometer-uv-vis.png',
    category: 'panduan-alat',
  },
  {
    slug: 'kebutuhan-alat-lab-qc-industri-cikarang',
    title: 'Supplier Alat Laboratorium QC Terpercaya di Kawasan Industri Cikarang (KIC)',
    excerpt: 'Panduan dan rekomendasi peralatan laboratorium Quality Control (QC) untuk pabrik manufaktur, F&B, dan otomotif di Kawasan Industri Cikarang. Dapatkan layanan pengadaan terbaik dari AndisLab.',
    image: '/images/articles/kic-lab-equipment.png',
    category: 'edukasi-lab',
  },
];

async function main() {
  console.log('Syncing SEO titles and high-res local images for all articles...');
  for (const item of SEO_ARTICLES_MAPPING) {
    const existing = await prisma.article.findUnique({
      where: { slug: item.slug },
    });

    if (existing) {
      await prisma.article.update({
        where: { slug: item.slug },
        data: {
          title: item.title,
          excerpt: item.excerpt,
          image: item.image,
          category: item.category,
        },
      });
      console.log(`Updated [${item.slug}] -> "${item.title}" (${item.image})`);
    } else {
      console.log(`Skipped [${item.slug}] (Article does not exist in database yet)`);
    }
  }
  console.log('Successfully synced all articles!');
}

main()
  .catch((e) => {
    console.error('Failed to sync articles:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
