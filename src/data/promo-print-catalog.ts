export interface PrintFeaturedProduct {
  badge: string;
  stock: string;
  title: string;
  modelBrand: string;
  benefitFact: string;
  priceLabel: "Harga:" | "Mulai dari:";
  price: string;
  image: string;
}

export interface PrintTableRow {
  code: string;
  name: string;
  isFeatured?: boolean;
  model: string;
  brand: string;
  price: string;
  stock: string;
}

export interface PrintTierSheet {
  number: 1 | 2 | 3;
  tierCode: "Tier A" | "Tier B" | "Tier C";
  accentColor: "blue" | "teal" | "amber";
  headerBadge: string;
  title: string;
  subtitle: string;
  plafonLabel: string;
  plafonValue: string;
  periodText: string;
  narrative: string;
  featured: PrintFeaturedProduct[];
  tableTitle: string;
  tableSubtitle: string;
  tableRows: PrintTableRow[];
  ctaText: string;
  ctaSub: string;
  footerTier: string;
}

export interface OrderGuideStep {
  step: number;
  title: string;
  desc: string;
}

export interface OrderGuideSheet {
  number: 4;
  title: string;
  subtitle: string;
  steps: OrderGuideStep[];
  terms: {
    label: string;
    value: string;
  }[];
  contacts: {
    company: string;
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    website: string;
  };
}

