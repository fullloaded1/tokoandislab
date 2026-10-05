import { PrismaClient, ContentPillar, FunnelStage } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding new articles...");

  await prisma.article.upsert({
    where: { slug: "analisis-mikroplastik-laboratorium" },
    update: {},
    create: {
      slug: "analisis-mikroplastik-laboratorium",
      title: "Microplastik: Bagaimana Laboratorium Mendeteksi Partikel yang Tak Terlihat?",
      excerpt: "Mikroplastik kini ditemukan di air, tanah, pangan, bahkan sampel biologis. Ukurannya yang sangat kecil membuatnya tidak cukup dianalisis hanya dengan pengamatan biasa.",
      content: `Mikroplastik kini ditemukan di air, tanah, pangan, bahkan sampel biologis. Ukurannya yang sangat kecil membuatnya tidak cukup dianalisis hanya dengan pengamatan biasa. Laboratorium menggunakan mikroskopi untuk skrining partikel, FTIR dan Raman untuk mengenali karakteristik polimer, serta Py-GC/MS untuk analisis kimia yang lebih mendalam.

Namun, tantangan justru dimulai sebelum instrumen bekerja: bagaimana mengambil sampel, memisahkan partikel, mencegah kontaminasi, dan memastikan hasil tetap valid?

Karena itu, analisis mikroplastik membutuhkan kombinasi sample preparation yang tepat, instrumen sesuai tujuan, serta QA/QC yang disiplin.

Laboratorium Anda ingin mulai mengembangkan pengujian mikroplastik? Mulailah dari workflow dan peralatan yang tepat.

<strong>Target market:</strong> Laboratorium lingkungan & jasa pengujian, universitas/pusat riset, laboratorium air/PDAM, industri makanan-minuman, industri plastik/polimer, serta instansi pemerintah bidang lingkungan.

<strong>Alat yang relevan:</strong> Microscope, analytical balance, filtration/vacuum filtration, membrane/filter, oven, glassware, centrifuge, FTIR/Raman (bila tersedia).

<hr />
<em>Sedang menyiapkan riset atau metode pengujian mikroplastik? Konsultasikan jenis sampel dan target analisis Anda. Tim AndisLab membantu memetakan kebutuhan mulai dari sample preparation hingga pemilihan peralatan laboratorium yang sesuai.</em>`,
      image: "/images/articles/microplastik.jpg",
      published: true,
      category: "edukasi-lab",
      authorName: "Tim Redaksi AndisLab",
      pillar: ContentPillar.SEARCH,
      funnelStage: FunnelStage.METHOD,
    }
  });

  await prisma.article.upsert({
    where: { slug: "10-alat-laboratorium-qc-industri-2027" },
    update: {},
    create: {
      slug: "10-alat-laboratorium-qc-industri-2027",
      title: "10 Alat Laboratorium Paling Banyak Dibutuhkan QC Industri 2026–2027",
      excerpt: "Laboratorium Quality Control (QC) semakin dituntut menghasilkan data cepat, akurat, dan konsisten. Pilihan harus disesuaikan dengan jenis sampel dan metode analisis.",
      content: `Laboratorium Quality Control (QC) semakin dituntut menghasilkan data cepat, akurat, dan konsisten. Sepuluh peralatan yang banyak menjadi kebutuhan dasar meliputi analytical balance, moisture analyzer, pH meter, UV-Vis spectrophotometer, oven, incubator, autoclave, centrifuge, hotplate magnetic stirrer, serta water purification system.

Namun, alat terbaik bukan selalu yang spesifikasinya tertinggi. Pilihan harus disesuaikan dengan jenis sampel, parameter uji, kapasitas pekerjaan, metode analisis, dan standar mutu yang digunakan.

Sebelum investasi, pertanyaan terpenting adalah: alat mana yang benar-benar prioritas bagi workflow QC Anda?

AndisLab membantu memetakan kebutuhan, spesifikasi, hingga alternatif produk yang sesuai anggaran dan aplikasi laboratorium.

<strong>Target market:</strong> QC/QA industri makanan-minuman, farmasi, kosmetik, kimia, manufaktur, agroindustri, laboratorium jasa pengujian dan R&D.

<strong>Alat yang relevan:</strong> Analytical Balance, Moisture Analyzer, pH Meter, UV-Vis, Oven, Incubator, Autoclave, Centrifuge, Hotplate Magnetic Stirrer, Water Purification System.

<hr />
<em>Sedang membangun atau melengkapi laboratorium QC? Kirim jenis industri, parameter pengujian dan daftar alat yang dibutuhkan. Tim AndisLab membantu mencocokkan spesifikasi, ketersediaan dan alternatif produknya.</em>`,
      image: "/images/articles/qc-lab.jpg",
      published: true,
      category: "edukasi-lab",
      authorName: "Tim Redaksi AndisLab",
      pillar: ContentPillar.SEARCH,
      funnelStage: FunnelStage.SELECTION,
    }
  });

  await prisma.article.upsert({
    where: { slug: "bedanya-cod-bod-toc-alat-uji" },
    update: {},
    create: {
      slug: "bedanya-cod-bod-toc-alat-uji",
      title: "COD, BOD, TOC: Apa Bedanya dan Alat Apa yang Dibutuhkan?",
      excerpt: "COD, BOD, dan TOC mengukur karakteristik yang berbeda dalam kualitas air. Karena prinsipnya berbeda, kebutuhan peralatannya pun berbeda.",
      content: `Dalam pengujian kualitas air dan air limbah, istilah COD, BOD, dan TOC sering muncul bersama, tetapi mengukur karakteristik yang berbeda.

COD menggambarkan kebutuhan oksigen untuk mengoksidasi senyawa dalam sampel secara kimia. BOD menunjukkan kebutuhan oksigen akibat aktivitas biologis mikroorganisme, sedangkan TOC mengukur kandungan karbon organik.

Karena prinsipnya berbeda, kebutuhan peralatannya pun berbeda: mulai dari COD reactor/digester dan photometer/spectrophotometer, BOD incubator dan DO meter, hingga TOC analyzer.

Pertanyaannya bukan "mana yang terbaik?", tetapi parameter mana yang sesuai tujuan pengujian Anda?

Pemilihan metode dan instrumen yang tepat membuat analisis lebih efektif sekaligus menghindari investasi alat yang kurang sesuai.

<strong>Target market:</strong> Laboratorium lingkungan, WWTP/IPAL industri, PDAM, laboratorium jasa pengujian, industri manufaktur, F&B, pulp & paper, pertambangan, kampus serta instansi lingkungan.

<strong>Alat yang relevan:</strong> COD Reactor/Digester, Photometer/UV-Vis Spectrophotometer, BOD Incubator, DO Meter, pH Meter, Analytical Balance, Glassware, Water Purification, TOC Analyzer.

<hr />
<em>Masih menentukan COD, BOD, TOC atau kombinasi parameter untuk laboratorium Anda? Sampaikan jenis sampel dan kebutuhan pengujiannya. Tim AndisLab membantu memetakan workflow serta peralatan yang sesuai.</em>`,
      image: "/images/articles/water-quality.jpg",
      published: true,
      category: "edukasi-lab",
      authorName: "Tim Redaksi AndisLab",
      pillar: ContentPillar.SEARCH,
      funnelStage: FunnelStage.METHOD,
    }
  });

  console.log("Successfully seeded 3 new articles!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
