import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates = [
  {
    model: "LAC-1011SV",
    name: "Autoclave Sterilisasi Vertikal LAC-1011SV (45L)",
    specs: [
      { label: "Kapasitas", value: "45 Liter" },
      { label: "Temperatur Maksimal", value: "121°C" },
      { label: "Sistem Kontrol", value: "Digital Fuzzy Control System" },
      { label: "Daya Listrik", value: "2.0 kW" },
      { label: "Material Ruang Pemanas", value: "Stainless Steel 304 (Anti-Karat)" }
    ]
  },
  {
    model: "LAC-1021SV",
    name: "Autoclave Vertikal Otomatis LAC-1021SV (60L)",
    specs: [
      { label: "Kapasitas", value: "60 Liter" },
      { label: "Temperatur Maksimal", value: "121°C" },
      { label: "Sistem Kontrol", value: "Digital Fuzzy Control System" },
      { label: "Daya Listrik", value: "3.0 kW" },
      { label: "Material Ruang Pemanas", value: "Stainless Steel 304 (Anti-Karat)" }
    ]
  },
  {
    model: "LAC-1031SV",
    name: "Autoclave Vertikal Otomatis LAC-1031SV (80L)",
    specs: [
      { label: "Kapasitas", value: "80 Liter" },
      { label: "Temperatur Maksimal", value: "121°C" },
      { label: "Sistem Kontrol", value: "Digital Fuzzy Control System" },
      { label: "Daya Listrik", value: "4.0 kW" },
      { label: "Material Ruang Pemanas", value: "Stainless Steel 304 (Anti-Karat)" }
    ]
  },
  {
    model: "LAC-1031SVF",
    name: "Autoclave Vacuum Drying LAC-1031SVF (80L)",
    specs: [
      { label: "Kapasitas", value: "80 Liter" },
      { label: "Temperatur Maksimal", value: "121°C" },
      { label: "Fitur Pengeringan", value: "Vacuum Drying System (Kering Sempurna)" },
      { label: "Daya Listrik", value: "4.5 kW" },
      { label: "Material Ruang Pemanas", value: "Stainless Steel 304 (Anti-Karat)" }
    ]
  },
  {
    model: "LBH-T02",
    name: "Dry Block Heater LBH-T02",
    specs: [
      { label: "Rentang Suhu", value: "Ambient + 5°C s/d 150°C" },
      { label: "Akurasi Suhu", value: "± 0.1°C" },
      { label: "Kapasitas Blok", value: "2 Blok (Aluminium Block)" },
      { label: "Timer Pengoperasian", value: "99 jam 59 menit" },
      { label: "Daya Listrik", value: "300 W" }
    ]
  },
  {
    model: "LCO-065AI",
    name: "Inkubator CO2 Air Jacket LCO-065AI (65L)",
    specs: [
      { label: "Kapasitas", value: "65 Liter" },
      { label: "Sensor CO2", value: "Dual-beam Infrared (IR) Sensor" },
      { label: "Rentang Suhu", value: "Ambient + 5°C s/d 60°C" },
      { label: "Rentang Gas CO2", value: "0% s/d 20%" },
      { label: "Material Interior", value: "Stainless Steel 304 dengan sudut membulat" }
    ]
  },
  {
    model: "LCO-165AI",
    name: "Inkubator CO2 Air Jacket LCO-165AI (165L)",
    specs: [
      { label: "Kapasitas", value: "165 Liter" },
      { label: "Sensor CO2", value: "Dual-beam Infrared (IR) Sensor" },
      { label: "Rentang Suhu", value: "Ambient + 5°C s/d 60°C" },
      { label: "Rentang Gas CO2", value: "0% s/d 20%" },
      { label: "Material Interior", value: "Stainless Steel 304 berkualitas tinggi" }
    ]
  },
  {
    model: "LCV-203GR",
    name: "Vaccine & Pharmacy Refrigerator LCV-203GR",
    specs: [
      { label: "Kapasitas", value: "290 Liter" },
      { label: "Rentang Suhu", value: "2°C s/d 8°C" },
      { label: "Tipe Pintu", value: "Double Glass Door dengan Heater penahan embun" },
      { label: "Sistem Defrost", value: "Automatic Defrost" },
      { label: "Fitur Keamanan", value: "Alarm suhu tinggi/rendah & Alarm kegagalan daya" }
    ]
  },
  {
    model: "LOM-205RM",
    name: "Roller Mixer Patologi LOM-205RM",
    specs: [
      { label: "Roda Roller", value: "5 Rollers (Roda Pemutar)" },
      { label: "Rentang Kecepatan", value: "10 s/d 70 RPM (Variabel)" },
      { label: "Tipe Gerakan", value: "Rolling & Rocking (Memutar & Mengayun)" },
      { label: "Kapasitas Beban", value: "Maksimal 5 kg" },
      { label: "Panjang Roller", value: "320 mm" }
    ]
  },
  {
    model: "LOM-210RM",
    name: "Roller Mixer Lab LOM-210RM",
    specs: [
      { label: "Roda Roller", value: "10 Rollers (Roda Pemutar)" },
      { label: "Rentang Kecepatan", value: "10 s/d 70 RPM (Variabel)" },
      { label: "Tipe Gerakan", value: "Rolling & Rocking (Memutar & Mengayun)" },
      { label: "Kapasitas Beban", value: "Maksimal 10 kg" },
      { label: "Panjang Roller", value: "320 mm" }
    ]
  },
  {
    model: "LWD-104S",
    name: "Penyuling Air (Water Still) LWD-104S",
    specs: [
      { label: "Kapasitas Destilasi", value: "4 Liter per jam" },
      { label: "Konsumsi Air Pendingin", value: "Sekitar 30 - 50 Liter per jam" },
      { label: "Material Bodi & Boiler", value: "Full Stainless Steel 304" },
      { label: "Sistem Keamanan", value: "Sensor Level Air (Mati otomatis jika air kering)" },
      { label: "Daya Listrik", value: "3.0 kW" }
    ]
  },
  {
    model: "GMC-361",
    name: "Microcentrifuge GMC-361 with Timer",
    specs: [
      { label: "Kecepatan Maksimal", value: "13.500 RPM" },
      { label: "Gaya Sentrifugal (RCF)", value: "12.225 xg" },
      { label: "Kapasitas Rotor", value: "12 x 1.5/2.0 ml micro tube" },
      { label: "Timer Pengukuran", value: "15 detik s/d 99 menit atau Kontinu" },
      { label: "Fitur Keselamatan", value: "Electronic Lid Lock & Imbalance Detector" }
    ]
  },
  {
    model: "LWB-211A",
    name: "Analog Water Bath LWB-211A (11L)",
    specs: [
      { label: "Kapasitas", value: "11 Liter" },
      { label: "Sistem Kontrol", value: "Analog Knob (Pengatur Putar Hidrolik)" },
      { label: "Rentang Suhu", value: "Ambient + 5°C s/d 100°C" },
      { label: "Material Bak", value: "Stainless Steel 304 Seamless (Tanpa Sambungan)" },
      { label: "Daya Listrik", value: "800 W" }
    ]
  },
  {
    model: "LLF-403SR",
    name: "Medical Laboratory Freezer LLF-403SR (-40°C)",
    specs: [
      { label: "Kapasitas", value: "385 Liter" },
      { label: "Rentang Suhu", value: "-20°C s/d -40°C" },
      { label: "Sistem Pendinginan", value: "Direct Cooling (Manual Defrost)" },
      { label: "Tipe Pintu", value: "Solid Door dengan Kunci Pengaman" },
      { label: "Sistem Alarm", value: "Alarm suhu tinggi/rendah & Alarm kegagalan sensor" }
    ]
  },
  {
    model: "LDF-9015S",
    name: "Chest Ultra Low Freezer LDF-9015S (-86°C)",
    specs: [
      { label: "Kapasitas", value: "150 Liter" },
      { label: "Tipe Model", value: "Chest Freezer (Buka Atas)" },
      { label: "Rentang Suhu", value: "-40°C s/d -86°C" },
      { label: "Sistem Pendingin", value: "Cascade Refrigeration (Kompresor Ganda)" },
      { label: "Tebal Insulasi", value: "130 mm High-Density Polyurethane Foam" }
    ]
  },
  {
    model: "LDF-9010U",
    name: "Upright Ultra Low Freezer LDF-9010U (-86°C)",
    specs: [
      { label: "Kapasitas", value: "100 Liter" },
      { label: "Tipe Model", value: "Upright Freezer (Berdiri/Buka Samping)" },
      { label: "Rentang Suhu", value: "-40°C s/d -86°C" },
      { label: "Sistem Pendingin", value: "Cascade Refrigeration (Kompresor Ganda)" },
      { label: "Fitur Proteksi", value: "Alarm suhu ekstrim, alarm pintu terbuka, sensor tegangan" }
    ]
  },
  {
    model: "LDF-9020U",
    name: "Upright Ultra Low Freezer LDF-9020U (-86°C)",
    specs: [
      { label: "Kapasitas", value: "200 Liter" },
      { label: "Tipe Model", value: "Upright Freezer (Berdiri/Buka Samping)" },
      { label: "Rentang Suhu", value: "-40°C s/d -86°C" },
      { label: "Sistem Pendingin", value: "Cascade Refrigeration (Kompresor Ganda)" },
      { label: "Rak Internal", value: "3 Rak Stainless Steel (4 Sekat Penyimpanan)" }
    ]
  },
  {
    model: "LDF-9110C",
    name: "Chest Ultra Low Freezer LDF-9110C (-86°C)",
    specs: [
      { label: "Kapasitas", value: "110 Liter" },
      { label: "Tipe Model", value: "Chest Freezer (Buka Atas)" },
      { label: "Rentang Suhu", value: "-40°C s/d -86°C" },
      { label: "Sistem Pendingin", value: "Cascade Refrigeration (Kompresor Ganda)" },
      { label: "Fitur Tambahan", value: "Recovery suhu cepat setelah pintu dibuka" }
    ]
  },
  {
    model: "LDO-080F",
    name: "Forced Convection Oven LDO-080F",
    specs: [
      { label: "Kapasitas", value: "80 Liter" },
      { label: "Sirkulasi Udara", value: "Forced Air Convection (Konveksi Paksa)" },
      { label: "Rentang Suhu", value: "Ambient + 5°C s/d 250°C" },
      { label: "Tipe Kontroler", value: "Digital PID Controller" },
      { label: "Material Ruang", value: "Stainless Steel 304 (Anti-Karat)" }
    ]
  },
  {
    model: "MaXterile 60L",
    name: "Autoclave MaXterile 60L",
    specs: [
      { label: "Kapasitas", value: "60 Liter" },
      { label: "Sistem Kontrol", value: "Microprocessor PID Controller" },
      { label: "Rentang Suhu", value: "Ambient + 5°C s/d 132°C" },
      { label: "Fitur Keselamatan", value: "Pelepas tekanan otomatis, sensor pintu, over-temp cutoff" },
      { label: "Keranjang Sterilisasi", value: "Termasuk 2 Unit Keranjang Kawat Stainless Steel" }
    ]
  },
  {
    model: "SD 50",
    name: "pH Meter Portabel Lovibond SD 50",
    specs: [
      { label: "Rentang Ukur pH", value: "0.00 s/d 14.00 pH" },
      { label: "Akurasi Pengukuran", value: "± 0.01 pH" },
      { label: "Rentang Pengukuran Suhu", value: "0.0 s/d 60.0°C" },
      { label: "Kalibrasi pH", value: "Otomatis hingga 3 titik (pH 4.01, 7.00, 10.01)" },
      { label: "Standar Proteksi", value: "IP67 (Tahan Air & Debu)" }
    ]
  },
  {
    model: "Custom BSC",
    name: "Biosafety Cabinet (BSC) Kelas II Tipe A2 Custom",
    specs: [
      { label: "Tipe Aliran Udara", value: "70% Resirkulasi HEPA, 30% Pembuangan (Exhaust)" },
      { label: "Filter Efisiensi", value: "HEPA Filter 99.99% pada partikel 0.3 mikron" },
      { label: "Material Work Zone", value: "Stainless Steel 304 (Seamless/Tanpa Sambungan)" },
      { label: "Sistem Sterilisasi", value: "Lampu UV dengan timer pengaman" },
      { label: "Dimensi Ruang Kerja", value: "Custom (Sesuai Pesanan)" }
    ]
  },
  {
    model: "Custom LAF",
    name: "Laminar Air Flow (LAF) Vertikal Custom",
    specs: [
      { label: "Tipe Aliran Udara", value: "Aliran Udara Vertikal (Positive Pressure)" },
      { label: "Filter Utama", value: "HEPA Filter efisiensi 99.99% pada partikel 0.3 mikron" },
      { label: "Lampu Penerangan", value: "Lampu Neon & Lampu UV Sterilisasi" },
      { label: "Kecepatan Aliran Udara", value: "0.3 s/d 0.5 m/s (Blower speed adjustable)" },
      { label: "Material Meja Kerja", value: "Stainless Steel 304 Tahan Korosi" }
    ]
  },
  {
    model: "GL45 500ml",
    name: "Botol Media Kaca GL45 Pyrex® 500ml",
    specs: [
      { label: "Kapasitas Volume", value: "500 ml" },
      { label: "Tipe Tutup Ulir", value: "GL45 Screw Cap (Biru) dengan cincin tuang anti-tetes" },
      { label: "Material Gelas", value: "Kaca Borosilikat 3.3 (Tahan Panas & Autoklaf)" },
      { label: "Skala Volume", value: "Graduasi enamel putih tahan lama" },
      { label: "Batas Suhu Sterilisasi", value: "Hingga 140°C (untuk tutup botol)" }
    ]
  }
];

