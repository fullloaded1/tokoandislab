const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const HOOKS = {
  // Tier 1
  'labex-scopepad-lx97': 'Dokumentasi visual mikroskop digital real-time.',
  'taitec-rotator-rt-50n': 'Agitasi end-over-end presisi standar riset Jepang.',
  'scrub-station-1-person': 'Sanitasi otomatis hands-free standar ruang steril.',
  'infitek-linear-shaker-shk-l710': 'Pencampuran sampel yang konsisten bebas tumpah.',
  'opto-edu-microscope-a12-0205-t': 'Visual jernih untuk pemakaian intensif dan dokumentasi.',
  'opto-edu-microscope-a33-5121-th': 'Mikroskop trinokular tajam untuk riset dan akademik.',
  'labex-stereo-microscope-szm-6565': 'Pengamatan detail 3D tanpa mata cepat lelah.',
  'ph-meter-benchtop-standar': 'Pembacaan pH stabil, rilis QC tidak tertahan.',
  'infitek-colony-counter-cc-j2s': 'Pencacahan koloni mikroba cepat dan akurat.',
  'kursi-donor-medis': 'Kenyamanan maksimal pasien sampling dan transfusi.',
  'value-vacuum-pump-ve115n': 'Daya hisap vakum stabil untuk filtrasi laboratorium.',
  'hanna-digital-thermometer-hi98501': 'Monitoring suhu penetrasi presisi respons cepat.',
  'cal-infrared-thermometer-cal-01': 'Pengukuran suhu non-kontak higienis dan instan.',
  'dlab-toppette-100-1000ul': 'Pipetting presisi dan ergonomis untuk cairan rutin.',

  // Tier 2
  'daihan-lac-1021sv-autoclave': 'Sterilisasi tuntas kapasitas lebih besar, risiko kontaminasi silang turun.',
  'yamato-incubator-ic413c': 'Suhu stabil standar Jepang untuk pertumbuhan kultur optimal.',
  'daihan-lac-1011sv-autoclave': 'Sterilisasi tuntas otomatis, dekontaminasi tervalidasi.',
  'meling-pharmacy-refrigerator-yc-130l': 'Penyimpanan reagen dan vaksin 2-8°C terjaga aman.',
  'aluminum-block-bath-dtu-r-taitec': 'Pemanasan sampel tabung presisi tanpa fluktuasi suhu.',
  'andislab-pass-box-400': 'Transfer material antar cleanroom bebas kontaminasi udara.',
  'aelab-benchtop-conductivity-meter-510': 'Uji konduktivitas dan salinitas akurat untuk air industri.',
  'infitek-analytical-balance-ba-n503': 'Penimbangan presisi tinggi dasar analisis kuantitatif.',

  // Tier 3
  'taitec-large-incubator-shaker-gbr-200': 'Kapasitas raksasa untuk kultur sel dan fermentasi industri.',
  'incubator-shaker-br-43fl-taitec': 'Inkubasi dan agitasi performa tinggi untuk bioteknologi.',
  'co2-incubator-mg-70c-taitec': 'Kontrol CO2 dan suhu presisi tinggi untuk kultur sel mamalia.',
  'incubator-shaker-br-23um-taitec': 'Agitasi stabil 24/7 untuk bioproses dan mikrobiologi.',
  'taitec-incubator-shaker-br-23fh': 'Fleksibilitas kontrol suhu dan kecepatan inkubator shaker.',
  'daihan-ldf-9020u-ultra-low-temp-freezer': 'Sampel dan reagen kritis tersimpan aman pada suhu -86°C.',
  'water-purificator-puris-mirae-st': 'Pasokan air ultra murni grade analitik bebas kontaminan.',
  'daihan-ldf-9015s-ultra-low-temp-freezer': 'Cold storage tipe chest insulasi tebal hemat energi.',
  'daihan-ldf-9010u-ultra-low-temp-freezer': 'Perlindungan sampel esensial dengan sistem alarm berlapis.',
  'andislab-bsc-mini-ii-a2-prime': 'Proteksi biosafety A2 kompak hemat ruang lab.',
  'daihan-ldf-9110c-ultra-low-temp-freezer': 'Chest freezer ultra low andal untuk penyimpanan jangka panjang.',
  'andislab-bsc-1100-ii-a2': 'Proteksi 3-arah analis, sampel, dan lingkungan kerja.',
  'analytical-balance-cy285c-aczet': 'Timbangan analitik mikro presisi tinggi grade riset mutakhir.',
  'taitec-incubator-shaker-vbr-104': 'Teknologi NewMax Drive senyap dan minim getaran.',
  'andislab-laf-mini-v-digital': 'Aliran udara laminar vertikal HEPA filter digital.',
  'pcr-cabinet-pcr-1000-aelab': 'Zona kerja steril dekontaminasi UV untuk amplifikasi DNA.',
  'taitec-incubator-shaker-mbr-032': 'Inkubator shaker kompak untuk microplate dan tabung.',
  'daihan-lco-165ai-air-jacket-co2-incubator': 'Inkubator CO2 air jacket kapasitas besar kelembapan terjaga.',
  'labtech-bsc-ii-a2-lcb-0123': 'Biosafety Cabinet Kelas II A2 kapasitas kerja leluasa.',
  'andislab-pass-box-dynamic': 'Air shower interlock untuk dekontaminasi partikel transfer.',
  'daihan-lac-1031svf-autoclave': 'Autoclave vertikal lengkap dengan fitur vacuum drying.',
  'yamato-drying-oven-dkn413c': 'Drying oven sirkulasi udara merata standar industri Jepang.',
  'daihan-lac-1031sv-autoclave': 'Autoclave vertikal kapasitas 100L sterilisasi batch besar.',
  'autoklaf-labtech-lac-50455p': 'Sterilisasi uap bertekanan tinggi untuk instrumen dan limbah medis.',
  'daihan-llf-403sr-laboratory-freezer': 'Freezer medis -20°C sampai -35°C stabilitas termal prima.',
  'daihan-lco-065ai-air-jacket-co2-incubator': 'Inkubasi sel kultur sensitif suhu presisi seragam.',
  'andislab-laf-1000v-vertikal': 'Zona kerja bersih partikel untuk perlindungan sampel sensitif.',
  'daihan-lcv-203gr-vaccine-pharmacy-refrigerator': 'Kulkas farmasi dan vaksin kontrol digital stabil.'
};

