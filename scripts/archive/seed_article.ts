import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding sample articles...");

  // Find a few existing products to recommend
  const products = await prisma.product.findMany({
    take: 3,
  });

  const productIds = products.map((p) => p.id);
  console.log(`Found ${products.length} products to recommend in articles.`);

  const sampleArticles = [
    {
      slug: "panduan-memilih-spektrofotometer-laboratorium",
      title: "Spektrofotometer Lab: Panduan Memilih & Spesifikasi",
      excerpt: "Bingung memilih spektrofotometer yang tepat? Pelajari jenis, spesifikasi penting, dan rekomendasi spektrofotometer terbaik di artikel ini.",
      content: `## Mengapa Spektrofotometer Sangat Penting?

Spektrofotometer adalah alat yang digunakan untuk mengukur nilai absorbansi atau transmitansi dari suatu larutan kimia berdasarkan panjang gelombang cahaya tertentu. Alat ini menjadi tulang punggung analisis di berbagai industri, termasuk air bersih, farmasi, makanan dan minuman, serta laboratorium pendidikan.

### Jenis-Jenis Spektrofotometer

Secara umum, terdapat dua jenis spektrofotometer yang paling sering digunakan:
1. **Single Beam (Sinar Tunggal)**: Cahaya melewati satu wadah sampel saja. Lebih ekonomis dan cocok untuk analisis rutin standar.
2. **Double Beam (Sinar Ganda)**: Cahaya dibagi menjadi dua jalur untuk sampel dan referensi secara bersamaan. Menawarkan stabilitas tinggi dan presisi untuk penelitian lanjutan.

---

## 3 Faktor Penting Saat Memilih Spektrofotometer

Saat Anda ingin membeli spektrofotometer untuk laboratorium, pastikan untuk mempertimbangkan poin-poin berikut:

1. **Rentang Panjang Gelombang (Spectral Range)**
   - Apakah Anda memerlukan rentang UV-Vis (200 nm - 1000 nm) atau hanya Visibel (320 nm - 1000 nm)?
2. **Bandwidth Spektral (Spectral Bandwidth)**
   - Untuk hasil resolusi tinggi, pilihlah bandwidth yang lebih kecil (misal 1 nm - 2 nm).
3. **Kemudahan Penggunaan & Konektivitas**
   - Pilih alat dengan antarmuka layar sentuh (*touchscreen*) dan opsi ekspor data USB/Ethernet untuk kemudahan pelaporan.

> **Tips Ahli:** Pastikan Anda membeli alat dari distributor resmi yang menyediakan garansi dan layanan kalibrasi berkala agar masa pakai alat tetap panjang dan akurat.`,
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop",
      published: true,
    },
    {
      title: "Pentingnya Kalibrasi dan Perawatan Alat Uji Kualitas Air",
      slug: "pentingnya-kalibrasi-alat-uji-kualitas-air",
      excerpt: "Bagaimana cara menjaga keakuratan photometer dan pH meter Anda? Temukan panduan praktis perawatan dan jadwal kalibrasi yang disarankan.",
      content: `## Mengapa Alat Uji Harus Dikalibrasi?

Dalam analisis kualitas air, keakuratan data adalah segalanya. Baik Anda menguji COD, BOD, turbiditas, atau tingkat pH, sensor alat uji sensitif terhadap perubahan lingkungan, suhu, serta residu kimia. 

Tanpa kalibrasi berkala, alat uji Anda dapat mengalami **drift** (pergeseran pembacaan) yang menghasilkan data yang tidak valid.

---

## Langkah Praktis Perawatan Alat Uji Laboratorium

Berikut adalah panduan perawatan harian yang dapat Anda lakukan sendiri di laboratorium:

- **Bilas Kuvet dengan Air Suling**: Selalu bersihkan kuvet kaca sebelum dan sesudah pengukuran untuk menghindari kontaminasi silang.
- **Simpan Sensor pH dalam Larutan Penyimpanan**: Jangan biarkan sensor pH kering. Gunakan larutan KCL 3M untuk menjaga elektroda tetap basah.
- **Hindari Cahaya Matahari Langsung**: Paparan panas berlebih dapat merusak komponen optik photometer Anda.

### Kapan Harus Melakukan Kalibrasi Profesional?

Meskipun kalibrasi harian dengan standar buffer sangat dianjurkan, Anda tetap wajib melakukan kalibrasi tahunan bersertifikasi KAN atau standar internasional untuk memenuhi audit mutu (ISO 9001/ISO 17025).`,
      image: "/images/products/lovibond-rd125.jpg",
      published: true,
      category: "panduan-alat",
    }
  ];

  for (const art of sampleArticles) {
    const created = await (prisma as any).article.upsert({
      where: { slug: art.slug },
      update: {},
      create: {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: art.content,
        image: art.image,
        published: art.published,
        products: {
          connect: productIds.map((id) => ({ id })),
        },
      },
    });
    console.log(`Created article: ${created.title}`);
  }

  console.log("Database seeded successfully with articles!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
