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
  RefreshCw,
  Cloud,
  Database,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';
import { fetchHistoryLogs, deleteHistoryEntry, clearAllHistoryLogs } from '../services/api';

export default function HistoryModal({ isOpen, onClose }) {
  const [historyList, setHistoryList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'promedia' | 'access2g' | 'send_wa' | 'copy'
  const [loading, setLoading] = useState(false);
  const [isCloud, setIsCloud] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    if (confirm('Yakin ingin membersihkan seluruh riwayat pesan?')) {
      await clearAllHistoryLogs();
      await loadHistory();
    }
  };

  // Format date helper with relative friendly formatting
  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const timeStr = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (isToday) {
      return `Hari ini, ${timeStr}`;
    }

    return `${date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    })}, ${timeStr}`;
  };

  // Filter list by search query and type
  const filteredList = historyList.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const mediaMatch = (item.media_name || '').toLowerCase().includes(q);
    const textMatch = (item.message_text || '').toLowerCase().includes(q);
    const phoneMatch = (item.phone_number || '').includes(q);
    const matchesSearch = !q || mediaMatch || textMatch || phoneMatch;

    if (!matchesSearch) return false;

    if (filterType === 'promedia') return item.template_type === 'promedia';
    if (filterType === 'access2g') return item.template_type === 'access2g';
    if (filterType === 'send_wa') return item.action === 'send_wa';
    if (filterType === 'copy') return item.action === 'copy';

    return true;
  });

  const filterTabs = [
    { id: 'all', label: 'Semua' },
    { id: 'promedia', label: 'CMS Promedia' },
    { id: 'access2g', label: 'Google Tools 2G' },
    { id: 'send_wa', label: 'Kirim WA' },
    { id: 'copy', label: 'Disalin' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-opacity">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/90 overflow-hidden ring-1 ring-black/5">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Riwayat Pesan Tim
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
                Log pesan WhatsApp yang pernah disalin atau dikirim oleh tim.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={loadHistory}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Refresh riwayat"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-slate-800' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 space-y-2.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari dalam pesan atau nama media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-200/90 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {filterTabs.map((tab) => {
              const isActive = filterType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterType(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {loading ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-slate-700" />
              <p className="text-xs font-medium">Memuat riwayat pesan...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900">
                {searchQuery || filterType !== 'all'
                  ? 'Tidak ada riwayat yang cocok'
                  : 'Belum ada riwayat pesan'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {searchQuery || filterType !== 'all'
                  ? 'Coba sesuaikan filter atau kata kunci pencarian Anda.'
                  : 'Setiap kali Anda menyalin pesan atau membuka WhatsApp dari aplikasi ini, riwayatnya akan otomatis tercatat di sini.'}
              </p>
            </div>
          ) : (
            filteredList.map((item) => {
              const isCopied = copiedId === item.id;
              const isPromedia = item.template_type === 'promedia';
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-150 space-y-2.5"
                >
                  {/* Item Header */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                        {item.media_name}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          isPromedia
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}
                      >
                        {isPromedia ? 'CMS Promedia' : 'Google Tools 2G'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-medium">
                        {formatDate(item.created_at)}
                      </span>

                      {item.action === 'send_wa' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          <Send className="w-2.5 h-2.5" />
                          <span>Kirim WA {item.phone_number ? `(${item.phone_number})` : ''}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/70">
                          <Copy className="w-2.5 h-2.5" />
                          <span>Disalin</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Snippet Box */}
                  <div className="relative group/box">
                    <div
                      className={`p-3 bg-slate-50/80 rounded-xl font-mono text-xs text-slate-700 whitespace-pre-wrap border border-slate-200/70 transition-all ${
                        isExpanded ? 'max-h-none' : 'max-h-24 overflow-hidden'
                      }`}
                    >
                      {item.message_text}
                    </div>

                    {/* Gradient Fade if not expanded */}
                    {!isExpanded && (
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none rounded-b-xl"></div>
                    )}
                  </div>

                  {/* Item Actions */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 transition"
                    >
                      <span>{isExpanded ? 'Perpendek teks' : 'Lihat selengkapnya'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(item)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition active:scale-[0.98] cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                        }`}
                        title="Salin isi pesan ini ke clipboard"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Tersalin' : 'Salin Ulang'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendWA(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-lg transition active:scale-[0.98] cursor-pointer"
                        title="Buka langsung di WhatsApp"
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
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <span>
            <strong className="font-semibold text-slate-700">{filteredList.length}</strong>{' '}
            pesan tercatat
          </span>

          <div className="flex items-center gap-2">
            {historyList.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3 py-1.5 font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              >
                Hapus Semua Riwayat
              </button>
            )}

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
    </div>
  );
}
