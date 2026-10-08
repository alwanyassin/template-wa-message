import React, { useState } from 'react';
import {
  Calendar,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  Video,
  Target,
  Plus,
  Trash2,
  Users,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  HelpCircle,
  BookmarkPlus,
  Check,
} from 'lucide-react';

export const getIndonesianDate = (d = new Date()) => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
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
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const initialCreatorFactoryData = {
  reportTitle: 'PROGRESS REPORT - PROMEDIA CREATOR FACTORY NETWORK',
  reportDate: getIndonesianDate(),
  greeting: 'Halo Tim,',
  introText:
    'Berikut rangkuman update progres akun Promedia Creator Factory Network:',

  // 1. Akun Official
  totalOfficial: 12,
  officialAmanCount: 10,
  officialAmanNote: 'Aman & sesuai username utama',
  officialAltCount: 2,
  officialAltNote: 'Username YouTube menggunakan alternatif',
  officialExtraNote: '',

  // 2. Akun Segmen Live TikTok
  totalLiveTiktok: 4,
  affiliateStatus: 'Aktif (ON)',
  affiliateNote: 'fitur masih terbatas karena follower belum mencapai 600',
  liveStatus: 'Belum Aktif (OFF)',
  liveNote: 'menunggu follower mencapai min. 50',
  liveExtraNote: '',

  // 3. Next Action Plan
  actionPlans: [
    'Optimasi push followers akun TikTok (menuju milestone 50 & 600 followers)',
    'Monitoring dan setup konten awal pada seluruh akun official',
  ],

  // 4. Closing
  closingText:
    'Demikian laporan perkembangan ini disampaikan. Terima kasih atas perhatian dan dukungannya. 🙏',
};

export const generateCreatorFactoryMessage = (data, mode) => {
  const title = (
    data.reportTitle || 'PROGRESS REPORT - PROMEDIA CREATOR FACTORY NETWORK'
  ).trim();
  const date = (data.reportDate || getIndonesianDate()).trim();
  const greeting = (data.greeting || 'Halo Tim,').trim();
  const intro = (
    data.introText ||
    'Berikut rangkuman update progres akun Promedia Creator Factory Network:'
  ).trim();

  const totalOfficial = data.totalOfficial ?? 0;
  const amanCount = data.officialAmanCount ?? 0;
  const amanNote = (
    data.officialAmanNote || 'Aman & sesuai username utama'
  ).trim();
  const altCount = data.officialAltCount ?? 0;
  const altNote = (
    data.officialAltNote || 'Username YouTube menggunakan alternatif'
  ).trim();
  const officialExtra = (data.officialExtraNote || '').trim();

  const totalLive = data.totalLiveTiktok ?? 0;
  const affStatus = (data.affiliateStatus || 'Aktif (ON)').trim();
  const affNote = (data.affiliateNote || '').trim();
  const liveStatus = (data.liveStatus || 'Belum Aktif (OFF)').trim();
  const liveNote = (data.liveNote || '').trim();
  const liveExtra = (data.liveExtraNote || '').trim();

  const plans = (data.actionPlans || []).map((p) => p.trim()).filter(Boolean);
  const closing = (
    data.closingText ||
    'Demikian laporan perkembangan ini disampaikan. Terima kasih atas perhatian dan dukungannya. 🙏'
  ).trim();

  if (mode === 'standard') {
    let actionPlansText = '-';
    if (plans.length > 0) {
      actionPlansText = plans.map((p) => `- ${p}`).join('\n');
    }

    let msg = `${title}
Tanggal: ${date}

${greeting}
${intro}

=========================================
1. AKUN OFFICIAL
- Total Dibuat: ${totalOfficial} Akun
- Status Username & Keamanan:
  * ${amanCount} Akun: ${amanNote}
  * ${altCount} Akun: ${altNote}`;

    if (officialExtra) {
      msg += `\n- Catatan: ${officialExtra}`;
    }

    msg += `\n\n2. AKUN SEGMEN LIVE TIKTOK
- Total Akun: ${totalLive} Akun
- Status Fitur:
  * TikTok Affiliate: ${affStatus}${affNote ? ` (${affNote})` : ''}
  * Fitur Live Streaming: ${liveStatus}${liveNote ? ` (${liveNote})` : ''}`;

    if (liveExtra) {
      msg += `\n- Catatan: ${liveExtra}`;
    }

    msg += `\n\n=========================================
Next Action Plan:
${actionPlansText}

${closing}`;

    return msg;
  }

  // Professional Mode (WhatsApp Markdown)
  let actionPlansText = '• _(Belum ada action plan)_';
  if (plans.length > 0) {
    actionPlansText = plans.map((p) => `• ${p}`).join('\n');
  }

  let msg = `*${title}*
📅 *Periode / Tanggal:* ${date}

${greeting}
${intro}

━━━━━━━━━━━━━━━━━━━━━
📌 *1. AKUN OFFICIAL*
• *Total Dibuat:* ${totalOfficial} Akun
• *Status Username & Keamanan:*
  - ✅ ${amanCount} Akun: ${amanNote}
  - ⚠️ ${altCount} Akun: ${altNote}`;

  if (officialExtra) {
    msg += `\n  - ℹ️ _Catatan: ${officialExtra}_`;
  }

  msg += `\n\n📌 *2. AKUN SEGMEN LIVE TIKTOK*
• *Total Akun:* ${totalLive} Akun
• *Status Fitur:*
  - 🛒 *TikTok Affiliate:* ${affStatus}${affNote ? ` (${affNote})` : ''}
  - 🎥 *Fitur Live Streaming:* ${liveStatus}${liveNote ? ` (${liveNote})` : ''}`;

  if (liveExtra) {
    msg += `\n  - ℹ️ _Catatan: ${liveExtra}_`;
  }

  msg += `\n\n━━━━━━━━━━━━━━━━━━━━━
🎯 *Next Action Plan:*
${actionPlansText}

${closing}`;

  return msg;
};

