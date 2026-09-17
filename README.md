# WhatsApp Message Template Generator

Aplikasi web modern dan responsif untuk meng-generate pesan WhatsApp secara otomatis dan rapi berdasarkan template yang sering digunakan (Akses CMS Editor Promedia dan Google Tools 2G + Dashboard Traktir Kopi).

Aplikasi ini 100% *client-side*, sangat cepat, dan dioptimasi khusus untuk di-hosting secara **gratis di Cloudflare Pages**.

---

## ✨ Fitur Utama

1. **2 Template Siap Pakai**:
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

2. **2 Pilihan Mode Format**:
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

## 🚀 Panduan Hosting Gratis di Cloudflare Pages

Cloudflare Pages menyediakan hosting gratis dengan unlimited bandwidth dan SSL otomatis. Ada 2 cara mudah:

### Cara 1: Menghubungkan Repository GitHub (Rekomendasi - Otomatis Update)

1. Push folder project ini ke repository GitHub Anda (`template-wa-message`).
2. Masuk ke dashboard [Cloudflare](https://dash.cloudflare.com/) lalu pilih **Compute (Workers & Pages)** > **Create application** > tab **Pages** > **Connect to Git**.
3. Pilih repository GitHub `template-wa-message`.
4. Di bagian **Build settings**:
   - **Framework preset**: `Vite` (atau `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. *(Opsional)* Di bagian **Environment variables**, tambahkan:
   - Variable name: `NODE_VERSION`
   - Value: `22`
6. Klik **Save and Deploy**.
7. Selesai! Web Anda akan aktif di domain gratis seperti `template-wa-message.pages.dev`.

---

### Cara 2: Direct Upload (Drag & Drop tanpa Git)

1. Di komputer Anda, jalankan perintah build:
   ```bash
   npm run build
   ```
2. Folder bernama `dist` akan tercipta di dalam project.
3. Buka dashboard Cloudflare Pages, pilih **Upload assets**.
4. Beri nama proyek, lalu *drag and drop* folder `dist` tersebut ke halaman Cloudflare.
5. Klik **Deploy site**. Selesai dalam hitungan detik!

---

## 💻 Tech Stack
- **Framework**: React 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Target Hosting**: Cloudflare Pages (Free Tier)
