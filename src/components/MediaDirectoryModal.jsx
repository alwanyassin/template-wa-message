import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
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
} from 'lucide-react';
import { fetchMediaDirectory, saveMediaProfile, deleteMediaProfile } from '../services/api';

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
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
      cms_emails: Array.isArray(media.cms_emails) ? media.cms_emails.join('\n') : (media.cms_emails || ''),
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
      traktir_kopi_username: formData.traktir_kopi_username.trim() || formData.google_email.trim(),
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
    if (confirm(`Yakin ingin menghapus media "${name}" dari direktori?`)) {
      await deleteMediaProfile(id);
      await loadMedia();
    }
  };

  const handleApply = (media) => {
    onApplyToForm(media);
    onClose();
  };

  // Filtered list
  const filteredMedia = mediaList.filter((m) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = (m.media_name || '').toLowerCase().includes(query);
    const emailMatch = (m.google_email || '').toLowerCase().includes(query);
    const picMatch = (m.pic_name || '').toLowerCase().includes(query);
    return nameMatch || emailMatch || picMatch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Modal */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                Direktori Media Bersama
                {isCloud ? (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                    <Cloud className="w-3 h-3 text-emerald-600" />
                    Cloudflare D1
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-200">
                    <Database className="w-3 h-3 text-amber-600" />
                    Offline / Local Cache
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                Pilih profil media mitra untuk mengisi form WhatsApp secara instan.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Search Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama media, email, atau PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadMedia}
              disabled={loading}
              className="p-2.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              title="Refresh dari Cloudflare D1"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Media</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Add / Edit Form Drawer */}
          {showAddForm && (
            <form
              onSubmit={handleSubmit}
              className="p-5 bg-slate-50 rounded-2xl border border-emerald-200 space-y-4 animate-in slide-in-from-top duration-200"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <h3 className="font-bold text-sm text-slate-800">
                  {editingId ? 'Edit Profil Media' : 'Tambah Media Baru ke Database D1'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nama Media / Website *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BeritaTerkini.com"
                    value={formData.media_name}
                    onChange={(e) => setFormData({ ...formData, media_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Password CMS Editor
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pass123!"
                    value={formData.cms_password}
                    onChange={(e) => setFormData({ ...formData, cms_password: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Link CMS Editor
                  </label>
                  <input
                    type="url"
                    placeholder="https://editor1.promediaindonesia.com"
                    value={formData.cms_link}
                    onChange={(e) => setFormData({ ...formData, cms_link: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Daftar Email Penulis CMS (pisahkan dengan baris baru / Enter)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="penulis1@gmail.com&#10;penulis2@gmail.com"
                    value={formData.cms_emails}
                    onChange={(e) => setFormData({ ...formData, cms_emails: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Link Google Analytics 4 (GA4)
                  </label>
                  <input
                    type="url"
                    placeholder="https://analytics.google.com/..."
                    value={formData.ga4_link}
                    onChange={(e) => setFormData({ ...formData, ga4_link: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Link Looker / Data Studio
                  </label>
                  <input
                    type="url"
                    placeholder="https://datastudio.google.com/..."
                    value={formData.gds_link}
                    onChange={(e) => setFormData({ ...formData, gds_link: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Akses Email Google
                  </label>
                  <input
                    type="email"
                    placeholder="mitra@gmail.com"
                    value={formData.google_email}
                    onChange={(e) => setFormData({ ...formData, google_email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Password Traktir Kopi
                  </label>
                  <input
                    type="text"
                    placeholder="Password Kopi"
                    value={formData.traktir_kopi_password}
                    onChange={(e) => setFormData({ ...formData, traktir_kopi_password: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nama PIC (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Kontak PIC"
                    value={formData.pic_name}
                    onChange={(e) => setFormData({ ...formData, pic_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nomor WhatsApp PIC (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={formData.pic_phone}
                    onChange={(e) => setFormData({ ...formData, pic_phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Menyimpan...' : 'Simpan ke Database'}</span>
                </button>
              </div>
            </form>
          )}

          {/* List Media Cards */}
          {loading ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
              <p className="text-xs">Memuat direktori dari database...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl p-6">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Belum ada media di direktori</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? 'Tidak ada media yang cocok dengan kata kunci pencarian.'
                  : 'Klik tombol "Tambah Media" di atas untuk menyimpan profil media pertama Anda.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {filteredMedia.map((media) => {
                const isExpanded = expandedCardId === media.id;
                const emailCount = Array.isArray(media.cms_emails) ? media.cms_emails.length : 0;

                return (
                  <div
                    key={media.id}
                    className="p-4.5 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {media.media_name}
                          </h4>
                          {media.pic_name && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              PIC: {media.pic_name}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                          {media.google_email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              {media.google_email}
                            </span>
                          )}
                          {emailCount > 0 && (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-[11px]">
                              {emailCount} email penulis
                            </span>
                          )}
                          {media.cms_link && (
                            <span className="font-mono text-[11px] text-slate-400 truncate max-w-[200px]">
                              {media.cms_link.replace('https://', '')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleApply(media)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition cursor-pointer"
                          title="Gunakan data media ini di form aktif"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Pakai di Form</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(media)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Edit media"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(media.id, media.media_name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Hapus media"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedCardId(isExpanded ? null : media.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Detail informasi"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Detail */}
                    {isExpanded && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/60 p-3 rounded-xl">
                        <div>
                          <p className="font-semibold text-slate-800 mb-0.5">Akses CMS:</p>
                          <p>Password: <code className="bg-slate-200/70 px-1 py-0.5 rounded font-mono">{media.cms_password || '-'}</code></p>
                          <p className="truncate">Link: {media.cms_link || '-'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 mb-0.5">Akses Google & Tools:</p>
                          <p className="truncate">GA4: {media.ga4_link ? 'Tersedia' : '-'}</p>
                          <p className="truncate">Looker Studio: {media.gds_link ? 'Tersedia' : '-'}</p>
                          <p>Pass Kopi: <code className="bg-slate-200/70 px-1 py-0.5 rounded font-mono">{media.traktir_kopi_password || '-'}</code></p>
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
          <span>{filteredMedia.length} profil media tersimpan</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
