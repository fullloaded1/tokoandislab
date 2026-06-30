import xlsx from 'xlsx';
import path from 'path';

const filePath = path.resolve('public/custom/Stok MBS 230626.xlsx');
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);
console.log(JSON.stringify(data, null, 2));
