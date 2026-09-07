// Script: proses 30 gambar produk baru
// - Hapus logo watermark (Batavialab, AelabGroup, OPTO-EDU, CE marks)
// - Resize ke 800x800 dengan padding putih
// - Simpan ke /public/images/products/
// - Update database

const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();
const SRC = 'public/new 30 image produk';
const DEST = 'public/images/products';
const OUTPUT_SIZE = 800;

// Mapping: filename sumber → { outputName, slug, covers: [{left,top,width,height,color}] }
// covers = area yang ditimpa warna (putih) untuk hapus logo
const IMAGE_MAP = [
  {
    src: 'Aelab Benchtop Conductivity Meter 510.webp',
    out: 'conductivity-meter-benchtop-510-aelab.jpg',
    slug: 'aelab-benchtop-conductivity-meter-510',
    // "AELAB GROUP" logo di pojok kiri atas
    covers: [{ left: 0, top: 0, widthPct: 0.28, heightPct: 0.14, color: { r: 255, g: 255, b: 255 } }],
  },
  {
    src: 'BSC 1100 II A2 Custom.jpg',
    out: 'bsc-1100-ii-a2-andislab.jpg',
    slug: 'andislab-bsc-1100-ii-a2',
    // "Batavialab" teks pada body mesin atas
    covers: [{ leftPct: 0.13, topPct: 0.06, widthPct: 0.32, heightPct: 0.08, color: { r: 255, g: 255, b: 255 } }],
  },
  {
    src: 'BSC mini II A2 Prime Custom.jpg',
    out: 'bsc-mini-ii-a2-andislab.jpg',
    slug: 'andislab-bsc-mini-ii-a2-prime',
    // "Batavialab" atas + "We Fight Against Covid-19" badge kanan bawah
    covers: [
      { leftPct: 0.13, topPct: 0.06, widthPct: 0.32, heightPct: 0.08, color: { r: 255, g: 255, b: 255 } },
      { leftPct: 0.60, topPct: 0.72, widthPct: 0.38, heightPct: 0.26, color: { r: 255, g: 255, b: 255 } },
    ],
  },
  {
    src: 'CAL Infrared Thermometer.jpg',
    out: 'infrared-thermometer-cal-01.jpg',
    slug: 'cal-infrared-thermometer-cal-01',
    covers: [],
  },
  {
    src: 'Colony Counter Infitek CC-J2S.jpg',
    out: 'colony-counter-infitek-cc-j2s.jpg',
    slug: 'infitek-colony-counter-cc-j2s',
    // CE mark pojok kiri bawah
    covers: [{ leftPct: 0.01, topPct: 0.88, widthPct: 0.13, heightPct: 0.12, color: { r: 255, g: 255, b: 255 } }],
  },
  {
    src: 'DLAB TopPette 100–1000µl.jpg',
    out: 'toppette-100-1000ul-dlab.jpg',
    slug: 'dlab-toppette-100-1000ul',
    covers: [],
  },
  {
    src: 'Hanna Digital Thermometer HI98501.jpg',
    out: 'digital-thermometer-hi98501-hanna.jpg',
    slug: 'hanna-digital-thermometer-hi98501',
    covers: [],
  },
  {
    src: 'Infitek Analytical Balance BA-N503.jpg',
    out: 'analytical-balance-ba-n503-infitek.jpg',
    slug: 'infitek-analytical-balance-ba-n503',
    // CE mark pojok kiri bawah
    covers: [{ leftPct: 0.01, topPct: 0.88, widthPct: 0.13, heightPct: 0.12, color: { r: 255, g: 255, b: 255 } }],
  },
  {
    src: 'Kursi Donor.png',
    out: 'kursi-donor-medis-andislab.jpg',
    slug: 'kursi-donor-medis',
    covers: [],
  },
  {
    src: 'LAF 1000 V Custom.jpg',
    out: 'laf-1000-vertikal-andislab.jpg',
    slug: 'andislab-laf-1000v-vertikal',
    // "Batavialab" teks pada body mesin atas
    covers: [{ leftPct: 0.13, topPct: 0.04, widthPct: 0.35, heightPct: 0.09, color: { r: 248, g: 248, b: 248 } }],
  },
  {
    src: 'LAF mini V Digital Custom.png',
    out: 'laf-mini-digital-andislab.jpg',
    slug: 'andislab-laf-mini-v-digital',
    covers: [],
  },
  {
    src: 'Labex SZM-6565 Stereo Microscope.jpg',
    out: 'stereo-microscope-szm-6565-labex.jpg',
    slug: 'labex-stereo-microscope-szm-6565',
    covers: [],
  },
  {
    src: 'Labex Scopepad LX97.jpg',
    out: 'scopepad-lx97-labex.jpg',
    slug: 'labex-scopepad-lx97',
    covers: [],
  },
  {
    src: 'Labtech BSC II A2 LCB-0123-A2.jpg',
    out: 'bsc-ii-a2-labtech-lcb-0123.jpg',
    slug: 'labtech-bsc-ii-a2-lcb-0123',
    covers: [],
  },
  {
    src: 'Linear Shaker Infitek SHK-L710.jpg',
    out: 'linear-shaker-shk-l710-infitek.jpg',
    slug: 'infitek-linear-shaker-shk-l710',
    // CE mark pojok kiri bawah
    covers: [{ leftPct: 0.01, topPct: 0.87, widthPct: 0.14, heightPct: 0.13, color: { r: 255, g: 255, b: 255 } }],
  },
  {
    src: 'Mikroskop Opto Edu A12.0205-T.jpg',
    out: 'microscope-trinocular-a12-0205-t-optoedu.jpg',
    slug: 'opto-edu-microscope-a12-0205-t',
    // OPTO-EDU badge kiri atas
    covers: [{ leftPct: 0.01, topPct: 0.01, widthPct: 0.20, heightPct: 0.09, color: { r: 255, g: 255, b: 255 } }],
  },
  {
    src: 'Mikroskop Opto Edu A33.5121-TH.jpg',
    out: 'microscope-trinocular-a33-5121-th-optoedu.jpg',
    slug: 'opto-edu-microscope-a33-5121-th',
    // OPTO-EDU badge kiri atas
    covers: [{ leftPct: 0.01, topPct: 0.01, widthPct: 0.20, heightPct: 0.09, color: { r: 255, g: 255, b: 255 } }],
  },
  {
    src: 'Pass Box Dynamic.jpg',
    out: 'pass-box-dynamic-andislab.jpg',
    slug: 'andislab-pass-box-dynamic',
    covers: [],
  },
  {
    src: 'Pharmacy Refrigerator Meling YC-130L.png',
    out: 'pharmacy-refrigerator-yc-130l-meling.jpg',
    slug: 'meling-pharmacy-refrigerator-yc-130l',
    covers: [],
  },
  {
    src: 'Scrub Station 1 Person.jpg',
    out: 'scrub-station-1-person-andislab.jpg',
    slug: 'scrub-station-1-person',
    covers: [],
  },
  {
    src: 'Taitec BR-23FH Incubator Shaker.jpg',
    out: 'incubator-shaker-br-23fh-taitec.jpg',
    slug: 'taitec-incubator-shaker-br-23fh',
    covers: [],
  },
  {
    src: 'Taitec GBR-200 Large Incubator Shaker (.jpg',
    out: 'large-incubator-shaker-gbr-200-taitec.jpg',
    slug: 'taitec-large-incubator-shaker-gbr-200',
    covers: [],
  },
  {
    src: 'Taitec MBR-032 Incubator Shaker.jpg',
    out: 'incubator-shaker-mbr-032-taitec.jpg',
    slug: 'taitec-incubator-shaker-mbr-032',
    covers: [],
  },
  {
    src: 'Taitec Rotator RT-50N.jpg',
    out: 'rotator-rt-50n-taitec.jpg',
    slug: 'taitec-rotator-rt-50n',
    covers: [],
  },
  {
    src: 'Taitec VBR-104 Incubator Shaker.jpg',
    out: 'incubator-shaker-vbr-104-taitec.jpg',
    slug: 'taitec-incubator-shaker-vbr-104',
    covers: [],
  },
  {
    src: 'Vacuum Pump Value VE115N.avif',
    out: 'vacuum-pump-ve115n-value.jpg',
    slug: 'value-vacuum-pump-ve115n',
    covers: [],
  },
  {
    src: 'Yamato Drying Oven DKN413C.jpg',
    out: 'drying-oven-dkn413c-yamato.jpg',
    slug: 'yamato-drying-oven-dkn413c',
    covers: [],
  },
  {
    src: 'Yamato Incubator IC413C.jpg',
    out: 'incubator-ic413c-yamato.jpg',
    slug: 'yamato-incubator-ic413c',
    covers: [],
  },
  {
    src: 'ass Box 400.webp',
    out: 'pass-box-400-andislab.jpg',
    slug: 'andislab-pass-box-400',
    covers: [],
  },
  {
    src: 'ph meter.jpg',
    out: 'ph-meter-benchtop.jpg',
    slug: 'ph-meter-benchtop-standar',
    covers: [],
  },
];

