# AndisLab V2.1 - B2B E-Commerce & RFQ Portal

AndisLab adalah platform distributor resmi untuk peralatan laboratorium, bahan kimia, dan furniture lab custom. Versi V2.1 memadukan kemampuan *Request For Quotation* (RFQ) B2B skala besar dengan transaksi langsung (E-Commerce) untuk *Ready Stock*.

## Teknologi Utama
- **Framework:** Next.js 16 (App Router) + React 19
- **Bahasa:** TypeScript
- **Database:** PostgreSQL (Vercel/Neon) + Prisma ORM 6 (ekstensi `vector`)
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **PDF Generation:** jsPDF + jsPDF-Autotable
- **Storage:** Vercel Blob
- **Auth (Admin):** `jose` (JWT HTTP-Only)

## Environment Variables (.env)
Pastikan Anda memiliki variabel berikut di file `.env` lokal Anda:

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"

# AI SDK (Opsional untuk Chatbot / RAG)
GROQ_API_KEY="gsk_xxx"
GOOGLE_GENERATIVE_AI_API_KEY="AIzaSy..."

# Admin Auth (Default jika tidak ada database admin)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="password_rahasia"
JWT_SECRET="secret_panjang_sekali"
```

## Setup & Instalasi Lokal

1. Instal dependensi:
   ```bash
   npm install
   ```

2. Migrasi Database:
   ```bash
   # Gunakan environment staging jika akan melakukan uji skema baru
   npx prisma db pull
   npx prisma generate
   ```

3. Jalankan Development Server:
   ```bash
   npm run dev
   ```

## Aturan Agen (Antigravity)
Semua instruksi pengembangan otomatis berbasis agen tunduk pada aturan di file `AGENTS.md`. Aturan utama mencakup:
- Selalu gunakan `Decimal` untuk data finansial (Uang).
- Pengurangan/penambahan stok wajib berjalan di dalam *DB Transaction*.
- Jangan pernah mengubah logika inti dari alur `Inquiry -> Quotation -> Project -> Invoice` yang sudah berjalan.

## Testing
Sistem diuji menggunakan `Vitest`. Untuk menjalankan test:
```bash
npx vitest run
```
