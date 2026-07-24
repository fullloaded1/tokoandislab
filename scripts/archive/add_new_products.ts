import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newProducts = [
  {
    slug: "analytical-balance-cy285c-aczet",
    name: "Analytical Balance",
    category: "aczet",
    categoryLabel: "Aczet",
    brand: "Aczet",
    model: "CY285C",
    subcategory: "Timbangan Analitik",
    image: "/logo.png",
    description: "Timbangan analitik Semi Micro Aczet CY 285C dengan kapasitas ganda 80 / 220 g dan ketelitian ultra-tinggi 0.01 / 0.1 mg. Menggunakan teknologi sensor MONO-TECH, kalibrasi internal otomatis (PSAC), layar LCD Backlit, dan mendukung kepatuhan GLP/GMP. Sangat presisi untuk riset analitik dan laboratorium farmasi.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Kapasitas Maksimal", value: "80 / 220 g" },
      { label: "Ketelitian (Readability)", value: "0.01 / 0.1 mg" },
      { label: "Minimum Load", value: "1 mg" },
      { label: "Repeatability (sd)", value: "0.02 / 0.1 mg" },
      { label: "Linearity", value: "± 0.04 / 0.2 mg" },
      { label: "Kalibrasi", value: "Motorised Internal Calibration" },
      { label: "Display", value: "Alpha Numeric Backlite LCD" },
      { label: "Pan Size", value: "80Ø Grid pan" },
      { label: "Brand", value: "Aczet" },
    ]
  },
  {
    slug: "precision-balance-cy223-aczet",
    name: "Precision Balance",
    category: "aczet",
    categoryLabel: "Aczet",
    brand: "Aczet",
    model: "CY 223",
    subcategory: "Timbangan Presisi",
    image: "/logo.png",
    description: "Timbangan presisi Aczet CY 223 dengan kapasitas 220g dan resolusi 1mg. Dirancang untuk penimbangan rutin di laboratorium. Dilengkapi fungsi piece counting, percent weighing, dan konversi unit. Ringan, portabel, dan akurat.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Kapasitas", value: "220g" },
      { label: "Ketelitian (Readability)", value: "1mg (0.001g)" },
      { label: "Platform", value: "Stainless Steel Ø120mm" },
      { label: "Kalibrasi", value: "Eksternal" },
      { label: "Brand", value: "Aczet" },
    ]
  },
  {
    slug: "micropipette-single-channel-100-1000ul-ae-ma08-aelab",
    name: "Micropipette Single Channel 100-1000μl (Non Sterile)",
    category: "aelab",
    categoryLabel: "Aelab",
    brand: "Aelab",
    model: "AE-MA08",
    subcategory: "Micropipette",
    image: "/logo.png",
    description: "Micropipette single channel Aelab AE-MA08 dengan rentang volume 100-1000μl. Desain ergonomis untuk penggunaan lama tanpa kelelahan tangan. Tip ejector halus, volume lock, dan tip cone universal. Cocok untuk laboratorium biologi molekuler dan klinis.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Rentang Volume", value: "100-1000μl" },
      { label: "Tipe", value: "Single Channel, Non Sterile" },
      { label: "Akurasi", value: "±0.6-1.0%" },
      { label: "Presisi", value: "≤0.2-0.3%" },
      { label: "Autoklaf", value: "Tidak (Non Sterile)" },
      { label: "Brand", value: "Aelab" },
    ]
  },
  {
    slug: "micropipette-single-channel-10-100ul-ae-mb05-aelab",
    name: "Micropipette Single Channel 10-100μl (Fully Autoclave)",
    category: "aelab",
    categoryLabel: "Aelab",
    brand: "Aelab",
    model: "AE-MB05",
    subcategory: "Micropipette",
    image: "/logo.png",
    description: "Micropipette single channel Aelab AE-MB05 dengan rentang volume 10-100μl, dapat di-autoclave secara penuh pada 121°C. Ideal untuk lingkungan steril pada riset kultur sel, PCR, dan pekerjaan aseptik di biosafety cabinet.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Rentang Volume", value: "10-100μl" },
      { label: "Tipe", value: "Single Channel, Fully Autoclavable" },
      { label: "Sterilisasi", value: "Autoclave 121°C, 20 menit" },
      { label: "Akurasi", value: "±0.8-1.5%" },
      { label: "Brand", value: "Aelab" },
    ]
  },
  {
    slug: "8-channels-adjustable-volume-pipettes-5-50ul-ae-8m50-aelab",
    name: "8-Channels Adjustable Volume Pipettes 5-50μL",
    category: "aelab",
    categoryLabel: "Aelab",
    brand: "Aelab",
    model: "AE-8M50",
    subcategory: "Multichannel Pipette",
    image: "/logo.png",
    description: "Pipet multichannel 8 kanal Aelab AE-8M50 dengan volume adjustable 5-50μL. Mempercepat proses pipetting ELISA plate, PCR plate, dan microplate lainnya. Spacing tip sesuai standar 96-well plate. Desain ringan dan ergonomis.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Jumlah Channel", value: "8 Kanal" },
      { label: "Rentang Volume", value: "5-50μL" },
      { label: "Tip Spacing", value: "9mm (standar 96-well)" },
      { label: "Tipe", value: "Adjustable Volume" },
      { label: "Brand", value: "Aelab" },
    ]
  },
  {
    slug: "pcr-cabinet-pcr-1000-aelab",
    name: "PCR Cabinet",
    category: "aelab",
    categoryLabel: "Aelab",
    brand: "Aelab",
    model: "PCR-1000",
    subcategory: "PCR Cabinet",
    image: "/logo.png",
    description: "PCR Cabinet Aelab PCR-1000 menyediakan area kerja bebas kontaminasi DNA/RNA untuk preparasi sampel PCR. Dilengkapi lampu UV germicidal untuk dekontaminasi permukaan kerja, filter HEPA, dan lampu fluorescent untuk pencahayaan optimal.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Tipe", value: "PCR Workstation / Dead Air Box" },
      { label: "Lampu UV", value: "UV-C Germicidal 254nm" },
      { label: "Filtrasi", value: "HEPA Filter" },
      { label: "Material", value: "Stainless Steel Interior" },
      { label: "Brand", value: "Aelab" },
    ]
  },
  {
    slug: "digital-orbital-shaker-sk-o330-pro-aelab",
    name: "Digital Orbital Shaker",
    category: "aelab",
    categoryLabel: "Aelab",
    brand: "Aelab",
    model: "SK-O330-PRO",
    subcategory: "Orbital Shaker",
    image: "/logo.png",
    description: "Digital Orbital Shaker Aelab SK-O330-PRO dengan orbit 30mm untuk pencampuran sampel yang efisien. Layar LCD digital menampilkan kecepatan dan waktu secara real-time. Platform lebar dapat menampung banyak flask Erlenmeyer. Ideal untuk kultur mikrobiologi dan ekstraksi.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Orbit", value: "30mm" },
      { label: "Kecepatan", value: "100-500 RPM" },
      { label: "Kapasitas Beban Maks", value: "7.5 kg" },
      { label: "Timer", value: "1-9999 menit" },
      { label: "Display", value: "LCD Digital" },
      { label: "Brand", value: "Aelab" },
    ]
  },
  {
    slug: "biological-microscope-eum-4001-labex",
    name: "Biological Microscope",
    category: "labex",
    categoryLabel: "Labex",
    brand: "Labex",
    model: "EUM-4001",
    subcategory: "Mikroskop Biologi",
    image: "/logo.png",
    description: "Mikroskop biologi Labex EUM-4001 dengan konfigurasi trinocular untuk pengamatan dan dokumentasi foto. Dilengkapi 4 objektif Plan Achromatic (4x, 10x, 40x, 100x Oil), iluminasi LED Koehler, dan stage mekanik geser XY presisi tinggi.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Head", value: "Trinocular (Siedentopf)" },
      { label: "Objektif", value: "4x, 10x, 40x, 100x (oil)" },
      { label: "Okuler", value: "WF10x/20mm" },
      { label: "Iluminasi", value: "LED Koehler" },
      { label: "Stage", value: "Double Layer Mechanical Stage" },
      { label: "Brand", value: "Labex" },
    ]
  },
  {
    slug: "ph-meter-mw-150-milwaukee",
    name: "pH Meter",
    category: "milwaukee",
    categoryLabel: "Milwaukee Instruments",
    brand: "Milwaukee",
    model: "MW-150",
    subcategory: "pH Meter",
    image: "/logo.png",
    description: "pH Meter Milwaukee MW-150 adalah alat ukur pH benchtop dengan resolusi 0.01 pH. Dilengkapi kompensasi suhu otomatis (ATC) dan kalibrasi 2 titik. Layar LCD besar memudahkan pembacaan. Cocok untuk laboratorium QC air minum, industri pangan, dan pengolahan air.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Rentang pH", value: "0.00 - 14.00 pH" },
      { label: "Resolusi", value: "0.01 pH" },
      { label: "Akurasi", value: "±0.02 pH" },
      { label: "Kompensasi Suhu", value: "Otomatis (ATC)" },
      { label: "Kalibrasi", value: "2 Titik (pH 4.01 & 7.01)" },
      { label: "Brand", value: "Milwaukee" },
    ]
  },
  {
    slug: "aluminum-block-bath-dtu-r-taitec",
    name: "Aluminum Block Bath",
    category: "taitec",
    categoryLabel: "Taitec",
    brand: "Taitec",
    model: "DTU-R",
    subcategory: "Block Heater",
    image: "/logo.png",
    description: "Aluminum Block Bath Taitec DTU-R untuk pemanasan dan inkubasi sampel di tabung reaksi dengan distribusi suhu yang sangat merata. Blok aluminium yang dapat diganti-ganti (interchangeable block) mendukung berbagai ukuran tabung. Presisi suhu Jepang.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Rentang Suhu", value: "Ambient +5°C ~ 150°C" },
      { label: "Stabilitas Suhu", value: "±0.1°C" },
      { label: "Blok", value: "Interchangeable Aluminum Block" },
      { label: "Display", value: "Digital LED" },
      { label: "Brand", value: "Taitec" },
    ]
  },
  {
    slug: "co2-incubator-mg-70c-taitec",
    name: "CO2 Incubator",
    category: "taitec",
    categoryLabel: "Taitec",
    brand: "Taitec",
    model: "MG-70C",
    subcategory: "Inkubator CO2",
    image: "/logo.png",
    description: "CO2 Incubator Taitec MG-70C untuk kultur sel mamalia. Mengatur konsentrasi CO2, suhu, dan kelembaban secara presisi. Interior dari bahan tahan korosi dengan sistem sirkulasi udara lembut agar tidak mengganggu media kultur. Buatan Jepang.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Kapasitas", value: "70 Liter" },
      { label: "Rentang Suhu", value: "Ambient +5°C ~ 50°C" },
      { label: "Kontrol CO2", value: "0 - 20% (IR Sensor)" },
      { label: "Kelembaban", value: "≥95% RH (dengan water tray)" },
      { label: "Asal", value: "Jepang" },
      { label: "Brand", value: "Taitec" },
    ]
  },
  {
    slug: "incubator-shaker-br-23um-taitec",
    name: "Incubator Shaker",
    category: "taitec",
    categoryLabel: "Taitec",
    brand: "Taitec",
    model: "BR-23UM",
    subcategory: "Incubator Shaker",
    image: "/logo.png",
    description: "Incubator Shaker Taitec BR-23UM menggabungkan fungsi inkubasi suhu terkontrol dengan pengocokan orbital. Dirancang untuk kultur bakteri, ragi, dan pertumbuhan sel suspensi. Kecepatan dan suhu diatur secara digital. Kontrol presisi khas Jepang.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Rentang Suhu", value: "Ambient +5°C ~ 60°C" },
      { label: "Kecepatan Shaking", value: "25 - 200 RPM" },
      { label: "Orbit", value: "25mm" },
      { label: "Kapasitas Flask", value: "Maks. 12 x 500ml Erlenmeyer" },
      { label: "Brand", value: "Taitec" },
    ]
  },
  {
    slug: "incubator-shaker-br-43fl-taitec",
    name: "Incubator Shaker",
    category: "taitec",
    categoryLabel: "Taitec",
    brand: "Taitec",
    model: "BR-43FL",
    subcategory: "Incubator Shaker",
    image: "/logo.png",
    description: "Incubator Shaker Taitec BR-43FL adalah model besar dengan ruang inkubasi yang lebih luas. Mampu menampung flask berkapasitas besar dalam jumlah banyak. Dilengkapi pendingin (refrigerated) untuk kultur pada suhu rendah. Ideal untuk fermentasi skala lab dan riset bioteknologi.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Rentang Suhu", value: "4°C ~ 60°C (Refrigerated)" },
      { label: "Kecepatan Shaking", value: "25 - 200 RPM" },
      { label: "Orbit", value: "25mm" },
      { label: "Sistem Pendingin", value: "Kompressor Refrigerasi" },
      { label: "Brand", value: "Taitec" },
    ]
  },
  {
    slug: "vortex-mixer-delta-mixer-se-04-taitec",
    name: "Vortex Mixer Delta Mixer",
    category: "taitec",
    categoryLabel: "Taitec",
    brand: "Taitec",
    model: "Se-04",
    subcategory: "Vortex Mixer",
    image: "/logo.png",
    description: "Vortex Mixer Taitec Delta Mixer Se-04 untuk pencampuran cepat sampel di tabung reaksi, eppendorf, dan vial. Aktivasi sentuhan (touch) untuk operasi mudah satu tangan. Motor tanpa sikat (brushless) yang awet dan minim getaran. Buatan Jepang, sangat presisi.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Kecepatan", value: "0 - 2500 RPM (variabel)" },
      { label: "Mode Operasi", value: "Touch & Continuous" },
      { label: "Motor", value: "Brushless DC Motor" },
      { label: "Head", value: "Cup Head (standar)" },
      { label: "Asal", value: "Jepang" },
      { label: "Brand", value: "Taitec" },
    ]
  },
  {
    slug: "incubator-natural-convection-ic113c-yamato",
    name: "Incubators Natural Convection",
    category: "yamato",
    categoryLabel: "Yamato Scientific",
    brand: "Yamato",
    model: "IC113C",
    subcategory: "Inkubator",
    image: "/logo.png",
    description: "Inkubator Natural Convection Yamato IC113C dengan pemanasan konveksi alami yang lembut, menjaga kelembaban sampel dan menghindari pengeringan berlebih. Dilengkapi pengaturan suhu PID digital presisi tinggi. Interior Stainless Steel mudah dibersihkan. Buatan Jepang.",
    price: 0,
    isRequestPricing: true,
    isReadyStock: false,
    specs: [
      { label: "Kapasitas", value: "113 Liter" },
      { label: "Rentang Suhu", value: "Ambient +5°C ~ 80°C" },
      { label: "Stabilitas Suhu", value: "±0.3°C (at 37°C)" },
      { label: "Konveksi", value: "Natural (Gravity)" },
      { label: "Interior", value: "Stainless Steel" },
      { label: "Asal", value: "Jepang" },
      { label: "Brand", value: "Yamato" },
    ]
  },
];

async function main() {
  console.log(`Inserting ${newProducts.length} new products...\n`);

  for (const product of newProducts) {
    const { specs, ...productData } = product;
    
    // Check if already exists
    const existing = await prisma.product.findUnique({
      where: { slug: product.slug }
    });

    if (existing) {
      console.log(`⏭️  Skipped (already exists): ${product.name} - ${product.model}`);
      continue;
    }

    const created = await prisma.product.create({
      data: {
        ...productData,
        specs: {
          create: specs
        }
      }
    });

    console.log(`✅ Created: ${created.name} - ${product.model} [${product.category}]`);
  }

  console.log('\n🎉 Done!');
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
