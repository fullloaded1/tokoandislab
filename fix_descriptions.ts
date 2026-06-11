import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const realisticDescriptions: Record<string, string> = {
  "kit-uji-air-pendingin": "Kit pengujian air pendingin (Cooling Water Test Kit) komprehensif dari Lovibond. Dirancang khusus untuk pemantauan rutin kualitas air pada menara pendingin (cooling tower) dan boiler. Dilengkapi reagen lengkap untuk mencegah pembentukan kerak, korosi, dan pertumbuhan mikrobiologi.",
  "incubator-oven-do-150f": "Incubator Oven DO-150F dari Daihan Labtech hadir dengan sistem sirkulasi udara paksa (Forced Convection) untuk distribusi suhu yang sangat merata. Menggunakan kontroler mikrokontroler PID digital yang akurat, dengan ruang dalam (chamber) berbahan Stainless Steel anti-karat. Sangat cocok untuk proses inkubasi mikrobiologi maupun sterilisasi alat.",
  "centrifuge-cf-10": "Microcentrifuge CF-10 dari Daihan Labtech menawarkan putaran berkecepatan tinggi dalam desain yang ringkas. Dilengkapi dengan motor tanpa sikat (brushless) yang awet dan hening, antarmuka digital yang intuitif, serta rotor sudut tetap yang ideal untuk preparasi DNA/RNA dan sampel klinis.",
  "hotplate-hp-300": "Hotplate Analog HP-300 dari Daihan Labtech dengan pelat pemanas berlapis keramik (Ceramic Coated) yang sangat tahan terhadap bahan kimia korosif. Mampu mencapai suhu maksimal dengan cepat dan stabil. Solusi andal untuk pemanasan larutan di laboratorium umum.",
  "water-bath-wb-22": "Water Bath WB-22 (22 Liter) dari Daihan Labtech dengan kontrol digital presisi. Bak berbahan Stainless Steel 304 tanpa sambungan (seamless) meminimalkan risiko kebocoran dan mempermudah pembersihan. Sempurna untuk inkubasi tabung reaksi, pencairan media, dan pengujian termal.",
  "floc-tester-et-730": "Lovibond Floc Tester ET 730 adalah instrumen pengujian koagulasi dan flokulasi (Jar Test) dengan 4 hingga 6 posisi putaran (spindle). Memungkinkan optimalisasi penggunaan bahan kimia koagulan pada instalasi pengolahan air bersih (WTP) dan air limbah (WWTP).",
  "lemari-penyimpanan-mudah-terbakar": "Lemari Penyimpanan Bahan Kimia Mudah Terbakar (Flammable Storage Cabinet) buatan Andis Lab Custom. Memenuhi standar keselamatan tinggi dengan insulasi dinding ganda tahan api (Double Wall), ventilasi penahan percikan api, dan rak yang dapat menahan tumpahan kimia.",
  "labu-takar-volumetrik-250ml": "Labu Takar (Volumetric Flask) Pyrex® kapasitas 250ml Kelas A. Terbuat dari kaca Borosilikat 3.3 berkualitas premium yang sangat bening dan tahan kejutan suhu. Tingkat toleransi volume yang sangat akurat, ideal untuk preparasi larutan standar analitik.",
  "seri-handheld-sd": "Lovibond Seri Handheld SD adalah alat ukur portabel yang tahan debu dan air (IP67). Dirancang untuk pengukuran parameter air di lapangan seperti pH, ORP, Konduktivitas, dan Oksigen Terlarut (DO). Memiliki layar LCD yang besar dan mudah dibaca.",
  "pipet-ukur": "Pipet Ukur (Measuring Pipette) Pyrex® Kelas A untuk pemindahan cairan dengan volume yang presisi. Skala ukur tercetak dengan enamel biru yang kontras dan permanen, tidak mudah luntur oleh paparan bahan kimia.",
  "gelas-piala-beaker-250ml": "Gelas Piala (Beaker Glass) Pyrex® Griffin kapasitas 250ml. Memiliki dinding yang tebal dari kaca Borosilikat untuk ketahanan terhadap bahan kimia kuat dan pemanasan langsung. Lengkap dengan corong tuang (spout) dan skala volume yang jelas.",
  "thermoreactor-rd-125": "Thermoreactor Lovibond RD 125 dirancang untuk proses digesti sampel analisis COD (Chemical Oxygen Demand), TOC, Total Fosfat, dan Total Nitrogen. Menawarkan pemanasan yang stabil pada suhu standar (misal 150°C selama 2 jam) dengan blok aluminium pemanas yang merata.",
  "labu-erlenmeyer-250ml": "Labu Erlenmeyer Pyrex® 250ml tipe leher sempit (Narrow Mouth). Terbuat dari material kaca Borosilikat yang tahan panas dan bahan kimia korosif. Bentuk konikalnya memaksimalkan proses pencampuran dan titrasi tanpa takut cairan terpercik keluar.",
  "silinder-ukur": "Silinder Ukur (Measuring Cylinder) Pyrex® dengan dasar heksagonal (Hexagonal Base) agar lebih stabil dan tidak mudah terguling. Dikalibrasi 'To Contain' (TC) dengan batas toleransi Kelas A untuk pengukuran volume cairan yang sangat presisi.",
  "lemari-asam-fume-hood": "Lemari Asam (Fume Hood) FH Series buatan Andis Lab Custom dirancang khusus untuk melindungi operator dari paparan gas dan uap kimia berbahaya. Menggunakan baffle aerodinamis, exhaust fan anti-korosi, serta meja kerja (worktop) berbahan Phenolic Resin atau Epoxy yang sangat kuat.",
  "wet-scrubber": "Sistem Wet Scrubber Andis Lab Custom untuk filtrasi dan netralisasi gas buang kimia sebelum dilepas ke lingkungan. Berfungsi menetralisir uap asam dan basa menggunakan larutan penyerap. Memenuhi standar regulasi emisi lingkungan pabrik.",
  "autoclave-maxterile": "Autoclave MaXterile 60L dari Daihan Labtech. Sterilisator uap bertekanan tinggi tipe vertikal dengan kontroler otomatis penuh (Full Automatic). Dilengkapi fitur keselamatan seperti proteksi tekanan berlebih (Over-pressure) dan kunci pintu interlock.",
  "flokulator-portabel-fb-4s": "Flokulator Portabel FB-4S dari Andis Lab untuk kebutuhan Jar Test di lapangan. Memiliki penggerak putaran yang sangat presisi dan senyap dengan pengaturan kecepatan variabel. Sangat portabel, memudahkan pengujian dosis koagulan langsung di lokasi sumber air.",
  "kabinet-termostatik-bod": "Kabinet Termostatik (Incubator BOD) dari Lovibond menyediakan kondisi temperatur yang sangat stabil (biasanya 20°C) untuk pengujian Biochemical Oxygen Demand. Dilengkapi rak penahan beban berat dan soket listrik internal untuk perangkat pengaduk OxiDirect.",
  "daihan-ldf-9010u-ultra-low-temp-freezer": "Ultra Low Temperature Freezer LDF-9010U dari Daihan Labtech. Mampu menjaga suhu hingga -86°C secara konsisten berkat teknologi kompresor ganda efisiensi tinggi (Cascade Refrigeration System). Ideal untuk penyimpanan sampel biologis jangka panjang, DNA/RNA, dan virus.",
  "daihan-ldo-080f-forced-convection-oven": "Oven Pengering LDO-080F dari Daihan Labtech menggunakan sistem kipas konveksi paksa (Forced Air Convection) untuk mempercepat pengeringan dan meratakan suhu. Pilihan ideal untuk sterilisasi panas kering dan uji penuaan (aging) material.",
  "daihan-gmc-361-microcentrifuge-with-timer": "Microcentrifuge GMC-361 dengan fitur pengaturan waktu (Timer) terintegrasi. Perangkat andalan dari Daihan Labtech ini memberikan performa sentrifugasi stabil pada kecepatan konstan, ditujukan untuk pemisahan fase cair-padat pada sampel berukuran mikro (tube eppendorf).",
  "daihan-lac-1011sv-autoclave": "Autoclave Sterilisasi Vertikal LAC-1011SV. Dirancang untuk operasi otomatis dan aman dengan pemanas listrik terintegrasi. Memiliki siklus sterilisasi yang dapat diprogram untuk berbagai bahan seperti instrumen gelas, media kultur, dan cairan.",
  "daihan-lac-1021sv-autoclave": "Autoclave Vertikal LAC-1021SV dari Daihan Labtech dengan kapasitas yang ditingkatkan. Sistem kendali suhu dan tekanan memastikan uap jenuh mencapai setiap sudut ruangan (chamber).",
  "daihan-lac-1031sv-autoclave": "Autoclave Vertikal Otomatis LAC-1031SV dengan fitur pembuangan uap semi-otomatis dan alarm siklus selesai. Dirancang untuk laboratorium mikrobiologi dan klinis dengan beban kerja padat.",
  "daihan-lac-1031svf-autoclave": "Autoclave LAC-1031SVF dari Daihan Labtech dilengkapi fitur pengeringan vakum tambahan (Vacuum Drying), memastikan instrumen dan material pakaian langsung kering sempurna segera setelah proses sterilisasi usai.",
  "daihan-lbh-t02-dry-block-heater": "Dry Block Heater LBH-T02 memungkinkan pemanasan sampel di dalam tabung reaksi dengan kontrol presisi tinggi dan sangat seragam. Blok aluminium (bisa ditukar ukurannya) mentransfer panas secara optimal. Aman digunakan di dalam lemari asam.",
  "daihan-lco-065ai-air-jacket-co2-incubator": "Inkubator CO2 tipe Air Jacket LCO-065AI. Mendukung pertumbuhan kultur sel mamalia berkat kontrol gas CO2 inframerah (IR Sensor) yang sangat sensitif, kelembaban terjaga tinggi, dan sistem dekontaminasi sterilisasi bawaan.",
  "daihan-lco-165ai-air-jacket-co2-incubator": "Inkubator Kultur Sel CO2 Air Jacket kapasitas besar (LCO-165AI). Menyediakan lingkungan kultur in vitro yang paling mirip dengan kondisi in vivo, bebas dari kontaminasi bakteri berkat filter HEPA dan interior tembaga (opsional).",
  "daihan-lcv-203gr-vaccine-pharmacy-refrigerator": "Kulkas Penyimpanan Vaksin & Farmasi (Pharmacy Refrigerator) LCV-203GR dari Daihan Labtech. Dilengkapi sistem sirkulasi udara dingin dinamis untuk mempertahankan stabilitas suhu 2°C - 8°C yang disyaratkan oleh regulasi penyimpanan vaksin internasional.",
  "daihan-ldf-9015s-ultra-low-temp-freezer": "Ultra Low Temperature Freezer LDF-9015S (Tipe Chest/Peti). Menyimpan bio-sampel berharga pada -86°C dengan perlindungan insulasi poliuretan yang tebal, meminimalisir kehilangan suhu dingin saat alat mengalami putus aliran listrik.",
  "daihan-lom-205rm-roller-mixer": "Roller Mixer LOM-205RM memberikan aksi pengadukan memutar (rolling) dan mengayun (tilting) secara bersamaan. Sangat efisien untuk pencampuran sampel darah dalam tabung vakum agar mencegah koagulasi secara lembut tanpa merusak struktur sel.",
  "daihan-lom-210rm-roller-mixer": "Roller Mixer kapasitas ekstra (LOM-210RM) dengan lebih banyak roda silinder pemutar. Sesuai untuk laboratorium patologi dan rumah sakit dengan antrian sampel cairan kental (viscous) atau suspensi yang tinggi setiap harinya.",
  "daihan-lwb-211a-analog-water-bath": "Water Bath Analog LWB-211A mengedepankan kemudahan operasional klasik melalui pengaturan putar (knob). Elemen pemanas berkualitas tinggi menjamin umur pakai alat yang sangat lama di lingkungan laboratorium yang keras.",
  "daihan-lwd-104s-s-s-basic-water-still": "Alat Penyuling Air (Water Still) LWD-104S. Unit destilasi air berbahan baja tahan karat (Stainless Steel) yang memproduksi air aquades murni, bebas mineral, dan bebas pirogen. Kompak dan sangat ideal untuk suplai harian air analitik di lab.",
  "daihan-ldo-060e-universal-drying-oven": "Oven Pengering Universal LDO-060E merupakan oven konveksi udara paksa berkapasitas menengah. Ruang pengeringan yang seragam menjadikannya standar industri untuk preparasi sampel padat, pengeringan gelas ukur, dan eksperimen uji panas konstan.",
  "daihan-ldo-030e-universal-drying-oven": "Oven Universal LDO-030E berkapasitas kompak. Dilengkapi kaca pantau pada pintu agar pengguna dapat melihat status sampel tanpa harus membuka pintu oven dan kehilangan panas, menunjang efisiensi energi.",
  "daihan-llf-403sr-laboratory-freezer": "Laboratory Freezer LLF-403SR. Kulkas pembeku medis untuk stabilitas temperatur di kisaran -20°C hingga -40°C. Cocok bagi fasilitas penelitian medis untuk penyimpanan reagen enzim, plasma darah, dan bahan riset farmasi.",
  "daihan-ldf-9020u-ultra-low-temp-freezer": "Upright Ultra-Low Temperature Freezer LDF-9020U. Model berdiri yang menghemat ruang lab, menawarkan performa pembekuan ultra-rendah dan perlindungan alarm komprehensif untuk pengamanan bio-banking Anda.",
  "daihan-ldf-9110c-ultra-low-temp-freezer": "Chest Freezer Suhu Ultra-Rendah LDF-9110C. Sistem pendinginan kompresor Hermetic ganda memberikan cadangan performa dan proses recovery (pemulihan suhu) yang cepat seusai pintu dibuka-tutup.",
  "ph-meter-lovibond": "pH Meter Portabel SD 50 dari Lovibond. Menawarkan pembacaan pH dan suhu yang cepat dan akurat. Menggunakan desain casing tahan air dan fitur kalibrasi otomatis hingga 3 titik, membuatnya sebagai teman wajib ahli lapangan.",
  "pyrex-screw-cap-media-bottle-500ml": "Botol Media Pyrex® 500ml dengan tutup ulir (Screw Cap) GL45 biru dan cincin tuang. Dibuat dari kaca borosilikat yang aman untuk disterilkan berulang kali di dalam autoclave. Diperuntukkan bagi penyimpanan media mikrobiologi dan zat kimia reaktif.",
  "biosafety-cabinet-bsc-custom": "Biosafety Cabinet (BSC) Kelas II Tipe A2 buatan Andis Lab Custom. Melindungi operator, lingkungan, dan sampel melalui sistem filtrasi HEPA filter 99.99%. Ideal untuk penanganan agen patogen risiko menengah di fasilitas kesehatan.",
  "laminar-air-flow-laf-custom": "Laminar Air Flow (LAF) Custom Andis Lab menyuplai udara bertekanan positif ultra-bersih (HEPA/ULPA Filtered) melintasi meja kerja. Berfungsi utama melindungi media kultur jaringan tumbuhan atau komponen elektronika mikro dari partikel debu sekecil apapun."
};

async function main() {
  console.log('Updating product descriptions with accurate content...');
  let count = 0;

  for (const [slug, description] of Object.entries(realisticDescriptions)) {
    const updated = await prisma.product.updateMany({
      where: { slug: slug },
      data: { description: description }
    });
    if (updated.count > 0) count++;
  }

  console.log(`Successfully updated ${count} products.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
