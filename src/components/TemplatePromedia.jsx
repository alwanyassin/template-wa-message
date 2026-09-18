import React, { useState } from 'react';
import { Plus, Trash2, Globe, Lock, Mail, KeyRound, Sparkles, ExternalLink, Building2, BookmarkPlus, Dices } from 'lucide-react';
import { generateRandomPassword } from '../utils/password';

export default function TemplatePromedia({
  data,
  onChange,
  onReset,
  onOpenDirectory,
  onSaveToDirectory,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [customLinkActive, setCustomLinkActive] = useState(false);

  const cmsOptions = [
    { label: 'Editor 1', value: 'https://editor1.promediaindonesia.com' },
    { label: 'Editor 2', value: 'https://editor2.promediaindonesia.com' },
    { label: 'Editor 3', value: 'https://editor3.promediaindonesia.com' },
  ];

  const handleEmailChange = (index, value) => {
    // Smart paste: if user pastes multiple lines or commas
    if (value.includes('\n') || value.includes(',')) {
      const splitEmails = value
        .split(/[\n,]+/)
        .map((e) => e.trim())
        .filter(Boolean);
      if (splitEmails.length > 1) {
        const newEmails = [...data.emails];
        newEmails.splice(index, 1, ...splitEmails);
        onChange({ ...data, emails: newEmails });
        return;
      }
    }

    const newEmails = [...data.emails];
    newEmails[index] = value;
    onChange({ ...data, emails: newEmails });
  };

  const handleAddEmail = () => {
    onChange({ ...data, emails: [...data.emails, ''] });
  };

  const handleRemoveEmail = (index) => {
    if (data.emails.length <= 1) {
      onChange({ ...data, emails: [''] });
      return;
    }
    const newEmails = data.emails.filter((_, i) => i !== index);
    onChange({ ...data, emails: newEmails });
  };

  const handleSelectCms = (val) => {
    setCustomLinkActive(false);
    onChange({ ...data, cmsLink: val });
  };

  return (
    <div className="space-y-6">
      {/* Media Name */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-200 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Globe className="w-4 h-4 text-emerald-600" />
            Nama Media / Portal Berita
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
        <p className="text-xs text-slate-600 mt-1.5">
          Nama media ini akan otomatis disisipkan ke judul pesan WhatsApp.
        </p>
      </div>

      {/* Emails List */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-200 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Mail className="w-4 h-4 text-emerald-600" />
            Username / Daftar Email Penulis ({data.emails.length})
          </label>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
            💡 Bisa paste multi-line
          </span>
        </div>

        <div className="space-y-2.5">
          {data.emails.map((email, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 w-5 text-center">
                {index + 1}.
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder={`penulis${index + 1}.dummy@gmail.com`}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-slate-800 text-sm transition"
              />
              {data.emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEmail(index)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  title="Hapus email ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleAddEmail}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Email Lagi
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-200 transition-colors">
        <label className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-2">
          <span className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            Password CMS Editor
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const newPass = generateRandomPassword(8);
                onChange({ ...data, password: newPass });
                setShowPassword(true);
              }}
              className="text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer"
              title="Generate password acak baru"
            >
              <Dices className="w-3.5 h-3.5 text-emerald-600" />
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
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={data.password}
          onChange={(e) => onChange({ ...data, password: e.target.value })}
          placeholder="Contoh: PasswordDummy123!"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-slate-800 font-mono text-sm tracking-wider transition"
        />
      </div>

      {/* Link CMS Options */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-200 transition-colors">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <ExternalLink className="w-4 h-4 text-emerald-600" />
          Pilihan Link CMS Editor
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
          {cmsOptions.map((opt) => {
            const isSelected = data.cmsLink === opt.value && !customLinkActive;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelectCms(opt.value)}
                className={`p-3 text-left rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-sm ring-1 ring-emerald-400'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-600'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{opt.label}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                </div>
                <span className="font-mono text-[10px] text-slate-500 truncate mt-1">
                  {opt.value.replace('https://', '')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Link Toggle */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCustomLinkActive(!customLinkActive)}
            className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 font-medium mb-2"
          >
            <span>{customLinkActive ? '▼ Sembunyikan custom link' : '▶ Gunakan link CMS khusus/custom'}</span>
          </button>

          {customLinkActive && (
            <input
              type="url"
              value={data.cmsLink}
              onChange={(e) => onChange({ ...data, cmsLink: e.target.value })}
              placeholder="https://editor.domainanda.com"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-slate-800 text-xs font-mono transition"
            />
          )}
        </div>
      </div>
    </div>
  );
}