export const PRINT_TIER_CATALOGS: Record<number, PrintTierSheet> = {
  1: {
    number: 1,
    tierCode: "Tier A",
    accentColor: "blue",
    headerBadge: "ANDISLAB PROMO AKHIR TAHUN • EDISI M3",
    title: "SMART BUDGET CLEARANCE: RP 1–30 JUTA",
    subtitle: "Ready Stock Akhir Tahun — Instrumen Siap Kirim Sebelum Tutup Buku 2026",
    plafonLabel: "RENTANG HARGA",
    plafonValue: "Rp 1–30 Juta",
    periodText: "30 Okt – 30 Des 2026",
    narrative:
      "Katalog Tier A memuat instrumen laboratorium dengan harga di bawah Rp 30 juta untuk percepatan realisasi anggaran operasional dan peremajaan alat uji rutin. Seluruh unit berstatus ready stock untuk mempercepat proses persetujuan dokumen SPH, PO, hingga penerbitan Faktur dan BAST sebelum 30 Desember 2026.",
    featured: [
      {
        badge: "PH METER BENCHTOP",
        stock: "5 Unit Ready",
        title: "pH Meter Benchtop Laboratorium",
        modelBrand: "Model: PH Benchtop • Brand: [ISI BRAND]",
        benefitFact:
          "Dilengkapi lengan elektroda fleksibel dan pembacaan digital stabil untuk kendali mutu harian.",
        priceLabel: "Harga:",
        price: "Rp 12.500.000",
        image: "/images/promo/featured/cat1-ph-meter.png",
      },
      {
        badge: "MIKROSKOP LABORATORIUM",
        stock: "4 Unit Ready",
        title: "Mikroskop Riset & Stereo Zoom",
        modelBrand: "Opto Edu (Trinokular) & Labex SZM-6565 (Stereo Binokular)",
        benefitFact:
          "Tersedia tipe trinokular port kamera dokumentasi dan stereo binokular observasi spesimen 3D.",
        priceLabel: "Mulai dari:",
        price: "Rp 18.731.250",
        image: "/images/promo/featured/cat1-microscope.png",
      },
      {
        badge: "LABORATORY SHAKER",
        stock: "2 Unit Ready",
        title: "Shaker & Agitasi Presisi",
        modelBrand: "Infitek SHK-L710 (Linear) & Taitec RT-50N (Rotator)",
        benefitFact:
          "Kecepatan agitasi terkontrol stabil untuk ekstraksi sampel dan pencampuran homogen bebas tumpah.",
        priceLabel: "Mulai dari:",
        price: "Rp 25.000.000",
        image: "/images/promo/featured/cat1-shaker.jpg",
      },
    ],
    tableTitle: "DAFTAR LENGKAP READY STOCK TIER A (RP 1–30 JUTA)",
    tableSubtitle: "13 Produk Siap Kirim",
    tableRows: [
      {
        code: "A-01",
        name: "pH Meter Benchtop Laboratorium",
        isFeatured: true,
        model: "PH Benchtop",
        brand: "[ISI BRAND]",
        price: "Rp 12.500.000",
        stock: "5 Unit",
      },
      {
        code: "A-02",
        name: "Binocular Zoom Stereo Microscope",
        isFeatured: true,
        model: "SZM-6565",
        brand: "Labex",
        price: "Rp 18.731.250",
        stock: "2 Unit",
      },
      {
        code: "A-03",
        name: "Mikroskop Trinocular Laboratorium",
        isFeatured: true,
        model: "A33.5121-TH",
        brand: "Opto Edu",
        price: "Rp 20.000.000",
        stock: "1 Unit",
      },
      {
        code: "A-04",
        name: "Mikroskop Trinocular Laboratorium",
        isFeatured: true,
        model: "A12.0205-T",
        brand: "Opto Edu",
        price: "Rp 22.500.000",
        stock: "1 Unit",
      },
      {
        code: "A-05",
        name: "Linear Shaker Digital Laboratorium",
        isFeatured: true,
        model: "SHK-L710",
        brand: "Infitek",
        price: "Rp 25.000.000",
        stock: "1 Unit",
      },
      {
        code: "A-06",
        name: "Rotator Shaker Agitasi Presisi",
        isFeatured: true,
        model: "RT-50N",
        brand: "Taitec",
        price: "Rp 25.849.125",
        stock: "1 Unit",
      },
      {
        code: "A-07",
        name: "Scopepad Kamera Mikroskop Digital",
        isFeatured: true,
        model: "LX97",
        brand: "Labex",
        price: "Rp 29.703.750",
        stock: "4 Unit",
      },
      {
        code: "A-08",
        name: "Infrared Thermometer Non-Contact",
        isFeatured: false,
        model: "CAL-01",
        brand: "CAL",
        price: "Rp 1.375.000",
        stock: "3 Unit",
      },
      {
        code: "A-09",
        name: "Digital Penetration Probe Thermometer",
        isFeatured: false,
        model: "HI98501",
        brand: "Hanna Instruments",
        price: "Rp 2.393.750",
        stock: "2 Unit",
      },
      {
        code: "A-10",
        name: "Vacuum Pump Laboratorium",
        isFeatured: false,
        model: "VE115N",
        brand: "Value",
        price: "Rp 2.585.625",
        stock: "1 Unit",
      },
      {
        code: "A-11",
        name: "Colony Counter Digital Mikroba",
        isFeatured: false,
        model: "CC-J2S",
        brand: "Infitek",
        price: "Rp 10.000.000",
        stock: "1 Unit",
      },
      {
        code: "A-12",
        name: "Kursi Donor Medis & Sampling",
        isFeatured: false,
        model: "Kursi Donor",
        brand: "AndisLab",
        price: "Rp 6.000.000",
        stock: "1 Unit",
      },
      {
        code: "A-13",
        name: "Scrub Station 1 Person Hands-Free",
        isFeatured: false,
        model: "Scrub 1P",
        brand: "AndisLab",
        price: "Rp 25.000.000",
        stock: "1 Unit",
      },
    ],
    ctaText:
      "READY STOCK AKHIR TAHUN (RP 1–30 JUTA): Hubungi tim sales untuk ketersediaan unit, penawaran [ISI: diskon/paket], dan penerbitan SPH resmi hari ini.",
    ctaSub: "KUNCI STOK SEKARANG • www.andislab.com",
    footerTier: "Tier A: Rentang Rp 1–30 Juta",
  },

  2: {
    number: 2,
    tierCode: "Tier B",
    accentColor: "teal",
    headerBadge: "ANDISLAB PROMO AKHIR TAHUN • EDISI M3",
    title: "CORE ANALYTICAL & STERILIZATION: >RP 30–70 JUTA",
    subtitle: "Instrumen Inti Uji Kuantitatif & Sterilitas — Mendukung Kebutuhan Lab Terakreditasi",
    plafonLabel: "RENTANG HARGA",
    plafonValue: ">Rp 30–70 Jt",
    periodText: "30 Okt – 30 Des 2026",
    narrative:
      "Katalog Tier B menghadirkan instrumen analitik dan sterilisasi laboratorium esensial bagi pengujian mutu terakreditasi. Ditujukan untuk laboratorium QA/QC, farmasi, dan riset dengan jaminan unit ready stock guna menghindari antrean indent dan memastikan pengadaan terealisasi tepat waktu.",
    featured: [
      {
        badge: "AUTOCLAVE VERTIKAL",
        stock: "4 Unit Ready",
        title: "Autoclave Sterilisasi Vertikal Otomatis",
        modelBrand: "Daihan Labtech LAC-1011SV & LAC-1021SV",
        benefitFact:
          "Siklus sterilisasi uap mikroprosesor otomatis untuk dekontaminasi instrumen dan media mikrobiologi.",
        priceLabel: "Mulai dari:",
        price: "Rp 59.125.000",
        image: "/images/promo/featured/cat2-autoclave.png",
      },
      {
        badge: "ANALYTICAL BALANCE",
        stock: "1 Unit Ready",
        title: "Timbangan Analitik Presisi",
        modelBrand: "Infitek BA-N503",
        benefitFact:
          "Dilengkapi pelindung angin kaca 3 sisi dengan pembacaan responsif untuk analisis kuantitatif.",
        priceLabel: "Harga:",
        price: "Rp 30.164.000",
        image: "/images/promo/featured/cat2-balance.png",
      },
      {
        badge: "LABORATORY INCUBATOR",
        stock: "1 Unit Ready",
        title: "Inkubator Laboratorium Presisi",
        modelBrand: "Yamato IC413C",
        benefitFact:
          "Distribusi panas merata dan kestabilan suhu chamber untuk optimasi pertumbuhan kultur mikroba.",
        priceLabel: "Harga:",
        price: "Rp 66.600.000",
        image: "/images/promo/featured/cat2-incubator.png",
      },
    ],
    tableTitle: "DAFTAR LENGKAP READY STOCK TIER B (>RP 30–70 JUTA)",
    tableSubtitle: "8 Produk Siap Kirim",
    tableRows: [
      {
        code: "B-01",
        name: "Analytical Balance Presisi Laboratorium",
        isFeatured: true,
        model: "BA-N503",
        brand: "Infitek",
        price: "Rp 30.164.000",
        stock: "1 Unit",
      },
      {
        code: "B-02",
        name: "Benchtop Conductivity Meter Profesional",
        isFeatured: false,
        model: "510",
        brand: "Aelab",
        price: "Rp 37.462.500",
        stock: "1 Unit",
      },
      {
        code: "B-03",
        name: "Pass Box 400 (Cleanroom Transfer Window)",
        isFeatured: false,
        model: "Pass Box 400",
        brand: "AndisLab",
        price: "Rp 37.500.000",
        stock: "4 Unit",
      },
      {
        code: "B-04",
        name: "Aluminum Block Bath Dry Thermo Unit",
        isFeatured: false,
        model: "DTU-R",
        brand: "Taitec",
        price: "Rp 51.458.906",
        stock: "2 Unit",
      },
      {
        code: "B-05",
        name: "Pharmacy Refrigerator Penyimpanan Reagen & Vaksin",
        isFeatured: false,
        model: "YC-130L",
        brand: "Meling",
        price: "Rp 56.250.000",
        stock: "1 Unit",
      },
      {
        code: "B-06",
        name: "Autoclave Sterilisasi Vertikal Otomatis",
        isFeatured: true,
        model: "LAC-1011SV",
        brand: "Daihan Labtech",
        price: "Rp 59.125.000",
        stock: "2 Unit",
      },
      {
        code: "B-07",
        name: "Incubator Laboratorium Presisi",
        isFeatured: true,
        model: "IC413C",
        brand: "Yamato",
        price: "Rp 66.600.000",
        stock: "1 Unit",
      },
      {
        code: "B-08",
        name: "Autoclave Vertikal Otomatis Kapasitas Besar",
        isFeatured: true,
        model: "LAC-1021SV",
        brand: "Daihan Labtech",
        price: "Rp 66.625.000",
        stock: "2 Unit",
      },
    ],
    ctaText:
      "READY STOCK AKHIR TAHUN (>RP 30–70 JUTA): Unit instrumen inti analitik dan sterilisasi bergaransi resmi. Hubungi sales untuk SPH dan alokasi unit segera.",
    ctaSub: "TERBITKAN SPH HARI INI • www.andislab.com",
    footerTier: "Tier B: Rentang >Rp 30–70 Juta",
  },

  3: {
    number: 3,
    tierCode: "Tier C",
    accentColor: "amber",
    headerBadge: "ANDISLAB PROMO AKHIR TAHUN • EDISI M3",
    title: "HIGH-END BIOSAFETY & COLD STORAGE: >RP 70–200 JUTA",
    subtitle: "Proteksi Personel, Sampel & Ruang Kerja Lab Berstandar Industri",
    plafonLabel: "RENTANG HARGA",
    plafonValue: ">Rp 70–200 Jt",
    periodText: "30 Okt – 30 Des 2026",
    narrative:
      "Katalog Tier C mencakup instrumen biosafety dan cold storage suhu ekstrem untuk perlindungan analis serta penyimpanan sampel bernilai tinggi. Tersedia unit Laminar Air Flow, Biosafety Cabinet Kelas II A2, dan Ultra-Low Freezer bersertifikasi resmi yang siap dikirim langsung sebelum 30 Desember 2026.",
    featured: [
      {
        badge: "LAMINAR AIR FLOW",
        stock: "2 Unit Ready",
        title: "Laminar Air Flow Vertikal",
        modelBrand: "Model: LAF 1000 V • Brand: AndisLab",
        benefitFact:
          "Sistem filtrasi HEPA vertikal dengan manometer pemantau tekanan untuk area kerja mikrobiologi steril.",
        priceLabel: "Harga:",
        price: "Rp 76.250.000",
        image: "/images/promo/featured/cat3-laf.png",
      },
      {
        badge: "BIOSAFETY CABINET",
        stock: "1 Unit Ready",
        title: "Biosafety Cabinet Kelas II A2",
        modelBrand: "Model: LCB-0123-A2 • Brand: Labtech",
        benefitFact:
          "Sirkulasi udara terproteksi untuk keselamatan kerja personel, sterilitas sampel, dan keamanan lingkungan lab.",
        priceLabel: "Harga:",
        price: "Rp 87.500.000",
        image: "/images/promo/featured/cat3-bsc.png",
      },
      {
        badge: "ULT FREEZER & STORAGE",
        stock: "7 Unit Ready",
        title: "Medical & Ultra-Low Freezer (-86°C)",
        modelBrand: "Daihan Labtech LLF-403SR & LDF Series",
        benefitFact:
          "Insulasi termal rapat dengan sistem alarm ganda untuk penyimpanan jangka panjang sampel kritis.",
        priceLabel: "Mulai dari:",
        price: "Rp 79.875.000",
        image: "/images/promo/featured/cat3-freezer.png",
      },
    ],
    tableTitle: "DAFTAR LENGKAP READY STOCK TIER C (>RP 70–200 JUTA)",
    tableSubtitle: "14 Produk Siap Kirim",
    tableRows: [
      {
        code: "C-01",
        name: "Vaccine Refrigerator",
        isFeatured: false,
        model: "LCV-203GR",
        brand: "Daihan Labtech",
        price: "Rp 72.375.000",
        stock: "1 Unit",
      },
      {
        code: "C-02",
        name: "Laminar Air Flow (LAF) 1000 Vertikal",
        isFeatured: true,
        model: "LAF 1000 V",
        brand: "AndisLab",
        price: "Rp 76.250.000",
        stock: "2 Unit",
      },
      {
        code: "C-03",
        name: "Inkubator CO2 Air Jacket",
        isFeatured: false,
        model: "LCO-065AI",
        brand: "Daihan Labtech",
        price: "Rp 79.812.500",
        stock: "4 Unit",
      },
      {
        code: "C-04",
        name: "Medical Laboratory Freezer",
        isFeatured: true,
        model: "LLF-403SR",
        brand: "Daihan Labtech",
        price: "Rp 79.875.000",
        stock: "3 Unit",
      },
      {
        code: "C-05",
        name: "Autoklaf Kapasitas Besar",
        isFeatured: false,
        model: "LAC-50455P",
        brand: "Labtech",
        price: "Rp 81.250.000",
        stock: "1 Unit",
      },
      {
        code: "C-06",
        name: "Autoclave Vertikal",
        isFeatured: false,
        model: "LAC-1031SV",
        brand: "Daihan Labtech",
        price: "Rp 82.062.500",
        stock: "3 Unit",
      },
      {
        code: "C-07",
        name: "Drying Oven Presisi",
        isFeatured: false,
        model: "DKN413C",
        brand: "Yamato",
        price: "Rp 84.498.750",
        stock: "1 Unit",
      },
      {
        code: "C-08",
        name: "Biosafety Cabinet (BSC) Kelas II A2 Ukuran Besar",
        isFeatured: true,
        model: "LCB-0123-A2",
        brand: "Labtech",
        price: "Rp 87.500.000",
        stock: "1 Unit",
      },
      {
        code: "C-09",
        name: "Pass Box Dynamic (Air Shower Interlock)",
        isFeatured: false,
        model: "Pass Box Dynamic",
        brand: "AndisLab",
        price: "Rp 87.500.000",
        stock: "1 Unit",
      },
      {
        code: "C-10",
        name: "Autoclave Vacuum Drying",
        isFeatured: false,
        model: "LAC-1031SVF",
        brand: "Daihan Labtech",
        price: "Rp 87.312.500",
        stock: "1 Unit",
      },
      {
        code: "C-11",
        name: "Upright Ultra Low Freezer",
        isFeatured: true,
        model: "LDF-9010U",
        brand: "Daihan Labtech",
        price: "Rp 139.187.500",
        stock: "2 Unit",
      },
      {
        code: "C-12",
        name: "Chest Ultra Low Freezer",
        isFeatured: true,
        model: "LDF-9015S",
        brand: "Daihan Labtech",
        price: "Rp 143.812.500",
        stock: "1 Unit",
      },
      {
        code: "C-13",
        name: "Water Purificator",
        isFeatured: false,
        model: "Expe-CB [VERIFIKASI: Expe-CB Ele 10-M]",
        brand: "Puris Mirae ST",
        price: "Rp 162.500.000",
        stock: "1 Unit",
      },
      {
        code: "C-14",
        name: "Upright Ultra Low Freezer Kapasitas Ekstra",
        isFeatured: true,
        model: "LDF-9020U",
        brand: "Daihan Labtech",
        price: "Rp 164.625.000",
        stock: "1 Unit",
      },
    ],
    ctaText:
      "READY STOCK AKHIR TAHUN (>RP 70–200 JUTA): Unit biosafety dan cold storage bergaransi resmi siap kirim sebelum tutup buku. Hubungi tim sales kami untuk penerbitan SPH dan konfirmasi pengiriman.",
    ctaSub: "HUBUNGI KAMI SEKARANG • www.andislab.com",
    footerTier: "Tier C: Rentang >Rp 70–200 Juta",
  },
};

