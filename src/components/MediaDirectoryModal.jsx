import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Plus,
  Trash2,
  Edit3,
  Check,
  Building2,
  Mail,
  Lock,
  Globe,
  Database,
  Cloud,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Dices,
  Copy,
  ExternalLink,
  Phone,
  User,
  ArrowRight,
} from 'lucide-react';
import { fetchMediaDirectory, saveMediaProfile, deleteMediaProfile } from '../services/api';
import { generateRandomPassword } from '../utils/password';

export default function MediaDirectoryModal({
  isOpen,
  onClose,
  onApplyToForm,
  activeTab,
}) {
  const [mediaList, setMediaList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCloud, setIsCloud] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // Form state for Add/Edit
  const initialFormState = {
    media_name: '',
    cms_emails: '',
    cms_password: '',
    cms_link: 'https://editor1.promediaindonesia.com',
    ga4_link: '',
    gds_link: '',
    google_email: '',
    traktir_kopi_username: '',
    traktir_kopi_password: '',
    traktir_kopi_link: 'https://traktir-kopi.promediateknologi.id/',
    pic_name: '',
    pic_phone: '',
    notes: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showAddForm) {
          setShowAddForm(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showAddForm, onClose]);

  // Load data from D1 on open
  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    setLoading(true);
    const res = await fetchMediaDirectory();
    setMediaList(res.data || []);
    setIsCloud(res.isCloud);
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setShowAddForm(true);
  };

  const handleOpenEdit = (media) => {
    setEditingId(media.id);
    setFormData({
      media_name: media.media_name || '',
      cms_emails: Array.isArray(media.cms_emails)
        ? media.cms_emails.join('\n')
        : media.cms_emails || '',
      cms_password: media.cms_password || '',
      cms_link: media.cms_link || 'https://editor1.promediaindonesia.com',
      ga4_link: media.ga4_link || '',
      gds_link: media.gds_link || '',
      google_email: media.google_email || '',
      traktir_kopi_username: media.traktir_kopi_username || '',
      traktir_kopi_password: media.traktir_kopi_password || '',
      traktir_kopi_link: media.traktir_kopi_link || 'https://traktir-kopi.promediateknologi.id/',
      pic_name: media.pic_name || '',
      pic_phone: media.pic_phone || '',
      notes: media.notes || '',
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.media_name.trim()) {
      alert('Mohon isi nama media');
      return;
    }

    setSubmitting(true);
    const emailsArray = formData.cms_emails
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter(Boolean);

    const payload = {
      id: editingId || undefined,
      media_name: formData.media_name.trim(),
      cms_emails: emailsArray,
      cms_password: formData.cms_password.trim(),
      cms_link: formData.cms_link.trim(),
      ga4_link: formData.ga4_link.trim(),
      gds_link: formData.gds_link.trim(),
      google_email: formData.google_email.trim(),
      traktir_kopi_username:
        formData.traktir_kopi_username.trim() || formData.google_email.trim(),
      traktir_kopi_password: formData.traktir_kopi_password.trim(),
      traktir_kopi_link: formData.traktir_kopi_link.trim(),
      pic_name: formData.pic_name.trim(),
      pic_phone: formData.pic_phone.trim(),
      notes: formData.notes.trim(),
    };

    await saveMediaProfile(payload);
    await loadMedia();
    setSubmitting(false);
    setShowAddForm(false);
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Hapus "${name}" dari direktori media?`)) {
      await deleteMediaProfile(id);
      await loadMedia();
    }
  };

  const handleApply = (media) => {
    onApplyToForm(media);
    onClose();
  };

  const copyToClipboard = async (text, fieldId) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 1800);
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered list
  const filteredMedia = mediaList.filter((m) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const nameMatch = (m.media_name || '').toLowerCase().includes(query);
    const emailMatch = (m.google_email || '').toLowerCase().includes(query);
    const picMatch = (m.pic_name || '').toLowerCase().includes(query);
    const cmsEmailsMatch = Array.isArray(m.cms_emails)
      ? m.cms_emails.some((e) => e.toLowerCase().includes(query))
      : false;
    return nameMatch || emailMatch || picMatch || cmsEmailsMatch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-opacity">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/90 overflow-hidden ring-1 ring-black/5">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Direktori Media
                </h2>
                {isCloud ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Cloudflare D1
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
                    <Database className="w-3 h-3 text-amber-500" />
                    Local Cache
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih profil media mitra untuk mengisi form template secara instan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={loadMedia}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer active:scale-[0.98]"
              title="Refresh database"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-slate-800' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer active:scale-[0.98]"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Command & Filter Bar */}
        <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama portal, email, atau kontak PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-200/90 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 active:scale-[0.98] p-0.5"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-black rounded-xl transition active:scale-[0.98] shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Media</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Add / Edit Form Pane */}
          {showAddForm && (
            <form
              onSubmit={handleSubmit}
              className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <h3 className="font-bold text-sm text-slate-900">
                    {editingId ? 'Edit Profil Media' : 'Tambah Media Baru ke Database'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 font-medium px-2 py-1 rounded-md hover:bg-slate-200/60 transition"
                >
                  Batal
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Media Name */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nama Portal Media / Website <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: RadarKuningan.com"
                    value={formData.media_name}
                    onChange={(e) => setFormData({ ...formData, media_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 font-medium text-slate-800"
                  />
                </div>

                {/* CMS Password with Random Gen */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Password CMS Editor
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, cms_password: generateRandomPassword(8) })
                      }
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 transition cursor-pointer"
                      title="Generate password CMS acak"
                    >
                      <Dices className="w-3 h-3 text-emerald-600" />
                      <span>Acak</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Contoh: p7R9x2Lm"
                    value={formData.cms_password}
                    onChange={(e) => setFormData({ ...formData, cms_password: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 outline-none focus:border-slate-800 font-mono text-slate-800"
                  />
                </div>

                {/* CMS Link */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Link CMS Editor
                  </label>
                  <input
                    type="url"
                    placeholder="https://editor1.promediaindonesia.com"
                    value={formData.cms_link}
                    onChange={(e) => setFormData({ ...formData, cms_link: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 outline-none focus:border-slate-800 font-mono text-slate-800"
                  />
                </div>

                {/* CMS Emails List */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Daftar Email Penulis CMS (pisahkan baris baru per email)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="redaksi@mediacontoh.com&#10;penulis1@gmail.com"
                    value={formData.cms_emails}
                    onChange={(e) => setFormData({ ...formData, cms_emails: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 outline-none focus:border-slate-800 font-mono text-slate-800"
                  />
                </div>

                {/* GA4 Link */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Link Google Analytics 4 (GA4)
                  </label>
                  <input
                    type="url"
                    placeholder="https://analytics.google.com/..."
                    value={formData.ga4_link}
                    onChange={(e) => setFormData({ ...formData, ga4_link: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 outline-none focus:border-slate-800 font-mono text-slate-800"
                  />
                </div>

                {/* GDS / Looker Studio Link */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Link Looker / Data Studio
                  </label>
                  <input
                    type="url"
                    placeholder="https://lookerstudio.google.com/..."
                    value={formData.gds_link}
                    onChange={(e) => setFormData({ ...formData, gds_link: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 outline-none focus:border-slate-800 font-mono text-slate-800"
                  />
                </div>

                {/* Google Email */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Akses Email Google
                  </label>
                  <input
                    type="email"
                    placeholder="mitra@gmail.com"
                    value={formData.google_email}
                    onChange={(e) => setFormData({ ...formData, google_email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 outline-none focus:border-slate-800 text-slate-800"
                  />
                </div>

                {/* Traktir Kopi Password with Random Gen */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Password Traktir Kopi
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          traktir_kopi_password: generateRandomPassword(8),
                        })
                      }
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 transition cursor-pointer"
                      title="Generate password Traktir Kopi acak"
                    >
                      <Dices className="w-3 h-3 text-emerald-600" />
                      <span>Acak</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Contoh: k9P2mLx"
                    value={formData.traktir_kopi_password}
                    onChange={(e) =>
                      setFormData({ ...formData, traktir_kopi_password: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 outline-none focus:border-slate-800 font-mono text-slate-800"
                  />
                </div>

                {/* PIC Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nama PIC (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Kontak Redaksi"
                    value={formData.pic_name}
                    onChange={(e) => setFormData({ ...formData, pic_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 outline-none focus:border-slate-800 text-slate-800"
                  />
                </div>

                {/* PIC Phone */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nomor WhatsApp PIC (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={formData.pic_phone}
                    onChange={(e) => setFormData({ ...formData, pic_phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 outline-none focus:border-slate-800 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-xl transition active:scale-[0.98] flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Menyimpan...' : 'Simpan ke Database'}</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Media Cards */}
          {loading ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-slate-700" />
              <p className="text-xs font-semibold">Menghubungkan ke Cloudflare D1...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mx-auto mb-3">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900">
                {searchQuery ? 'Tidak ada media yang cocok' : 'Direktori masih kosong'}
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? `Tidak ditemukan media dengan kata kunci "${searchQuery}". Coba periksa ejaan Anda.`
                  : 'Klik tombol "Tambah Media" di atas untuk menyimpan profil media pertama ke database.'}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Hapus Filter Pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMedia.map((media) => {
                const isExpanded = expandedCardId === media.id;
                const emails = Array.isArray(media.cms_emails) ? media.cms_emails : [];
                const hasCms = !!(media.cms_password || emails.length > 0);
                const hasGoogle = !!(media.ga4_link || media.gds_link || media.google_email);

                return (
                  <div
                    key={media.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-150 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Media Title & Quick Info */}
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                            {media.media_name}
                          </h3>

                          {/* Data Readiness Chips */}
                          <div className="flex items-center gap-1.5">
                            {hasCms && (
                              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                                CMS Ready
                              </span>
                            )}
                            {hasGoogle && (
                              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                                2G Ready
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                          {media.google_email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{media.google_email}</span>
                            </span>
                          )}

                          {emails.length > 0 && (
                            <span className="text-slate-600 font-medium">
                              - {emails.length} penulis terdaftar
                            </span>
                          )}

                          {media.pic_name && (
                            <span className="flex items-center gap-1 text-slate-700 font-medium">
                              <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{media.pic_name}</span>
                              {media.pic_phone && <span>({media.pic_phone})</span>}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => handleApply(media)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-lg transition active:scale-[0.98] shadow-xs cursor-pointer whitespace-nowrap"
                          title="Terapkan data media ini ke form generator"
                        >
                          <span>Pakai di Form</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(media)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition active:scale-[0.98] cursor-pointer"
                          title="Edit profil media"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(media.id, media.media_name)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition active:scale-[0.98] cursor-pointer"
                          title="Hapus media"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedCardId(isExpanded ? null : media.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition active:scale-[0.98] cursor-pointer"
                          title="Detail informasi"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Credential Details */}
                    {isExpanded && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl animate-in fade-in duration-100">
                        {/* Section 1: CMS Details */}
                        <div className="space-y-1.5">
                          <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                            Kredensial CMS Promedia
                          </p>
                          <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                            <span className="text-slate-600 font-medium">Password CMS:</span>
                            <div className="flex items-center gap-1.5 font-mono font-medium text-slate-900">
                              <span>{media.cms_password || '-'}</span>
                              {media.cms_password && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyToClipboard(media.cms_password, `cms_pass_${media.id}`)
                                  }
                                  className="text-slate-500 hover:text-slate-800 active:scale-[0.98] p-0.5"
                                  title="Salin password"
                                >
                                  {copiedField === `cms_pass_${media.id}` ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-600 truncate">
                            <span className="font-medium text-slate-700">Link: </span>
                            <span className="font-mono">{media.cms_link || '-'}</span>
                          </div>
                          {emails.length > 0 && (
                            <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/80 max-h-20 overflow-y-auto">
                              <span className="font-medium text-slate-700 block mb-0.5">
                                Email Penulis ({emails.length}):
                              </span>
                              {emails.map((e, idx) => (
                                <div key={idx} className="font-mono truncate">
                                  - {e}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Section 2: Google & Traktir Kopi Details */}
                        <div className="space-y-1.5">
                          <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                            Google Tools & Traktir Kopi
                          </p>
                          <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                            <span className="text-slate-600 font-medium">Password Kopi:</span>
                            <div className="flex items-center gap-1.5 font-mono font-medium text-slate-900">
                              <span>{media.traktir_kopi_password || '-'}</span>
                              {media.traktir_kopi_password && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyToClipboard(
                                      media.traktir_kopi_password,
                                      `tk_pass_${media.id}`
                                    )
                                  }
                                  className="text-slate-500 hover:text-slate-800 active:scale-[0.98] p-0.5"
                                  title="Salin password"
                                >
                                  {copiedField === `tk_pass_${media.id}` ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-600 truncate">
                            <span className="font-medium text-slate-700">GA4: </span>
                            {media.ga4_link ? (
                              <span className="font-mono text-emerald-700 font-medium">Tersedia</span>
                            ) : (
                              '-'
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            <span className="font-medium text-slate-700">Looker: </span>
                            {media.gds_link ? (
                              <span className="font-mono text-emerald-700">Tersedia</span>
                            ) : (
                              '-'
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">
            {filteredMedia.length} profil media tersimpan
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-200/80 rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
