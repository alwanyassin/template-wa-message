import React, { useState } from 'react';
import { Globe, BarChart3, PieChart, Mail, Coffee, KeyRound, ExternalLink, Link2, Building2, BookmarkPlus, Dices } from 'lucide-react';
import { generateRandomPassword } from '../utils/password';

export default function TemplateAccess2G({
  data,
  onChange,
  onOpenDirectory,
  onSaveToDirectory,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [syncEmail, setSyncEmail] = useState(true);

  const handleEmailChange = (newEmail) => {
    if (syncEmail) {
      onChange({
        ...data,
        email: newEmail,
        traktirKopiUsername: newEmail,
      });
    } else {
      onChange({
        ...data,
        email: newEmail,
      });
    }
  };

  const handleSyncToggle = (checked) => {
    setSyncEmail(checked);
    if (checked) {
      onChange({
        ...data,
        traktirKopiUsername: data.email,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Media Name */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-200 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Globe className="w-4 h-4 text-emerald-600" />
            Nama Media / Website
          </label>
          <div className="flex items-center gap-1.5">
            {onOpenDirectory && (
              <button
                type="button"
                onClick={onOpenDirectory}
                className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                title="Pilih dari Direktori Media D1"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Pilih Media</span>
              </button>
            )}
            {onSaveToDirectory && (
              <button
                type="button"
                onClick={onSaveToDirectory}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                title="Simpan data saat ini ke Direktori Media D1"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            )}
          </div>
        </div>
        <input
          type="text"
          value={data.mediaName}
          onChange={(e) => onChange({ ...data, mediaName: e.target.value })}
          placeholder="Contoh: PortalMediaContoh.com"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-slate-800 font-medium transition text-sm"
        />
      </div>

      {/* Bagian 1: Google Tools (GA4 & Data Studio) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-200 transition-colors space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <BarChart3 className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-800">1. Akses Google Tools (2G)</h3>
        </div>

        {/* GA4 Link */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Link Google Analytics 4 (GA4)
          </label>
          <input
            type="url"
            value={data.ga4Link}
            onChange={(e) => onChange({ ...data, ga4Link: e.target.value })}
            placeholder="https://analytics.google.com/analytics/web/#/..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-slate-800 text-xs font-mono transition"
          />
        </div>

        {/* Data Studio Link */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
            <PieChart className="w-3.5 h-3.5 text-blue-500" />
            Link Google Data Studio / Looker Studio
          </label>
          <input
            type="url"
            value={data.gdsLink}
            onChange={(e) => onChange({ ...data, gdsLink: e.target.value })}
            placeholder="https://datastudio.google.com/reporting/..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-slate-800 text-xs font-mono transition"
          />
        </div>

        {/* Akses Email */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
            <Mail className="w-3.5 h-3.5 text-emerald-600" />
            Akses Email Terdaftar (Google Account)
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="contoh: akunmitra.dummy@gmail.com"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-slate-800 text-xs transition"
          />
        </div>
      </div>

      {/* Bagian 2: Dashboard Traktir Kopi */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-200 transition-colors space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Coffee className="w-5 h-5 text-amber-700" />
          <h3 className="text-sm font-bold text-slate-800">2. Akses Dashboard Traktir Kopi</h3>
        </div>

        {/* Traktir Kopi Username */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Username Traktir Kopi</label>
            <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={syncEmail}
                onChange={(e) => handleSyncToggle(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
              />
              <span>Samakan dengan Akses Email</span>
            </label>
          </div>
          <input
            type="text"
            disabled={syncEmail}
            value={data.traktirKopiUsername}
            onChange={(e) => onChange({ ...data, traktirKopiUsername: e.target.value })}
            placeholder="Username / Email Traktir Kopi"
            className={`w-full px-3 py-2 rounded-xl border text-xs transition ${
              syncEmail
                ? 'bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed'
                : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-slate-800'
            }`}
          />
        </div>

        {/* Traktir Kopi Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              Password Dashboard
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const newPass = generateRandomPassword(8);
                  onChange({ ...data, traktirKopiPassword: newPass });
                  setShowPassword(true);
                }}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md font-medium transition flex items-center gap-1 cursor-pointer"
                title="Generate password acak baru"
              >
                <Dices className="w-3 h-3 text-emerald-600" />
                <span>Acak Password</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-500 hover:text-slate-700 font-normal cursor-pointer"
              >
                {showPassword ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={data.traktirKopiPassword}
            onChange={(e) => onChange({ ...data, traktirKopiPassword: e.target.value })}
            placeholder="Contoh: PasswordKopi123!"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-slate-800 font-mono text-xs tracking-wider transition"
          />
        </div>

        {/* Link Dashboard Traktir Kopi */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
            <Link2 className="w-3.5 h-3.5 text-emerald-600" />
            Link Dashboard Traktir Kopi
          </label>
          <input
            type="url"
            value={data.traktirKopiLink}
            onChange={(e) => onChange({ ...data, traktirKopiLink: e.target.value })}
            placeholder="https://traktir-kopi.promediateknologi.id/"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-slate-800 text-xs font-mono transition"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Default link sudah terisi dan bisa disesuaikan jika ke depan ada perubahan domain/URL.
          </p>
        </div>
      </div>
    </div>
  );
}