export const ORDER_GUIDE_SHEET: OrderGuideSheet = {
  number: 4,
  title: "PANDUAN PEMESANAN & SYARAT PENGADAAN",
  subtitle: "Tata Cara Pemesanan Resmi & Ketentuan Transaksi Akhir Tahun 2026",
  steps: [
    {
      step: 1,
      title: "Hubungi Tim Sales & Konsultasi Spesifikasi",
      desc: "Sampaikan kebutuhan teknis alat, estimasi kuantitas, dan identitas instansi via WhatsApp [ISI: No. WhatsApp], Email [ISI: Email], atau telepon [ISI: Telepon].",
    },
    {
      step: 2,
      title: "Penerbitan Surat Penawaran Harga (SPH) Resmi",
      desc: "Tim kami menerbitkan SPH resmi berisi spesifikasi teknis lengkap, nomor registrasi penawaran, ketersediaan unit ready stock, serta faktur proforma.",
    },
    {
      step: 3,
      title: "Penerbitan PO, Pembayaran & Pengiriman",
      desc: "Setelah Purchase Order (PO) disetujui, unit dikirim ke lokasi beserta instalasi, pengujian fungsi, BAST (Berita Acara Serah Terima), dan Faktur Pajak resmi.",
    },
  ],
  terms: [
    {
      label: "Jadwal Cut-Off Pengiriman Akhir Tahun",
      value:
        "PO diterima paling lambat 15 Desember 2026 (Luar Pulau Jawa) dan 22 Desember 2026 (Pulau Jawa) untuk penuntasan BAST dan Faktur Pajak sebelum 30 Desember 2026.",
    },
    {
      label: "Skema Diskon & Syarat Pembayaran",
      value:
        "Tersedia diskon bertingkat resmi: Diskon 5% (DP 30% atau DP 10% tempo 2 minggu); Diskon 10% (DP 50% atau DP 30% tempo 2 minggu); Diskon 15% (Cash keras / DP 50% tempo 2 minggu); atau Normal 0% (Tempo kredit instansi 30 hari setelah BAST).",
    },
    {
      label: "Layanan Instalasi & Pelatihan",
      value:
        "Gratis biaya instalasi, uji fungsi (QC), dan pelatihan operator untuk area Jabodetabek. Wilayah luar Jabodetabek dilayani sesuai kesepakatan tertulis.",
    },
    {
      label: "Garansi & Layanan Purna Jual",
      value:
        "Garansi resmi servis dan suku cadang selama 12 bulan dari prinsipal resmi didukung teknisi tersertifikasi.",
    },
    {
      label: "Legalitas & Izin Edar",
      value:
        "Memiliki kelengkapan legalitas distributor resmi alat laboratorium, Faktur Pajak elektronik, dan sertifikat mutu prinsipal.",
    },
    {
      label: "Ketersediaan Jalur Pengadaan",
      value:
        "Melayani PO resmi instansi, pengadaan langsung B2B swasta, serta koordinasi via e-Katalog LKPP / SIPLah untuk universitas & instansi pemerintah.",
    },
  ],
  contacts: {
    company: "PT Andis Sentral Laboratorium",
    address: "Pergudangan & Kantor Operasional AndisLab, Jabodetabek",
    phone: "+62 819-9157-5096",
    whatsapp: "+62 819-9157-5096",
    email: "sales@andislab.com",
    website: "www.andislab.com",
  },
};

export const COMMON_PRINT_FOOTER =
  "*Harga belum termasuk PPN • Unit Ready Stock per 30 Oktober 2026 • Garansi resmi 12 bulan • Pengiriman 3–7 hari kerja • Gudang Jabodetabek • Penawaran berlaku s/d 30 Des 2026 • Gambar merupakan ilustrasi produk.";
