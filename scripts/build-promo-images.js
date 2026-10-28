const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(process.cwd(), 'public', 'images', 'promo');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const placeholderSvg = `<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#F8FAFC"/>
  <rect x="40" y="40" width="720" height="720" rx="24" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="8 8"/>
  <circle cx="400" cy="340" r="70" fill="#EFF6FF"/>
  <path d="M370 340L390 360L430 320" stroke="#2563EB" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="400" y="460" text-anchor="middle" fill="#0F172A" font-family="system-ui, sans-serif" font-size="24" font-weight="700">AndisLab Ready Stock</text>
  <text x="400" y="495" text-anchor="middle" fill="#64748B" font-family="system-ui, sans-serif" font-size="16">Unit Tersedia di Gudang • Garansi Resmi</text>
  <rect x="290" y="530" width="220" height="40" rx="20" fill="#DBEAFE"/>
  <text x="400" y="555" text-anchor="middle" fill="#1D4ED8" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Dokumen Lengkap SPJ</text>
</svg>`;

fs.writeFileSync(path.join(outDir, 'placeholder.svg'), placeholderSvg);

const mapping = {
  'linear-shaker-shk-l710': 'public/images/products/linear-shaker-shk-l710-infitek.jpg',
  'mikroskop-opto-a12-0205-t': 'public/images/products/microscope-trinocular-a12-0205-t-optoedu.jpg',
  'mikroskop-opto-a33-5121-th': 'public/images/products/microscope-trinocular-a33-5121-th-optoedu.jpg',
  'stereo-microscope-szm-6565': 'public/images/products/stereo-microscope-szm-6565-labex.jpg',
  'ph-meter-benchtop': 'public/images/products/ph-meter-benchtop.jpg',
  'autoclave-lac-1021sv': 'public/images/daihanreadystock/LAC-1021SV AUTOCLAVE.png',
  'incubator-yamato-ic413c': 'public/images/products/incubator-ic413c-yamato.jpg',
  'autoclave-lac-1011sv': 'public/images/daihanreadystock/LAC-1011SV AUTOCLAVE.jpg',
  'analytical-balance-ba-n503': 'public/images/products/analytical-balance-ba-n503-infitek.jpg',
  'ult-freezer-ldf-9020u': 'public/images/daihanreadystock/ultra low temperature freezer ,daihan labtech.png',
  'ult-freezer-ldf-9015s': 'public/images/daihanreadystock/LDF-9015S ULTRA LOW TEMP. FREEZER.jpg',
  'ult-freezer-ldf-9010u': 'public/images/daihanreadystock/ultra low temperature freezer ,daihan labtech.png',
  'bsc-lcb-0123-a2': 'public/images/products/bsc-ii-a2-labtech-lcb-0123.jpg',
  'medical-freezer-llf-403sr': 'public/images/daihanreadystock/LLF-403SR LABORATORY FREEZER.jpg',
  'laf-1000-vertikal': 'public/images/products/laf-1000-vertikal-andislab.jpg'
};

async function processImages() {
  for (const [slug, relPath] of Object.entries(mapping)) {
    const src = path.join(process.cwd(), relPath);
    const dest = path.join(outDir, slug + '.jpg');
    if (fs.existsSync(src)) {
      try {
        await sharp(src)
          .resize(800, 800, { fit: 'contain', background: '#FFFFFF' })
          .jpeg({ quality: 85 })
          .toFile(dest);
        console.log('Processed:', slug);
      } catch (err) {
        console.error('Error processing', slug, err);
      }
    } else {
      console.warn('Source missing:', relPath);
    }
  }
  console.log('All images ready in', outDir);
}

processImages();
