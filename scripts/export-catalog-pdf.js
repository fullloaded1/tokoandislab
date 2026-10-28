const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const downloadsDir = path.join(__dirname, '../public/downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

const outputPath = path.join(downloadsDir, 'Katalog-Promo-Akhir-Tahun-AndisLab-2026.pdf');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(chromePath)) {
  console.error('Chrome executable not found at:', chromePath);
  process.exit(1);
}

console.log('Exporting PDF using headless Chrome...');
const url = 'http://localhost:3000/promo-akhir-tahun/katalog/all';

const cmd = `"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${outputPath}" "${url}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(outputPath)) {
    const stat = fs.statSync(outputPath);
    console.log(`Success! PDF exported to: ${outputPath} (${stat.size} bytes)`);
  } else {
    console.error('PDF file was not created.');
  }
} catch (err) {
  console.error('Error exporting PDF:', err);
}
