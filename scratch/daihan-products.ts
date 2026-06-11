// Katalog Produk Terkurasi — Daihan Labtech General Lab Equipment
// Bahasa Indonesia — untuk halaman Katalog PDF

export interface DaihanProduct {
  id: string;
  nama: string;
  deskripsi: string;
  foto: string;
  model: string[];
  fitur: string[];
  spesifikasi: Record<string, string>;
  kategori: string;
}

export interface DaihanKategori {
  slug: string;
  nama: string;
  deskripsiKategori: string;
  produk: DaihanProduct[];
}

export const daihanKatalog: DaihanKategori[] = [
  // ── WATER BATH ──
  {
    slug: "water-bath",
    nama: "Water Bath",
    deskripsiKategori: "Perangkat pemanas air laboratorium untuk inkubasi, pemanasan sampel, dan reaksi kimia pada suhu terkontrol. Tersedia dalam konfigurasi single chamber, multi chamber, dan shaking.",
    produk: [
      {
        id: "wb-digital",
        nama: "Digital Water Bath",
        deskripsi: "Water bath dengan kontrol suhu digital dan bak stainless steel STS 304 seamless tanpa sambungan, sehingga mudah dibersihkan dan tahan korosi. Dilengkapi penutup heater berlubang yang melindungi sensor suhu dari percikan air. Tersedia dalam tiga ukuran volume untuk kebutuhan laboratorium yang berbeda.",
        foto: "/images/daihan/water-bath-digital.png",
        model: ["LWB-106D", "LWB-111D", "LWB-122D"],
        fitur: [
          "Bak seamless STS 304 tanpa sambungan las",
          "Proteksi suhu berlebih otomatis",
          "Aksesori opsional: ring cover, gabled lid, test tube rack",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +5°C ~ 99°C",
          "Volume Bak": "6 ℓ / 11 ℓ / 22 ℓ",
        },
        kategori: "water-bath",
      },
      {
        id: "wb-multi-chamber",
        nama: "Multi Chamber Water Bath",
        deskripsi: "Water bath dengan 2 atau 3 bak terpisah yang masing-masing memiliki kontrol suhu independen. Cocok untuk laboratorium yang membutuhkan beberapa kondisi suhu berbeda secara bersamaan tanpa harus menyediakan beberapa unit terpisah.",
        foto: "/images/daihan/water-bath-multi-chamber.png",
        model: ["LWB-211D", "LWB-311D"],
        fitur: [
          "Kontrol suhu independen per bak",
          "Bak stainless steel STS 304 seamless",
          "Aksesori opsional: ring cover, gabled lid, test tube rack",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +5°C ~ 99°C",
          "Konfigurasi": "11 ℓ × 2 bak / 11 ℓ × 3 bak",
        },
        kategori: "water-bath",
      },
      {
        id: "wb-shaking",
        nama: "Shaking Water Bath",
        deskripsi: "Water bath yang dilengkapi mekanisme pengocokan (shaking) untuk aplikasi yang memerlukan agitasi sampel, seperti ekstraksi, pencampuran reagen, dan pengujian kelarutan. Kecepatan goyang dapat diatur dari 20 hingga 250 rpm sesuai kebutuhan.",
        foto: "/images/daihan/water-bath-shaking.png",
        model: ["LSB-015S", "LSB-030S", "LSB-045S"],
        fitur: [
          "Bak stainless steel STS 304 tahan korosi",
          "Kecepatan goyang dapat diatur 20–250 rpm",
          "Proteksi suhu berlebih otomatis",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +5°C ~ 99°C",
          "Kecepatan Goyang": "20 ~ 250 rpm",
          "Volume Bak": "22 ℓ / 36 ℓ / 50 ℓ",
        },
        kategori: "water-bath",
      },
      {
        id: "wb-extraction-cod",
        nama: "Extraction / COD Water Bath",
        deskripsi: "Water bath yang dirancang khusus untuk analisis COD (Chemical Oxygen Demand) dan proses ekstraksi lainnya. Memiliki 4 hingga 12 lubang ekstraksi dengan stand stainless steel STS 304 yang kokoh. Banyak digunakan di laboratorium lingkungan dan pengolahan air.",
        foto: "/images/daihan/water-bath-extraction-cod.png",
        model: ["LEB-104D", "LEB-106D", "LEB-108D", "LEB-112D"],
        fitur: [
          "4 hingga 12 lubang ekstraksi tersedia",
          "Bak dan stand stainless steel STS 304",
          "Aksesori opsional: water level device",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +5°C ~ 99°C",
          "Lubang Ekstraksi": "4 / 6 / 8 / 12 lubang",
        },
        kategori: "water-bath",
      },
      {
        id: "wb-viscosight",
        nama: "Viscosight Bath",
        deskripsi: "Water bath dengan dinding transparan yang memungkinkan pengamatan sampel secara langsung selama proses pemanasan. Digunakan terutama untuk pengujian viskositas dan aplikasi lain yang memerlukan visibilitas langsung terhadap sampel di dalam bak.",
        foto: "/images/daihan/water-bath-viscosight.png",
        model: ["LVB-630S", "LVB-650S", "LVB-630SP", "LVB-650SP"],
        fitur: [
          "Dinding transparan untuk observasi langsung",
          "Bak stainless steel STS 304 tahan korosi",
          "Desain kompak, cocok untuk meja kerja terbatas",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +5°C ~ 99°C",
          "Volume Bak": "28 ℓ / 50 ℓ",
        },
        kategori: "water-bath",
      },
      {
        id: "wb-cooling-viscosight",
        nama: "Cooling Viscosight Bath",
        deskripsi: "Viscosight bath yang dilengkapi sistem pendinginan aktif dan pompa sirkulasi internal, sehingga mampu beroperasi pada suhu di bawah suhu ruangan hingga -10°C. Cocok untuk pengujian viskositas pada suhu rendah dan aplikasi yang membutuhkan pendinginan presisi.",
        foto: "/images/daihan/water-bath-cooling-viscosight.png",
        model: ["LVB-631R", "LVB-651R", "LVB-632RP", "LVB-652RP"],
        fitur: [
          "Sistem pendinginan aktif hingga -10°C",
          "Pompa sirkulasi internal untuk distribusi suhu merata",
          "Dinding transparan untuk observasi langsung",
        ],
        spesifikasi: {
          "Rentang Suhu": "-10°C ~ 90°C",
          "Volume Bak": "31 ℓ / 52 ℓ",
        },
        kategori: "water-bath",
      },
    ],
  },

  // ── BATH CIRCULATOR ──
  {
    slug: "bath-circulator",
    nama: "Bath Circulator",
    deskripsiKategori: "Sistem sirkulasi fluida dengan kontrol suhu presisi untuk kalibrasi instrumen, reaksi pada suhu tertentu, dan pendinginan sampel. Mencakup oil bath, immersion circulator, dan refrigerated circulator.",
    produk: [
      {
        id: "bc-oil",
        nama: "Oil Bath",
        deskripsi: "Bath yang menggunakan oli silikon sebagai media pemanas untuk mencapai suhu tinggi hingga 250°C. Dilengkapi proteksi suhu berlebih ganda untuk keamanan operasional. Ideal untuk reaksi kimia dan kalibrasi yang memerlukan suhu di atas titik didih air.",
        foto: "/images/daihan/bath-oil.png",
        model: ["LOB-610S", "LOB-611D", "LOB-612S"],
        fitur: [
          "Media oli silikon untuk suhu tinggi",
          "Proteksi suhu berlebih ganda",
          "Kontrol suhu PID digital",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +5°C ~ 250°C",
          "Volume Bak": "10 ℓ",
        },
        kategori: "bath-circulator",
      },
      {
        id: "bc-immersion",
        nama: "Immersion Bath Circulator",
        deskripsi: "Circulator celup portabel yang dapat dipasang pada berbagai wadah laboratorium. Tidak memerlukan bak bawaan, cukup dicelupkan ke dalam wadah yang sudah ada. Praktis untuk laboratorium yang memiliki wadah sendiri dan membutuhkan fleksibilitas penggunaan.",
        foto: "/images/daihan/bath-immersion-circulator.png",
        model: ["LIC-C", "LIC-D"],
        fitur: [
          "Desain celup portabel tanpa bak bawaan",
          "Kompatibel dengan berbagai wadah",
          "Instalasi cepat dan mudah",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +5°C ~ 150°C",
        },
        kategori: "bath-circulator",
      },
      {
        id: "bc-refrigerated",
        nama: "Refrigerated Bath Circulator",
        deskripsi: "Bath circulator dengan kompresor pendingin CFC-free yang mampu mencapai suhu -25°C hingga 150°C. Dilengkapi pompa sirkulasi internal dan eksternal, sehingga dapat digunakan untuk mensirkulasikan fluida ke peralatan eksternal seperti reaktor atau kolom kondensasi.",
        foto: "/images/daihan/bath-refrigerated-circulator.png",
        model: ["LCB-R08", "LCB-R13", "LCB-R22"],
        fitur: [
          "Kompresor CFC-free ramah lingkungan",
          "Pompa sirkulasi internal dan eksternal",
          "Cocok untuk sirkulasi ke peralatan eksternal",
        ],
        spesifikasi: {
          "Rentang Suhu": "-25°C ~ 150°C",
          "Volume Bak": "8 ℓ / 13 ℓ / 22 ℓ",
        },
        kategori: "bath-circulator",
      },
      {
        id: "bc-cooling",
        nama: "Cooling Bath Circulator",
        deskripsi: "Bath circulator berkapasitas besar (20–30 ℓ) dengan kemampuan pendinginan hingga -25°C. Dirancang untuk aplikasi yang membutuhkan volume fluida pendingin lebih banyak, seperti pendinginan reaktor skala menengah dan pengujian material pada suhu rendah.",
        foto: "/images/daihan/bath-cooling-circulator.png",
        model: ["LCC-R20", "LCC-R30"],
        fitur: [
          "Kapasitas besar 20–30 liter",
          "Kontrol suhu digital PID presisi",
          "Sistem pendinginan efisien",
        ],
        spesifikasi: {
          "Rentang Suhu": "-25°C ~ 150°C",
          "Volume Bak": "20 ℓ / 30 ℓ",
        },
        kategori: "bath-circulator",
      },
      {
        id: "bc-ultra-low",
        nama: "Ultra Low Temp. Bath Circulator",
        deskripsi: "Bath circulator dengan sistem kompresor bertingkat (cascade) yang mampu mencapai suhu sangat rendah hingga -40°C. Digunakan untuk aplikasi khusus seperti pengujian titik tuang minyak bumi, reaksi pada suhu rendah, dan kalibrasi termometer suhu rendah.",
        foto: "/images/daihan/bath-ultra-low-temp-circulator.png",
        model: ["LCB-UL22", "LCB-UL30"],
        fitur: [
          "Kompresor bertingkat untuk suhu hingga -40°C",
          "Kontrol PID presisi tinggi",
          "Pompa sirkulasi internal dan eksternal",
        ],
        spesifikasi: {
          "Rentang Suhu": "-40°C ~ 150°C",
        },
        kategori: "bath-circulator",
      },
      {
        id: "bc-cold-trap",
        nama: "Cold Trap",
        deskripsi: "Perangkap dingin (cold trap) untuk mengkondensasi uap pelarut pada sistem vakum, seperti rotary evaporator dan freeze dryer. Mencegah uap pelarut masuk ke pompa vakum, sehingga melindungi pompa dan meningkatkan efisiensi proses evaporasi.",
        foto: "/images/daihan/bath-cold-trap.png",
        model: ["LCT-C", "LCT-RC"],
        fitur: [
          "Kondensasi uap pelarut secara efektif",
          "Melindungi pompa vakum dari kontaminasi",
          "Cocok untuk rotary evaporator dan freeze dryer",
        ],
        spesifikasi: {
          "Rentang Suhu": "-40°C ~ -80°C",
        },
        kategori: "bath-circulator",
      },
    ],
  },

  // ── WATER STILL ──
  {
    slug: "water-still",
    nama: "Water Still",
    deskripsiKategori: "Alat destilasi air untuk menghasilkan air suling (aquadest) berkualitas tinggi. Tersedia dalam konfigurasi manual, otomatis, dan destilasi ganda untuk kebutuhan kemurnian yang berbeda.",
    produk: [
      {
        id: "ws-basic",
        nama: "Water Still",
        deskripsi: "Alat destilasi air standar yang menghasilkan air suling dengan konduktivitas rendah. Proses pemanasan menggunakan elemen pemanas celup. Tersedia dalam kapasitas produksi 4 dan 8 liter per jam, cocok untuk kebutuhan air suling harian di laboratorium.",
        foto: "/images/daihan/water-still-basic.png",
        model: ["LWD-3004", "LWD-3008"],
        fitur: [
          "Produksi air suling stabil dan konsisten",
          "Elemen pemanas celup tahan lama",
          "Operasi sederhana dan ekonomis",
        ],
        spesifikasi: {
          "Kapasitas Produksi": "4 ℓ/jam / 8 ℓ/jam",
        },
        kategori: "water-still",
      },
      {
        id: "ws-automatic",
        nama: "Automatic Water Still",
        deskripsi: "Destilasi air dengan sistem pengisian air otomatis dan tangki penampung terintegrasi. Tidak perlu pengawasan terus-menerus karena proses berjalan otomatis. Tangki penampung tersedia dalam ukuran 12 dan 24 liter.",
        foto: "/images/daihan/water-still-automatic.png",
        model: ["LWD-3004A", "LWD-3008A"],
        fitur: [
          "Pengisian air otomatis tanpa pengawasan",
          "Tangki penampung terintegrasi 12–24 ℓ",
          "Sensor level air untuk keamanan operasional",
        ],
        spesifikasi: {
          "Kapasitas Produksi": "4 ℓ/jam / 8 ℓ/jam",
          "Tangki Penampung": "12 ℓ / 24 ℓ",
        },
        kategori: "water-still",
      },
      {
        id: "ws-double",
        nama: "Automatic Double Water Still",
        deskripsi: "Destilasi ganda otomatis yang menghasilkan air suling dengan kemurnian lebih tinggi dibandingkan destilasi tunggal. Air hasil destilasi pertama didestilasi ulang untuk menghilangkan kontaminan yang masih tersisa. Cocok untuk aplikasi yang membutuhkan air dengan resistivitas tinggi.",
        foto: "/images/daihan/water-still-double.png",
        model: ["LWD-3004D"],
        fitur: [
          "Proses destilasi ganda untuk kemurnian maksimal",
          "Pengisian dan proses berjalan otomatis",
          "Hasil air dengan konduktivitas sangat rendah",
        ],
        spesifikasi: {
          "Kapasitas Produksi": "4 ℓ/jam",
        },
        kategori: "water-still",
      },
    ],
  },

  // ── HOTPLATE & STIRRER ──
  {
    slug: "hotplate-stirrer",
    nama: "Hotplate, Stirrer, dan Alat Pendukung",
    deskripsiKategori: "Peralatan pemanasan, pengadukan, dan pemrosesan sampel untuk kebutuhan preparasi dan analisis di laboratorium. Termasuk hotplate, magnetic stirrer, dry block heater, microcentrifuge, dan roller mixer.",
    produk: [
      {
        id: "hs-standard",
        nama: "Hotplate & Magnetic Stirrer",
        deskripsi: "Kombinasi hotplate dan magnetic stirrer dengan permukaan glass ceramic yang tahan terhadap bahan kimia korosif. Kontrol suhu dan kecepatan pengadukan secara digital. Mampu memanaskan hingga 380°C dengan kecepatan pengadukan 80–1500 rpm.",
        foto: "/images/daihan/hotplate-stirrer.png",
        model: ["LMS-1003", "LMS-1003D"],
        fitur: [
          "Permukaan glass ceramic tahan korosi",
          "Kontrol suhu dan kecepatan digital",
          "Kapasitas pengadukan hingga 10 liter",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient ~ 380°C",
          "Kecepatan Pengadukan": "80 ~ 1500 rpm",
        },
        kategori: "hotplate-stirrer",
      },
      {
        id: "hs-multi-position",
        nama: "Multi-Position Hotplate & Stirrer",
        deskripsi: "Hotplate stirrer dengan 4 atau 6 posisi pengadukan yang dapat beroperasi secara simultan. Setiap posisi memiliki kontrol kecepatan independen. Efisien untuk laboratorium yang perlu mengaduk banyak sampel sekaligus, misalnya untuk uji kelarutan atau preparasi paralel.",
        foto: "/images/daihan/hotplate-stirrer-multi-position.png",
        model: ["LMS-4003", "LMS-6003"],
        fitur: [
          "4 atau 6 posisi pengadukan simultan",
          "Kontrol kecepatan independen per posisi",
          "Efisien untuk preparasi sampel paralel",
        ],
        spesifikasi: {
          "Jumlah Posisi": "4 / 6 posisi",
          "Kecepatan Pengadukan": "80 ~ 1200 rpm",
        },
        kategori: "hotplate-stirrer",
      },
      {
        id: "hs-jumbo",
        nama: "Jumbo Hotplate",
        deskripsi: "Hotplate berukuran besar 400×400 mm untuk memanaskan wadah bervolume tinggi seperti beaker 10–20 liter atau bak perendaman. Distribusi panas merata di seluruh permukaan berkat desain elemen pemanas yang dioptimalkan.",
        foto: "/images/daihan/hotplate-jumbo.png",
        model: ["LHP-D"],
        fitur: [
          "Permukaan luas 400×400 mm",
          "Distribusi panas merata di seluruh area",
          "Cocok untuk wadah bervolume besar",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient ~ 350°C",
          "Ukuran Permukaan": "400 × 400 mm",
        },
        kategori: "hotplate-stirrer",
      },
      {
        id: "hs-dry-block",
        nama: "Dry Block Heater",
        deskripsi: "Pemanas blok kering aluminium untuk pemanasan presisi tabung reaksi, vial, dan microplate. Blok aluminium dapat diganti sesuai ukuran tabung yang digunakan (0.5 mL hingga 50 mL). Ideal untuk inkubasi enzim, denaturasi protein, dan preparasi sampel PCR.",
        foto: "/images/daihan/dry-block-heater.png",
        model: ["LDB-B", "LDB-D"],
        fitur: [
          "Blok aluminium interchangeable berbagai ukuran",
          "Kontrol suhu PID presisi tinggi",
          "Kapasitas 1–2 blok sekaligus",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +5°C ~ 200°C",
          "Jumlah Blok": "1–2 blok",
        },
        kategori: "hotplate-stirrer",
      },
      {
        id: "hs-microcentrifuge",
        nama: "Microcentrifuge",
        deskripsi: "Sentrifugasi mikro berkecepatan tinggi hingga 15.000 rpm (21.380 × g) untuk pemisahan komponen sampel dalam tabung mikro 1.5/2.0 mL. Digunakan secara luas dalam biologi molekuler, biokimia, dan diagnostik klinis untuk pemisahan serum, pelletisasi sel, dan ekstraksi DNA/RNA.",
        foto: "/images/daihan/microcentrifuge.png",
        model: ["LMC-4200", "LMC-4200R"],
        fitur: [
          "Kecepatan maksimum 15.000 rpm",
          "Kapasitas 24 tabung × 1.5/2.0 mL",
          "Tersedia varian berpendingin (R)",
        ],
        spesifikasi: {
          "Kecepatan Maks.": "15.000 rpm",
          "RCF Maks.": "21.380 × g",
        },
        kategori: "hotplate-stirrer",
      },
      {
        id: "hs-roller-mixer",
        nama: "Roller Mixer",
        deskripsi: "Mixer tipe roller untuk pencampuran lembut sampel dalam tabung dan botol secara kontinu. Gerakan rolling menghasilkan pencampuran yang homogen tanpa membentuk busa, sehingga cocok untuk sampel darah, suspensi sel, dan larutan yang sensitif terhadap aerasi.",
        foto: "/images/daihan/roller-mixer.png",
        model: ["LRM-S", "LRM-D"],
        fitur: [
          "Pencampuran lembut tanpa pembentukan busa",
          "Kecepatan rotasi dapat diatur 10–70 rpm",
          "Kapasitas hingga 6 botol sekaligus",
        ],
        spesifikasi: {
          "Kecepatan Rotasi": "10 ~ 70 rpm",
          "Kapasitas": "Maks. 6 botol",
        },
        kategori: "hotplate-stirrer",
      },
    ],
  },

  // ── FURNACE ──
  {
    slug: "furnace",
    nama: "Furnace",
    deskripsiKategori: "Tanur laboratorium untuk pengabuan (ashing), sintering, heat treatment, dan analisis termal pada suhu tinggi. Tersedia tipe muffle, tube, elevator, dan high-temperature furnace hingga 1.700°C.",
    produk: [
      {
        id: "fn-muffle-swing",
        nama: "Muffle Furnace — Pintu Ayun",
        deskripsi: "Tanur muffle dengan pintu ayun (swing door) yang memudahkan pemuatan dan pengambilan sampel. Menggunakan insulasi keramik fiber yang efisien untuk meminimalkan kehilangan panas. Digunakan untuk pengabuan, analisis kadar abu, heat treatment, dan sintering keramik.",
        foto: "/images/daihan/furnace-muffle-swing.png",
        model: ["LMF-S", "LMF-SD"],
        fitur: [
          "Pintu ayun untuk akses mudah",
          "Insulasi keramik fiber efisien",
          "Elemen pemanas tahan lama",
        ],
        spesifikasi: {
          "Suhu Maks.": "1.100°C / 1.200°C",
          "Volume Ruang": "3.6 ~ 27 ℓ",
        },
        kategori: "furnace",
      },
      {
        id: "fn-muffle-fold",
        nama: "Muffle Furnace — Pintu Lipat",
        deskripsi: "Tanur muffle dengan pintu lipat ke bawah (fold-down door) yang berfungsi sebagai platform pemuatan saat dibuka. Memudahkan penempatan sampel berat seperti krusibel keramik dan wadah logam. Konstruksi dan spesifikasi suhu sama dengan varian pintu ayun.",
        foto: "/images/daihan/furnace-muffle-fold-down.png",
        model: ["LMF-F", "LMF-FD"],
        fitur: [
          "Pintu lipat ke bawah sebagai platform pemuatan",
          "Insulasi keramik fiber efisien",
          "Cocok untuk sampel berat",
        ],
        spesifikasi: {
          "Suhu Maks.": "1.100°C / 1.200°C",
          "Volume Ruang": "3.6 ~ 27 ℓ",
        },
        kategori: "furnace",
      },
      {
        id: "fn-tube",
        nama: "Tube Furnace",
        deskripsi: "Tanur tabung untuk perlakuan panas sampel dalam atmosfer terkontrol (inert, reduktif, atau oksidatif). Menggunakan tabung kerja dari bahan kuarsa atau alumina. Banyak digunakan dalam penelitian material, sintesis nanomaterial, dan analisis termogravimetri.",
        foto: "/images/daihan/furnace-tube.png",
        model: ["LTF-S", "LTF-SD"],
        fitur: [
          "Tabung kerja kuarsa atau alumina tersedia",
          "Mendukung atmosfer inert (N₂, Ar)",
          "Zona pemanasan seragam",
        ],
        spesifikasi: {
          "Suhu Maks.": "1.100°C / 1.200°C",
          "Diameter Tabung": "50 ~ 100 mm",
        },
        kategori: "furnace",
      },
      {
        id: "fn-elevator",
        nama: "Elevator Furnace",
        deskripsi: "Tanur dengan mekanisme lift elektrik yang mengangkat platform sampel ke dalam ruang pemanas dari bawah. Desain ini menghilangkan kebutuhan untuk memasukkan tangan ke dalam ruang panas, sehingga meningkatkan keamanan operator saat bekerja dengan suhu tinggi.",
        foto: "/images/daihan/furnace-elevator.png",
        model: ["LEF-S"],
        fitur: [
          "Sistem lift elektrik otomatis",
          "Pemuatan dari bawah untuk keamanan operator",
          "Insulasi keramik fiber premium",
        ],
        spesifikasi: {
          "Suhu Maks.": "1.200°C",
        },
        kategori: "furnace",
      },
      {
        id: "fn-high-temp",
        nama: "High Temperature Furnace",
        deskripsi: "Tanur suhu sangat tinggi hingga 1.700°C menggunakan elemen pemanas MoSi₂ (Molybdenum Disilicide) berkualitas tinggi. Digunakan untuk sintering keramik canggih, pengujian refraktori, dan penelitian material pada suhu ekstrem.",
        foto: "/images/daihan/furnace-high-temp.png",
        model: ["LHT-S"],
        fitur: [
          "Elemen pemanas MoSi₂ untuk suhu ekstrem",
          "Kontrol PID presisi tinggi",
          "Insulasi multi-layer untuk efisiensi energi",
        ],
        spesifikasi: {
          "Suhu Maks.": "1.700°C",
        },
        kategori: "furnace",
      },
    ],
  },

  // ── OVEN ──
  {
    slug: "oven",
    nama: "Oven",
    deskripsiKategori: "Oven laboratorium untuk pengeringan, sterilisasi panas kering, aging test, dan perlakuan panas pada rentang suhu ambient hingga 350°C. Tersedia tipe konveksi alami, konveksi paksa, dan vakum.",
    produk: [
      {
        id: "ov-natural-eco",
        nama: "Natural Convection Oven — Seri Ekonomis",
        deskripsi: "Oven konveksi alami seri hemat biaya untuk kebutuhan pengeringan dan sterilisasi panas kering standar. Interior stainless steel tahan karat. Cocok untuk laboratorium pendidikan dan kebutuhan pengeringan rutin dengan anggaran terbatas.",
        foto: "/images/daihan/oven-natural-convection-eco.png",
        model: ["LDO-030E", "LDO-060E"],
        fitur: [
          "Harga ekonomis tanpa mengorbankan performa",
          "Proteksi suhu berlebih otomatis",
          "Interior stainless steel",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +10°C ~ 250°C",
          "Volume Ruang": "30 ℓ / 60 ℓ",
        },
        kategori: "oven",
      },
      {
        id: "ov-natural",
        nama: "Natural Convection Oven",
        deskripsi: "Oven konveksi alami premium dengan kontrol suhu PID microprocessor untuk stabilitas suhu yang lebih baik. Cocok untuk pengeringan sampel yang sensitif terhadap aliran udara, di mana konveksi paksa dapat mengganggu sampel berbobot ringan.",
        foto: "/images/daihan/oven-natural-convection.png",
        model: ["LDO-030N", "LDO-060N", "LDO-150N"],
        fitur: [
          "Kontrol PID microprocessor presisi",
          "Interior full stainless steel",
          "Ideal untuk sampel sensitif aliran udara",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +10°C ~ 250°C",
          "Volume Ruang": "30 ℓ / 60 ℓ / 150 ℓ",
        },
        kategori: "oven",
      },
      {
        id: "ov-forced",
        nama: "Forced Convection Oven",
        deskripsi: "Oven dengan kipas sirkulasi udara (forced convection) yang mendistribusikan panas secara merata ke seluruh ruang. Menghasilkan keseragaman suhu yang jauh lebih baik dibandingkan konveksi alami. Dilengkapi damper udara yang dapat disesuaikan untuk mengontrol laju pertukaran udara.",
        foto: "/images/daihan/oven-forced-convection.png",
        model: ["LDO-030F", "LDO-060F", "LDO-150F"],
        fitur: [
          "Kipas sirkulasi untuk distribusi panas merata",
          "Damper udara yang dapat disesuaikan",
          "Keseragaman suhu lebih baik dari konveksi alami",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +10°C ~ 250°C",
          "Volume Ruang": "30 ℓ / 60 ℓ / 150 ℓ",
        },
        kategori: "oven",
      },
      {
        id: "ov-upright-forced",
        nama: "Upright Forced Convection Oven",
        deskripsi: "Oven konveksi paksa berkapasitas besar dengan desain vertikal (upright) 250–400 liter. Cocok untuk pengeringan sampel dalam jumlah besar, aging test komponen industri, dan aplikasi yang memerlukan volume ruang kerja besar.",
        foto: "/images/daihan/oven-upright-forced.png",
        model: ["LDO-250F", "LDO-400F"],
        fitur: [
          "Kapasitas besar 250–400 liter",
          "Desain vertikal hemat ruang lantai",
          "Sirkulasi udara optimal dengan kipas ganda",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +10°C ~ 250°C",
          "Volume Ruang": "250 ℓ / 400 ℓ",
        },
        kategori: "oven",
      },
      {
        id: "ov-hi-temp",
        nama: "High Temperature Oven",
        deskripsi: "Oven suhu tinggi hingga 350°C untuk aplikasi heat treatment, curing coating, dan pengujian stabilitas termal material. Konstruksi heavy-duty dengan insulasi tebal untuk mempertahankan suhu tinggi secara efisien.",
        foto: "/images/daihan/oven-hi-temp.png",
        model: ["LDO-T"],
        fitur: [
          "Suhu operasional hingga 350°C",
          "Konstruksi heavy-duty",
          "Insulasi tebal untuk efisiensi energi",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +10°C ~ 350°C",
        },
        kategori: "oven",
      },
      {
        id: "ov-vacuum",
        nama: "Vacuum Drying Oven",
        deskripsi: "Oven pengeringan vakum untuk mengeringkan sampel pada suhu lebih rendah dibandingkan kondisi atmosfer normal. Tekanan vakum menurunkan titik didih pelarut, sehingga sampel yang sensitif terhadap suhu tinggi dapat dikeringkan tanpa mengalami degradasi atau perubahan struktur.",
        foto: "/images/daihan/oven-vacuum-drying.png",
        model: ["LVO-030", "LVO-060"],
        fitur: [
          "Pengeringan pada tekanan vakum rendah",
          "Cocok untuk sampel sensitif suhu tinggi",
          "Koneksi pompa vakum eksternal",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +10°C ~ 200°C",
          "Volume Ruang": "30 ℓ / 60 ℓ",
        },
        kategori: "oven",
      },
    ],
  },

  // ── INCUBATOR ──
  {
    slug: "incubator",
    nama: "Incubator",
    deskripsiKategori: "Inkubator laboratorium untuk kultur mikroorganisme, penyimpanan sampel biologis, pengujian BOD, dan kultur sel. Tersedia tipe general, BOD, Peltier, CO₂, dan multi-room.",
    produk: [
      {
        id: "ic-general",
        nama: "General Incubator",
        deskripsi: "Inkubator pemanasan standar untuk kultur bakteri, jamur, dan penyimpanan sampel pada suhu stabil di atas suhu ruangan. Kontrol suhu PID presisi dengan interior stainless steel yang mudah dibersihkan. Tersedia dalam volume 30, 60, dan 150 liter.",
        foto: "/images/daihan/incubator-general.png",
        model: ["LIN-030", "LIN-060", "LIN-150"],
        fitur: [
          "Kontrol suhu PID presisi",
          "Interior stainless steel mudah dibersihkan",
          "Pintu dalam kaca tempered untuk observasi",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +5°C ~ 70°C",
          "Volume Ruang": "30 ℓ / 60 ℓ / 150 ℓ",
        },
        kategori: "incubator",
      },
      {
        id: "ic-dual-chamber",
        nama: "Dual Chamber Incubator",
        deskripsi: "Inkubator dengan dua ruang terpisah yang masing-masing memiliki kontrol suhu independen. Memungkinkan inkubasi dua jenis sampel pada suhu berbeda secara bersamaan dalam satu unit, menghemat ruang dan biaya dibandingkan membeli dua unit terpisah.",
        foto: "/images/daihan/incubator-dual-chamber.png",
        model: ["LIN-2060"],
        fitur: [
          "Dua ruang dengan kontrol suhu independen",
          "Hemat ruang dibanding dua unit terpisah",
          "Volume 60 liter per ruang",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +5°C ~ 70°C",
          "Konfigurasi": "60 ℓ × 2 ruang",
        },
        kategori: "incubator",
      },
      {
        id: "ic-bod",
        nama: "Low Temp. BOD Incubator",
        deskripsi: "Inkubator berpendingin untuk pengujian BOD (Biochemical Oxygen Demand) sesuai standar analisis air lingkungan. Mampu beroperasi pada suhu 0–60°C berkat kompresor CFC-free. Juga digunakan untuk penyimpanan sampel biologis dan kultur pada suhu rendah.",
        foto: "/images/daihan/incubator-bod.png",
        model: ["LBI-030", "LBI-060", "LBI-150"],
        fitur: [
          "Kompresor CFC-free ramah lingkungan",
          "Rentang suhu 0–60°C untuk uji BOD",
          "Kontrol PID presisi tinggi",
        ],
        spesifikasi: {
          "Rentang Suhu": "0°C ~ 60°C",
          "Volume Ruang": "30 ℓ / 60 ℓ / 150 ℓ",
        },
        kategori: "incubator",
      },
      {
        id: "ic-multi-room",
        nama: "Multi-Room Incubator",
        deskripsi: "Inkubator berpendingin dengan 2 atau 3 ruang terpisah, masing-masing dengan kontrol suhu independen pada rentang 0–60°C. Efisien untuk laboratorium yang membutuhkan beberapa kondisi inkubasi berbeda sekaligus, misalnya pengujian BOD pada suhu 20°C dan kultur pada suhu 37°C.",
        foto: "/images/daihan/incubator-multi-room.png",
        model: ["LBI-2060", "LBI-3060"],
        fitur: [
          "2 atau 3 ruang dengan kontrol independen",
          "Kompresor CFC-free per ruang",
          "Fleksibel untuk berbagai kebutuhan inkubasi",
        ],
        spesifikasi: {
          "Rentang Suhu": "0°C ~ 60°C",
          "Konfigurasi": "60 ℓ × 2 / 60 ℓ × 3 ruang",
        },
        kategori: "incubator",
      },
      {
        id: "ic-peltier",
        nama: "Peltier Cooled Incubator",
        deskripsi: "Inkubator berpendingin elemen Peltier (termoelektrik), bukan kompresor. Keunggulan utamanya adalah tidak ada getaran dan kebisingan, sehingga cocok untuk aplikasi yang sensitif terhadap vibrasi seperti kultur sel tertentu. Beroperasi pada suhu 0–60°C.",
        foto: "/images/daihan/incubator-peltier.png",
        model: ["LPI-030", "LPI-060"],
        fitur: [
          "Pendinginan Peltier tanpa getaran",
          "Operasi sangat senyap, ideal untuk lingkungan tenang",
          "Tidak memerlukan refrigeran",
        ],
        spesifikasi: {
          "Rentang Suhu": "0°C ~ 60°C",
          "Volume Ruang": "30 ℓ / 60 ℓ",
        },
        kategori: "incubator",
      },
      {
        id: "ic-co2",
        nama: "CO₂ Incubator — Air Jacket",
        deskripsi: "Inkubator CO₂ dengan sistem jaket udara (air jacket) untuk kultur sel mamalia, jaringan, dan mikroorganisme yang membutuhkan lingkungan 5% CO₂. Dilengkapi sensor CO₂ infrared yang stabil dan sistem sterilisasi UV untuk dekontaminasi ruang.",
        foto: "/images/daihan/incubator-co2.png",
        model: ["LCI-A"],
        fitur: [
          "Sensor CO₂ infrared untuk stabilitas jangka panjang",
          "Sistem sterilisasi UV terintegrasi",
          "Jaket udara untuk keseragaman suhu",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +5°C ~ 50°C",
          "Kontrol CO₂": "0 ~ 20%",
        },
        kategori: "incubator",
      },
    ],
  },

  // ── SHAKER ──
  {
    slug: "shaker",
    nama: "Shaker dan Shaking Incubator",
    deskripsiKategori: "Peralatan pengocokan untuk kultur aerobik, fermentasi, dan pencampuran sampel. Tersedia sebagai shaker standalone maupun shaking incubator dengan kontrol suhu terintegrasi.",
    produk: [
      {
        id: "sh-incubator",
        nama: "Shaking Incubator",
        deskripsi: "Inkubator yang dilengkapi platform pengocokan untuk kultur aerobik, fermentasi mikroba, dan reaksi enzimatik yang memerlukan agitasi dan suhu terkontrol secara bersamaan. Mendukung gerakan orbital dan reciprocal dengan kecepatan 20–300 rpm.",
        foto: "/images/daihan/incubator-shaking.png",
        model: ["LSI-030", "LSI-060"],
        fitur: [
          "Gerakan orbital dan reciprocal",
          "Kontrol suhu dan kecepatan digital",
          "Platform dapat disesuaikan dengan berbagai wadah",
        ],
        spesifikasi: {
          "Rentang Suhu": "Ambient +5°C ~ 60°C",
          "Kecepatan Goyang": "20 ~ 300 rpm",
        },
        kategori: "shaker",
      },
      {
        id: "sh-incubator-multi",
        nama: "Multi-Stack Shaking Incubator",
        deskripsi: "Shaking incubator yang dapat ditumpuk 2 atau 3 unit secara vertikal dengan kontrol independen per unit. Menghemat ruang lantai laboratorium hingga 66% dibandingkan unit terpisah. Setiap unit berkapasitas 60 liter.",
        foto: "/images/daihan/incubator-shaking-multi-stack.png",
        model: ["LSI-2060", "LSI-3060"],
        fitur: [
          "Desain tumpuk 2 atau 3 unit",
          "Kontrol independen per unit",
          "Hemat ruang lantai hingga 66%",
        ],
        spesifikasi: {
          "Konfigurasi": "2 / 3 tumpukan",
          "Volume per Unit": "60 ℓ",
        },
        kategori: "shaker",
      },
      {
        id: "sh-standard",
        nama: "Shaker",
        deskripsi: "Shaker laboratorium serbaguna tanpa kontrol suhu untuk aplikasi pencampuran dan pengocokan sampel pada suhu ruangan. Mendukung gerakan orbital dan reciprocal dengan kecepatan 20–300 rpm. Platform dapat diganti sesuai jenis dan ukuran wadah yang digunakan.",
        foto: "/images/daihan/shaker-standard.png",
        model: ["LSK-S", "LSK-D"],
        fitur: [
          "Gerakan orbital dan reciprocal",
          "Platform interchangeable berbagai ukuran",
          "Konstruksi kokoh dan stabil",
        ],
        spesifikasi: {
          "Kecepatan Goyang": "20 ~ 300 rpm",
        },
        kategori: "shaker",
      },
      {
        id: "sh-multi-stack",
        nama: "Multi-Stack Shaker",
        deskripsi: "Shaker bertumpuk 2 atau 3 unit untuk pengoperasian banyak sampel secara simultan tanpa memerlukan ruang meja tambahan. Ideal untuk laboratorium dengan keterbatasan ruang yang perlu mengocok banyak sampel sekaligus.",
        foto: "/images/daihan/shaker-multi-stack.png",
        model: ["LSK-2S", "LSK-3S"],
        fitur: [
          "Desain tumpuk menghemat ruang",
          "2 atau 3 level platform",
          "Kecepatan dapat diatur independen",
        ],
        spesifikasi: {
          "Konfigurasi": "2 / 3 tumpukan",
          "Kecepatan Goyang": "20 ~ 300 rpm",
        },
        kategori: "shaker",
      },
    ],
  },
];

// Helper: get all products flat
export function getAllDaihanProducts(): DaihanProduct[] {
  return daihanKatalog.flatMap((k) => k.produk);
}

// Helper: get total product count
export function getDaihanProductCount(): number {
  return daihanKatalog.reduce((acc, k) => acc + k.produk.length, 0);
}