async function generate() {
  const products = await prisma.product.findMany({
    where: { isReadyStock: true },
    select: {
      id: true,
      slug: true,
      name: true,
      brand: true,
      model: true,
      price: true,
      image: true,
      variants: true,
      description: true
    }
  });

  const formatted = products.map(p => {
    let stock = 1;
    if (p.variants && Array.isArray(p.variants) && p.variants.length > 0) {
      stock = p.variants[0].stock ?? 1;
    }
    const hook = HOOKS[p.slug] || p.name;
    return {
      slug: p.slug,
      name: p.name,
      model: p.model || p.name,
      brand: p.brand || 'AndisLab',
      normalPrice: Number(p.price),
      promoPrice: null,
      stock,
      specLine: '',
      hook,
      image: p.image || null
    };
  });

  // Sort descending by price
  formatted.sort((a, b) => b.normalPrice - a.normalPrice);

  const t1 = formatted.filter(p => p.normalPrice < 30000000);
  const t2 = formatted.filter(p => p.normalPrice >= 30000000 && p.normalPrice < 70000000);
  const t3 = formatted.filter(p => p.normalPrice >= 70000000);

  console.log(`Tier 1: ${t1.length}, Tier 2: ${t2.length}, Tier 3: ${t3.length}`);

  const content = `export interface PromoProduct {
  slug: string;
  name: string;
  model: string;
  brand: string;
  normalPrice: number;
  promoPrice: number | null;
  stock: number;
  specLine: string;
  hook: string;
  image?: string | null;
}

export interface PromoCatalog {
  id: string;
  number: 1 | 2 | 3;
  title: string;
  subtitle: string;
  limit: string;
  theme: "blue-amber" | "navy-teal" | "slate-gold";
  headline: string;
  hook: string;
  copy: string;
  target: string;
  ctaText: string;
  bonus: string[];
  bundleNote: string;
  addOnNote: string;
  products: PromoProduct[];
}

export const WA_NUMBER = "6281991575096";

export const PROMO_START = "2026-10-30T00:00:00+07:00";
export const PROMO_END = "2026-12-30T23:59:59+07:00";
export const PO_CUTOFF_JAWA = "2026-12-22";
export const PO_CUTOFF_LUAR_JAWA = "2026-12-15";

export const PROMO_PHASES = [
  {
    id: "early-bird",
    name: "Early Bird",
    start: "2026-10-30T00:00:00+07:00",
    end: "2026-11-20T23:59:59+07:00",
    message: "Kunci stok dan harga sekarang selagi unit masih lengkap. SPH bisa terbit segera untuk pengajuan anggaran.",
  },
  {
    id: "serapan",
    name: "Serapan Anggaran",
    start: "2026-11-21T00:00:00+07:00",
    end: "2026-12-15T23:59:59+07:00",
    message: "Kejar PO akhir tahun. Pilih alat ready stock agar anggaran departemen terserap tepat guna.",
  },
  {
    id: "last-call",
    name: "Last Call",
    start: "2026-12-16T00:00:00+07:00",
    end: "2026-12-30T23:59:59+07:00",
  },
] as const;

export const terms: string[] = [
  "Promo berlaku 30 Oktober - 30 Desember 2026 atau selama stok tersedia.",
  "Harga dan stok dapat berubah sewaktu-waktu; konfirmasi ketersediaan melalui tim sales.",
  "Ongkir gratis berlaku untuk area Jabodetabek. Di luar area, ongkir dan transport teknisi dihitung terpisah.",
  "Instalasi dan training dilakukan on-site di area Jabodetabek; di luar area dilakukan sesuai kesepakatan.",
  "Faktur dan BAST diproses sebelum tutup buku untuk PO yang masuk paling lambat 22 Desember 2026 (Jawa) atau 15 Desember 2026 (luar Jawa), sesuai ketersediaan stok dan kelengkapan dokumen pembeli.",
  "Garansi mengikuti ketentuan resmi prinsipal masing-masing produk."
];

export const catalogs: PromoCatalog[] = [
  {
    id: "katalog-1",
    number: 1,
    title: "Langkah Pertama Lab Hebat",
    subtitle: "Smart Lab Upgrade",
    limit: "di bawah Rp30 Juta",
    theme: "blue-amber",
    headline: "Satu alat kecil. Hasil uji yang akhirnya bisa Anda percaya.",
    hook: "Perbarui instrumen harian lab Anda tanpa birokrasi rumit.",
    copy: "Bayangkan Senin pagi: sampel masuk, alat menyala, angka langsung stabil. Tidak ada lagi ragu.",
    target: "Lab QC rutin, R&D dasar, universitas, klinik, F&B",
    ctaText: "Amankan unit Anda sebelum kuota habis.",
    bonus: [
      "Ongkir gratis Jabodetabek",
      "Uji fungsi sebelum kirim",
      "Panduan penggunaan via video call",
      "Dokumen lengkap: faktur, surat garansi"
    ],
    bundleNote: "Beli 2 alat atau lebih dalam 1 PO: prioritas jadwal pengiriman.",
    addOnNote: "",
    products: ${JSON.stringify(t1, null, 6)}
  },
  {
    id: "katalog-2",
    number: 2,
    title: "Jantung Lab Anda",
    subtitle: "Core Analytical & Sterilization",
    limit: "di bawah Rp70 Juta",
    theme: "navy-teal",
    headline: "Alat yang bekerja diam-diam, tapi menentukan setiap hasil.",
    hook: "Amankan pilar akurasi dan sterilitas lab Anda. Investasi cerdas di penghujung tahun untuk performa bebas kendala tahun depan.",
    copy: "Rasakan tenangnya saat setiap timbangan presisi, setiap sterilisasi tuntas, dan setiap inkubasi tepat suhu.",
    target: "Lab mikrobiologi, farmasi, industri, pangan, lab terakreditasi",
    ctaText: "Minta SPH hari ini, unit promo terbatas.",
    bonus: [
      "Instalasi dan uji fungsi on-site (Jabodetabek)",
      "Training operator singkat saat instalasi",
      "Konsultasi teknis",
      "Ongkir gratis Jabodetabek"
    ],
    bundleNote: "Beli 2 alat atau lebih dalam 1 PO: prioritas jadwal pengiriman dan instalasi.",
    addOnNote: "Kalibrasi eksternal tersedia sebagai layanan terpisah, hubungi sales untuk penawaran.",
    products: ${JSON.stringify(t2, null, 6)}
  },
  {
    id: "katalog-3",
    number: 3,
    title: "Investasi Lab Seumur Hidup",
    subtitle: "Biosafety & Cold Storage",
    limit: "Plafon Riset & CAPEX",
    theme: "slate-gold",
    headline: "Alat besar bukan pengeluaran. Ini fondasi penelitian 10 tahun ke depan.",
    hook: "Perlindungan maksimal bagi analis dan sampel berharga Anda. Serap anggaran CAPEX akhir tahun dengan instrumen kelas berat.",
    copy: "Bayangkan tim Anda bekerja tanpa khawatir kontaminasi, sampel tersimpan aman, dan auditor mengangguk puas.",
    target: "Rumah sakit, farmasi, bioteknologi, instansi pemerintah, lab R&D korporat",
    ctaText: "Jadwalkan konsultasi dan SPH resmi sebelum 30 Desember.",
    bonus: [
      "Instalasi dan commissioning oleh teknisi",
      "Training operator dan perawatan dasar",
      "Purna jual prioritas",
      "Ongkir gratis Jabodetabek"
    ],
    bundleNote: "Beli 2 unit atau lebih dalam 1 PO: prioritas jadwal pengiriman dan instalasi.",
    addOnNote: "Kalibrasi/validasi (termasuk sertifikasi BSC dan LAF) tersedia sebagai layanan terpisah, hubungi sales untuk penawaran.",
    products: ${JSON.stringify(t3, null, 6)}
  }
];
`;

  fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'promo-akhir-tahun.ts'), content, 'utf8');
  console.log('Successfully generated src/data/promo-akhir-tahun.ts with all 50 ready stock items!');
}

generate().catch(console.error).finally(() => prisma.$disconnect());
