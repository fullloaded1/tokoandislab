import fs from 'fs';
import path from 'path';

const csvPath = path.join(__dirname, '..', 'full_database.csv');
const reportDir = path.join(__dirname, '..', 'reports');

if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir);
}

function classifyIndustry(nama: string) {
  nama = nama.toLowerCase().trim();
  if (nama.includes('rsud') || nama.includes('rumah sakit') || nama.includes('rs ') || nama.includes('klinik') || nama.includes('medika')) return 'Farmasi_Kesehatan';
  if (nama.includes('dinas') || nama.includes('uptd') || nama.includes('kementerian') || nama.includes('badan') || nama.includes('lipi') || nama.includes('brin')) return 'Pemerintah';
  if (nama.includes('farma') || nama.includes('apotek') || nama.includes('pharin') || nama.includes('pharma')) return 'Farmasi_Kesehatan';
  if (nama.includes('univ') || nama.includes('kampus') || nama.includes('sekolah') || nama.includes('smk')) return 'Pendidikan';
  if (nama.includes('pt ') || nama.includes('pt.') || nama.includes('cv ') || nama.includes('tbk') || nama.includes('manufaktur')) return 'Manufaktur';
  return 'Lainnya';
}

function extractAreaCode(phone: string) {
  phone = (phone || '').replace(/[^0-9]/g, '');
  if (!phone) return null;
  if (phone.startsWith('0254') || phone.startsWith('0253')) return 'Cilegon_Banten';
  if (phone.startsWith('031')) return 'Surabaya';
  if (phone.startsWith('021')) return 'Jabodetabek';
  return 'Other_Geo';
}

async function main() {
  if (!fs.existsSync(csvPath)) {
    console.error("Database tidak ditemukan di", csvPath);
    return;
  }

  const raw = fs.readFileSync(csvPath);
  let content = '';
  if (raw[0] === 0xFF && raw[1] === 0xFE) {
    content = raw.toString('utf16le');
  } else {
    content = raw.toString('utf8');
  }
  content = content.replace(/\u0000/g, '');

  const lines = content.split('\n');
  const headers = "Nama Perusahaan,Telepon Kantor,Nama PIC,Jabatan,Nomor WA,Status Panggilan,Kebutuhan Umum\n";

  let manufakturWa = headers;
  let farmasiWa = headers;
  let cilegonCall = headers;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const cols = [];
    let current = '';
    let inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; continue; }
      if (ch === ',' && !inQuote) { cols.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    cols.push(current.trim());

    const nama = cols[0] || '';
    const telKantor = cols[1] || '';
    const namaPIC = cols[2] || '';
    const jabatan = cols[3] || '';
    const wa = cols[4] || '';
    const statusCall = cols[5] || '';
    const kebutuhan = cols[6] || '';

    const industry = classifyIndustry(nama);
    const area = extractAreaCode(telKantor);
    const hasWA = wa.length > 5;

    const rowStr = `"${nama}","${telKantor}","${namaPIC}","${jabatan}","${wa}","${statusCall}","${kebutuhan}"\n`;

    // 1. Manufaktur Leads with WA
    if (industry === 'Manufaktur' && hasWA) {
      manufakturWa += rowStr;
    }

    // 2. Farmasi/Kesehatan Leads with WA
    if (industry === 'Farmasi_Kesehatan' && hasWA) {
      farmasiWa += rowStr;
    }

    // 3. Cilegon/Banten Leads (Call or WA)
    if (area === 'Cilegon_Banten') {
      cilegonCall += rowStr;
    }
  }

  fs.writeFileSync(path.join(reportDir, '1_manufaktur_wa_blast.csv'), manufakturWa);
  fs.writeFileSync(path.join(reportDir, '2_farmasi_wa_blast.csv'), farmasiWa);
  fs.writeFileSync(path.join(reportDir, '3_cilegon_leads.csv'), cilegonCall);

  console.log("✅ Analisis Selesai!");
  console.log("File laporan telah dibuat di folder 'reports/'.");
  console.log("Tim Sales dapat menggunakan file ini untuk promosi link website baru.");
}

main().catch(console.error);
