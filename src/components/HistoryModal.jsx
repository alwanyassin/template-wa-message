import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Trash2,
  Copy,
  Check,
  Send,
  Search,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Cloud,
  Database,
  ExternalLink,
} from 'lucide-react';
import { fetchHistoryLogs, deleteHistoryEntry, clearAllHistoryLogs } from '../services/api';

export default function HistoryModal({ isOpen, onClose }) {
  const [historyList, setHistoryList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCloud, setIsCloud] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoading(true);
    const res = await fetchHistoryLogs();
    setHistoryList(res.data || []);
    setIsCloud(res.isCloud);
    setLoading(false);
  };

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.message_text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendWA = (item) => {
    let url = '';
    const cleanPhone = (item.phone_number || '').replace(/[^0-9]/g, '');
    if (cleanPhone) {
      let formattedPhone = cleanPhone;
      if (formattedPhone.startsWith('0')) formattedPhone = '62' + formattedPhone.slice(1);
      else if (formattedPhone.startsWith('8')) formattedPhone = '62' + formattedPhone;
      url = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(item.message_text)}`;
    } else {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(item.message_text)}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async (id) => {
    await deleteHistoryEntry(id);
    await loadHistory();
  };

  const handleClearAll = async () => {
    if (confirm('Yakin ingin menghapus semua riwayat pesan?')) {
      await clearAllHistoryLogs();
      await loadHistory();
    }
  };

  // Format date helper
  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredList = historyList.filter((item) => {
    const q = searchQuery.toLowerCase();
    const mediaMatch = (item.media_name || '').toLowerCase().includes(q);
    const textMatch = (item.message_text || '').toLowerCase().includes(q);
    const phoneMatch = (item.phone_number || '').includes(q);
    return mediaMatch || textMatch || phoneMatch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                Riwayat Pesan Tim
                {isCloud ? (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                    <Cloud className="w-3 h-3 text-emerald-600" />
                    Cloudflare D1
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-200">
                    <Database className="w-3 h-3 text-amber-600" />
                    Offline / Local
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                Daftar pesan WhatsApp yang telah disalin atau dikirim oleh tim.
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

        {/* Search & Actions Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari dalam riwayat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadHistory}
              disabled={loading}
              className="p-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              title="Refresh Riwayat"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {historyList.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-xl transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bersihkan</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {loading ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
              <p className="text-xs">Memuat riwayat pesan...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl p-6">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Belum ada riwayat pesan</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Setiap kali Anda menekan tombol "Salin Pesan" atau "Buka di WhatsApp", pesan akan otomatis tercatat di sini.
              </p>
            </div>
          ) : (
            filteredList.map((item) => {
              const isCopied = copiedId === item.id;
              const isPromedia = item.template_type === 'promedia';

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.media_name}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isPromedia
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {isPromedia ? 'CMS Promedia' : 'Google Tools 2G'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{formatDate(item.created_at)}</span>
                      {item.action === 'send_wa' ? (
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Send className="w-2.5 h-2.5" /> WA {item.phone_number ? `(${item.phone_number})` : ''}
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Copy className="w-2.5 h-2.5" /> Disalin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Preview Text */}
                  <div className="p-3 bg-slate-50/90 rounded-xl font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-28 overflow-y-auto border border-slate-100">
                    {item.message_text}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(item)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Tersalin!' : 'Salin Ulang'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendWA(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kirim ke WA</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Hapus riwayat ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <span>{filteredList.length} riwayat tercatat</span>
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
