-- Schema untuk Cloudflare D1 Database
-- Jalankan query ini di tab Console pada Database D1 di Dashboard Cloudflare

-- 1. Tabel Direktori Media (Buku Profil Media Mitra)
CREATE TABLE IF NOT EXISTS media_directory (
  id TEXT PRIMARY KEY,
  media_name TEXT NOT NULL,
  cms_emails TEXT,
  cms_password TEXT,
  cms_link TEXT,
  ga4_link TEXT,
  gds_link TEXT,
  google_email TEXT,
  traktir_kopi_username TEXT,
  traktir_kopi_password TEXT,
  traktir_kopi_link TEXT,
  pic_name TEXT,
  pic_phone TEXT,
  notes TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Index untuk pencarian nama media yang cepat
CREATE INDEX IF NOT EXISTS idx_media_name ON media_directory(media_name);

-- 2. Tabel Riwayat Pesan (History Logs)
CREATE TABLE IF NOT EXISTS history_logs (
  id TEXT PRIMARY KEY,
  template_type TEXT NOT NULL,
  media_name TEXT NOT NULL,
  message_text TEXT NOT NULL,
  action TEXT NOT NULL,
  phone_number TEXT,
  created_at INTEGER NOT NULL
);

-- Index untuk pengurutan riwayat terbaru
CREATE INDEX IF NOT EXISTS idx_history_created_at ON history_logs(created_at DESC);