export default function TemplateCreatorFactory({ data, onChange, onReset, onSave }) {
  const [isSaved, setIsSaved] = useState(false);

  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSetToday = () => {
    updateField('reportDate', getIndonesianDate());
  };

  const handleAutoCalcOfficial = () => {
    const aman = parseInt(data.officialAmanCount, 10) || 0;
    const alt = parseInt(data.officialAltCount, 10) || 0;
    updateField('totalOfficial', aman + alt);
  };

  const handlePlanChange = (index, value) => {
    const newPlans = [...(data.actionPlans || [])];
    newPlans[index] = value;
    updateField('actionPlans', newPlans);
  };

  const handleAddPlan = () => {
    updateField('actionPlans', [...(data.actionPlans || []), '']);
  };

  const handleRemovePlan = (index) => {
    const newPlans = (data.actionPlans || []).filter((_, i) => i !== index);
    updateField('actionPlans', newPlans);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & General Settings */}
      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Pengaturan Header & Jadwal Laporan
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer active:scale-[0.98] ${
                isSaved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
              }`}
              title="Simpan data laporan ke draft browser"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 px-2 py-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
              title="Reset ke pengaturan default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Laporan
            </label>
            <input
              type="text"
              value={data.reportTitle || ''}
              onChange={(e) => updateField('reportTitle', e.target.value)}
              placeholder="PROGRESS REPORT - PROMEDIA CREATOR FACTORY NETWORK"
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Periode / Tanggal Laporan
              </label>
              <button
                type="button"
                onClick={handleSetToday}
                className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
              >
                Gunakan Hari Ini
              </button>
            </div>
            <input
              type="text"
              value={data.reportDate || ''}
              onChange={(e) => updateField('reportDate', e.target.value)}
              placeholder="e.g. Kamis, 08 Oktober 2026"
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Salam Pembuka
            </label>
            <input
              type="text"
              value={data.greeting || ''}
              onChange={(e) => updateField('greeting', e.target.value)}
              placeholder="Halo Tim / Selamat Pagi,"
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kalimat Pengantar
            </label>
            <input
              type="text"
              value={data.introText || ''}
              onChange={(e) => updateField('introText', e.target.value)}
              placeholder="Berikut rangkuman update progres akun..."
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* 2. Section 1: Akun Official */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                Akun Official Network
              </h3>
              <p className="text-[11px] text-slate-500">
                Status total akun resmi dan ketersediaan username
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutoCalcOfficial}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
            title="Hitung Total = Akun Aman + Akun Alternatif"
          >
            <Sparkles className="w-3 h-3" />
            <span>Auto Hitung Total ({parseInt(data.officialAmanCount, 10) + parseInt(data.officialAltCount, 10) || 0})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Akun Dibuat
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={data.totalOfficial ?? 0}
                onChange={(e) =>
                  updateField('totalOfficial', parseInt(e.target.value, 10) || 0)
                }
                className="w-full text-sm font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                Akun
              </span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-emerald-800 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Akun Aman / Sesuai Handle Utama</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <input
                  type="number"
                  min="0"
                  value={data.officialAmanCount ?? 0}
                  onChange={(e) =>
                    updateField(
                      'officialAmanCount',
                      parseInt(e.target.value, 10) || 0
                    )
                  }
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-emerald-50/40"
                  placeholder="10"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  value={data.officialAmanNote || ''}
                  onChange={(e) =>
                    updateField('officialAmanNote', e.target.value)
                  }
                  placeholder="Aman & sesuai username utama"
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-1">
          <label className="block text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Akun dengan Username Alternatif / Kendala</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-1">
              <input
                type="number"
                min="0"
                value={data.officialAltCount ?? 0}
                onChange={(e) =>
                  updateField(
                    'officialAltCount',
                    parseInt(e.target.value, 10) || 0
                  )
                }
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-amber-50/40"
                placeholder="2"
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                value={data.officialAltNote || ''}
                onChange={(e) => updateField('officialAltNote', e.target.value)}
                placeholder="Username YouTube menggunakan alternatif"
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Catatan Tambahan Akun Official (Opsional)
          </label>
          <input
            type="text"
            value={data.officialExtraNote || ''}
            onChange={(e) => updateField('officialExtraNote', e.target.value)}
            placeholder="Contoh: Email pemulihan dan 2FA sudah diaktifkan di seluruh akun"
            className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 bg-slate-50/50"
          />
        </div>
      </div>

      {/* 3. Section 2: Akun Segmen Live TikTok */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                Akun Segmen Live TikTok
              </h3>
              <p className="text-[11px] text-slate-500">
                Status kesiapan fitur Affiliate & Live Streaming
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 text-purple-700 text-xs font-semibold">
            <Video className="w-3.5 h-3.5" />
            <span>{data.totalLiveTiktok ?? 0} Akun Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Akun Live
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={data.totalLiveTiktok ?? 0}
                onChange={(e) =>
                  updateField(
                    'totalLiveTiktok',
                    parseInt(e.target.value, 10) || 0
                  )
                }
                className="w-full text-sm font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                Akun
              </span>
            </div>
          </div>

          <div className="sm:col-span-3 space-y-3">
            {/* Affiliate */}
            <div className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fitur TikTok Affiliate</span>
                </span>
                <div className="flex items-center gap-1">
                  {['Aktif (ON)', 'Terbatas', 'Nonaktif (OFF)'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateField('affiliateStatus', st)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition cursor-pointer ${
                        data.affiliateStatus === st
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={data.affiliateNote || ''}
                onChange={(e) => updateField('affiliateNote', e.target.value)}
                placeholder="Keterangan (misal: fitur masih terbatas karena follower belum mencapai 600)"
                className="w-full text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              />
            </div>

            {/* Live Streaming */}
            <div className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-rose-600" />
                  <span>Fitur Live Streaming</span>
                </span>
                <div className="flex items-center gap-1">
                  {['Belum Aktif (OFF)', 'Pending', 'Aktif (ON)'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateField('liveStatus', st)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition cursor-pointer ${
                        data.liveStatus === st
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={data.liveNote || ''}
                onChange={(e) => updateField('liveNote', e.target.value)}
                placeholder="Keterangan (misal: menunggu follower mencapai min. 50)"
                className="w-full text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Catatan Tambahan Segmen Live (Opsional)
          </label>
          <input
            type="text"
            value={data.liveExtraNote || ''}
            onChange={(e) => updateField('liveExtraNote', e.target.value)}
            placeholder="Contoh: Jadwal uji coba live perdana disiapkan minggu depan"
            className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 bg-slate-50/50"
          />
        </div>
      </div>

      {/* 4. Section 3: Next Action Plan */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Next Action Plan / Rencana Tindak Lanjut
              </h3>
              <p className="text-[11px] text-slate-500">
                Poin langkah tindak lanjut yang akan dikerjakan berikutnya
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddPlan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Poin</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {(data.actionPlans || []).map((plan, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-5 text-center text-xs font-bold text-slate-400">
                {idx + 1}.
              </span>
              <input
                type="text"
                value={plan}
                onChange={(e) => handlePlanChange(idx, e.target.value)}
                placeholder="Tuliskan rencana tindak lanjut..."
                className="flex-1 text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              />
              <button
                type="button"
                onClick={() => handleRemovePlan(idx)}
                className="p-2 text-slate-400 hover:text-rose-600 transition cursor-pointer rounded-lg hover:bg-rose-50"
                title="Hapus baris ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {(data.actionPlans || []).length === 0 && (
            <p className="text-xs text-slate-400 text-center py-3 italic bg-slate-50 rounded-xl">
              Belum ada action plan. Klik tombol "Tambah Poin" di atas.
            </p>
          )}
        </div>
      </div>

      {/* 5. Section 4: Penutup Laporan */}
      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-3">
        <label className="block text-xs font-semibold text-slate-700">
          Kalimat Penutup Laporan
        </label>
        <textarea
          rows={2}
          value={data.closingText || ''}
          onChange={(e) => updateField('closingText', e.target.value)}
          placeholder="Demikian laporan perkembangan ini disampaikan..."
          className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white resize-y"
        />
      </div>

      {/* 6. Action Footer: Tombol Simpan & Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Draft laporan tersimpan otomatis di browser & siap disalin ke WhatsApp.</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-[0.98] w-full sm:w-auto shadow-xs ${
              isSaved
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Laporan Berhasil Disimpan!</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span>Simpan Perubahan Laporan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