async function main() {
  console.log("Starting specific product names and specifications update...");

  let updatedCount = 0;

  for (const item of updates) {
    // 1. Find product in DB
    // We try to find by model or partial model
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { model: item.model },
          { slug: { contains: item.model.toLowerCase() } },
          { name: item.model } // fallback
        ]
      }
    });

    if (product) {
      console.log(`Updating product [${product.id}]: ${product.name} -> ${item.name}`);
      
      // Update product name
      await prisma.product.update({
        where: { id: product.id },
        data: {
          name: item.name
        }
      });

      // Clear old specs
      await prisma.productSpec.deleteMany({
        where: { productId: product.id }
      });

      // Insert new specs
      await prisma.productSpec.createMany({
        data: item.specs.map(spec => ({
          label: spec.label,
          value: spec.value,
          productId: product.id
        }))
      });

      updatedCount++;
    } else {
      // For custom items or others, let's search by name
      let queryName = "";
      if (item.model === "Custom BSC") queryName = "Biosafety Cabinet (BSC) Custom";
      else if (item.model === "Custom LAF") queryName = "Laminar Air Flow (LAF) Custom";
      else if (item.model === "GL45 500ml") queryName = "Botol Media Kaca (Screw Cap Media/Reagent Bottle) 500ml";
      else if (item.model === "SD 50") queryName = "pH Meter Lovibond";
      else if (item.model === "MaXterile 60L") queryName = "Autoclave MaXterile 60L";

      if (queryName) {
        const prod = await prisma.product.findFirst({
          where: { name: { contains: queryName, mode: 'insensitive' } }
        });

        if (prod) {
          console.log(`Updating generic item [${prod.id}]: ${prod.name} -> ${item.name}`);
          
          await prisma.product.update({
            where: { id: prod.id },
            data: {
              name: item.name,
              model: item.model // update model to match
            }
          });

          await prisma.productSpec.deleteMany({
            where: { productId: prod.id }
          });

          await prisma.productSpec.createMany({
            data: item.specs.map(spec => ({
              label: spec.label,
              value: spec.value,
              productId: prod.id
            }))
          });

          updatedCount++;
        } else {
          console.log(`Could not find product for query: ${queryName}`);
        }
      } else {
        console.log(`Could not find product for model: ${item.model}`);
      }
    }
  }

  console.log(`\nSuccessfully updated ${updatedCount} products with specific details and specifications!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
