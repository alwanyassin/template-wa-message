# WhatsApp Message Template Generator

Aplikasi web modern dan responsif untuk meng-generate pesan WhatsApp secara otomatis dan rapi berdasarkan template yang sering digunakan (Akses CMS Editor Promedia dan Google Tools 2G + Dashboard Traktir Kopi).

Aplikasi ini 100% *client-side*, sangat cepat, dan responsif.

---

## ✨ Fitur Utama

1. **Dua Template Siap Pakai**:
   - **Template 1 (Akses CMS Editor Promedia)**:
     - Nama Media dinamis.
     - Multi-email / username penulis (bisa tambah baris atau *paste* banyak email sekaligus).
     - Input password (dengan tombol tampilkan/sembunyikan).
     - Pilihan preset Link CMS Editor (3 pilihan dummy) + opsi link custom.
   - **Template 2 (Akses 2G & Dashboard Traktir Kopi)**:
     - Nama Media dinamis.
     - Link Google Analytics 4 (GA4).
     - Link Google Data Studio / Looker Studio.
     - Akses Email (otomatis sinkron ke username Traktir Kopi).
     - Password Dashboard Traktir Kopi.
     - Link Dashboard Traktir Kopi (default: `https://traktir-kopi.promediateknologi.id/` dan bisa diedit).

2. **Dua Pilihan Mode Format**:
   - **Mode Rapi (WhatsApp Markdown)**: Menggunakan fitur native WhatsApp (teks tebal `*bold*`, password dalam format kode `` `monospace` ``, bullet point rapi, dan kata pengantar profesional).
   - **Format Asli (Standar)**: Persis 100% seperti draft asli sebelumnya.

3. **Live WhatsApp Preview**:
   - Tampilan bubble chat WhatsApp realistis yang otomatis ter-update secara *real-time* saat Anda mengetik di form.
   - Indikator jumlah kata dan karakter.

4. **Aksi Instan**:
   - **Salin Pesan (Copy to Clipboard)** sekali klik.
   - **Buka di WhatsApp Web / App** (`https://api.whatsapp.com/send?text=...`) dengan opsi nomor telepon tujuan langsung.
   - **Reset Form** untuk mengembalikan ke data awal.

---

## 🛠️ Menjalankan di Komputer Lokal

Pastikan Node.js (versi 18+) terpasang di komputer Anda.

```bash
# 1. Masuk ke folder project
cd template-wa-message

# 2. Install dependensi
npm install

# 3. Jalankan server lokal
npm run dev
```

Buka browser di `http://localhost:5173`.

---

## 🚀 Panduan Build & Production

Untuk membuat bundle production:

```bash
npm run build
```

Folder `dist` yang dihasilkan berisi aset statis dan siap di-hosting di berbagai web hosting atau server statis (seperti GitHub Pages, Vercel, Netlify, Nginx, dsb).

---

## 🗄️ Panduan Setup Cloudflare D1 Database (Untuk Kolaborasi Tim)

Aplikasi ini dilengkapi fitur **Direktori Media Bersama** dan **Riwayat Pesan Tim** yang dapat terhubung ke **Cloudflare D1 Database**:

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Storage & Databases** > **D1**.
2. Klik **Create database**, beri nama: `wa-template-db`.
3. Buka database tersebut, klik tab **Console**, lalu salin dan eksekusi query dari file [`d1/schema.sql`](d1/schema.sql).
4. Di project Cloudflare Pages Anda, buka **Settings** > **Functions** > **D1 database bindings**:
   - **Variable name**: `DB`
   - **D1 database**: pilih `wa-template-db`
5. *(Catatan)*: Jika dijalankan di lingkungan lokal tanpa D1, aplikasi memiliki fitur *smart fallback* ke penyimpanan lokal browser (`localStorage`) secara otomatis.

---

## 💻 Tech Stack
- **Framework**: React 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Cloudflare D1 (Serverless SQLite)
- **Backend API**: Cloudflare Pages Functions
