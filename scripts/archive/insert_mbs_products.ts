import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Memulai penambahan produk dan pembaruan harga...");

  // 1. Data 4 produk baru (semua isReadyStock: true)
  const newProducts = [
    {
      slug: "vortex-mixer-servicebio-smv-4500b",
      name: "Vortex Mixer Servicebio SMV-4500B",
      category: "general-equipment",
      categoryLabel: "General Equipment",
      brand: "Servicebio",
      model: "SMV-4500B",
      subcategory: "Mixer",
      image: "/logo.png",
      description: "Vortex Mixer Servicebio SMV-4500B yang andal untuk pencampuran sampel cairan dengan cepat dan homogen di laboratorium.",
      price: 7000000,
      isReadyStock: true,
      isRequestPricing: false,
      stock: 1
    },
    {
      slug: "mikroskop-olympus-cx-23",
      name: "Mikroskop Olympus CX-23",
      category: "general-equipment",
      categoryLabel: "General Equipment",
      brand: "Olympus",
      model: "CX-23",
      subcategory: "Mikroskop",
      image: "/logo.png",
      description: "Mikroskop biologi Olympus CX-23 yang terkenal dengan ketajaman optik, ergonomi yang sangat baik, dan ketahanan untuk penggunaan laboratorium harian.",
      price: 27000000,
      isReadyStock: true,
      isRequestPricing: false,
      stock: 1
    },
    {
      slug: "autoklaf-labtech-lac-50455p",
      name: "Autoklaf Labtech LAC-50455P",
      category: "general-equipment",
      categoryLabel: "General Equipment",
      brand: "Labtech",
      model: "LAC-50455P",
      subcategory: "Autoklaf",
      image: "/logo.png",
      description: "Autoklaf sterilisasi uap bertekanan tinggi Labtech LAC-50455P untuk memastikan tingkat keamanan dan kebersihan instrumen lab Anda secara maksimal.",
      price: 65000000,
      isReadyStock: true,
      isRequestPricing: false,
      stock: 1
    },
    {
      slug: "water-purificator-puris-mirae-st",
      name: "Water Purificator Puris Mirae ST Expe-CB Ele 10-M",
      category: "general-equipment",
      categoryLabel: "General Equipment",
      brand: "Puris Mirae ST",
      model: "Expe-CB Ele 10-M",
      subcategory: "Water Purificator",
      image: "/logo.png",
      description: "Sistem pemurnian air (Water Purificator) Puris Mirae ST untuk menghasilkan air murni kualitas tinggi (Type I/II) untuk riset laboratorium tingkat lanjut.",
      price: 130000000,
      isReadyStock: true,
      isRequestPricing: false,
      stock: 1
    }
  ];

  for (const item of newProducts) {
    const { stock, ...productData } = item;
    // Cari atau buat produk
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: productData,
      create: productData,
    });
    
    // Sinkronisasi varian default untuk produk ready stock
    await prisma.productVariant.upsert({
      where: { sku: `SKU-${product.slug.toUpperCase()}` },
      update: {
        price: product.price,
        stock: stock,
      },
      create: {
        productId: product.id,
        sku: `SKU-${product.slug.toUpperCase()}` ,
        name: "Default",
        price: product.price,
        stock: stock,
        reservedStock: 0
      }
    });
    console.log(`Produk baru berhasil di-upsert: ${product.name}`);
  }

  // 2. Pembaruan harga untuk 3 produk Andislab Custom (Tetap PO / isReadyStock: false)
  const updates = [
    { slug: "flokulator-portabel-fb-4s", price: 25000000 },
    { slug: "wet-scrubber", price: 31000000 },
    { slug: "lemari-asam-fume-hood", price: 90000000 }
  ];

  for (const up of updates) {
    const exists = await prisma.product.findUnique({ where: { slug: up.slug } });
    if (exists) {
      await prisma.product.update({
        where: { slug: up.slug },
        data: { 
          price: up.price, 
          isReadyStock: false, // Tetap PO
          isRequestPricing: false 
        }
      });
      console.log(`Harga updated untuk (PO): ${up.slug} -> Rp ${up.price}`);
    } else {
      console.log(`Produk untuk update tidak ditemukan: ${up.slug}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
