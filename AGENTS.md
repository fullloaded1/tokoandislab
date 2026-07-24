<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Aturan Main Global (Antigravity)

1. **Uang = `Decimal`, JANGAN `number`/float.** Semua kolom uang `Decimal @db.Decimal(16,2)`. Di kode, lakukan aritmetika uang dengan library `decimal.js` (atau `Prisma.Decimal`), bukan operator JS biasa. Saat kirim ke client/JSON, serialisasi dengan `.toString()`.
2. **Status/type = `enum` Prisma**, bukan string bebas.
3. **Snapshot harga:** `OrderItem`/`QuotationItem` menyimpan harga & nama saat transaksi, bukan hanya relasi.
4. **Perubahan stok WAJIB di dalam satu DB transaction** dengan guard ketersediaan; tidak boleh ada operasi stok di luar transaksi.
5. **Audit:** setiap perubahan uang/status oleh admin (verifikasi bayar, edit termin, koreksi stok) menulis ke `AuditLog`.
6. **Rahasia:** jangan pernah commit `.env*`, API key, atau token. Jangan menaruh data sensitif di URL.
7. **Jangan rusak jalur RFQ.** Pipeline `Inquiry→Quotation→Project→Invoice` harus tetap berfungsi penuh sepanjang pengerjaan.
8. **Setiap fitur baru harus punya minimal satu test** untuk logika kritis (hitung total, PPN, pengurangan stok).
9. **Type-check & lint harus hijau** sebelum sebuah task dianggap selesai (`npx tsc --noEmit` dan `npm run lint`).
