import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Share2,
  Calendar,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Tv,
  Mail,
  Zap,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  Layers,
  FileText,
} from 'lucide-react';

export const getIndonesianDate = (d = new Date()) => {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function computeRegionStatus(reg) {
  const name = toTitleCase((reg.name || '').trim()) || 'Wilayah';

  const issues = [];
  const checkPlatform = (val, platformName) => {
    const clean = (val || '').trim().toLowerCase();
    if (
      !clean ||
      clean === '-' ||
      clean.includes('belum') ||
      clean.includes('banned') ||
      clean.includes('gagal') ||
      clean.includes('kendala') ||
      clean.includes('pending')
    ) {
      issues.push(platformName);
    }
  };

  checkPlatform(reg.youtube, 'YouTube');
  checkPlatform(reg.tiktok, 'TikTok');
  checkPlatform(reg.facebook, 'Facebook');
  checkPlatform(reg.instagram, 'Instagram');

  if (issues.length === 0) {
    return `✅ ${name} — YouTube, TikTok, Facebook, Instagram`;
  } else if (issues.length === 4) {
    return `❌ ${name} — Belum dibuat`;
  } else {
    return `⚠️ ${name} — ${issues.join(', ')} belum dibuat`;
  }
}

export const initialSosmedData = {
  reportTitle: 'REPORT PEMBUATAN AKUN SOSMED',
  reportDate: '28 September 2026',
  brandName: 'ProTV',
  customIntro: 'Berikut update pembuatan akun ProTV untuk beberapa wilayah:',
  autoStatus: true,
  statusOverride: '',
  regions: [
    {
      id: 'reg_1',
      name: 'SEMARANG',
      email: 'semarang@protv.id',
      youtube: 'https://www.youtube.com/channel/UCATRM2y5tI84le49Dm5UJDA',
      tiktok: 'https://www.tiktok.com/@protv.semarang',
      facebook: 'https://www.facebook.com/profile.php?id=61594953028405',
      instagram: 'https://www.instagram.com/protv.semarang',
      note: 'Catatan Facebook: Username belum bisa menggunakan protv.semarang.',
      statusText: '',
    },
    {
      id: 'reg_2',
      name: 'TASIKMALAYA',
      email: 'tasikmalaya@protv.id',
      youtube: 'https://www.youtube.com/@protv.tasikmalaya',
      tiktok: 'https://www.tiktok.com/@protv.tasikmalaya',
      facebook: 'Belum dibuat — email terkena banned, sehingga harus menggunakan nomor HP',
      instagram: 'https://www.instagram.com/protv.tasikmalaya/',
      note: '',
      statusText: '',
    },
    {
      id: 'reg_3',
      name: 'BANDAR LAMPUNG',
      email: 'bandarlampung@protv.id',
      youtube: 'https://www.youtube.com/@protv.bandarlampung',
      tiktok: 'https://www.tiktok.com/@protv.bandarlampung',
      facebook: 'https://www.facebook.com/@protv.bandarlampung',
      instagram: 'https://www.instagram.com/protv.bandarlampung',
      note: '',
      statusText: '',
    },
    {
      id: 'reg_4',
      name: 'YOGYAKARTA',
      email: 'yogyakarta@protv.id',
      youtube: 'https://www.youtube.com/@protv.yogyakarta',
      tiktok: 'https://www.tiktok.com/@protv.yogyakarta',
      facebook: 'https://www.facebook.com/@protv.yogyakarta',
      instagram: 'https://www.instagram.com/protv.yogyakarta',
      note: '',
      statusText: '',
    },
  ],
};

export default function TemplateSosmed({
  data,
  onChange,
  onReset,
}) {
  const [collapsedMap, setCollapsedMap] = useState({});

  const toggleCollapse = (id) => {
    setCollapsedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const collapseAll = () => {
    const all = {};
    (data.regions || []).forEach((r) => {
      all[r.id] = true;
    });
    setCollapsedMap(all);
  };

  const expandAll = () => {
    setCollapsedMap({});
  };

  const handleSetToday = () => {
    onChange({
      ...data,
      reportDate: getIndonesianDate(new Date()),
    });
  };

  const handleAddRegion = () => {
    const newId = `reg_${Date.now()}`;
    const newRegion = {
      id: newId,
      name: '',
      email: '',
      youtube: '',
      tiktok: '',
      facebook: '',
      instagram: '',
      note: '',
      statusText: '',
    };
    onChange({
      ...data,
      regions: [...(data.regions || []), newRegion],
    });
  };

  const handleUpdateRegion = (id, field, value) => {
    const updated = (data.regions || []).map((r) => {
      if (r.id === id) {
        return { ...r, [field]: value };
      }
      return r;
    });
    onChange({ ...data, regions: updated });
  };

  const handleRemoveRegion = (id) => {
    if ((data.regions || []).length <= 1) {
      alert('Minimal harus ada 1 wilayah.');
      return;
    }
    const updated = (data.regions || []).filter((r) => r.id !== id);
    onChange({ ...data, regions: updated });
  };

  const handleDuplicateRegion = (index) => {
    const source = data.regions[index];
    const newRegion = {
      ...source,
      id: `reg_${Date.now()}`,
      name: `${source.name} (Copy)`,
    };
    const updated = [...data.regions];
    updated.splice(index + 1, 0, newRegion);
    onChange({ ...data, regions: updated });
  };

  const handleMoveRegion = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= data.regions.length) return;
    const updated = [...data.regions];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange({ ...data, regions: updated });
  };

  // Quick autofill generator based on Wilayah Name & Brand
  const handleAutoFillProTVFormat = (id) => {
    const reg = (data.regions || []).find((r) => r.id === id);
    if (!reg) return;
    const rawName = (reg.name || '').trim();
    if (!rawName) {
      alert('Silakan isi Nama Wilayah terlebih dahulu (contoh: SEMARANG).');
      return;
    }
    const slug = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const brand = (data.brandName || 'protv').toLowerCase().replace(/[^a-z0-9]/g, '');

    const updated = (data.regions || []).map((r) => {
      if (r.id === id) {
        return {
          ...r,
          email: r.email || `${slug}@${brand}.id`,
          youtube: r.youtube || `https://www.youtube.com/@${brand}.${slug}`,
          tiktok: r.tiktok || `https://www.tiktok.com/@${brand}.${slug}`,
          facebook: r.facebook || `https://www.facebook.com/@${brand}.${slug}`,
          instagram: r.instagram || `https://www.instagram.com/${brand}.${slug}`,
        };
      }
      return r;
    });
    onChange({ ...data, regions: updated });
  };

  const handleRestoreExample = () => {
    if (window.confirm('Muat ulang template contoh ProTV (4 kota: Semarang, Tasikmalaya, Bandar Lampung, Yogyakarta)?')) {
      onChange(initialSosmedData);
    }
  };

  const handleSyncIntro = () => {
    const brand = data.brandName.trim() || 'ProTV';
    onChange({
      ...data,
      customIntro: `Berikut update pembuatan akun ${brand} untuk beberapa wilayah:`,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Information Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-200 transition-colors space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Tv className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Informasi Header Laporan</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreExample}
              className="text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition flex items-center gap-1 active:scale-[0.98] cursor-pointer"
              title="Kembalikan ke contoh format ProTV"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Contoh ProTV</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Judul Laporan */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>Judul Laporan</span>
            </label>
            <input
              type="text"
              value={data.reportTitle || ''}
              onChange={(e) => onChange({ ...data, reportTitle: e.target.value })}
              placeholder="REPORT PEMBUATAN AKUN SOSMED"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-slate-800 font-semibold text-xs transition"
            />
          </div>

          {/* Tanggal Laporan */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                <span>Tanggal Laporan</span>
              </label>
              <button
                type="button"
                onClick={handleSetToday}
                className="text-[11px] font-medium text-purple-600 hover:text-purple-800 hover:underline cursor-pointer"
              >
                Hari Ini
              </button>
            </div>
            <input
              type="text"
              value={data.reportDate || ''}
              onChange={(e) => onChange({ ...data, reportDate: e.target.value })}
              placeholder="28 September 2026"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-slate-800 text-xs transition"
            />
          </div>
        </div>

        {/* Nama Brand & Kalimat Pengantar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span>Nama Brand / Akun</span>
            </label>
            <input
              type="text"
              value={data.brandName || ''}
              onChange={(e) => onChange({ ...data, brandName: e.target.value })}
              placeholder="ProTV"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-slate-800 font-medium text-xs transition"
            />
          </div>

          <div className="sm:col-span-8 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Kalimat Pembuka
              </label>
              <button
                type="button"
                onClick={handleSyncIntro}
                className="text-[11px] text-slate-500 hover:text-purple-700 hover:underline cursor-pointer"
                title="Sesuaikan otomatis dengan Nama Brand di samping"
              >
                Sinkronkan Brand
              </button>
            </div>
            <input
              type="text"
              value={data.customIntro || ''}
              onChange={(e) => onChange({ ...data, customIntro: e.target.value })}
              placeholder="Berikut update pembuatan akun ProTV untuk beberapa wilayah:"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-slate-800 text-xs transition"
            />
          </div>
        </div>
      </div>

      {/* 2. Regions List Header & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-extrabold flex items-center justify-center">
            {(data.regions || []).length}
          </span>
          <h3 className="font-bold text-slate-900 text-sm">
            Daftar Akun Sosmed per Wilayah
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={collapseAll}
            className="text-[11px] font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition cursor-pointer"
          >
            Tutup Semua
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={expandAll}
            className="text-[11px] font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition cursor-pointer"
          >
            Buka Semua
          </button>
          <button
            type="button"
            onClick={handleAddRegion}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm active:scale-[0.98] cursor-pointer ml-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Wilayah</span>
          </button>
        </div>
      </div>

      {/* 3. Regions Cards Accordion/List */}
      <div className="space-y-4">
        {(data.regions || []).map((region, idx) => {
          const isCollapsed = collapsedMap[region.id];
          const statusText = computeRegionStatus(region);
          const isComplete = statusText.startsWith('✅');
          const isWarning = statusText.startsWith('⚠️');

          return (
            <div
              key={region.id}
              className={`bg-white rounded-2xl border transition-all duration-150 shadow-xs ${
                isCollapsed
                  ? 'border-slate-200/90'
                  : 'border-purple-200 ring-1 ring-purple-50'
              }`}
            >
              {/* Region Card Header */}
              <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 border-b border-slate-100">
                <div
                  onClick={() => toggleCollapse(region.id)}
                  className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer select-none"
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900 tracking-wide uppercase truncate">
                      {region.name || `Wilayah ${idx + 1}`}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 ${
                        isComplete
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isWarning
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {statusText}
                    </span>
                  </div>
                </div>

                {/* Card Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleAutoFillProTVFormat(region.id)}
                    className="hidden sm:flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-purple-700 hover:bg-purple-50 rounded-lg transition active:scale-[0.98] cursor-pointer"
                    title="Isi otomatis link sosmed sesuai nama kota"
                  >
                    <Zap className="w-3 h-3 text-purple-600" />
                    <span>Auto-Format</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicateRegion(idx)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Duplikat Wilayah Ini"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveRegion(idx, -1)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Pindahkan ke atas"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === (data.regions || []).length - 1}
                    onClick={() => handleMoveRegion(idx, 1)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Pindahkan ke bawah"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveRegion(region.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Hapus Wilayah"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCollapse(region.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Region Card Body Form */}
              {!isCollapsed && (
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Wilayah Name */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">
                        Nama Wilayah / Kota
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateRegion(
                            region.id,
                            'name',
                            (region.name || '').toUpperCase()
                          )
                        }
                        className="text-[11px] text-purple-600 hover:underline cursor-pointer"
                      >
                        Jadikan HURUF BESAR
                      </button>
                    </div>
                    <input
                      type="text"
                      value={region.name || ''}
                      onChange={(e) =>
                        handleUpdateRegion(region.id, 'name', e.target.value)
                      }
                      placeholder="Contoh: SEMARANG, TASIKMALAYA"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-slate-800 font-bold text-sm tracking-wide transition"
                    />
                  </div>

                  {/* Platforms Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* 1. Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                        <span className="text-base leading-none">📧</span>
                        <span>Email Akun:</span>
                      </label>
                      <input
                        type="text"
                        value={region.email || ''}
                        onChange={(e) =>
                          handleUpdateRegion(region.id, 'email', e.target.value)
                        }
                        placeholder="semarang@protv.id"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-slate-800 text-xs transition"
                      />
                    </div>

                    {/* 2. YouTube */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                        <span className="text-base leading-none">▶️</span>
                        <span>YouTube URL / Channel:</span>
                      </label>
                      <input
                        type="text"
                        value={region.youtube || ''}
                        onChange={(e) =>
                          handleUpdateRegion(region.id, 'youtube', e.target.value)
                        }
                        placeholder="https://www.youtube.com/@protv.semarang"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-slate-800 text-xs transition"
                      />
                    </div>

                    {/* 3. TikTok */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                        <span className="text-base leading-none">🎵</span>
                        <span>TikTok URL:</span>
                      </label>
                      <input
                        type="text"
                        value={region.tiktok || ''}
                        onChange={(e) =>
                          handleUpdateRegion(region.id, 'tiktok', e.target.value)
                        }
                        placeholder="https://www.tiktok.com/@protv.semarang"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-slate-800 text-xs transition"
                      />
                    </div>

                    {/* 4. Facebook */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                        <span className="text-base leading-none">📘</span>
                        <span>Facebook URL / Keterangan:</span>
                      </label>
                      <input
                        type="text"
                        value={region.facebook || ''}
                        onChange={(e) =>
                          handleUpdateRegion(region.id, 'facebook', e.target.value)
                        }
                        placeholder="Link FB atau 'Belum dibuat — kendala...'"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-slate-800 text-xs transition"
                      />
                    </div>

                    {/* 5. Instagram */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                        <span className="text-base leading-none">📷</span>
                        <span>Instagram URL:</span>
                      </label>
                      <input
                        type="text"
                        value={region.instagram || ''}
                        onChange={(e) =>
                          handleUpdateRegion(region.id, 'instagram', e.target.value)
                        }
                        placeholder="https://www.instagram.com/protv.semarang"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-slate-800 text-xs transition"
                      />
                    </div>
                  </div>

                  {/* Catatan Khusus Wilayah */}
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                      <span>Catatan Khusus (Opsional):</span>
                    </label>
                    <input
                      type="text"
                      value={region.note || ''}
                      onChange={(e) =>
                        handleUpdateRegion(region.id, 'note', e.target.value)
                      }
                      placeholder="Contoh: Catatan Facebook: Username belum bisa menggunakan protv.semarang."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-slate-700 text-xs transition"
                    />
                  </div>

                  {/* Custom status text for this specific region if needed */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500">
                      Format status otomatis:{' '}
                      <strong className="text-slate-800 font-mono text-[11px]">
                        {computeRegionStatus(region)}
                      </strong>
                    </span>

                    {region.statusText ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={region.statusText}
                          onChange={(e) =>
                            handleUpdateRegion(
                              region.id,
                              'statusText',
                              e.target.value
                            )
                          }
                          className="px-2 py-1 text-xs border border-purple-300 rounded-lg outline-none"
                          placeholder="Override status teks..."
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateRegion(region.id, 'statusText', '')
                          }
                          className="text-[11px] text-red-500 hover:underline"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateRegion(
                            region.id,
                            'statusText',
                            computeRegionStatus(region)
                          )
                        }
                        className="text-[11px] text-purple-600 hover:text-purple-800 hover:underline text-left cursor-pointer"
                      >
                        Kustomisasi teks status ini
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Actions & Summary Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bagian Status Ringkasan</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Bagian ini otomatis di-generate berdasarkan kelengkapan platform di setiap wilayah.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddRegion}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Wilayah Lain</span>
            </button>
          </div>
        </div>

        {/* Live Status Preview Box */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-xs text-slate-800 space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans">
            Preview Teks Status Bawah:
          </div>
          {(data.regions || []).map((r, i) => (
            <div key={r.id || i}>
              {r.statusText && r.statusText.trim()
                ? r.statusText.trim()
                : computeRegionStatus(r)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
