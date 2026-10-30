export interface PromoProduct {
  code?: string;
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
    message: "Kunci stok dan alokasi unit sekarang selagi stok masih lengkap. SPH resmi 1x24 jam ber-KOP untuk pengajuan anggaran Anda.",
  },
  {
    id: "serapan",
    name: "Serapan Anggaran",
    start: "2026-11-21T00:00:00+07:00",
    end: "2026-12-15T23:59:59+07:00",
    message: "Realisasi anggaran belanja akhir tahun. Unit ready stock di gudang Jabodetabek menjamin penerbitan Faktur & BAST tuntas 2026.",
  },
  {
    id: "last-call",
    name: "Last Call",
    start: "2026-12-16T00:00:00+07:00",
    end: "2026-12-30T23:59:59+07:00",
    message: "Masa pengiriman akhir tahun. Hubungi sales untuk konfirmasi ketersediaan unit fisik dan pengiriman kilat sebelum tutup buku.",
  },
] as const;

export type PromoPaymentMethodId = "cash" | "dp50" | "dp30" | "tempo30";

export interface PromoPaymentTier {
  id: PromoPaymentMethodId;
  discountPercent: number;
  discount: string;
  shortLabel: string;
  terms: string;
  eligibility: string;
  highlight?: boolean;
}

export const promoPaymentTiers: PromoPaymentTier[] = [
  {
    id: "cash",
    discountPercent: 8,
    discount: "Diskon 8%",
    shortLabel: "Tunai / Cash (-8%)",
    terms: "Pelunasan di Muka (Cash) Sebelum Pengiriman",
    eligibility: "Potongan harga maksimal untuk pembayaran langsung / pelunasan tunai sebelum unit dikirim.",
    highlight: true,
  },
  {
    id: "dp50",
    discountPercent: 5,
    discount: "Diskon 5%",
    shortLabel: "DP 50% (-5%)",
    terms: "DP 50% Saat PO, Pelunasan Sebelum Kirim / BAST (Maks. 14 Hari)",
    eligibility: "Skema promo paling diminati universitas, klinik, & industri untuk efisiensi anggaran belanja.",
  },
  {
    id: "dp30",
    discountPercent: 3,
    discount: "Diskon 3%",
    shortLabel: "DP 30% (-3%)",
    terms: "DP 30% Saat PO, Pelunasan Tempo 14 Hari",
    eligibility: "Komitmen uang muka ringan untuk mengunci stok fisik dan percepatan serapan anggaran.",
  },
  {
    id: "tempo30",
    discountPercent: 0,
    discount: "Harga Normal (0%)",
    shortLabel: "Tempo 30 Hari (0%)",
    terms: "Kredit Standar Instansi (Tempo 30 Hari Setelah BAST)",
    eligibility: "Pengadaan resmi APBN/APBD/BUMN dengan pembayaran pasca serah terima barang + Bonus Gratis Ongkir.",
  },
];

export const terms: string[] = [
  "Promo berlaku 30 Oktober - 30 Desember 2026 atau selama persediaan unit ready stock masih ada.",
  "Besaran diskon promo menyesuaikan cara pembayaran: Diskon 8% (Pelunasan Tunai/Cash sebelum kirim), Diskon 5% (DP 50% pelunasan maks. 14 hari), Diskon 3% (DP 30% tempo 14 hari), atau Harga Katalog Normal 0% (Tempo kredit instansi 30 hari pasca BAST).",
  "Gratis ongkos kirim berlaku untuk area Jabodetabek. Di luar Jabodetabek, ekspedisi dihitung terpisah sesuai kesepakatan.",
  "Instalasi dan uji fungsi QC dilakukan langsung on-site di area Jabodetabek; di luar area dilakukan sesuai kesepakatan tertulis.",
  "Faktur Pajak elektronik dan BAST resmi diproses sebelum tutup buku untuk PO yang masuk sebelum batas cut-off (22 Des untuk Jawa, 15 Des untuk Luar Jawa).",
  "Garansi resmi servis dan suku cadang selama 12 bulan dari prinsipal didukung teknisi tersertifikasi."
];

