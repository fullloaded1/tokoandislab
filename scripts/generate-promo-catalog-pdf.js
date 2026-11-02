const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 3005;
const URL = `http://localhost:${PORT}/promo-akhir-tahun/katalog/all`;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function waitForServer(maxAttempts = 35) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(URL);
      if (res.status === 200) {
        const text = await res.text();
        if (text.includes('Andis Sentral Laboratorium') && text.includes('TIER A')) {
          console.log(`Server confirmed live & serving correct catalog at ${URL}`);
          return true;
        }
      }
    } catch {
      // waiting
    }
    await new Promise(r => setTimeout(r, 1500));
  }
  return false;
}

async function main() {
  console.log(`Starting isolated next dev server on port ${PORT}...`);
  const server = spawn('npx', ['next', 'dev', '-p', String(PORT)], {
    shell: true,
    stdio: 'ignore'
  });

  try {
    const isReady = await waitForServer(40);
    if (!isReady) {
      console.error('Timed out waiting for next dev on port', PORT);
      process.exit(1);
    }

    const targets = [
      'C:\\mnt\\user-data\\outputs\\katalog-promo-akhir-tahun-m3.pdf',
      path.join(__dirname, '../public/downloads/katalog-promo-akhir-tahun-m3.pdf'),
      path.join(__dirname, '../public/downloads/Katalog-Promo-Akhir-Tahun-AndisLab-2026.pdf')
    ];

    for (const t of targets) {
      const dir = path.dirname(t);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    const primaryTarget = targets[0];
    console.log(`Printing PDF via headless Chrome to: ${primaryTarget}`);
    const cmd = `"${CHROME_PATH}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${primaryTarget}" "${URL}"`;
    execSync(cmd, { stdio: 'inherit' });

    const stats = fs.statSync(primaryTarget);
    console.log(`Generated ${primaryTarget}: ${stats.size} bytes`);

    for (let i = 1; i < targets.length; i++) {
      fs.copyFileSync(primaryTarget, targets[i]);
      console.log(`Copied to: ${targets[i]}`);
    }

    console.log('All PDF targets regenerated successfully!');
  } finally {
    console.log('Terminating temporary dev server...');
    try {
      execSync(`taskkill /pid ${server.pid} /T /F`);
    } catch {
      // ignore
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
