const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  const url = 'http://localhost:3000/promo-akhir-tahun/katalog/all';
  console.log('Testing connection to:', url);

  try {
    const res = await fetch(url);
    console.log('HTTP Status:', res.status);
    if (res.status !== 200) {
      console.error('Failed to load page, status:', res.status);
      process.exit(1);
    }
  } catch (e) {
    console.error('Fetch error:', e.message);
    process.exit(1);
  }

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  if (!fs.existsSync(chromePath)) {
    console.error('Chrome executable not found at:', chromePath);
    process.exit(1);
  }

  // Ensure target output directories exist
  const outputDirs = [
    'C:\\mnt\\user-data\\outputs',
    path.join(__dirname, '../public/downloads')
  ];

  for (const dir of outputDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const targets = [
    'C:\\mnt\\user-data\\outputs\\katalog-promo-akhir-tahun-m3.pdf',
    path.join(__dirname, '../public/downloads/katalog-promo-akhir-tahun-m3.pdf'),
    path.join(__dirname, '../public/downloads/Katalog-Promo-Akhir-Tahun-AndisLab-2026.pdf')
  ];

  const primaryTarget = targets[0];
  console.log('Printing to PDF via headless Chrome:', primaryTarget);

  const cmd = `"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${primaryTarget}" "${url}"`;
  execSync(cmd, { stdio: 'inherit' });

  if (!fs.existsSync(primaryTarget)) {
    console.error('Failed to generate PDF at:', primaryTarget);
    process.exit(1);
  }

  const stat = fs.statSync(primaryTarget);
  console.log(`Primary PDF generated: ${primaryTarget} (${stat.size} bytes)`);

  // Mirror to public downloads targets
  for (let i = 1; i < targets.length; i++) {
    fs.copyFileSync(primaryTarget, targets[i]);
    console.log(`Copied to: ${targets[i]}`);
  }

  console.log('All PDF exports completed successfully!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