async function buildWhiteRect(width, height, color) {
  return sharp({
    create: { width, height, channels: 3, background: color },
  })
    .jpeg()
    .toBuffer();
}

async function processImage(entry) {
  const srcPath = path.join(SRC, entry.src);
  const destPath = path.join(DEST, entry.out);

  if (!fs.existsSync(srcPath)) {
    console.log(`  SKIP (tidak ada): ${entry.src}`);
    return null;
  }

  try {
    const meta = await sharp(srcPath).metadata();
    const W = meta.width;
    const H = meta.height;

    let pipeline = sharp(srcPath);

    // Konversi ke JPEG base dulu (handle webp/avif/png)
    let imgBuffer = await pipeline.jpeg({ quality: 92 }).toBuffer();

    // Terapkan covers (hapus logo)
    if (entry.covers && entry.covers.length > 0) {
      const composites = [];
      for (const c of entry.covers) {
        const left = c.left !== undefined ? c.left : Math.round((c.leftPct || 0) * W);
        const top = c.top !== undefined ? c.top : Math.round((c.topPct || 0) * H);
        const w = Math.round((c.widthPct || 0) * W) || c.width || 50;
        const h = Math.round((c.heightPct || 0) * H) || c.height || 50;
        const rectBuf = await buildWhiteRect(w, h, c.color || { r: 255, g: 255, b: 255 });
        composites.push({ input: rectBuf, left, top });
      }
      imgBuffer = await sharp(imgBuffer).composite(composites).jpeg({ quality: 92 }).toBuffer();
    }

    // Resize ke 800x800 contain (padding putih)
    await sharp(imgBuffer)
      .resize(OUTPUT_SIZE, OUTPUT_SIZE, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(destPath);

    console.log(`  OK: ${entry.src} → ${entry.out} (${W}x${H})`);
    return `/images/products/${entry.out}`;
  } catch (err) {
    console.log(`  ERROR ${entry.src}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('=== Memproses gambar produk ===\n');

  const updates = [];

  for (const entry of IMAGE_MAP) {
    const newPath = await processImage(entry);
    if (newPath) {
      updates.push({ slug: entry.slug, image: newPath });
    }
  }

  console.log(`\n=== Update database (${updates.length} produk) ===\n`);

  for (const u of updates) {
    await prisma.product.update({
      where: { slug: u.slug },
      data: { image: u.image },
    });
    console.log(`  Updated: ${u.slug} → ${u.image}`);
  }

  console.log('\nSelesai!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
