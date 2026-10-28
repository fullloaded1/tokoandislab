export interface PromoProduct {
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

export interface PromoPaymentTier {
  discount: string;
  terms: string;
  eligibility: string;
  highlight?: boolean;
}

export const promoPaymentTiers: PromoPaymentTier[] = [
  {
    discount: "Diskon 15%",
    terms: "Pelunasan di Muka (Cash) atau DP 50% Pelunasan 2 Minggu",
    eligibility: "Diskon maksimal untuk instansi yang melakukan pembayaran langsung / cash.",
    highlight: true,
  },
  {
    discount: "Diskon 10%",
    terms: "DP 50% atau DP 30% Kredit Tempo 2 Minggu",
    eligibility: "Skema paling diminati universitas & klinik untuk efisiensi anggaran belanja.",
  },
  {
    discount: "Diskon 5%",
    terms: "DP 30% atau DP 10% Kredit Tempo 2 Minggu",
    eligibility: "Komitmen uang muka ringan untuk percepatan penyerapan anggaran tahun berjalan.",
  },
  {
    discount: "Harga Normal (0%)",
    terms: "Kredit Standar Instansi (30 Hari setelah BAST)",
    eligibility: "Pengadaan resmi APBN/APBD/BUMN dengan pembayaran pasca serah terima barang.",
  },
];

export const terms: string[] = [
  "Promo berlaku 30 Oktober - 30 Desember 2026 atau selama persediaan stok masih ada.",
  "Skema diskon bertingkat berlaku resmi: Diskon 15% (Cash / DP 50% tempo 2 minggu), Diskon 10% (DP 50% / DP 30% tempo 2 minggu), Diskon 5% (DP 30% / DP 10% tempo 2 minggu), atau Normal (Tempo kredit instansi 30 hari).",
  "Ongkir gratis berlaku untuk area Jabodetabek. Di luar area, ongkir dan transport teknisi dihitung terpisah.",
  "Instalasi dan training uji fungsi dilakukan on-site di area Jabodetabek; di luar area dilakukan sesuai kesepakatan.",
  "Faktur Pajak dan BAST diproses sebelum tutup buku untuk PO yang masuk paling lambat 22 Desember 2026 (Jawa) atau 15 Desember 2026 (luar Jawa).",
  "Garansi mengikuti ketentuan resmi prinsipal masing-masing produk (12 bulan garansi servis & suku cadang)."
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
    products: [
      {
            "slug": "labex-scopepad-lx97",
            "name": "Scopepad LX97",
            "model": "LX97",
            "brand": "Labex",
            "normalPrice": 29703750,
            "promoPrice": null,
            "stock": 4,
            "specLine": "",
            "hook": "Dokumentasi visual mikroskop digital real-time.",
            "image": "/images/products/scopepad-lx97-labex.jpg"
      },
      {
            "slug": "taitec-rotator-rt-50n",
            "name": "Rotator RT-50N",
            "model": "RT-50N",
            "brand": "Taitec",
            "normalPrice": 25849125,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Agitasi end-over-end presisi standar riset Jepang.",
            "image": "/images/products/rotator-rt-50n-taitec.jpg"
      },
      {
            "slug": "scrub-station-1-person",
            "name": "Scrub Station 1 Person",
            "model": "Scrub Station 1P",
            "brand": "AndisLab",
            "normalPrice": 25000000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Sanitasi otomatis hands-free standar ruang steril.",
            "image": "/images/products/scrub-station-1-person-andislab.jpg"
      },
      {
            "slug": "infitek-linear-shaker-shk-l710",
            "name": "Linear Shaker Infitek SHK-L710",
            "model": "SHK-L710",
            "brand": "Infitek",
            "normalPrice": 25000000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Pencampuran sampel yang konsisten bebas tumpah.",
            "image": "/images/products/linear-shaker-shk-l710-infitek.jpg"
      },
      {
            "slug": "opto-edu-microscope-a12-0205-t",
            "name": "Mikroskop Trinocular Opto Edu A12.0205-T",
            "model": "A12.0205-T",
            "brand": "Opto Edu",
            "normalPrice": 22500000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Visual jernih untuk pemakaian intensif dan dokumentasi.",
            "image": "/images/products/microscope-trinocular-a12-0205-t-optoedu.jpg"
      },
      {
            "slug": "opto-edu-microscope-a33-5121-th",
            "name": "Mikroskop Trinocular Opto Edu A33.5121-TH",
            "model": "A33.5121-TH",
            "brand": "Opto Edu",
            "normalPrice": 20000000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Mikroskop trinokular tajam untuk riset dan akademik.",
            "image": "/images/products/microscope-trinocular-a33-5121-th-optoedu.jpg"
      },
      {
            "slug": "labex-stereo-microscope-szm-6565",
            "name": "Binocular Zoom Stereo Microscope SZM-6565",
            "model": "SZM-6565",
            "brand": "Labex",
            "normalPrice": 18731250,
            "promoPrice": null,
            "stock": 2,
            "specLine": "",
            "hook": "Pengamatan detail 3D tanpa mata cepat lelah.",
            "image": "/images/products/stereo-microscope-szm-6565-labex.jpg"
      },
      {
            "slug": "ph-meter-benchtop-standar",
            "name": "pH Meter Benchtop Laboratorium",
            "model": "pH Benchtop",
            "brand": "Standar",
            "normalPrice": 12500000,
            "promoPrice": null,
            "stock": 5,
            "specLine": "",
            "hook": "Pembacaan pH stabil, rilis QC tidak tertahan.",
            "image": "/images/products/ph-meter-benchtop.jpg"
      },
      {
            "slug": "infitek-colony-counter-cc-j2s",
            "name": "Colony Counter Infitek CC-J2S",
            "model": "CC-J2S",
            "brand": "Infitek",
            "normalPrice": 10000000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Pencacahan koloni mikroba cepat dan akurat.",
            "image": "/images/products/colony-counter-infitek-cc-j2s.jpg"
      },
      {
            "slug": "kursi-donor-medis",
            "name": "Kursi Donor Medis",
            "model": "Kursi Donor",
            "brand": "AndisLab",
            "normalPrice": 6000000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Kenyamanan maksimal pasien sampling dan transfusi.",
            "image": "/images/products/kursi-donor-medis-andislab.jpg"
      },
      {
            "slug": "value-vacuum-pump-ve115n",
            "name": "Vacuum Pump VE115N",
            "model": "VE115N",
            "brand": "Value",
            "normalPrice": 2585625,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Daya hisap vakum stabil untuk filtrasi laboratorium.",
            "image": "/images/products/vacuum-pump-ve115n-value.jpg"
      },
      {
            "slug": "hanna-digital-thermometer-hi98501",
            "name": "Digital Thermometer with Stainless Steel Penetration Probe HI98501",
            "model": "HI98501",
            "brand": "Hanna Instruments",
            "normalPrice": 2393750,
            "promoPrice": null,
            "stock": 2,
            "specLine": "",
            "hook": "Monitoring suhu penetrasi presisi respons cepat.",
            "image": "/images/products/digital-thermometer-hi98501-hanna.jpg"
      },
      {
            "slug": "cal-infrared-thermometer-cal-01",
            "name": "Infrared Thermometer CAL-01",
            "model": "CAL-01",
            "brand": "CAL",
            "normalPrice": 1375000,
            "promoPrice": null,
            "stock": 3,
            "specLine": "",
            "hook": "Pengukuran suhu non-kontak higienis dan instan.",
            "image": "/images/products/infrared-thermometer-cal-01.jpg"
      },
      {
            "slug": "dlab-toppette-100-1000ul",
            "name": "Single-Channel Mechanical Pipette TopPette 100–1000 µl",
            "model": "TopPette 100-1000µl",
            "brand": "DLAB",
            "normalPrice": 750000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Pipetting presisi dan ergonomis untuk cairan rutin.",
            "image": "/images/products/toppette-100-1000ul-dlab.jpg"
      }
]
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
    products: [
      {
            "slug": "daihan-lac-1021sv-autoclave",
            "name": "Autoclave Vertikal Otomatis LAC-1021SV",
            "model": "LAC-1021SV",
            "brand": "Daihan Labtech",
            "normalPrice": 66625000,
            "promoPrice": null,
            "stock": 2,
            "specLine": "",
            "hook": "Sterilisasi tuntas kapasitas lebih besar, risiko kontaminasi silang turun.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-lac-1021sv-autoclave-transparent.png"
      },
      {
            "slug": "yamato-incubator-ic413c",
            "name": "Incubator Yamato IC413C",
            "model": "IC413C",
            "brand": "Yamato",
            "normalPrice": 66600000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Suhu stabil standar Jepang untuk pertumbuhan kultur optimal.",
            "image": "/images/products/incubator-ic413c-yamato.jpg"
      },
      {
            "slug": "daihan-lac-1011sv-autoclave",
            "name": "Autoclave Sterilisasi Vertikal LAC-1011SV",
            "model": "LAC-1011SV",
            "brand": "Daihan Labtech",
            "normalPrice": 59125000,
            "promoPrice": null,
            "stock": 2,
            "specLine": "",
            "hook": "Sterilisasi tuntas otomatis, dekontaminasi tervalidasi.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-lac-1011sv-autoclave-transparent.png"
      },
      {
            "slug": "meling-pharmacy-refrigerator-yc-130l",
            "name": "Pharmacy Refrigerator Meling YC-130L",
            "model": "YC-130L",
            "brand": "Meling",
            "normalPrice": 56250000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Penyimpanan reagen dan vaksin 2-8°C terjaga aman.",
            "image": "/images/products/pharmacy-refrigerator-yc-130l-meling.jpg"
      },
      {
            "slug": "aluminum-block-bath-dtu-r-taitec",
            "name": "Aluminum Block Bath",
            "model": "DTU-R",
            "brand": "Taitec",
            "normalPrice": 51458906.25,
            "promoPrice": null,
            "stock": 2,
            "specLine": "",
            "hook": "Pemanasan sampel tabung presisi tanpa fluktuasi suhu.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/aluminum-block-bath-dtu-r-taitec-transparent.png"
      },
      {
            "slug": "andislab-pass-box-400",
            "name": "Pass Box 400",
            "model": "Pass Box 400",
            "brand": "AndisLab",
            "normalPrice": 37500000,
            "promoPrice": null,
            "stock": 4,
            "specLine": "",
            "hook": "Transfer material antar cleanroom bebas kontaminasi udara.",
            "image": "/images/products/pass-box-400-andislab.jpg"
      },
      {
            "slug": "aelab-benchtop-conductivity-meter-510",
            "name": "Benchtop Conductivity Meter 510",
            "model": "510",
            "brand": "Aelab",
            "normalPrice": 37462500,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Uji konduktivitas dan salinitas akurat untuk air industri.",
            "image": "/images/products/conductivity-meter-benchtop-510-aelab.jpg"
      },
      {
            "slug": "infitek-analytical-balance-ba-n503",
            "name": "Analytical Balance Infitek BA-N503",
            "model": "BA-N503",
            "brand": "Infitek",
            "normalPrice": 30164000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Penimbangan presisi tinggi dasar analisis kuantitatif.",
            "image": "/images/products/analytical-balance-ba-n503-infitek.jpg"
      }
]
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
    products: [
      {
            "slug": "taitec-large-incubator-shaker-gbr-200",
            "name": "Large Incubator Shaker GBR-200",
            "model": "GBR-200",
            "brand": "Taitec",
            "normalPrice": 521812500,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Kapasitas raksasa untuk kultur sel dan fermentasi industri.",
            "image": "/images/products/large-incubator-shaker-gbr-200-taitec.jpg"
      },
      {
            "slug": "incubator-shaker-br-43fl-taitec",
            "name": "Incubator Shaker",
            "model": "BR-43FL",
            "brand": "Taitec",
            "normalPrice": 245691562.5,
            "promoPrice": null,
            "stock": 3,
            "specLine": "",
            "hook": "Inkubasi dan agitasi performa tinggi untuk bioteknologi.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/incubator-shaker-br-43fl-taitec-transparent.png"
      },
      {
            "slug": "co2-incubator-mg-70c-taitec",
            "name": "CO2 Incubator",
            "model": "MG-70C",
            "brand": "Taitec",
            "normalPrice": 225000000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Kontrol CO2 dan suhu presisi tinggi untuk kultur sel mamalia.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/co2-incubator-mg-70c-taitec-transparent.png"
      },
      {
            "slug": "incubator-shaker-br-23um-taitec",
            "name": "Incubator Shaker",
            "model": "BR-23UM",
            "brand": "Taitec",
            "normalPrice": 197437500,
            "promoPrice": null,
            "stock": 2,
            "specLine": "",
            "hook": "Agitasi stabil 24/7 untuk bioproses dan mikrobiologi.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/incubator-shaker-br-23um-taitec-transparent.png"
      },
      {
            "slug": "taitec-incubator-shaker-br-23fh",
            "name": "Incubator Shaker BR-23FH",
            "model": "BR-23FH",
            "brand": "Taitec",
            "normalPrice": 187687500,
            "promoPrice": null,
            "stock": 2,
            "specLine": "",
            "hook": "Fleksibilitas kontrol suhu dan kecepatan inkubator shaker.",
            "image": "/images/products/incubator-shaker-br-23fh-taitec.jpg"
      },
      {
            "slug": "daihan-ldf-9020u-ultra-low-temp-freezer",
            "name": "Upright Ultra Low Freezer LDF-9020U",
            "model": "LDF-9020U",
            "brand": "Daihan Labtech",
            "normalPrice": 164625000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Sampel dan reagen kritis tersimpan aman pada suhu -86°C.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-ldf-9020u-ultra-low-temp-freezer-transparent.png"
      },
      {
            "slug": "water-purificator-puris-mirae-st",
            "name": "Water Purificator Puris Mirae ST Expe-CB Ele 10-M",
            "model": "Expe-CB Ele 10-M",
            "brand": "Puris Mirae ST",
            "normalPrice": 162500000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Pasokan air ultra murni grade analitik bebas kontaminan.",
            "image": "/images/products/water-purificator-puris-mirae-st.png"
      },
      {
            "slug": "daihan-ldf-9015s-ultra-low-temp-freezer",
            "name": "Chest Ultra Low Freezer LDF-9015S",
            "model": "LDF-9015S",
            "brand": "Daihan Labtech",
            "normalPrice": 143812500,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Cold storage tipe chest insulasi tebal hemat energi.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-ldf-9015s-ultra-low-temp-freezer-transparent.png"
      },
      {
            "slug": "daihan-ldf-9010u-ultra-low-temp-freezer",
            "name": "Upright Ultra Low Freezer LDF-9010U",
            "model": "LDF-9010U",
            "brand": "Daihan Labtech",
            "normalPrice": 139187500,
            "promoPrice": null,
            "stock": 2,
            "specLine": "",
            "hook": "Perlindungan sampel esensial dengan sistem alarm berlapis.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-ldf-9010u-ultra-low-temp-freezer-transparent.png"
      },
      {
            "slug": "andislab-bsc-mini-ii-a2-prime",
            "name": "Biosafety Cabinet (BSC) Mini Prime Kelas II Tipe A2 Custom",
            "model": "BSC mini II A2 Prime",
            "brand": "AndisLab",
            "normalPrice": 137500000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Proteksi biosafety A2 kompak hemat ruang lab.",
            "image": "/images/products/bsc-mini-ii-a2-andislab.jpg"
      },
      {
            "slug": "daihan-ldf-9110c-ultra-low-temp-freezer",
            "name": "Chest Ultra Low Freezer LDF-9110C",
            "model": "LDF-9110C",
            "brand": "Daihan Labtech",
            "normalPrice": 121750000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Chest freezer ultra low andal untuk penyimpanan jangka panjang.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-ldf-9110c-ultra-low-temp-freezer-transparent.png"
      },
      {
            "slug": "andislab-bsc-1100-ii-a2",
            "name": "Biosafety Cabinet (BSC) 1100 Kelas II Tipe A2 Custom",
            "model": "BSC 1100 II A2",
            "brand": "AndisLab",
            "normalPrice": 110906250,
            "promoPrice": null,
            "stock": 2,
            "specLine": "",
            "hook": "Proteksi 3-arah analis, sampel, dan lingkungan kerja.",
            "image": "/images/products/bsc-1100-ii-a2-andislab.jpg"
      },
      {
            "slug": "analytical-balance-cy285c-aczet",
            "name": "Analytical Balance",
            "model": "CY285C",
            "brand": "Aczet",
            "normalPrice": 101190375,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Timbangan analitik mikro presisi tinggi grade riset mutakhir.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/MINIQMGVIBJ0S-xxlarge.webp"
      },
      {
            "slug": "taitec-incubator-shaker-vbr-104",
            "name": "Incubator Shaker with NewMax Drive VBR-104",
            "model": "VBR-104",
            "brand": "Taitec",
            "normalPrice": 100045687.5,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Teknologi NewMax Drive senyap dan minim getaran.",
            "image": "/images/products/incubator-shaker-vbr-104-taitec.jpg"
      },
      {
            "slug": "andislab-laf-mini-v-digital",
            "name": "Laminar Air Flow (LAF) Mini Digital Custom",
            "model": "LAF mini V Digital",
            "brand": "AndisLab",
            "normalPrice": 91250000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Aliran udara laminar vertikal HEPA filter digital.",
            "image": "/images/products/laf-mini-digital-andislab.jpg"
      },
      {
            "slug": "pcr-cabinet-pcr-1000-aelab",
            "name": "PCR Cabinet",
            "model": "PCR-1000",
            "brand": "Aelab",
            "normalPrice": 90811875,
            "promoPrice": null,
            "stock": 2,
            "specLine": "",
            "hook": "Zona kerja steril dekontaminasi UV untuk amplifikasi DNA.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/pcr-cabinet-pcr-1000-aelab-transparent.png"
      },
      {
            "slug": "taitec-incubator-shaker-mbr-032",
            "name": "Incubator Shaker with NewMax Drive MBR-032",
            "model": "MBR-032",
            "brand": "Taitec",
            "normalPrice": 88942218.75,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Inkubator shaker kompak untuk microplate dan tabung.",
            "image": "/images/products/incubator-shaker-mbr-032-taitec.jpg"
      },
      {
            "slug": "daihan-lco-165ai-air-jacket-co2-incubator",
            "name": "Inkubator CO2 Air Jacket LCO-165AI",
            "model": "LCO-165AI",
            "brand": "Daihan Labtech",
            "normalPrice": 87812500,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Inkubator CO2 air jacket kapasitas besar kelembapan terjaga.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-lco-165ai-air-jacket-co2-incubator-transparent.png"
      },
      {
            "slug": "labtech-bsc-ii-a2-lcb-0123",
            "name": "Biosafety Cabinet Kelas II A2 Labtech LCB-0123-A2",
            "model": "LCB-0123-A2",
            "brand": "Labtech",
            "normalPrice": 87500000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Biosafety Cabinet Kelas II A2 kapasitas kerja leluasa.",
            "image": "/images/products/bsc-ii-a2-labtech-lcb-0123.jpg"
      },
      {
            "slug": "andislab-pass-box-dynamic",
            "name": "Pass Box Dynamic (Air Shower)",
            "model": "Pass Box Dynamic",
            "brand": "AndisLab",
            "normalPrice": 87500000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Air shower interlock untuk dekontaminasi partikel transfer.",
            "image": "/images/products/pass-box-dynamic-andislab.jpg"
      },
      {
            "slug": "daihan-lac-1031svf-autoclave",
            "name": "Autoclave Vacuum Drying LAC-1031SVF",
            "model": "LAC-1031SVF",
            "brand": "Daihan Labtech",
            "normalPrice": 87312500,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Autoclave vertikal lengkap dengan fitur vacuum drying.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-lac-1031svf-autoclave-transparent.png"
      },
      {
            "slug": "yamato-drying-oven-dkn413c",
            "name": "Drying Oven Yamato DKN413C",
            "model": "DKN413C",
            "brand": "Yamato",
            "normalPrice": 84498750,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Drying oven sirkulasi udara merata standar industri Jepang.",
            "image": "/images/products/drying-oven-dkn413c-yamato.jpg"
      },
      {
            "slug": "daihan-lac-1031sv-autoclave",
            "name": "AUTOCLAVE",
            "model": "LAC-1031SV",
            "brand": "Daihan Labtech",
            "normalPrice": 82062500,
            "promoPrice": null,
            "stock": 3,
            "specLine": "",
            "hook": "Autoclave vertikal kapasitas 100L sterilisasi batch besar.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-lac-1031sv-autoclave-transparent.png"
      },
      {
            "slug": "autoklaf-labtech-lac-50455p",
            "name": "Autoklaf Labtech LAC-50455P",
            "model": "LAC-50455P",
            "brand": "Labtech",
            "normalPrice": 81250000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Sterilisasi uap bertekanan tinggi untuk instrumen dan limbah medis.",
            "image": "/images/products/autoklaf-labtech-lac-50455p.png"
      },
      {
            "slug": "daihan-llf-403sr-laboratory-freezer",
            "name": "Medical Laboratory Freezer LLF-403SR",
            "model": "LLF-403SR",
            "brand": "Daihan Labtech",
            "normalPrice": 79875000,
            "promoPrice": null,
            "stock": 3,
            "specLine": "",
            "hook": "Freezer medis -20°C sampai -35°C stabilitas termal prima.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-llf-403sr-laboratory-freezer-transparent.png"
      },
      {
            "slug": "daihan-lco-065ai-air-jacket-co2-incubator",
            "name": "Inkubator CO2 Air Jacket LCO-065AI",
            "model": "LCO-065AI",
            "brand": "Daihan Labtech",
            "normalPrice": 79812500,
            "promoPrice": null,
            "stock": 4,
            "specLine": "",
            "hook": "Inkubasi sel kultur sensitif suhu presisi seragam.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-lco-065ai-air-jacket-co2-incubator-transparent.png"
      },
      {
            "slug": "andislab-laf-1000v-vertikal",
            "name": "Laminar Air Flow (LAF) 1000 Vertikal Custom",
            "model": "LAF 1000 V",
            "brand": "AndisLab",
            "normalPrice": 76250000,
            "promoPrice": null,
            "stock": 2,
            "specLine": "",
            "hook": "Zona kerja bersih partikel untuk perlindungan sampel sensitif.",
            "image": "/images/products/laf-1000-vertikal-andislab.jpg"
      },
      {
            "slug": "daihan-lcv-203gr-vaccine-pharmacy-refrigerator",
            "name": "Vaccine & Pharmacy Refrigerator LCV-203GR",
            "model": "LCV-203GR",
            "brand": "Daihan Labtech",
            "normalPrice": 72375000,
            "promoPrice": null,
            "stock": 1,
            "specLine": "",
            "hook": "Kulkas farmasi dan vaksin kontrol digital stabil.",
            "image": "https://we70iqz1m14svdds.public.blob.vercel-storage.com/products/daihan-lcv-203gr-vaccine-pharmacy-refrigerator-transparent.png"
      }
]
  }
];