export const catalogs: PromoCatalog[] = [
  {
    id: "katalog-1",
    number: 1,
    title: "Smart Budget Clearance",
    subtitle: "Instrumen Uji Rutin & Penunjang",
    limit: "Rp 1 – 30 Juta",
    theme: "blue-amber",
    headline: "Peremajaan Instrumen Harian Laboratorium Tanpa Antrean Indent.",
    hook: "Unit ready stock siap kirim untuk percepatan serapan anggaran operasional.",
    copy: "Instrumen laboratorium presisi untuk pengujian mutu rutin harian dengan dokumen penawaran resmi dan jaminan mutu.",
    target: "Lab QC rutin, R&D dasar, universitas, klinik, F&B",
    ctaText: "Amankan alokasi unit Anda sebelum kuota akhir tahun terpenuhi.",
    bonus: [
      "Gratis ongkir Jabodetabek",
      "Uji fungsi QC sebelum kirim",
      "Draft SPJ & BAST resmi disiapkan",
      "Faktur Pajak & surat garansi resmi"
    ],
    bundleNote: "Pengadaan 2 unit atau lebih dalam 1 PO: prioritas jadwal pengiriman dan uji fungsi.",
    addOnNote: "",
    products: [
      {
        code: "A-01",
        slug: "ph-meter-benchtop-standar",
        name: "pH Meter Benchtop Laboratorium",
        model: "PH Benchtop",
        brand: "Aelab",
        normalPrice: 12500000,
        promoPrice: 11500000,
        stock: 5,
        specLine: "Dilengkapi lengan elektroda fleksibel dan pembacaan digital stabil",
        hook: "Pembacaan pH stabil, rilis QC tidak tertahan.",
        image: "/images/promo/featured/cat1-ph-meter.png"
      },
      {
        code: "A-02",
        slug: "binocular-zoom-stereo-microscope-szm-6565",
        name: "Binocular Zoom Stereo Microscope",
        model: "SZM-6565",
        brand: "Labex",
        normalPrice: 18731250,
        promoPrice: 17232750,
        stock: 2,
        specLine: "Sistem optik stereo zoom untuk observasi spesimen 3D",
        hook: "Pengamatan detail 3D tanpa mata cepat lelah.",
        image: "/images/products/stereo-microscope-szm-6565-labex.jpg"
      },
      {
        code: "A-03",
        slug: "mikroskop-trinocular-a33-5121-th",
        name: "Mikroskop Trinocular Laboratorium",
        model: "A33.5121-TH",
        brand: "Opto Edu",
        normalPrice: 20000000,
        promoPrice: 18400000,
        stock: 1,
        specLine: "Head trinokular dengan port kamera mikroskop digital",
        hook: "Mikroskop trinokular tajam untuk riset dan akademik.",
        image: "/images/products/microscope-trinocular-a33-5121-th-optoedu.jpg"
      },
      {
        code: "A-04",
        slug: "mikroskop-trinocular-a12-0205-t",
        name: "Mikroskop Trinocular Laboratorium",
        model: "A12.0205-T",
        brand: "Opto Edu",
        normalPrice: 22500000,
        promoPrice: 20700000,
        stock: 1,
        specLine: "Optik jernih untuk pengamatan biologis intensif",
        hook: "Visual jernih untuk pemakaian intensif dan dokumentasi.",
        image: "/images/products/microscope-trinocular-a12-0205-t-optoedu.jpg"
      },
      {
        code: "A-05",
        slug: "linear-shaker-shk-l710",
        name: "Linear Shaker Digital Laboratorium",
        model: "SHK-L710",
        brand: "Infitek",
        normalPrice: 25000000,
        promoPrice: 23000000,
        stock: 1,
        specLine: "Gerakan resiprokal linier dengan kontrol digital",
        hook: "Pencampuran sampel yang konsisten bebas tumpah.",
        image: "/images/products/linear-shaker-shk-l710-infitek.jpg"
      },
      {
        code: "A-06",
        slug: "rotator-shaker-rt-50n",
        name: "Rotator Shaker",
        model: "RT-50N",
        brand: "Taitec",
        normalPrice: 25849125,
        promoPrice: 23781195,
        stock: 1,
        specLine: "Agitasi rotasi end-over-end presisi standar riset Jepang",
        hook: "Agitasi end-over-end presisi standar riset Jepang.",
        image: "/images/products/rotator-rt-50n-taitec.jpg"
      },
      {
        code: "A-07",
        slug: "scopepad-lx97",
        name: "Scopepad Kamera Mikroskop",
        model: "LX97",
        brand: "Labex",
        normalPrice: 29703750,
        promoPrice: 27327450,
        stock: 4,
        specLine: "Layar tablet terintegrasi kamera mikroskop resolusi tinggi",
        hook: "Dokumentasi visual mikroskop digital real-time.",
        image: "/images/products/scopepad-lx97-labex.jpg"
      },
      {
        code: "A-08",
        slug: "infrared-thermometer-cal-01",
        name: "Infrared Thermometer",
        model: "CAL-01",
        brand: "CAL",
        normalPrice: 1375000,
        promoPrice: 1265000,
        stock: 3,
        specLine: "Pengukuran suhu instan non-kontak",
        hook: "Pengukuran suhu cepat tanpa risiko kontaminasi silang.",
        image: "/images/products/infrared-thermometer-cal-01.jpg"
      },
      {
        code: "A-09",
        slug: "digital-penetration-probe-hi98501",
        name: "Digital Penetration Probe",
        model: "HI98501",
        brand: "Hanna Instruments",
        normalPrice: 2393750,
        promoPrice: 2202250,
        stock: 2,
        specLine: "Probe stainless steel penetrasi sampel semi-padat dan cairan",
        hook: "Pengukuran temperatur inti sampel presisi dan andal.",
        image: "/images/products/digital-thermometer-hi98501-hanna.jpg"
      },
      {
        code: "A-10",
        slug: "vacuum-pump-ve115n",
        name: "Vacuum Pump Laboratorium",
        model: "VE115N",
        brand: "Value",
        normalPrice: 2585625,
        promoPrice: 2378775,
        stock: 1,
        specLine: "Daya hisap vakum stabil untuk sistem filtrasi lab",
        hook: "Daya hisap vakum stabil untuk filtrasi laboratorium.",
        image: "/images/products/vacuum-pump-ve115n-value.jpg"
      },
      {
        code: "A-11",
        slug: "colony-counter-cc-j2s",
        name: "Colony Counter Digital",
        model: "CC-J2S",
        brand: "Infitek",
        normalPrice: 10000000,
        promoPrice: 9200000,
        stock: 1,
        specLine: "Penghitung koloni digital sensor tekanan dan lampu iluminasi",
        hook: "Pencacahan koloni mikroba cepat dan akurat.",
        image: "/images/products/colony-counter-infitek-cc-j2s.jpg"
      },
      {
        code: "A-12",
        slug: "kursi-donor-medis",
        name: "Kursi Donor Medis",
        model: "Kursi Donor",
        brand: "AndisLab",
        normalPrice: 6000000,
        promoPrice: 5520000,
        stock: 1,
        specLine: "Rangka ergonomis stabil untuk pengambilan sampel darah",
        hook: "Kenyamanan maksimal pasien sampling dan transfusi.",
        image: "/images/products/kursi-donor-medis-andislab.jpg"
      },
      {
        code: "A-13",
        slug: "scrub-station-1-person",
        name: "Scrub Station 1 Person",
        model: "SS-1P Custom",
        brand: "AndisLab",
        normalPrice: 25000000,
        promoPrice: 23000000,
        stock: 1,
        specLine: "Wastafel steril operasional sensor hands-free",
        hook: "Sanitasi otomatis hands-free standar ruang steril.",
        image: "/images/products/scrub-station-1-person-andislab.jpg"
      }
    ]
  },
  {
    id: "katalog-2",
    number: 2,
    title: "Core Analytical & Sterilization",
    subtitle: "Instrumen Inti Uji Kuantitatif & Sterilitas",
    limit: "Rp 30 – 70 Juta",
    theme: "navy-teal",
    headline: "Instrumen Inti Terakreditasi Siap Kirim Sebelum Tutup Buku Finansial.",
    hook: "Autoclave, timbangan analitik, dan incubator ready stock gudang.",
    copy: "Solusi peralatan analitik esensial bagi laboratorium QA/QC industri, universitas, dan rumah sakit dengan jaminan unit fisik.",
    target: "Industri farmasi, QC manufaktur, lab mikrobiologi, balai penelitian",
    ctaText: "Minta SPH resmi ber-KOP surat untuk pengajuan anggaran Anda.",
    bonus: [
      "Gratis ongkir Jabodetabek",
      "Instalasi & uji fungsi on-site",
      "Protokol kelaikan QC & sertifikat kalibrasi",
      "Dokumen SPJ, Faktur Pajak & BAST lengkap"
    ],
    bundleNote: "Pengadaan paket unit instrumen: dapatkan prioritas pengiriman teknisi on-site.",
    addOnNote: "",
    products: [
      {
        code: "B-01",
        slug: "analytical-balance-ba-n503",
        name: "Analytical Balance Presisi Laboratorium",
        model: "BA-N503",
        brand: "Infitek",
        normalPrice: 30164000,
        promoPrice: 27750880,
        stock: 1,
        specLine: "Draft shield kaca 3 sisi dengan keterbacaan analitik akurat",
        hook: "Penimbangan presisi tinggi dasar analisis kuantitatif.",
        image: "/images/products/analytical-balance-ba-n503-infitek.jpg"
      },
      {
        code: "B-02",
        slug: "autoclave-lac-1011sv",
        name: "Autoclave Sterilisasi Vertikal Otomatis",
        model: "LAC-1011SV",
        brand: "Daihan Labtech",
        normalPrice: 59125000,
        promoPrice: 54395000,
        stock: 2,
        specLine: "Kapasitas 45L kontrol mikroprosesor digital sertifikasi CE",
        hook: "Sterilisasi uap bertekanan otomatis untuk media dan alat lab.",
        image: "/images/promo/featured/cat2-autoclave.png"
      },
      {
        code: "B-03",
        slug: "incubator-ic413c-yamato",
        name: "Incubator Laboratorium Presisi Jepang",
        model: "IC413C",
        brand: "Yamato",
        normalPrice: 66600000,
        promoPrice: 61272000,
        stock: 1,
        specLine: "Kapasitas 97L konveksi alami akurasi suhu tinggi standar Jepang",
        hook: "Distribusi suhu merata untuk kestabilan kultur mikrobiologi.",
        image: "/images/promo/featured/cat2-incubator.png"
      },
      {
        code: "B-04",
        slug: "autoclave-lac-1021sv",
        name: "Autoclave Vertikal Otomatis Kapasitas Lebih Besar",
        model: "LAC-1021SV",
        brand: "Daihan Labtech",
        normalPrice: 66625000,
        promoPrice: 61295000,
        stock: 2,
        specLine: "Kapasitas 60L chamber stainless steel tebal dan katup pengaman ganda",
        hook: "Kapasitas sterilisasi lebih besar untuk volume pengujian tinggi.",
        image: "/images/daihanreadystock/LAC-1021SV AUTOCLAVE.webp"
      },
      {
        code: "B-05",
        slug: "conductivity-meter-510-aelab",
        name: "Benchtop Conductivity Meter Profesional",
        model: "510",
        brand: "Aelab",
        normalPrice: 37462500,
        promoPrice: 34465500,
        stock: 1,
        specLine: "Pengukuran konduktivitas, TDS, dan salinitas multi-range",
        hook: "Akurasi pengukuran konduktivitas untuk analisis air murni & larutan.",
        image: "/images/products/conductivity-meter-benchtop-510-aelab.jpg"
      },
      {
        code: "B-06",
        slug: "pass-box-400-andislab",
        name: "Pass Box 400 (Cleanroom Transfer Window)",
        model: "Pass Box 400",
        brand: "AndisLab",
        normalPrice: 37500000,
        promoPrice: 34500000,
        stock: 4,
        specLine: "Sistem interlock mekanis pintu ganda stainless steel SUS 304",
        hook: "Transfer material steril antar-ruangan tanpa kontaminasi silang.",
        image: "/images/products/pass-box-400-andislab.jpg"
      },
      {
        code: "B-07",
        slug: "aluminum-block-bath-dtu-r-taitec",
        name: "Aluminum Block Bath Dry Thermo Unit",
        model: "DTU-R",
        brand: "Taitec",
        normalPrice: 51458906,
        promoPrice: 47342194,
        stock: 2,
        specLine: "Pemanas dry block mikroprosesor presisi tinggi buatan Jepang",
        hook: "Pemanasan kering sampel tabung reaksi stabil tanpa media air.",
        image: "/images/readystock16/Aluminum block bath DTU-R Taitec.jpg"
      },
      {
        code: "B-08",
        slug: "pharmacy-refrigerator-yc-130l-meling",
        name: "Pharmacy Refrigerator",
        model: "YC-130L",
        brand: "Meling",
        normalPrice: 56250000,
        promoPrice: 51750000,
        stock: 1,
        specLine: "Pendingin farmasi 2°C–8°C dengan sistem alarm suhu terpadu",
        hook: "Penyimpanan reagen dan vaksin terstandarisasi rantai dingin.",
        image: "/images/products/pharmacy-refrigerator-yc-130l-meling.jpg"
      }
    ]
  },
  {
    id: "katalog-3",
    number: 3,
    title: "Biosafety & Cold Storage",
    subtitle: "Solusi Suhu Ekstrem & Proteksi Personel",
    limit: "Rp 70 – 200 Juta",
    theme: "slate-gold",
    headline: "Instrumen Kritis Biosafety dan Suhu Ekstrem untuk Perlindungan Jangka Panjang.",
    hook: "Laminar Air Flow, BSC Kelas II A2, dan Ultra-Low Freezer ready stock.",
    copy: "Perlindungan maksimal bagi keselamatan analis, sterilitas sampel, dan keandalan penyimpanan biobank jangka panjang.",
    target: "Rumah sakit, farmasi, bioteknologi, instansi pemerintah, lab R&D korporat",
    ctaText: "Jadwalkan konsultasi spesifikasi teknis dan SPH resmi sebelum 30 Desember.",
    bonus: [
      "Instalasi dan commissioning on-site",
      "Training operator dan perawatan dasar",
      "Purna jual prioritas & ketersediaan spare parts",
      "Gratis ongkir Jabodetabek"
    ],
    bundleNote: "Pengadaan unit biosafety & cold storage: prioritas jadwal pengiriman khusus teknisi tersertifikasi.",
    addOnNote: "Layanan kalibrasi/validasi pihak ketiga (termasuk sertifikasi BSC dan LAF) dapat dikoordinasikan sesuai kebutuhan.",
    products: [
      {
        code: "C-01",
        slug: "laminar-air-flow-laf-1000-v",
        name: "Laminar Air Flow (LAF) 1000 Vertikal Custom",
        model: "LAF 1000 V",
        brand: "AndisLab",
        normalPrice: 76250000,
        promoPrice: 70150000,
        stock: 2,
        specLine: "HEPA Filter efisiensi 99.99% aliran vertikal dengan pre-filter dan UV sterilizer",
        hook: "Area kerja steril mikrobiologi terlindung dari kontaminasi partikel.",
        image: "/images/promo/featured/cat3-laf.png"
      },
      {
        code: "C-02",
        slug: "biosafety-cabinet-lcb-0123-a2",
        name: "Biosafety Cabinet Kelas II A2 Ukuran Besar",
        model: "LCB-0123-A2",
        brand: "Labtech",
        normalPrice: 87500000,
        promoPrice: 80500000,
        stock: 1,
        specLine: "Kelas II Tipe A2 resirkulasi 70% dan exhaust 30% HEPA filter",
        hook: "Proteksi penuh operator, produk, dan lingkungan laboratorium biohazard.",
        image: "/images/promo/featured/cat3-bsc.png"
      },
      {
        code: "C-03",
        slug: "medical-laboratory-freezer-llf-403sr",
        name: "Medical Laboratory Freezer",
        model: "LLF-403SR",
        brand: "Daihan Labtech",
        normalPrice: 79875000,
        promoPrice: 73485000,
        stock: 3,
        specLine: "Freezer medis rentang suhu -15°C hingga -25°C kapasitas 300L",
        hook: "Penyimpanan plasma darah dan spesimen biologis suhu beku stabil.",
        image: "/images/promo/featured/cat3-freezer.png"
      },
      {
        code: "C-04",
        slug: "upright-ultra-low-freezer-ldf-9010u",
        name: "Upright Ultra Low Freezer",
        model: "LDF-9010U",
        brand: "Daihan Labtech",
        normalPrice: 139187500,
        promoPrice: 128052500,
        stock: 2,
        specLine: "Suhu ultra rendah -86°C tipe tegak dengan insulasi vakum VIP",
        hook: "Preservasi jangka panjang DNA/RNA dan sel induk pada -86°C.",
        image: "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-ldf-9010u-ultra-low-temp-freezer-transparent.png"
      },
      {
        code: "C-05",
        slug: "chest-ultra-low-freezer-ldf-9015s",
        name: "Chest Ultra Low Freezer",
        model: "LDF-9015S",
        brand: "Daihan Labtech",
        normalPrice: 143812500,
        promoPrice: 132307500,
        stock: 1,
        specLine: "Tipe chest bukaan atas retensi dingin maksimal saat pintu terbuka",
        hook: "Retensi suhu stabil efisiensi tinggi untuk bank sampel kritis.",
        image: "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-ldf-9015s-ultra-low-temp-freezer-transparent.png"
      },
      {
        code: "C-06",
        slug: "upright-ultra-low-freezer-ldf-9020u",
        name: "Upright Ultra Low Freezer Kapasitas Ekstra",
        model: "LDF-9020U",
        brand: "Daihan Labtech",
        normalPrice: 164625000,
        promoPrice: 151455000,
        stock: 1,
        specLine: "Kapasitas besar 600L+ dua kompresor hermetik berpendingin kaskade",
        hook: "Kapasitas penyimpanan ultra-rendah maksimal untuk biobank terpusat.",
        image: "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-ldf-9020u-ultra-low-temp-freezer-transparent.png"
      },
      {
        code: "C-07",
        slug: "vaccine-refrigerator-lcv-203gr",
        name: "Vaccine Refrigerator",
        model: "LCV-203GR",
        brand: "Daihan Labtech",
        normalPrice: 72375000,
        promoPrice: 66585000,
        stock: 1,
        specLine: "Pendingin vaksin 2°C–8°C pintu kaca ganda low-E anti-embun",
        hook: "Kontrol suhu presisi menjamin potensi vaksin dan reagen sensitif.",
        image: "/images/daihanreadystock/LCV-203GR VACCINE PHARMACY REFRIGERATOR.webp"
      },
      {
        code: "C-08",
        slug: "inkubator-co2-lco-065ai",
        name: "Inkubator CO2 Air Jacket",
        model: "LCO-065AI",
        brand: "Daihan Labtech",
        normalPrice: 79812500,
        promoPrice: 73427500,
        stock: 4,
        specLine: "Sensor IR CO2 akurat dan pemanas air jacket pencegah kondensasi",
        hook: "Simulasi lingkungan fisiologis optimal bagi kultur sel dan jaringan.",
        image: "/images/daihanreadystock/LCO-065AI AIR JACKET CO2 INCUBATOR.webp"
      },
      {
        code: "C-09",
        slug: "autoclave-lac-50455p",
        name: "Autoclave Kapasitas Besar",
        model: "LAC-50455P",
        brand: "Labtech",
        normalPrice: 81250000,
        promoPrice: 74750000,
        stock: 1,
        specLine: "Chamber sterilisasi ekstra lebar untuk pemrosesan wadah skala besar",
        hook: "Dekontaminasi volume tinggi untuk efisiensi operasional lab terpadu.",
        image: "/images/products/autoklaf-labtech-lac-50455p.png"
      },
      {
        code: "C-10",
        slug: "autoclave-vacuum-drying-1031sv",
        name: "Autoclave Seri Vacuum Drying",
        model: "1031SV",
        brand: "Daihan",
        normalPrice: 82060000,
        promoPrice: 75495200,
        stock: 3,
        specLine: "Sistem vacuum drying untuk pengeringan instrumen pasca-sterilisasi",
        hook: "Instrumen steril langsung kering dan siap dikemas tanpa residu air.",
        image: "/images/daihanreadystock/LAC-1031SV AUTOCLAVE.webp"
      },
      {
        code: "C-11",
        slug: "autoclave-vacuum-drying-1031svf",
        name: "Autoclave Seri Vacuum Drying",
        model: "1031SVF",
        brand: "Daihan",
        normalPrice: 87310000,
        promoPrice: 80325200,
        stock: 1,
        specLine: "Fitur filtrasi udara steril pasca vakum dan sensor tekanan diferensial",
        hook: "Siklus pengeringan vakum steril tingkat lanjut untuk alat bedah & lab.",
        image: "/images/daihanreadystock/LAC-1031SVF AUTOCLAVE.webp"
      },
      {
        code: "C-12",
        slug: "drying-oven-dkn413c-yamato",
        name: "Drying Oven Yamato",
        model: "DKN413C",
        brand: "Yamato",
        normalPrice: 84490000,
        promoPrice: 77730800,
        stock: 1,
        specLine: "Sirkulasi udara mekanis paksa suhu hingga 260°C akurasi tinggi",
        hook: "Pengeringan dan pemanasan presisi standar industri teknologi Jepang.",
        image: "/images/products/drying-oven-dkn413c-yamato.jpg"
      },
      {
        code: "C-13",
        slug: "pass-box-dynamic",
        name: "Pass Box Dynamic",
        model: "Dynamic",
        brand: "AndisLab",
        normalPrice: 87500000,
        promoPrice: 80500000,
        stock: 1,
        specLine: "HEPA air shower terintegrasi interlock elektromagnetik ruang bersih",
        hook: "Pembersihan aliran udara aktif mencegah masuknya kontaminan ruang cleanroom.",
        image: "/images/products/pass-box-dynamic-andislab.jpg"
      },
      {
        code: "C-14",
        slug: "water-purificator-expe-cb",
        name: "Water Purificator",
        model: "Expe-CB",
        brand: "Puris",
        normalPrice: 162500000,
        promoPrice: 149500000,
        stock: 1,
        specLine: "Penghasil air ultra murni Type I & II untuk HPLC, AAS, dan biologi molekuler",
        hook: "Kemurnian resistivitas 18.2 MΩ·cm untuk instrumentasi analitik sensitif.",
        image: "/images/products/water-purificator-puris-mirae-st.png"
      }
    ]
  }
];
